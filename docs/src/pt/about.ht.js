import {
  a,
  div,
  em,
  h2,
  p,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from 'javascript-to-html'
import { code, pageLayout } from '../lib/pt.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: 'Acerca',
    description:
      'Porque existe o sitelo — do javascript-to-html ao vite-plugin-html-pages e daí a um conjunto completo de ferramentas para sites estáticos.',
    activeHref: '/pt/about',
    children: [
      p(
        'O sitelo não começou como um framework. Começou com a vontade de escrever marcação de uma forma que parecesse natural em JavaScript — e foi crescendo até cobrir todo o caminho, do ficheiro da página ao site publicado.',
      ),
      h2('javascript-to-html'),
      p(
        'Primeiro veio o ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ' (também conhecido por ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        '): uma forma simples e intuitiva de gerar HTML em JavaScript, sem motores de templates complexos nem frameworks.',
      ),
      p(
        'Com frameworks completos como o React tão omnipresentes, encontrar uma solução de templates simples que não trouxesse tudo atrás era surpreendentemente difícil. Ao concentrar-se apenas em transformar JavaScript em HTML — no fundo, funções que devolvem strings — o ht.js mantém-se leve, fácil de usar, flexível e extensível.',
      ),
      p(
        'Essa superfície reduzida faz com que encaixe em muitos sítios: diretamente no frontend (à maneira de uma SPA), numa compilação para criar sites estáticos (SSG), ou até para renderização no servidor (SSR).',
      ),
      h2('Ensinar o Vite a emitir HTML'),
      p(
        'Isso resolveu a escrita. O problema seguinte era a compilação: o Vite trata os ',
        code('.js'),
        ' / ',
        code('.ts'),
        ' como scripts, não como páginas. Era precisa uma convenção em que certos módulos ',
        em('fossem para ser'),
        ' HTML.',
      ),
      p(
        'A ideia era direta: os ficheiros chamados ',
        code('*.ht.js'),
        ', ',
        code('*.html.js'),
        ', ',
        code('*.ht.ts'),
        ' e companhia deviam ser processados para HTML em vez de empacotados como JavaScript de cliente. Essa convenção tornou-se o ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ' — encaminhamento por ficheiros, carregamento de dados, recursos e geração estática sobre o Vite.',
      ),
      h2('sitelo'),
      p(
        'O sitelo junta o Vite e esse plugin numa só instalação e numa só CLI. Ficas com uma experiência de desenvolvimento completa e cuidada: ',
        code('sitelo'),
        ' para um servidor ao vivo, ',
        code('sitelo build'),
        ' para produção, valores por omissão sensatos e o modelo de páginas do plugin, sem teres de montar a cadeia de ferramentas.',
      ),
      p(
        'A mesma ideia de uma ponta à outra: as páginas são módulos que devolvem HTML. O sitelo é a camada que faz essa ideia parecer terminada.',
      ),
      h2('Como se compara'),
      p(
        'Já há muitas boas ferramentas para publicar sites estáticos. O nicho do sitelo é estreito de propósito: funções JavaScript (ou TypeScript) que devolvem HTML, com a experiência de desenvolvimento do Vite, e com o mínimo de framework possível.',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Ferramenta'), th('Modelo'), th('Escolhe-a quando'))),
          tbody(
            comparisonRow(
              'sitelo',
              'Funções JS/TS → HTML sobre o Vite',
              'queres HTML a partir de JavaScript com um fluxo de trabalho Vite a sério — sem precisares de um framework de componentes',
            ),
            comparisonRow(
              'Astro',
              'Componentes + ilhas, compilador próprio',
              'sites de conteúdo que querem ilhas de componentes e um ecossistema maior',
            ),
            comparisonRow(
              'Next.js',
              'Aplicação React completa (SSR / SSG / ISR)',
              'estás a construir uma aplicação no ecossistema do React',
            ),
            comparisonRow(
              'Hugo',
              'Templates Go, compilações muito rápidas',
              'sites de conteúdo enormes e sentes-te à vontade nas ferramentas do Go',
            ),
            comparisonRow(
              'Eleventy',
              'Linguagens de templates → HTML',
              'queres templates flexíveis (Nunjucks, Liquid, …) sem um framework de SPA',
            ),
          ),
        ),
      ),
      p(
        'Se queres componentes, hidratação e um framework — usa um framework. Se queres ficheiros HTML a partir de funções JavaScript com a experiência do Vite, o sitelo é a ferramenta mais pequena que faz o trabalho todo.',
      ),
      p(
        a({ href: '/pt/docs' }, 'Ler a documentação'),
        ' · ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'GitHub',
        ),
      ),
    ],
  })
