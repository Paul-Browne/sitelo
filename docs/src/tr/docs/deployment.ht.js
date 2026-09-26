import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/tr.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('tr')

export default () =>
  docsLayout({
    title: 'Dağıtım',
    description:
      'Bir sitelo sitesini Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages, Railway ya da herhangi bir statik sunucuya dağıtın.',
    activeHref: '/tr/docs/deployment',
    children: [
      p(
        'Bir sitelo derlemesi düz statik dosyalardır: ',
        code('sitelo build'),
        ', HTML, CSS ve JS dosyalarını ',
        code('dist/'),
        ' içine yazar. Her statik sunucu işe yarar — aşağıdaki yapılandırmalar yalnızca ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        ' varsayar.',
      ),
      p(
        'Temiz URL’ler, ',
        code('index.html'),
        ' içeren dizinlerdir (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '); bu yüzden güzel URL’ler yönlendirme kuralı olmadan kutudan çıktığı gibi çalışır. Bir ',
        code('404.html'),
        ' kendiliğinden üretilir — Netlify, Cloudflare Pages ve GitHub Pages’in hepsinin anladığı kural budur.',
      ),
      p(
        'Bunların hepsinin kopyalamaya hazır sürümleri ',
        a({ href: '/tr/examples/basic' }, 'temel örnekte'),
        ' bulunur (depodaki ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ').',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Panel derlemeleri: derleme komutunu ',
        code('npm run build'),
        ', çıktı dizinini ',
        code('dist'),
        ' olarak ayarlayın. Ya da CLI’dan ',
        code('npx wrangler pages deploy dist'),
        ' ile dağıtın.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'Düz S3 + CloudFront için: ',
        code('npm run build'),
        ', ardından ',
        code('dist/'),
        ' dizinini kovaya eşitleyin.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        'Bir alt yol altında mı dağıtıyorsunuz (',
        code('user.github.io/repo'),
        ')? ',
        code('--base /repo/'),
        ' ile derleyin.',
      ),
      h2('Railway'),
      p(
        'Railway bir Node sunucusu çalıştırır; bu yüzden build’i sunmanın yanında ',
        a({ href: '/tr/docs/islands' }, 'sunucu adalarını'),
        ' her istekte işleyebilir. Dağıtıma hazır bir başlangıç projesi ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/railway',
            rel: 'noopener',
          },
          'examples/railway',
        ),
        ' içinde: ',
        code('railway.json'),
        ', ',
        code('npm run build'),
        ' ile derler ve ',
        code('server.js'),
        ' dosyasını başlatır; bu dosya ',
        code('dist/'),
        ' klasörünü sunar ve ',
        code('src/islands/'),
        ' klasörünü işler.',
      ),
      codeBlock('railway.json', s.railway, 'json'),
      p(
        'Doğrudan sitelo deposundan mı dağıtıyorsunuz? Servisin kök dizinini ',
        code('/examples/railway'),
        ', yapılandırma dosyası yolunu ',
        code('/examples/railway/railway.json'),
        ' olarak ayarlayın — Railway yapılandırma dosyasını kök dizinin altında aramaz.',
      ),
      h2('Yayımlamadan önce'),
      ul(
        { class: 'docs-list' },
        li(
          code('sitemap.xml'),
          ' üretilsin diye ',
          code('sitelo.config.js'),
          ' içinde ',
          code('site'),
          ' değerini ayarlayın — bkz. ',
          a({ href: '/tr/docs/configuration' }, 'Yapılandırma'),
        ),
        li(
          'Markalı bir bulunamadı sayfası için bir ',
          code('src/404.ht.js'),
          ' ekleyin (aksi hâlde temiz bir varsayılan üretilir)',
        ),
        li(
          code('sitelo preview'),
          ' son bir kontrol için üretim derlemesini yerelde sunar',
        ),
      ),
    ],
  })
