import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/tr.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('tr')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'REST API üzerinden bütün bir WordPress sitesini çekin — binlerce yazı, sitelo ile statik olarak üretilmiş.',
    activeHref: '/tr/examples/wordpress',
    children: [
      p(
        'WordPress’i başsız bir CMS gibi kullanın ve ',
        'bütün siteyi çekin',
        ': ',
        code('/wp-json/wp/v2/posts'),
        ' üzerinde sayfalayın, slug başına bir HTML dosyası üretin ve API yanıtlarını derlemeler arasında önbelleğe alın.',
      ),
      h2('Elinize geçenler'),
      ul(
        { class: 'docs-list' },
        li('Son yazıları listeleyen bir ana sayfa'),
        li(code('/blog'), ' — her yazının tam arşivi'),
        li(
          code('/blog/[slug]'),
          ' — yazı başına bir statik HTML sayfası (binlerce yazıda da çalışır)',
        ),
        li(
          'Yeniden derlemelerin her şeyi yeniden indirmek yerine WP yanıtlarını yeniden kullanması için ',
          code('fetchWithCache'),
        ),
      ),
      h2('Proje düzeni'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. WordPress sitenizi gösterin'),
      p(
        'REST API modern WordPress’te varsayılan olarak açıktır. ',
        code('https://your-site.com/wp-json/wp/v2/posts'),
        ' adresinden doğrulayın.',
      ),
      p(
        'Ortamda ',
        code('WP_URL'),
        ' değerini ayarlayın (ya da denerken doğrudan koda yazın):',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Paylaşılan WordPress yardımcıları'),
      p(
        code('getAllPosts()'),
        ', ',
        code('X-WP-TotalPages'),
        ' başlığını okur ve her sayfayı gezer (WordPress ',
        code('per_page'),
        ' değerini 100 ile sınırlar). Slugları toplarken ',
        code('_embed'),
        ' kullanmayın — gömülüleri yalnızca tek tek yazılar için getirin.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Ana sayfa'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Blog dizini'),
      p('Arşiv 50–100 öğeyle sınırlanmasın diye ', code('getAllPosts()'), ' kullanın.'),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Her yazıyı statik sayfalara çekin'),
      p(
        code('generateStaticParams'),
        ', ',
        code('dist/'),
        ' içinde istediğiniz ',
        'her',
        ' slug’ı döndürmelidir. API’yi burada sayfalayın — ',
        code('getPosts({ perPage: 100 })'),
        ' çağrısını bir kez yapıp durmayın.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. Derleme'),
      codeBlock('shell', s.build, 'bash'),
      p(
        'İlk derleme WordPress üzerinden bir kez sayfalar ve getirme önbelleğini doldurur. Sonraki derlemeler ',
        code('maxAge'),
        ' dolana dek önbelleğe alınmış liste/ayrıntı yanıtlarını yeniden kullanır (',
        code("cache: 'auto'"),
        ' → üretimde dosya sistemi). Binlerce yazı sayfası işliyorsanız ',
        code('sitelo.config.js'),
        ' içindeki ',
        code('renderConcurrency'),
        ' değerini yükseltin.',
      ),
      h2('Notlar'),
      h3('WordPress’ten gelen HTML'),
      p(
        code('title.rendered'),
        ' ve ',
        code('content.rendered'),
        ' WP’den gelen HTML dizeleridir. Onları şablonunuza olduğu gibi bırakın (yukarıdaki gibi) ya da CMS’e tümüyle güvenmiyorsanız temizleyin.',
      ),
      h3('Özel içerik'),
      p(
        'Genel REST rotaları yalnızca yayımlanmış yazıları açar. Taslaklar ya da özel kimlik doğrulama için başlıkları ',
        code('fetchWithCache'),
        ' fonksiyonunun ikinci argümanına (standart ',
        code('fetch'),
        ' init) geçirin ve kararlı bir ',
        code('cacheKey'),
        ' kullanın.',
      ),
      p(
        a({ href: '/tr/docs/data' }, 'Veri yükleme belgeleri'),
        ' · ',
        a({ href: '/tr/docs/routing' }, 'Yönlendirme belgeleri'),
      ),
    ],
  })
