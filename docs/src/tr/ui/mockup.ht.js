import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Maket',
    description:
      'Bir çerçeve içinde ekran görüntüsü — tarayıcı, pencere, telefon ya da uçbirim.',
    activeHref: '/tr/ui/mockup',
    children: [
      p(
        'Bir açılış sayfasında ürün ya da belgelerde ekran görüntüsü göstermek için. Çerçeve süstür: noktalar, adres çubuğu ve çentik hepsi ',
        code('aria-hidden'),
        ' taşır, böylece bir ekran okuyucu süsün betimini değil içerideki şeyi alır.',
      ),

      h2('Tarayıcı'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Merhaba dünya'),
      text({ variant: 'small', tone: 'muted' }, 'Derleme sırasında işlendi, statik dosya olarak sunuldu.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Pencere'),
      p('Adres çubuğu olmayan aynı çerçeve; bir web sayfası olmayan her şey için.'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'URL’i olmayan bir pencere.'),
  ),
)`, { align: 'stretch' }),

      h2('Trafik ışıkları'),
      p(
        'Düğmeler varsayılan olarak temayı izler. ',
        code("dots: 'mac'"),
        ' onları bunun yerine macOS kırmızı, sarı ve yeşiliyle boyar — her iki temada da aynı üçü, çünkü varlık nedenleri tanınabilir olmaktır.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Daha önce gördüğünüz bir pencere.'),
  ),
)`, { align: 'stretch' }),

      h2('Uçbirim'),
      p(
        code('code'),
        ' türevi, bir uçbirim gibi her iki temada da koyudur.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ 1,09 sn’de derlendi</div>' +
  '<div style="opacity: .7">  204 sayfa · 9,7 MB</div>',
)`, { align: 'stretch' }),

      h2('Telefon'),
      p(
        'Güncel bir telefon: çerçeveye oyulmuş bir çentik değil, kenarlıktan ayrı duran bir Dynamic Island. Ekranın üstünde ona yer bırakın.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Statik siteler, framework yok.'),
      button({ size: 'sm', block: true }, 'Başlayın'),
    ),
  ),
)`),

      h2('Çerçeve ve ada'),
      p(
        code('frame'),
        ' dıştaki rayı renklendirir — herhangi bir CSS rengi, böylece bir cihaz kaplaması, bu kitaplığın listesini tutması gereken bir ad değil bir onaltılık değer olur. ',
        code('notch: false'),
        ' adası olmayan her şey için onu bırakır.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('Ekran görüntüsüyle'),
      p(
        'Gövdenin içindeki bir ',
        code('<img>'),
        ' çerçevenin genişliğini doldurur. Görsel geç yükleniyorsa ve sayfa zıplamamalıysa onu ',
        code('aspectRatio()'),
        ' ile eşleştirin.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="sitelo UI galerisi" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Boyutlar'),
      p(
        'Maket varsayılan olarak kabını doldurur. ',
        code('size'),
        ' onu bunun yerine sabit bir genişliğe sabitler. Telefonun kendine ait üç boyutu vardır — 22rem’lik bir telefon tablet olurdu — ve hepsinde oranlarını korur: köşeler, ray ve ada sabit uzunluklar değil, genişliğin kesirleridir.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'varsayılan — tam genişlik'))),
)`, { align: 'stretch' }),

      h2('Bir hero içinde'),
      p(
        'Bunun var olma nedeni olan eşleşme: bir maketi hero’nun ',
        code('media'),
        ' propu olarak geçirin.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Çalışırken görün',
  description: 'Tarayıcıya ulaştığında artık statik HTML.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'Çerçevelenmiş bir sayfa.'),
    ),
  ),
}, button('Başlayın'))`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Hangi çerçevenin çizileceği.'],
        ['url', 'string', '', 'Adres çubuğunda gösterilir. Yalnızca browser türevi.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'Üç düğmenin nasıl göründüğü.'],
        ['frame', 'string', '', 'Dıştaki rayı renklendirir. Herhangi bir CSS rengi. Yalnızca telefon.'],
        ['notch', 'boolean', 'true', 'Dynamic Island çizer. Yalnızca telefon.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Sabit genişlik. Orta boy kabı doldurur.'],
      ]),
    ],
  })
