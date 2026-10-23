function pct(value) {
  return `${(value * 100).toFixed(3)}%`;
}

// Landmarks are in each drawing's SVG units. The lens, shutter and print
// are HTML layered over the drawing, positioned as fractions of its box.
function describe({ box, lens, slot, shutter }) {
  return {
    box,
    lens,
    vars: {
      '--lens-left': pct((lens.cx - lens.r - box.x) / box.w),
      '--lens-top': pct((lens.cy - lens.r - box.y) / box.h),
      '--lens-size': pct((lens.r * 2) / box.w),
      '--shutter-left': pct((shutter.cx - shutter.r - box.x) / box.w),
      '--shutter-top': pct((shutter.cy - shutter.r - box.y) / box.h),
      '--shutter-size': pct((shutter.r * 2) / box.w),
      aspectRatio: `${box.w} / ${box.h}`,
    },
    slot: {
      x: (slot.cx - box.x) / box.w,
      y: (slot.y - box.y) / box.h,
      w: slot.w / box.w,
    },
  };
}

export const MINI = describe({
  box: { x: 6, y: 3, w: 68, h: 74 },
  lens: { cx: 40, cy: 41.82, r: 19.4 },
  slot: { cx: 40, y: 70.25, w: 44 },
  shutter: { cx: 64.5, cy: 31.29, r: 3.78 },
});

export const WIDE = describe({
  box: { x: 4, y: 17.5, w: 73, h: 45 },
  lens: { cx: 32.56, cy: 38.77, r: 12.1 },
  slot: { cx: 38.4, y: 56.77, w: 43.13 },
  shutter: { cx: 62.98, cy: 32.92, r: 2.734 },
});
