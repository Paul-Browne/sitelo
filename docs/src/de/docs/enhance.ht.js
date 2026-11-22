import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/de.js'
import { enhanceSnippets } from '../../lib/snippets/enhance.js'

const s = enhanceSnippets('de')

export default () =>
  docsLayout({
    title: 'Enhancements',
    description:
      'Server-gerendertes Markup an ein kleines Browser-Modul übergeben, das nur auf Seiten geladen wird, die es nutzen.',
    activeHref: '/de/docs/enhance',
    children: [
      p(
        'Manche Interaktivität muss im Browser laufen: ein Zähler, ein Kopieren-Button, ein Formular, das sich beim Tippen selbst prüft. ',
        code('enhance()'),
        ' markiert das Markup, das ein Modul übernehmen soll. Der Server rendert das HTML wie gewohnt, es funktioniert also, bevor JavaScript ankommt, und der Browser lädt das Modul nur auf Seiten, die es nutzen. Das Modul ergänzt das DOM, das es vorfindet, um Verhalten. Keine Hydration, keine Framework-Runtime.',
      ),
      p(
        'Eine ',
        a({ href: '/de/docs/islands' }, 'Server-Island'),
        ' rendert einen Bereich auf einem Server, wenn die Seite aufgerufen wird. Ein Enhancement führt Code für einen Bereich im Browser aus. Beide nehmen dieselben Argumente und arbeiten zusammen.',
      ),
      h2('Das Modul schreiben'),
      p(
        'Ein Enhancement ist ein gewöhnliches Modul, irgendwo unter ',
        code('src/'),
        '. Sein Default-Export bekommt das Element und die Props. Lies, was du brauchst, aus dem Markup, das der Server schon gerendert hat:',
      ),
      codeBlock('src/client/counter.js', s.counterModule, 'javascript'),
      p(
        'TypeScript geht auch. Typisiere die Funktion mit ',
        code('Enhancer<Props>'),
        ' aus ',
        code('sitelo/enhance/client'),
        '.',
      ),
      h2('In eine Seite einbauen'),
      p(
        'Importiere ',
        code('enhance()'),
        ' aus ',
        code('sitelo/enhance'),
        '. Es nimmt dieselben Argumente wie ',
        code('island()'),
        ': einen Namen, Props, das HTML und Optionen. Das HTML landet in einem ',
        code('<div>'),
        ', das das Modul bekommt.',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      p(
        'JSX escapet einen String, den eine Funktion zurückgibt, deshalb spreadet der JSX-Tab stattdessen ',
        code('enhanceAttributes()'),
        ' auf das Element. Mehr dazu weiter unten.',
      ),
      h2('Die Module registrieren'),
      p(
        'Das Skript, das die Seite einbindet, übergibt ',
        code('mountEnhancements()'),
        ' eine Zuordnung von Namen zu Modulen:',
      ),
      codeBlock('src/enhance.js', s.registry, 'javascript'),
      p(
        'Die Zuordnung schreibst du absichtlich von Hand. Jedes ',
        code('import()'),
        ' ist ein gewöhnlicher dynamischer Import, also gibt der Build jedem Modul einen eigenen Chunk, und eine Seite lädt nur die, die ihre Elemente nennen. Im Dev-Modus liefert Vite sie direkt aus. Weil es gewöhnlicher Code ist, prüft TypeScript ihn und knip folgt ihm.',
      ),
      p(
        'Mit ',
        code('when'),
        ' legst du fest, wann ein Modul importiert wird. Es nimmt dieselben Werte wie eine Island:',
      ),
      codeBlock('enhance-when', s.strategy, 'js'),
      ul(
        { class: 'docs-list' },
        li(code("'load'"), ' (Standard) — sobald die Seite lädt'),
        li(code("'idle'"), ' — per ', code('requestIdleCallback'), ' (Fallback auf ein Timeout)'),
        li(
          code("'visible'"),
          ' — wenn das Element in den sichtbaren Bereich scrollt, per IntersectionObserver. ',
          code('rootMargin'),
          ' startet früher und ist standardmäßig ',
          code("'200px'"),
        ),
      ),
      h2('Dein eigenes Element'),
      p(
        code('enhance()'),
        ' legt ein ',
        code('<div>'),
        ' um das Markup. Wenn das Element selbst zählt, etwa ein ',
        code('<form>'),
        ' mit eigener ',
        code('action'),
        ', setze die Attribute mit ',
        code('enhanceAttributes(name, props, options)'),
        ' direkt darauf. Es ist ein Objekt aus Attributen, also nehmen javascript-to-html und JSX es als Attribute, und in einem Template-Literal wird es zum Attributtext:',
      ),
      pageCodeTabs({
        file: 'src/search.ht.js',
        template: s.formTemplate,
        ht: s.formHt,
        jsx: s.formJsx,
      }),
      p('Das Modul bekommt das Formular selbst:'),
      codeBlock('src/client/search.js', s.searchModule, 'javascript'),
      h2('Was als Props übergeben wird'),
      p(
        'Props sind JSON, das in die Seite geschrieben und dem Modul als zweites Argument übergeben wird. Jedes Element auf der Seite trägt seine eigene Kopie, also übergib nur, was das Markup nicht schon sagt: eine Einstellung ohne natürlichen Platz im HTML, wie ',
        code('minLength'),
        ' oben. Einen Wert, den die Seite anzeigt, wie die Startzahl des Zählers, liest du besser aus dem DOM, damit beide nicht auseinanderlaufen können. Große Daten gehören ins HTML selbst oder in eine Datei, die das Modul lädt.',
      ),
      p(
        'Anders als Island-Props gehen diese nie zurück an einen Server, es gibt also nichts zu signieren. Sie stehen aber im Seitenquelltext, also keine Geheimnisse hinein.',
      ),
      h2('Beim Build geprüft'),
      p(
        'Der Build liest die Zuordnung aus deinen ',
        code('mountEnhancements()'),
        '-Aufrufen und schlägt bei einer Seite fehl, die ein Enhancement nennt, das die Zuordnung nicht hat:',
      ),
      codeBlock('sitelo build', s.buildError, 'text'),
      p(
        code("missingAssets: 'warn'"),
        ' macht daraus eine Warnung, wie bei einem fehlenden Skript, und ',
        code('sitelo'),
        ' (Dev) warnt beim Rendern jeder Seite. Der Build muss die Zuordnung lesen können, also schreib sie als Objektliteral in den Aufruf oder als ',
        code('const'),
        ' in derselben Datei. Eine Zuordnung, die erst zur Laufzeit entsteht, mit einem Spread oder aus einem anderen Modul importiert, lässt sich nicht lesen, und dann wird nichts geprüft. Enhancements in Server-Islands werden erst zur Anfragezeit gerendert, also sieht der Build sie auch nicht.',
      ),
      h2('Zustand und Fehler'),
      p(
        'Das ',
        code('data-sitelo-enhance-state'),
        ' jedes Elements durchläuft ',
        code('pending'),
        ' (wartet auf seinen Moment), ',
        code('loading'),
        ' und ',
        code('ready'),
        '. Lädt das Modul nicht oder wirft es, ist der Zustand ',
        code('error'),
        ', das Markup des Servers bleibt, wie es war, und der Fehler geht an ',
        code('mountEnhancements(modules, { onError })'),
        ' oder an die Konsole. Nutze den Zustand in CSS, wenn sich die Seite ändern soll, sobald das Modul da ist:',
      ),
      codeBlock('styles.css', s.stateCss, 'css'),
      h2('Gut zu wissen'),
      ul(
        { class: 'docs-list' },
        li(
          'Dasselbe Enhancement kann beliebig oft auf einer Seite stehen. Das Modul wird einmal geladen und läuft einmal pro Element, also halte den Zustand pro Element in der Funktion und suche mit ',
          code('element.querySelector()'),
          ' statt im ganzen Dokument.',
        ),
        li(
          'Ein Enhancement in einer Server-Island wird gemountet, wenn das HTML der Island ankommt: Der Island-Loader löst ',
          code('sitelo:island-load'),
          ' aus, und ',
          code('mountEnhancements()'),
          ' hört darauf. Lade beide Loader aus demselben Skript.',
        ),
        li(
          code('mountEnhancements()'),
          ' führt ein Modul nie zweimal auf demselben Element aus, du kannst es also gefahrlos erneut aufrufen, nachdem du selbst Markup hinzugefügt hast.',
        ),
        li(
          'Ein Framework in nur einer Box? Mounte es aus dem Modul, etwa mit ',
          code('createRoot(element).render(<Chart {...props} />)'),
          '. Nur Seiten mit dieser Box laden es.',
        ),
      ),
    ],
  })
