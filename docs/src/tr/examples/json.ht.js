import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/tr.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('tr')

export default () =>
  examplesLayout({
    title: 'Yerel JSON',
    description:
      'Tümüyle depodaki JSON dosyalarından kurulmuş bir ürün kataloğu — API yok, veritabanı yok.',
    activeHref: '/tr/examples/json',
    children: [
      p(
        'Depoda JSON olarak yaşayan ve ',
        code('sitelo/data'),
        ' tarafından statik sayfalara dönüştürülen içerik. API yok, veritabanı yok, istemci tarafı JavaScript yok. Tam kaynak ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        ' içinde.',
      ),
      h2('Elinize geçenler'),
      ul(
        { class: 'docs-list' },
        li('Her kategoriyi ve ürünü listeleyen bir ana sayfa'),
        li(
          code('/products/[slug]'),
          ' — ',
          code('data/products/'),
          ' içindeki dosya başına bir statik sayfa',
        ),
        li(
          code('/categories/[slug]'),
          ' — ',
          code('data/categories.json'),
          ' içindeki anahtar başına bir sayfa',
        ),
        li('Bir JSON dosyası eklemek bir sayfa ekler; kaydedilecek rota yok'),
        li('Sıfır JS yayımlanır — dosyalar derleme sırasında Node’da okunur'),
      ),
      h2('Proje düzeni'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'Veri ',
        code('src/'),
        ' dışında yaşar, bu yüzden sitelo onu hiçbir zaman sayfa ya da varlık saymaz.',
      ),
      h2('1. İçeriği data/ içine koyun'),
      p(
        'Ürün başına bir dosya. Dosya adı slug’dır, bu yüzden ',
        code('aeron-chair.json'),
        ' dosyası ',
        code('/products/aeron-chair'),
        ' olur — dosyanın içinde bunu söyleyen hiçbir şeye gerek yok:',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'Kategoriler ise tek bir dosyadır: slug ile anahtarlanmış bir nesne; ',
        code('readJsonCollection'),
        ' onu da aynı şekilde bir koleksiyon olarak okur.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. Tek bir yerde okuyun'),
      p(
        'Yalnızca sunucuya ait küçük bir modül okumaları sarar. HTML içinde hiçbir şey ona başvurmaz, bu yüzden tarayıcıya hiç gönderilmez — ve ',
        code('sitelo/data'),
        ' dosya başına belleğe aldığından, bu yardımcıları çağıran her sayfaya rağmen her JSON dosyası bütün derleme boyunca bir kez ayrıştırılır.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. Ana sayfada her şeyi listeleyin'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. JSON dosyası başına bir sayfa'),
      p(
        code('generateStaticParams'),
        ' derleme sırasında dosya başına bir slug döndürür; ',
        code('data()'),
        ' her sayfa için eşleşen girdiyi yükler.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Düzenleyin ve izleyin'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        code('sitelo'),
        ' altında bir fiyatı değiştirmek açık sayfayı yeniden yükler — geliştirme sunucusu sayfaların gerçekten okuduğu JSON dosyalarını izler. Yinelenen sluglar, eksik dosyalar ve bozuk JSON, kusurlu yol adlandırılarak derlemeyi düşürür.',
      ),
      p(
        a({ href: '/tr/docs/data' }, 'Veri yükleme belgeleri'),
        ' · ',
        a({ href: '/tr/docs/routing' }, 'Yönlendirme belgeleri'),
        ' · ',
        a({ href: '/tr/docs/configuration' }, 'Yapılandırma belgeleri'),
      ),
    ],
  })
