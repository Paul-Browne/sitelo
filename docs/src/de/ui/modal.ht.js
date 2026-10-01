import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'Ein echtes <dialog>-Element, modal geöffnet — Hintergrund, Fokus, Escape und Klick nach außen übernimmt der Browser.',
    activeHref: '/de/ui/modal',
    children: [
      p(
        'Ein Modal ist ein ',
        code('<dialog>'),
        '-Element. Jeder Button mit ',
        code('commandfor'),
        ' auf die ',
        code('id'),
        ' des Modals und ',
        code("command: 'show-modal'"),
        ' öffnet es modal: Die Seite dahinter wird inert, Fokus und Screenreader bleiben also im Dialog. Nirgends ein Skript — Hintergrund, Escape und Klick nach außen gehören alle dem Browser.',
      ),
      p(
        'Deshalb ist die ',
        code('id'),
        ' Pflicht, und deshalb wirft die Komponente ohne sie: die id ist die ganze Verkabelung.',
      ),

      h2('Einfaches Modal'),
      p('Jedes Modal auf dieser Seite geht wirklich auf — probier es aus.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Modal öffnen'),
  modal({ id: 'demo-basic', title: 'Website neu bauen?' },
    'Das führt sitelo build aus und veröffentlicht dist/ erneut.',
  ),
)`),

      h2('Mit Footer'),
      p(
        'Ein Schließen-Button ist jeder Button, der mit ',
        code("command: 'close'"),
        ' auf dieselbe id zeigt.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Seite löschen…'),
  modal({
    id: 'demo-confirm',
    title: 'Diese Seite löschen?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Abbrechen'),
      button({ color: 'danger' }, 'Löschen'),
    ),
  }, 'Das lässt sich nicht rückgängig machen. Das erzeugte HTML verschwindet beim nächsten Build.'),
)`),

      h2('Größen'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Klein'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Mittel'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Groß'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Klein' }, 'size: sm — etwa 24rem.'),
  modal({ id: 'demo-md', title: 'Mittel' }, 'Der Standard — etwa 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Groß' }, 'size: lg — etwa 48rem.'),
)`),

      h2('Formulare in einem Modal'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'Neue Seite…'),
  modal({
    id: 'demo-form',
    title: 'Neue Seite',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Abbrechen'),
      button({ type: 'submit' }, 'Anlegen'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Titel', name: 'modal-title', placeholder: 'Über' }),
      selectField({ label: 'Endung', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Ohne Schließen-Button'),
      p(
        code('closable: false'),
        ' lässt das × in der Ecke weg. Escape und ein Klick nach außen schließen es weiterhin; mit ',
        code("closedby: 'closerequest'"),
        ' schließt nur noch Escape.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'Ohne Schließen-Button'),
  modal({ id: 'demo-bare', title: 'Drück Escape', closable: false },
    'Oder klick irgendwo außerhalb dieses Dialogs.',
  ),
)`),

      h2('Langer Inhalt'),
      p('Der Körper scrollt; Kopf und Fuß bleiben stehen.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Langes Modal'),
  modal({
    id: 'demo-long',
    title: 'Release Notes',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Schließen'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Änderung ' + (index + 1) + ' — etwas wurde behoben.'),
      ),
    ),
  ),
)`),

      h2('Scrollen im Hintergrund'),
      p(
        'Die Seite hinter einem offenen Modal scrollt nicht. Das ist das Einzige, was ein modaler Dialog dir überlässt, und es passiert hier in CSS — kein Skript, nichts zu initialisieren. Übergib ',
        code('lockScroll: false'),
        ', damit der Hintergrund wie gewohnt scrollt.',
      ),

      h2('Browser-Unterstützung'),
      p(
        'Einen Dialog per command eines Buttons zu öffnen, kann jeder aktuelle Browser — Chrome ab 135, Firefox ab 144, Safari ab 26.2. In einem älteren hängt button() ein onclick an, das ein paar hundert Bytes /su/dialog.js lädt und dasselbe tut — nur dort und erst beim ersten Klick. Schließen bei Klick nach außen (closedby) kann Safari noch nicht; das übernimmt dort dieselbe Datei.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Pflicht. Worauf das commandfor eines Auslösers zeigt.'],
        ['title', 'Child', '', 'Überschrift und zugänglicher Name des Dialogs.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Maximale Breite.'],
        ['footer', 'Child', '', 'Untere Reihe, auf einem eigenen getönten Band.'],
        ['closable', 'boolean', 'true', 'Das × in der Kopfzeile zeigen.'],
        ['closeLabel', 'string', "'Close'", 'Zugänglicher Name dieses Buttons.'],
        ['lockScroll', 'boolean', 'true', 'Die Seite dahinter am Scrollen hindern, solange es offen ist.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' rendert dieses × für sich, für eine Kopfzeile, die du selbst baust.',
      ),
    ],
  })
