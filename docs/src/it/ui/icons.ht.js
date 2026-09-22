import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

/** Una cella: il glifo a una dimensione leggibile, con il nome da scrivere. */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* In ordine alfabetico, direttamente dalla libreria, così la pagina non
 * può restare indietro rispetto all’insieme che documenta. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * I glifi riempiti dipingendo il proprio tracciato, in contrapposizione a
 * quelli che portano un secondo disegno — distinti in base al fatto che le
 * due forme siano lo stesso markup, così nessuna delle due demo può
 * restare indietro rispetto all’insieme.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * La demo del riempimento, scritta a programma invece che elencata a mano —
 * il sorgente è ciò che la pagina stampa, così un glifo che diventa
 * riempibile compare qui senza che nessuno debba ricordarsi di aggiungerlo.
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: 'Icone',
    description:
      'Un insieme di 99 glifi su una sola griglia, renderizzati inline così che un’icona prenda il colore e la dimensione del testo che la circonda.',
    activeHref: '/it/ui/icons',
    children: [
      p(
        code('icon()'),
        ' restituisce un ',
        code('<svg>'),
        ' inline. Ogni glifo è disegnato sulla stessa griglia 24×24 come tratti non riempiti in ',
        code('currentColor'),
        ', quindi eredita il colore e la dimensione del carattere di ciò in cui sta e non ha bisogno di stile proprio.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('Dentro un componente'),
      p(
        'Un’icona è un figlio come tutti gli altri. Poiché si dimensiona in ',
        code('em'),
        ', si accorda all’etichetta che le sta accanto senza che le venga detto quanto è grande:',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), 'Scarica'),
  button({ variant: 'outline' }, icon('external-link'), 'Apri'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Elimina'),
  iconButton({ label: 'Cerca', variant: 'soft', icon: icon('search') }),
)`),

      h2('Dimensione'),
      p(
        'Il valore predefinito è ',
        code('1em'),
        ' — la dimensione del testo circostante. ',
        code('size'),
        ' accetta un token o qualunque lunghezza CSS quando vuoi staccartene:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Colore'),
      p(
        'Non esiste una prop per il colore. Un’icona è disegnata in ',
        code('currentColor'),
        ', quindi prende il colore del proprio contesto — ed è questo che fa funzionare un solo insieme dentro cinque palette:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Nomi accessibili'),
      p(
        'Un’icona è ',
        code('aria-hidden'),
        ' per impostazione predefinita, cosa giusta molto più spesso che no: un’icona accanto alla parola “Elimina” non dovrebbe essere annunciata una seconda volta. Dalle una ',
        code('label'),
        ' solo quando è l’icona a portare tutto il significato, e diventa ',
        code('role="img"'),
        ' con quel nome.',
      ),
      codeBlock('', `icon('trash')                      // decorativa — nascosta
button(icon('trash'), 'Elimina')   // è la parola a parlare

icon('trash', { label: 'Elimina' }) // annunciata come immagine

// Un pulsante di sola icona dà il nome al pulsante, non al glifo dentro
iconButton({ label: 'Elimina', icon: icon('trash') })`, 'javascript'),

      h2('Riempita'),
      p(
        code('filled'),
        ' dipinge un glifo invece di delinearlo. Il tracciato è lo stesso nei due casi — cambia solo l’attributo ',
        code('fill'),
        ' — quindi le due forme condividono esattamente il bordo esterno e non possono divergere.',
      ),
      demo(fillDemo()),
      p('E gli stessi nomi riempiti:'),
      demo(fillDemo({ filled: true })),
      p(
        'È una prop e non un secondo insieme di nomi perché lo stato riempito è quasi sempre uno ',
        code('stato'),
        ' — salvato, piaciuto, valutato — quindi vuole un booleano, non una stringa diversa:',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Salvato' : 'Salva' })

// invece che
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'I glifi di stato si riempiono in modo diverso, perché il loro segno sta ',
        code('dentro'),
        ' la forma. Dipingere il cerchio inghiottirebbe la spunta, quindi il segno viene invece ritagliato fuori:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'Quelli portano un secondo disegno — la forma piena con il segno ritagliato da ',
        code('fill-rule: evenodd'),
        ' — perché un ritaglio non si può ottenere dal tracciato del contorno cambiando un attributo. La forma esterna è disegnata sul bordo esterno del contorno, così le due forme finiscono comunque sulla stessa sagoma. La prop è la stessa in entrambi i casi; quale meccanismo usi un glifo sono affari suoi.',
      ),
      p(
        'Un chevron non ha alcun interno da dipingere — è una linea aperta — quindi si riempie fino al triangolo che descrivono i suoi tre punti, mantenendo il tratto che arrotonda gli angoli:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' elenca tutto ciò che risponde a ',
        code('filled'),
        '. Un glifo senza forma riempita lo ignora e resta delineato — riempire ',
        code('eye'),
        ' perderebbe la pupilla e ',
        code('tag'),
        ' il suo foro, quindi nessuno dei due fa finta di niente.',
      ),

      h2('Rotazione'),
      p(
        code('spin'),
        ' fa ruotare il glifo — pensato per ',
        code('spinner'),
        ', anche se nulla ti impedisce di far girare ',
        code('refresh'),
        ' mentre qualcosa si ricarica. Rallenta fino quasi a fermarsi invece di arrestarsi sotto ',
        code('prefers-reduced-motion'),
        ', perché una rotella che si ferma sembra rotta.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'Salvataggio…'),
)`),

      h2('L’insieme'),
      p(
        'I nomi descrivono il disegno più che il compito che svolge — ',
        code('x-circle'),
        ', non ',
        code('error'),
        ' — perché lo stesso disegno viene usato per compiti senza relazione fra loro, e un nome che descrive l’immagine resta vero anche allora. Gli alias qui sotto coprono le intenzioni più comuni.',
      ),
      gallery(),

      h2('Marchi'),
      p(
        'Con l’insieme arrivano otto marchi — ',
        code('facebook'),
        ', ',
        code('google'),
        ', ',
        code('instagram'),
        ', ',
        code('linkedin'),
        ', ',
        code('tiktok'),
        ', ',
        code('whatsapp'),
        ', ',
        code('x-twitter'),
        ' e ',
        code('youtube'),
        '. Accettano comunque ',
        code('size'),
        ' e ',
        code('label'),
        ' e si disegnano comunque in ',
        code('currentColor'),
        ':',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Condividi'),
)`),
      p(
        'Sono riproduzioni di marchi altrui e non disegni nello stile di questa libreria, quindi ne infrangono di proposito due regole: sono forme piene invece che tratti, che è quello che è un logo, e le loro proporzioni sono quelle del marchio e non di questa griglia. ',
        code('filled'),
        ' per loro non significa nulla — lo sono già.',
      ),
      p(
        'Il disegno viene da Simple Icons, che lo rilascia sotto CC0. Questo copre il disegno, non il marchio registrato: usali per indicare la cosa che nominano — un link a un profilo, un pulsante di condivisione — e non su un prodotto tuo.',
      ),
      p(
        'È ',
        code('x-twitter'),
        ', non ',
        code('x'),
        ', perché ',
        code('x'),
        ' è già un alias di ',
        code('close'),
        ' e un pulsante di chiusura che si trasforma in un logo sarebbe una brutta sorpresa. Anche ',
        code('twitter'),
        ' si risolve su di esso.',
      ),

      h2('Alias'),
      p(
        'Ognuno di questi renderizza un glifo elencato qui sopra, sotto il nome a cui più probabilmente penseresti:',
      ),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('Icone tue'),
      p(
        code('registerIcons()'),
        ' aggiunge un glifo, oppure ne sostituisce uno incorporato. Il markup è il contenuto dell’',
        code('<svg>'),
        ' — forme sulla stessa griglia 24×24, lasciate non riempite così che ',
        code('currentColor'),
        ' le raggiunga. Chiamala una volta sola da un modulo che le tue pagine importano:',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // Un nome che esiste già lo sostituisce ovunque, ed è così che si
  // ridisegna un glifo incorporato senza forkare la libreria.
  check: '<path d="m5 13 4 4 10-11"/>',
  // Una sola forma chiusa, così può rispondere a \`filled\` come gli incorporati.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                  // il tuo glifo
icon('check')                 // ora anche questo è tuo

registerIcons({ check: null }) // e si torna a quello incorporato`, 'javascript'),

      h2('Perché inline, e non uno sprite'),
      p(
        'Le icone vengono renderizzate dentro la pagina invece di essere prese da un ',
        code('icons.svg'),
        ' con ',
        code('<use>'),
        '. Uno sprite fa risparmiare nell’ordine del centinaio di byte gzippati di HTML per pagina e costa un viaggio di rete per farlo — il markup ripetuto è esattamente il caso in cui gzip dà il meglio, quindi la maggior parte di ciò che uno sprite esiste per deduplicare è già stata deduplicata. Inline significa anche che non c’è alcun file da emettere, nessun percorso base da configurare, e niente che possa sparire da ',
        code('dist'),
        ' — lo stesso compromesso che fa ',
        code('styles({ inline: true })'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Quale glifo. Si può passare come primo argomento anziché come prop.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'Un token, o qualunque lunghezza CSS. Il predefinito è 1em.'],
        ['label', 'string', '', 'Annunciala come immagine con questo nome, invece di nasconderla.'],
        ['spin', 'boolean', 'false', 'Falla ruotare di continuo.'],
        ['filled', 'boolean', 'false', 'Dipingi il glifo invece di delinearlo. Ignorata dai glifi che non si possono riempire.'],
      ]),
      p(
        'Un nome sconosciuto non renderizza proprio nulla invece di sollevare un errore — una prop estetica non deve poter far fallire una build. ',
        code('hasIcon(name)'),
        ' ti dice se ne esiste uno, ',
        code('iconNames()'),
        ' li elenca tutti, e ',
        code('fillableIcons()'),
        ' quelli che accettano ',
        code('filled'),
        '.',
      ),
    ],
  })
