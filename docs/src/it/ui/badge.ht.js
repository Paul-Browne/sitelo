import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Badge',
    description:
      'Un conteggio o un pallino appuntato all’angolo di ciò che avvolge.',
    activeHref: '/it/ui/badge',
    children: [
      p(
        'Un badge avvolge qualcosa e gli appunta un marcatore all’angolo in alto: i messaggi non letti su un pulsante della posta, un pallino “online” su un avatar. Prende come figli la cosa che marca.',
      ),

      h2('Badge di base'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Posta in arrivo')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Colori'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Massimo'),
      p(
        'Un conteggio superiore a ',
        code('max'),
        ' viene renderizzato come ',
        code('n+'),
        ', così un badge non diventa mai tanto largo da sbilanciare la cosa su cui sta.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Nove')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, 'Limitato a 99')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Pallino'),
      p(
        'Un pallino dice “qualcosa è cambiato” senza dire quanto. Dagli una ',
        code('label'),
        ' — un pallino nudo non significa nulla per uno screen reader, quindi senza etichetta viene nascosto del tutto dall’albero di accessibilità.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'Online' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'Richiede attenzione' },
    iconButton({
      label: 'Impostazioni',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('Dare un nome al conteggio'),
      p(
        'Un numero nudo è ambiguo fuori contesto. ',
        code('label'),
        ' diventa il nome accessibile del badge, così si legge come “4 messaggi non letti” invece che “4”.',
      ),
      demo(`badge({ content: 4, label: '4 messaggi non letti' },
  button({ variant: 'soft', color: 'neutral' }, 'Posta in arrivo'),
)`),

      h2('Cambiare il conteggio'),
      p(
        'Un conteggio è il numero di una pagina che più probabilmente cambia mentre la pagina è aperta. ',
        code('setBadge()'),
        ' lo limita a ',
        code('max'),
        ' come faceva il server, si porta dietro il testo annunciato, e fa uscire dall’albero di accessibilità un badge svuotato — che è il modo in cui un badge sparisce.',
      ),
      p(
        'Il testo annunciato è prosa del sito, quindi passalo ogni volta che il badge ne ha uno:',
      ),
      codeBlock('Ovunque', `button({ onclick: "import('/su/badge.js').then(m=>m.set('inbox',0))" }, 'Segna tutto come letto')`, 'javascript'),
      p('Oppure dal tuo modulo, quando ne hai già uno in esecuzione:'),
      codeBlock('src/main.js', `import { setBadge } from 'sitelo/ui/client'

setBadge('inbox', 7, { label: '7 messaggi non letti' })`, 'javascript'),

      h2('Props'),
      propsTable([
        ['content', 'string | number', '', 'Cosa mostra il badge. Ignorato quando dot è impostato.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Colore del badge.'],
        ['dot', 'boolean', 'false', 'Un pallino piccolo invece di un valore.'],
        ['max', 'number', '99', 'I conteggi superiori a questo vengono resi come n+.'],
        ['label', 'string', '', 'Nome accessibile del badge stesso.'],
      ]),
    ],
  })
