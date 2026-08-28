import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pt.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('pt')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Extrai um site WordPress inteiro pela API REST — milhares de artigos, gerados estaticamente com o sitelo.',
    activeHref: '/pt/examples/wordpress',
    children: [
      p(
        'Trata o WordPress como um CMS headless e ',
        'extrai o site inteiro',
        ': pagina por ',
        code('/wp-json/wp/v2/posts'),
        ', gera um ficheiro HTML por slug e guarda em cache as respostas da API entre compilações.',
      ),
      h2('O que obténs'),
      ul(
        { class: 'docs-list' },
        li('Uma página inicial a listar os artigos recentes'),
        li(code('/blog'), ' — arquivo completo de todos os artigos'),
        li(
          code('/blog/[slug]'),
          ' — uma página HTML estática por artigo (aguenta milhares de artigos)',
        ),
        li(
          code('fetchWithCache'),
          ', para que as recompilações reutilizem as respostas do WP em vez de descarregar tudo de novo',
        ),
      ),
      h2('Estrutura do projeto'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Aponta para o teu site WordPress'),
      p(
        'A API REST vem ligada por omissão no WordPress moderno. Confirma em ',
        code('https://o-teu-site.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Define ',
        code('WP_URL'),
        ' no ambiente (ou escreve-o diretamente enquanto experimentas):',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Auxiliares partilhados do WordPress'),
      p(
        code('getAllPosts()'),
        ' lê ',
        code('X-WP-TotalPages'),
        ' e percorre todas as páginas (o WordPress limita ',
        code('per_page'),
        ' a 100). Salta ',
        code('_embed'),
        ' enquanto recolhes slugs — só vais buscar os embeds para cada artigo.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Página inicial'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Índice do blogue'),
      p(
        'Usa ',
        code('getAllPosts()'),
        ' para que o arquivo não fique limitado a 50–100 itens.',
      ),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Transforma todos os artigos em páginas estáticas'),
      p(
        code('generateStaticParams'),
        ' tem de devolver ',
        'todos',
        ' os slugs que queres em ',
        code('dist/'),
        '. Pagina a API aqui — não chames ',
        code('getPosts({ perPage: 100 })'),
        ' uma vez e fiques por aí.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. Compilar'),
      codeBlock('shell', s.build, 'bash'),
      p(
        'A primeira compilação passa uma vez pelo WordPress e enche a cache de fetch. As seguintes reutilizam as respostas de lista e de detalhe em cache (',
        code("cache: 'auto'"),
        ' → sistema de ficheiros em produção) até ',
        code('maxAge'),
        ' expirar. Aumenta ',
        code('renderConcurrency'),
        ' em ',
        code('sitelo.config.js'),
        ' se estiveres a renderizar milhares de páginas de artigos.',
      ),
      h2('Notas'),
      h3('HTML vindo do WordPress'),
      p(
        code('title.rendered'),
        ' e ',
        code('content.rendered'),
        ' são strings HTML vindas do WP. Coloca-as no teu template tal como estão (como acima), ou sanitiza-as se não confiares totalmente no CMS.',
      ),
      h3('Conteúdo privado'),
      p(
        'As rotas REST públicas só expõem artigos publicados. Para rascunhos ou autenticação própria, passa cabeçalhos no segundo argumento de ',
        code('fetchWithCache'),
        ' (o init normal do ',
        code('fetch'),
        ') e usa um ',
        code('cacheKey'),
        ' estável.',
      ),
      p(
        a({ href: '/pt/docs/data' }, 'Documentação de carregamento de dados'),
        ' · ',
        a({ href: '/pt/docs/routing' }, 'Documentação de rotas'),
      ),
    ],
  })
