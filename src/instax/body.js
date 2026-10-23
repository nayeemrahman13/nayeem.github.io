// Landmarks on the camera body drawing, in its SVG units.
export const BODY_BOX = { x: 6, y: 3, w: 68, h: 74 };
export const LENS = { cx: 40, cy: 41.82, r: 19.4 };
export const SLOT = { cx: 40, y: 70.25, w: 44 };
export const SHUTTER = { cx: 64.5, cy: 31.29, r: 3.78 };

function pct(value) {
  return `${(value * 100).toFixed(3)}%`;
}

// Positions of the HTML layers (lens, shutter) over the drawing, as
// fractions of the camera box.
export const CAMERA_VARS = {
  '--lens-left': pct((LENS.cx - LENS.r - BODY_BOX.x) / BODY_BOX.w),
  '--lens-top': pct((LENS.cy - LENS.r - BODY_BOX.y) / BODY_BOX.h),
  '--lens-size': pct((LENS.r * 2) / BODY_BOX.w),
  '--shutter-left': pct((SHUTTER.cx - SHUTTER.r - BODY_BOX.x) / BODY_BOX.w),
  '--shutter-top': pct((SHUTTER.cy - SHUTTER.r - BODY_BOX.y) / BODY_BOX.h),
  '--shutter-size': pct((SHUTTER.r * 2) / BODY_BOX.w),
  aspectRatio: `${BODY_BOX.w} / ${BODY_BOX.h}`,
};

export const SLOT_FRACTION = {
  x: (SLOT.cx - BODY_BOX.x) / BODY_BOX.w,
  y: (SLOT.y - BODY_BOX.y) / BODY_BOX.h,
  w: SLOT.w / BODY_BOX.w,
};
