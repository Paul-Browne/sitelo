import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/it.js'
import { preview } from '../../lib/ui-demo.js'

/**
 * Una scheda per ogni pagina di componente, raggruppate esattamente come
 * il riferimento dei componenti. Ogni `demo` è renderizzata dal vivo
 * dentro la propria scheda.
 */
const GROUPS = [
  ['Layout', [
    ['/it/ui/container', 'Contenitore', 'Una colonna di pagina centrata e limitata in larghezza.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'centrata'))`],
    ['/it/ui/stack', 'Pila', 'Una riga o colonna flex con un token di spaziatura per il gap.',
      `stack({ direction: 'row', gap: 'sm' }, chip('uno'), chip('due'), chip('tre'))`],
    ['/it/ui/grid', 'Griglia', 'Sistema quante più colonne ci stanno, senza media query.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/it/ui/divider', 'Divisore', 'Una linea fra sezioni, con o senza etichetta.',
      `div({ style: 'width: 100%' }, divider('oppure'))`],
    ['/it/ui/aspect-ratio', 'Proporzioni', 'Tieni un riquadro a una forma fissa, così niente si sposta al caricamento.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/it/ui/card', 'Scheda', 'Una superficie per contenuti raggruppati, con intestazione, corpo e piè di pagina.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'Una scheda')))`],
  ]],
  ['Tipografia', [
    ['/it/ui/typography', 'Tipografia', 'Una scala tipografica che sceglie da sé il proprio elemento.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Intestazione'), text({ variant: 'caption', tone: 'muted' }, 'Didascalia'))`],
    ['/it/ui/prose', 'Prosa', 'Dai stile a HTML grezzo che arriva da Markdown o da un CMS.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>Un’intestazione</strong></p><p>E un paragrafo.</p>')`],
    ['/it/ui/link', 'Collegamento', 'Un’ancora con stile, con gli attributi che servono a un link esterno.',
      `text({ variant: 'small' }, 'Leggi la ', link({ href: '/docs' }, 'documentazione'), '.')`],
    ['/it/ui/icons', 'Icone', '99 glifi su una griglia, dimensionati e colorati dal testo attorno.',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['Campi', [
    ['/it/ui/button', 'Pulsante', 'Cinque varianti, cinque colori, tre dimensioni.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Salva'), button({ size: 'sm', variant: 'outline' }, 'Annulla'))`],
    ['/it/ui/button-group', 'Gruppo di pulsanti', 'Pulsanti uniti in un unico controllo.',
      `buttonGroup({ label: 'Anteprima' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Uno'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Due'))`],
    ['/it/ui/text-field', 'Campo di testo', 'Etichetta, controllo, testo di aiuto ed errore, già collegati.',
      `textField({ label: 'Email', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/it/ui/select', 'Select', 'Un select nativo, stilizzato per stare con gli altri.',
      `selectField({ label: 'Tema', name: 'g-theme', size: 'sm', options: ['Chiaro', 'Scuro'], value: 'Scuro' })`],
    ['/it/ui/checkbox', 'Casella di controllo', 'Un input vero, stilizzato con il CSS invece che sostituito.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Sitemap', checked: true }), checkbox({ label: 'Feed RSS' }))`],
    ['/it/ui/radio', 'Gruppo di radio', 'Una scelta fra diverse, come radio che condividono un nome.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['free', 'pro'] })`],
    ['/it/ui/switch', 'Interruttore', 'Un acceso/spento per un’impostazione che si applica subito.',
      `stack({ gap: 'sm' }, toggle({ label: 'Pubblico', checked: true }), toggle({ label: 'Bozze' }))`],
    ['/it/ui/slider', 'Cursore', 'Un input range nativo, stilizzato per stare con gli altri.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Anteprima' }))`],
    ['/it/ui/toggle-button', 'Pulsante a due stati', 'Un pulsante che resta premuto.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'Acceso'), toggleButton({ size: 'sm' }, 'Spento'))`],
    ['/it/ui/toggle-group', 'Gruppo a due stati', 'Un controllo segmentato, come pulsanti o come link.',
      `toggleGroup({ size: 'sm', label: 'Anteprima', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Visualizzazione dati', [
    ['/it/ui/avatar', 'Avatar', 'Un’immagine quando c’è, le iniziali quando non c’è.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/it/ui/badge', 'Badge', 'Un conteggio o un pallino appuntato a un angolo.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Posta'))`],
    ['/it/ui/chip', 'Chip', 'Un tag, uno stato, un filtro.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'superata'), chip({ color: 'neutral' }, 'statico'))`],
    ['/it/ui/tooltip', 'Tooltip', 'Un suggerimento al passaggio del mouse e al focus, tutto in CSS.',
      `tooltip({ content: 'Nessuno script necessario' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Passaci sopra'))`],
    ['/it/ui/table', 'Tabella', 'Righe e colonne dai dati, in un contenitore che scorre.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Pagina' }, { key: 's', header: 'Dimensione', align: 'end' }],
        rows: [{ p: '/', s: '4,1 kB' }, { p: '/docs', s: '12,7 kB' }] })`],
    ['/it/ui/list', 'Elenco', 'Righe con qualcosa ai due lati.',
      `list({ plain: true }, listItem({ title: 'Routing', description: 'Basato sui file' }))`],
    ['/it/ui/figure', 'Figura', 'Un’immagine e la sua didascalia, come un’unica figura.',
      `figure({ src: '/logo.svg', alt: '', caption: 'Una didascalia', style: 'width: 7rem' })`],
    ['/it/ui/carousel', 'Carosello', 'Diapositive che si agganciano, con pallini e frecce disegnati dal browser.',
      `div({ style: 'width: 100%' }, carousel({ perView: 2.4, gap: 'sm', arrows: false, items: ['1', '2', '3'].map((n) =>
        aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          div({ style: 'display: grid; place-items: center; color: var(--su-text-subtle)' }, n))) }))`],
  ]],
  ['Feedback', [
    ['/it/ui/alert', 'Avviso', 'Un messaggio la cui icona e il cui ruolo ARIA seguono il colore.',
      `alert({ color: 'success' }, 'Pubblicato.')`],
    ['/it/ui/empty', 'Stato vuoto', 'Che aspetto ha un elenco prima che ci sia dentro qualcosa.',
      `empty({ title: 'Qui non c’è niente', style: 'padding: 0' })`],
    ['/it/ui/progress', 'Avanzamento', 'Una barra per un lavoro noto, una rotella per il resto.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/it/ui/skeleton', 'Scheletro', 'Un segnaposto nella forma del contenuto in arrivo.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/it/ui/toast', 'Toast', 'Un messaggio passeggero, aggiunto da script.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Salvato.'))`],
  ]],
  ['Navigazione', [
    ['/it/ui/breadcrumbs', 'Breadcrumb', 'La scia di antenati che finisce su questa pagina.',
      `breadcrumbs({ items: [{ label: 'Documentazione', href: '/docs' }, { label: 'UI' }] })`],
    ['/it/ui/pagination', 'Impaginazione', 'Pagine numerate, incorniciate, come link veri.',
      `pagination({ page: 2, count: 5, href: (page) => '/ui#p' + page })`],
    ['/it/ui/tabs', 'Schede', 'Link, una pagina per scheda — oppure pannelli che si scambiano sul posto.',
      `tabs({ variant: 'pills', items: [{ label: 'Uno', href: '/ui#t1', active: true }, { label: 'Due', href: '/ui#t2' }] })`],
    ['/it/ui/app-bar', 'Barra applicazione', 'La marca da un lato, navigazione e azioni dall’altro.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/it/ui/theme-toggle', 'Cambio tema', 'Chiaro e scuro, senza il lampo all’ingresso.',
      `themeToggle()`],
  ]],
  ['Sovrapposizioni', [
    ['/it/ui/modal', 'Modale', 'Una finestra di dialogo sull’API popover — nessuno script.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Apri il modale')`],
    ['/it/ui/drawer', 'Pannello laterale', 'Un pannello dal bordo, stessa meccanica popover.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Apri il pannello')`],
    ['/it/ui/menu', 'Menu', 'Un menu a tendina costruito su details, apertura e chiusura gratis.',
      `chip({ color: 'neutral' }, 'Azioni ▾')`],
    ['/it/ui/accordion', 'Fisarmonica', 'Sezioni comprimibili, modalità esclusiva compresa.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'Una domanda' }] }))`],
    ['/it/ui/collapsible', 'Comprimibile', 'Un solo “mostra altro”, senza la cornice della fisarmonica.',
      `collapsible({ trigger: 'Mostra altro' }, 'Nascosto finché non lo chiedi.')`],
  ]],
  ['Sezioni', [
    ['/it/ui/hero', 'Hero', 'La parte alta di una landing page: titolo, frase, azioni.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'Un titolo'), text({ variant: 'caption', tone: 'muted' }, 'E una frase.'))`],
    ['/it/ui/footer', 'Piè di pagina', 'Colonne di link, e una riga sotto di esse.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Documentazione'), text({ variant: 'caption', tone: 'muted' }, 'Guida · Componenti'))`],
    ['/it/ui/stat', 'Statistica', 'Un numero che vale la pena guardare, e cosa significa.',
      `stat({ label: 'Pagine', value: '204', change: '+8', color: 'success' })`],
    ['/it/ui/steps', 'Passaggi', 'Un percorso numerato, con ciò che è fatto segnato come fatto.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Installa', 'Costruisci'] }))`],
    ['/it/ui/timeline', 'Cronologia', 'Voci in ordine, lungo una linea.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Sezioni', color: 'primary' }] }))`],
    ['/it/ui/mockup', 'Mockup', 'Una schermata dentro un browser, una finestra, un telefono o un terminale.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Stile', [
    ['/it/ui/theming', 'Temi', 'Ogni colore, raggio e carattere, da una sola chiamata.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** Una scheda della galleria. L’anteprima è inerte, il nome è un link steso. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * Un div, non un’ancora: queste anteprime contengono pulsanti e input
     * veri, e il contenuto interattivo non può annidarsi dentro un link.
     * È l’ancora del nome a stendersi invece su tutta la scheda, e `inert`
     * toglie i controlli della demo dall’ordine di tabulazione e
     * dall’albero di accessibilità.
     */
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — componenti per sitelo',
    description:
      'Una libreria di componenti per sitelo: pulsanti, schede, form, tabelle e modali, come funzioni che restituiscono HTML.',
    activeHref: '/it/ui',
    children: [
      p(
        'sitelo-ui è una libreria di componenti per sitelo. Ogni componente è una funzione che restituisce una stringa di HTML, quindi si annida direttamente nella pagina che stai già scrivendo — nessun compilatore, nessun runtime, nessuna idratazione.',
      ),
      p(
        'Ogni esempio di questa sezione è renderizzato dalla stessa build che renderizza la pagina attorno. Quello che vedi è ciò che il codice sotto ha prodotto, e segue i temi chiaro e scuro di questo sito perché sitelo-ui legge lo stesso attributo ',
        code('data-theme'),
        ' che legge la documentazione.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Come si comincia'),
      p(
        'Due righe: importa i componenti, e metti ',
        code('styles()'),
        ' nella head. La ',
        a({ href: '/it/docs/ui' }, 'pagina Componenti nella documentazione'),
        ' copre installazione, temi, convenzione di chiamata e runtime client facoltativo, ed elenca ogni export in un’unica tabella.',
      ),
      p(
        'La cartella ',
        code('examples/ui'),
        ' nel repository renderizza tutto l’insieme su una sola pagina.',
      ),

      h2('Extra'),
      p(
        'Non tutto sta in un unico foglio di stile. Ciò che è texture e decorazione — una grana da pellicola, per cominciare — vive sotto ',
        a({ href: '/ui-extras' }, 'sitelo UI extras'),
        ', un secondo punto di ingresso dove ogni componente porta un foglio suo, così una pagina collega solo ciò che usa.',
      ),
    ],
  })
