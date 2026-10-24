import { useCallback, useEffect, useRef } from 'react';
import { applyDelta, createGesture, frame, play } from './printGesture';

function scrollRoom(element, phase) {
  if (!element || phase !== 'out') return { canDown: false, canUp: false };
  return {
    canDown: element.scrollHeight - element.clientHeight - element.scrollTop > 1,
    canUp: element.scrollTop > 1,
  };
}

export function usePrintGesture({ enabled, reduceMotion, scrollRef, progressRef, onProgress }) {
  const stateRef = useRef(createGesture());
  const onProgressRef = useRef(onProgress);
  const reduceRef = useRef(reduceMotion);
  const enabledRef = useRef(enabled);
  const rafRef = useRef(0);
  onProgressRef.current = onProgress;
  reduceRef.current = reduceMotion;
  enabledRef.current = enabled;

  const commit = useCallback((next) => {
    stateRef.current = next;
    progressRef.current = next.progress;
    onProgressRef.current?.();
  }, [progressRef]);

  const pump = useCallback(() => {
    if (rafRef.current) return;
    const tick = (now) => {
      const next = frame(stateRef.current, now);
      const moving = next.phase === 'revealing' || next.phase === 'retracting';
      commit(next);
      rafRef.current = moving ? requestAnimationFrame(tick) : 0;
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [commit]);

  const send = useCallback((input) => {
    const now = performance.now();
    const framed = frame(stateRef.current, now);
    const room = scrollRoom(scrollRef.current, framed.phase);
    const result = applyDelta(framed, {
      ...input,
      ...room,
      now,
      reduceMotion: reduceRef.current,
      enabled: enabledRef.current,
    });
    commit(result.state);
    if (result.state.phase === 'revealing' || result.state.phase === 'retracting') pump();
    return result.consumed;
  }, [commit, pump, scrollRef]);

  const reveal = useCallback(() => {
    const now = performance.now();
    commit(play(frame(stateRef.current, now), 1, now, reduceRef.current));
    pump();
  }, [commit, pump]);

  const retract = useCallback(() => {
    const now = performance.now();
    commit(play(frame(stateRef.current, now), 0, now, reduceRef.current));
    pump();
  }, [commit, pump]);

  const snap = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    commit(createGesture());
  }, [commit]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  useEffect(() => {
    if (!enabled) return undefined;
    const onWheel = (event) => {
      if (event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const discrete = event.deltaMode !== 0;
      const dy = discrete ? Math.sign(event.deltaY) * 100 : event.deltaY;
      if (!dy) return;
      const consumed = send({ dy, discrete });
      if (consumed === 'text' && scrollRef.current) scrollRef.current.scrollTop += dy;
      event.preventDefault();
    };
    let touchY = null;
    let touchSlop = 0;
    const onTouchStart = (event) => {
      if (event.touches.length !== 1 || event.target.closest('.lens')) {
        touchY = null;
        return;
      }
      touchY = event.touches[0].clientY;
      touchSlop = 0;
    };
    const onTouchMove = (event) => {
      if (touchY == null || event.touches.length !== 1) return;
      const y = event.touches[0].clientY;
      const step = touchY - y;
      touchY = y;
      if (!step) return;
      // A finger that slips a few pixels is still a tap. Claiming it here
      // cancels the click on the shutter, the print, and Back.
      let dy = step;
      if (touchSlop !== null) {
        touchSlop += step;
        if (Math.abs(touchSlop) < 10) return;
        dy = touchSlop;
        touchSlop = null;
      }
      const consumed = send({ dy, discrete: false });
      if (consumed === 'text' && scrollRef.current) scrollRef.current.scrollTop += dy;
      event.preventDefault();
    };
    const onTouchEnd = () => {
      touchY = null;
      touchSlop = 0;
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [enabled, scrollRef, send]);

  return { reveal, retract, snap };
}
