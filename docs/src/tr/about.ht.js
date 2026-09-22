import {
  a,
  div,
  em,
  h2,
  p,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from 'javascript-to-html'
import { code, pageLayout } from '../lib/tr.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: 'Hakkında',
    description:
      'sitelo neden var — javascript-to-html’den vite-plugin-html-pages’e, oradan eksiksiz bir statik site araç setine.',
    activeHref: '/tr/about',
    children: [
      p(
        'sitelo bir framework olarak başlamadı. Biçimlendirmeyi JavaScript’te doğal hissettiren bir biçimde yazma isteğiyle başladı — ve sayfa dosyasından yayımlanan siteye kadar bütün yol kapsanana dek büyüdü.',
      ),
      h2('javascript-to-html'),
      p(
        'Önce ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ' geldi (',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ' adıyla da bilinir): karmaşık şablon motorları ya da frameworkler olmadan JavaScript’te HTML üretmenin yalın, sezgisel bir yolu.',
      ),
      p(
        'React gibi her şeyi kapsayan frameworkler bu kadar yaygınlaşmışken, mutfaktaki her şeyi yanında getirmeyen basit bir şablon çözümü bulmak şaşırtıcı biçimde zordu. Yalnızca JavaScript’i HTML’e dönüştürmeye — yani dize döndüren fonksiyonlara — odaklanan ht.js hafif, kullanımı kolay, esnek ve genişletilebilir kalıyor.',
      ),
      p(
        'Bu küçük yüzey onu pek çok yere sığdırır: doğrudan ön yüzde (SPA gibi), statik site üretmek için bir derlemede (SSG) ya da sunucu tarafı işleme (SSR) için bile.',
      ),
      h2('Vite’a HTML üretmeyi öğretmek'),
      p(
        'Bu, yazma sorununu çözdü. Sıradaki sorun derlemeydi: Vite ',
        code('.js'),
        ' / ',
        code('.ts'),
        ' dosyalarını sayfa değil, betik sayar. Belirli modüllerin HTML olmaya ',
        em('niyetli'),
        ' olduğu bir kurala ihtiyacım vardı.',
      ),
      p(
        'Fikir açıktı: ',
        code('*.ht.js'),
        ', ',
        code('*.html.js'),
        ', ',
        code('*.ht.ts'),
        ' ve benzeri adlardaki dosyalar istemci JavaScript’i olarak paketlenmek yerine HTML’e işlenmeli. Bu kural ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ' oldu — Vite’ın üzerinde dosya tabanlı yönlendirme, veri yükleme, varlıklar ve statik üretim.',
      ),
      h2('sitelo'),
      p(
        'sitelo, Vite’ı ve bu eklentiyi tek bir kuruluma ve tek bir CLI’a sarar. Bütünlüklü, birinci sınıf bir geliştirici deneyimi elde edersiniz: canlı sunucu için ',
        code('sitelo'),
        ', üretim için ',
        code('sitelo build'),
        ', makul varsayılanlar ve araç zincirini kendiniz kurmadan eklentinin sayfa modeli.',
      ),
      p(
        'Aşağıya kadar aynı fikir: sayfalar HTML döndüren modüllerdir. sitelo, bu fikri tamamlanmış hissettiren katmandır.',
      ),
      h2('Nasıl karşılaştırılır'),
      p(
        'Statik site yayımlayan pek çok iyi araç zaten var. sitelo’nun alanı bilerek dar: HTML döndüren JavaScript (ya da TypeScript) fonksiyonları, Vite’ın geliştirme deneyimiyle ve olabildiğince az frameworkle.',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Araç'), th('Model'), th('Şu durumda tercih edin'))),
          tbody(
            comparisonRow(
              'sitelo',
              'Vite üzerinde JS/TS fonksiyonları → HTML',
              'Gerçek bir Vite iş akışıyla JavaScript’ten HTML istiyorsunuz — bileşen frameworkü gerekmez',
            ),
            comparisonRow(
              'Astro',
              'Bileşenler + adalar, kendi derleyicisi',
              'Bileşen adaları ve daha büyük bir ekosistem isteyen içerik siteleri',
            ),
            comparisonRow(
              'Next.js',
              'Tam React uygulaması (SSR / SSG / ISR)',
              'React ekosisteminde bir uygulama geliştiriyorsunuz',
            ),
            comparisonRow(
              'Hugo',
              'Go şablonları, çok hızlı derlemeler',
              'Devasa içerik siteleri ve Go’nun araç zincirinde rahatsınız',
            ),
            comparisonRow(
              'Eleventy',
              'Şablon dilleri → HTML',
              'SPA frameworkü olmadan esnek şablonlar (Nunjucks, Liquid, …) istiyorsunuz',
            ),
          ),
        ),
      ),
      p(
        'Bileşen, hidrasyon ve framework istiyorsanız — bir framework kullanın. JavaScript fonksiyonlarından Vite deneyimiyle HTML dosyaları istiyorsanız, işin tamamını yapan en küçük araç sitelo’dur.',
      ),
      p(
        a({ href: '/tr/docs' }, 'Belgeleri okuyun'),
        ' · ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'GitHub',
        ),
      ),
    ],
  })
