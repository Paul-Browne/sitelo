/**
 * Code samples for the Image optimization page.
 *
 * `alt` text is translated — it is the one part of these samples a reader is
 * meant to write in their own language.
 */
const T = {
  en: { sunrise: 'Sunrise over the harbour', pixelArt: 'Pixel art', team: 'The team' },
  es: { sunrise: 'Amanecer sobre el puerto', pixelArt: 'Pixel art', team: 'El equipo' },
  fr: {
    sunrise: 'Lever de soleil sur le port',
    pixelArt: 'Pixel art',
    team: 'L’équipe',
  },
  de: {
    sunrise: 'Sonnenaufgang über dem Hafen',
    pixelArt: 'Pixel-Art',
    team: 'Das Team',
  },
  ru: {
    sunrise: 'Рассвет над гаванью',
    pixelArt: 'Пиксель-арт',
    team: 'Команда',
  },
  zh: {
    sunrise: '港口上的日出',
    pixelArt: '像素画',
    team: '团队',
  },
  pt: {
    sunrise: 'Nascer do sol sobre o porto',
    pixelArt: 'Pixel art',
    team: 'A equipa',
  },
  it: {
    sunrise: 'Alba sul porto',
    pixelArt: 'Pixel art',
    team: 'Il team',
  },
  pl: {
    sunrise: 'Wschód słońca nad portem',
    pixelArt: 'Pixel art',
    team: 'Zespół',
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

    output: `<img src="/assets/img/hero.a1b2c3d4-3000.webp"
     alt="${t.sunrise}"
     sizes="100vw"
     width="3000" height="2000"
     loading="lazy" decoding="async"
     srcset="/assets/img/hero.9f8e7d6c-400.webp 400w,
             /assets/img/hero.5b4a3c2d-800.webp 800w,
             /assets/img/hero.7c6d5e4f-1200.webp 1200w,
             /assets/img/hero.a1b2c3d4-3000.webp 3000w">`,

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
  <img src="/assets/img/hero.*-3000.png" alt="..." srcset="..." width="3000" height="2000">
</picture>`,

    pinned: `<img src="/images/hero.png?w=400" alt="${t.sunrise}">
<img src="/images/hero.png?w=400&format=jpeg" alt="${t.sunrise}">
<img src="/images/hero.png?w=200&h=200" alt="${t.sunrise}">
<img src="/images/hero.png?w=200&h=200&fit=contain" alt="${t.sunrise}">
<img src="/images/hero.png?w=200&h=200&background=fff" alt="${t.sunrise}">
<img src="/images/hero.png?w=200&h=200&position=top" alt="${t.sunrise}">`,

    pinnedOutput: `<img src="/assets/img/hero.9f8e7d6c-400.webp"
     alt="${t.sunrise}"
     width="400" height="267"
     loading="lazy" decoding="async">`,

    smartCrop: `<img src="/images/hero.png?w=300&h=300&position=entropy" alt="${t.sunrise}">
<img src="/images/team.jpg?w=300&h=300&position=attention" alt="${t.team}">`,

    optOut: `<img src="/images/exact.png" alt="${t.pixelArt}" data-no-optimize>`,

    remote: `export default {
  images: {
    remote: true,
  },
}`,
  }
}
