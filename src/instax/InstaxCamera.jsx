import { useCallback, useEffect, useRef, useState } from 'react';
import Lens from '../lens/Lens';
import { STOPS, stopIndex } from '../lens/stops';
import { useZoomRing } from '../lens/useZoomRing';
import { CAMERA_VARS } from './body';
import InstaxBody from './InstaxBody';
import Print from './Print';
import { useRelease } from './useRelease';

export default function InstaxCamera() {
  const ring = useZoomRing();
  const { activeStop, reduceMotion, selectStop } = ring;
  const hasPrint = activeStop.id !== 'rest';
  const { trackRef, anchorRef, cameraRef, printRef, scrollRef, developRef, release, retract } = useRelease({
    enabled: hasPrint,
    reduceMotion,
    resetKey: activeStop.id,
  });
  const [flashKey, setFlashKey] = useState(0);
  const releaseAfterTurn = useRef(false);

  // A new topic means a new print, so the old one goes back in.
  useEffect(() => {
    if (releaseAfterTurn.current) {
      releaseAfterTurn.current = false;
      release();
      return;
    }
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [activeStop.id, release, reduceMotion]);

  const putBack = useCallback(() => {
    if (printRef.current?.contains(document.activeElement)) {
      ring.lensRef.current?.focus({ preventScroll: true });
    }
    retract();
  }, [printRef, retract, ring.lensRef]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && printRef.current?.dataset.out === 'true') putBack();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [printRef, putBack]);

  const shoot = () => {
    if (!reduceMotion) {
      setFlashKey((key) => key + 1);
      cameraRef.current?.querySelector('.flash-window')?.animate(
        [{ fill: '#fffdf6' }, { fill: '#B9B4A4' }],
        { duration: 420, easing: 'ease-out' },
      );
    }
    if (!hasPrint) {
      releaseAfterTurn.current = true;
      selectStop(STOPS[1]);
      return;
    }
    release();
  };

  const pullOnTap = () => {
    if (printRef.current?.dataset.out !== 'true') release();
  };

  return (
    <div className="instax" data-print={hasPrint}>
      <a className="skip-link" href="#stop-about">
        Skip to topics
      </a>
      <nav className="sr-only" aria-label="Topics">
        {STOPS.filter((stop) => stop.hash).map((stop) => (
          <a key={stop.id} href={stop.hash}>
            {stop.label}
          </a>
        ))}
      </nav>

      <section className="release-track" ref={trackRef}>
        <div className="release-stage">
          <div className="camera-anchor" ref={anchorRef} style={CAMERA_VARS}>
            <div className="camera" ref={cameraRef}>
              <InstaxBody counter={stopIndex(activeStop) + 1} />
              <Lens ring={ring} onOpen={shoot} />
              <button type="button" className="shutter" aria-label="Take the picture" onClick={shoot} />
            </div>
          </div>
          <Print
            stop={activeStop}
            printRef={printRef}
            scrollRef={scrollRef}
            developRef={developRef}
            onFocus={pullOnTap}
            onClick={pullOnTap}
            onBack={putBack}
          />
        </div>
      </section>

      {flashKey > 0 ? <div key={flashKey} className="flash-burst" aria-hidden="true" /> : null}
    </div>
  );
}
