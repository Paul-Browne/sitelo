import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/pt.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('pt')

export default () =>
  docsLayout({
    title: 'Carregamento de dados',
    description:
      'data() na compilação e fetchWithCache para sites estáticos alimentados por uma API.',
    activeHref: '/pt/docs/data',
    children: [
      p(
        'Exporta uma função ',
        code('data()'),
        ' e o resultado aparece como ',
        code('ctx.data'),
        ' na tua função de renderização. Corre na compilação e, no servidor de desenvolvimento, a cada pedido.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        'A gerar muitas páginas a partir da mesma API? Importa ',
        code('fetchWithCache'),
        ' do sitelo:',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Opções'),
      ul(
        { class: 'docs-list' },
        li(code('maxAge'), ' — TTL da cache em segundos (por omissão ', code('3600'), ')'),
        li(
          code('cacheKey'),
          ' — chave própria (por omissão: hash do URL + método + cabeçalhos + corpo)',
        ),
        li(code('forceRefresh'), ' — ignora a cache'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Modos de cache'),
      ul(
        { class: 'docs-list' },
        li(
          code('auto'),
          ' (por omissão) — memória em desenvolvimento, sistema de ficheiros nas compilações de produção',
        ),
        li(code('memory'), ' — no processo, esvazia-se quando o processo termina'),
        li(code('fs'), ' — persistido em ', code('node_modules/.cache/')),
        li(code('none'), ' — vai sempre buscar de novo'),
      ),
      p(
        'Por omissão só os pedidos ',
        code('GET'),
        ' são guardados em cache (passa um ',
        code('cacheKey'),
        ' para guardar outros métodos). Respostas de erro nunca são guardadas.',
      ),
      h2('Ficheiros JSON locais'),
      p(
        'Sem API? Mantém o conteúdo no repositório em JSON e lê-o com ',
        code('sitelo/data'),
        '.',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        'Os caminhos relativos resolvem a partir da raiz do projeto, por isso ',
        code('data/posts'),
        ' significa o mesmo de onde quer que corras a CLI. ',
        code('readJson'),
        ' devolve um ficheiro já analisado; ',
        code('readJsonCollection'),
        ' devolve um array de entradas, cada uma com ',
        code('slug'),
        ' — a partir de uma pasta de ficheiros ',
        code('.json'),
        ' (um por entrada, slug tirado do nome do ficheiro) ou de um único ficheiro com um array de entradas ou um objeto indexado por slug.',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('Opções de coleção'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' — nome do campo ou função; por omissão o nome do ficheiro, a chave do objeto, ou o ',
          code('slug'),
          ' / ',
          code('id'),
          ' da própria entrada',
        ),
        li(
          code('sort'),
          ' — nome do campo (',
          code("'date'"),
          ' ascendente, ',
          code("'-date'"),
          ' descendente) ou uma função de comparação',
        ),
        li(
          code('recursive'),
          ' — inclui ficheiros ',
          code('.json'),
          ' em subpastas, com o caminho como slug',
        ),
        li(
          code('root'),
          ' — pasta a partir da qual os caminhos relativos resolvem',
        ),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        'As leituras são memorizadas por ficheiro, por isso um build de 500 páginas analisa cada ficheiro uma só vez. O servidor de desenvolvimento verifica a mtime e recarrega o browser quando muda um ficheiro JSON que alguma página leu. Slugs duplicados, ficheiros em falta e JSON inválido falham o build, cada um identificado pelo caminho.',
      ),
    ],
  })
