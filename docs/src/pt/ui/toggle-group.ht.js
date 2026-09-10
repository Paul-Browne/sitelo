import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Grupo de alternância',
    description:
      'Um controlo segmentado: botões de alternância unidos num só, ou ligações em que cada segmento é a sua própria página.',
    activeHref: '/pt/ui/toggle-group',
    children: [
      p(
        'Um grupo de alternância é uma fila de escolhas que se lê como um único controlo. Constrói-o a partir de ',
        code('items'),
        ', e diz qual está ligado com ',
        code('value'),
        '.',
      ),

      h2('Grupo básico'),
      demo(`toggleGroup({
  label: 'Alinhamento do texto',
  value: 'center',
  items: [
    { value: 'left', label: 'Esquerda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Direita' },
  ],
})`),

      h2('Cadeias simples'),
      demo(`toggleGroup({ label: 'Densidade', value: 'confortável', items: ['compacta', 'confortável', 'espaçosa'] })`),

      h2('Ligações'),
      p(
        'É esta a forma que um site estático normalmente quer: cada segmento é uma página. Os itens com ',
        code('href'),
        ' são desenhados como âncoras e o ativo é marcado com ',
        code('aria-current="page"'),
        ' — e não ',
        code('aria-pressed'),
        ', porque uma ligação não é um botão que ficou carregado.',
      ),
      demo(`toggleGroup({
  label: 'Secção',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Documentação', href: '/pt/docs' },
    { value: 'ui', label: 'UI', href: '/pt/ui' },
    { value: 'examples', label: 'Exemplos', href: '/pt/examples' },
  ],
})`),

      h2('Mais do que um ligado'),
      p(
        'Passa um array em ',
        code('value'),
        '. O contentor é um ',
        code('group'),
        ' simples em qualquer dos casos — um ',
        code('radiogroup'),
        ' estaria errado, já que estes são botões carregados e não rádios.',
      ),
      demo(`toggleGroup({
  label: 'Formatação',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Negrito' },
    { value: 'italic', label: 'Itálico' },
    { value: 'underline', label: 'Sublinhado' },
  ],
})`),

      h2('Tamanhos e variantes'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Pequeno', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Médio', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Grande', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Itens desativados'),
      demo(`toggleGroup({
  label: 'Renderização',
  value: 'static',
  items: [
    { value: 'static', label: 'Estática' },
    { value: 'islands', label: 'Ilhas' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('Numa barra de ferramentas'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Alinhamento', value: 'Esquerda', size: 'sm', items: ['Esquerda', 'Centro', 'Direita'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Estilo', value: ['Negrito'], size: 'sm', items: ['Negrito', 'Itálico'] }),
)`),

      h2('Quando usar outra coisa'),
      p(
        'Se a escolha for submetida com um formulário, usa ',
        code('choiceGroup()'),
        ' — rádios a sério, sem script nenhum. Se cada segmento for uma página, prefere a forma em ligações acima. Um grupo de alternância serve para uma escolha sobre a qual a própria página atua.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadeias, ou objetos { value, label, href, disabled }.'],
        ['value', 'string | number | Array', '', 'Que item está ligado. Um array quando podem ser vários.'],
        ['label', 'string', '', 'Nome acessível do grupo.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Aplicado a todos os itens.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'O aspeto de um item desligado.'],
      ]),
    ],
  })
