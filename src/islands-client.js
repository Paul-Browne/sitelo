/**
 * Browser loader for sitelo server islands.
 *
 * Finds `[data-sitelo-island]` placeholders (emitted by `island()` from
 * `sitelo/islands`), fetches each rendered fragment from the islands
 * endpoint, and swaps the HTML in place. The placeholder's fallback
 * content stays visible until the fragment arrives, and is kept if the
 * request fails.
 */

export const DEFAULT_ISLANDS_ENDPOINT = '/_sitelo/islands';

async function loadIsland(element, endpoint, onError) {
  const name = element.getAttribute('data-sitelo-island');
  const props = element.getAttribute('data-sitelo-props');

  element.setAttribute('data-sitelo-island-state', 'loading');

  const query = props ? `?props=${encodeURIComponent(props)}` : '';

  try {
    const response = await fetch(`${endpoint}/${name}${query}`, {
      headers: { Accept: 'text/html' },
    });

    if (!response.ok) {
      throw new Error(`island "${name}" responded ${response.status}`);
    }

    element.innerHTML = await response.text();
    element.setAttribute('data-sitelo-island-state', 'loaded');
  } catch (error) {
    element.setAttribute('data-sitelo-island-state', 'error');
    if (onError) {
      onError(error, element);
    } else {
      console.error('[sitelo] island failed to load:', error);
    }
  }
}

/**
 * Load every island placeholder under `root`.
 *
 * @param {object} [options]
 * @param {string} [options.endpoint] - Islands endpoint base path/URL.
 * @param {ParentNode} [options.root] - Where to look for placeholders.
 * @param {(error: unknown, element: Element) => void} [options.onError]
 * @returns {Promise<void>} resolves when every island has settled.
 */
export async function mountIslands({
  endpoint = DEFAULT_ISLANDS_ENDPOINT,
  root = document,
  onError,
} = {}) {
  const normalizedEndpoint = endpoint.replace(/\/+$/, '');
  const elements = root.querySelectorAll(
    '[data-sitelo-island]:not([data-sitelo-island-state])',
  );

  await Promise.all(
    [...elements].map((element) =>
      loadIsland(element, normalizedEndpoint, onError),
    ),
  );
}
