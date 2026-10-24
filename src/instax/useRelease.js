import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

// Share of the reveal spent pulling the print out of the slot. The rest
// carries the camera away and lifts the print to fill the screen.
const PULL_SHARE = 0.55;
const PEEK_PX = 7;
// While the camera rests, the print edges out a little now and then to
// show it can be pulled.
const NUDGE_PX = 9;
const NUDGE_MS = 900;
const NUDGE_EVERY_MS = 4200;
const PRINT_TO_SLOT = 0.94;
const SCREEN_GAP = 16;
const OUT_AT = 0.995;
const LIFT_TILT_DEG = 4;
const PERSPECTIVE_PX = 1800;
const CAMERA_RECEDE = 0.9;

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const lerp = (from, to, t) => from + (to - from) * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function smoothstep(from, to, value) {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}

export function useRelease({ enabled, reduceMotion, resetKey, slot, progressRef }) {
  const anchorRef = useRef(null);
  const cameraRef = useRef(null);
  const printRef = useRef(null);
  const scrollRef = useRef(null);
  const developRef = useRef(null);
  const frameRef = useRef(0);
  const nudgeRef = useRef(0);

  const update = useCallback(() => {
    frameRef.current = 0;
    const anchor = anchorRef.current;
    const camera = cameraRef.current;
    const print = printRef.current;
    if (!anchor || !camera) return;

    const p = enabled ? clamp01(progressRef.current) : 0;
    if (!print) {
      camera.style.transform = '';
      camera.style.opacity = '';
      return;
    }

    const out = p >= OUT_AT;
    print.dataset.out = String(out);
    camera.dataset.away = String(out);

    if (reduceMotion) {
      const shown = smoothstep(0.2, 0.8, p);
      camera.style.transform = '';
      camera.style.opacity = String(1 - shown);
      print.style.transform = '';
      print.style.clipPath = shown > 0 ? 'none' : 'inset(0 0 100% 0)';
      print.style.opacity = String(shown);
      if (developRef.current) developRef.current.style.opacity = '0';
      return;
    }

    const vh = window.innerHeight;
    const cam = anchor.getBoundingClientRect();
    const slotX = cam.left + cam.width * slot.x;
    const slotY = cam.top + cam.height * slot.y;

    // The print is laid out at its full-screen size; every earlier pose is
    // a uniform scale of it, so its text never stretches.
    const finalLeft = print.offsetLeft;
    const finalTop = print.offsetTop;
    const finalW = print.offsetWidth;
    const smallW = cam.width * slot.w * PRINT_TO_SLOT;
    const startScale = smallW / finalW;
    const smallH = print.offsetHeight * startScale;

    const pulled = clamp01(p / PULL_SHARE);
    const lifted = easeInOut(clamp01((p - PULL_SHARE) / (1 - PULL_SHARE)));

    const liftMax = Math.max(0, slotY + smallH + SCREEN_GAP - vh);
    const lift = liftMax * pulled;
    const cameraY = -lift - lifted * (cam.bottom - lift + SCREEN_GAP);

    const peek = PEEK_PX + (p === 0 ? nudgeRef.current : 0);
    const pullY = slotY - lift - (smallH - peek) * (1 - pulled);
    const x = lerp(slotX - smallW / 2, finalLeft, lifted);
    const y = lerp(pullY, finalTop, lifted);
    const scale = lerp(startScale, 1, lifted);
    const hidden = Math.max(0, (slotY + cameraY - y) / scale);
    // Mid-lift the print tips its lower edge toward the viewer and the
    // camera falls back, so the hand-off reads as depth, not a slide.
    const tilt = LIFT_TILT_DEG * Math.sin(Math.PI * lifted);
    const recede = lerp(1, CAMERA_RECEDE, lifted);

    camera.style.opacity = '';
    camera.style.transform = `translate3d(0, ${cameraY.toFixed(2)}px, 0) scale(${recede.toFixed(4)})`;
    print.style.opacity = '';
    print.style.transform = `translate3d(${(x - finalLeft).toFixed(2)}px, ${(y - finalTop).toFixed(2)}px, 0) scale(${scale.toFixed(4)}) translateX(${finalW / 2}px) perspective(${PERSPECTIVE_PX}px) rotateX(${tilt.toFixed(3)}deg) translateX(${-finalW / 2}px)`;
    print.style.clipPath = hidden > 0 ? `inset(${hidden.toFixed(2)}px 0 0 0)` : 'none';
    const shadow = print.firstElementChild;
    if (shadow) shadow.style.opacity = lifted.toFixed(3);
    if (developRef.current) {
      developRef.current.style.opacity = String(1 - smoothstep(0.08, 0.92, p));
    }
  }, [enabled, progressRef, reduceMotion, slot]);

  const schedule = useCallback(() => {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(update);
  }, [update]);

  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    update();
  }, [update, resetKey]);

  useEffect(() => {
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [schedule]);

  useEffect(() => {
    if (!enabled || reduceMotion) return undefined;
    let raf = 0;
    const nudge = () => {
      if (progressRef.current > 0 || document.hidden) return;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / NUDGE_MS);
        nudgeRef.current = NUDGE_PX * Math.sin(Math.PI * t) ** 2;
        update();
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const timer = window.setInterval(nudge, NUDGE_EVERY_MS);
    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(raf);
      nudgeRef.current = 0;
    };
  }, [enabled, progressRef, reduceMotion, update]);

  return { anchorRef, cameraRef, printRef, scrollRef, developRef, schedule };
}
