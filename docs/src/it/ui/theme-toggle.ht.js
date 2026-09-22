import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Cambio tema',
    description:
      'Un interruttore chiaro/scuro, con lo script inline che evita a una scelta salvata di lampeggiare all’ingresso.',
    activeHref: '/it/ui/theme-toggle',
    children: [
      p(
        'sitelo-ui risolve da sé la modalità scura a partire da ',
        code('prefers-color-scheme'),
        ' — un sito contento di seguire il sistema operativo non ha bisogno di nulla di questa pagina. Il pulsante serve a lasciare che sia chi legge a scavalcare quella scelta.',
      ),
      p(
        'È uno dei cinque componenti che hanno bisogno di uno script, perché la scelta vive in ',
        code('localStorage'),
        ' e solo uno script può leggerla. Il pulsante si va a prendere quello script da sé, alla prima pressione.',
      ),

      h2('Come si imposta'),
      p('Due cose nella head, e il pulsante dove serve:'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // applica la scelta salvata prima del primo paint
  styles(),
)

body(
  appBar({ brand: 'Il mio sito' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        'Non c’è un terzo file. ',
        code('themeScript()'),
        ' è bloccante e inline di proposito — qualunque cosa differita dipinge per prima, che è esattamente il lampo scuro che esiste per evitare — e il passaggio vero e proprio viaggia sul pulsante:',
      ),
      codeBlock('Markup renderizzato', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        'Usali in coppia. ',
        code('themeScript()'),
        ' è anche ciò che marca il pulsante come ',
        code('aria-pressed'),
        ' al caricamento: non è ancora stato premuto nulla, quindi il pulsante da solo non può sapere quale tema sia stato risolto.',
      ),

      h2('Il pulsante'),
      p(
        'L’icona è puro CSS, letta direttamente dall’attributo del tema — quindi è già corretta al primo paint, prima che qualunque script giri. Mostra a cosa un clic passerà.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Quei pulsanti funzionano — questa pagina carica il runtime. Cliccarne uno imposta ',
        code('data-su-theme'),
        ' su ',
        code('<html>'),
        ', che è l’attributo di sitelo-ui, quindi cambiano soltanto i componenti sitelo-ui di questa pagina. Il resto di questo sito segue il proprio ',
        code('data-theme'),
        ', impostato dal pulsante nella barra in alto. Sul tuo sito ce ne sarebbe uno solo.',
      ),

      h2('In una barra applicazione'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Documentazione')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Inizia'),
  ),
)`, { align: 'stretch' }),

      h2('Come si risolve il tema'),
      p(
        'Nell’ordine: un ',
        code('data-theme'),
        ' o ',
        code('data-su-theme'),
        ' esplicito su un qualunque antenato vince; altrimenti decide ',
        code('prefers-color-scheme'),
        '. Entrambi i nomi di attributo vengono onorati così che sitelo-ui possa stare dentro un sito che ha già il proprio selettore di tema — che è esattamente quello che fa questa documentazione.',
      ),

      h2('Guidarlo da sé'),
      p(
        'Il runtime esporta le stesse funzioni che usa il pulsante, per un controllo personalizzato o un selettore a tre vie chiaro / scuro / sistema.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — risolto, non salvato
toggleTheme()       // inverti
setTheme('dark')    // fissa
setTheme('system')  // togli l’override e torna a seguire il sistema`, 'javascript'),

      h2('Props'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Nome accessibile e tooltip.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Variante del pulsante.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Da quale palette attingere.'],
      ]),
      p(
        code('themeScript()'),
        ' accetta un ',
        code('nonce'),
        ' facoltativo, per un sito con una content security policy.',
      ),
    ],
  })
