import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/tr.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('tr')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview ve sık kullanılan bayraklar.',
    activeHref: '/tr/docs/cli',
    children: [
      p(
        code('sitelo'),
        ' CLI’ı pakete dahil Vite’ı sarar ve HTML sayfa eklentisini kendiliğinden enjekte eder.',
      ),
      h2('Komutlar'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(code('dev'), ' — dinamik rotalar dahil istek üzerine gerçek SSR işlemesi, artı küçük bir geliştirme araç çubuğu'),
        li(code('build'), ' — ', code('dist/'), ' içinde (ya da kendi ', code('outDir'), ' dizininizde) statik HTML'),
        li(code('preview'), ' — üretim derlemesini yerelde sunar'),
        li(
          code('lighthouse'),
          ' — üretim derlemesini denetler (',
          code('lighthouse'),
          ' eş bağımlılığını gerektirir)',
        ),
      ),
      p(
        'Araç çubuğunu ',
        code('sitelo.config.js'),
        ' içindeki ',
        code('devToolbar: false'),
        ' ile kapatın — bkz. ',
        a({ href: '/tr/docs/configuration' }, 'Yapılandırma'),
        '.',
      ),
      h2('Kullanışlı bayraklar'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(code('--port'), ' / ', code('--host'), ' / ', code('--open'), ' — sunucu'),
        li(code('--outDir'), ' / ', code('--emptyOutDir'), ' / ', code('--base'), ' — derleme'),
        li(code('--root'), ' — proje kökü (bir ', code('docs/'), ' sitesi için kullanışlı)'),
        li(code('--config'), ' — özel Vite yapılandırma dosyası'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Komutlar arasında yeniden kullandığınız her şey için ',
        code('sitelo.config.js'),
        ' içindeki ',
        code('vite'),
        ' altındaki Vite seçeneklerini tercih edin.',
      ),
      h2('Kullanılmayan kodu bulmak'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ', hiçbir şeyin kullanmadığı dosyaları, dışa aktarımları ve bağımlılıkları bulur. Bir sitelo projesinde tek bir ipucuna ihtiyacı vardır: sayfalar ve adalar dosya sisteminden keşfedilir, dolayısıyla onları hiçbir şey içe aktarmaz; aksi söylenmezse knip bütün siteyi kullanılmayan dosya olarak bildirir.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ', ',
        code('sitelo.config.js'),
        ' dosyanızı okur ve sayfaları ile adaları derlemenin keşfettiği biçimde giriş noktası olarak işaretler — ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ' ve ',
        code('exclude'),
        ' hepsi geçerlidir. Raporda kalan şey, sitenin gerçekten hiç ulaşmadığı koddur.',
      ),
      p(
        'Göremediği tek şey: bir sayfanın içe aktarma yerine URL ile başvurduğu istemci betiği, örneğin ',
        code('<script src="/js/app.js">'),
        '. Bunları kendiniz listeleyin ve knip’in kabul ettiği diğer her şeyi de yanına geçirin — sonuca yayılır. Sondaki ',
        code('!'),
        ' knip’in üretim kodu işaretidir; tarayıcıya gönderilen bir betik de tam olarak odur.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
