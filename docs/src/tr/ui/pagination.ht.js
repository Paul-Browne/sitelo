import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Sayfalama',
    description:
      'Geçerli sayfanın çevresinde pencerelenmiş, gerçek bağlantılar olarak numaralı sayfalar.',
    activeHref: '/tr/ui/pagination',
    children: [
      p(
        code('href'),
        ' sayfa numarasından URL’e giden bir fonksiyondur, bu yüzden sayfalama ',
        code('/blog/2'),
        ' ve ',
        code('/blog?page=2'),
        ' için aynı şekilde çalışır. Bu, her sayfayı gerçek bir bağlantı yapar — taranabilir, yeni sekmede açılabilir ve JavaScript olmadan çalışır; statik bir sitenin istediği de budur.',
      ),

      h2('Temel sayfalama'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Pencereleme'),
      p(
        'İlk ve son sayfalar her zaman gösterilir, artı geçerli olanın çevresinde bir pencere; dizinin atladığı her yerde bir üç nokta.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Kardeşler'),
      p(
        code('siblings'),
        ', geçerli olanın iki yanında kaç sayfa duracağıdır.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Uçlar'),
      p(
        'Önceki, ilk sayfada; sonraki ise son sayfada devre dışıdır, böylece denetim var olmayan bir sayfayı hiçbir zaman önermez.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Renkler ve etiketler'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Daha yeni',
    nextLabel: 'Daha eski',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('href olmadan'),
      p(
        code('href'),
        ' olmadan sayılar, ',
        code('data-su-page'),
        ' taşıyan düğmeler olarak işlenir — kendi betiğiyle yerinde süzen bir sayfa için. Yapabildiğinizde bağlantıları tercih edin: JavaScript kapalıyken de yaşarlar.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('Bir blogda'),
      p(
        'Statik bir sitedeki alışıldık biçim: ',
        code('generateStaticParams'),
        ' dilim başına bir sayfa üretir ve ',
        code('href'),
        ' onları gösterir.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      posts + ' içinden ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' gösteriliyor',
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['page', 'number', '1', 'Geçerli sayfa. Aralığa sıkıştırılır.'],
        ['count', 'number', '1', 'Kaç sayfa olduğu.'],
        ['href', '(page: number) => string', '', 'Sayfa numarasından URL’e. O olmadan sayfalar düğme olarak işlenir.'],
        ['siblings', 'number', '1', 'Geçerli olanın iki yanında gösterilen sayfalar.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Geçerli sayfanın rengi.'],
        ['label', 'string', "'Pagination'", 'Gezinme yer imi için erişilebilir ad.'],
        ['previousLabel', 'Child', "'‹'", 'Önceki denetiminin içeriği.'],
        ['nextLabel', 'Child', "'›'", 'Sonraki denetiminin içeriği.'],
      ]),
    ],
  })
