import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Temas',
    description:
      'Meter la hoja de estilos en la página, y cambiar todos los colores, radios y tipografías desde una sola llamada.',
    activeHref: '/es/ui/theming',
    extraHead: uiHead(),
    children: [
      p(
        'Todos los componentes leen las mismas propiedades personalizadas, así que un tema no es más que un conjunto de anulaciones sobre ',
        code(':root'),
        ': sin paso de compilación, sin archivo de configuración y sin ningún componente al que haya que avisar.',
      ),

      h2('Meter los estilos'),
      p(
        code('styles()'),
        ' devuelve un elemento ',
        code('<style>'),
        ' con la hoja entera, minificada — unos 7 kB gzipeados. Es la opción por defecto porque no puede faltar en ',
        code('dist/'),
        ' y no cuesta ninguna petición extra.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mi sitio'),
  styles(),
)`, 'javascript'),
      p(
        'Si prefieres enlazarla una vez y dejar que el navegador la cachee entre páginas, importa el CSS desde un archivo de entrada empaquetado y Vite lo emitirá:',
      ),
      codeBlock('src/main.js', `import 'sitelo/ui/styles.css'`, 'javascript'),
      p(
        'Usa una cosa o la otra, no las dos. ',
        code('stylesheet()'),
        ' devuelve el CSS crudo como cadena, para escribirlo tú donde quieras.',
      ),

      h2('Anular tokens'),
      p(
        code('theme()'),
        ' escribe las anulaciones. Las claves son nombres de token en camelCase, objetos de paleta o propiedades personalizadas literales — y va ',
        code('después'),
        ' de ',
        code('styles()'),
        ', así que manda.',
      ),
      codeBlock('src/index.ht.js', `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', active: '#3f3fb0', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }),
)`, 'javascript'),
      h2('Temas acotados'),
      p(
        'Un ',
        code('selector'),
        ' acota las anulaciones a un subárbol en vez de a toda la página. Eso es lo que hacen los tres paneles de abajo: los mismos componentes, tres paletas distintas, una sola página.',
      ),
      demo(`fragment(
  theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff', soft: '#e6e6fa', softFg: '#33338f', border: '#b9b9ee' } }, { selector: '.theme-indigo' }),
  theme({ primary: { base: '#b0357a', hover: '#962e68', fg: '#ffffff', soft: '#fbe4f0', softFg: '#7d1f53', border: '#f0a9ce' } }, { selector: '.theme-pink' }),
  theme({ radiusMd: '999px', radiusLg: '1.5rem' }, { selector: '.theme-round' }),
  grid({ min: '11rem' },
    div({ class: 'theme-indigo' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'índigo'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-pink' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'rosa'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-round' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'redondeado'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Modo oscuro'),
      p(
        'El oscuro se resuelve por su cuenta a partir de ',
        code('prefers-color-scheme'),
        '. Un ',
        code('data-theme'),
        ' o ',
        code('data-su-theme'),
        ' explícito con valor ',
        code('light'),
        ' o ',
        code('dark'),
        ' en cualquier ancestro lo sobrescribe, que es como las demos de este sitio siguen al conmutador de la barra superior.',
      ),
      p(
        'Pasa ',
        code('dark'),
        ' para anulaciones que solo deban aplicarse allí. Cubre el atributo y la media query de una vez.',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('Qué hay para anular'),
      p(
        'Cinco paletas de nueve ranuras cada una, una escala de espaciado, tipografía, radios, sombras y los colores de superficie. Cada una es una propiedad personalizada: abre la hoja de estilos, o el inspector de tu navegador, y están todas en ',
        code(':root'),
        '.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    ...['primary', 'neutral', 'success', 'warning', 'danger'].map((color) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: 3.5rem; height: 2rem; border-radius: 0.4rem; background: var(--su-' + color + ')' }),
        text({ variant: 'caption', tone: 'muted' }, color),
      ),
    ),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true, align: 'flex-end' },
    ...['xs', 'sm', 'md', 'lg', 'xl'].map((step) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: var(--su-space-' + step + '); height: 2rem; border-radius: 0.2rem; background: var(--su-neutral)' }),
        text({ variant: 'caption', tone: 'muted' }, step),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Nomenclatura'),
      p(
        'Una clave en camelCase pasa a ser una propiedad en kebab-case: ',
        code('radiusMd'),
        ' es ',
        code('--su-radius-md'),
        ', y ',
        code('fontSans'),
        ' es ',
        code('--su-font-sans'),
        '. Un objeto anidado se expande igual — ',
        code('{ primary: { softFg: … } }'),
        ' pone ',
        code('--su-primary-soft-fg'),
        ' — y una clave que ya empiece por ',
        code('--'),
        ' se usa exactamente tal cual, que es la vía de escape para lo que el mapeo no cubra.',
      ),
      p(
        'Una paleta tiene nueve ranuras: ',
        code('base'),
        ', ',
        code('hover'),
        ', ',
        code('active'),
        ', ',
        code('fg'),
        ', ',
        code('soft'),
        ', ',
        code('softHover'),
        ', ',
        code('softFg'),
        ', ',
        code('border'),
        ' y ',
        code('ring'),
        '. Define solo las que vayas a cambiar.',
      ),

      h2('Contraste'),
      p(
        'Las paletas que vienen de serie superan el AA de las WCAG contra las superficies sobre las que se apoyan, en ambos temas, y hay un test en el repositorio que tumba la compilación si eso deja de ser cierto. Un tema tuyo no está cubierto por él: comprueba tu ',
        code('fg'),
        ' contra tu ',
        code('base'),
        ' antes de publicarlo.',
      ),

      h2('Props'),
      p(code('styles()'), ' y ', code('stylesheet()'), ':'),
      propsTable([
        ['minify', 'boolean', 'true', 'Quita comentarios y espacios.'],
        ['nonce', 'string', '', 'Nonce de CSP para el elemento style emitido. Solo en styles().'],
      ]),
      p(code('theme(tokens, options)'), ':'),
      propsTable([
        ['selector', 'string', "':root'", 'Acota las anulaciones a un subárbol.'],
        ['dark', 'object', '', 'Anulaciones aplicadas solo en modo oscuro.'],
        ['nonce', 'string', '', 'Nonce de CSP.'],
      ]),
    ],
  })
