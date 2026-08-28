import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/pt.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('pt')

export default () =>
  docsLayout({
    title: 'Criar com IA',
    description:
      'Dá aos agentes de programação conhecimento atualizado do sitelo com llms.txt, regras de projeto e dicas práticas.',
    activeHref: '/pt/docs/build-with-ai',
    children: [
      p(
        'Os editores com IA e os agentes de programação enganam-se muitas vezes com o sitelo: recorrem a padrões do React, Next ou Astro que aqui não se aplicam. Este guia mostra como apontá-los para a documentação atual do sitelo e manter o código gerado no modelo certo.',
      ),
      h2('llms.txt'),
      p(
        'O sitelo publica um resumo do framework legível por máquinas em ',
        a({ href: '/llms.txt' }, 'sitelo.js.org/llms.txt'),
        '. Muitos agentes conseguem descarregar um URL; pede ao teu que leia esse ficheiro (e a documentação para humanos) antes de escrever código do sitelo.',
      ),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/llms.txt' }, 'https://sitelo.js.org/llms.txt'),
          ' — API e convenções em formato compacto',
        ),
        li(
          a({ href: '/pt/docs' }, 'https://sitelo.js.org/pt/docs'),
          ' — guias completos',
        ),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'README no GitHub'),
          ' — modelo mental e panorâmica das funcionalidades',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — documentação do ',
          code('javascript-to-html'),
          ' (recomendado para escrever HTML em JS)',
        ),
      ),
      p(
        'Ao contrário de um servidor MCP de documentação, o ',
        code('llms.txt'),
        ' não precisa de instalação — cola o URL na conversa, acrescenta-o às regras do projeto, ou deixa o agente descarregá-lo.',
      ),
      h2('Regras de projeto'),
      p(
        'Se a tua ferramenta suportar instruções persistentes (',
        code('AGENTS.md'),
        ', regras do Cursor, instruções do Copilot, …), acrescenta uma regra curta sobre o sitelo para que cada sessão comece com o modelo mental certo. O ',
        a({ href: '/pt/examples/basic' }, 'exemplo básico'),
        ' inclui um ',
        code('AGENTS.md'),
        ' que podes copiar:',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Cria ',
        code('.cursor/rules/sitelo.mdc'),
        ' no teu projeto (ou cola o mesmo texto na interface de regras de projeto do Cursor):',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Dicas para trabalhar no sitelo com IA'),
      ul(
        { class: 'docs-list' },
        li(
          'Parte de um modelo — pede ao agente que gere o esqueleto a partir de ',
          a({ href: '/pt/examples/basic' }, 'examples/basic'),
          ' ou ',
          a({ href: '/pt/examples/wordpress' }, 'examples/wordpress'),
          ' em vez de inventar um framework.',
        ),
        li(
          'Prefere o ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          ') para a marcação — funções de etiqueta que devolvem strings HTML, sem motor de templates nem React. Aponta os agentes para ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ' para que não inventem árvores de componentes JSX.',
        ),
        li(
          'As páginas são funções que devolvem HTML — ',
          code('export default () => `<html>…</html>`'),
          ' ou compostas com ',
          code('javascript-to-html'),
          '. JSX serve enquanto compilar para strings; não é preciso um runtime do React.',
        ),
        li(
          'Usa a CLI do sitelo — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' — e não o ',
          code('vite'),
          ' diretamente, a não ser que saibas que precisas de uma configuração do Vite própria.',
        ),
        li(
          'Verifica as APIs contra o ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' — sobretudo ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ' e as ',
          a({ href: '/pt/docs/islands' }, 'ilhas de servidor'),
          '.',
        ),
        li(
          'Zero JS por omissão — só liga um ',
          code('<script>'),
          ' quando a página precisar de código de cliente; os módulos sem referências ficam no servidor.',
        ),
        li(
          'Revê e executa — corre sempre ',
          code('sitelo build'),
          ' (ou o servidor de desenvolvimento) depois de o agente editar páginas; trata a marcação gerada como um rascunho.',
        ),
      ),
      p(
        a({ href: '/pt/docs' }, 'Primeiros passos'),
        ' · ',
        a({ href: '/pt/examples/basic' }, 'Exemplo básico'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
