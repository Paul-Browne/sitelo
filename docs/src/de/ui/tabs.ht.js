import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tabs',
    description:
      'Zwei Formen: Links, eine Seite je Tab; oder Panels, die an Ort und Stelle wechseln.',
    activeHref: '/de/ui/tabs',
    extraHead: uiHead(),
    children: [
      p(
        'Gib jedem Eintrag ein ',
        code('href'),
        ', und die Tabs sind Links — eine Seite pro Tab, kein Skript, ',
        code('aria-current'),
        ' am aktiven. Gib jedem Eintrag ein ',
        code('panel'),
        ', und sie werden zu einer echten Tablist, deren Panels an Ort und Stelle wechseln.',
      ),
      p(
        'Auf einer statischen Website ist die Link-Form meist richtig: sie gibt jeder Ansicht eine URL und übersteht abgeschaltetes JavaScript. Greif zu Panels, wenn der Inhalt klein ist und ein Wechsel keine Navigation kosten soll.',
      ),

      h2('Link-Tabs'),
      p('Ganz ohne Skript. Aktiv ist der Tab, den du markierst.'),
      demo(`tabs({
  items: [
    { label: 'Überblick', href: '#overview', active: true },
    { label: 'Installation', href: '#installation' },
    { label: 'API', href: '#api' },
  ],
})`, { align: 'stretch' }),

      h2('Panel-Tabs'),
      p(
        'Jeder Tab importiert seinen Handler beim ersten Klick — ',
        code("onclick=\"import('/su/tabs.js').then(m=>m.select(this))\""),
        ' —, deshalb wechseln diese hier wirklich, Pfeiltasten inklusive, ohne dass auf dieser Seite etwas importiert wird. Solange dieses Modul nicht da ist, ist schlicht das Panel sichtbar, das der Server als aktiv markiert hat.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Installieren', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Verwenden', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Bauen', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Pills'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'Alle', href: '#all', active: true },
      { label: 'Anleitungen', href: '#guides' },
      { label: 'Beispiele', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Farben'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Anderer', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Anderer', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Anderer', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Viele Tabs'),
      p('Die Tab-Leiste scrollt waagerecht, statt umzubrechen, sodass die Reihe am Telefon ihre Form behält.'),
      demo(`tabs({
  items: [
    'Überblick', 'Routing', 'Daten', 'Assets', 'Bilder', 'Islands', 'TypeScript', 'CLI', 'Deployment',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Deaktiviert'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Verfügbar', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Dieser hier funktioniert.'))) },
    { id: 'soon', label: 'Demnächst', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Barrierefreiheit'),
      p(
        'Die Panel-Form rendert eine ordentliche ',
        code('role="tablist"'),
        ' mit ',
        code('aria-selected'),
        ', ',
        code('aria-controls'),
        ' und wanderndem ',
        code('tabindex'),
        '. Das Skript ergänzt Pfeiltasten, Pos1 und Ende. Die Link-Form ist bewusst keine Tablist — Links, die navigieren, sind Links, und ihnen Tab-Semantik zu geben würde über ihr Verhalten lügen.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings oder { id, label, href, panel, active, disabled }-Objekte.'],
        ['value', 'string', '', 'Id des aktiven Eintrags. Fällt auf active zurück, dann auf den ersten.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Wie der aktive Tab markiert wird.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Farbe des aktiven Tabs.'],
        ['label', 'string', "'Tabs'", 'Zugänglicher Name der Tablist. Nur in der Panel-Form.'],
      ]),
    ],
  })
