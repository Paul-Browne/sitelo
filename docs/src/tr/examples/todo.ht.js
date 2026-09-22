import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/tr.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('tr')

export default () =>
  examplesLayout({
    title: 'Yapılacaklar uygulaması',
    description:
      'Satır içi dinamik içe aktarmalarla statik HTML — işleyiciler /js/todo.js dosyasını istendikçe yükler.',
    activeHref: '/tr/examples/todo',
    children: [
      p(
        'Ön yüz frameworkü olmadan klasik bir etkileşimli arayüz. sitelo sayfa kabuğunu kurar; olay öznitelikleri ',
        code("import('/js/todo.js').then(…)"),
        ' çağırır, böylece modül yalnızca gerektiğinde yüklenir. Tam kaynak ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        ' içinde.',
      ),
      h2('Elinize geçenler'),
      ul(
        { class: 'docs-list' },
        li(code('onsubmit'), ' / ', code('onload'), ' (ve liste öğesi) işleyicileriyle statik HTML'),
        li(
          code('src/js/todo.js'),
          ' — dışa aktarılmış ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ', ',
          code('handleRemove'),
        ),
        li(
          'sitelo, HTML içindeki düz ',
          code('import(\'/…\')'),
          ' ifadelerini keşfeder ve dosyayı ',
          code('dist/'),
          ' içine paketler (bkz. ',
          a({ href: '/tr/docs/assets' }, 'Varlıklar'),
          ')',
        ),
      ),
      h2('Proje düzeni'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Sayfadaki satır içi içe aktarmalar'),
      p(
        code('<script type="module" src>'),
        ' yok. İşleyiciler, modülü dinamik olarak içe aktaran ve ',
        code('this'),
        ' (öğenin kendisi) geçirerek bir dışa aktarımı çağıran HTML öznitelikleridir. Bu, sayfa modüllerini tarayıcı API’lerinden uzak tutar (bkz. ',
        a({ href: '/tr/docs/pages#jsx-kisitlamalari' }, 'JSX kısıtlamaları'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Dışa aktarılmış işleyiciler'),
      p(
        'Modül, ',
        code('src/js/'),
        ' altında normal bir ES dosyasıdır. Çalışma anında oluşturulan liste öğeleri ',
        code('onchange'),
        ' / ',
        code('onclick'),
        ' için aynı ',
        code('import(\'/js/todo.js\').then(…)'),
        ' kalıbını kullanır.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Çalıştırma'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Ya da ',
        code('npm run build'),
        ' çalıştırın ve ',
        code('dist/'),
        ' dizinini statik dosya sunulan herhangi bir yerde barındırın.',
      ),
      p(
        a({ href: '/tr/docs/assets' }, 'Varlıklar ve stil'),
        ' · ',
        a({ href: '/tr/docs/pages#jsx-kisitlamalari' }, 'JSX kısıtlamaları'),
        ' · ',
        a({ href: '/tr/examples/basic' }, 'Temel site'),
      ),
    ],
  })
