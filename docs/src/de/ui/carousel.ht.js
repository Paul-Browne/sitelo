import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Karussell',
    description:
      'Slides, durch die du scrollst und die dabei einrasten — Punkte und Pfeile lässt das Stylesheet den Browser zeichnen.',
    activeHref: '/de/ui/carousel',
    children: [
      p(
        'Ein Karussell ist hier ein Scroll-Container und eine Reihe Slides, die einrasten. So viel kann jeder Browser schon: Wischen, Trackpad, Shift-Mausrad und die Pfeiltasten funktionieren beim ersten Paint, ohne geladenes Skript und ohne Hydration.',
      ),
      p(
        'Wo der Browser es kann, sind die Punkte und die Pfeile überhaupt kein Markup. Sie sind ',
        code('::scroll-marker'),
        ' an jedem Slide und ',
        code('::scroll-button()'),
        ' an der Spur — Pseudoelemente, die das Stylesheet anfordert und die der Browser dann zeichnet, benennt, an die Scroll-Position hängt, als aktuell markiert und an den Enden deaktiviert. An dieser Komponente gibt es kein ',
        code('data-'),
        '-Attribut und kein Modul zum Importieren: der Zustand ist der Scroll-Offset, und den hat der Browser bereits.',
      ),
      p(
        'Wo er es nicht kann, übernimmt eine gerenderte Reihe Punkte: ein Link je Slide, der für sich schon funktioniert und der beim ersten Scrollen oder beim ersten Tippen ein paar hundert Byte Skript holt, um sich wie die nativen Punkte zu verhalten — dem Scrollen zu folgen und die Spur zu bewegen, ohne die Seite mitzunehmen.',
      ),

      h2('Eins nach dem anderen'),
      p(
        'Der Standard. Jeder Slide füllt die Spur, rastet am Anfang ein und bleibt dort, statt gleich drei Slides weiterzufliegen.',
      ),
      demo(`carousel({
  items: ['Küste', 'Hafen', 'Felder', 'Altstadt'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('Mehrere auf einmal'),
      p(
        code('perView'),
        ' ist, wie viele Slides die Spur füllen, und ',
        code('min'),
        ' ist eine Untergrenze dafür, wie schmal einer werden darf. Die Untergrenze ersetzt eine Media Query: sobald der Anteil eines Slides an der Spur darunter fällt, bleiben die Slides so breit und es passen weniger hinein — derselbe Trick, den ',
        code('grid()'),
        ' mit auto-fit spielt.',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['Routing', 'Daten', 'Assets', 'Bilder', 'Islands', 'Suche'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, 'Anleitung'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('Ein Blick auf das nächste'),
      p(
        'Ein gebrochenes ',
        code('perView'),
        ' lässt einen Streifen des nächsten Slides stehen — die billigste Art zu sagen „das scrollt“, ganz ohne Bedienelemente.',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['Eins', 'Zwei', 'Drei'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('Responsiv ohne eigenen Breakpoint'),
      p(
        code('perView'),
        ' steht als Custom Property da, also kann eine Media Query es ändern, ohne das Markup anzufassen — und ohne dass die Komponente deine Breakpoints kennen müsste:',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('Einrasten'),
      p(
        'Eingerastet wird standardmäßig ',
        code('mandatory'),
        ': ein Scroll kommt immer auf einem Slide zur Ruhe. ',
        code("snap: 'proximity'"),
        ' zieht ihn nur heran, wenn er nah an einem endet, und ',
        code('snap: false'),
        ' lässt die Spur frei scrollen — was eine Reihe kleiner Dinge will, bei der es in Ordnung ist, zwischen zweien zu landen.',
      ),
      demo(`carousel({
  snap: false,
  perView: 4,
  min: '7rem',
  gap: 'sm',
  arrows: false,
  items: ['sitelo', 'vite', 'pagefind', 'sharp', 'lighthouse', 'rollup', 'esbuild'].map((name) =>
    chip({ size: 'lg', color: 'neutral', style: 'width: 100%; justify-content: center' }, name)),
})`, { align: 'stretch' }),

      h2('Wohin Punkte und Pfeile gehören'),
      p(
        'Beide sind optional und beide standardmäßig an. Nimmst du die Punkte weg, kommt die Scrollbar der Spur zurück — ein Karussell ohne beides wäre ein Scroller, an dem nichts sagt, dass er scrollt.',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['Nur Punkte', 'Zweiter', 'Dritter'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['Nur Pfeile', 'Zweiter', 'Dritter'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('Wenn der Browser keine Scroll-Marker hat'),
      p(
        'Dann sind die Punkte echte Links, einer je Slide, jeder auf die Id dieses Slides — deshalb bekommt jeder Slide eine. So weit funktioniert es ohne alles: ein Tipp scrollt die Spur zu seinem Slide, denn einem Fragment zu folgen kann ein Browser von sich aus.',
      ),
      p(
        'Beim ersten Scrollen oder beim ersten Tippen holen die Spur und die Punkte ',
        code('/su/carousel.js'),
        ' — aus ihren eigenen Event-Attributen, so wie hier jede Komponente ihr Modul holt. Auf einer Seite, die niemand anfasst, wird also nichts geladen, und wo es die nativen Marker schon gibt, überhaupt nichts. Von da an geht es in beide Richtungen: die Punkte folgen dem Scrollen, ganz gleich was es bewegt hat — ein Wisch, ein Trackpad, die Pfeiltasten, eine gezogene Scrollbar — und ein Tipp auf einen Punkt scrollt die Spur und lässt die Seite, wo sie war.',
      ),
      p(
        'Für das Letzte ist das Skript eigentlich da. Ein nacktes Fragment bewegt das Fenster zum Slide und nicht nur die Spur, und ein Karussell, das die Seite unter dem tippenden Finger wegzieht, ist nicht, was jemand mit einem Punkt gemeint hat. Der Klick wird im Attribut abgesagt und nicht erst im Import, weil ein dynamischer Import einen Moment später ankommt und der Browser dem Link dann längst gefolgt ist. ',
        code('scrollMargin'),
        ' ist, wo das Fenster im einzig übrigen Fall landet: JavaScript aus, wo der Link eben nur ein Link ist.',
      ),
      p(
        'Die Ids, auf die sie zeigen, kommen aus ',
        code('name'),
        ', aus der eigenen ',
        code('id'),
        ' des Karussells oder — wenn beides fehlt — aus einem Digest der Slides, damit zwei Karussells auf einer Seite nicht kollidieren, ohne voneinander zu wissen. Gib einem Eintrag eine eigene ',
        code('id'),
        ', wenn ein bestimmter Slide es wert ist, von anderswo verlinkt zu werden.',
      ),

      h2('Die Slides benennen'),
      p(
        'Jeder Punkt ist nach seinem Slide benannt, denn ein Punkt ist ein Bedienelement, und ein Bedienelement ohne Namen ist für einen Screenreader nur „Schaltfläche“. Standardmäßig ist der Name die Nummer des Slides. Übergib einen Eintrag als Objekt, um ihn besser zu benennen, oder ',
        code('slideLabel'),
        ', um sie in deinen eigenen Worten zu zählen.',
      ),
      demo(`carousel({
  label: 'Produktfotos',
  perView: 2,
  min: '10rem',
  items: [
    { label: 'Die Küche', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Küche'))) },
    { label: 'Die Terrasse', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Terrasse'))) },
    { label: 'Der Garten', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Garten'))) },
  ],
})`, { align: 'stretch' }),

      h2('Selbst steuern'),
      p(
        'Zwei Funktionen für die Fälle, in denen die Seite das Karussell bewegt — ein Button „Fotos ansehen“, ein Schritt in einem Formular, ein Link an anderer Stelle:',
      ),
      codeBlock('src/main.js', `import { setSlide, getSlide } from 'sitelo/ui/client'

setSlide('gallery', 2)  // scrollt zum dritten Slide und markiert seinen Punkt
getSlide('gallery')     // 2`, 'javascript'),
      p('Oder aus einem Event-Attribut, ganz ohne gebündeltes Skript:'),
      codeBlock('Irgendwo', `button({ onclick: "import('/su/carousel.js').then(m=>m.set('gallery',0))" }, 'Zurück zum Anfang')`, 'javascript'),

      h2('Was das hier nicht tut'),
      p(
        'Es springt nicht zum ersten Slide zurück, und es läuft nicht von allein weiter. Beides kann CSS nicht, also ist beides nicht da — ein endloses oder selbstlaufendes Karussell braucht ein Skript, und diese Komponente möchte nicht der Grund sein, aus dem eine Seite eines lädt. Das Weiterlaufen ist ohnehin gut verzichtbar: es bewegt genau das, was jemand gerade liest, unter den Augen weg.',
      ),
      p(
        'Mit abgeschaltetem JavaScript kann es außerdem nicht markieren, welcher Slide zu sehen ist, sobald die Spur gewischt wurde, und keinen erreichen, ohne die Seite zu bewegen. Der erste Punkt wird beim Bauen markiert, weil im Ruhezustand genau dieser Slide zu sehen ist; ihn danach richtig zu halten, ist das Einzige, was nur das Skript kann. Wischen, Trackpad und Tasten gehen in beiden Fällen.',
      ),

      h2('Barrierefreiheit'),
      p(
        'Die Spur ist eine benannte Gruppe mit ',
        code('tabindex="0"'),
        ', damit eine Tastatur den scrollbaren Bereich erreicht und ihn in jeder Engine mit den Pfeiltasten abläuft — nicht nur in denen, die Scroller von sich aus fokussieren. Benenne sie mit ',
        code('label'),
        ', wenn eine Seite mehr als eines hat.',
      ),
      p(
        'Wo der Browser sie zeichnet, erscheinen die Punkte als Tabliste und die Pfeile als Schaltflächen, die sich an jedem Ende selbst deaktivieren — all das baut der Browser, also kann nichts davon aus dem Tritt geraten mit dem Slide, der tatsächlich zu sehen ist. Das ist das Argument für diese Form gegenüber einer geskripteten: es gibt keine zweite Kopie des Zustands, die falsch sein könnte.',
      ),
      p(
        'Die Fallback-Punkte sind Links, jeder nach seinem Slide benannt und jeder ein 24px großes Ziel statt der 8px, die der Punkt zu sein scheint. Der gezeigte Slide trägt ',
        code('aria-current'),
        ' — das ist zugleich, was ein Screenreader liest, und was das Stylesheet einfärbt: ein Zustand, den es richtig zu halten gilt, statt zweier, die auseinanderlaufen können. Gerendert wird er auf den ersten Punkt, denn im Ruhezustand ist das der gezeigte Slide, und von da an wandert er mit dem Scrollen. Wo die nativen Marker sie ersetzen, sind die Links ',
        code('display: none'),
        ', verschwinden also mit dem Bild auch aus dem Accessibility-Baum, statt zweimal vorgelesen zu werden.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Slides. Ein Kind, oder { label, content } samt beliebigen weiteren Attributen für den Slide. Kinder sind ebenfalls Slides und folgen den items.'],
        ['perView', 'number', '1', 'Wie viele Slides die Spur füllen. Gebrochen lässt einen Streifen des nächsten stehen.'],
        ['min', 'string', '', 'Untergrenze für die Breite eines Slides, damit ein schmaler Bildschirm weniger statt dünnere zeigt.'],
        ['gap', 'Space', "'md'", 'Zwischen den Slides.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Wo ein Slide zur Ruhe kommt.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'Wie fest der Scroll auf einem Slide landet.'],
        ['dots', 'boolean', 'true', 'Punkte unter der Spur — native Scroll-Marker, wo der Browser sie hat, sonst ein Link je Slide, den ein kleines Modul aufwertet. Aus bringt die Scrollbar zurück und verlangt kein Skript.'],
        ['arrows', 'boolean', 'true', 'Pfeile über der Spur.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Farbe des Punkts für den gezeigten Slide.'],
        ['label', 'string', "'Carousel'", 'Zugänglicher Name des scrollbaren Bereichs.'],
        ['previousLabel', 'string', "'Previous slide'", 'Zugänglicher Name des Pfeils zurück.'],
        ['nextLabel', 'string', "'Next slide'", 'Zugänglicher Name des Pfeils vorwärts.'],
        ['slideLabel', '(index, count) => string', 'die Nummer', 'Benennt einen Slide, der sich nicht selbst benannt hat.'],
        ['name', 'string', 'die id des Karussells, sonst ein Digest', 'Präfix der Slide-Ids, auf die die Fallback-Punkte zeigen.'],
        ['scrollMargin', 'Space', "'lg'", 'Wie weit über einem Slide das Fenster hält, wenn ein Fallback-Punkt dorthin führt.'],
        ['as', 'string', "'div'", 'Zu renderndes Element.'],
      ]),
    ],
  })
