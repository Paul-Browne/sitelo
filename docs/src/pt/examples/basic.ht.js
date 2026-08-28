import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pt.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('pt')

export default () =>
  examplesLayout({
    title: 'Site básico',
    description:
      'Um projeto sitelo mínimo e configurações de implementação estática para Netlify, Vercel, Cloudflare Pages e AWS Amplify.',
    activeHref: '/pt/examples/basic',
    children: [
      p(
        'O site sitelo útil mais pequeno: uma página, uma folha de estilos e configurações de alojamento que publicam ',
        code('dist/'),
        '. Copia as configurações para qualquer projeto sitelo — só assumem ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Há uma cópia executável no repositório do sitelo, em ',
        code('examples/basic/'),
        '.',
      ),
      h2('O que obténs'),
      ul(
        { class: 'docs-list' },
        li('Um site estático de uma página construído com o sitelo'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ' e ',
          code('amplify.yml'),
        ),
        li('Implementação num clique ou ligando o repositório a partir da pasta do exemplo'),
      ),
      h2('Estrutura do projeto'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Compilação'),
      codeBlock('shell', s.build, 'bash'),
      h2('Implementação'),
      p(
        'A partir do monorepo do sitelo, define o diretório raiz ou base da plataforma como ',
        code('examples/basic'),
        '.',
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
          'Implementar no Vercel',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Implementar no Netlify',
        ),
        ' (define o diretório base como ',
        code('examples/basic'),
        ' quando for pedido).',
      ),
      h3('Cloudflare Pages'),
      p(
        'Painel: comando de compilação ',
        code('npm run build'),
        ', diretório de saída ',
        code('dist'),
        '. Ou ',
        code('npx wrangler pages deploy dist'),
        ' depois de uma compilação local.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Liga o repositório no Amplify Hosting. Para S3 + CloudFront simples, compila localmente e sincroniza ',
        code('dist/'),
        ' com o bucket.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        'Trabalhas com o Cursor, o Copilot ou outro agente? Copia o ',
        code('AGENTS.md'),
        ' deste exemplo (ou vê ',
        a({ href: '/pt/docs/build-with-ai' }, 'Criar com IA'),
        ') para que as ferramentas não inventem padrões de React/Next.',
      ),
      p(
        a({ href: '/pt/docs' }, 'Primeiros passos'),
        ' · ',
        a({ href: '/pt/docs/build-with-ai' }, 'Criar com IA'),
        ' · ',
        a({ href: '/pt/examples/todo' }, 'App de tarefas'),
        ' · ',
        a({ href: '/pt/examples/islands' }, 'Exemplo de ilhas de servidor'),
      ),
    ],
  })
