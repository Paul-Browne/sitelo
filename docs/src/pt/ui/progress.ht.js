import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
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

      h2('Indicador giratório'),
      p(
        'Um indicador giratório é dimensionado em ',
        code('em'),
        ', por isso combina com o texto ao lado sem que lhe digam um tamanho.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  spinner({ size: 'sm' }),
  spinner(),
  spinner({ size: 'lg' }),
)`),

      h2('O indicador em contexto'),
      p(
        'Dá um ',
        code('label'),
        ' a um indicador isolado para ele ser anunciado. O que está dentro de um botão não precisa — o botão já diz o que está a fazer.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    spinner({ label: 'A carregar' }),
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
      p(code('spinner()'), ':'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diâmetro. O médio é dimensionado em em, para combinar com o texto ao lado.'],
        ['label', 'string', '', 'Nome acessível. Sem ele, o indicador fica escondido dos leitores de ecrã.'],
      ]),
    ],
  })
