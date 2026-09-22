import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Gruppo a due stati',
    description:
      'Un controllo segmentato: pulsanti a due stati uniti in uno solo, oppure link in cui ogni segmento è una pagina a sé.',
    activeHref: '/it/ui/toggle-group',
    children: [
      p(
        'Un gruppo a due stati è una riga di scelte che si legge come un unico controllo. Costruiscilo da ',
        code('items'),
        ', e di’ quale è acceso con ',
        code('value'),
        '.',
      ),

      h2('Gruppo di base'),
      demo(`toggleGroup({
  label: 'Allineamento del testo',
  value: 'center',
  items: [
    { value: 'left', label: 'Sinistra' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Destra' },
  ],
})`),

      h2('Semplici stringhe'),
      demo(`toggleGroup({ label: 'Densità', value: 'comoda', items: ['compatta', 'comoda', 'ariosa'] })`),

      h2('Link'),
      p(
        'Questa è la forma che di solito vuole un sito statico: ogni segmento è una pagina. Gli elementi con un ',
        code('href'),
        ' vengono renderizzati come ancore e quello attivo è marcato ',
        code('aria-current="page"'),
        ' — non ',
        code('aria-pressed'),
        ', perché un link non è un pulsante che hai premuto.',
      ),
      demo(`toggleGroup({
  label: 'Sezione',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Documentazione', href: '/docs' },
    { value: 'ui', label: 'UI', href: '/ui' },
    { value: 'examples', label: 'Esempi', href: '/examples' },
  ],
})`),

      h2('Più di uno acceso'),
      p(
        'Passa un array come ',
        code('value'),
        '. In ogni caso il contenitore è un semplice ',
        code('group'),
        ' — un ',
        code('radiogroup'),
        ' sarebbe sbagliato, visto che questi sono pulsanti premuti e non radio.',
      ),
      demo(`toggleGroup({
  label: 'Formattazione',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Grassetto' },
    { value: 'italic', label: 'Corsivo' },
    { value: 'underline', label: 'Sottolineato' },
  ],
})`),

      h2('Dimensioni e varianti'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Piccolo', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Medio', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Grande', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Elementi disattivati'),
      demo(`toggleGroup({
  label: 'Renderer',
  value: 'static',
  items: [
    { value: 'static', label: 'Statico' },
    { value: 'islands', label: 'Island' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('In una barra degli strumenti'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Allineamento', value: 'Sinistra', size: 'sm', items: ['Sinistra', 'Centro', 'Destra'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Stile', value: ['Grassetto'], size: 'sm', items: ['Grassetto', 'Corsivo'] }),
)`),

      h2('Quando usare qualcos’altro'),
      p(
        'Se la scelta viene inviata con un form, usa ',
        code('choiceGroup()'),
        ' — radio veri, nessuno script necessario. Se ogni segmento è una pagina, preferisci la forma a link qui sopra. Un gruppo a due stati è per una scelta su cui agisce la pagina stessa.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Stringhe, oppure oggetti { value, label, href, disabled }.'],
        ['value', 'string | number | Array', '', 'Quale elemento è acceso. Un array quando possono essercene più d’uno.'],
        ['label', 'string', '', 'Nome accessibile del gruppo.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Applicata a ogni elemento.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Che aspetto ha un elemento spento.'],
      ]),
    ],
  })
