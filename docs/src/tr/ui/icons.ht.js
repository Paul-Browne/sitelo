import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

/** Tek hücre: okunaklı boyutta glif, yanında yazılacak ad. */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* Alfabetik, doğrudan kitaplıktan; böylece sayfa, belgelediği kümenin
 * gerisinde kalamaz. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * Kendi yolunu boyayarak dolan glifler ile ikinci bir çizim taşıyanlar —
 * iki biçimin aynı biçimlendirme olup olmadığına bakılarak ayırt edilir,
 * böylece hiçbir tanıtım kümenin gerisinde kalamaz.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * Dolgu tanıtımı, elle listelenmek yerine yazdırılarak üretilir — sayfanın
 * bastığı şey kaynağın kendisidir, böylece doldurulabilir hâle gelen bir
 * glif, kimse eklemeyi hatırlamadan burada belirir.
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: 'Simgeler',
    description:
      'Tek bir ızgarada 99 glif; satır içi işlenir, böylece bir simge çevresindeki metnin rengini ve boyutunu alır.',
    activeHref: '/tr/ui/icons',
    children: [
      p(
        code('icon()'),
        ' satır içi bir ',
        code('<svg>'),
        ' döndürür. Her glif aynı 24×24 ızgarada, ',
        code('currentColor'),
        ' ile doldurulmamış çizgiler olarak çizilir; böylece içinde bulunduğu şeyin rengini ve yazı boyutunu devralır ve kendine ait bir biçimlendirmeye gerek duymaz.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('Bir bileşende'),
      p(
        'Simge de diğerleri gibi bir çocuktur. Kendini ',
        code('em'),
        ' cinsinden boyutlandırdığı için, o etiketin ne kadar büyük olduğu kendisine söylenmeden yanındaki etiketle eşleşir:',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), 'İndir'),
  button({ variant: 'outline' }, icon('external-link'), 'Aç'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Sil'),
  iconButton({ label: 'Ara', variant: 'soft', icon: icon('search') }),
)`),

      h2('Boyut'),
      p(
        'Varsayılan ',
        code('1em'),
        ' — çevresindeki metnin boyutu. Ondan ayrılmak istediğinizde ',
        code('size'),
        ' bir belirteç ya da herhangi bir CSS uzunluğu alır:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Renk'),
      p(
        'Renk propu yoktur. Bir simge ',
        code('currentColor'),
        ' ile çizilir, bu yüzden bağlamının rengini alır — tek bir kümenin beş palet içinde çalışmasını sağlayan şey budur:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Erişilebilir adlar'),
      p(
        'Bir simge varsayılan olarak ',
        code('aria-hidden'),
        ' taşır; bu çoğu zaman doğrudur: “Sil” sözcüğünün yanındaki bir simge ikinci kez duyurulmamalıdır. Ona yalnızca simge bütün anlamı taşıdığında bir ',
        code('label'),
        ' verin; o zaman bu adla ',
        code('role="img"'),
        ' olur.',
      ),
      codeBlock('', `icon('trash')                      // süs — gizli
button(icon('trash'), 'Sil')       // konuşan, sözcüğün kendisi

icon('trash', { label: 'Sil' })    // bir görsel olarak duyurulur

// Yalnızca simgeli bir düğme, içindeki glifi değil düğmeyi etiketler
iconButton({ label: 'Sil', icon: icon('trash') })`, 'javascript'),

      h2('Dolu'),
      p(
        code('filled'),
        ' bir glifi çerçevelemek yerine boyar. Her iki durumda da yol aynıdır — yalnızca ',
        code('fill'),
        ' özniteliği değişir — bu yüzden iki biçim dış kenarı tam olarak paylaşır ve birbirinden ayrışamaz.',
      ),
      demo(fillDemo()),
      p('Ve aynı adlar dolu hâlde:'),
      demo(fillDemo({ filled: true })),
      p(
        'Bu, ikinci bir ad kümesi değil de bir prop olarak var; çünkü dolu olma hâli neredeyse her zaman bir ',
        code('durumdur'),
        ' — kaydedildi, beğenildi, puanlandı — dolayısıyla farklı bir dize değil, bir mantıksal değer ister:',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Kaydedildi' : 'Kaydet' })

// bunun yerine
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'Durum glifleri farklı doldurulur, çünkü işaretleri şeklin ',
        code('içinde'),
        ' durur. Daireyi boyamak işareti yutardı, bu yüzden işaret onun içinden oyulur:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'Bunlar ikinci bir çizim taşır — ',
        code('fill-rule: evenodd'),
        ' ile işareti kesilmiş dolu şekil — çünkü bir oyma, bir özniteliği değiştirerek çerçeve yolundan elde edilemez. Dış şekil çerçevenin dış kenarında çizilir, böylece iki biçim yine aynı siluette biter. Her iki durumda da prop aynıdır; bir glifin hangi düzeneği kullandığı kendi bileceği iştir.',
      ),
      p(
        'Bir ok işaretinin boyanacak bir içi hiç yoktur — açık bir çizgidir — bu yüzden köşeleri yuvarlayan çizgiyi koruyarak kendi üç noktasının betimlediği üçgene dolar:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ', ',
        code('filled'),
        ' propuna yanıt veren her şeyi listeler. Dolu biçimi olmayan bir glif onu yok sayar ve çerçeveli kalır — ',
        code('eye'),
        ' glifini doldurmak göz bebeğini, ',
        code('tag'),
        ' glifini doldurmak deliğini yitirirdi, bu yüzden ikisi de öyleymiş gibi yapmaz.',
      ),

      h2('Dönme'),
      p(
        code('spin'),
        ' glifi döndürür — ',
        code('spinner'),
        ' için düşünülmüştür, gerçi bir şey yeniden yüklenirken ',
        code('refresh'),
        ' glifini döndürmenize engel yoktur. ',
        code('prefers-reduced-motion'),
        ' altında durmak yerine sürünecek kadar yavaşlar, çünkü duran bir döndürücü bozuk görünür.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'Kaydediliyor…'),
)`),

      h2('Küme'),
      p(
        'Adlar, yaptıkları işi değil çizimi betimler — ',
        code('error'),
        ' değil ',
        code('x-circle'),
        ' — çünkü aynı çizim birbiriyle ilgisiz işler için kullanılır ve resmi betimleyen bir ad, bu olduğunda da doğru kalır. Aşağıdaki takma adlar yaygın niyetleri karşılar.',
      ),
      gallery(),

      h2('Markalar'),
      p(
        'Kümeyle birlikte sekiz marka işareti gelir — ',
        code('facebook'),
        ', ',
        code('google'),
        ', ',
        code('instagram'),
        ', ',
        code('linkedin'),
        ', ',
        code('tiktok'),
        ', ',
        code('whatsapp'),
        ', ',
        code('x-twitter'),
        ' ve ',
        code('youtube'),
        '. Onlar da ',
        code('size'),
        ' ve ',
        code('label'),
        ' alır ve yine ',
        code('currentColor'),
        ' ile çizilir:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Paylaş'),
)`),
      p(
        'Bunlar bu kitaplığın biçemindeki çizimler değil, başkalarının işaretlerinin kopyalarıdır; bu yüzden kitaplığın iki kuralını bilerek çiğnerler: çizgi değil dolu şekillerdir, ki bir logo da odur, ve oranları bu ızgaranın değil markanın oranlarıdır. ',
        code('filled'),
        ' onlar için hiçbir anlam taşımaz — zaten öyleler.',
      ),
      p(
        'Çizimler, onları CC0 ile yayımlayan Simple Icons’tan geliyor. Bu, ticari markayı değil çizimi kapsar: bunları adlandırdıkları şeyi göstermek için kullanın — bir profil bağlantısı, bir paylaşma düğmesi — kendi ürününüzün üzerinde değil.',
      ),
      p(
        code('x'),
        ' değil ',
        code('x-twitter'),
        ' olmasının nedeni, ',
        code('x'),
        ' adının zaten ',
        code('close'),
        ' için bir takma ad olması ve bir kapatma düğmesinin logoya dönüşmesinin tatsız bir sürpriz olacak olmasıdır. ',
        code('twitter'),
        ' de buna çözümlenir.',
      ),

      h2('Takma adlar'),
      p('Bunların her biri yukarıda listelenen bir glifi, daha çok uzanacağınız adla işler:'),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('Kendi simgeleriniz'),
      p(
        code('registerIcons()'),
        ' bir glif ekler ya da yerleşik birini değiştirir. Biçimlendirme, ',
        code('<svg>'),
        ' öğesinin içeriğidir — aynı 24×24 ızgaradaki şekiller, ',
        code('currentColor'),
        ' onlara ulaşsın diye doldurulmamış bırakılmış. Sayfalarınızın içe aktardığı bir modülden bir kez çağırın:',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // Zaten var olan bir ad onu her yerde değiştirir; bir yerleşiği
  // kitaplığı çatallamadan yeniden biçimlendirmenin yolu budur.
  check: '<path d="m5 13 4 4 10-11"/>',
  // Tek bir kapalı şekil, böylece yerleşikler gibi \`filled\` propuna yanıt verebilir.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                  // sizin glifiniz
icon('check')                 // artık bu da sizin

registerIcons({ check: null }) // ve yerleşiğe geri dönüş`, 'javascript'),

      h2('Neden satır içi, neden bir sprite değil'),
      p(
        'Simgeler, bir ',
        code('icons.svg'),
        ' dosyasından ',
        code('<use>'),
        ' ile çekilmek yerine sayfaya işlenir. Bir sprite sayfa başına yüz gzip baytı mertebesinde HTML tasarruf ettirir ve bunun için bir gidiş dönüşe mal olur — yinelenen biçimlendirme tam da gzip’in en iyi olduğu durumdur, yani bir sprite’ın var olma nedeni olan yinelemenin çoğu zaten ayıklanmıştır. Satır içi olmak ayrıca üretilecek bir dosya, yapılandırılacak bir temel yol ve ',
        code('dist'),
        ' içinden kaybolabilecek hiçbir şey olmaması demektir — ',
        code('styles({ inline: true })'),
        ' işlevinin yaptığı takasın aynısı.',
      ),

      h2('Proplar'),
      propsTable([
        ['name', 'string', '', 'Hangi glif. Bunun yerine ilk argüman olarak da geçirilebilir.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'Bir belirteç ya da herhangi bir CSS uzunluğu. Varsayılan 1em’dir.'],
        ['label', 'string', '', 'Gizlemek yerine bu adla bir görsel olarak duyurur.'],
        ['spin', 'boolean', 'false', 'Sürekli döndürür.'],
        ['filled', 'boolean', 'false', 'Glifi çerçevelemek yerine boyar. Doldurulamayan glifler bunu yok sayar.'],
      ]),
      p(
        'Bilinmeyen bir ad hata fırlatmak yerine hiçbir şey işlemez — süse dair bir prop bir derlemeyi düşürebilmemelidir. ',
        code('hasIcon(name)'),
        ' birinin var olup olmadığını söyler, ',
        code('iconNames()'),
        ' hepsini listeler, ',
        code('fillableIcons()'),
        ' ise ',
        code('filled'),
        ' propunu alanları.',
      ),
    ],
  })
