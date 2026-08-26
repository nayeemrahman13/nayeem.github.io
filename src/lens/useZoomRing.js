import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  MIN_ROTATION,
  MAX_ROTATION,
  STOPS,
  nearestStop,
  rotationForStop,
  stopFromHash,
  stopIndex,
} from './stops';

const RUBBER_RANGE = 56;
const WHEEL_IDLE_MS = 90;
const SPRING_STIFFNESS = 38;
const SPRING_DAMPING = 11;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function rubberband(value, min, max, range = RUBBER_RANGE) {
  if (value < min) {
    const overshoot = min - value;
    return min - (overshoot * range * 0.55) / (range + 0.55 * overshoot);
  }
  if (value > max) {
    const overshoot = value - max;
    return max + (overshoot * range * 0.55) / (range + 0.55 * overshoot);
  }
  return value;
}

function unwrapDelta(delta) {
  let value = delta;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function angleFromPointer(event, element) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - (rect.left + rect.width / 2);
  const y = event.clientY - (rect.top + rect.height / 2);
  return Math.atan2(y, x) * (180 / Math.PI);
}

function project(velocity, decelerationRate = 0.995) {
  return (velocity / 1000) * (decelerationRate / (1 - decelerationRate));
}

function syncHash(stop) {
  const next = stop.hash || window.location.pathname + window.location.search;
  const current = stop.hash
    ? `${window.location.pathname}${window.location.search}${stop.hash}`
    : window.location.pathname + window.location.search;
  const now = window.location.pathname + window.location.search + window.location.hash;
  if (now === current) return;
  window.history.replaceState(null, '', next);
}

export function useZoomRing() {
  const lensRef = useRef(null);
  const dragRef = useRef(null);
  const springRef = useRef(null);
  const wheelTimer = useRef(null);
  const rotationRef = useRef(rotationForStop(STOPS[0]));
  const skipHash = useRef(false);
  const didDragRef = useRef(false);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [rotation, setRotation] = useState(() => rotationForStop(STOPS[0]));
  const [activeStop, setActiveStop] = useState(STOPS[0]);
  const [dragging, setDragging] = useState(false);

  const setRotationNow = useCallback((value) => {
    rotationRef.current = value;
    setRotation(value);
  }, []);

  const commitStop = useCallback(
    (stop, { snap = true } = {}) => {
      const target = rotationForStop(stop);
      setActiveStop(stop);
      skipHash.current = true;
      syncHash(stop);
      queueMicrotask(() => {
        skipHash.current = false;
      });

      if (!snap || prefersReducedMotion()) {
        cancelAnimationFrame(springRef.current);
        setRotationNow(target);
        return;
      }

      let pos = rotationRef.current;
      let vel = (dragRef.current?.velocity ?? 0) * 0.35;
      let last = performance.now();
      cancelAnimationFrame(springRef.current);

      const step = (now) => {
        const dt = Math.min(0.032, (now - last) / 1000);
        last = now;
        vel += ((target - pos) * SPRING_STIFFNESS - vel * SPRING_DAMPING) * dt;
        pos += vel * dt;
        if (Math.abs(target - pos) < 0.08 && Math.abs(vel) < 0.5) {
          setRotationNow(target);
          return;
        }
        setRotationNow(pos);
        springRef.current = requestAnimationFrame(step);
      };

      springRef.current = requestAnimationFrame(step);
    },
    [setRotationNow],
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const applyHash = () => {
      if (skipHash.current) {
        skipHash.current = false;
        return;
      }
      const stop = stopFromHash(window.location.hash);
      commitStop(stop, { snap: false });
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [commitStop]);

  const onPointerDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      const lens = lensRef.current;
      if (!lens) return;
      cancelAnimationFrame(springRef.current);
      didDragRef.current = false;
      lens.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        origin: angleFromPointer(event, lens),
        startRotation: rotationRef.current,
        samples: [{ t: performance.now(), angle: angleFromPointer(event, lens) }],
        velocity: 0,
      };
      setDragging(true);
    },
    [],
  );

  const onPointerMove = useCallback((event) => {
    const drag = dragRef.current;
    const lens = lensRef.current;
    if (!drag || !lens || event.pointerId !== drag.pointerId) return;
    const angle = angleFromPointer(event, lens);
    const next = rubberband(
      drag.startRotation + unwrapDelta(angle - drag.origin),
      MIN_ROTATION,
      MAX_ROTATION,
    );
    const now = performance.now();
    drag.samples.push({ t: now, angle });
    if (drag.samples.length > 5) drag.samples.shift();
    const first = drag.samples[0];
    const dt = now - first.t;
    if (Math.abs(unwrapDelta(angle - drag.origin)) > 2.5) {
      didDragRef.current = true;
    }
    if (dt > 8) {
      drag.velocity = (unwrapDelta(angle - first.angle) / dt) * 1000;
    }
    setRotationNow(next);
  }, [setRotationNow]);

  const finishDrag = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag || (event && event.pointerId !== drag.pointerId)) return;
      const projected = rotationRef.current + project(drag.velocity);
      const stop = nearestStop(rubberband(projected, MIN_ROTATION, MAX_ROTATION));
      dragRef.current = { ...drag, velocity: drag.velocity };
      setDragging(false);
      commitStop(stop);
      dragRef.current = null;
    },
    [commitStop],
  );

  const onWheel = useCallback(
    (event) => {
      if (event.target.closest('.viewfinder')) return;
      event.preventDefault();
      cancelAnimationFrame(springRef.current);
      const next = rubberband(
        rotationRef.current - event.deltaY * 0.12,
        MIN_ROTATION,
        MAX_ROTATION,
      );
      setRotationNow(next);
      window.clearTimeout(wheelTimer.current);
      wheelTimer.current = window.setTimeout(() => {
        commitStop(nearestStop(rotationRef.current));
      }, WHEEL_IDLE_MS);
    },
    [commitStop, setRotationNow],
  );

  const onKeyDown = useCallback(
    (event) => {
      const index = stopIndex(activeStop);
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        commitStop(STOPS[Math.min(STOPS.length - 1, index + 1)]);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        commitStop(STOPS[Math.max(0, index - 1)]);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        commitStop(STOPS[0]);
      }
      if (event.key === 'End') {
        event.preventDefault();
        commitStop(STOPS[STOPS.length - 1]);
      }
    },
    [activeStop, commitStop],
  );

  useLayoutEffect(() => {
    const el = lensRef.current;
    if (!el) return undefined;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  useEffect(() => () => {
    cancelAnimationFrame(springRef.current);
    window.clearTimeout(wheelTimer.current);
  }, []);

  const liveStop = dragging ? nearestStop(rotation) : activeStop;

  return {
    lensRef,
    rotation,
    activeStop,
    liveStop,
    dragging,
    didDragRef,
    reduceMotion,
    selectStop: commitStop,
    lensProps: {
      tabIndex: 0,
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onKeyDown,
    },
  };
}
