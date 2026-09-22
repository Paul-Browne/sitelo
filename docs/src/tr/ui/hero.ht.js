import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Hero',
    description:
      'Bir açılış sayfasının tepesi: bir manşet, bir cümle ve bu konuda ne yapılacağı.',
    activeHref: '/tr/ui/hero',
    children: [
      p(
        'Hero, bir tanıtım ya da belge ana sayfasındaki ilk şeydir. İçinde bir ',
        code('<h1>'),
        ' bulunan bir ',
        code('<section>'),
        ' işler — yani sayfanın başlığıdır, rastgele büyük olmuş süslü bir afiş değil.',
      ),

      h2('Temel hero'),
      demo(`hero({
  level: 2,
  title: 'Framework olmadan statik siteler',
  description: 'HTML döndüren fonksiyonlar yazın. Eksiksiz bir site alın.',
},
  button({ size: 'lg' }, 'Başlayın'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Belgeleri okuyun'),
)`, { align: 'stretch' }),

      h2('Bir üst satırla'),
      p('Başlığın üstünde kısa bir satır — bir sürüm, bir kategori, bir duyuru.'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Artık bir bileşen kitaplığıyla',
  description: 'Yetmiş bileşen, çalışma zamanı yok, isteğe bağlı tek bir betik.',
},
  button({ size: 'lg', href: '/ui' }, 'Bileşenlere göz atın'),
)`, { align: 'stretch' }),

      h2('Sola hizalı'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Açık kaynak',
  title: 'Açıkta geliştirildi',
  description: 'MIT lisanslı ve bir öğleden sonrada okunacak kadar küçük.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub’da görüntüle'),
)`, { align: 'stretch' }),

      h2('Ortamla birlikte'),
      p(
        code('media'),
        ' geçirmek, yer olduğunda iki sütuna geçer ve dar bir ekranda tekrar tek sütuna yığılır. ',
        code('mockup()'),
        ' ile doğal biçimde eşleşir.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Çalışırken görün',
  description: 'Her sayfa, tarayıcıya ulaştığında artık statik HTML’dir.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Merhaba dünya'),
      text({ variant: 'small', tone: 'muted' }, 'Derleme sırasında işlendi.'),
    ),
  ),
},
  button('Başlayın'),
)`, { align: 'stretch' }),

      h2('Bir kapsayıcının içinde'),
      p(
        'Hero’nun kendine ait bir genişlik sınırı yoktur — sayfadaki geri kalan her şeyle hizalansın diye onu bir ',
        code('container()'),
        ' içine koyun.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'Kapsanmış',
    description: 'Genişliği kapsayıcı belirler; ritmi hero belirler.',
  }),
)`, { align: 'stretch' }),

      h2('Başlık düzeyi'),
      p(
        'Başlık varsayılan olarak sayfanın ',
        code('<h1>'),
        ' öğesidir; bir açılış sayfası için doğru olan budur. Bir sayfanın ortasında kullanılan bir hero sayfa başlığı değildir, bu yüzden onu ',
        code('level'),
        ' ile düşürün — bu sayfadaki her tanıtım öyle yapar, çünkü sayfanın zaten kendi h1 öğesi var.',
      ),

      h2('Yalnızca bir başlık'),
      p('Her parça isteğe bağlıdır ve boş olan hiçbir şey işlenmez.'),
      demo(`hero({ level: 2, title: 'Belgeler' })`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['eyebrow', 'Child', '', 'Başlığın üstünde küçük, büyük harfli satır.'],
        ['title', 'Child', '', 'Sayfanın h1 öğesi olarak işlenir.'],
        ['description', 'Child', '', 'Altındaki cümle.'],
        ['media', 'Child', '', 'Geniş ekranda metnin yanında, dar ekranda üstünde.'],
        ['align', "'center' | 'start'", "'center'", 'Ortam yokken metin hizalaması.'],
        ['level', 'number', '1', 'Başlık için başlık düzeyi. Sayfanın ortasındaki bir hero için düşürün.'],
        ['as', 'string', "'section'", 'İşlenecek öğe.'],
      ]),
      p('Çocuklar, açıklamanın altında eylem sırası olur.'),
    ],
  })
