const NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

export function isValidIslandName(name) {
  return typeof name === 'string' && NAME_PATTERN.test(name);
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Emit a server-island placeholder.
 *
 * The static build ships the `fallback` HTML; at runtime the client
 * loader (`sitelo/islands/client`) fetches the rendered fragment from an
 * islands endpoint and swaps it in.
 *
 * @param {string} name - Island name; maps to `src/islands/<name>.js`.
 * @param {Record<string, unknown>} [props] - JSON-serializable props.
 * @param {string} [fallback] - HTML shown until the island loads.
 * @returns {string}
 */
export function island(name, props = {}, fallback = '') {
  if (!isValidIslandName(name)) {
    throw new Error(
      `[sitelo] Invalid island name "${name}". Use letters, digits, "-" or "_" (must start with a letter or digit).`,
    );
  }

  const json = JSON.stringify(props ?? {});
  const propsAttribute =
    json && json !== '{}'
      ? ` data-sitelo-props="${escapeAttribute(json)}"`
      : '';

  return `<div data-sitelo-island="${name}"${propsAttribute}>${fallback}</div>`;
}
