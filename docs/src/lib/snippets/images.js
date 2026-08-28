/**
 * Code samples for the Image optimization page.
 *
 * `alt` text is translated — it is the one part of these samples a reader is
 * meant to write in their own language.
 */
const T = {
  en: { sunrise: 'Sunrise over the harbour', pixelArt: 'Pixel art' },
  es: { sunrise: 'Amanecer sobre el puerto', pixelArt: 'Pixel art' },
  fr: {
    sunrise: 'Lever de soleil sur le port',
    pixelArt: 'Pixel art',
  },
  de: {
    sunrise: 'Sonnenaufgang über dem Hafen',
    pixelArt: 'Pixel-Art',
  },
}

export function imagesSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  return {
    enable: `export default {
  images: true,
}`,

    installSharp: `npm install -D sharp`,

    pageTemplate: `export default () => \`
  <html lang="${htmlLang}">
    <body>
      <img src="/images/hero.png" alt="${t.sunrise}">
    </body>
  </html>
\``,

    pageHt: `import { html, body, img } from 'javascript-to-html'

export default () =>
  html({ lang: '${htmlLang}' },
    body(
      img({ src: '/images/hero.png', alt: '${t.sunrise}' }),
    ),
  )`,

    pageJsx: `export default function Home() {
  return (
    <html lang="${htmlLang}">
      <body>
        <img src="/images/hero.png" alt="${t.sunrise}" />
      </body>
    </html>
  )
}`,

    output: `<img src="/assets/img/hero.a1b2c3d4-1200.webp"
     alt="${t.sunrise}"
     sizes="(max-width: 1200px) 100vw, 1200px"
     width="1200" height="800"
     loading="lazy" decoding="async"
     srcset="/assets/img/hero.9f8e7d6c-400.webp 400w,
             /assets/img/hero.5b4a3c2d-800.webp 800w,
             /assets/img/hero.a1b2c3d4-1200.webp 1200w">`,

    options: `export default {
  images: {
    widths: [400, 800, 1200],
    formats: ['avif', 'webp'],
    quality: { avif: 55, webp: 78, jpeg: 82 },
    exclude: ['**/og/**'],
  },
}`,

    picture: `<picture>
  <source type="image/avif" srcset="/assets/img/hero.*-400.avif 400w, ..." sizes="...">
  <source type="image/webp" srcset="/assets/img/hero.*-400.webp 400w, ..." sizes="...">
  <img src="/assets/img/hero.*-1200.png" alt="..." srcset="..." width="1200" height="800">
</picture>`,

    optOut: `<img src="/images/exact.png" alt="${t.pixelArt}" data-no-optimize>`,

    remote: `export default {
  images: {
    remote: true,
    prune: true,
  },
}`,
  }
}
