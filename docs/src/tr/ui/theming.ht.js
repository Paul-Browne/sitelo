import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, presetPreview, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Temalar',
    description:
      'Stil sayfasını sayfaya getirmek ve tek bir çağrıdan her rengi, yarıçapı ve yazı tipini değiştirmek.',
    activeHref: '/tr/ui/theming',
    children: [
      p(
        'Her bileşen aynı özel özellikleri okur, bu yüzden bir tema ',
        code(':root'),
        ' üzerindeki bir dizi geçersiz kılmadır — derleme adımı yok, yapılandırma dosyası yok ve kendisine bundan söz edilmesi gereken bir bileşen yok.',
      ),

      h2('Stilleri içeri almak'),
      p(
        code('styles()'),
        ', tarayıcının sitenin her sayfasında önbelleğe aldığı tek bir dosyaya bir ',
        code('<link>'),
        ' döndürür. Yapılandırılacak ve kopyalanacak bir şey yoktur: sitelo’nun eklentisi onu geliştirmede sunar ve bileşen çalışma zamanıyla aynı temelde derlemeye yazar.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Sitem'),
  styles(),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">`, 'javascript'),
      p(
        'Ad, içeriğin bir özetini taşır, bu yüzden onu ',
        code('immutable'),
        ' olarak sunup yine de bir değişiklik yayımlayabilirsiniz. Düz bir ',
        code('/su/ui.css'),
        ' için ',
        code('{ hash: false }'),
        ' geçirin ya da bağlantıyı kendi barındırdığınız bir kopyaya yöneltmek için ',
        code('base'),
        ' kullanın.',
      ),
      p(
        code('{ inline: true }'),
        ' bunun yerine bütün sayfayı bir ',
        code('<style>'),
        ' içine koyar — her sayfada gzip ile yaklaşık 11 kB, ama fazladan istek yok ve ',
        code('dist/'),
        ' içinden kaybolabilecek hiçbir şey yok. Tek bir sayfa için daha iyi takas budur; bağlantı ise isteğini, ziyaretçinin okuduğu ikinci sayfada geri kazanır.',
      ),
      codeBlock('src/index.ht.js', `head(
  title('Sitem'),
  styles({ inline: true }),
)`, 'javascript'),
      p(
        'Ailenin geri kalanı size parçaları verir. ',
        code('stylesheet()'),
        ' ham CSS’i bir dize olarak döndürür — sayfayı sitelo’nun ulaşamadığı bir yerde barındırmak ya da onu kendiniz bir yere yazmak için — ',
        code('stylesUrl()'),
        ' ise kendinize ait bir link öğesi için yalnızca href değerini.',
      ),

      h2('Hazır ayarlar'),
      p(
        'Bir hazır ayar, bütün görünümü tek seferde değiştirir. ',
        code("styles({ preset: 'neumorphism' })"),
        ' çekirdek stil sayfasının hemen ardından ikinci bir stil sayfası bağlar — aynı koşullarla sunulur, hash’lenir ve önbelleğe alınır — ve sayfadaki her bileşen, işaretlemede hiçbir şey değiştirmeden onu izler.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Sitem'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      presetPreview('neumorphism'),
      p(
        code('neumorphism'),
        ' bir soft UI’dır: her yüzey sayfanın kendisidir ve bir denetim yalnızca ışık ve gölgeyle öne çıkar — sayfadan kabarık ya da içine bastırılmış olarak. Bu tarzın genellikle vazgeçtiği iki şeyi korur, WCAG AA’yı geçen metni ve odak çerçevesini; koyu kipi de her şey gibi izler. Ancak sayfanın kendi arka planının ',
        code('var(--su-bg)'),
        ' olmasını gerektirir, çünkü etki ikisinin aynı renk olmasına dayanır.',
      ),
      p(
        code('glassmorphism'),
        ' buzlu camdır: her yüzey, arkasındakini bulanıklaştıran, kenarına ışık vuran yarı saydam bir paneldir. Cam ancak bir şeyin üstünde camdır, bu yüzden sayfanın arka planının ',
        code('var(--su-glass-ground)'),
        ' olmasını gerektirir — arkasına sabitlenmiş üç renk bulutuyla sayfanın rengi. Metin, bir panelin üstünde durabileceği en açık renge karşı ölçülür; sayfanın kendi metninin üstünde süzülen her şey neredeyse opak buzlanır; daha az saydamlık isteyen okur da aynı panelleri durgun bir zemin üstünde görür.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-glass-ground);
}`, 'css'),
      presetPreview('glassmorphism'),
      p(
        code('theme()'),
        ' üstünde çalışmayı sürdürür, yani bir hazır ayar bir çatal değil, bir başlangıç noktasıdır. İki hazır ayar da her palete onuncu bir yuva ekler, ',
        code('glow'),
        ' — bir ilerleme çubuğunun ya da anahtarın ucunda eridiği renk — böylece yeni bir birincil renk kendi rengini getirebilir.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
      p(
        code('inline'),
        ' iki stil sayfasını da satır içine gömer, ',
        code('stylesheet({ preset })'),
        ' ikisini tek bir dize olarak döndürür, hazır ayar olmayan bir ad ise var olanları listeleyen bir hata fırlatır.',
      ),

      h2('Belirteçleri geçersiz kılmak'),
      p(
        code('theme()'),
        ' geçersiz kılmaları yazar. Anahtarlar camelCase belirteç adları, palet nesneleri ya da düz özel özelliklerdir — ve ',
        code('styles()'),
        ' işlevinden ',
        code('sonra'),
        ' gelir, böylece kazanır.',
      ),
      codeBlock('src/index.ht.js', `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', active: '#3f3fb0', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }),
)`, 'javascript'),
      h2('Kapsamlı temalar'),
      p(
        'Bir ',
        code('selector'),
        ', geçersiz kılmaları bütün sayfa yerine bir alt ağaçla sınırlar. Aşağıdaki üç panelin yaptığı budur — aynı bileşenler, üç farklı palet, tek bir sayfa.',
      ),
      demo(`fragment(
  theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff', soft: '#e6e6fa', softFg: '#33338f', border: '#b9b9ee' } }, { selector: '.theme-indigo' }),
  theme({ primary: { base: '#b0357a', hover: '#962e68', fg: '#ffffff', soft: '#fbe4f0', softFg: '#7d1f53', border: '#f0a9ce' } }, { selector: '.theme-pink' }),
  theme({ radiusMd: '999px', radiusLg: '1.5rem' }, { selector: '.theme-round' }),
  grid({ min: '11rem' },
    div({ class: 'theme-indigo' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'çivit'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-pink' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'pembe'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-round' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'yuvarlak'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Koyu kip'),
      p(
        'Koyu, kendi başına ',
        code('prefers-color-scheme'),
        ' değerinden çözülür. Herhangi bir atada açıkça verilmiş bir ',
        code('light'),
        ' ya da ',
        code('dark'),
        ' değerli ',
        code('data-theme'),
        ' veya ',
        code('data-su-theme'),
        ' bunu geçersiz kılar — bu sitedeki tanıtımların üst çubuktaki değiştiriciyi izlemesinin yolu budur.',
      ),
      p(
        'Yalnızca orada geçerli olması gereken geçersiz kılmalar için ',
        code('dark'),
        ' geçirin. Özniteliği ve medya sorgusunu bir çırpıda kapsar.',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('Geçersiz kılınabilecekler'),
      p(
        'Her biri dokuz yuvalı beş palet, bir boşluk ölçeği, yazı, yarıçaplar, gölgeler ve yüzey renkleri. Her biri bir özel özelliktir — stil sayfasını ya da tarayıcınızın denetleyicisini açın, hepsi ',
        code(':root'),
        ' üzerindedir.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    ...['primary', 'neutral', 'success', 'warning', 'danger'].map((color) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: 3.5rem; height: 2rem; border-radius: 0.4rem; background: var(--su-' + color + ')' }),
        text({ variant: 'caption', tone: 'muted' }, color),
      ),
    ),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true, align: 'flex-end' },
    ...['xs', 'sm', 'md', 'lg', 'xl'].map((step) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: var(--su-space-' + step + '); height: 2rem; border-radius: 0.2rem; background: var(--su-neutral)' }),
        text({ variant: 'caption', tone: 'muted' }, step),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Adlandırma'),
      p(
        'camelCase bir anahtar, kebab-case bir özellik olur: ',
        code('radiusMd'),
        ' şudur: ',
        code('--su-radius-md'),
        ', ',
        code('fontSans'),
        ' şudur: ',
        code('--su-font-sans'),
        '. İç içe bir nesne de aynı biçimde açılır — ',
        code('{ primary: { softFg: … } }'),
        ' şunu ayarlar: ',
        code('--su-primary-soft-fg'),
        ' — ve zaten ',
        code('--'),
        ' ile başlayan bir anahtar tam olarak yazıldığı gibi kullanılır; bu, eşlemenin kapsamadığı her şey için kaçış kapısıdır.',
      ),
      p(
        'Bir paletin dokuz yuvası vardır: ',
        code('base'),
        ', ',
        code('hover'),
        ', ',
        code('active'),
        ', ',
        code('fg'),
        ', ',
        code('soft'),
        ', ',
        code('softHover'),
        ', ',
        code('softFg'),
        ', ',
        code('border'),
        ' ve ',
        code('ring'),
        '. Yalnızca değiştirdiklerinizi ayarlayın.',
      ),

      h2('Karşıtlık'),
      p(
        'Paketle gelen paletler, her iki temada da üzerinde durdukları yüzeylere karşı WCAG AA’yı geçer ve depoda, bu doğru olmaktan çıkarsa derlemeyi düşüren bir test vardır. Kendi temanız bunun kapsamında değildir — yayımlamadan önce ',
        code('fg'),
        ' değerinizi ',
        code('base'),
        ' değerinize karşı denetleyin.',
      ),

      h2('Proplar'),
      p(code('styles()'), ':'),
      propsTable([
        ['preset', "'glassmorphism' | 'neumorphism'", '', 'Her bileşeni bir hazır ayarla yeniden biçimlendirir; çekirdek stil sayfasından sonra bağlanır ya da satır içine gömülür.'],
        ['inline', 'boolean', 'false', 'Ona bir bağlantı yerine CSS’in kendisini üretir.'],
        ['hash', 'boolean', 'true', 'Dosya adını içerikle özetler. Yalnızca bağlantılı.'],
        ['base', 'string', "'/su/'", 'URL’i başka yere yöneltir; o kopyayı siz barındırırsınız. Yalnızca bağlantılı.'],
        ['minify', 'boolean', 'true', 'Yorumları ve boşlukları ayıklar. Yalnızca satır içi.'],
        ['nonce', 'string', '', 'Üretilen öğe için CSP nonce değeri.'],
      ]),
      p(
        code('stylesUrl()'),
        ' şunları alır: ',
        code('base'),
        ' ve ',
        code('hash'),
        '; ',
        code('stylesheet()'),
        ' ise ',
        code('minify'),
        ' ve ',
        code('preset'),
        '.',
      ),
      p(code('theme(tokens, options)'), ':'),
      propsTable([
        ['selector', 'string', "':root'", 'Geçersiz kılmaları bir alt ağaçla sınırlar.'],
        ['dark', 'object', '', 'Yalnızca koyu kipte uygulanan geçersiz kılmalar.'],
        ['nonce', 'string', '', 'CSP nonce değeri.'],
      ]),
    ],
  })
