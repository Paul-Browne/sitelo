import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Estado vazio',
    description:
      'O aspeto de uma lista antes de ter seja o que for lá dentro.',
    activeHref: '/pt/ui/empty',
    children: [
      p(
        'Um espaço em branco lê-se como um bug. Um estado vazio diz qual é o espaço vazio, porquê, e o que fazer a seguir — e é o caso mais facilmente esquecido, porque durante o desenvolvimento há sempre dados.',
      ),

      h2('Estado vazio básico'),
      demo(`empty({
  title: 'Ainda não há artigos',
  description: 'Põe um ficheiro Markdown em src/posts e ele aparece aqui.',
})`, { align: 'stretch' }),

      h2('Com um ícone'),
      p(
        'O ícone é decoração — leva ',
        code('aria-hidden'),
        ', porque o título já diz o que se passa.',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: 'Aqui não há nada',
  description: 'Esta pasta não tem páginas nenhumas.',
})`, { align: 'stretch' }),

      h2('Com uma ação'),
      p('Os filhos passam a ser a fila de ações.'),
      demo(`empty({
  icon: icon('search'),
  title: 'Sem resultados para «ilhas»',
  description: 'Confere a ortografia, ou percorre antes a documentação.',
},
  button({ href: '/pt/docs' }, 'Percorrer a documentação'),
  button({ variant: 'outline', color: 'neutral' }, 'Limpar a pesquisa'),
)`, { align: 'stretch' }),

      h2('Num cartão'),
      demo(`card(
  cardHeader({ title: 'Publicações' }),
  cardBody(
    empty({
      title: 'Ainda não há publicações',
      description: 'Faz push para main e a primeira construção aparece aqui.',
    }, button({ size: 'sm' }, 'Ligar um repositório')),
  ),
)`, { align: 'stretch' }),

      h2('Em vez de uma tabela'),
      p(
        'Troca a tabela por um estado vazio em vez de desenhar um cabeçalho sem linha nenhuma por baixo.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'Histórico de construções' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'Commit' }], rows })
      : cardBody(empty({
          title: 'Sem construções registadas',
          description: 'As execuções aparecem aqui assim que o site for publicado pelo menos uma vez.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['icon', 'Child', '', 'Símbolo decorativo por cima do título; escondido dos leitores de ecrã.'],
        ['title', 'Child', '', 'O que está vazio, em poucas palavras.'],
        ['description', 'Child', '', 'Porque está vazio, ou o que fazer quanto a isso.'],
      ]),
      p('Os filhos são desenhados como a fila de ações sob a descrição.'),
    ],
  })
