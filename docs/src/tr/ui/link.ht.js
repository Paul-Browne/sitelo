import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Bağlantı',
    description:
      'Biçimlendirilmiş bir çapa; bir dış bağlantının ihtiyaç duyduğu güvenlik öznitelikleriyle.',
    activeHref: '/tr/ui/link',
    children: [
      p(
        'Bağlantı, kitaplığın altı çizgi davranışını ve paletini taşıyan bir çapadır. İki adla dışa aktarılır — ',
        code('link'),
        ' ve ',
        code('textLink'),
        ' — çünkü ',
        code('link'),
        ' aynı zamanda javascript-to-html’in ',
        code('<link>'),
        ' öğesidir ve ikisini tek bir adla içe aktarmak bir sözdizimi hatasıdır. ',
        code('textLink'),
        ' kullanın ya da kitaplığı bir ad alanı olarak içe aktarın.',
      ),

      h2('Temel bağlantı'),
      demo(`text('Başlamak için ', link({ href: '/docs' }, 'belgeleri'), ' okuyun.')`, {
        align: 'stretch',
      }),

      h2('Renkler'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Sessiz'),
      p(
        'Sessiz bir bağlantı çevresindeki rengi devralır ve altı çizgisini üzerine gelindiğinde gösterir — her satırda bir alt çizginin gürültü olacağı bağlantı listeleri için.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/docs/routing', subtle: true }, 'Yönlendirme'),
  link({ href: '/docs/data', subtle: true }, 'Veri yükleme'),
  link({ href: '/docs/assets', subtle: true }, 'Varlıklar ve stil'),
)`, { align: 'stretch' }),

      h2('Dış bağlantılar'),
      p(
        code('external'),
        ', ',
        code('target="_blank"'),
        ' ve yanında gelmesi gereken ',
        code('rel'),
        ' değerini ekler. Yeni bir sekme açtığını bağlantı metninde söyleyin ya da görsel olarak gizli bir not ekleyin — uyarısız açılan yeni bir sekme şaşırtıcıdır.',
      ),
      demo(`text(
  'Kitaplık ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (yeni sekmede açılır)'),
  ),
  ' üzerinde.',
)`, { align: 'stretch' }),

      h2('Bir paragrafta'),
      demo(`text({ variant: 'lead' },
  'sitelo ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ' üzerine kuruludur, ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ' ile işler ve siz istemedikçe tarayıcıya hiçbir şey göndermez.',
)`, { align: 'stretch' }),

      h2('Ne zaman bunun yerine düğme kullanmalı'),
      p(
        'Bağlantı gezinir; düğme bir eylem gerçekleştirir. Nesne okuru bir yere götürmek yerine sayfadaki durumu değiştiriyorsa bir ',
        code('button()'),
        ' olmalıdır — ve geziniyor ama düğme gibi görünmeliyse ',
        code('button()'),
        ' işlevine bir ',
        code('href'),
        ' verin; altında bir çapa işler.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/docs' }, 'Gezinen bir bağlantı'),
  button({ href: '/docs', variant: 'outline' }, 'Düğme gibi görünen bir bağlantı'),
  button({ variant: 'link' }, 'Bağlantı gibi görünen bir düğme'),
)`),

      h2('Proplar'),
      propsTable([
        ['href', 'string', '', 'Nereye gittiği.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Hangi paletten besleneceği.'],
        ['subtle', 'boolean', 'false', 'Çevresindeki rengi devralır; alt çizgi yalnızca üzerine gelindiğinde.'],
        ['external', 'boolean', 'false', 'target="_blank" ve rel="noopener noreferrer" ekler.'],
      ]),
    ],
  })
