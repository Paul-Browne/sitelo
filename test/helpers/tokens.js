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
