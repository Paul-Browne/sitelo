import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Yığın',
    description:
      'Boşluğu bir belirteçle verilen esnek bir satır ya da sütun — çoğu sayfanın kurulduğu yerleşim ilkeli.',
    activeHref: '/tr/ui/stack',
    children: [
      p(
        'Yığın, şeylerin arasına boşluk koyar. Tek işi olan bir flex kabıdır ve “bunları nasıl aralarım” sorularının çoğunun yanıtıdır — varsayılan olarak dikey, ',
        code("direction: 'row'"),
        ' ile yatay.',
      ),
      p(
        'Boşluklar boşluk ölçeğinden gelir, bu yüzden bir sayfanın ritmi kimse piksel değeri seçmeden tutarlı kalır.',
      ),

      h2('Temel yığın'),
      demo(`stack({ gap: 'md' },
  card(cardBody('Birinci')),
  card(cardBody('İkinci')),
  card(cardBody('Üçüncü')),
)`, { align: 'stretch' }),

      h2('Yön'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('Bir'),
  button({ variant: 'outline' }, 'İki'),
  button({ variant: 'outline' }, 'Üç'),
)`),

      h2('Boşluk'),
      p(
        'Bir belirteç adı (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), bir boşluk birimi sayısı ya da ham bir CSS uzunluğu.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 birim'), chip('6 birim')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Hizalama'),
      p(
        code('align'),
        ' ve ',
        code('justify'),
        ' ham flexbox değerleri alır, bu yüzden CSS’in anladığı her şey çalışır.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('baş'),
    chip('son'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'Ortalanmış'),
    chip('ve hizalanmış'),
  ),
)`, { align: 'stretch' }),

      h2('Sarma'),
      p(
        'Sığmayabilecek bir etiket ya da düğme sırası ',
        code('wrap'),
        ' ister — o olmadan sonraki satıra geçmek yerine sıkışırlar.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('Satır içi'),
      p(
        code('inline'),
        ', yığını bir ',
        code('inline-flex'),
        ' yapar, böylece tam genişliği kaplamak yerine bir metin satırının içinde durur.',
      ),
      demo(`text(
  'Şunlarla kuruldu: ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' ve başka hiçbir şeyle.',
)`, { align: 'stretch' }),

      h2('Başka bir öğe olarak'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/docs' }, 'Belgeler'),
  navLink({ href: '/ui', current: true }, 'UI'),
  navLink({ href: '/examples' }, 'Örnekler'),
)`),

      h2('Proplar'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Ana eksen.'],
        ['gap', 'Space', "'md'", 'Çocuklar arasındaki boşluk.'],
        ['align', 'string', "'stretch'", 'Herhangi bir align-items değeri.'],
        ['justify', 'string', "'flex-start'", 'Herhangi bir justify-content değeri.'],
        ['wrap', 'boolean | string', 'false', 'true sarma demektir; bir dize flex-wrap olarak geçirilir.'],
        ['inline', 'boolean', 'false', 'inline-flex olarak işler.'],
        ['as', 'string', "'div'", 'İşlenecek öğe, örneğin nav ya da ul.'],
      ]),
    ],
  })
