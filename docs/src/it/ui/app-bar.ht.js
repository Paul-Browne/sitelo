import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Barra applicazione',
    description:
      'La barra in cima a un sito: la marca da un lato, navigazione e azioni dall’altro.',
    activeHref: '/it/ui/app-bar',
    children: [
      p(
        'Una barra applicazione è un ',
        code('<header>'),
        ' con dentro una riga. I pezzi sono separati così puoi disporli: ',
        code('appBarNav()'),
        ' per i link, ',
        code('appBarSpacer()'),
        ' per spingere ciò che segue all’estremità opposta, e ',
        code('appBarActions()'),
        ' per i pulsanti finali.',
      ),

      h2('Barra di base'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Accedi'),
  ),
)`, { align: 'stretch' }),

      h2('Con la navigazione'),
      p(
        code('navLink()'),
        ' è lo stile di link per una barra; ',
        code('current'),
        ' segna la pagina attiva con ',
        code('aria-current'),
        ' oltre che con il colore.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Documentazione'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Esempi'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Inizia'),
  ),
)`, { align: 'stretch' }),

      h2('Una marca con un simbolo'),
      p(
        'La marca accetta qualunque markup, e punta a ',
        code('/'),
        ' a meno che ',
        code('href'),
        ' non dica altrimenti.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Appiccicata e sfocata'),
      p(
        code('sticky'),
        ' fissa la barra in cima al contenitore che scorre; ',
        code('blur'),
        ' la rende traslucida così il contenuto le passa sotto. Qui sono mostrate entrambe dentro un riquadro che scorre, invece che sulla pagina stessa.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'sticky')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Scorrimi — paragrafo ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Con un pannello laterale sugli schermi piccoli'),
      p(
        'Lo schema consueto: i link nella barra su desktop, un pulsante che apre un ',
        code('drawer()'),
        ' su un telefono. Il pannello è un popover, quindi il pulsante non ha bisogno di alcuno script.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Apri la navigazione',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'app-bar-drawer',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Navigazione' },
    navLink({ href: '#docs' }, 'Documentazione'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Esempi'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('appBar()'), ':'),
      propsTable([
        ['brand', 'Child', '', 'Contenuto del link della marca all’inizio.'],
        ['href', 'string', "'/'", 'Dove punta la marca.'],
        ['sticky', 'boolean', 'false', 'Fissa la barra in cima durante lo scorrimento.'],
        ['blur', 'boolean', 'false', 'Sfondo traslucido con sfocatura dietro.'],
        ['as', 'string', "'header'", 'Elemento da renderizzare.'],
      ]),
      p('I pezzi:'),
      propsTable([
        ['appBarNav', '', '', 'Un elemento nav che contiene i link.'],
        ['appBarSpacer', '', '', 'Spazio flessibile; tutto ciò che segue va all’estremità opposta.'],
        ['appBarActions', '', '', 'Gruppo di pulsanti in coda.'],
        ['navLink', 'href, current, color', '', 'Un link con lo stile della barra; current segna la pagina attiva.'],
      ], { headers: ['Pezzo', 'Props', 'Predefinito', 'Descrizione'] }),
    ],
  })
