import { exposure, frameNumber } from './readout';

export default function ViewfinderHud({ stop, focused }) {
  return (
    <div className="finder-hud" aria-hidden="true">
      <p className="hud-top">
        <span className="hud-af" data-focused={focused}>
          AF
        </span>
        <span>{frameNumber(stop)}</span>
      </p>
      <p className="hud-bottom">
        <span>{exposure(stop)}</span>
      </p>
    </div>
  );
}
