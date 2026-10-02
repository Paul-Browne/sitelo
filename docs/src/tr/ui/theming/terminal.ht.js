import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Bir sistem konsolu: siyah üzerinde tek bir eş aralıklı yazı tipi, ince çizgili paneller, kalın büyük harfli etiketler ve seçilen her şeyin ters renkle gösterildiği bir camgöbeği vurgu.',
    activeHref: '/tr/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' bir sistem konsoludur: siyah bir zemin üzerinde tek bir eş aralıklı yazı tipi, başlığı bir çizgiyle ayrılmış ince çizgili paneller ve her etiket — bir düğme, bir alanın açıklaması, bir sekme, bir sütun başlığı — kalın, aralıklı büyük harflerle. Camgöbeği vurgu rengidir: başlıklar, panel başlıkları, dolgulu düğme, odak ve seçilen her şey; seçilen şey, bir terminalin bir satırı vurguladığı gibi ters renkle, camgöbeği üzerine koyu olarak basılır. Diğer paletler durum renkleridir — yeşil, sarı ve kırmızı — ve çerçeveli bir düğme ya da etiket, çizgisi ve yazısıyla birlikte kendi renginde çizilir. Hiçbir şey yuvarlatılmaz ve hiçbir şey gölge düşürmez. Koyu kip özgün görünümdür; açık kip her çizgiyi, her büyük harfi ve her köşeli kenarı korur ve onları neredeyse beyaz üzerine siyahla basar.',
      ),
      presetPreview('terminal'),

      h2('Kullanım'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Sitem'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-176ac9d8.css">`, 'javascript'),
      p(
        'Sayfanın kendisini de bununla dizin — zeminini, metin rengini ve yazı tipini — bileşenler de yukarıdaki gibi onun üzerine oturur. Hazır ayar, sayfa JetBrains Mono, IBM Plex Mono ya da Source Code Pro’dan birini yüklüyorsa onu, yüklemiyorsa sistemin eş aralıklı yazı tipini kullanır; kendisi hiçbir şey indirmez.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Kendi renkleriniz'),
      p(
        code('theme()'),
        ' üstünde çalışmayı sürdürür, yani bir hazır ayar bir çatal değil, bir başlangıç noktasıdır — burada vurgu rengi fosfor kehribarına döner. Bu hazır ayar kendine ait iki belirteç ekler: ',
        code('--su-tm-tracking'),
        ', büyük harfli bir etiketin harf aralığı, ve ',
        code('--su-tm-track'),
        ', bir ilerleme çubuğunun ya da kaydırıcının içinde ilerlediği oluk.',
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
