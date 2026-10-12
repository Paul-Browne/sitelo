/**
 * The phrase the landing headline types out, one after another — shared by
 * every locale.
 *
 * Each phrase is also laid out invisibly in the same grid cell, so from the
 * first paint the slot is as big as the biggest of them, and nothing around
 * it moves while the phrases are typed and deleted. Those copies are drawn
 * from an attribute by CSS, so the headline's text is still just the
 * sentence with its first phrase.
 *
 * The slot is a line of its own, after the rest of the sentence. Where the
 * sentence carries on past it, as in Chinese, `inline` keeps it in the line.
 */
import { span } from 'javascript-to-html'

export const heroTyped = (phrases, { inline = false } = {}) =>
  span(
    { class: inline ? 'hero-typed hero-typed--inline' : 'hero-typed' },
    ...phrases.map((phrase) => span({ class: 'hero-typed-sizer', 'data-phrase': phrase })),
    span({ class: 'hero-typed-text', 'aria-live': 'polite' }, phrases[0]),
  )
