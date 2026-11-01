export * from 'vite-plugin-html-pages/page';

/** Each character that can end a text run or an attribute value early. */
const ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escape a value for HTML, so it shows as text rather than becoming markup.
 *
 * Template literals, javascript-to-html children and `sitelo/ui` children
 * are all inserted as raw HTML. Anything you did not write yourself — from
 * an API, a CMS, a JSON file, a query or island props — goes through this
 * first. Quotes are escaped too, so the result is just as safe inside a
 * quoted attribute value.
 *
 * Non-strings are converted with `String()`, the same as a template
 * literal would, so `null` comes out as `"null"`.
 *
 * Leave HTML you mean to render alone: a CMS body, Markdown output.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ENTITIES[char]);
}
