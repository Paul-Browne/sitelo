import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Paginierung',
    description:
      'Nummerierte Seiten, als Fenster um die aktuelle herum, als echte Links.',
    activeHref: '/de/ui/pagination',
    children: [
      p(
        code('href'),
        ' ist eine Funktion von Seitenzahl zu URL, deshalb funktioniert die Paginierung für ',
        code('/blog/2'),
        ' genauso wie für ',
        code('/blog?page=2'),
        '. Damit ist jede Seite ein echter Link — crawlbar, in einem neuen Tab zu öffnen und ohne JavaScript funktionsfähig, also genau das, was eine statische Website will.',
      ),

      h2('Einfache Paginierung'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Fenster'),
      p(
        'Die erste und die letzte Seite werden immer gezeigt, dazu ein Fenster um die aktuelle, mit Auslassungspunkten überall dort, wo die Folge springt.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Nachbarn'),
      p(
        code('siblings'),
        ' ist die Anzahl der Seiten, die zu beiden Seiten der aktuellen stehen.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Ränder'),
      p(
        'Zurück ist auf der ersten Seite deaktiviert und Weiter auf der letzten, sodass das Steuerelement nie eine Seite anbietet, die es nicht gibt.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Farben und Beschriftungen'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Neuer',
    nextLabel: 'Älter',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('Ohne hrefs'),
      p(
        'Ohne ',
        code('href'),
        ' werden die Zahlen als Buttons mit ',
        code('data-su-page'),
        ' gerendert — für eine Seite, die mit eigenem Skript an Ort und Stelle filtert. Nimm nach Möglichkeit Links: sie überleben abgeschaltetes JavaScript.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('In einem Blog'),
      p(
        'Die übliche Form auf einer statischen Website: ',
        code('generateStaticParams'),
        ' erzeugt eine Seite pro Abschnitt, und ',
        code('href'),
        ' zeigt darauf.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      'Zeige ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' von ' + posts,
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
        ['page', 'number', '1', 'Die aktuelle Seite. Wird in den gültigen Bereich geklemmt.'],
        ['count', 'number', '1', 'Wie viele Seiten es gibt.'],
        ['href', '(page: number) => string', '', 'Seitenzahl zu URL. Ohne sie werden Seiten als Buttons gerendert.'],
        ['siblings', 'number', '1', 'Seiten, die zu beiden Seiten der aktuellen gezeigt werden.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Farbe der aktuellen Seite.'],
        ['label', 'string', "'Pagination'", 'Zugänglicher Name des nav-Landmarks.'],
        ['previousLabel', 'Child', "'‹'", 'Inhalt des Zurück-Steuerelements.'],
        ['nextLabel', 'Child', "'›'", 'Inhalt des Weiter-Steuerelements.'],
      ]),
    ],
  })
