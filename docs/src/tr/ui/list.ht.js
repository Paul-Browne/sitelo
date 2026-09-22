import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Liste',
    description:
      'İki yanında isteğe bağlı birer şey bulunan içerik satırları — çoğu ayar ekranının ve akışının kurulduğu biçim.',
    activeHref: '/tr/ui/list',
    children: [
      p(
        'Liste, kenarlıklı bir satır yüzeyidir. Her satırın bir başlığı, isteğe bağlı bir açıklaması ve başta ile sonda bir avatar, bir simge ya da bir denetim için yuvaları vardır.',
      ),

      h2('Temel liste'),
      demo(`list(
  listItem({ title: 'Yönlendirme', description: 'src/about.ht.js dosyası /about olur' }),
  listItem({ title: 'Veri yükleme', description: 'data() bir kez, derleme sırasında çalışır' }),
  listItem({ title: 'Varlıklar', description: 'Yalnızca HTML’inizin başvurduğu şeyler paketlenir' }),
)`, { align: 'stretch' }),

      h2('Baş ve son yuvaları'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'main dalına 3 işleme gönderdi',
    end: chip({ size: 'sm', color: 'neutral' }, '2sa'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Bir çekme isteği açtı',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'açık'),
  }),
)`, { align: 'stretch' }),

      h2('Bağlanan satırlar'),
      p(
        code('href'),
        ' taşıyan bir satır, çapayı ',
        code('<li>'),
        ' öğesinin çevresine değil içine koyar, böylece liste geçerli bir liste olarak kalır. Satıra ayrıca bir düğme koymayın — etkileşimli içerik bir bağlantının içine yuvalanamaz.',
      ),
      demo(`list(
  listItem({ title: 'Başlarken', description: 'Kurulum ve ilk sayfa', href: '/docs' }),
  listItem({ title: 'Yönlendirme', description: 'Dinamik parçalarla dosya tabanlı', href: '/docs/routing' }),
  listItem({ title: 'Dağıtım', description: 'Netlify, Vercel, Pages, Amplify', href: '/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Denetimli satırlar'),
      p(
        'Bir satır bir anahtar ya da düğme taşıdığında satırın kendisini bağlantısız bırakın ve etkileşimli parça denetim olsun.',
      ),
      demo(`list(
  listItem({
    title: 'Pagefind araması',
    description: 'Derlemenin sonunda her sayfayı dizinler',
    end: toggle({ 'aria-label': 'Pagefind araması', checked: true }),
  }),
  listItem({
    title: 'Görsel optimizasyonu',
    description: 'Görselleri yeniden boyutlandırır ve dönüştürür. sharp gerektirir.',
    end: toggle({ 'aria-label': 'Görsel optimizasyonu', checked: true }),
  }),
  listItem({
    title: 'Sunucu adaları',
    description: 'İşaretli bölgeleri istek anında işler',
    end: toggle({ 'aria-label': 'Sunucu adaları' }),
  }),
)`, { align: 'stretch' }),

      h2('Düz'),
      p(
        code('plain'),
        ' kenarlığı ve zemini kaldırır; zaten kendi yüzeyi olan bir kartın ya da kenar çubuğunun içinde duran bir liste için.',
      ),
      demo(`card(
  cardHeader({ title: 'Son derlemeler' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · 4 dakika önce', end: chip({ size: 'sm', color: 'success', dot: true }, 'geçti') }),
      listItem({ title: 'dcfaaae', description: 'main · 2 saat önce', end: chip({ size: 'sm', color: 'success', dot: true }, 'geçti') }),
      listItem({ title: 'a46a461', description: 'main · dün', end: chip({ size: 'sm', color: 'danger', dot: true }, 'başarısız') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Serbest biçimli satırlar'),
      p(
        code('title'),
        ' ya da ',
        code('description'),
        ' olmadan bir satır, kendisine verilen çocukları işler — iki satırlık biçimin karşılamadığı bir yerleşim için.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Özel satır'),
        text({ variant: 'caption', tone: 'muted' }, 'İçine istediğiniz her şey'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Eylem'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Veriden'),
      demo(`return (() => {
  const locales = [
    { code: 'en', name: 'English', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' sayfa',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Proplar'),
      p(code('list()'), ':'),
      propsTable([
        ['plain', 'boolean', 'false', 'Kenarlığı ve zemini kaldırır.'],
        ['as', 'string', "'ul'", 'İşlenecek öğe, örneğin ol.'],
      ]),
      p(code('listItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Satırın ana satırı.'],
        ['description', 'Child', '', 'Soluk bir ikinci satır.'],
        ['start', 'Child', '', 'Baştaki yuva — bir avatar ya da simge.'],
        ['end', 'Child', '', 'Sondaki yuva — bir etiket, bir denetim, bir zaman damgası.'],
        ['href', 'string', '', 'Çapa li içinde olacak biçimde satırı bağlantı yapar.'],
        ['interactive', 'boolean', 'false', 'Bağlantı yapmadan üzerine gelme vurgusu.'],
      ]),
    ],
  })
