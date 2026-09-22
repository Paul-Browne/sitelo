import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Akordeon',
    description:
      'Tarayıcının kendi <details> öğesiyle katlanabilir bölümler — dışlayıcı kipi dahil.',
    activeHref: '/tr/ui/accordion',
    children: [
      p(
        'Her bölüm bir ',
        code('<details>'),
        ' öğesidir. Açma, kapama, klavye desteği ve sayfada bulma hepsi tarayıcıdan gelir; akordeon JavaScript kapalıyken de çalışır — en yaygın kullanım olan SSS için bu önemlidir.',
      ),

      h2('Temel akordeon'),
      demo(`accordion({
  items: [
    { title: 'sitelo nedir?', content: 'Vite üzerine kurulu bir statik site üreticisi. Sayfalar HTML döndüren fonksiyonlardır.' },
    { title: 'Bir çalışma zamanı yayımlıyor mu?', content: 'Hayır. Siz bir betik bağlamadıkça tarayıcıya hiçbir şey ulaşmaz.' },
    { title: 'TypeScript kullanabilir miyim?', content: 'Evet — .ht.ts ve .ht.tsx da diğerleri gibi sayfa uzantılarıdır.' },
  ],
})`, { align: 'stretch' }),

      h2('Varsayılan olarak açık'),
      demo(`accordion({
  items: [
    { title: 'Gelir gelmez açık', content: 'Bunda open: true var.', open: true },
    { title: 'Kapalı', content: 'Bunda yok.' },
  ],
})`, { align: 'stretch' }),

      h2('Her seferinde bir tane'),
      p(
        'Paylaşılan bir ',
        code('name'),
        ' bölümleri birbirini dışlar kılar — birini açmak diğerlerini kapatır. Bu bir betik değil, tarayıcının ',
        code('<details name>'),
        ' için kendi davranışıdır.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'Birinci', content: 'Bir başkasını açın, bu kapanır.', open: true },
    { title: 'İkinci', content: 'Bu da öyle.' },
    { title: 'Üçüncü', content: 'Hep yalnızca biri açıktır.' },
  ],
})`, { align: 'stretch' }),

      h2('Zengin içerik'),
      p(
        'İçerik bir paragraftan fazlaysa bölümleri ',
        code('accordionItem()'),
        ' ile kurun.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Kurulum', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Paketi ve biçimlendirme arkadaşını ekleyin:'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Yapılandırma' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'İsteğe bağlı. Vite seçenekleri vite anahtarı altında yaşar.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Dağıtım' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Çıktı dizinini herhangi bir statik sunucuda yayımlayın.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Bir SSS'),
      p(
        'Bu bileşenin var olma nedeni olan biçim: zaten HTML’de bulunan, göz gezdirmek için katlanmış ve sayfadan hiç ayrılmadığı için bir arama motorunun bulabileceği içerik.',
      ),
      demo(`return (() => {
  const faq = [
    ['Gerçekten yapılandırma gerektirmiyor mu?', 'src/ içinde tek dosyası olan ve yapılandırması olmayan bir proje derlenir. Geri kalan her şey tercihe bağlıdır.'],
    ['Dinamik rotalar nasıl çalışır?', 'Dosya adlarındaki köşeli parantezler. generateStaticParams neyin derleneceğini listeler.'],
    ['Peki ya arama?', 'pagefind: true ayarlayın, derleme her sayfayı dizinler.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Proplar'),
      p(code('accordion()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Dizeler ya da { title, content, open } nesneleri.'],
        ['name', 'string', '', 'Paylaşılan bir ad bölümleri birbirini dışlar kılar.'],
      ]),
      p(code('accordionItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Özet satırı.'],
        ['open', 'boolean', 'false', 'Genişletilmiş başlayıp başlamayacağı.'],
        ['name', 'string', '', 'Öğeleri elle kurarken üstteki ile aynı etki.'],
      ]),
    ],
  })
