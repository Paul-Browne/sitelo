import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Select',
    description:
      'Un select nativo, stilizzato per stare con gli altri input, con le opzioni costruite dai dati.',
    activeHref: '/it/ui/select',
    children: [
      p(
        'Questo è un vero ',
        code('<select>'),
        ' con il menu a tendina del browser — il che significa che funziona senza JavaScript, si apre correttamente su un telefono, ed è navigabile da tastiera senza nulla che arrivi da questa libreria.',
      ),
      p(
        code('select()'),
        ' è il controllo nudo; ',
        code('selectField()'),
        ' lo avvolge in un’etichetta, un testo di aiuto e un messaggio di errore, allo stesso modo di ',
        code('textField()'),
        '.',
      ),

      h2('Select di base'),
      p(
        'Le opzioni possono essere semplici stringhe, nel qual caso il valore e l’etichetta coincidono.',
      ),
      demo(`selectField({
  label: 'Tema',
  name: 'theme',
  options: ['Chiaro', 'Scuro', 'Di sistema'],
})`, { align: 'stretch' }),

      h2('Valori ed etichette'),
      p(
        'Passa degli oggetti quando il valore inviato è diverso dal testo che una persona legge. ',
        code('value'),
        ' segna l’opzione selezionata.',
      ),
      demo(`selectField({
  label: 'Output',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — il predefinito' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Segnaposto'),
      p(
        'Un segnaposto viene renderizzato come prima opzione disattivata, selezionata quando ',
        code('value'),
        ' manca — così il campo parte vuoto senza essere una scelta valida.',
      ),
      demo(`selectField({
  label: 'Destinazione del deploy',
  name: 'target',
  placeholder: 'Scegli un host…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Gruppi'),
      p(
        'Una voce con un proprio array ',
        code('options'),
        ' diventa un ',
        code('<optgroup>'),
        '.',
      ),
      demo(`selectField({
  label: 'Estensione della pagina',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Dimensioni'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Piccolo', name: 'sm', size: 'sm', options: ['Uno', 'Due'] }),
  selectField({ label: 'Medio', name: 'md', size: 'md', options: ['Uno', 'Due'] }),
  selectField({ label: 'Grande', name: 'lg', size: 'lg', options: ['Uno', 'Due'] }),
)`, { align: 'stretch' }),

      h2('Aiuto, errore e disattivato'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Lingua',
    name: 'locale',
    options: ['it', 'es', 'fr'],
    help: 'Usata per l’attributo lang dell’html.',
  }),
  selectField({
    label: 'Framework',
    name: 'framework',
    placeholder: 'Scegline uno…',
    options: ['sitelo'],
    error: 'Scegli un framework per proseguire.',
  }),
  selectField({
    label: 'Piano',
    name: 'plan',
    options: ['Gratuito'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('Dai dati'),
      p(
        'Le opzioni sono semplicemente un array, quindi di solito arrivano da quello che ',
        code('data()'),
        ' ha già caricato per la pagina.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Ciao mondo' },
    { slug: 'static-first', title: 'Prima lo statico' },
    { slug: 'no-runtime', title: 'Nessun runtime' },
  ]

  return selectField({
    label: 'Articolo in evidenza',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'Stringhe, oggetti { value, label, disabled }, oppure { label, options } per un gruppo.'],
        ['value', 'string | number', '', 'Quale opzione è selezionata.'],
        ['placeholder', 'string', '', 'Prima opzione disattivata, selezionata quando non c’è alcun valore.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Altezza del controllo e dimensione del testo.'],
        ['name', 'string', '', 'Nome del campo del form; da esso si ricava l’id.'],
        ['invalid', 'boolean', 'false', 'Imposta aria-invalid. selectField lo imposta per te a partire da error.'],
        ['disabled', 'boolean', 'false', 'Disattiva il controllo.'],
      ]),
      p(
        code('selectField()'),
        ' accetta in più ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ' e ',
        code('fieldClass'),
        ' — vedi ',
        code('textField()'),
        '. I figli vengono aggiunti dopo le opzioni generate, così puoi scriverne a mano quante te ne servono.',
      ),
    ],
  })
