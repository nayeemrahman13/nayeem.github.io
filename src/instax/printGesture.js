// A small wheel twitch must not move the camera. A clearer downward
// burst plays the print out. The pose eases the lift itself, so progress
// moves linearly in time. Easing it again would rush the pull and soften
// the landing twice.
export const COMMIT_PX = 64;
export const BURST_MS = 180;
export const FULL_MS = 720;
const MIN_MS = 200;

export function createGesture() {
  return {
    phase: 'camera',
    progress: 0,
    burstDy: 0,
    burstAt: 0,
    from: 0,
    to: 0,
    startedAt: 0,
    duration: 0,
  };
}

function settled(state, to) {
  const progress = to >= 1 ? 1 : 0;
  return {
    ...state,
    progress,
    phase: progress === 1 ? 'out' : 'camera',
    burstDy: 0,
    from: progress,
    to: progress,
    duration: 0,
  };
}

export function play(state, to, now, reduceMotion = false) {
  const target = to >= 1 ? 1 : 0;
  if (Math.abs(state.progress - target) < 0.001) return settled(state, target);
  if (reduceMotion) return settled(state, target);
  const distance = Math.abs(target - state.progress);
  return {
    ...state,
    phase: target > state.progress ? 'revealing' : 'retracting',
    from: state.progress,
    to: target,
    startedAt: now,
    duration: Math.max(MIN_MS, Math.round(FULL_MS * distance)),
    burstDy: 0,
  };
}

export function frame(state, now) {
  if (state.phase !== 'revealing' && state.phase !== 'retracting') return state;
  const t = state.duration <= 0 ? 1 : Math.min(1, (now - state.startedAt) / state.duration);
  if (t < 1) return { ...state, progress: state.from + (state.to - state.from) * t };
  return settled(state, state.to);
}

function sameDirection(burstDy, dy) {
  return burstDy === 0 || Math.sign(burstDy) === Math.sign(dy);
}

// Downward input at the end of a short print is discarded. Keeping it in
// the burst would let a later upward twitch cancel, or would retract a
// print the user was trying to read.
export function applyDelta(state, input) {
  const {
    dy,
    now,
    discrete = false,
    canDown = false,
    canUp = false,
    reduceMotion = false,
    enabled = true,
  } = input;
  if (!enabled || !dy) return { state, consumed: 'ignore' };

  if (state.phase === 'out') {
    if (dy > 0 && canDown) return { state: { ...state, burstDy: 0 }, consumed: 'text' };
    if (dy < 0 && canUp) return { state: { ...state, burstDy: 0 }, consumed: 'text' };
    if (dy > 0) return { state: { ...state, burstDy: 0 }, consumed: 'idle' };
  }

  let burstDy = state.burstDy;
  if (now - state.burstAt > BURST_MS || !sameDirection(burstDy, dy)) burstDy = 0;
  burstDy += dy;
  const armed = { ...state, burstDy, burstAt: now };
  const commitDown = discrete ? dy > 0 : burstDy >= COMMIT_PX;
  const commitUp = discrete ? dy < 0 : burstDy <= -COMMIT_PX;

  if (commitDown && armed.phase !== 'out') {
    return { state: play(armed, 1, now, reduceMotion), consumed: 'reveal' };
  }
  if (commitUp && armed.phase !== 'camera') {
    return { state: play(armed, 0, now, reduceMotion), consumed: 'retract' };
  }
  return { state: armed, consumed: 'hold' };
}
