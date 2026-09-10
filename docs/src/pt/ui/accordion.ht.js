import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Acordeão',
    description:
      'Secções recolhíveis com o próprio <details> do navegador — incluindo o seu modo exclusivo.',
    activeHref: '/pt/ui/accordion',
    children: [
      p(
        'Cada secção é um ',
        code('<details>'),
        '. Abrir, fechar, o suporte de teclado e a procura na página vêm do navegador, e o acordeão funciona com o JavaScript desligado — o que importa numas perguntas frequentes, o seu uso mais comum.',
      ),

      h2('Acordeão básico'),
      demo(`accordion({
  items: [
    { title: 'O que é o sitelo?', content: 'Um gerador de sites estáticos construído sobre o Vite. As páginas são funções que devolvem HTML.' },
    { title: 'Traz algum runtime?', content: 'Não. Nada chega ao navegador a não ser que ligues um script tu próprio.' },
    { title: 'Posso usar TypeScript?', content: 'Sim — .ht.ts e .ht.tsx são extensões de página como quaisquer outras.' },
  ],
})`, { align: 'stretch' }),

      h2('Aberto por predefinição'),
      demo(`accordion({
  items: [
    { title: 'Aberto à chegada', content: 'Esta tem open: true.', open: true },
    { title: 'Fechada', content: 'Esta não.' },
  ],
})`, { align: 'stretch' }),

      h2('Um de cada vez'),
      p(
        'Um ',
        code('name'),
        ' partilhado torna as secções mutuamente exclusivas — abrir uma fecha as outras. É o comportamento próprio do navegador para ',
        code('<details name>'),
        ', não um script.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'Primeira', content: 'Abre outra e esta fecha-se.', open: true },
    { title: 'Segunda', content: 'E esta também.' },
    { title: 'Terceira', content: 'Só há uma aberta de cada vez.' },
  ],
})`, { align: 'stretch' }),

      h2('Conteúdo rico'),
      p(
        'Constrói as secções com ',
        code('accordionItem()'),
        ' quando o conteúdo for mais do que um parágrafo.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Instalar', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Adiciona o pacote e o seu companheiro de marcação:'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Configurar' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Opcional. As opções do Vite ficam sob a chave vite.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Publicar' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Publica o diretório de saída em qualquer alojamento estático.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Umas perguntas frequentes'),
      p(
        'A forma para a qual este componente existe: conteúdo que já está no HTML, recolhido para ser percorrido, e encontrável por um motor de busca porque nunca saiu da página.',
      ),
      demo(`return (() => {
  const faq = [
    ['É mesmo sem configuração?', 'Um projeto com um ficheiro em src/ e sem configuração constrói. Tudo o resto é opcional.'],
    ['Como funcionam as rotas dinâmicas?', 'Parênteses retos nos nomes dos ficheiros. generateStaticParams lista o que construir.'],
    ['E a pesquisa?', 'Define pagefind: true e a construção indexa todas as páginas.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('accordion()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Cadeias, ou objetos { title, content, open }.'],
        ['name', 'string', '', 'Um name partilhado torna as secções mutuamente exclusivas.'],
      ]),
      p(code('accordionItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'A linha de resumo.'],
        ['open', 'boolean', 'false', 'Se começa expandida.'],
        ['name', 'string', '', 'O mesmo efeito que no pai, quando os itens são construídos à mão.'],
      ]),
    ],
  })
