import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, docsLayout } from '../../lib/tr.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('tr')

export default () =>
  docsLayout({
    title: 'Başlarken',
    description: 'sitelo’yu kurun ve ilk statik sitenizi oluşturun.',
    activeHref: '/tr/docs',
    children: [
      p(
        'sitelo, Vite ile çalışan yapılandırma gerektirmeyen bir statik site üreticisidir. Tek bir paket kurun, HTML döndüren fonksiyonlar yazın ve ',
        code('sitelo build'),
        ' çalıştırın.',
      ),
      h2('Kurulum'),
      codeBlock('shell', s.install, 'bash'),
      p('Node 20.19+ (ya da 22.12+) gerektirir. Vite pakete dahildir — ayrıca kurmanız gerekmez.'),
      h2('İlk sayfanız'),
      p(
        code('src/index.ht.js'),
        ' (ya da ',
        code('.ht.jsx'),
        ') oluşturun. ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ' önerilir:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Çalıştırma'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Bu, ',
        code('dist/index.html'),
        ' (',
        code('<!DOCTYPE html>'),
        ' sizin için eklenmiş olarak) ve varsayılan bir ',
        code('404.html'),
        ' üretir.',
      ),
      h2('Sırada'),
      ul(
        { class: 'docs-list' },
        li(a({ href: '/tr/docs/pages' }, 'Sayfa yazmak'), ' — şablon dizeleri, JSX, yapılandırılmış modüller'),
        li(a({ href: '/tr/docs/routing' }, 'Yönlendirme'), ' — dosya tabanlı rotalar ve ', code('generateStaticParams')),
        li(a({ href: '/tr/docs/data' }, 'Veri yükleme'), ' — ', code('data()'), ' ve ', code('fetchWithCache')),
        li(
          a({ href: '/tr/docs/assets' }, 'Varlıklar ve stil'),
          ' — Vite’ın derlediği ön yüz JS/CSS (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(a({ href: '/tr/docs/configuration' }, 'Yapılandırma'), ' — ', code('sitelo.config.js'), ' ve Vite seçenekleri'),
        li(a({ href: '/tr/docs/build-with-ai' }, 'Yapay zekâ ile geliştirme'), ' — ', code('llms.txt'), ', proje kuralları ve ajan ipuçları'),
      ),
    ],
  })
