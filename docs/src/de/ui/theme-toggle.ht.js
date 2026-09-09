import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Theme-Umschalter',
    description:
      'Ein Hell/Dunkel-Schalter, samt dem Inline-Skript, das eine gespeicherte Wahl beim Eintreffen nicht aufblitzen lässt.',
    activeHref: '/de/ui/theme-toggle',
    extraHead: uiHead(),
    children: [
      p(
        'sitelo-ui löst den Dunkelmodus von sich aus über ',
        code('prefers-color-scheme'),
        ' auf — eine Website, die zufrieden dem Betriebssystem folgt, braucht von dieser Seite nichts. Der Umschalter ist dafür da, eine Leserin das überstimmen zu lassen.',
      ),
      p(
        'Er ist eine der fünf Komponenten, die ein Skript brauchen, denn die Wahl liegt im ',
        code('localStorage'),
        ' und nur ein Skript kann sie lesen. Der Button holt sich dieses Skript beim ersten Druck selbst.',
      ),

      h2('Einrichtung'),
      p('Zwei Dinge in den Head, und der Button dorthin, wo er hingehört:'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // wendet die gespeicherte Wahl vor dem ersten Paint an
  styles(),
)

body(
  appBar({ brand: 'Meine Website' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        'Eine dritte Datei gibt es nicht. ',
        code('themeScript()'),
        ' ist mit Absicht blockierend und inline — alles Verzögerte malt zuerst, und genau das ist das dunkle Aufblitzen, das es verhindern soll — und das Umschalten selbst reitet auf dem Button mit:',
      ),
      codeBlock('Erzeugtes Markup', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        'Setze beide zusammen ein. ',
        code('themeScript()'),
        ' ist auch das, was den Umschalter beim Laden mit ',
        code('aria-pressed'),
        ' markiert: gedrückt wurde noch nichts, also kann der Button allein gar nicht wissen, welches Theme herauskam.',
      ),

      h2('Der Umschalter'),
      p(
        'Das Icon ist reines CSS, direkt vom Theme-Attribut abgelesen — es stimmt also schon beim ersten Paint, bevor ein Skript läuft. Es zeigt, wohin ein Klick umschaltet.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Diese Buttons funktionieren — diese Seite lädt das Runtime. Ein Klick setzt ',
        code('data-su-theme'),
        ' am ',
        code('<html>'),
        ', das eigene Attribut von sitelo-ui, deshalb ändern sich nur die sitelo-ui-Komponenten auf dieser Seite. Der Rest dieser Website folgt ihrem eigenen ',
        code('data-theme'),
        ', gesetzt vom Umschalter in der oberen Leiste. Auf deiner Website gäbe es davon nur einen.',
      ),

      h2('In einer App-Bar'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Doku')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Loslegen'),
  ),
)`, { align: 'stretch' }),

      h2('Wie das Theme aufgelöst wird'),
      p(
        'Der Reihe nach: ein explizites ',
        code('data-theme'),
        ' oder ',
        code('data-su-theme'),
        ' an irgendeinem Vorfahren gewinnt; sonst entscheidet ',
        code('prefers-color-scheme'),
        '. Beide Attributnamen werden beachtet, damit sitelo-ui in einer Website sitzen kann, die schon ihren eigenen Theme-Schalter hat — genau das tut diese Dokumentation.',
      ),

      h2('Selbst steuern'),
      p(
        'Das Runtime exportiert dieselben Funktionen, die der Button nutzt — für ein eigenes Bedienelement oder eine Dreifachauswahl hell / dunkel / System.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — aufgelöst, nicht gespeichert
toggleTheme()       // umschalten
setTheme('dark')    // festlegen
setTheme('system')  // die Übersteuerung löschen und wieder dem OS folgen`, 'javascript'),

      h2('Props'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Zugänglicher Name und Tooltip.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Button-Variante.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Aus welcher Palette geschöpft wird.'],
      ]),
      p(
        code('themeScript()'),
        ' nimmt ein optionales ',
        code('nonce'),
        ' — für eine Website mit Content Security Policy.',
      ),
    ],
  })
