import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

/** Eine Zelle: das Zeichen in lesbarer Größe, mit dem Namen zum Tippen. */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* Alphabetisch, direkt aus der Bibliothek, damit die Seite nicht hinter
 * dem Satz zurückfallen kann, den sie dokumentiert. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * Die Zeichen, die durch Ausmalen des eigenen Pfads gefüllt werden, im
 * Gegensatz zu denen mit einer zweiten Zeichnung — unterschieden daran, ob
 * beide Formen dasselbe Markup sind, damit keine Demo zurückfallen kann.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * Die Füll-Demo, ausgeschrieben statt von Hand gelistet — die Quelle ist das,
 * was die Seite ausgibt, also taucht ein Zeichen, das füllbar wird, hier auf,
 * ohne dass jemand daran denken muss, es einzutragen.
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: 'Icons',
    description:
      'Ein Satz von 99 Zeichen auf einem Raster, inline gerendert, sodass ein Icon Farbe und Größe des Textes ringsum annimmt.',
    activeHref: '/de/ui/icons',
    extraHead: uiHead(),
    children: [
      p(
        code('icon()'),
        ' gibt ein inline ',
        code('<svg>'),
        ' zurück. Jedes Zeichen ist auf demselben 24×24-Raster als ungefüllte Striche in ',
        code('currentColor'),
        ' gezeichnet, erbt also Farbe und Schriftgröße von dem, worin es sitzt, und braucht keine eigenen Stile.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('In einer Komponente'),
      p(
        'Ein Icon ist ein Kind wie jedes andere. Weil es sich in ',
        code('em'),
        ' bemisst, passt es zum Label daneben, ohne dass man ihm dessen Größe sagen müsste:',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), 'Herunterladen'),
  button({ variant: 'outline' }, icon('external-link'), 'Öffnen'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Löschen'),
  iconButton({ label: 'Suchen', variant: 'soft', icon: icon('search') }),
)`),

      h2('Größe'),
      p(
        'Der Standard ist ',
        code('1em'),
        ' — die Größe des umgebenden Textes. ',
        code('size'),
        ' nimmt ein Token oder jede CSS-Länge, wenn du davon abweichen willst:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Farbe'),
      p(
        'Es gibt keine Farb-Prop. Ein Icon wird in ',
        code('currentColor'),
        ' gezeichnet und nimmt damit die Farbe seines Kontexts an — genau das lässt einen Satz in fünf Paletten funktionieren:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Zugängliche Namen'),
      p(
        'Ein Icon ist standardmäßig ',
        code('aria-hidden'),
        ', was weit häufiger richtig ist als nicht: ein Icon neben dem Wort „Löschen“ soll nicht ein zweites Mal angesagt werden. Gib ihm nur dann ein ',
        code('label'),
        ', wenn das Icon die ganze Bedeutung trägt — dann wird es ',
        code('role="img"'),
        ' mit diesem Namen.',
      ),
      codeBlock('', `icon('trash')                       // dekorativ — versteckt
button(icon('trash'), 'Löschen')    // das Wort spricht

icon('trash', { label: 'Löschen' }) // als Bild angesagt

// Ein Icon-Button beschriftet den Button, nicht das Zeichen darin
iconButton({ label: 'Löschen', icon: icon('trash') })`, 'javascript'),

      h2('Gefüllt'),
      p(
        code('filled'),
        ' malt ein Zeichen aus, statt es zu umreißen. Es ist in beiden Fällen derselbe Pfad — nur das Attribut ',
        code('fill'),
        ' ändert sich —, sodass beide Formen exakt dieselbe Außenkante teilen und nicht auseinanderdriften können.',
      ),
      demo(fillDemo()),
      p('Und dieselben Namen, gefüllt:'),
      demo(fillDemo({ filled: true })),
      p(
        'Es ist eine Prop und kein zweiter Satz von Namen, weil der gefüllte Zustand fast immer ein ',
        code('Zustand'),
        ' ist — gespeichert, geliked, bewertet — und deshalb ein Boolean will, keinen anderen String:',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Gespeichert' : 'Speichern' })

// statt
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'Die Status-Zeichen füllen sich anders, weil ihre Marke ',
        code('innerhalb'),
        ' der Form sitzt. Den Kreis auszumalen würde das Häkchen schlucken, also wird die Marke stattdessen ausgestanzt:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'Diese tragen eine zweite Zeichnung — die volle Form mit der per ',
        code('fill-rule: evenodd'),
        ' herausgeschnittenen Marke —, weil sich eine solche Aussparung nicht durch Ändern eines Attributs aus dem Umrisspfad gewinnen lässt. Die äußere Form wird an der Außenkante des Umrisses gezeichnet, sodass beide Fassungen auf derselben Silhouette enden. Es ist in beiden Fällen dieselbe Prop; welchen Mechanismus ein Zeichen nutzt, ist seine eigene Sache.',
      ),
      p(
        'Ein Chevron hat gar kein Inneres zum Ausmalen — es ist eine offene Linie — und füllt sich daher zu dem Dreieck, das seine drei Punkte beschreiben, samt dem Strich, der die Ecken rundet:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' listet alles, was auf ',
        code('filled'),
        ' hört. Ein Zeichen ohne gefüllte Form ignoriert es und bleibt umrissen — ',
        code('eye'),
        ' zu füllen würde die Pupille verlieren und ',
        code('tag'),
        ' sein Loch, also tut keines von beiden so.',
      ),

      h2('Drehen'),
      p(
        code('spin'),
        ' dreht das Zeichen — gedacht für ',
        code('spinner'),
        ', auch wenn dich nichts daran hindert, ',
        code('refresh'),
        ' zu drehen, während etwas neu lädt. Unter ',
        code('prefers-reduced-motion'),
        ' wird es zum Schneckentempo statt anzuhalten, denn ein stehender Spinner sieht kaputt aus.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'Speichert…'),
)`),

      h2('Der Satz'),
      p(
        'Namen beschreiben die Zeichnung, nicht ihren Zweck — ',
        code('x-circle'),
        ', nicht ',
        code('error'),
        ' —, weil dieselbe Zeichnung für unzusammenhängende Zwecke benutzt wird und ein Name, der das Bild beschreibt, dabei wahr bleibt. Die Aliase unten decken die üblichen Absichten ab.',
      ),
      gallery(),

      h2('Marken'),
      p(
        'Acht Markenzeichen kommen mit dem Satz — ',
        code('facebook'),
        ', ',
        code('google'),
        ', ',
        code('instagram'),
        ', ',
        code('linkedin'),
        ', ',
        code('tiktok'),
        ', ',
        code('whatsapp'),
        ', ',
        code('x-twitter'),
        ' und ',
        code('youtube'),
        '. Sie nehmen weiterhin ',
        code('size'),
        ' und ',
        code('label'),
        ' und zeichnen weiterhin in ',
        code('currentColor'),
        ':',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Teilen'),
)`),
      p(
        'Sie sind Reproduktionen fremder Marken und keine Zeichnungen im Stil dieser Bibliothek, brechen also absichtlich zwei ihrer Regeln: es sind volle Flächen statt Striche, denn genau das ist ein Logo, und ihre Proportionen sind die der Marke, nicht die dieses Rasters. ',
        code('filled'),
        ' bedeutet ihnen nichts — sie sind es bereits.',
      ),
      p(
        'Die Zeichnungen stammen von Simple Icons, die sie unter CC0 veröffentlichen. Das deckt die Zeichnung ab, nicht die Marke: nutze sie, um auf das zu zeigen, was sie benennen — einen Profillink, einen Teilen-Button — und nicht auf einem eigenen Produkt.',
      ),
      p(
        'Es heißt ',
        code('x-twitter'),
        ', nicht ',
        code('x'),
        ', weil ',
        code('x'),
        ' bereits ein Alias für ',
        code('close'),
        ' ist und ein Schließen-Button, der sich in ein Logo verwandelt, eine böse Überraschung wäre. ',
        code('twitter'),
        ' führt ebenfalls dorthin.',
      ),

      h2('Aliase'),
      p('Jeder davon rendert ein oben gelistetes Zeichen, unter dem Namen, zu dem du eher greifst:'),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('Eigene Icons'),
      p(
        code('registerIcons()'),
        ' fügt ein Zeichen hinzu oder ersetzt ein mitgeliefertes. Das Markup ist der Inhalt des ',
        code('<svg>'),
        ' — Formen auf demselben 24×24-Raster, ungefüllt gelassen, damit ',
        code('currentColor'),
        ' sie erreicht. Rufe es einmal aus einem Modul auf, das deine Seiten importieren:',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // Ein bereits vorhandener Name ersetzt es überall — so gestaltest du ein
  // mitgeliefertes Zeichen um, ohne die Bibliothek zu forken.
  check: '<path d="m5 13 4 4 10-11"/>',
  // Eine geschlossene Form, damit es wie die mitgelieferten auf \`filled\` hört.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                   // dein Zeichen
icon('check')                  // jetzt ebenfalls deins

registerIcons({ check: null }) // und zurück zum mitgelieferten`, 'javascript'),

      h2('Warum inline und kein Sprite'),
      p(
        'Icons werden in die Seite gerendert, statt aus einem ',
        code('icons.svg'),
        ' per ',
        code('<use>'),
        ' geholt zu werden. Ein Sprite spart in der Größenordnung von hundert gzippten HTML-Bytes pro Seite und kostet dafür einen Roundtrip — wiederholtes Markup ist genau der Fall, in dem gzip am besten ist, das meiste, wofür es ein Sprite gibt, ist also schon dedupliziert. Inline heißt außerdem: keine Datei zu erzeugen, kein Basispfad zu konfigurieren und nichts, das in ',
        code('dist'),
        ' fehlen kann — derselbe Handel, den ',
        code('styles({ inline: true })'),
        ' eingeht.',
      ),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Welches Zeichen. Kann stattdessen als erstes Argument übergeben werden.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'Ein Token oder jede CSS-Länge. Standard ist 1em.'],
        ['label', 'string', '', 'Als Bild mit diesem Namen ansagen, statt es zu verstecken.'],
        ['spin', 'boolean', 'false', 'Es fortlaufend drehen.'],
        ['filled', 'boolean', 'false', 'Das Zeichen ausmalen statt umreißen. Von nicht füllbaren Zeichen ignoriert.'],
      ]),
      p(
        'Ein unbekannter Name rendert gar nichts, statt zu werfen — eine kosmetische Prop soll keinen Build scheitern lassen können. ',
        code('hasIcon(name)'),
        ' sagt dir, ob es eines gibt, ',
        code('iconNames()'),
        ' listet sie alle, und ',
        code('fillableIcons()'),
        ' die, die ',
        code('filled'),
        ' annehmen.',
      ),
    ],
  })
