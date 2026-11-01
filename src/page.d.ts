export * from 'vite-plugin-html-pages/page';

/**
 * Escape a value for HTML, so it shows as text rather than becoming markup.
 *
 * Replaces `&`, `<`, `>`, `"` and `'`, so the result is safe both as
 * element content and inside a quoted attribute value. Non-strings are
 * converted with `String()`, as a template literal would.
 *
 * @example
 * `<h1>${escapeHtml(post.title)}</h1>`
 */
export declare function escapeHtml(value: unknown): string;
