import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pt.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('pt')

export default () =>
  examplesLayout({
    title: 'JSON local',
    description:
      'Um catálogo de produtos construído inteiramente a partir de ficheiros JSON do repositório — sem API e sem base de dados.',
    activeHref: '/pt/examples/json',
    children: [
      p(
        'Conteúdo que vive no repositório em JSON, transformado em páginas estáticas pelo ',
        code('sitelo/data'),
        '. Sem API, sem base de dados e sem JavaScript no cliente. Código completo em ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('O que obténs'),
      ul(
        { class: 'docs-list' },
        li('Uma página inicial que lista todas as categorias e produtos'),
        li(
          code('/products/[slug]'),
          ' — uma página estática por ficheiro em ',
          code('data/products/'),
          '',
        ),
        li(
          code('/categories/[slug]'),
          ' — uma página por chave em ',
          code('data/categories.json'),
          '',
        ),
        li('Acrescentar um ficheiro JSON acrescenta uma página; não há rota para registar'),
        li('Zero JS enviado — os ficheiros são lidos no Node durante o build'),
      ),
      h2('Estrutura do projeto'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'Os dados vivem fora de ',
        code('src/'),
        ', por isso o sitelo nunca os trata como páginas ou recursos.',
      ),
      h2('1. Põe o conteúdo em data/'),
      p(
        'Um ficheiro por produto. O nome do ficheiro é o slug, por isso ',
        code('aeron-chair.json'),
        ' passa a ser ',
        code('/products/aeron-chair'),
        ' sem que nada no ficheiro o diga:',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'As categorias, essas, ficam num único ficheiro: um objeto indexado por slug, que o ',
        code('readJsonCollection'),
        ' lê da mesma maneira, como coleção.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. Lê tudo num só sítio'),
      p(
        'Um pequeno módulo só de servidor envolve as leituras. Nada no HTML lhe faz referência, por isso nunca chega ao browser — e como o ',
        code('sitelo/data'),
        ' memoriza por ficheiro, todas as páginas que chamam estes helpers continuam a analisar cada ficheiro JSON uma só vez em todo o build.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. Lista tudo na página inicial'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Uma página por ficheiro JSON'),
      p(
        code('generateStaticParams'),
        ' devolve um slug por ficheiro durante o build; ',
        code('data()'),
        ' carrega a entrada correspondente a cada página.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Edita e vê'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        'Com o ',
        code('sitelo'),
        ', mudar um preço recarrega a página aberta — o servidor de desenvolvimento vigia os ficheiros JSON que as páginas realmente leem. Slugs duplicados, ficheiros em falta e JSON inválido falham o build, identificando o caminho.',
      ),
      p(
        a({ href: '/pt/docs/data' }, 'Documentação de carregamento de dados'),
        ' · ',
        a({ href: '/pt/docs/routing' }, 'Documentação de rotas'),
        ' · ',
        a({ href: '/pt/docs/configuration' }, 'Documentação de configuração'),
      ),
    ],
  })
