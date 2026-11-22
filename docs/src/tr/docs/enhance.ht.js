import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/tr.js'
import { enhanceSnippets } from '../../lib/snippets/enhance.js'

const s = enhanceSnippets('tr')

export default () =>
  docsLayout({
    title: 'Geliştirmeler',
    description:
      'Sunucuda işlenmiş işaretlemeyi, yalnızca onu kullanan sayfalarda yüklenen küçük bir tarayıcı modülüne devredin.',
    activeHref: '/tr/docs/enhance',
    children: [
      p(
        'Bazı etkileşimlerin tarayıcıda çalışması gerekir: bir sayaç, bir kopyala düğmesi, siz yazarken kendini denetleyen bir form. ',
        code('enhance()'),
        ', bir modülün devralması gereken işaretlemeyi işaretler. Sunucu HTML’i her zamanki gibi işler, yani JavaScript gelmeden önce de çalışır; tarayıcı modülü yalnızca onu kullanan sayfalarda yükler. Modül bulduğu DOM’a davranış ekler. Hidrasyon yok, framework çalışma zamanı yok.',
      ),
      p(
        'Bir ',
        a({ href: '/tr/docs/islands' }, 'sunucu adası'),
        ', sayfa görüntülendiğinde bir bölgeyi sunucuda işler. Bir geliştirme ise bir bölge için tarayıcıda kod çalıştırır. İkisi aynı argümanları alır ve birlikte çalışır.',
      ),
      h2('Modülü yazın'),
      p(
        'Bir geliştirme, ',
        code('src/'),
        ' altında herhangi bir yerde duran sıradan bir modüldür. Varsayılan dışa aktarımı öğeyi ve prop’ları alır. İhtiyacınız olanı, sunucunun zaten işlediği işaretlemeden okuyun:',
      ),
      codeBlock('src/client/counter.js', s.counterModule, 'javascript'),
      p(
        'TypeScript da çalışır. İşlevi ',
        code('sitelo/enhance/client'),
        ' içindeki ',
        code('Enhancer<Props>'),
        ' ile tipleyin.',
      ),
      h2('Sayfaya yerleştirin'),
      p(
        code('enhance()'),
        ' işlevini ',
        code('sitelo/enhance'),
        ' içinden içe aktarın. ',
        code('island()'),
        ' ile aynı argümanları alır: bir ad, prop’lar, HTML ve seçenekler. HTML, modülün aldığı bir ',
        code('<div>'),
        ' içine girer.',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      p(
        'JSX bir işlevin döndürdüğü dizeyi kaçışlar; bu yüzden JSX sekmesi onun yerine ',
        code('enhanceAttributes()'),
        ' değerini öğenin üzerine yayar. Ayrıntısı aşağıda.',
      ),
      h2('Modülleri kaydedin'),
      p(
        'Sayfanın bağladığı betik, adları modüllere eşleyen bir nesneyi ',
        code('mountEnhancements()'),
        ' işlevine verir:',
      ),
      codeBlock('src/enhance.js', s.registry, 'javascript'),
      p(
        'Bu eşlemeyi bilerek elle yazarsınız. Her ',
        code('import()'),
        ' sıradan bir dinamik içe aktarmadır; bu yüzden derleme her modüle kendi parçasını (chunk) verir ve bir sayfa yalnızca öğelerinin adını verdiği modülleri indirir. Geliştirme sırasında Vite onları olduğu gibi sunar. Sıradan kod olduğu için TypeScript onu denetler, knip de izler.',
      ),
      p(
        'Bir modülün ne zaman içe aktarılacağını ',
        code('when'),
        ' ile belirleyin. Bir adayla aynı değerleri alır:',
      ),
      codeBlock('enhance-when', s.strategy, 'js'),
      ul(
        { class: 'docs-list' },
        li(code("'load'"), ' (varsayılan) — sayfa yüklenir yüklenmez'),
        li(code("'idle'"), ' — ', code('requestIdleCallback'), ' ile (desteklenmezse bir zaman aşımına düşer)'),
        li(
          code("'visible'"),
          ' — öğe görünüme kaydığında, IntersectionObserver ile. ',
          code('rootMargin'),
          ' erkenden başlatır, varsayılanı ',
          code("'200px'"),
        ),
      ),
      h2('Kendi öğeniz'),
      p(
        code('enhance()'),
        ' işaretlemenin çevresine bir ',
        code('<div>'),
        ' koyar. Öğenin kendisi önemli olduğunda, örneğin kendi ',
        code('action'),
        ' değeri olan bir ',
        code('<form>'),
        ', öznitelikleri ',
        code('enhanceAttributes(name, props, options)'),
        ' ile doğrudan onun üzerine koyun. Bu bir öznitelik nesnesidir; javascript-to-html ve JSX onu öznitelik olarak kabul eder, bir şablon dizesinin içinde ise öznitelik metnine dönüşür:',
      ),
      pageCodeTabs({
        file: 'src/search.ht.js',
        template: s.formTemplate,
        ht: s.formHt,
        jsx: s.formJsx,
      }),
      p('Modül formun kendisini alır:'),
      codeBlock('src/client/search.js', s.searchModule, 'javascript'),
      h2('Prop olarak ne verilmeli'),
      p(
        'Prop’lar sayfaya yazılan ve modüle ikinci argüman olarak verilen JSON’dur. Sayfadaki her öğe kendi kopyasını taşır; bu yüzden yalnızca işaretlemenin zaten söylemediğini verin: HTML’de doğal bir yeri olmayan bir ayar, yukarıdaki ',
        code('minLength'),
        ' gibi. Sayfanın gösterdiği bir değeri, sayacın başlangıç sayısı gibi, DOM’dan okumak daha iyidir; böylece ikisi birbirinden ayrışamaz. Büyük veriler HTML’in kendisine ya da modülün getirdiği bir dosyaya aittir.',
      ),
      p(
        'Ada prop’larının aksine bunlar asla bir sunucuya geri gitmez, bu yüzden imzalanacak bir şey yoktur. Yine de sayfa kaynağındadırlar, o yüzden içlerine sır koymayın.',
      ),
      h2('Derlemede denetlenir'),
      p(
        'Derleme, eşlemeyi ',
        code('mountEnhancements()'),
        ' çağrılarınızdan okur ve eşlemede olmayan bir geliştirmenin adını veren bir sayfada başarısız olur:',
      ),
      codeBlock('sitelo build', s.buildError, 'text'),
      p(
        code("missingAssets: 'warn'"),
        ' bunu, eksik bir betikte olduğu gibi bir uyarıya çevirir; ',
        code('sitelo'),
        ' (geliştirme) ise her sayfayı işlerken uyarır. Derlemenin eşlemeyi okuyabilmesi gerekir; bu yüzden onu çağrının içinde bir nesne sabiti olarak ya da aynı dosyada bir ',
        code('const'),
        ' olarak yazın. Çalışma zamanında oluşturulan bir eşleme, yayma (spread) ile ya da başka bir modülden içe aktarılarak, okunamaz ve o zaman hiçbir şey denetlenmez. Sunucu adalarının içindeki geliştirmeler istek anında işlenir, bu yüzden derleme onları da görmez.',
      ),
      h2('Durum ve hatalar'),
      p(
        'Her öğenin ',
        code('data-sitelo-enhance-state'),
        ' değeri ',
        code('pending'),
        ' (sırasını bekliyor), ',
        code('loading'),
        ' ve ',
        code('ready'),
        ' aşamalarından geçer. Modül yüklenemezse ya da hata fırlatırsa durum ',
        code('error'),
        ' olur, sunucunun işaretlemesi olduğu gibi kalır ve hata ',
        code('mountEnhancements(modules, { onError })'),
        ' işlevine ya da konsola gider. Modül geldikten sonra sayfanın değişmesi gerekiyorsa durumu CSS’te kullanın:',
      ),
      codeBlock('styles.css', s.stateCss, 'css'),
      h2('Bilmekte yarar var'),
      ul(
        { class: 'docs-list' },
        li(
          'Aynı geliştirme bir sayfada istediğiniz kadar bulunabilir. Modül bir kez indirilir ve her öğe için bir kez çalışır; bu yüzden öğeye özgü durumu işlevin içinde tutun ve tüm belgede değil, ',
          code('element.querySelector()'),
          ' ile arayın.',
        ),
        li(
          'Bir sunucu adasının içindeki geliştirme, adanın HTML’i geldiğinde bağlanır: ada yükleyicisi ',
          code('sitelo:island-load'),
          ' olayını gönderir, ',
          code('mountEnhancements()'),
          ' de onu dinler. İki yükleyiciyi de aynı betikten yükleyin.',
        ),
        li(
          code('mountEnhancements()'),
          ' bir modülü aynı öğe üzerinde asla iki kez çalıştırmaz; işaretlemeyi kendiniz ekledikten sonra yeniden çağırmak güvenlidir.',
        ),
        li(
          'Tek bir kutuda framework mü istiyorsunuz? Onu modülden bağlayın, örneğin ',
          code('createRoot(element).render(<Chart {...props} />)'),
          ' ile. Yalnızca o kutuyu içeren sayfalar onu indirir.',
        ),
      ),
    ],
  })
