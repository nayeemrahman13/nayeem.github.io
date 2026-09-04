import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FILM_SPRING, prefersReducedMotion, project, rubberband } from './motion';

const DRAG_THRESHOLD = 4;

// The film moves in pixels, not frames, so the strip has to know how wide one
// frame actually is on screen. Measuring beats hardcoding because the frame
// size is clamped against the viewport in CSS.
function measurePitch(track) {
  const frames = track?.children;
  if (!frames || frames.length < 2) {
    return frames?.[0]?.getBoundingClientRect().width ?? 1;
  }
  return frames[1].getBoundingClientRect().left - frames[0].getBoundingClientRect().left;
}

export function useFilmStrip({ count, index, onIndexChange }) {
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const springRef = useRef(0);
  const offsetRef = useRef(0);
  const pitchRef = useRef(1);
  const didDragRef = useRef(false);

  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [pitch, setPitch] = useState(1);

  const setOffsetNow = useCallback((value) => {
    offsetRef.current = value;
    setOffset(value);
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const sync = () => {
      const next = measurePitch(track) || 1;
      pitchRef.current = next;
      setPitch(next);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    return () => observer.disconnect();
  }, [count]);

  // Rest position: the selected frame sits in the gate.
  const restOffset = useCallback((i) => -i * pitchRef.current, []);

  const settleTo = useCallback(
    (nextIndex, velocity = 0) => {
      const clamped = Math.max(0, Math.min(count - 1, nextIndex));
      const target = restOffset(clamped);
      if (clamped !== index) onIndexChange(clamped);

      cancelAnimationFrame(springRef.current);
      if (prefersReducedMotion()) {
        setOffsetNow(target);
        return;
      }

      let pos = offsetRef.current;
      let vel = velocity * 0.3;
      let last = performance.now();

      const step = (now) => {
        const dt = Math.min(0.032, (now - last) / 1000);
        last = now;
        vel += ((target - pos) * FILM_SPRING.stiffness - vel * FILM_SPRING.damping) * dt;
        pos += vel * dt;
        if (Math.abs(target - pos) < 0.3 && Math.abs(vel) < 2) {
          setOffsetNow(target);
          return;
        }
        setOffsetNow(pos);
        springRef.current = requestAnimationFrame(step);
      };
      springRef.current = requestAnimationFrame(step);
    },
    [count, index, onIndexChange, restOffset, setOffsetNow],
  );

  // Follow the selection when the ring changes section or a frame is clicked.
  useEffect(() => {
    if (dragRef.current) return;
    settleTo(index);
    // Only react to the index itself; settleTo changes every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, pitch]);

  const onPointerDown = useCallback((event) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    const track = trackRef.current;
    if (!track) return;
    cancelAnimationFrame(springRef.current);
    didDragRef.current = false;
    track.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      originX: event.clientX,
      startOffset: offsetRef.current,
      samples: [{ t: performance.now(), x: event.clientX }],
      velocity: 0,
    };
    setDragging(true);
  }, []);

  const onPointerMove = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.originX;
      if (Math.abs(dx) > DRAG_THRESHOLD) didDragRef.current = true;

      const min = restOffset(count - 1);
      const max = restOffset(0);
      setOffsetNow(rubberband(drag.startOffset + dx, min, max));

      const now = performance.now();
      drag.samples.push({ t: now, x: event.clientX });
      if (drag.samples.length > 5) drag.samples.shift();
      const first = drag.samples[0];
      const dt = now - first.t;
      if (dt > 8) drag.velocity = ((event.clientX - first.x) / dt) * 1000;
    },
    [count, restOffset, setOffsetNow],
  );

  const finishDrag = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag || (event && event.pointerId !== drag.pointerId)) return;
      const velocity = drag.velocity;
      dragRef.current = null;
      setDragging(false);
      const projected = offsetRef.current + project(velocity) * 0.5;
      settleTo(Math.round(-projected / pitchRef.current), velocity);
    },
    [settleTo],
  );

  const step = useCallback(
    (delta) => settleTo(index + delta),
    [index, settleTo],
  );

  useEffect(() => () => cancelAnimationFrame(springRef.current), []);

  return {
    trackRef,
    offset,
    dragging,
    didDragRef,
    step,
    selectFrame: (i) => settleTo(i),
    filmProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
    },
  };
}
