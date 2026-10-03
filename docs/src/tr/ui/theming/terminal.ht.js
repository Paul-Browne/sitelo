import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Bir sistem konsolu: siyah üzerinde tek bir eş aralıklı yazı tipi, ince çizgili paneller, kalın büyük harfli etiketler ve seçimin ters renkle gösterildiği bir camgöbeği vurgu.',
    activeHref: '/tr/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' bir sistem konsoludur: siyah bir zemin üzerinde tek bir eş aralıklı yazı tipi, başlığı bir çizgiyle ayrılmış ince çizgili paneller ve her etiket — bir düğme, bir alanın açıklaması, bir sekme, bir sütun başlığı — büyük harflerle, çoğu kalın. Camgöbeği vurgu rengidir: büyük başlıklar, panel başlıkları, dolgulu düğme ve odak. Bir seçim — işaretçinin altındaki tablo satırı, basılı bir bölüm, seçili hap biçimli bir sekme, geçerli sayfa numarası, işaretçinin altındaki menü öğesi — bir terminalin bir satırı vurguladığı gibi ters renkle, camgöbeği üzerine koyu olarak basılır. Başarı, uyarı ve tehlike paletleri durum renkleridir — yeşil, sarı ve kırmızı — ve çerçeveli bir düğme ya da etiket, çizgisi ve yazısıyla birlikte kendi renginde çizilir. Seçenek düğmesi dışında hiçbir şey yuvarlatılmaz ve hiçbir şey gölge düşürmez. Koyu kip özgün görünümdür; açık kip her çizgiyi, her büyük harfi ve her köşeli kenarı korur ve onları neredeyse beyaz üzerine siyahla basar.',
      ),
      presetPreview('terminal'),

      h2('Kullanım'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Sitem'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-06767808.css">`, 'javascript'),
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
        ' üstünde çalışmayı sürdürür, yani bir hazır ayar bir çatal değil, bir başlangıç noktasıdır — burada vurgu rengi, çizildiği çizgilerle birlikte fosfor kehribarına döner. Bu hazır ayar kendine ait üç belirteç ekler: ',
        code('--su-tm-tracking'),
        ', bir etiketin büyük harfleri arasındaki aralık; ',
        code('--su-tm-track'),
        ', bir ilerleme çubuğunun ya da kaydırıcının içinde ilerlediği oluk; ve ',
        code('--su-tm-field'),
        ', bir alanın çevresindeki çizgi; koyu kipte panellerle aynı soluk gridir — alan kenarlarının daha belirgin olmasını istiyorsanız açın.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    {
      primary: {
        base: '#8a5200', hover: '#734400', active: '#5c3600',
        soft: '#f6e6cc', softHover: '#efd9b3', softFg: '#4d2e00',
        border: '#c9a066', ring: 'rgba(138, 82, 0, 0.3)',
      },
    },
    {
      dark: {
        primary: {
          base: '#ffb000', hover: '#ffd480', active: '#e69e00',
          soft: '#33260d', softHover: '#45330f', softFg: '#ffd480',
          border: '#d99600', ring: 'rgba(255, 176, 0, 0.4)',
        },
      },
    },
  ),
)`, 'javascript'),
    ],
  })
