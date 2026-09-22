import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/tr.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('tr')

export default () =>
  examplesLayout({
    title: 'Markdown blog',
    description:
      'Bir markdown dosyaları klasörü → sitelo ve marked ile kurulmuş, RSS akışı olan statik bir blog.',
    activeHref: '/tr/examples/blog',
    children: [
      p(
        'Statik sitenin en tipik kullanımı: bir klasördeki markdown dosyaları, yazı başına bir statik sayfa, bir RSS akışı ve sıfır istemci tarafı JavaScript. Tam kaynak ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        ' içinde.',
      ),
      h2('Elinize geçenler'),
      ul(
        { class: 'docs-list' },
        li('Yazıları en yeniden başlayarak listeleyen bir ana sayfa'),
        li(
          code('/blog/[slug]'),
          ' — ',
          code('generateStaticParams'),
          ' aracılığıyla markdown dosyası başına bir statik HTML sayfası',
        ),
        li(code('rss.xml'), ' — sitelo tarafından ', code('rss'), ' yapılandırmasından üretilir'),
        li(code('sitemap.xml'), ' — ', code('site'), ' ayarlanarak açılır'),
        li('Sıfır JS yayımlanır — markdown ayrıştırma derleme sırasında Node’da olur'),
      ),
      h2('Proje düzeni'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Yazıları markdown olarak yazın'),
      p(
        'Yazılar ',
        code('content/'),
        ' içinde yaşar — ',
        code('src/'),
        ' dışında, böylece sitelo onları hiçbir zaman sayfa ya da varlık saymaz. Frontmatter düz ',
        code('key: value'),
        ' satırlarıdır:',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. Onları Node’da okuyun ve işleyin'),
      p(
        'Yalnızca sunucuya ait küçük bir modül klasörü okur, frontmatter’ı ayrıştırır ve markdown’ı ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        ' ile işler. HTML içinde hiçbir şey bu modüle başvurmadığından tarayıcıya hiç gönderilmez.',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. Yazıları ana sayfada listeleyin'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Yazı başına bir statik sayfa'),
      p(
        code('generateStaticParams'),
        ' derleme sırasında her slug’ı döndürür; ',
        code('data()'),
        ' her sayfa için eşleşen yazıyı yükler.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Bedavaya RSS'),
      p(
        'Yukarıdaki ',
        code('rss'),
        ' yapılandırmasıyla ',
        code('sitelo build'),
        ', ',
        code('/blog'),
        ' altındaki her sayfa için bir öğe içeren ',
        code('dist/rss.xml'),
        ' üretir — fazladan kod yok.',
      ),
      p(
        a({ href: '/tr/docs/routing' }, 'Yönlendirme belgeleri'),
        ' · ',
        a({ href: '/tr/docs/data' }, 'Veri yükleme belgeleri'),
        ' · ',
        a({ href: '/tr/docs/configuration' }, 'Yapılandırma belgeleri'),
      ),
    ],
  })
