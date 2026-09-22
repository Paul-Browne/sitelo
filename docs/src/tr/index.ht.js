import {
  a,
  button,
  code,
  div,
  h1,
  h2,
  h3,
  img,
  li,
  p,
  span,
  ul,
} from 'javascript-to-html'
import { landingLayout } from '../lib/tr.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('tr')

const features = [
  [
    'routing',
    'Yönlendirme',
    'src/about.ht.js → /about, ayrıca [slug] ve catch-all’lar',
    '/tr/docs/routing',
  ],
  [
    'code',
    'JSX ve TSX',
    'Sayfaları .jsx / .tsx olarak yaz — aynı yönlendirme, aynı derleme',
    '/tr/docs/pages#jsx-kisitlamalari',
  ],
  [
    'data',
    'Veri yükleme',
    'Derleme sırasında data(), fetch önbelleğiyle',
    '/tr/docs/data',
  ],
  [
    'pipeline',
    'Varlık hattı',
    'Başvurulan JS/TS/CSS paketlenir; gerisi yalnızca sunucuda kalır',
    '/tr/docs/assets',
  ],
  [
    'image',
    'Görsel optimizasyonu',
    'Yeniden boyutlandırma, biçimler ve srcset — images: true ile aç (sharp kur)',
    '/tr/docs/images',
  ],
  [
    'components',
    'sitelo UI',
    'Düğmeler, kartlar, formlar, tablolar ve modaller — HTML döndüren fonksiyonlar, çalışma zamanı yok',
    '/tr/docs/ui',
  ],
  [
    'terminal',
    'Geliştirme sunucusu + araç çubuğu',
    'İstek üzerine canlı render; ayrıca dosya, parametreler, ada sayısı ve geliştirirken bir viewport düğmesi',
    '/tr/docs/cli',
  ],
  [
    'search',
    'Pagefind araması',
    'İsteğe bağlı statik arama — pagefind’i kur, sonra sitelo build dist/pagefind/ içine dizinler',
    '/tr/docs/configuration#pagefind-aramasi',
  ],
  [
    'layers',
    'Sunucu adaları',
    'İstek anında sunucuda işlenen bölgeleri olan statik sayfalar',
    '/tr/docs/islands',
  ],
  [
    'sparkles',
    'Yapay zekâya hazır',
    'llms.txt, proje kuralları ve ipuçları — ajanlar React değil sitelo yazsın diye',
    '/tr/docs/build-with-ai',
  ],
  [
    'lighthouse',
    'Lighthouse denetimleri',
    'Gerçek derlemeyi eşiklere göre puanla — sitelo lighthouse çalıştır (lighthouse kur)',
    '/tr/docs/configuration#lighthouse-denetimleri',
  ],
  [
    'gift',
    'Ekstralar',
    'İstediğinde 404.html, sitemap.xml, RSS ve tek tıkla dağıtım yapılandırmaları',
    '/tr/docs/configuration',
  ],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — Hızlı web siteleri için modern çatı',
    description:
      'sitelo, bir sayfa klasörünü hızlı bir statik siteye dönüştürür. Çalışırken canlı önizleme, yayına almak için tek komut — ağır bir çatı olmadan.',
    children: [headerHero(), mainSections()],
  })

function headerHero() {
  return div(
    { class: 'hero' },
    div(
      { class: 'hero-center' },
      img({
        class: 'hero-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '280',
        height: '80',
        // Above the fold and the hero's first paint, so it should not queue
        // behind the page's other subresources.
        fetchpriority: 'high',
      }),
      h1(
        { class: 'hero-headline' },
        span(
          { class: 'hero-headline-text' },
          'Modern çatı: ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'hızlı web siteleri|bloglar|portfolyolar|açılış sayfaları|içerik odaklı siteler|e-ticaret siteleri',
              'aria-live': 'polite',
            },
            'hızlı web siteleri',
          ),
        ),
      ),
      p(
        { class: 'hero-lede' },
        'Sıfır yapılandırma. Şimşek hızında derlemeler. Her yere dağıtın — tek kurulum.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/tr/docs' }, 'Başla'),
        div(
          { class: 'install-glow' },
          div(
            { class: 'install' },
            code({ class: 'install-cmd' }, install),
            button(
              {
                class: 'install-copy',
                type: 'button',
                'data-copy': install,
                'aria-label': 'Kurulum komutunu kopyala',
              },
              'Kopyala',
            ),
          ),
        ),
      ),
    ),
  )
}

function mainSections() {
  return div(
    { class: 'landing-sections' },
    sectionBlock(
      'Neler var',
      ul(
        { class: 'feature-list' },
        ...features.map(([icon, name, detail, href]) => {
          const body = div(
            { class: 'feature-card-body' },
            span({ class: 'feature-chip' }, icons[icon]),
            h3(name),
            p(detail),
          )
          return li(
            href
              ? a({ class: 'feature-card', href }, body)
              : div({ class: 'feature-card' }, body),
          )
        }),
      ),
    ),
    sectionBlock(
      'Belgeler',
      p(
        'Yönlendirme, veri yükleme, TypeScript, yapılandırma ve CLI için rehberler.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/tr/docs' },
          'Belgeleri oku',
          arrowIcon,
        ),
      ),
    ),
    sectionBlock(
      'Örnekler',
      p(
        'Gerçek kurulumlar için tarifler — WordPress REST API tabanlı bir siteyle başlayarak.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/tr/examples' },
          'Örneklere göz at',
          arrowIcon,
        ),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
