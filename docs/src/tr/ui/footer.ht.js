import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Alt bilgi',
    description:
      'Bir sitenin altı: bağlantı sütunları ve altlarında bir satır.',
    activeHref: '/tr/ui/footer',
    children: [
      p(
        'Alt bilgi, kendiliğinden sığan bir sütun ızgarası ve kaç sütun olursa olsun her zaman tam genişliği kaplayan, isteğe bağlı bir alt satırdır.',
      ),
      p(
        'Hem ',
        code('footer'),
        ' hem ',
        code('siteFooter'),
        ' olarak dışa aktarılır, çünkü ',
        code('footer'),
        ' aynı zamanda javascript-to-html’in ',
        code('<footer>'),
        ' öğesidir ve ikisini tek bir adla içe aktarmak bir sözdizimi hatasıdır.',
      ),

      h2('Temel alt bilgi'),
      demo(`footer(
  footerColumn({ title: 'Belgeler' },
    '<a href="/docs">Başlarken</a>',
    '<a href="/docs/routing">Yönlendirme</a>',
    '<a href="/docs/data">Veri yükleme</a>',
  ),
  footerColumn({ title: 'Bileşenler' },
    '<a href="/ui">Genel bakış</a>',
    '<a href="/ui/button">Düğme</a>',
    '<a href="/ui/card">Kart</a>',
  ),
  footerColumn({ title: 'Proje' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('Alt satırla'),
      p(
        code('footerBottom()'),
        ' her sütunu kaplar, bu yüzden üstündeki ızgara ne yaparsa yapsın tam genişlikte bir satır olarak kalır.',
      ),
      demo(`footer(
  footerColumn({ title: 'Belgeler' }, '<a href="/docs">Rehber</a>', '<a href="/ui">Bileşenler</a>'),
  footerColumn({ title: 'Örnekler' }, '<a href="/examples">Tüm örnekler</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Derleme geçiyor'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Bir marka sütunu'),
      p(
        'Bir sütunun bağlantılardan oluşması gerekmez. Bir sütunun değil de ',
        code('footer()'),
        ' işlevinin çocuğu olarak geçirdiğiniz her şey ızgarada kendi hücresi olarak durur.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Vite ile çalışan, yapılandırma gerektirmeyen statik site üretimi.'),
    ),
  ),
  footerColumn({ title: 'Belgeler' }, '<a href="/docs">Rehber</a>', '<a href="/ui">Bileşenler</a>'),
  footerColumn({ title: 'Proje' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Sabit sütunlar'),
      p(
        'Varsayılan olarak sütunlar kendiliğinden sığar. Belirli bir biçim istediğinizde ',
        code('columns'),
        ' herhangi bir ',
        code('grid-template-columns'),
        ' değerini alır — diyelim geniş bir marka sütunu ve iki dar bağlantı sütunu.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'Marka ve onun hakkında bir cümle için daha geniş bir ilk sütun.')),
  footerColumn({ title: 'Belgeler' }, '<a href="/docs">Rehber</a>'),
  footerColumn({ title: 'Dahası' }, '<a href="/examples">Örnekler</a>'),
)`, { align: 'stretch' }),

      h2('Yalnızca alt satır'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · sitelo ile kuruldu')),
)`, { align: 'stretch' }),

      h2('Proplar'),
      p(code('footer()'), ':'),
      propsTable([
        ['columns', 'string', '', 'Bir grid-template-columns değeri. Atlandığında kendiliğinden sığar.'],
        ['as', 'string', "'footer'", 'İşlenecek öğe.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'Başlıklı bir sütun; çocuklar bir bağlantı listesi olur.'],
        ['footerBottom', '', '', 'Sütunların altında tam genişlikte satır.'],
      ], { headers: ['Parça', 'Proplar', 'Varsayılan', 'Açıklama'] }),
    ],
  })
