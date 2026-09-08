import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/de.js'
import { preview, uiHead } from '../../lib/ui-demo.js'

/**
 * Eine Karte je Komponentenseite, genauso gruppiert wie die
 * Komponentenreferenz. Jede `demo` wird live in ihre Karte gerendert.
 */
const GROUPS = [
  ['Layout', [
    ['/de/ui/container', 'Container', 'Eine zentrierte Seitenspalte mit begrenzter Breite.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'zentriert'))`],
    ['/de/ui/stack', 'Stack', 'Eine Flex-Reihe oder -Spalte mit einem Abstands-Token als Lücke.',
      `stack({ direction: 'row', gap: 'sm' }, chip('eins'), chip('zwei'), chip('drei'))`],
    ['/de/ui/grid', 'Grid', 'Passt so viele Spalten ein, wie hineinpassen — ohne Media Queries.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/de/ui/divider', 'Trenner', 'Eine Linie zwischen Abschnitten, mit oder ohne Beschriftung.',
      `div({ style: 'width: 100%' }, divider('oder'))`],
    ['/de/ui/aspect-ratio', 'Seitenverhältnis', 'Hält eine Box in fester Form, damit beim Laden nichts springt.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/de/ui/card', 'Karte', 'Eine Fläche für gruppierten Inhalt, mit Kopf, Körper und Fuß.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'Eine Karte')))`],
  ]],
  ['Typografie', [
    ['/de/ui/typography', 'Typografie', 'Eine Typoskala, die ihr Element selbst wählt.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Überschrift'), text({ variant: 'caption', tone: 'muted' }, 'Bildunterschrift'))`],
    ['/de/ui/prose', 'Prosa', 'Rohes HTML aus Markdown oder einem CMS gestalten.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>Eine Überschrift</strong></p><p>Und ein Absatz.</p>')`],
    ['/de/ui/link', 'Link', 'Ein gestalteter Anker, mit den Attributen, die ein externer Link braucht.',
      `text({ variant: 'small' }, 'Lies die ', link({ href: '/de/docs' }, 'Doku'), '.')`],
    ['/de/ui/icons', 'Icons', '99 Zeichen auf einem Raster, bemessen und gefärbt vom Text ringsum.',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['Eingaben', [
    ['/de/ui/button', 'Button', 'Fünf Varianten, fünf Farben, drei Größen.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Speichern'), button({ size: 'sm', variant: 'outline' }, 'Abbrechen'))`],
    ['/de/ui/button-group', 'Button-Gruppe', 'Buttons zu einem Steuerelement verbunden.',
      `buttonGroup({ label: 'Vorschau' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Eins'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Zwei'))`],
    ['/de/ui/text-field', 'Textfeld', 'Label, Steuerelement, Hilfetext und Fehler, miteinander verdrahtet.',
      `textField({ label: 'E-Mail', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/de/ui/select', 'Select', 'Ein natives Select, passend gestaltet.',
      `selectField({ label: 'Theme', name: 'g-theme', size: 'sm', options: ['Hell', 'Dunkel'], value: 'Dunkel' })`],
    ['/de/ui/checkbox', 'Checkbox', 'Ein echtes Input, per CSS gestaltet statt ersetzt.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Sitemap', checked: true }), checkbox({ label: 'RSS-Feed' }))`],
    ['/de/ui/radio', 'Radio-Gruppe', 'Eine Wahl aus mehreren, als Radios mit gemeinsamem name.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['gratis', 'pro'] })`],
    ['/de/ui/switch', 'Schalter', 'Ein An/Aus-Schalter für eine Einstellung, die sofort greift.',
      `stack({ gap: 'sm' }, toggle({ label: 'Öffentlich', checked: true }), toggle({ label: 'Entwürfe' }))`],
    ['/de/ui/slider', 'Slider', 'Ein natives Range-Input, passend gestaltet.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Vorschau' }))`],
    ['/de/ui/toggle-button', 'Toggle-Button', 'Ein Button, der gedrückt bleibt.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'An'), toggleButton({ size: 'sm' }, 'Aus'))`],
    ['/de/ui/toggle-group', 'Toggle-Gruppe', 'Ein segmentiertes Steuerelement, als Buttons oder als Links.',
      `toggleGroup({ size: 'sm', label: 'Vorschau', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Datenanzeige', [
    ['/de/ui/avatar', 'Avatar', 'Ein Bild, wenn es eines gibt, sonst die Initialen.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/de/ui/badge', 'Badge', 'Eine Zahl oder ein Punkt, an eine Ecke geheftet.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Posteingang'))`],
    ['/de/ui/chip', 'Chip', 'Ein Tag, ein Status, ein Filter.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'bestanden'), chip({ color: 'neutral' }, 'statisch'))`],
    ['/de/ui/tooltip', 'Tooltip', 'Ein Hinweis beim Überfahren und beim Fokus, ganz in CSS gezeichnet.',
      `tooltip({ content: 'Kein Skript nötig' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Fahr drüber'))`],
    ['/de/ui/table', 'Tabelle', 'Zeilen und Spalten aus Daten, in einem Scroll-Container.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Seite' }, { key: 's', header: 'Größe', align: 'end' }],
        rows: [{ p: '/', s: '4,1 kB' }, { p: '/docs', s: '12,7 kB' }] })`],
    ['/de/ui/list', 'Liste', 'Zeilen mit etwas an beiden Enden.',
      `list({ plain: true }, listItem({ title: 'Routing', description: 'Dateibasiert' }))`],
    ['/de/ui/figure', 'Abbildung', 'Ein Bild und seine Unterschrift, als eine Abbildung.',
      `figure({ src: '/logo.svg', alt: '', caption: 'Eine Unterschrift', style: 'width: 7rem' })`],
  ]],
  ['Rückmeldung', [
    ['/de/ui/alert', 'Hinweis', 'Eine Meldung, deren Icon und ARIA-Rolle der Farbe folgen.',
      `alert({ color: 'success' }, 'Deployt.')`],
    ['/de/ui/empty', 'Leerzustand', 'Wie eine Liste aussieht, bevor etwas darin steht.',
      `empty({ title: 'Hier ist nichts', style: 'padding: 0' })`],
    ['/de/ui/progress', 'Fortschritt', 'Ein Balken für bekannte Arbeit, ein Spinner für den Rest.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/de/ui/skeleton', 'Skeleton', 'Ein Platzhalter in der Form des kommenden Inhalts.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/de/ui/toast', 'Toast', 'Eine flüchtige Meldung, per Skript angehängt.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Gespeichert.'))`],
  ]],
  ['Navigation', [
    ['/de/ui/breadcrumbs', 'Breadcrumbs', 'Die Spur der Vorfahren, die bei dieser Seite endet.',
      `breadcrumbs({ items: [{ label: 'Doku', href: '/de/docs' }, { label: 'UI' }] })`],
    ['/de/ui/pagination', 'Paginierung', 'Nummerierte Seiten, als Fenster, als echte Links.',
      `pagination({ page: 2, count: 5, href: (page) => '/de/ui#p' + page })`],
    ['/de/ui/tabs', 'Tabs', 'Links, eine Seite je Tab — oder Panels, die an Ort und Stelle wechseln.',
      `tabs({ variant: 'pills', items: [{ label: 'Eins', href: '/de/ui#t1', active: true }, { label: 'Zwei', href: '/de/ui#t2' }] })`],
    ['/de/ui/app-bar', 'App-Bar', 'Die Marke auf der einen Seite, Navigation und Aktionen auf der anderen.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/de/ui/theme-toggle', 'Theme-Umschalter', 'Hell und dunkel, ohne Aufblitzen beim Eintreffen.',
      `themeToggle()`],
  ]],
  ['Overlays', [
    ['/de/ui/modal', 'Modal', 'Ein Dialog auf der Popover-API — nirgends ein Skript.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Modal öffnen')`],
    ['/de/ui/drawer', 'Drawer', 'Ein Panel von der Kante, gleiche Popover-Mechanik.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Drawer öffnen')`],
    ['/de/ui/menu', 'Menü', 'Ein Dropdown auf details, Öffnen und Schließen gratis.',
      `chip({ color: 'neutral' }, 'Aktionen ▾')`],
    ['/de/ui/accordion', 'Akkordeon', 'Ausklappbare Abschnitte, exklusiver Modus inklusive.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'Eine Frage' }] }))`],
    ['/de/ui/collapsible', 'Ausklappbar', 'Ein einzelnes „mehr zeigen“, ohne Akkordeon-Beiwerk.',
      `collapsible({ trigger: 'Mehr zeigen' }, 'Versteckt, bis danach gefragt wird.')`],
  ]],
  ['Abschnitte', [
    ['/de/ui/hero', 'Hero', 'Der Kopf einer Landing-Page: Schlagzeile, Satz, Aktionen.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'Eine Schlagzeile'), text({ variant: 'caption', tone: 'muted' }, 'Und ein Satz.'))`],
    ['/de/ui/footer', 'Footer', 'Spalten mit Links, und eine Zeile darunter.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Doku'), text({ variant: 'caption', tone: 'muted' }, 'Anleitung · Komponenten'))`],
    ['/de/ui/stat', 'Kennzahl', 'Eine Zahl, die einen Blick wert ist, und was sie bedeutet.',
      `stat({ label: 'Seiten', value: '204', change: '+8', color: 'success' })`],
    ['/de/ui/steps', 'Schritte', 'Ein nummerierter Ablauf, in dem Erledigtes als erledigt gilt.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Installieren', 'Bauen'] }))`],
    ['/de/ui/timeline', 'Timeline', 'Einträge der Reihe nach, an einer Linie entlang.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Abschnitte', color: 'primary' }] }))`],
    ['/de/ui/mockup', 'Mockup', 'Ein Screenshot in Browser, Fenster, Telefon oder Terminal.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Styling', [
    ['/de/ui/theming', 'Theming', 'Jede Farbe, jeder Radius, jede Schrift — aus einem Aufruf.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** Eine Galeriekarte. Die Vorschau ist inert, der Name ein gedehnter Link. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * Ein div, kein Anker: diese Vorschauen enthalten echte Buttons und
     * Eingaben, und interaktiver Inhalt darf nicht in einem Link stecken.
     * Stattdessen dehnt sich der Anker des Namens über die ganze Karte, und
     * `inert` nimmt die Demo-Bedienelemente aus der Tab-Reihenfolge und dem
     * Accessibility-Baum.
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
    pageTitle: 'sitelo UI — Komponenten für sitelo',
    description:
      'Eine Komponentenbibliothek für sitelo: Buttons, Karten, Formulare, Tabellen und Modals — als Funktionen, die HTML zurückgeben.',
    activeHref: '/de/ui',
    extraHead: uiHead(),
    children: [
      p(
        'sitelo-ui ist eine Komponentenbibliothek für sitelo. Jede Komponente ist eine Funktion, die einen HTML-String zurückgibt, und fügt sich damit direkt in die Seite ein, die du ohnehin schreibst — ohne Compiler, ohne Runtime, ohne Hydration.',
      ),
      p(
        'Jedes Beispiel in diesem Abschnitt rendert derselbe Build, der auch die Seite ringsum rendert. Was du siehst, ist genau das, was der Code darunter erzeugt hat, und es folgt dem hellen und dunklen Theme dieser Website, weil sitelo-ui dasselbe ',
        code('data-theme'),
        '-Attribut liest wie die Doku.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Einrichtung'),
      p(
        'Zwei Zeilen: die Komponenten importieren und ',
        code('styles()'),
        ' in den Head setzen. Die ',
        a({ href: '/de/docs/ui' }, 'Komponentenseite in der Doku'),
        ' behandelt Installation, Theming, die Aufrufkonvention und das optionale Client-Runtime und listet jeden Export in einer Tabelle.',
      ),
      p(
        'Das Verzeichnis ',
        code('examples/ui'),
        ' im Repository rendert den ganzen Satz auf einer einzigen Seite.',
      ),
    ],
  })
