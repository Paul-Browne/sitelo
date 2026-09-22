import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, docsLayout } from '../../lib/tr.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('tr')

export default () =>
  docsLayout({
    title: 'Varlıklar ve stil',
    description:
      'sitelo ön yüz JavaScript ve CSS’ini Vite ile nasıl derler — ve yalnızca sunucuya ait kodu tarayıcıdan nasıl uzak tutar.',
    activeHref: '/tr/docs/assets',
    children: [
      p(
        'sitelo Vite üzerine kuruludur, bu yüzden ön yüz JavaScript’i ve CSS’i kendiliğinden derlenir. Betikleri ve stilleri ',
        code('src/'),
        ' altına koyun (örneğin ',
        code('src/js'),
        ' ve ',
        code('src/css'),
        '), HTML’inizden kök göreli URL’lerle bağlayın; gerisini sitelo halleder — TypeScript, CSS içe aktarmaları, paketleme ve küçültme.',
      ),
      h2('Proje düzeni'),
      p(
        'Sayfalar ve varlıklar ',
        code('src/'),
        ' dizinini paylaşır. ',
        code('js/'),
        ' ve ',
        code('css/'),
        ' gibi klasörler birer kural, zorunluluk değil — sitelo klasör adlarını değil, HTML’inizin neye başvurduğunu önemser.',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('Varlıkları HTML’den bağlamak'),
      p(
        'Dosyalara kök göreli yollarla başvurun. sitelo’ya o dosyayı derlemeye dahil etmesini söyleyen şey bir ',
        code('<script type="module">'),
        ' ya da ',
        code('<link rel="stylesheet">'),
        ' etiketidir:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('Vite’ın derledikleri'),
      ul(
        { class: 'docs-list' },
        li(
          code('.js'),
          ' / ',
          code('.ts'),
          ' / ',
          code('.jsx'),
          ' / ',
          code('.tsx'),
          ' — ES modülleri olarak paketlenir, TypeScript ayıklanır, içe aktarmalar satır içine alınır',
        ),
        li(
          code('.css'),
          ' — işlenir ve küçültülür; ',
          code('@import'),
          ' ve göreli ',
          code('url()'),
          ' başvuruları çözülür',
        ),
        li(
          'Başvurulan bir girişten içe aktarılan her şey (yukarıdaki ',
          code('counter.ts'),
          ' gibi) aynı pakete çekilir',
        ),
        li(
          code('sitelo'),
          ' (geliştirme) içinde aynı URL’ler Vite’ın dönüştürme hattından geçer — TypeScript ya da CSS denemek için ayrı bir derleme adımı yoktur',
        ),
      ),
      p(
        'PostCSS, Sass ya da başka Vite eklentileri mi gerekiyor? Bunları ',
        a({ href: '/tr/docs/configuration' }, 'sitelo.config.js'),
        ' içindeki ',
        code('vite'),
        ' altına ekleyin.',
      ),
      h2('Varsayılan olarak sıfır JS'),
      ul(
        { class: 'docs-list' },
        li(
          'Başvurulmayan kod üretilmez. Yalnızca ',
          code('data()'),
          ' ya da ',
          code('generateStaticParams'),
          ' içinden içe aktarılan bir yardımcı ',
          code('dist/'),
          ' dışında kalır — yalnızca sunucuya ait sırlar kazara yayımlanmaz.',
        ),
        li(
          'Sayfada ',
          code('<script>'),
          ' olmaması, derlemede istemci JavaScript’i olmaması demektir. Çoğu site için statik HTML ve CSS yeter.',
        ),
        li(
          code('public/'),
          ' olduğu gibi kopyalanır (site simgeleri, robots.txt, özetlenmesini istemediğiniz statik görseller).',
        ),
        li('Başvurulan diğer dosyalar (görseller, yazı tipleri, videolar, …) ', code('dist/'), ' içine kopyalanır.'),
      ),
      h2('Eksik varlık doğrulaması'),
      p(
        'Ne ',
        code('src/'),
        ' ne de ',
        code('public/'),
        ' içinde bulunan bir dosyayı gösteren bir ',
        code('<script src>'),
        ' ya da stil sayfası ',
        code('href'),
        ' değeri derlemeyi başarısız kılar. Uyarı mı tercih edersiniz?',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
