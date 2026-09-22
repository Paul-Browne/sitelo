import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/tr.js'

export default () =>
  examplesLayout({
    title: 'Örnekler',
    description: 'Pratik sitelo tarifleri — WordPress, API’ler ve daha fazlası.',
    activeHref: '/tr/examples',
    children: [
      p(
        'sitelo ile gerçek siteler kurmak için adım adım tarifler. Her örnek proje yapısını, veri yüklemeyi ve yazacağınız sayfaları gösterir.',
      ),
      h2('Mevcut olanlar'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/tr/examples/basic' }, 'Temel site'),
          ' — en küçük proje, artı Netlify, Vercel, Cloudflare Pages ve AWS Amplify için statik dağıtım yapılandırmaları.',
        ),
        li(
          a({ href: '/tr/examples/todo' }, 'Yapılacaklar uygulaması'),
          ' — satır içi ',
          code("import('/js/todo.js')"),
          ' işleyicileriyle statik HTML (ekle / değiştir / sil, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/tr/examples/blog' }, 'Markdown blog'),
          ' — statik sayfalara işlenen bir ',
          code('.md'),
          ' dosyaları klasörü, bir RSS akışı ve sıfır istemci JS’i.',
        ),
        li(
          a({ href: '/tr/examples/json' }, 'Yerel JSON'),
          ' — depodaki ',
          code('.json'),
          ' dosyalarından kurulan bir katalog: dosya başına bir sayfa, API yok, veritabanı yok.',
        ),
        li(
          a({ href: '/tr/examples/wordpress' }, 'WordPress'),
          ' — WordPress REST API’sinden ',
          code('fetchWithCache'),
          ' ile yazıları çekin, listeleyin ve statik yazı sayfaları üretin.',
        ),
        li(
          a({ href: '/tr/examples/islands' }, 'Sunucu adaları'),
          ' — statik sayfalar, artı adaları istek anında işleyen bir Node sunucusu.',
        ),
      ),
      h2('Yakında'),
      ul(
        { class: 'docs-list' },
        li('Başsız CMS / Contentful'),
      ),
    ],
  })
