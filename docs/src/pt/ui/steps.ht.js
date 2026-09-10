import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Passos',
    description:
      'Um percurso numerado, com os passos já dados marcados como feitos.',
    activeHref: '/pt/ui/steps',
    children: [
      p(
        code('current'),
        ' é o índice do passo em curso. Tudo o que vem antes está completo e leva um visto; tudo o que vem depois ainda está para vir. O atual leva ',
        code('aria-current="step"'),
        ', por isso além de colorido também é anunciado.',
      ),

      h2('Passos básicos'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Instalar' },
    { title: 'Escrever uma página' },
    { title: 'Construir' },
    { title: 'Publicar' },
  ],
})`, { align: 'stretch' }),

      h2('Com descrições'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Instalar', description: 'npm install -D sitelo' },
    { title: 'Escrever uma página', description: 'src/index.ht.js' },
    { title: 'Construir', description: 'sitelo build' },
    { title: 'Publicar', description: 'Publicar dist/' },
  ],
})`, { align: 'stretch' }),

      h2('Vertical'),
      p('Melhor quando as descrições passam de umas quantas palavras.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Adicionar o pacote', description: 'O sitelo traz o seu próprio Vite, por isso não há mais nada para instalar.' },
    { title: 'Escrever uma função que devolva HTML', description: 'Um ficheiro em src/ já é um site inteiro.' },
    { title: 'Publicar o resultado', description: 'dist/ são ficheiros estáticos simples — qualquer alojamento os aceita.' },
  ],
})`, { align: 'stretch' }),

      h2('Ainda nada feito'),
      demo(`steps({ current: 0, items: ['Instalar', 'Configurar', 'Publicar'] })`, { align: 'stretch' }),

      h2('Tudo feito'),
      p(
        'Põe o ',
        code('current'),
        ' para lá do último índice e todos os passos se leem como completos.',
      ),
      demo(`steps({ current: 3, items: ['Instalar', 'Configurar', 'Publicar'] })`, { align: 'stretch' }),

      h2('Num telemóvel'),
      p(
        'Uma fila horizontal não tem para onde ir num ecrã estreito, por isso abaixo de 40rem passa a vertical sozinha — sem prop nenhuma. Estreita esta janela para ver.',
      ),

      h2('Dar-lhe nome'),
      p(
        'A lista é um ',
        code('<ol>'),
        ', que já carrega a ordem. Acrescenta ',
        code('label'),
        ' quando a página tiver mais do que um conjunto de passos e for preciso distingui-los.',
      ),
      demo(`steps({
  label: 'Progresso da publicação',
  current: 1,
  items: ['Construir', 'Carregar', 'Invalidar a cache'],
})`, { align: 'stretch' }),

      h2('Avançar o fluxo'),
      p(
        'O estado são três nomes de classe e um ',
        code('aria-current'),
        ', espalhados por todos os passos. ',
        code('setStep()'),
        ' move-os em conjunto, por isso um assistente que avança no browser é uma chamada e não um ciclo.',
      ),
      p('Um índice para lá do último passo deixa-os todos completos, que é o aspeto de um fluxo terminado. Ou a partir de um atributo de evento, sem nada no bundle:'),
      codeBlock('Em qualquer sítio', `button({ onclick: "import('/su/steps.js').then(m=>m.set('checkout',2))" }, 'Next')`, 'javascript'),
      p('Ou a partir do teu próprio módulo, quando já houver um a correr:'),
      codeBlock('src/main.js', `import { setStep } from 'sitelo/ui/client'

setStep('checkout', 2)`, 'javascript'),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadeias, ou objetos { title, description }.'],
        ['current', 'number', '0', 'Índice do passo em curso.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Disposição. A horizontal passa a vertical abaixo de 40rem.'],
        ['label', 'string', '', 'Nome acessível da lista.'],
      ]),
    ],
  })
