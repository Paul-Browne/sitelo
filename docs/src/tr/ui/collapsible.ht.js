import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Katlanabilir',
    description:
      'Bir akordeonun kenarlıkları ve gruplaması olmadan tek bir “daha fazla göster”.',
    activeHref: '/tr/ui/collapsible',
    children: [
      p(
        'Katlanabilir tek bir ',
        code('<details>'),
        ' öğesidir — bir akordeonun kurulduğu öğenin aynısı, onun hiçbir süsü olmadan. Bir sayfanın ortasındaki tek bir isteğe bağlı ayrıntı için kullanın; bir kümesi olduğunda ',
        code('accordion()'),
        ' kullanın.',
      ),
      p(
        'Betik gerektirmez ve içerik belgede kaldığı için tarayıcının kendi sayfada bulma işleviyle ve bir arama motoruyla bulunabilir.',
      ),

      h2('Temel katlanabilir'),
      demo(`collapsible({ trigger: 'Üretilen yapılandırmayı göster' },
  text({ variant: 'small' }, 'Kendinize ait bir yapılandırma dosyası olmadan derlemeyi çalıştırdığınızda sitelo’nun yazdığı her şey.'),
)`, { align: 'stretch' }),

      h2('Varsayılan olarak açık'),
      demo(`collapsible({ trigger: 'Bu neden var', open: true },
  text({ variant: 'small' }, 'Çünkü açıklamasını bir tıklamanın ardına saklayan bir sayfa, kimsenin okumadığı bir sayfadır.'),
)`, { align: 'stretch' }),

      h2('Zengin içerik'),
      demo(`collapsible({ trigger: 'Tam çıktıyı göster' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('Başka şeylerin içinde'),
      p('Katlanabilir, bir kartın, bir uyarının ya da bir tablo hücresinin içinde rahatça durur.'),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Derleme başarısız', subtitle: '2 bozuk bağlantı' }),
    cardBody(
      collapsible({ trigger: 'Başarısız bağlantıları göster' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: '/docs sayfasından bağlandı' }),
          listItem({ title: '/blog/draft', description: '/blog sayfasından bağlandı' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Yavaş sayfa' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'Bir sayfanın işlenmesi 500 ms’den uzun sürdü.'),
      collapsible({ trigger: 'Süreleri göster' },
        text({ variant: 'small' }, '/examples/wordpress — 512 ms'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Tetikleyici'),
      p(
        'Onu metin ve simgelerle sınırlayın. Bir ',
        code('<summary>'),
        ' zaten etkileşimlidir, bu yüzden içine konan bir düğme ya da bağlantı, tek bir eylemin olduğu yere iki denetim yuvalar — ',
        code('menu()'),
        ' işlevinin izlediği kuralın aynısı.',
      ),

      h2('Katlanabilir mi, akordeon mu?'),
      p(
        'Tek başına bir açılım: ',
        code('collapsible()'),
        '. Kenarlıklı ve gruplanmış, isteğe bağlı olarak her seferinde yalnızca biri açık olan bir kümesi: ',
        code('accordion()'),
        '.',
      ),

      h2('Proplar'),
      propsTable([
        ['trigger', 'Child', '', 'Özet içeriği. Yalnızca metin ve simgeler.'],
        ['open', 'boolean', 'false', 'Genişletilmiş başlayıp başlamayacağı.'],
      ]),
    ],
  })
