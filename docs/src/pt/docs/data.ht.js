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
    ],
  })
