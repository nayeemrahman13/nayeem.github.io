import { useCallback, useEffect, useRef, useState } from 'react';
import Barrel from './Barrel';
import FilmStrip from './FilmStrip';
import IndexMark from './IndexMark';
import Viewfinder from './Viewfinder';
import { framesForStop } from './content';
import { CSS_VARS, polar } from './geometry';
import { SHUTTER_SPRING, useSpring } from './motion';
import { STOPS } from './stops';
import { useZoomRing } from './useZoomRing';

const ELEVENLABS_AGENT = 'agent_6401k1bc5tp8f3rsfjng67q7f88t';
const BLADE_COUNT = 8;
// The aperture is the hole, not the blades: an opaque ring with a polygonal
// opening punched through it. Swinging eight separate leaves looks convincing
// only if they never cross the opening, which is fiddly and fragile; growing
// the hole gives an exact edge at every value and cannot smear the card.
const IRIS_OUTER = 53;
const IRIS_MIN_HOLE = 1.5;
const IRIS_MAX_HOLE = 47;
// Real diaphragms rotate as they travel, so the opening twists shut.
const IRIS_TWIST = 20;
const BLADE_SWEEP = 26;
// A press shorter than this is read as a tap, which latches the shutter open
// so the revealed card can actually be clicked.
const TAP_MS = 220;

function irisHole(aperture) {
  return IRIS_MIN_HOLE + aperture * (IRIS_MAX_HOLE - IRIS_MIN_HOLE);
}

function Iris({ aperture }) {
  const hole = irisHole(aperture);
  const twist = -IRIS_TWIST * (1 - aperture);
  const angleAt = (index) => twist + (index * 360) / BLADE_COUNT;
  const inner = (index) => polar(angleAt(index), hole);
  // Swept back from its own inner corner, which is what gives a diaphragm its
  // pinwheel rather than a plain starburst.
  const outer = (index) => polar(angleAt(index) + BLADE_SWEEP, IRIS_OUTER);

  const vertices = Array.from({ length: BLADE_COUNT }, (_, i) => inner(i));
  const opening = `M ${vertices
    .map((v) => `${v.x.toFixed(2)} ${v.y.toFixed(2)}`)
    .join(' L ')} Z`;

  return (
    <svg className="iris-blades" viewBox="0 0 100 100" aria-hidden="true">
      {Array.from({ length: BLADE_COUNT }, (_, i) => {
        const next = (i + 1) % BLADE_COUNT;
        // Neighbours share the inner-to-outer edge, so the leaves tile with no
        // seams to leak light through at any aperture.
        const points = [inner(i), inner(next), outer(next), outer(i)]
          .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
          .join(' ');
        return (
          <polygon key={i} className="iris-blade" data-parity={i % 2} points={points} />
        );
      })}
      <path className="iris-edge" d={opening} />
    </svg>
  );
}

export default function LensInstrument() {
  const {
    lensRef,
    rotation,
    activeStop,
    liveStop,
    dragging,
    didDragRef,
    reduceMotion,
    selectStop,
    lensProps,
  } = useZoomRing();

  const [frameIndex, setFrameIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [latched, setLatched] = useState(false);
  const pressRef = useRef(0);

  const frames = framesForStop(activeStop.id);
  const frame = frames[Math.min(frameIndex, frames.length - 1)] ?? frames[0];
  const open = held || latched;

  const [aperture, setAperture, jumpAperture] = useSpring(0, SHUTTER_SPRING);

  useEffect(() => {
    if (reduceMotion) {
      jumpAperture(open ? 1 : 0);
      return;
    }
    setAperture(open ? 1 : 0);
  }, [open, reduceMotion, setAperture, jumpAperture]);

  // A new section loads a new roll, so start at its first frame with the
  // shutter shut rather than leaving the previous card exposed.
  useEffect(() => {
    setFrameIndex(0);
    setLatched(false);
    setHeld(false);
  }, [activeStop.id]);

  const onShutterPointerDown = useCallback((event) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    if (event.target.closest('.finder-action')) return;
    pressRef.current = performance.now();
    setHeld(true);
  }, []);

  const onShutterPointerUp = useCallback((event) => {
    if (event.target.closest('.finder-action')) return;
    const quick = performance.now() - pressRef.current < TAP_MS;
    setHeld(false);
    if (quick) setLatched((value) => !value);
  }, []);

  const onShutterKeyDown = useCallback((event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    setLatched((value) => !value);
  }, []);

  return (
    <div className="stage">
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

      <div className="instrument" style={CSS_VARS}>
        <FilmStrip
          stop={activeStop}
          frames={frames}
          index={Math.min(frameIndex, frames.length - 1)}
          onIndexChange={setFrameIndex}
        />

        <div
          className="lens"
          ref={lensRef}
          data-dragging={dragging}
          aria-label="Zoom ring. Use arrow keys or drag to choose a topic."
          {...lensProps}
          onPointerDown={(event) => {
            if (event.target.closest('.viewfinder')) return;
            lensProps.onPointerDown(event);
          }}
        >
          <div className="barrel" style={{ transform: `rotate(${rotation}deg)` }}>
            <Barrel liveStop={liveStop} selectStop={selectStop} didDragRef={didDragRef} />
          </div>
          <img className="glass-art" src="/lens/glass.svg" alt="" />

          <div
            className="viewfinder"
            style={{
              '--aperture': aperture.toFixed(4),
              // Kept in lockstep with the drawn opening so the card is
              // revealed exactly through the hole, never beyond its edge.
              '--iris-hole': `${irisHole(aperture).toFixed(2)}%`,
            }}
            data-open={open}
            role="button"
            tabIndex={0}
            aria-expanded={open}
            aria-label={`Shutter. Hold or press to reveal ${frame.title}.`}
            onPointerDown={onShutterPointerDown}
            onPointerUp={onShutterPointerUp}
            onPointerCancel={() => setHeld(false)}
            onPointerLeave={() => setHeld(false)}
            onKeyDown={onShutterKeyDown}
          >
            <Viewfinder stop={activeStop} frame={frame} interactive={latched} />

            <p className="shutter-hint" aria-hidden="true">
              <span className="shutter-hint-frame">{frame.caption}</span>
              <span className="shutter-hint-verb">hold to expose</span>
            </p>

            <div className="iris" aria-hidden="true">
              <Iris aperture={aperture} />
            </div>
          </div>

          <IndexMark />
        </div>
      </div>

      {activeStop.id === 'contact' ? (
        <elevenlabs-convai agent-id={ELEVENLABS_AGENT} />
      ) : null}
    </div>
  );
}
