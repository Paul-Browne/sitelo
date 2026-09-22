import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Menü',
    description:
      '<details> üzerine kurulu bir açılır menü; hiç betik olmadan açılıp kapanır.',
    activeHref: '/tr/ui/menu',
    children: [
      p(
        'Menü, biçimlendirilmiş bir paneli olan bir ',
        code('<details>'),
        ' öğesidir. Bu, popover API’sine karşı bilinçli bir seçimdir: bir popover en üst katmanda yaşar ve henüz her yerde bulunmayan çapa konumlandırma olmadan tetikleyicisine göre konumlandırılamaz. Bir ',
        code('<details>'),
        ' bugün kendini doğru konumlandırır ve hiçbir şeyin yüklenmesini gerektirmez.',
      ),
      p(
        'Tetikleyici, düğme gibi biçimlendirilmiş o ',
        code('<summary>'),
        ' öğesidir — bu yüzden işlenmiş bir ',
        code('button()'),
        ' geçirmek yerine etiketi ve düğme proplarını ',
        code('menu()'),
        ' işlevine geçirirsiniz. Bir summary zaten etkileşimlidir ve içindeki bir düğme, tek bir eylemin olduğu yere iki denetim yuvalar: geçersiz biçimlendirme ve tek bir şey için iki sekme durağı.',
      ),
      p(
        'Dışarı tıklamada ve Escape ile kapanma, bir menü ilk kez açıldığında — ve yalnızca o zaman — onları içe aktaran bir ',
        code('ontoggle'),
        ' işleyicisinden gelir. O modül hiç gelmezse menü yine kendi summary öğesinden açılıp kapanır.',
      ),

      h2('Temel menü'),
      demo(`menu({ trigger: 'Eylemler' },
  menuItem({ href: '#edit' }, 'Düzenle'),
  menuItem({ href: '#duplicate' }, 'Çoğalt'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Sil'),
)`),

      h2('Hizalama'),
      p(
        'Menü, tetikleyicisinin baş kenarından açılır. ',
        code("align: 'end'"),
        ' onu çevirir; bir çubuğun sağ kenarına yakın bir menünün ihtiyacı budur.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'Başa hizalı', variant: 'soft' },
    menuItem({ href: '#a' }, 'Birinci'),
    menuItem({ href: '#b' }, 'İkinci'),
  ),
  menu({ trigger: 'Sona hizalı', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'Birinci'),
    menuItem({ href: '#d' }, 'İkinci'),
  ),
)`, { align: 'stretch' }),

      h2('Simge tetikleyicileri'),
      p(
        code('trigger'),
        ' metni olmayan bir simge bir ',
        code('label'),
        ' ister — simgenin veremeyeceği erişilebilir ad o olur.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'Daha fazla eylem',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Yeniden adlandır'),
    menuItem({ href: '#move' }, 'Taşı'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'Arşivle'),
  ),
)`),

      h2('Simgeli öğeler'),
      demo(`menu({ trigger: 'Dosya' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'Yeni sayfa'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Aç…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Siteyi derle'),
)`),

      h2('Bağlantı yerine düğme'),
      p(
        code('href'),
        ' taşımayan bir öğe bir ',
        code('<button>'),
        ' işler — gezinme değil, sayfada gerçekleşen bir eylem için.',
      ),
      demo(`menu({ trigger: 'Dışa aktar', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('JSON olarak dışa aktarıldı.',{color:'success'}))" }, 'JSON olarak'),
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('CSV olarak dışa aktarıldı.',{color:'success'}))" }, 'CSV olarak'),
)`),
      // Yukarıdaki tanıtım bildirim yükseltir; burası onların indiği bölge.
      // Sabit konumlu, bu yüzden burada işlenir ama köşede görünür.
      preview('toasts()'),

      h2('Bir uygulama çubuğunda'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'Daha fazla',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/docs' }, 'Belgeler'),
      menuItem({ href: '/examples' }, 'Örnekler'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Erişilebilirlik'),
      p(
        'Panel, öğeleri ',
        code('role="menuitem"'),
        ' olan bir ',
        code('role="menu"'),
        ' öğesidir ve summary ',
        code('aria-haspopup'),
        ' taşır. Bir ',
        code('<details>'),
        ' yerli bir menü aracı değildir, bu yüzden bu kusursuz değil makul bir yaklaşımdır — düz bir bağlantı listesi için details içindeki bir ',
        code('nav'),
        ' da aynı ölçüde geçerlidir ve daha az iddia eder.',
      ),

      h2('Proplar'),
      p(code('menu()'), ' — tetikleyici propları düğmenin proplarıdır:'),
      propsTable([
        ['trigger', 'Child', '', 'Görünen etiket. İşlenmiş bir button() değil, metin geçirin.'],
        ['icon', 'Child', '', 'Etiketten önceki biçimlendirme ya da yalnızca simgeli bir tetikleyici için tek başına.'],
        ['label', 'string', '', 'Erişilebilir ad. Simge varken ve tetikleyici metni yokken zorunludur.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Tetikleyici biçimlendirmesi.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Tetikleyicinin hangi paletten besleneceği.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tetikleyici boyutu.'],
        ['align', "'start' | 'end'", "'start'", 'Panelin tetikleyicinin hangi kenarıyla hizalandığı.'],
        ['triggerClass', 'string', '', 'Saran details yerine tetikleyici için fazladan sınıflar.'],
      ]),
      p(code('menuItem()'), ':'),
      propsTable([
        ['href', 'string', '', 'Bir çapa işler; o olmadan bir düğme.'],
        ['icon', 'Child', '', 'Etiketten önceki biçimlendirme.'],
        ['as', 'string', "'button'", 'href yokken işlenecek öğe.'],
      ]),
      p(code('menuSeparator()'), ' prop almaz — öğe grupları arasındaki ince çizgidir.'),
    ],
  })
