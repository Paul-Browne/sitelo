import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Tipografi',
    description:
      'Kendi öğesini seçen bir yazı ölçeği, böylece belge ana hattı görsel olanı izler.',
    activeHref: '/tr/ui/typography',
    children: [
      p(
        code('text()'),
        ', bir metin parçasını kitaplığın boyutlarından birinde işler. Türev, makul bir öğe seçer — ',
        code("variant: 'h2'"),
        ' gerçek bir ',
        code('<h2>'),
        ' işler — böylece başlıklar kimsenin düşünmesine gerek kalmadan belge ana hattına iner.',
      ),

      h2('Türevler'),
      demo(`stack({ gap: 'sm' },
  text({ variant: 'h1' }, 'Başlık 1'),
  text({ variant: 'h2' }, 'Başlık 2'),
  text({ variant: 'h3' }, 'Başlık 3'),
  text({ variant: 'h4' }, 'Başlık 4'),
  text({ variant: 'h5' }, 'Başlık 5'),
  text({ variant: 'h6' }, 'Başlık 6'),
  text({ variant: 'lead' }, 'Lead — gövde metninden bir adım yukarısı, bir başlığın altındaki cümle için.'),
  text({ variant: 'body' }, 'Body — varsayılan.'),
  text({ variant: 'small' }, 'Small — hâlâ cümle olan altyazılar.'),
  text({ variant: 'caption' }, 'Caption — küçük yazı.'),
  text({ variant: 'overline' }, 'Overline'),
)`, { align: 'stretch' }),

      h2('Başlıklar'),
      p(
        code('heading()'),
        ' bir ana hat ',
        code('level'),
        ' değeri alır ve kendini ona göre boyutlandırır. ',
        code('size'),
        ' ikisini ayırır: h3 gibi görünen bir ',
        code('<h1>'),
        ' bir ekran okuyucu için hâlâ h1’dir.',
      ),
      demo(`stack({ gap: 'sm' },
  heading({ level: 2 }, 'Eşleşecek biçimde boyutlanmış 2. düzey bir başlık'),
  heading({ level: 2, size: 'h5' }, 'h5 gibi boyutlanmış 2. düzey bir başlık'),
)`, { align: 'stretch' }),

      h2('Ton'),
      p('Tam karşıtlıktan okunabilir en sessiz griye kadar üç vurgu ağırlığı.'),
      demo(`stack({ gap: 'xs' },
  text('Varsayılan — gövde metninin dizildiği renk.'),
  text({ tone: 'muted' }, 'Soluk — ikincil metin, hâlâ rahatça okunur.'),
  text({ tone: 'subtle' }, 'Sessiz — etiketler ve üst veri.'),
)`, { align: 'stretch' }),

      h2('Hizalama'),
      demo(`stack({ gap: 'xs' },
  text({ align: 'start' }, 'Baş'),
  text({ align: 'center' }, 'Orta'),
  text({ align: 'end' }, 'Son'),
)`, { align: 'stretch' }),

      h2('Kesme ve sınırlama'),
      p(
        code('truncate'),
        ' tek bir satırı üç noktayla keser. ',
        code('lines'),
        ' ise belirli sayıda satıra sınırlar; bir kart özetinin genellikle istediği budur.',
      ),
      demo(`stack({ gap: 'md' },
  card({ variant: 'flat' }, cardBody(
    text({ truncate: true }, 'Kabının genişliğinin çok ötesine giden ve sarmak yerine üç noktayla kesilen tek bir satır.'),
  )),
  card({ variant: 'flat' }, cardBody(
    text({ lines: 2, tone: 'muted' }, 'İki satıra sınırlanmış. Bu paragraf, sınırlamanın gerçekten kesebileceği bir şey olsun diye bir süre sürüyor ve sonra üçüncü satırın başlayacağı noktanın ötesine biraz daha gidiyor.'),
  )),
)`, { align: 'stretch' }),

      h2('Satır içi kod ve tuşlar'),
      demo(`text(
  code('sitelo build'), ' çalıştırın ya da aramak için ', kbd('⌘'), ' ', kbd('K'), ' tuşlarına basın.',
)`, { align: 'stretch' }),
      p(
        'Çocuklar HTML olarak işlenir — bu kitaplıkta yuvalamayı her yerde işler kılan şey budur ve ',
        code('code()'),
        ' de bir istisna değildir. Yani etiket içeren bir örneğin, onları kaçıran ',
        code('text'),
        ' propuna ihtiyacı vardır:',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: '<em>Merhaba</em>' }), ' — text: yazıldığı gibi gösterilir'),
  text(code('<em>Merhaba</em>'), ' — çocuklar: biçimlendirme olarak ayrıştırılır'),
)`, { align: 'stretch' }),
      p(
        'İkisi de işe yarar. ',
        code('text'),
        ', bir etiketin kurulmak yerine okunması gereken bir kod örneği içindir. Çocuklar ise, biçimlendirmenin ',
        code('kendisinin'),
        ' önemli olduğu, zaten sözdizimi vurgulanmış çıktı içindir — bir Prism ya da Shiki sonucu doğrudan içine girer.',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: 'sitelo build --root docs' })),
  text(code('<span style="color: var(--su-primary-soft-fg)">sitelo</span> build')),
)`, { align: 'stretch' }),

      h2('Birleştirme'),
      p(
        'Metin yalnızca bir dize değil çocuk da alır — böylece bağlantılar, kod ve vurgu, HTML’de olacağı gibi içine yuvalanır.',
      ),
      demo(`text({ variant: 'lead' },
  'Sayfalar ',
  code('HTML'),
  ' döndüren fonksiyonlardır. ',
  link({ href: '/docs/pages' }, 'sayfa yazmak'),
  ' rehberine bakın.',
)`, { align: 'stretch' }),

      h2('Öğeyi değiştirmek'),
      p(
        code('as'),
        ', görünüşü değiştirmeden öğeyi geçersiz kılar — ana hatta görünmemesi gereken görsel bir başlık ya da bir metin satırının içindeki bir ',
        code('<span>'),
        ' için.',
      ),
      demo(`stack({ gap: 'xs' },
  text({ variant: 'h4', as: 'div' }, 'Başlık gibi görünüyor, bir div'),
  text({ variant: 'caption', as: 'p' }, 'Bir paragrafta altyazı biçimlendirmesi'),
)`, { align: 'stretch' }),

      h2('Görsel olarak gizli'),
      p(
        code('visuallyHidden()'),
        ' içeriği erişilebilirlik ağacında tutar ama ekrandan uzakta — gören okurların bağlamdan aldığı, bir ekran okuyucununsa ihtiyaç duyduğu etiket.',
      ),
      demo(`text(
  'Derleme durumu: ',
  chip({ color: 'success', dot: true }, 'geçiyor'),
  visuallyHidden(' — son derleme 4 dakika önce başarılı oldu'),
)`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['variant', "'h1'…'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline'", "'body'", 'Boyut, ağırlık ve varsayılan öğe.'],
        ['tone', "'default' | 'muted' | 'subtle'", "'default'", 'Metnin taşıdığı karşıtlık.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Metin hizalaması.'],
        ['truncate', 'boolean', 'false', 'Tek satır, üç noktayla kesilmiş.'],
        ['lines', 'number', '', 'Bu kadar satıra sınırlar.'],
        ['as', 'string', '', 'Türevin seçeceği öğeyi geçersiz kılar.'],
      ]),
      p(
        code('heading()'),
        ' şunu alır: ',
        code('level'),
        ' (1–6) ve isteğe bağlı bir ',
        code('size'),
        '; geri kalan her şey aynıdır.',
      ),
    ],
  })
