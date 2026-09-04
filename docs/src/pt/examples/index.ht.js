import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/pt.js'

export default () =>
  examplesLayout({
    title: 'Exemplos',
    description: 'Receitas práticas de sitelo — WordPress, APIs e mais.',
    activeHref: '/pt/examples',
    children: [
      p(
        'Receitas passo a passo para construir sites reais com o sitelo. Cada exemplo mostra a estrutura do projeto, o carregamento de dados e as páginas que escreverias.',
      ),
      h2('Disponíveis'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/pt/examples/basic' }, 'Site básico'),
          ' — projeto mínimo mais configurações de implementação estática para Netlify, Vercel, Cloudflare Pages e AWS Amplify.',
        ),
        li(
          a({ href: '/pt/examples/todo' }, 'App de tarefas'),
          ' — HTML estático com handlers ',
          code("import('/js/todo.js')"),
          ' em linha (adicionar / marcar / remover, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/pt/examples/blog' }, 'Blogue em Markdown'),
          ' — uma pasta de ficheiros ',
          code('.md'),
          ' renderizados para páginas estáticas, com feed RSS e zero JS de cliente.',
        ),
        li(
          a({ href: '/pt/examples/json' }, 'JSON local'),
          ' — um catálogo construído a partir de ficheiros ',
          code('.json'),
          ' do repositório: uma página por ficheiro, sem API nem base de dados.',
        ),
        li(
          a({ href: '/pt/examples/wordpress' }, 'WordPress'),
          ' — vai buscar artigos à API REST do WordPress com ',
          code('fetchWithCache'),
          ', lista-os e gera páginas estáticas para cada um.',
        ),
        li(
          a({ href: '/pt/examples/islands' }, 'Ilhas de servidor'),
          ' — páginas estáticas mais um host Node que renderiza ilhas no momento do pedido.',
        ),
      ),
      h2('Em breve'),
      ul({ class: 'docs-list' }, li('CMS headless / Contentful')),
    ],
  })
