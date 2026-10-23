import { useEffect, useState } from 'react';
import Barrel from './Barrel';
import IndexMark from './IndexMark';
import Viewfinder from './Viewfinder';
import ViewfinderHud from './ViewfinderHud';
import { CSS_VARS } from './geometry';
import { stopIndex } from './stops';

const IRIS_MS = 220;

function IrisBlades({ closed }) {
  const blades = Array.from({ length: 8 }, (_, index) => (
    <path
      key={index}
      className="iris-blade"
      d="M50 50 L47 8 Q68 16 78 36 Z"
      transform={`rotate(${index * 45} 50 50)`}
    />
  ));

  return (
    <svg className="iris-blades" viewBox="0 0 100 100" aria-hidden="true" data-closed={closed}>
      {blades}
    </svg>
  );
}

function OptionalArt({ className, src, onReady }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <img
      className={className}
      src={src}
      alt=""
      onLoad={() => onReady?.()}
      onError={() => setVisible(false)}
    />
  );
}

export default function Lens({ ring, onOpen }) {
  const { lensRef, rotation, activeStop, liveStop, dragging, didDragRef, reduceMotion, selectStop, lensProps } =
    ring;
  const [contentStop, setContentStop] = useState(activeStop);
  const [irisClosed, setIrisClosed] = useState(false);
  const [zoomDirection, setZoomDirection] = useState('in');

  useEffect(() => {
    if (contentStop.id === activeStop.id) return undefined;
    const direction = stopIndex(activeStop) > stopIndex(contentStop) ? 'in' : 'out';
    if (reduceMotion) {
      setZoomDirection(direction);
      setContentStop(activeStop);
      setIrisClosed(false);
      return undefined;
    }

    setIrisClosed(true);
    const timer = window.setTimeout(() => {
      setZoomDirection(direction);
      setContentStop(activeStop);
      setIrisClosed(false);
    }, IRIS_MS);
    return () => window.clearTimeout(timer);
  }, [activeStop, contentStop, reduceMotion]);

  return (
    <div
      className="lens"
      ref={lensRef}
      style={CSS_VARS}
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
      <OptionalArt className="glass-art" src="/lens/glass.svg" />

      <div className="viewfinder">
        <Viewfinder stop={contentStop} direction={zoomDirection} onOpen={onOpen} />
        <ViewfinderHud stop={contentStop} focused={!irisClosed} />
        <div className="iris" data-closed={irisClosed} aria-hidden="true">
          <IrisBlades closed={irisClosed} />
          <OptionalArt className="iris-art" src="/lens/iris.svg" />
        </div>
      </div>

      <IndexMark />
    </div>
  );
}
