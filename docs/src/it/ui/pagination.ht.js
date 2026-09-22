import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Impaginazione',
    description:
      'Pagine numerate, incorniciate attorno a quella corrente, come link veri.',
    activeHref: '/it/ui/pagination',
    children: [
      p(
        code('href'),
        ' è una funzione dal numero di pagina all’URL, quindi l’impaginazione funziona tanto per ',
        code('/blog/2'),
        ' quanto per ',
        code('/blog?page=2'),
        '. È questo che rende ogni pagina un link vero — scansionabile, apribile in una nuova scheda e funzionante senza JavaScript, che è ciò che vuole un sito statico.',
      ),

      h2('Impaginazione di base'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Finestra'),
      p(
        'La prima e l’ultima pagina sono sempre mostrate, più una finestra attorno a quella corrente, con dei puntini di sospensione ovunque la sequenza salti.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Fratelli'),
      p(
        code('siblings'),
        ' è quante pagine stanno ai due lati di quella corrente.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Estremità'),
      p(
        'Il precedente è disattivato sulla prima pagina e il successivo sull’ultima, così il controllo non offre mai una pagina che non esiste.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Colori ed etichette'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Più recenti',
    nextLabel: 'Più vecchi',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('Senza href'),
      p(
        'Senza ',
        code('href'),
        ', i numeri vengono renderizzati come pulsanti che portano ',
        code('data-su-page'),
        ' — per una pagina che filtra sul posto con uno script proprio. Quando puoi preferisci i link: sopravvivono a JavaScript disattivato.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('In un blog'),
      p(
        'La forma consueta su un sito statico: ',
        code('generateStaticParams'),
        ' produce una pagina per ogni fetta, e ',
        code('href'),
        ' ci punta.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      'Mostrati ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' di ' + posts,
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['page', 'number', '1', 'La pagina corrente. Riportata nell’intervallo valido.'],
        ['count', 'number', '1', 'Quante pagine ci sono.'],
        ['href', '(page: number) => string', '', 'Dal numero di pagina all’URL. Senza, le pagine diventano pulsanti.'],
        ['siblings', 'number', '1', 'Pagine mostrate ai due lati di quella corrente.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colore della pagina corrente.'],
        ['label', 'string', "'Pagination'", 'Nome accessibile del punto di riferimento nav.'],
        ['previousLabel', 'Child', "'‹'", 'Contenuto del controllo precedente.'],
        ['nextLabel', 'Child', "'›'", 'Contenuto del controllo successivo.'],
      ]),
    ],
  })
