import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, docsLayout } from '../../lib/tr.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('tr')

export default () =>
  docsLayout({
    title: 'Veri yükleme',
    description: 'API ile beslenen statik siteler için derleme zamanı data() ve fetchWithCache.',
    activeHref: '/tr/docs/data',
    children: [
      p(
        'Bir ',
        code('data()'),
        ' fonksiyonu dışa aktarın; sonucu işleme fonksiyonunuzda ',
        code('ctx.data'),
        ' olarak görünür. Derleme sırasında, geliştirme sunucusunda ise her istekte çalışır.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        'Aynı API’ye karşı çok sayıda sayfa mı üretiyorsunuz? sitelo’dan ',
        code('fetchWithCache'),
        ' içe aktarın:',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Seçenekler'),
      ul(
        { class: 'docs-list' },
        li(code('maxAge'), ' — saniye cinsinden önbellek ömrü (varsayılan ', code('3600'), ')'),
        li(code('cacheKey'), ' — özel anahtar (varsayılan: URL + yöntem + başlıklar + gövdenin özeti)'),
        li(code('forceRefresh'), ' — önbelleği atla'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Önbellek kipleri'),
      ul(
        { class: 'docs-list' },
        li(code('auto'), ' (varsayılan) — geliştirmede bellek, üretim derlemelerinde dosya sistemi'),
        li(code('memory'), ' — süreç içi, süreç sona erdiğinde temizlenir'),
        li(code('fs'), ' — ', code('node_modules/.cache/'), ' altında kalıcı'),
        li(code('none'), ' — her zaman getir'),
      ),
      p(
        'Varsayılan olarak yalnızca ',
        code('GET'),
        ' istekleri önbelleğe alınır (başka yöntemleri önbelleğe almak için bir ',
        code('cacheKey'),
        ' geçirin). Hata yanıtları hiçbir zaman önbelleğe alınmaz.',
      ),
      h2('Yerel JSON dosyaları'),
      p(
        'API yok mu? İçeriği depoda JSON olarak tutun ve ',
        code('sitelo/data'),
        ' ile okuyun.',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        'Göreli yollar proje kökünden çözülür, bu yüzden ',
        code('data/posts'),
        ' CLI’ı nereden çalıştırırsanız çalıştırın aynı anlama gelir. ',
        code('readJson'),
        ' ayrıştırılmış tek bir dosya döndürür; ',
        code('readJsonCollection'),
        ' her biri bir ',
        code('slug'),
        ' taşıyan girdilerden oluşan bir dizi döndürür — bir ',
        code('.json'),
        ' dosyaları dizininden (girdi başına bir dosya, slug dosya adından) ya da girdi dizisi tutan tek bir dosyadan veya slug ile anahtarlanmış bir nesneden.',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('Koleksiyon seçenekleri'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' — alan adı ya da fonksiyon; varsayılan olarak dosya adı, nesne anahtarı ya da girdinin kendi ',
          code('slug'),
          ' / ',
          code('id'),
          ' değeri',
        ),
        li(
          code('sort'),
          ' — alan adı (',
          code("'date'"),
          ' artan, ',
          code("'-date'"),
          ' azalan) ya da bir karşılaştırma fonksiyonu',
        ),
        li(
          code('recursive'),
          ' — alt dizinlerdeki ',
          code('.json'),
          ' dosyalarını da kapsar, yollarına göre sluglanır',
        ),
        li(code('root'), ' — göreli yolların çözüldüğü dizin'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        'Okumalar dosya başına belleğe alınır, bu yüzden 500 sayfalık bir derleme her dosyayı bir kez ayrıştırır. Geliştirme sunucusu bunun yerine değişiklik zamanına karşı doğrular ve bir sayfanın okuduğu JSON dosyası değiştiğinde tarayıcıyı yeniden yükler. Yinelenen sluglar, eksik dosyalar ve bozuk JSON derlemeyi başarısız kılar; her biri yoluyla adlandırılır.',
      ),
    ],
  })
