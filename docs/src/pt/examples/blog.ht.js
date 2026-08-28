import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pt.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('pt')

export default () =>
  examplesLayout({
    title: 'Blogue em Markdown',
    description:
      'Uma pasta de ficheiros markdown → um blogue estático com feed RSS, feito com sitelo e marked.',
    activeHref: '/pt/examples/blog',
    children: [
      p(
        'O caso canónico dos sites estáticos: ficheiros markdown numa pasta, uma página estática por artigo, um feed RSS e zero JavaScript de cliente. Código completo em ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '.',
      ),
      h2('O que obténs'),
      ul(
        { class: 'docs-list' },
        li('Uma página inicial a listar os artigos, do mais recente ao mais antigo'),
        li(
          code('/blog/[slug]'),
          ' — uma página HTML estática por ficheiro markdown, via ',
          code('generateStaticParams'),
        ),
        li(
          code('rss.xml'),
          ' — gerado pelo sitelo a partir da configuração ',
          code('rss'),
        ),
        li(code('sitemap.xml'), ' — ativado ao definir ', code('site')),
        li('Zero JS publicado — o markdown é processado no Node, na compilação'),
      ),
      h2('Estrutura do projeto'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Escreve os artigos em markdown'),
      p(
        'Os artigos vivem em ',
        code('content/'),
        ' — fora de ',
        code('src/'),
        ', por isso o sitelo nunca os trata como páginas ou recursos. O frontmatter são simples linhas ',
        code('chave: valor'),
        ':',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. Lê-os e renderiza-os no Node'),
      p(
        'Um pequeno módulo exclusivo do servidor lê a pasta, analisa o frontmatter e renderiza o markdown com o ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        '. Como nada no HTML referencia este módulo, ele nunca chega ao navegador.',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. Lista os artigos na página inicial'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Uma página estática por artigo'),
      p(
        code('generateStaticParams'),
        ' devolve todos os slugs na compilação; ',
        code('data()'),
        ' carrega o artigo correspondente a cada página.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. RSS de borla'),
      p(
        'Com a configuração ',
        code('rss'),
        ' acima, o ',
        code('sitelo build'),
        ' emite ',
        code('dist/rss.xml'),
        ' com um item por cada página sob ',
        code('/blog'),
        ' — sem código extra.',
      ),
      p(
        a({ href: '/pt/docs/routing' }, 'Documentação de rotas'),
        ' · ',
        a({ href: '/pt/docs/data' }, 'Documentação de carregamento de dados'),
        ' · ',
        a({ href: '/pt/docs/configuration' }, 'Documentação de configuração'),
      ),
    ],
  })
