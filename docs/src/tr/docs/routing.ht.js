import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, docsLayout } from '../../lib/tr.js'
import {
  paramsHt,
  paramsJsx,
  paramsTemplate,
  structure,
} from '../../lib/snippets/routing.js'

function row(feature, file, url) {
  return tr(td(feature), td(file), td(url))
}

export default () =>
  docsLayout({
    title: 'Yönlendirme',
    description: 'Dosya tabanlı yönlendirme, dinamik parçalar ve generateStaticParams.',
    activeHref: '/tr/docs/routing',
    children: [
      p('Rotalar doğrudan ', code('src/'), ' altındaki dosya sisteminden gelir.'),
      codeBlock('project', structure, 'bash'),
      h2('Rota tablosu'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Özellik'), th('Dosya'), th('URL'))),
          tbody(
            row('Statik', code('index.ht.js'), code('/')),
            row('İç içe', code('blog/index.ht.js'), code('/blog')),
            row('Dinamik', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Birden çok parametre',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row('Hepsini yakalayan', code('docs/[...path].ht.js'), code('/docs/api/auth')),
            row(
              'İsteğe bağlı yakalayan',
              code('docs/[...path]?.ht.js'),
              code('/docs + daha derini'),
            ),
            row('Rota grupları', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'Daha belirli rotalar kazanır: statik dinamiği, dinamik de hepsini yakalayanları yener. Aynı URL’i üreten iki dosya bir derleme hatasıdır.',
      ),
      h2('generateStaticParams'),
      p(
        'Dinamik rotalar, derleme sırasında hangi sayfaların üretileceğini bildirir. ',
        code('sitelo'),
        ' (geliştirme) içinde dinamik rotalar, her parametreyi listelemeden istendikçe işlenmeyi sürdürür.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'Değerler dize, sayı ya da mantıksal olabilir — dizeye çevrilir ve URL olarak kodlanır. Hepsini yakalayan parametreler dizileri (',
        code("{ path: ['a', 'b'] }"),
        ') ya da eğik çizgiyle ayrılmış dizeleri (',
        code("{ path: 'a/b' }"),
        ') kabul eder.',
      ),
      p(
        'Sıfır rota üreten dinamik bir sayfa bir uyarı yazdırır, böylece sitenizden sessizce kaybolamaz.',
      ),
    ],
  })
