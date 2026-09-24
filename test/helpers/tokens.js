/**
 * Reading tokens out of a sheet, and measuring the colours they name.
 *
 * Shared by the core's contrast test and the presets', which hold a
 * preset to the same AA bar the default palette clears.
 */

/**
 * Relative luminance, per WCAG 2.
 * @param {[number, number, number]} rgb
 * @returns {number}
 */
function luminance(rgb) {
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** @param {string} value @returns {[number, number, number] | null} */
export function parseHex(value) {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim());

  if (!match) return null;

  const int = Number.parseInt(match[1], 16);

  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/**
 * A hex colour, or an `rgb()`/`rgba()` one with the commas the sheets
 * write, as channels and an alpha.
 *
 * @param {string} value
 * @returns {[number, number, number, number] | null}
 */
export function parseColor(value) {
  const hex = parseHex(value);

  if (hex) return [...hex, 1];

  const match = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)$/.exec(value.trim());

  if (!match) return null;

  return [Number(match[1]), Number(match[2]), Number(match[3]), match[4] == null ? 1 : Number(match[4])];
}

/**
 * A colour laid over an opaque one: what a translucent surface shows as
 * on a given ground.
 *
 * @param {[number, number, number, number]} top
 * @param {[number, number, number]} under
 * @returns {[number, number, number]}
 */
export function composite([r, g, b, a], under) {
  return [r, g, b].map((channel, i) => channel * a + under[i] * (1 - a));
}

/** @returns {number} */
export function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

/** Custom properties declared in one block of the sheet. */
export function readTokens(block) {
  const tokens = {};

  for (const [, name, value] of block.matchAll(/(--su-[a-z0-9-]+):\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }

  return tokens;
}
