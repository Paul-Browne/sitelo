import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Progresso',
    description:
      'Uma barra para trabalho com fim conhecido, um indicador giratório para o que não tem.',
    activeHref: '/pt/ui/progress',
    extraHead: uiHead(),
    children: [
      p(
        'Usa uma barra determinada sempre que souberes quanto falta — é a única que diz alguma coisa ao leitor. Omite ',
        code('value'),
        ' e a barra passa a animar-se, o que diz «ainda a trabalhar» e mais nada.',
      ),

      h2('Determinada'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Indeterminada'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'Uma barra sem ',
        code('label'),
        ' leva ',
        code('aria-hidden'),
        ' — um papel progressbar sem nome acessível não diz nada a um leitor de ecrã, por isso uma barra sem etiqueta é tratada como decoração. Dá nome a tudo o que o leitor deva acompanhar.',
      ),

      h2('Etiquetas'),
      p(
        'Uma etiqueta nomeia o que está a acontecer; ',
        code('showValue'),
        ' acrescenta a percentagem à direita.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'A renderizar páginas', showValue: true }),
  progress({ value: 30, max: 60, label: 'A otimizar imagens', showValue: true }),
  progress({ label: 'À espera da publicação' }),
)`, { align: 'stretch' }),

      h2('Cores e altura'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Passou', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Degradado', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'A falhar', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('Uma escala que não seja 100'),
      p(
        code('max'),
        ' deixa-te passar os números em bruto — páginas construídas sobre páginas totais — em vez de calculares primeiro uma percentagem.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 de 169 páginas', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Movê-la a partir do browser'),
      p(
        'Uma barra é HTML renderizado no servidor: a percentagem é uma propriedade personalizada no preenchimento e um número em ',
        code('aria-valuenow'),
        ', e nada na página muda qualquer um dos dois por si. Dá à barra um ',
        code('id'),
        ' e ',
        code('setProgress'),
        ' move os dois em conjunto — o preenchimento, o valor anunciado e a percentagem ao lado da etiqueta.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'O máximo fica guardado, por isso as chamadas seguintes são só um valor. Ou chega ao módulo como os componentes chegam aos deles, e salta o bundle por completo:',
      ),
      codeBlock('Em qualquer sítio', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Terminar')`, 'javascript'),
      p(
        'Passar ',
        code('null'),
        ' — ou qualquer coisa que não seja um número finito — devolve a barra à animação indeterminada, por isso trabalho que deixa de dar números não precisa de um caso à parte. ',
        code('getProgress()'),
        ' lê o valor atual de volta, na escala da própria barra.',
      ),

      h2('Experimenta'),
      p('Esta página carrega o runtime, por isso os botões abaixo movem mesmo a barra.'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'A enviar', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Reiniciar'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Concluído'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Desconhecido'),
  ),
)`, { align: 'stretch' }),
      p(
        'Uma barra sem etiqueta também se move, mas continua ',
        code('aria-hidden'),
        ' — foi renderizada sem nome de propósito, e anunciar-lhe um valor agora poria uma progressbar sem nome na árvore de acessibilidade.',
      ),

      h2('Indicador giratório'),
      p(
        'Não há um componente indicador — o indicador é um ícone, e ',
        code('spin'),
        ' é o que o faz girar. Como qualquer ícone, é dimensionado em ',
        code('em'),
        ', por isso combina com o texto ao lado sem que lhe digam um tamanho.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('O indicador em contexto'),
      p(
        'Dá um ',
        code('label'),
        ' a um indicador isolado para ele ser anunciado. O que está dentro de um botão não precisa — o botão já diz o que está a fazer.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'A carregar' }),
    text({ variant: 'small', tone: 'muted' }, 'A ir buscar a última construção…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'A publicar'),
    button({ variant: 'outline', loading: true }, 'A verificar ligações'),
  ),
)`, { align: 'start' }),

      h2('Props'),
      p(code('progress()'), ' — exportado também como ', code('progressBar'), ':'),
      propsTable([
        ['value', 'number', '', 'Até onde vai. Omite-o para a animação indeterminada.'],
        ['max', 'number', '100', 'Que valor conta como completo.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Cor do preenchimento.'],
        ['label', 'Child', '', 'Texto por cima da barra; também o seu nome acessível.'],
        ['showValue', 'boolean', 'false', 'Mostrar a percentagem ao lado da etiqueta.'],
        ['height', 'Space', "'0.5rem'", 'Espessura da barra.'],
      ]),
      p(code('setProgress()'), ' de ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['target', 'Element | string', '', 'A barra, ou o id de uma. Se nenhum elemento tiver esse id, é tentado como seletor.'],
        ['value', 'number | null', '', 'Para onde a mover. null devolve-a à animação indeterminada.'],
        ['options.max', 'number', '100', 'O que conta como completo. Fica guardado para as chamadas seguintes.'],
      ]),
      p(
        'O indicador não tem props próprias — é ',
        code("icon('spinner', { spin: true })"),
        ', e aceita o que ',
        code('icon()'),
        ' aceitar.',
      ),
    ],
  })
