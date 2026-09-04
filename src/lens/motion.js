import { useCallback, useEffect, useRef, useState } from 'react';

// Shared physics for every moving part of the instrument. The ring, the
// shutter, and the film all read from here so they decelerate alike.
export const RING_SPRING = { stiffness: 38, damping: 11 };
export const SHUTTER_SPRING = { stiffness: 260, damping: 30 };
export const FILM_SPRING = { stiffness: 90, damping: 17 };

const RUBBER_RANGE = 56;

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return reduce;
}

// Resistance past a limit, so dragging never simply stops dead.
export function rubberband(value, min, max, range = RUBBER_RANGE) {
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

// Where a flick would coast to, matching the iOS deceleration curve.
export function project(velocity, decelerationRate = 0.995) {
  return (velocity / 1000) * (decelerationRate / (1 - decelerationRate));
}

// A spring that keeps its own velocity between targets. Retargeting
// mid-flight carries that velocity over, so an interrupted shutter reverses
// from wherever it actually is instead of snapping and restarting.
export function useSpring(initial, { stiffness, damping, epsilon = 0.0015 } = {}) {
  const [value, setValue] = useState(initial);
  const state = useRef({ pos: initial, vel: 0, target: initial, frame: 0, last: 0 });

  // Clearing the id matters as much as cancelling the frame: setTarget skips
  // starting a loop when one is already running, so a stale id left behind by
  // a cancel would wedge the spring shut for good.
  const stop = useCallback(() => {
    cancelAnimationFrame(state.current.frame);
    state.current.frame = 0;
  }, []);

  const jumpTo = useCallback(
    (next) => {
      stop();
      state.current.pos = next;
      state.current.vel = 0;
      state.current.target = next;
      setValue(next);
    },
    [stop],
  );

  const setTarget = useCallback(
    (next) => {
      const s = state.current;
      s.target = next;
      if (s.frame) return;
      s.last = performance.now();

      const step = (now) => {
        const dt = Math.min(0.032, (now - s.last) / 1000);
        s.last = now;
        s.vel += ((s.target - s.pos) * stiffness - s.vel * damping) * dt;
        s.pos += s.vel * dt;

        if (Math.abs(s.target - s.pos) < epsilon && Math.abs(s.vel) < epsilon * 20) {
          s.pos = s.target;
          s.vel = 0;
          s.frame = 0;
          setValue(s.target);
          return;
        }
        setValue(s.pos);
        s.frame = requestAnimationFrame(step);
      };

      s.frame = requestAnimationFrame(step);
    },
    [stiffness, damping, epsilon],
  );

  useEffect(
    () => () => {
      cancelAnimationFrame(state.current.frame);
      state.current.frame = 0;
    },
    [],
  );

  return [value, setTarget, jumpTo, stop];
}
