import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/tr.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('tr')

export default () =>
  examplesLayout({
    title: 'Temel site',
    description:
      'En küçük sitelo projesi ve Netlify, Vercel, Cloudflare Pages ile AWS Amplify için statik dağıtım yapılandırmaları.',
    activeHref: '/tr/examples/basic',
    children: [
      p(
        'İşe yarar en küçük sitelo sitesi: bir sayfa, bir stil sayfası ve ',
        code('dist/'),
        ' dizinini yayımlayan sunucu yapılandırmaları. Yapılandırmaları herhangi bir sitelo projesine kopyalayın — yalnızca ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        ' varsayarlar.',
      ),
      p(
        'Çalıştırılabilir bir kopyası sitelo deposunda ',
        code('examples/basic/'),
        ' altında bulunur.',
      ),
      h2('Elinize geçenler'),
      ul(
        { class: 'docs-list' },
        li('sitelo ile kurulmuş tek sayfalık bir statik site'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ' ve ',
          code('amplify.yml'),
        ),
        li('Örnek klasöründen tek tıkla / depo bağlayarak dağıtım'),
      ),
      h2('Proje düzeni'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Derleme'),
      codeBlock('shell', s.build, 'bash'),
      h2('Dağıtım'),
      p(
        'sitelo tek depodan çalışıyorsanız platformun kök/temel dizinini ',
        code('examples/basic'),
        ' olarak ayarlayın.',
      ),
      h3('Netlify'),
      codeBlock('netlify.toml', s.netlifyToml, 'toml'),
      h3('Vercel'),
      codeBlock('vercel.json', s.vercelJson, 'json'),
      p(
        a(
          {
            href: 'https://vercel.com/new/clone?repository-url=https://github.com/paul-browne/sitelo&root-directory=examples/basic&project-name=sitelo-basic',
            rel: 'noopener',
          },
          'Vercel’e dağıt',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Netlify’a dağıt',
        ),
        ' (sorulduğunda temel dizini ',
        code('examples/basic'),
        ' yapın).',
      ),
      h3('Cloudflare Pages'),
      p(
        'Panel: derleme komutu ',
        code('npm run build'),
        ', çıktı dizini ',
        code('dist'),
        '. Ya da yerel bir derlemeden sonra ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Depoyu Amplify Hosting’e bağlayın. Düz S3 + CloudFront için yerelde derleyin ve ',
        code('dist/'),
        ' dizinini kovaya eşitleyin.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        'Cursor, Copilot ya da başka bir ajanla mı çalışıyorsunuz? Araçlar React/Next kalıpları uydurmasın diye bu örnekten ',
        code('AGENTS.md'),
        ' dosyasını kopyalayın (ya da ',
        a({ href: '/tr/docs/build-with-ai' }, 'Yapay zekâ ile geliştirme'),
        ' sayfasına bakın).',
      ),
      p(
        a({ href: '/tr/docs' }, 'Başlarken'),
        ' · ',
        a({ href: '/tr/docs/build-with-ai' }, 'Yapay zekâ ile geliştirme'),
        ' · ',
        a({ href: '/tr/examples/todo' }, 'Yapılacaklar uygulaması'),
        ' · ',
        a({ href: '/tr/examples/islands' }, 'Sunucu adaları örneği'),
      ),
    ],
  })
