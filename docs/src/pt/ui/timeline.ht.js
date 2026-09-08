import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Cronologia',
    description:
      'Entradas por ordem, ao longo de uma linha — um registo de alterações, um histórico de versões, uma página «acerca».',
    activeHref: '/pt/ui/timeline',
    extraHead: uiHead(),
    children: [
      p(
        'Uma cronologia é uma lista ordenada com um traço ao lado. Constrói-a a partir de ',
        code('items'),
        ', ou de filhos ',
        code('timelineItem()'),
        ' quando as entradas não forem suficientemente uniformes para virem de um array.',
      ),

      h2('Cronologia básica'),
      demo(`timeline({
  items: [
    { time: 'Março de 2026', title: 'Biblioteca de componentes', description: 'O sitelo-ui chega com noventa componentes.' },
    { time: 'Janeiro de 2026', title: 'Ilhas de servidor', description: 'Páginas estáticas com zonas renderizadas no momento do pedido.' },
    { time: 'Outubro de 2025', title: 'Primeira versão', description: 'Rotas por ficheiros e um comando de construção.' },
  ],
})`, { align: 'stretch' }),

      h2('Marcadores coloridos'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Publicação bem-sucedida', description: '204 páginas publicadas.', color: 'success' },
    { time: '12:03', title: 'Lighthouse passou', description: 'Todos os limiares cumpridos.', color: 'success' },
    { time: '12:01', title: 'Aviso na verificação de ligações', description: 'Uma ligação externa esgotou o tempo.', color: 'warning' },
    { time: '12:00', title: 'Construção iniciada', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('Com ícones'),
      demo(`timeline(
  timelineItem({
    time: 'Agora mesmo',
    title: 'Publicado',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: 'Há 2 minutos',
    title: 'A construir',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Entradas ricas'),
      p('Os filhos de um item vão por baixo da sua descrição.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Secções de página', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Manutenção', description: 'Subida de dependências e uma correção no verificador de ligações.' }),
)`, { align: 'stretch' }),

      h2('A partir de dados'),
      p(
        'A forma habitual num site estático: um ficheiro de registo de alterações carregado pelo ',
        code('data()'),
        ' e mapeado diretamente para itens.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Secções de página' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Manutenção' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Ilhas de servidor' },
  ]

  return timeline({
    items: releases.map((release) => ({
      time: release.date,
      title: 'v' + release.version,
      description: release.summary,
      color: 'primary',
    })),
  })
})()`, { align: 'stretch' }),

      h2('Cronologia ou passos?'),
      p(
        'Uma cronologia regista o que aconteceu, do mais recente ou do mais antigo, e não tem posição atual. O ',
        code('steps()'),
        ' mostra o progresso ao longo de um percurso, com um passo em curso e os restantes à frente ou atrás dele.',
      ),

      h2('Props'),
      p(code('timeline()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Objetos com as props de timelineItem abaixo.'],
      ]),
      p(code('timelineItem()'), ':'),
      propsTable([
        ['time', 'Child', '', 'Quando aconteceu — uma data, uma versão, uma hora.'],
        ['title', 'Child', '', 'O que aconteceu.'],
        ['description', 'Child', '', 'O detalhe por baixo.'],
        ['icon', 'Child', '', 'Marcação dentro do marcador.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Cor do marcador.'],
      ]),
      p('Os filhos de um item são desenhados sob a sua descrição.'),
    ],
  })
