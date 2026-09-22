import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Gezinti yolu',
    description:
      'Bulunduğunuz sayfada biten ata izi.',
    activeHref: '/tr/ui/breadcrumbs',
    children: [
      p(
        'Gezinti yolu bir sayfanın nerede durduğunu söyler. Son öğe geçerli sayfadır: düz metin olarak işlenir ve ',
        code('aria-current="page"'),
        ' ile işaretlenir, çünkü zaten bulunduğunuz sayfaya bir bağlantı gürültüdür.',
      ),

      h2('Temel kırıntı yolu'),
      demo(`breadcrumbs({
  items: [
    { label: 'Ana sayfa', href: '/' },
    { label: 'Belgeler', href: '/docs' },
    { label: 'Yönlendirme' },
  ],
})`, { align: 'stretch' }),

      h2('Ayraç'),
      p('Herhangi bir dize ya da biçimlendirme. Ayraçlar her hâlükârda ekran okuyuculardan gizlenir.'),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Ana sayfa', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Gezinti yolu' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Ana sayfa', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Gezinti yolu' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Ana sayfa', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Gezinti yolu' }],
  }),
)`, { align: 'stretch' }),

      h2('Düz dizeler'),
      p('href’i olmayan bir öğe, yalnızca sonda değil, nerede görünürse görünsün yalnızca metindir.'),
      demo(`breadcrumbs({
  items: ['Ana sayfa', 'Arşiv', '2026', 'Mart'],
})`, { align: 'stretch' }),

      h2('Bir yoldan'),
      p(
        'Statik bir sitede iz genellikle elle yazılmaz, rotadan türetilir.',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: 'Ana sayfa', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('Gezinmeyi etiketlemek'),
      p(
        'Bütünü, erişilebilir bir adı olan bir ',
        code('<nav>'),
        ' öğesidir, böylece bir ekran okuyucu ona atlayabilir. Bir sayfada birden çok gezinme yer imi varsa adı ',
        code('label'),
        ' ile değiştirin.',
      ),
      demo(`breadcrumbs({
  label: 'Belge gezinti yolu',
  items: [{ label: 'Belgeler', href: '/docs' }, { label: 'Bileşenler' }],
})`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['items', 'Array', '[]', 'Dizeler ya da { label, href } nesneleri. Sonuncusu geçerli sayfadır.'],
        ['separator', 'Child', "'/'", 'Öğeler arasına çizilir, ekran okuyuculardan gizlenir.'],
        ['label', 'string', "'Breadcrumb'", 'Gezinme yer imi için erişilebilir ad.'],
      ]),
    ],
  })
