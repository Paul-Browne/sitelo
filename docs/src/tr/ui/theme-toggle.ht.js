import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Tema değiştirici',
    description:
      'Bir açık/koyu anahtarı; kaydedilmiş bir seçimin girişte parlamasını önleyen satır içi betikle birlikte.',
    activeHref: '/tr/ui/theme-toggle',
    children: [
      p(
        'sitelo-ui koyu kipi kendi başına ',
        code('prefers-color-scheme'),
        ' değerinden çözer — işletim sistemini izlemekten memnun bir sitenin bu sayfadan bir şeye ihtiyacı yoktur. Değiştirici, okurun bunu geçersiz kılmasına izin vermek içindir.',
      ),
      p(
        'Betiğe ihtiyaç duyan beş bileşenden biridir, çünkü seçim ',
        code('localStorage'),
        ' içinde yaşar ve onu yalnızca bir betik okuyabilir. Düğme o betiği ilk basışta kendisi getirir.',
      ),

      h2('Kurulum'),
      p('Head içinde iki şey ve düğme, ait olduğu yerde:'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // kaydedilmiş seçimi ilk boyamadan önce uygular
  styles(),
)

body(
  appBar({ brand: 'Sitem' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        'Üçüncü bir dosya yoktur. ',
        code('themeScript()'),
        ' bilerek engelleyici ve satır içidir — ertelenen her şey önce boyar, ki bu da tam olarak önlemek için var olduğu koyu parlamadır — ve çevirmenin kendisi düğmenin üzerinde gider:',
      ),
      codeBlock('İşlenen biçimlendirme', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        'İkisini eşleştirin. ',
        code('themeScript()'),
        ' aynı zamanda değiştiriciyi yüklemede ',
        code('aria-pressed'),
        ' olarak işaretleyen şeydir: henüz hiçbir şeye basılmamıştır, bu yüzden düğmenin kendisi hangi temanın çözüldüğünü bilemez.',
      ),

      h2('Değiştirici'),
      p(
        'Simge saf CSS’tir, doğrudan tema özniteliğinden okunur — bu yüzden herhangi bir betik çalışmadan, ilk boyamada zaten doğrudur. Bir tıklamanın hangi temaya geçeceğini gösterir.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Bu düğmeler çalışır — bu sayfa çalışma zamanını yükler. Birine tıklamak ',
        code('<html>'),
        ' üzerinde sitelo-ui’nin kendi özniteliği olan ',
        code('data-su-theme'),
        ' değerini ayarlar, bu yüzden yalnızca bu sayfadaki sitelo-ui bileşenleri değişir. Bu sitenin geri kalanı, üst çubuktaki değiştiricinin ayarladığı kendi ',
        code('data-theme'),
        ' değerini izler. Sizin sitenizde bunlardan yalnızca biri olurdu.',
      ),

      h2('Bir uygulama çubuğunda'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Belgeler')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Başlayın'),
  ),
)`, { align: 'stretch' }),

      h2('Tema nasıl çözülür'),
      p(
        'Sırayla: herhangi bir atadaki açık bir ',
        code('data-theme'),
        ' ya da ',
        code('data-su-theme'),
        ' kazanır; o yoksa ',
        code('prefers-color-scheme'),
        ' karar verir. Her iki öznitelik adı da onurlandırılır, böylece sitelo-ui zaten kendi tema değiştiricisi olan bir sitenin içinde durabilir — bu belgelerin yaptığı tam olarak budur.',
      ),

      h2('Kendiniz sürmek'),
      p(
        'Çalışma zamanı, özel bir denetim ya da üç yönlü açık / koyu / sistem seçici için düğmenin kullandığı fonksiyonların aynısını dışa aktarır.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — kaydedilmiş değil, çözülmüş
toggleTheme()       // çevir
setTheme('dark')    // sabitle
setTheme('system')  // geçersiz kılmayı temizle ve yeniden işletim sistemini izle`, 'javascript'),

      h2('Proplar'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Erişilebilir ad ve ipucu.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Düğme türevi.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Hangi paletten besleneceği.'],
      ]),
      p(
        code('themeScript()'),
        ', içerik güvenlik ilkesi olan bir site için isteğe bağlı bir ',
        code('nonce'),
        ' alır.',
      ),
    ],
  })
