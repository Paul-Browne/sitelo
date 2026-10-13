# Image optimization

Turn it on and install the encoder:

```bash
npm install -D sharp
```

```js
// sitelo.config.js
export default { images: true }
```

After that, write plain `<img src="/images/hero.png" alt="…">` tags.
Sources in `src/` and `public/` both work, and a relative `src` resolves
against its own page. In dev and in the build, each tag is rewritten in
place:

- **Resized** to every configured width below the source's own width, with
  the source width added on top. Images are never upscaled.
- **Converted**. One format gives `<img srcset sizes>`. Two or more give a
  `<picture>` with a `<source>` per format and a fallback in the original
  format.
- **Given** `width`/`height`, `loading="lazy"` and `decoding="async"`.
- **Cached** by content hash in `node_modules/.sitelo/images`, shared by dev
  and the build.
- **Pruned**. Originals that no other file in `dist/` mentions are deleted
  from the build.

## Options

```js
export default {
  images: {
    widths: [400, 800, 1200],
    formats: ['avif', 'webp'],
    quality: { avif: 55, webp: 78, jpeg: 82 },
    exclude: ['**/og/**'],
  },
}
```

| Option | Default | Meaning |
| --- | --- | --- |
| `widths` | `[400, 800, 1200]` | The width ladder. The source's own width always tops it |
| `formats` | `['webp']` | `avif`, `webp`, `jpeg`, `png`. Two or more produce `<picture>` |
| `quality` | `{ avif: 55, webp: 78, jpeg: 82 }` | Encoder quality per format |
| `sizes` | derived | The `sizes` attribute. One on the tag always wins |
| `dimensions` | `true` | Add `width`/`height` |
| `lazy` | `true` | Add `loading="lazy"` and `decoding="async"` |
| `exclude` | `[]` | Globs or RegExps of image URLs to leave alone |
| `assetsDir` | `'assets/img'` | Output folder in `dist/`. It is emptied before each build, so it must be a folder of its own |
| `cacheDir` | `'node_modules/.sitelo/images'` | Encode cache |
| `remote` | `false` | Download and optimize `https://` images at build time |
| `prune` | `true` | `false` keeps the originals |
| `dev` | `true` | `false` serves untouched originals in dev |
| `concurrency` | CPUs − 1 (max 8), or 1 with `remote` | Parallel encodes |

## One size, by name

Thumbnails, avatars and card images only ever need one file. Name it in the
URL. Hand-written variant filenames do not work because they carry hashes.

```html
<img src="/images/hero.png?w=400" alt="…">                          <!-- one 400px file -->
<img src="/images/team.jpg?w=300&h=300&position=attention" alt="…"> <!-- a square crop that favours faces -->
<img src="/images/logo.png?w=200&h=200&fit=contain&background=fff" alt="…">
```

| Param | Meaning |
| --- | --- |
| `w` | Width in pixels. Any value works, not only one from `widths` |
| `h` | Height. Alone, the width follows the aspect ratio. With `w`, the image is cropped to the box |
| `fit` | `cover` (the default) crops. `contain` fits the whole image inside the box |
| `background` | Pads a `contain` result to the exact box: hex without `#`, a CSS colour name, or `transparent`. Implies `fit=contain` |
| `position` | The crop anchor: `top`, `left`, `right-bottom` and so on, or `entropy` (most detail) or `attention` (people and saturated colour) |
| `format` | `avif`, `webp`, `jpeg` or `png`. On its own it keeps the full ladder in that one format |

## Left alone

These are never rewritten: tags that already have a `srcset`, tags inside a
`<picture>`, SVGs, animated GIFs, remote URLs (unless `remote: true`) and
tags marked `data-no-optimize`. Images in `<meta>` and `<link>`, such as
`og:image` and favicons, are never touched.

Pruning keeps an original whose filename appears in any HTML, CSS, JS,
JSON, XML, manifest, feed, text or SVG file in the build. An image URL
built at runtime in a script, or rendered by a server island, is invisible
to it. Set `prune: false`, or `exclude` that folder, if you have those.

Docs: https://sitelo.dev/docs/images.md
