import { useCallback, useEffect, useRef } from 'react';
import { useFilmStrip } from './useFilmStrip';

const HOVER_SHIFT = 7;
const HOVER_TILT = 1.1;

function FrameArt({ frame }) {
  if (frame.art) {
    return <img className="film-art" src={frame.art} alt="" draggable="false" />;
  }
  return <span className="film-art film-art-tone" aria-hidden="true" />;
}

export default function FilmStrip({ stop, frames, index, onIndexChange }) {
  const { trackRef, offset, dragging, didDragRef, step, selectFrame, filmProps } = useFilmStrip({
    count: frames.length,
    index,
    onIndexChange,
  });
  const filmRef = useRef(null);

  // Written straight to CSS variables rather than through state: this runs on
  // every mousemove and has no business re-rendering the tree.
  const applyHover = useCallback((x, y) => {
    const el = filmRef.current;
    if (!el) return;
    el.style.setProperty('--film-hx', `${x * HOVER_SHIFT}px`);
    el.style.setProperty('--film-hy', `${y * HOVER_TILT}deg`);
  }, []);

  const onPointerMoveHover = useCallback(
    (event) => {
      if (event.pointerType !== 'mouse' || dragging) return;
      const rect = event.currentTarget.getBoundingClientRect();
      applyHover(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
      );
    },
    [applyHover, dragging],
  );

  const resetHover = useCallback(() => applyHover(0, 0), [applyHover]);

  // A new section swaps the whole roll, so drop any leftover parallax.
  useEffect(() => {
    resetHover();
  }, [stop.id, resetHover]);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        event.stopPropagation();
        step(1);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopPropagation();
        step(-1);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        event.stopPropagation();
        selectFrame(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        event.stopPropagation();
        selectFrame(frames.length - 1);
      }
    },
    [frames.length, selectFrame, step],
  );

  return (
    <div className="film" ref={filmRef} data-dragging={dragging}>
      <div className="film-stock" aria-hidden="true" />
      <div className="film-throat" aria-hidden="true" />

      <div
        className="film-track"
        ref={trackRef}
        role="listbox"
        aria-label={`${stop.label} film. Drag or use arrow keys to change frame.`}
        aria-orientation="horizontal"
        tabIndex={0}
        style={{ '--film-offset': `${offset}px` }}
        onKeyDown={onKeyDown}
        onPointerMove={(event) => {
          filmProps.onPointerMove(event);
          onPointerMoveHover(event);
        }}
        onPointerLeave={resetHover}
        onPointerDown={filmProps.onPointerDown}
        onPointerUp={filmProps.onPointerUp}
        onPointerCancel={filmProps.onPointerCancel}
      >
        {frames.map((frame, i) => (
          <div
            key={frame.id}
            className="film-frame"
            role="option"
            aria-selected={i === index}
            data-tone={frame.tone}
            data-selected={i === index}
            onClick={() => {
              if (didDragRef.current) return;
              selectFrame(i);
            }}
          >
            <FrameArt frame={frame} />
            <span className="film-caption">{frame.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
