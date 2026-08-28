import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/pt.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('pt')

export default () =>
  docsLayout({
    title: 'Implementação',
    description:
      'Implementa um site sitelo no Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages ou em qualquer alojamento estático.',
    activeHref: '/pt/docs/deployment',
    children: [
      p(
        'Uma compilação do sitelo são ficheiros estáticos e mais nada: ',
        code('sitelo build'),
        ' escreve HTML, CSS e JS em ',
        code('dist/'),
        '. Qualquer alojamento estático serve — as configurações abaixo só assumem ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Os URLs limpos são diretórios com ',
        code('index.html'),
        ' (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '), por isso os URLs bonitos funcionam logo, sem regras de redirecionamento. O ',
        code('404.html'),
        ' é emitido automaticamente — é a convenção que o Netlify, o Cloudflare Pages e o GitHub Pages entendem.',
      ),
      p(
        'Há versões prontas a copiar de tudo isto no ',
        a({ href: '/pt/examples/basic' }, 'exemplo básico'),
        ' (',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ' no repositório).',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Compilações pelo painel: comando de compilação ',
        code('npm run build'),
        ' e diretório de saída ',
        code('dist'),
        '. Ou implementa pela CLI com ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'Para S3 + CloudFront simples: ',
        code('npm run build'),
        ' e depois sincroniza ',
        code('dist/'),
        ' com o bucket.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        'Implementas num subcaminho (',
        code('user.github.io/repo'),
        ')? Compila com ',
        code('--base /repo/'),
        '.',
      ),
      h2('Antes de publicar'),
      ul(
        { class: 'docs-list' },
        li(
          'Define ',
          code('site'),
          ' em ',
          code('sitelo.config.js'),
          ' para que o ',
          code('sitemap.xml'),
          ' seja gerado — vê ',
          a({ href: '/pt/docs/configuration' }, 'Configuração'),
        ),
        li(
          'Acrescenta um ',
          code('src/404.ht.js'),
          ' para teres uma página de «não encontrado» com a tua identidade (caso contrário é emitida uma por omissão)',
        ),
        li(
          code('sitelo preview'),
          ' serve a compilação de produção localmente para uma verificação final',
        ),
      ),
    ],
  })
