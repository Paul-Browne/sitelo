import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Çekmece',
    description:
      'Kenardan gelen bir panel — bir kiple aynı popover işleyişi, farklı biçim.',
    activeHref: '/tr/ui/drawer',
    children: [
      p(
        'Çekmece, bir yana sabitlenmiş tam yükseklikte bir paneldir. ',
        code('modal()'),
        ' gibi o da bir ',
        code('popover'),
        ' öğesidir: eşleşen bir ',
        code('popovertarget'),
        ' taşıyan bir düğme onu açar ve arka planı, dışarı tıklamayı ve Escape’i tarayıcı halleder.',
      ),
      p(
        'Statik bir sitedeki en yaygın işi, telefondaki gezinme menüsüdür.',
      ),

      h2('Temel çekmece'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Çekmeceyi aç'),
  drawer({ id: 'drawer-basic', title: 'Ayarlar' },
    stack({ gap: 'md' },
      toggle({ label: 'Pagefind araması', checked: true }),
      toggle({ label: 'Görsel optimizasyonu', checked: true }),
      toggle({ label: 'Sunucu adaları' }),
    ),
  ),
)`),

      h2('Yanlar'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'Baştan'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'Sondan'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Baş' },
    text({ variant: 'small', tone: 'muted' }, 'Öncü kenara sabitlenmiş — soldan sağa bir dilde sol taraf.'),
  ),
  drawer({ id: 'drawer-end', title: 'Son' },
    text({ variant: 'small', tone: 'muted' }, 'Varsayılan: sondaki kenara sabitlenmiş.'),
  ),
)`),

      h2('Genişlik'),
      p('Herhangi bir CSS uzunluğu. Görünümün %90’ıyla sınırlıdır, bu yüzden geniş bir çekmece de bir telefona sığar.'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Dar'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Geniş'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Dar' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Geniş' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('Gezinme menüsü olarak'),
      p('Çoğu sitenin istediği kalıp: çubukta bir menü düğmesi, çekmecede bağlantılar.'),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Gezinmeyi aç',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Gezinme' },
    navLink({ href: '#docs', current: true }, 'Belgeler'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Örnekler'),
    navLink({ href: '#about' }, 'Hakkında'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Başlayın'),
  ),
)`, { align: 'stretch' }),

      h2('Bir süzgeç paneli'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Süzgeçler'),
  drawer({ id: 'drawer-filters', title: 'Süzgeçler', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Tür',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Rehberler' },
          { value: 'example', label: 'Örnekler' },
          { value: 'all', label: 'Her şey' },
        ],
      }),
      choiceGroup({
        legend: 'Künyeler',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Vazgeç'),
        button('Uygula'),
      ),
    ),
  ),
)`),

      h2('Arka planın kaydırılması'),
      p(
        'Açık bir çekmecenin ardındaki sayfa kaydırılmaz — ',
        code('modal()'),
        ' işlevinin kullandığı, betiksiz ve başlatılacak hiçbir şeyi olmayan aynı yalnızca-CSS kilidi. Arka planın her zamanki gibi kaydırılmasına izin vermek için ',
        code('lockScroll: false'),
        ' geçirin.',
      ),

      h2('Proplar'),
      propsTable([
        ['id', 'string', '', 'Zorunlu. Bir tetikleyicinin popovertarget değerinin gösterdiği şey.'],
        ['title', 'Child', '', 'Başlık ve iletişim kutusunun erişilebilir adı.'],
        ['side', "'start' | 'end'", "'end'", 'Hangi kenara sabitlendiği.'],
        ['width', 'string', "'20rem'", 'Panel genişliği, 90vw ile sınırlı.'],
        ['closable', 'boolean', 'true', 'Başlıkta × gösterir.'],
        ['closeLabel', 'string', "'Close'", 'O düğme için erişilebilir ad.'],
        ['lockScroll', 'boolean', 'true', 'Açıkken ardındaki sayfanın kaydırılmasını durdurur.'],
      ]),
    ],
  })
