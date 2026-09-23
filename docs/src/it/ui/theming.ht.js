import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, presetPreview, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Temi',
    description:
      'Come portare il foglio di stile nella pagina, e cambiare ogni colore, raggio e carattere da una sola chiamata.',
    activeHref: '/it/ui/theming',
    children: [
      p(
        'Ogni componente legge le stesse proprietà personalizzate, quindi un tema è un insieme di override su ',
        code(':root'),
        ' — nessun passaggio di build, nessun file di configurazione, e nessun componente a cui vada detto qualcosa.',
      ),

      h2('Portare dentro gli stili'),
      p(
        code('styles()'),
        ' restituisce un ',
        code('<link>'),
        ' a un solo file, che il browser tiene in cache su tutte le pagine del sito. Non c’è niente da configurare e niente da copiare: il plugin di sitelo lo serve in sviluppo e lo scrive nella build, alla stessa base del runtime dei componenti.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Il mio sito'),
  styles(),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">`, 'javascript'),
      p(
        'Il nome porta un hash del contenuto, quindi puoi servirlo come ',
        code('immutable'),
        ' e pubblicare comunque una modifica. Passa ',
        code('{ hash: false }'),
        ' per un semplice ',
        code('/su/ui.css'),
        ', oppure ',
        code('base'),
        ' per puntare il link a una copia che ospiti tu.',
      ),
      p(
        code('{ inline: true }'),
        ' mette invece tutto il foglio in uno ',
        code('<style>'),
        ' — circa 11 kB gzippati in ogni pagina, ma nessuna richiesta in più e niente che possa sparire da ',
        code('dist/'),
        '. È il compromesso migliore per una pagina sola; il link si ripaga la propria richiesta alla seconda pagina che un visitatore legge.',
      ),
      codeBlock('src/index.ht.js', `head(
  title('Il mio sito'),
  styles({ inline: true }),
)`, 'javascript'),
      p(
        'Il resto della famiglia ti passa i pezzi. ',
        code('stylesheet()'),
        ' restituisce il CSS grezzo come stringa — per ospitare il foglio in un posto che sitelo non raggiunge, o per scriverlo tu da qualche parte — e ',
        code('stylesUrl()'),
        ' il solo href, per un elemento link tuo.',
      ),

      h2('Preset'),
      p(
        'Un preset cambia tutto l’aspetto in un colpo solo. ',
        code("styles({ preset: 'neumorphism' })"),
        ' collega un secondo foglio subito dopo quello principale — servito, con hash e in cache alle stesse condizioni — e ogni componente della pagina lo segue, senza toccare il markup.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Il mio sito'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      presetPreview('neumorphism'),
      p(
        code('neumorphism'),
        ' è soft UI: ogni superficie è la pagina stessa, e un controllo si distingue solo per luce e ombra — in rilievo sulla pagina o premuto dentro di essa. Mantiene due cose a cui questo stile di solito rinuncia, un testo che supera WCAG AA e il contorno del focus, e segue la modalità scura come tutto il resto. Però ha bisogno che lo sfondo della pagina stessa sia ',
        code('var(--su-bg)'),
        ', perché l’effetto si regge sul fatto che i due siano dello stesso colore.',
      ),
      p(
        code('theme()'),
        ' continua a funzionare sopra, quindi un preset è un punto di partenza e non un fork. Questo aggiunge una decima casella a ogni palette, ',
        code('glow'),
        ' — il colore in cui sfuma l’estremità di una barra di avanzamento o di uno switch — così un nuovo primario può portarsi il suo.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
      p(
        code('inline'),
        ' mette inline entrambi i fogli, ',
        code('stylesheet({ preset })'),
        ' li restituisce come un’unica stringa, e un nome che non è un preset lancia un errore con l’elenco di quelli che ci sono.',
      ),

      h2('Scavalcare i token'),
      p(
        code('theme()'),
        ' scrive gli override. Le chiavi sono nomi di token in camelCase, oggetti palette, o proprietà personalizzate letterali — e va ',
        code('dopo'),
        ' ',
        code('styles()'),
        ', così vince.',
      ),
      codeBlock('src/index.ht.js', `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', active: '#3f3fb0', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }),
)`, 'javascript'),
      h2('Temi circoscritti'),
      p(
        'Un ',
        code('selector'),
        ' circoscrive gli override a un sottoalbero invece che a tutta la pagina. È ciò che fanno i tre pannelli qui sotto — stessi componenti, tre palette diverse, una sola pagina.',
      ),
      demo(`fragment(
  theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff', soft: '#e6e6fa', softFg: '#33338f', border: '#b9b9ee' } }, { selector: '.theme-indigo' }),
  theme({ primary: { base: '#b0357a', hover: '#962e68', fg: '#ffffff', soft: '#fbe4f0', softFg: '#7d1f53', border: '#f0a9ce' } }, { selector: '.theme-pink' }),
  theme({ radiusMd: '999px', radiusLg: '1.5rem' }, { selector: '.theme-round' }),
  grid({ min: '11rem' },
    div({ class: 'theme-indigo' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'indaco'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-pink' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'rosa'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-round' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'arrotondato'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Modalità scura'),
      p(
        'Lo scuro si risolve da sé a partire da ',
        code('prefers-color-scheme'),
        '. Un ',
        code('data-theme'),
        ' o ',
        code('data-su-theme'),
        ' esplicito con valore ',
        code('light'),
        ' o ',
        code('dark'),
        ' su un qualunque antenato lo scavalca — ed è così che le demo di questo sito seguono il pulsante nella barra in alto.',
      ),
      p(
        'Passa ',
        code('dark'),
        ' per override che devono valere solo lì. Copre in un colpo solo l’attributo e la media query.',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('Che cosa c’è da scavalcare'),
      p(
        'Cinque palette di nove caselle ciascuna, una scala di spaziature, i caratteri, i raggi, le ombre e i colori delle superfici. Ognuno è una proprietà personalizzata — apri il foglio di stile, o l’ispettore del tuo browser, e sono tutte su ',
        code(':root'),
        '.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    ...['primary', 'neutral', 'success', 'warning', 'danger'].map((color) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: 3.5rem; height: 2rem; border-radius: 0.4rem; background: var(--su-' + color + ')' }),
        text({ variant: 'caption', tone: 'muted' }, color),
      ),
    ),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true, align: 'flex-end' },
    ...['xs', 'sm', 'md', 'lg', 'xl'].map((step) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: var(--su-space-' + step + '); height: 2rem; border-radius: 0.2rem; background: var(--su-neutral)' }),
        text({ variant: 'caption', tone: 'muted' }, step),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Nomenclatura'),
      p(
        'Una chiave in camelCase diventa una proprietà in kebab-case: ',
        code('radiusMd'),
        ' è ',
        code('--su-radius-md'),
        ', ',
        code('fontSans'),
        ' è ',
        code('--su-font-sans'),
        '. Un oggetto annidato si espande allo stesso modo — ',
        code('{ primary: { softFg: … } }'),
        ' imposta ',
        code('--su-primary-soft-fg'),
        ' — e una chiave che inizia già con ',
        code('--'),
        ' viene usata esattamente come è scritta, che è la via d’uscita per tutto ciò che la conversione non copre.',
      ),
      p(
        'Una palette ha nove caselle: ',
        code('base'),
        ', ',
        code('hover'),
        ', ',
        code('active'),
        ', ',
        code('fg'),
        ', ',
        code('soft'),
        ', ',
        code('softHover'),
        ', ',
        code('softFg'),
        ', ',
        code('border'),
        ' e ',
        code('ring'),
        '. Imposta solo quelle che stai cambiando.',
      ),

      h2('Contrasto'),
      p(
        'Le palette incluse superano il livello AA delle WCAG rispetto alle superfici su cui stanno, in entrambi i temi, e nel repository c’è un test che fa fallire la build se questo smette di essere vero. Un tema tuo non è coperto da quel test — controlla il tuo ',
        code('fg'),
        ' rispetto al tuo ',
        code('base'),
        ' prima di pubblicare.',
      ),

      h2('Props'),
      p(code('styles()'), ':'),
      propsTable([
        ['preset', "'neumorphism'", '', 'Ridisegna ogni componente con un preset, collegato o inline dopo il foglio principale.'],
        ['inline', 'boolean', 'false', 'Emetti il CSS stesso invece di un link a esso.'],
        ['hash', 'boolean', 'true', 'Metti un hash del contenuto nel nome del file. Solo forma collegata.'],
        ['base', 'string', "'/su/'", 'Punta l’URL altrove; quella copia la ospiti tu. Solo forma collegata.'],
        ['minify', 'boolean', 'true', 'Togli commenti e spazi. Solo forma inline.'],
        ['nonce', 'string', '', 'Nonce CSP per l’elemento emesso.'],
      ]),
      p(
        code('stylesUrl()'),
        ' accetta ',
        code('base'),
        ' e ',
        code('hash'),
        '; ',
        code('stylesheet()'),
        ' accetta ',
        code('minify'),
        ' e ',
        code('preset'),
        '.',
      ),
      p(code('theme(tokens, options)'), ':'),
      propsTable([
        ['selector', 'string', "':root'", 'Circoscrive gli override a un sottoalbero.'],
        ['dark', 'object', '', 'Override applicati solo in modalità scura.'],
        ['nonce', 'string', '', 'Nonce CSP.'],
      ]),
    ],
  })
