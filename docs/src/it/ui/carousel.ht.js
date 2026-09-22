import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Carosello',
    description:
      'Diapositive che scorri, agganciandosi lungo la strada — e pallini e frecce che il foglio di stile chiede al browser di disegnare.',
    activeHref: '/it/ui/carousel',
    children: [
      p(
        'Qui un carosello è un contenitore che scorre e una fila di diapositive che si agganciano. Questo ogni browser lo sa già fare: lo scorrimento con il dito, il trackpad, shift più rotella e i tasti freccia funzionano tutti al primo paint, senza nulla di caricato e nulla da idratare.',
      ),
      p(
        'Dove il browser può, i pallini e le frecce non sono affatto markup. Sono ',
        code('::scroll-marker'),
        ' su ogni diapositiva e ',
        code('::scroll-button()'),
        ' sulla pista — pseudo-elementi che il foglio di stile richiede e che il browser poi disegna, nomina, collega alla posizione di scorrimento, marca come corrente e disattiva alle estremità. Su questo componente non c’è alcun attributo ',
        code('data-'),
        ' e nessun modulo da importare: lo stato è lo scostamento di scorrimento, e il browser ce l’ha già.',
      ),
      p(
        'Dove non può, subentra una fila di pallini renderizzata: un link per diapositiva, che funziona da sé, e che al primo scorrimento o al primo tocco si va a prendere qualche centinaio di byte di script per comportarsi come i pallini nativi — seguendo lo scorrimento, e muovendo la pista senza muovere la pagina.',
      ),

      h2('Una per volta'),
      p(
        'Il comportamento predefinito. Ogni diapositiva riempie la pista, si aggancia all’inizio e si ferma lì invece di volare avanti di tre.',
      ),
      demo(`carousel({
  items: ['Costa', 'Porto', 'Campi', 'Centro storico'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('Diverse per volta'),
      p(
        code('perView'),
        ' è quante diapositive riempiono la pista, e ',
        code('min'),
        ' è un limite minimo a quanto stretta può farsi una. Quel limite sostituisce una media query: appena la quota di pista di una diapositiva scende sotto di esso, le diapositive restano larghe così e ne stanno meno — lo stesso trucco che ',
        code('grid()'),
        ' gioca con l’adattamento automatico.',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['Routing', 'Dati', 'Risorse', 'Immagini', 'Island', 'Ricerca'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, 'Guida'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('Uno sguardo alla prossima'),
      p(
        'Un ',
        code('perView'),
        ' frazionario lascia intravedere una fetta della diapositiva successiva, che è il modo meno costoso per dire “questo scorre” senza alcuna cornice.',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['Uno', 'Due', 'Tre'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('Responsivo senza un breakpoint tuo'),
      p(
        code('perView'),
        ' è scritto come proprietà personalizzata, quindi una media query può cambiarlo senza toccare il markup — e senza che il componente debba conoscere i tuoi breakpoint:',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('Agganciamento'),
      p(
        'L’agganciamento è ',
        code('mandatory'),
        ' per impostazione predefinita: uno scorrimento finisce sempre per fermarsi su una diapositiva. ',
        code("snap: 'proximity'"),
        ' la tira dentro solo quando si ferma vicino a una, e ',
        code('snap: false'),
        ' lascia la pista libera di scorrere — che è ciò che vuole una fila di cose piccole, dove fermarsi fra due va benissimo.',
      ),
      demo(`carousel({
  snap: false,
  perView: 4,
  min: '7rem',
  gap: 'sm',
  arrows: false,
  items: ['sitelo', 'vite', 'pagefind', 'sharp', 'lighthouse', 'rollup', 'esbuild'].map((name) =>
    chip({ size: 'lg', color: 'neutral', style: 'width: 100%; justify-content: center' }, name)),
})`, { align: 'stretch' }),

      h2('Dove vanno pallini e frecce'),
      p(
        'Entrambi sono facoltativi ed entrambi sono attivi per impostazione predefinita. Spegnere i pallini rimette la barra di scorrimento della pista, perché un carosello senza né gli uni né l’altra sarebbe uno scorrevole senza niente che dica che scorre.',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['Solo pallini', 'Seconda', 'Terza'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['Solo frecce', 'Seconda', 'Terza'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('Quando il browser non ha gli scroll marker'),
      p(
        'Allora i pallini sono link veri, uno per diapositiva, ciascuno che punta all’id di quella diapositiva — motivo per cui ogni diapositiva ne riceve uno. Già così funziona senza che sia caricato nulla: toccarne uno porta la pista alla sua diapositiva, perché seguire un frammento è una cosa che un browser fa già.',
      ),
      p(
        'Al primo scorrimento o al primo tocco, la pista e i pallini si vanno a prendere ',
        code('/su/carousel.js'),
        ' dai propri attributi di evento — come ogni componente qui raggiunge il proprio modulo, così non viene scaricato nulla su una pagina che nessuno tocca, e proprio nulla dove i marker nativi esistono già. Da quel momento vale nei due sensi: i pallini seguono lo scorrimento, qualunque cosa lo abbia mosso — un dito, un trackpad, i tasti freccia, il trascinamento di una barra — e toccare un pallino porta la pista dove serve lasciando la pagina dov’era.',
      ),
      p(
        'Quest’ultima parte è ciò a cui serve davvero lo script. Un frammento nudo sposta la finestra oltre che la pista, e un carosello che fa saltare la pagina da sotto il pollice che lo sta toccando non è quello che si intende con un pallino. Il clic viene annullato nell’attributo invece che dentro l’import, perché un import dinamico si risolve un istante dopo e per allora il browser ha già seguito il link. ',
        code('scrollMargin'),
        ' è dove atterra la finestra nell’unico caso che resta: JavaScript disattivato, dove il link è ancora soltanto un link.',
      ),
      p(
        'Gli id a cui puntano arrivano da ',
        code('name'),
        ', oppure dall’',
        code('id'),
        ' del carosello stesso, oppure — non avendo né l’uno né l’altro — da un digest delle diapositive, così due caroselli sulla stessa pagina non si scontrano senza che a nessuno dei due sia stato detto dell’altro. Dai a un elemento un ',
        code('id'),
        ' proprio quando vale la pena collegare una certa diapositiva da altrove.',
      ),

      h2('Dare un nome alle diapositive'),
      p(
        'Ogni pallino prende il nome dalla propria diapositiva, perché un pallino è un controllo e un controllo senza nome è un pulsante che uno screen reader può solo chiamare “pulsante”. Per impostazione predefinita il nome è il numero della diapositiva. Passa un elemento come oggetto per dargli un nome migliore, oppure ',
        code('slideLabel'),
        ' per numerarle a parole tue.',
      ),
      demo(`carousel({
  label: 'Foto del prodotto',
  perView: 2,
  min: '10rem',
  items: [
    { label: 'La cucina', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Cucina'))) },
    { label: 'La terrazza', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Terrazza'))) },
    { label: 'Il giardino', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Giardino'))) },
  ],
})`, { align: 'stretch' }),

      h2('Guidarlo da sé'),
      p(
        'Due funzioni per le volte in cui è la pagina a muovere un carosello — un pulsante “guarda le foto”, un passaggio di un form, un link altrove nella pagina:',
      ),
      codeBlock('src/main.js', `import { setSlide, getSlide } from 'sitelo/ui/client'

setSlide('gallery', 2)  // scorre alla terza diapositiva, e ne marca il pallino
getSlide('gallery')     // 2`, 'javascript'),
      p(
        'Oppure da un attributo di evento, senza assolutamente nulla nel bundle della pagina:',
      ),
      codeBlock('Ovunque', `button({ onclick: "import('/su/carousel.js').then(m=>m.set('gallery',0))" }, 'Torna all’inizio')`, 'javascript'),

      h2('Cosa non fa'),
      p(
        'Non torna in cerchio alla prima diapositiva, e non avanza da solo. Nessuna delle due è una cosa che il CSS possa fare, quindi nessuna delle due è qui — un carosello che cicla o che avanza da sé ha bisogno di uno script, e questo componente preferirebbe non essere il motivo per cui una pagina ne carica uno. L’avanzamento automatico è comunque una perdita che conviene: muove la cosa che qualcuno sta leggendo, da sotto i suoi occhi.',
      ),
      p(
        'Con JavaScript disattivato non riesce nemmeno a marcare quale diapositiva è in vista una volta che la pista è stata scorsa, né a raggiungerne una senza muovere la pagina. Il primo pallino è marcato in fase di build, perché a riposo quella è la diapositiva in vista; tenerlo vero dopo di allora è l’unica cosa che solo lo script può fare. Il dito, il trackpad e i tasti funzionano in ogni caso.',
      ),

      h2('Accessibilità'),
      p(
        'La pista è un gruppo con nome e ',
        code('tabindex="0"'),
        ', così una tastiera può raggiungere la regione scorrevole e percorrerla con i tasti freccia in tutti i motori, non solo in quelli che mettono a fuoco gli scorrevoli da sé. Dalle un nome con ',
        code('label'),
        ' quando una pagina ne ha più di uno.',
      ),
      p(
        'Dove è il browser a disegnarli, i pallini sono esposti come un elenco di schede e le frecce come pulsanti che si disattivano da soli a ogni estremità — tutto questo lo costruisce il browser, quindi niente di ciò può andare fuori passo rispetto alla diapositiva davvero in vista. È questo l’argomento a favore di questa forma rispetto a una con script: non c’è una seconda copia dello stato da sbagliare.',
      ),
      p(
        'I pallini di ripiego sono link, ciascuno chiamato come la propria diapositiva, e ciascuno un bersaglio da 24px invece degli 8px che il pallino sembra. La diapositiva in vista porta ',
        code('aria-current'),
        ', che è insieme ciò che uno screen reader legge e ciò che il foglio di stile colora — un solo pezzo di stato da tenere vero invece di due che potrebbero discordare. Viene renderizzato sul primo pallino, visto che a riposo quella è la diapositiva in vista, e da lì si sposta con lo scorrimento. Dove i marker nativi li sostituiscono, i link sono ',
        code('display: none'),
        ', così escono dall’albero di accessibilità insieme all’immagine invece di essere letti due volte.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Diapositive. Un figlio, oppure { label, content } con qualunque altro attributo per la diapositiva. Anche i figli sono diapositive e seguono gli items.'],
        ['perView', 'number', '1', 'Quante diapositive riempiono la pista. Un valore frazionario lascia intravedere la successiva.'],
        ['min', 'string', '', 'Limite minimo alla larghezza di una diapositiva, così uno schermo stretto ne mostra meno invece di più sottili.'],
        ['gap', 'Space', "'md'", 'Fra una diapositiva e l’altra.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Dove si ferma una diapositiva.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'Con quanta decisione lo scorrimento si posa su una diapositiva.'],
        ['dots', 'boolean', 'true', 'Pallini sotto la pista — scroll marker nativi dove il browser li ha, un link per diapositiva, migliorato da un piccolo modulo, dove non li ha. Spenti rimettono la barra di scorrimento, e non chiedono alcuno script.'],
        ['arrows', 'boolean', 'true', 'Frecce sopra la pista.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colore del pallino della diapositiva in vista.'],
        ['label', 'string', "'Carousel'", 'Nome accessibile della regione scorrevole.'],
        ['previousLabel', 'string', "'Previous slide'", 'Nome accessibile della freccia indietro.'],
        ['nextLabel', 'string', "'Next slide'", 'Nome accessibile della freccia avanti.'],
        ['slideLabel', '(index, count) => string', 'il numero', 'Dà un nome a una diapositiva che non se ne è dato uno.'],
        ['name', 'string', 'l’id del carosello, altrimenti un digest', 'Prefisso degli id delle diapositive a cui puntano i pallini di ripiego.'],
        ['scrollMargin', 'Space', "'lg'", 'Quanto sopra una diapositiva si ferma la finestra quando ce la porta un pallino di ripiego.'],
        ['as', 'string', "'div'", 'Elemento da renderizzare.'],
      ]),
    ],
  })
