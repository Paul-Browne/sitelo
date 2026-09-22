import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Sekmeler',
    description:
      'Üç biçim: sekme başına bir sayfa olan bağlantılar; yerinde değişen paneller; ya da URL’in sürdüğü paneller.',
    activeHref: '/tr/ui/tabs',
    children: [
      p(
        'Her öğeye bir ',
        code('href'),
        ' verin, sekmeler bağlantı olsun — sekme başına bir sayfa, betik yok, etkin olanda ',
        code('aria-current'),
        '. Her öğeye bir ',
        code('panel'),
        ' verin, panelleri yerinde değişen bir radyo grubuna dönüşsünler, yine betiksiz.',
      ),
      p(
        'Statik bir sitede genellikle bağlantı biçimi doğrudur: her görünüme bir URL verir ve JavaScript kapalıyken de yaşar. İçerik küçükse ve geçişin bir gezinmeye mal olmaması gerekiyorsa panellere uzanın.',
      ),

      h2('Bağlantı sekmeleri'),
      p(
        'Bunlar gerçekten bağlantıdır — birine tıklayın, gezinir. Alt çizgi tıklamadan değil, derleme sırasındaki ',
        code('active'),
        ' ya da ',
        code('value'),
        ' değerinden gelir; yani her sayfa kendi sekmesini işaretler. Bağlantı sekmesinin hiçbir yanı URL’e kendiliğinden tepki vermez: bunun için aşağıdaki panellerle yerinde geçiş yapın.',
      ),
      demo(`tabs({
  items: [
    { label: 'Gezinti yolu', href: '/ui/breadcrumbs' },
    { label: 'Sekmeler', href: '/ui/tabs', active: true },
    { label: 'Sayfalama', href: '/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Panel sekmeleri'),
      p(
        'Sekme, stil sayfasının gözden uzak tuttuğu bir radyo için bir ',
        code('<label>'),
        ' öğesidir ve işaretli radyonun ardından gelen panel, CSS’in gösterdiği paneldir. Bu sayfada hiçbir şey içe aktarılmaz: geçiş ve sekmeler arasında dolaşan ok tuşları, bir radyo grubunun zaten yaptığı şeylerdir.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Kurulum', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Kullanım', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Derleme', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Derin bağlanabilir sekmeler'),
      p(
        'Panelli öğelere ayrıca bir parça ',
        code('href'),
        ' verin, radyolar yerini bağlantılara bıraksın: URL sekmeyi adlandırır, ',
        code(':target'),
        ' onu seçer, ardından gelen panel görünür ve seçim bir yeniden yüklemeden, paylaşılan bir bağlantıdan ve geri düğmesinden sağ çıkar. Kimlik panelde değil sekmededir, çünkü tarayıcı URL’in adlandırdığı şeyi pencerenin tepesine kaydırır — paneli adlandırmak, az önce tıkladığınız sekmeleri ekrandan kaydırıp çıkarırdı. Bir belgede yalnızca bir öğe ',
        code(':target'),
        ' olabilir, bu yüzden bu biçim bir sayfadaki tek bir sekme kümesi içindir. Kaydırmanın kendisi iptal edilemez: bir parçayı izlemek tanımı gereği pencereyi oynatır. Bir sayfanın yapabileceği tek şey, neye kaydırılacağını ve nereye ineceğini seçmektir; sekmedeki kimlik ile onun ',
        code('scroll-margin-block-start'),
        ' değerinin varlık nedeni budur — onu ',
        code('scrollMargin'),
        ' propuyla ayarlayın ve yapışkan bir başlığa en azından kendi yüksekliğini verin.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Kurulum', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Bu panel #tab-setup — URL’i kopyalayın, geri gelir.'))) },
    { id: 'deploy', label: 'Dağıtım', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Bu da #tab-deploy.'))) },
  ],
})`, { align: 'stretch' }),

      h2('Haplar'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'Tümü', href: '#all', active: true },
      { label: 'Rehberler', href: '#guides' },
      { label: 'Örnekler', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Renkler'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Diğer', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Diğer', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Diğer', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Çok sayıda sekme'),
      p('Sekme listesi sarmak yerine yatay kaydırılır, böylece sıra telefonda biçimini korur. Panel sekmeleri ise sarar — her panelin kendi sekmesini izlemesi gerekir, bu da kaydırılacak bir sıra öğesi bırakmaz.'),
      demo(`tabs({
  items: [
    'Genel bakış', 'Yönlendirme', 'Veri', 'Varlıklar', 'Görseller', 'Adalar', 'TypeScript', 'CLI', 'Dağıtım',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Devre dışı'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Kullanılabilir', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Bu çalışıyor.'))) },
    { id: 'soon', label: 'Yakında', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Erişilebilirlik'),
      p(
        'Panel biçimi gerçek bir radyo grubudur: sekmeler, bir ',
        code('name'),
        ' paylaşan radyolar için ',
        code('<label>'),
        ' öğeleridir; böylece bir ekran okuyucu kaç tanesinden hangisinin seçildiğini duyurur ve ok tuşları, Home ile End hiçbir şey yüklenmeden çalışır. Derin bağlanabilir biçim ise düz bağlantılardır ve ',
        code('aria-current'),
        ' taşımaz — bir kez yazılır ve ilk tıklamadan sonra yanlış olurdu. Bilerek bir ARIA tablist değildir — ',
        code('aria-selected'),
        ' bir kez, sunucuda yazılır ve siz tıkladıkça CSS onu doğru tutamaz. Bağlantı biçimi de bir tablist değildir: gezinen bağlantılar bağlantıdır ve onlara sekme anlamı vermek ne yaptıkları konusunda yalan söylemek olurdu.',
      ),

      h2('Proplar'),
      propsTable([
        ['items', 'Array', '[]', 'Dizeler ya da { id, label, href, panel, active, disabled } nesneleri.'],
        ['value', 'string', '', 'Etkin öğenin kimliği. active değerine, sonra ilkine geri düşer.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Etkin sekmenin nasıl işaretlendiği.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Etkin sekmenin rengi.'],
        ['label', 'string', "'Tabs'", 'Grup için erişilebilir ad. Yalnızca panel biçimi.'],
        ['name', 'string', 'ilk öğenin kimliği', 'Radyo grubu adı. Yalnızca bir sayfadaki iki panel sekmesi kümesi buna ihtiyaç duyar.'],
        ['href', 'string', '', 'Bir öğede: bağlanılacak bir sayfa ya da — panel ile birlikte — onu adlandıran parça.'],
        ['scrollMargin', 'Space', "'lg'", 'Pencerenin sekmenin ne kadar üstünde durduğu. Yalnızca :target biçimi.'],
      ]),
    ],
  })
