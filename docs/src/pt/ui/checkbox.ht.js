import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Caixa de seleção',
    description:
      'Uma caixa e a sua etiqueta como um só controlo — um input a sério, estilizado com CSS em vez de substituído.',
    activeHref: '/pt/ui/checkbox',
    extraHead: uiHead(),
    children: [
      p(
        code('checkbox()'),
        ' desenha um ',
        code('<label>'),
        ' a envolver um ',
        code('<input type="checkbox">'),
        ' a sério e a caixa que vês. O input está escondido visualmente mas continua lá, por isso recebe foco, é submetido, e a etiqueta toda é área de clique — o visto é desenhado a partir do próprio estado ',
        code(':checked'),
        ' do input, sem script nenhum pelo meio.',
      ),

      h2('Caixa básica'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Enviar-me novidades por email', name: 'updates' }),
  checkbox({ label: 'Selecionada', name: 'checked', checked: true }),
)`),

      h2('Cores'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Desativado'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Indisponível', disabled: true }),
  checkbox({ label: 'Ligada e bloqueada', checked: true, disabled: true }),
)`),

      h2('Etiquetas longas'),
      p(
        'A caixa mantém-se alinhada com a primeira linha em vez de se centrar perante um parágrafo.',
      ),
      demo(`checkbox({
  label: 'Correr uma auditoria Lighthouse depois de cada construção, e falhar a construção quando uma pontuação descer abaixo do limiar.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Grupos'),
      p(
        code('choiceGroup()'),
        ' constrói um conjunto de caixas a partir de dados, com legenda e name partilhados. Passa um array em ',
        code('value'),
        ' para selecionar várias.',
      ),
      demo(`choiceGroup({
  legend: 'Gerar',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Índice Pagefind' },
  ],
  help: 'Cada um é escrito em dist/ no fim da construção.',
})`, { align: 'stretch' }),

      h2('Em linha'),
      demo(`choiceGroup({
  legend: 'Categorias',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('Com um field'),
      p(
        'Uma caixa isolada raramente precisa também de uma etiqueta por cima. Quando um grupo precisa, ',
        code('field()'),
        ' dá-lhe o mesmo tratamento de etiqueta, ajuda e erro que a um campo de texto.',
      ),
      demo(`field({ label: 'Termos', error: 'Tens de aceitar os termos para continuar.' },
  checkbox({ label: 'Aceito os termos', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Texto ao lado da caixa. Omite-o para um controlo nu.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Cor quando selecionada.'],
        ['checked', 'boolean', 'false', 'Se começa selecionada.'],
        ['name', 'string', '', 'Nome do campo do formulário.'],
        ['value', 'string | number', '', 'Valor submetido quando selecionada.'],
        ['disabled', 'boolean', 'false', 'Desativa o input e esbate a etiqueta.'],
      ]),
      p(
        'Tudo o resto aterra no ',
        code('<input>'),
        ', não na etiqueta — por isso ',
        code('required'),
        ', ',
        code('onchange'),
        ' e ',
        code('data-*'),
        ' vão para onde esperas. Usa ',
        code('class'),
        ' para estilizar a própria etiqueta.',
      ),
      p(
        'Para um conjunto construído a partir de dados, vê ',
        code('choiceGroup()'),
        ' na página ',
        code('Grupo de opções'),
        ' — aceita as mesmas opções em qualquer dos casos, comutado por ',
        code("type: 'checkbox'"),
        '.',
      ),
    ],
  })
