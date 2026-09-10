import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'Ein Dialog auf Basis der Popover-API — Öffnen, Hintergrund, Klick nach außen und Escape übernimmt der Browser.',
    activeHref: '/de/ui/modal',
    children: [
      p(
        'Ein Modal ist ein ',
        code('popover'),
        '-Element. Jeder Button, dessen ',
        code('popovertarget'),
        ' zur ',
        code('id'),
        ' des Modals passt, öffnet es — ganz ohne Skript, samt Hintergrund, Schließen bei Klick nach außen, Escape und Fokusverwaltung, die alle dem Browser gehören.',
      ),
      p(
        'Deshalb ist die ',
        code('id'),
        ' Pflicht, und deshalb wirft die Komponente ohne sie: die id ist die ganze Verkabelung.',
      ),

      h2('Einfaches Modal'),
      p('Jedes Modal auf dieser Seite geht wirklich auf — probier es aus.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Modal öffnen'),
  modal({ id: 'demo-basic', title: 'Website neu bauen?' },
    'Das führt sitelo build aus und veröffentlicht dist/ erneut.',
  ),
)`),

      h2('Mit Footer'),
      p(
        'Ein Schließen-Button ist jeder Button, der mit ',
        code('popovertargetaction="hide"'),
        ' auf dieselbe id zeigt.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Seite löschen…'),
  modal({
    id: 'demo-confirm',
    title: 'Diese Seite löschen?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Abbrechen'),
      button({ color: 'danger' }, 'Löschen'),
    ),
  }, 'Das lässt sich nicht rückgängig machen. Das erzeugte HTML verschwindet beim nächsten Build.'),
)`),

      h2('Größen'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Klein'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Mittel'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Groß'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Klein' }, 'size: sm — etwa 24rem.'),
  modal({ id: 'demo-md', title: 'Mittel' }, 'Der Standard — etwa 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Groß' }, 'size: lg — etwa 48rem.'),
)`),

      h2('Formulare in einem Modal'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'Neue Seite…'),
  modal({
    id: 'demo-form',
    title: 'Neue Seite',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Abbrechen'),
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
        ' lässt das × in der Ecke weg. Escape und ein Klick nach außen schließen es weiterhin — ein Popover lässt sich nicht wirklich blockierend machen, und das ist ohnehin meist das richtige Verhalten.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'Ohne Schließen-Button'),
  modal({ id: 'demo-bare', title: 'Drück Escape', closable: false },
    'Oder klick irgendwo außerhalb dieses Dialogs.',
  ),
)`),

      h2('Langer Inhalt'),
      p('Der Körper scrollt; Kopf und Fuß bleiben stehen.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Langes Modal'),
  modal({
    id: 'demo-long',
    title: 'Release Notes',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Schließen'),
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
        'Die Seite hinter einem offenen Modal scrollt nicht. Das ist das Einzige, was die Popover-API dir überlässt, und es passiert hier in CSS — kein Skript, nichts zu initialisieren. Übergib ',
        code('lockScroll: false'),
        ', damit der Hintergrund wie gewohnt scrollt.',
      ),

      h2('Browser-Unterstützung'),
      p(
        'Die Popover-API gibt es in jedem aktuellen Browser. In einem zu alten, der sie nicht kennt, rendert das Modal inline in der Seite statt darüber: sichtbar und benutzbar, nur eben nicht überlagert. Nichts verschwindet.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Pflicht. Worauf das popovertarget eines Auslösers zeigt.'],
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
