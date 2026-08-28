import {
  a,
  button,
  code,
  div,
  h1,
  h2,
  h3,
  img,
  li,
  p,
  span,
  ul,
} from 'javascript-to-html'
import { landingLayout } from '../lib/pt.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('pt')

const features = [
  [
    'routing',
    'Rotas',
    'src/about.ht.js → /about, mais [slug] e apanha-tudo',
    '/pt/docs/routing',
  ],
  [
    'code',
    'JSX e TSX',
    'Escreve páginas como .jsx / .tsx com o mesmo encaminhamento e a mesma compilação',
    '/pt/docs/pages#limitacoes-de-jsx',
  ],
  [
    'data',
    'Carregamento de dados',
    'data() na compilação, com cache dos fetch',
    '/pt/docs/data',
  ],
  [
    'pipeline',
    'Pipeline de recursos',
    'O JS/TS/CSS referenciado é empacotado; o resto fica no servidor',
    '/pt/docs/assets',
  ],
  [
    'image',
    'Otimização de imagens',
    'Redimensionamento, formatos e srcset — ativa com images: true (instala o sharp)',
    '/pt/docs/images',
  ],
  [
    'feather',
    'Zero JavaScript, por omissão',
    'Só os scripts que ligares são empacotados — o resto fica fora da página, para um site mais rápido',
    '/pt/docs/assets#zero-js-por-omissao',
  ],
  [
    'terminal',
    'Servidor de desenvolvimento + barra',
    'Renderização ao vivo a pedido, mais ficheiro, parâmetros, número de ilhas e seletor de viewport enquanto trabalhas',
    '/pt/docs/cli',
  ],
  [
    'search',
    'Pesquisa Pagefind',
    'Pesquisa estática opcional — instala o pagefind e o sitelo build indexa para dist/pagefind/',
    '/pt/docs/configuration#pesquisa-pagefind',
  ],
  [
    'layers',
    'Ilhas de servidor',
    'Páginas estáticas com regiões renderizadas no servidor no momento do pedido',
    '/pt/docs/islands',
  ],
  [
    'sparkles',
    'Pronto para IA',
    'llms.txt, regras de projeto e dicas para que os agentes escrevam sitelo, não React',
    '/pt/docs/build-with-ai',
  ],
  [
    'deploy',
    'Implementação num clique',
    'Configurações para Netlify, Vercel, Cloudflare Pages e AWS Amplify incluídas',
    '/pt/docs/deployment',
  ],
  [
    'gift',
    'Extras',
    '404.html, sitemap.xml e RSS quando pedires',
    '/pt/docs/configuration',
  ],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — A framework moderna para sites rápidos',
    description:
      'O sitelo transforma uma pasta de páginas num site estático e rápido. Pré-visualização ao vivo enquanto trabalhas, um comando para publicar — sem framework pesada.',
    children: [headerHero(), mainSections()],
  })

function headerHero() {
  return div(
    { class: 'hero' },
    div(
      { class: 'hero-center' },
      img({
        class: 'hero-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '280',
        height: '80',
      }),
      h1(
        { class: 'hero-headline' },
        span(
          { class: 'hero-headline-text' },
          'A framework moderna para ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'sites rápidos|blogues|portefólios|páginas de destino|sites de conteúdo|lojas online',
              'aria-live': 'polite',
            },
            'sites rápidos',
          ),
        ),
      ),
      p(
        { class: 'hero-lede' },
        'Zero configuração. Compilações rapidíssimas. Publica onde quiseres — com uma só instalação.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/pt/docs' }, 'Começar'),
        div(
          { class: 'install-glow' },
          div(
            { class: 'install' },
            code({ class: 'install-cmd' }, install),
            button(
              {
                class: 'install-copy',
                type: 'button',
                'data-copy': install,
                'aria-label': 'Copiar o comando de instalação',
              },
              'Copiar',
            ),
          ),
        ),
      ),
    ),
  )
}

function mainSections() {
  return div(
    { class: 'landing-sections' },
    sectionBlock(
      'O que obténs',
      ul(
        { class: 'feature-list' },
        ...features.map(([icon, name, detail, href]) => {
          const body = div(
            { class: 'feature-card-body' },
            span({ class: 'feature-chip' }, icons[icon]),
            h3(name),
            p(detail),
          )
          return li(
            href
              ? a({ class: 'feature-card', href }, body)
              : div({ class: 'feature-card' }, body),
          )
        }),
      ),
    ),
    sectionBlock(
      'Documentação',
      p(
        'Guias sobre rotas, carregamento de dados, TypeScript, configuração e a CLI.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/pt/docs' },
          'Ler a documentação',
          arrowIcon,
        ),
      ),
    ),
    sectionBlock(
      'Exemplos',
      p(
        'Receitas para montagens reais — a começar por um site com a API REST do WordPress.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/pt/examples' },
          'Ver os exemplos',
          arrowIcon,
        ),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
