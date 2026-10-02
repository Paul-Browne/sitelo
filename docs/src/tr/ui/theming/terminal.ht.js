import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Koyu lacivert bir zemin üzerinde tek bir eş aralıklı yazı tipi, Advent of Code’daki gibi: köşeli parantez içinde eylemler, yeşil bağlantılar ve yanan şeylerde bir parıltı.',
    activeHref: '/tr/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ', koyu lacivert bir zemin üzerinde tek bir eş aralıklı yazı tipidir ve Advent of Code gibi dizilir: gri metin, üzerine gelindiğinde parlayan yeşil bağlantılar, önemli olan için beyaz ve yanan birkaç öğede kendi renginde bir parıltı. Bir eylem köşeli parantez içinde bir sözcüktür, ',
        code('[Kaydet]'),
        '; bir onay kutusu ',
        code('[X]'),
        ' olana kadar ',
        code('[ ]'),
        ' olarak görünür ve ikinci düzey bir başlık ',
        code('--- Başlık ---'),
        ' biçiminde çizgilerle ayrılır. Hiçbir şey yuvarlatılmaz ve hiçbir şey yumuşak bir gölgenin üzerinde süzülmez: bir kenar bir çizgidir ve yükseltilmiş bir kart çift çizgiyle çerçevelenir. Koyu kip özgün görünümdür; açık kip yazı tipini, parantezleri ve köşeli kenarları korur ve onları soluk kâğıt üzerine lacivertle basar, parıltı olmadan.',
      ),
      presetPreview('terminal'),

      h2('Kullanım'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Sitem'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        'Sayfanın kendisini de bununla dizin — zeminini, grisini ve yazı tipini — bileşenler de yukarıdaki gibi onun üzerine oturur. Hazır ayar, sayfa yüklüyorsa Source Code Pro’yu, yüklemiyorsa sistemin eş aralıklı yazı tipini kullanır; kendisi hiçbir şey indirmez.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Kendi renkleriniz'),
      p(
        code('theme()'),
        ' üstünde çalışmayı sürdürür, yani bir hazır ayar bir çatal değil, bir başlangıç noktasıdır. Parıltı, üzerinde bulunduğu metnin renginde çizilir; bu yüzden değiştirdiğiniz bir palet yeni renginde parlar — burada ana renk, eski bir terminaldeki gibi kehribara döner. Başarı rengi bir yıldızın altın rengidir; örnek alınan site çözülmüş bir bulmacayı böyle işaretler. İsterseniz aynı yolla ona yeşil verin. Bu hazır ayar kendine ait iki belirteç ekler: ',
        code('--su-tm-bright'),
        ', başlıkların ve seçilen her şeyin beyazı, ve ',
        code('--su-tm-glow'),
        ', yanan öğelerin taşıdığı gölge; açık kipte ',
        code('none'),
        ' değerindedir.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    { primary: { base: '#8a5200', hover: '#734400', active: '#5c3600', soft: '#f6e6cc', softFg: '#4d2e00' } },
    { dark: { primary: { base: '#ffb000', hover: '#ffd480', active: '#e69e00', soft: '#33260d', softFg: '#ffd480' } } },
  ),
)`, 'javascript'),
    ],
  })
