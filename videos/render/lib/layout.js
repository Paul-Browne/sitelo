// Geometry shared by the capture scripts and the stage, so a screenshot
// taken during capture fills the on-screen browser pixel for pixel.

/** The stage is laid out at 1920×1080 and rendered at SCALE (4/3 → 1440p). */
export const STAGE = { width: 1920, height: 1080 }
export const SCALE = Number(process.env.SCALE ?? 4 / 3)

/** Where a full-size window sits on the stage. */
export const WINDOW = { x: 40, y: 36, width: 1840, height: 1008 }

/** Tab strip plus address bar above the page. */
export const BROWSER_CHROME = 92

/** Pages render at this CSS size, zoomed so they fill the window's content area. */
const zoom = 4 / 3
export const BROWSER_VIEWPORT = {
  width: Math.round(WINDOW.width / zoom),
  height: Math.round((WINDOW.height - BROWSER_CHROME) / zoom),
  zoom,
}
