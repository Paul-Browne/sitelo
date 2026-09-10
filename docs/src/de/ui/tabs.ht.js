import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Tabs',
    description:
      'Drei Formen: Links, eine Seite je Tab; Panels, die an Ort und Stelle wechseln; oder Panels, die die URL steuert.',
    activeHref: '/de/ui/tabs',
    children: [
      p(
        'Gib jedem Eintrag ein ',
        code('href'),
        ', und die Tabs sind Links — eine Seite pro Tab, kein Skript, ',
        code('aria-current'),
        ' am aktiven. Gib jedem Eintrag ein ',
        code('panel'),
        ', und sie werden zu einer Radiogruppe, deren Panels an Ort und Stelle wechseln — weiterhin ohne Skript.',
      ),
      p(
        'Auf einer statischen Website ist die Link-Form meist richtig: sie gibt jeder Ansicht eine URL und übersteht abgeschaltetes JavaScript. Greif zu Panels, wenn der Inhalt klein ist und ein Wechsel keine Navigation kosten soll.',
      ),

      h2('Link-Tabs'),
      p(
        'Das sind wirklich Links — ein Klick navigiert. Die Unterstreichung kommt beim Bauen aus ',
        code('active'),
        ' oder ',
        code('value'),
        ', nicht aus dem Klick; jede Seite markiert also ihren eigenen Tab. Von sich aus reagiert ein Link-Tab auf die URL nicht: dafür wechselst du unten mit Panels an Ort und Stelle.',
      ),
      demo(`tabs({
  items: [
    { label: 'Breadcrumbs', href: '/de/ui/breadcrumbs' },
    { label: 'Tabs', href: '/de/ui/tabs', active: true },
    { label: 'Paginierung', href: '/de/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Panel-Tabs'),
      p(
        'Der Tab ist ein ',
        code('<label>'),
        ' für einen Radiobutton, den das Stylesheet aus dem Blick nimmt; gezeigt wird das Panel, das auf den ausgewählten Radiobutton folgt. Auf dieser Seite wird nichts importiert: das Wechseln und die Pfeiltasten dazwischen kann eine Radiogruppe von sich aus.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Installieren', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Verwenden', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Bauen', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Verlinkbare Tabs'),
      p(
        'Gib den Panel-Einträgen zusätzlich ein ',
        code('href'),
        ' mit Fragment, und an die Stelle der Radiobuttons treten Links: die URL nennt den Tab, ',
        code(':target'),
        ' greift ihn heraus, das Panel dahinter wird gezeigt, und die Wahl übersteht einen Reload, einen geteilten Link und den Zurück-Button. Die Id sitzt am Tab und nicht am Panel, weil der Browser das, was die URL nennt, an den oberen Fensterrand scrollt — am Panel würde er die Tabs aus dem Bild schieben, auf dem du sie gerade angeklickt hast. Nur ein Element pro Dokument kann ',
        code(':target'),
        ' sein, also ist diese Form für ein Set Tabs pro Seite. Das Scrollen selbst lässt sich nicht abstellen: einem Fragment zu folgen heißt, das Fenster zu bewegen. Wählen lässt sich nur, wohin es scrollt und wo es landet — dafür sind die Id am Tab und sein ',
        code('scroll-margin-block-start'),
        ' da — setz es über den Prop ',
        code('scrollMargin'),
        ', und gib einem klebrigen Header mindestens seine eigene Höhe.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Einrichten', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Dieses Panel ist #tab-setup — kopier die URL, und es kommt zurück.'))) },
    { id: 'deploy', label: 'Deployen', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Und dieses hier ist #tab-deploy.'))) },
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
      p('Die Tab-Leiste scrollt waagerecht, statt umzubrechen, sodass die Reihe am Telefon ihre Form behält. Panel-Tabs brechen stattdessen um — jedes Panel muss auf seinen eigenen Tab folgen, also bleibt keine Reihe übrig, die scrollen könnte.'),
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
        'Die Panel-Form ist eine echte Radiogruppe: die Tabs sind ',
        code('<label>'),
        '-Elemente für Radiobuttons mit gemeinsamem ',
        code('name'),
        ', deshalb sagt ein Screenreader an, welcher von wie vielen gewählt ist, und Pfeiltasten, Pos1 und Ende funktionieren ohne geladenes Skript. Die verlinkbare Form besteht stattdessen aus schlichten Links und trägt kein ',
        code('aria-current'),
        ' — es würde einmal geschrieben und wäre nach dem ersten Klick falsch. Bewusst keine ARIA-Tablist — ',
        code('aria-selected'),
        ' wird einmal auf dem Server geschrieben, und CSS kann es beim Klicken nicht wahr halten. Die Link-Form ist ebenfalls keine Tablist: Links, die navigieren, sind Links, und ihnen Tab-Semantik zu geben würde über ihr Verhalten lügen.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings oder { id, label, href, panel, active, disabled }-Objekte.'],
        ['value', 'string', '', 'Id des aktiven Eintrags. Fällt auf active zurück, dann auf den ersten.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Wie der aktive Tab markiert wird.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Farbe des aktiven Tabs.'],
        ['label', 'string', "'Tabs'", 'Zugänglicher Name der Gruppe. Nur in der Panel-Form.'],
        ['name', 'string', 'Id des ersten Eintrags', 'Name der Radiogruppe. Nötig nur bei zwei Panel-Tab-Sets auf einer Seite.'],
        ['href', 'string', '', 'Am Eintrag: eine Seite zum Verlinken — oder, zusammen mit panel, das Fragment, das es benennt.'],
        ['scrollMargin', 'Space', "'md'", 'Wie weit über dem Tab das Fenster hält. Nur in der :target-Form.'],
      ]),
    ],
  })
