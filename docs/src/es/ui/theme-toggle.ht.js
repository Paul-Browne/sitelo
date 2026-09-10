import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Cambio de tema',
    description:
      'Un conmutador claro/oscuro, con el script en línea que evita el destello al entrar cuando ya hay una elección guardada.',
    activeHref: '/es/ui/theme-toggle',
    children: [
      p(
        'sitelo-ui resuelve el modo oscuro por su cuenta a partir de ',
        code('prefers-color-scheme'),
        ': un sitio contento con seguir al sistema operativo no necesita nada de esta página. El conmutador está para dejar que el lector lo sobrescriba.',
      ),
      p(
        'Es uno de los cinco componentes que necesitan script, porque la elección vive en ',
        code('localStorage'),
        ' y solo un script puede leerla. El botón se descarga ese script él mismo, en la primera pulsación.',
      ),

      h2('Puesta en marcha'),
      p('Dos cosas en el head, y el botón donde corresponda:'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // aplica la elección guardada antes del primer pintado
  styles(),
)

body(
  appBar({ brand: 'Mi sitio' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        'No hay un tercer archivo. ',
        code('themeScript()'),
        ' es bloqueante y en línea a propósito — todo lo diferido pinta antes, que es justo el destello oscuro que existe para evitar — y el cambio en sí viaja en el botón:',
      ),
      codeBlock('Marcado generado', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        'Empareja los dos. ',
        code('themeScript()'),
        ' es además lo que marca el conmutador con ',
        code('aria-pressed'),
        ' al cargar: todavía no se ha pulsado nada, así que el botón por sí solo no puede saber qué tema salió.',
      ),

      h2('El conmutador'),
      p(
        'El icono es CSS puro, leído directamente del atributo de tema, así que ya es correcto en el primer pintado, antes de que corra ningún script. Muestra hacia qué tema ',
        code('cambiará'),
        ' un clic.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Esos botones funcionan: esta página carga el runtime. Al pulsar uno se pone ',
        code('data-su-theme'),
        ' en ',
        code('<html>'),
        ', que es el atributo propio de sitelo-ui, así que solo cambian los componentes de sitelo-ui de esta página. El resto del sitio sigue su propio ',
        code('data-theme'),
        ', que fija el conmutador de la barra superior. En tu sitio solo habría uno de ellos.',
      ),

      h2('En una barra de aplicación'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Documentación')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Empezar'),
  ),
)`, { align: 'stretch' }),

      h2('Cómo se resuelve el tema'),
      p(
        'Por orden: un ',
        code('data-theme'),
        ' o ',
        code('data-su-theme'),
        ' explícito en cualquier ancestro manda; a falta de eso, decide ',
        code('prefers-color-scheme'),
        '. Se respetan los dos nombres de atributo para que sitelo-ui pueda vivir dentro de un sitio que ya tenga su propio interruptor de tema, que es exactamente lo que hace esta documentación.',
      ),

      h2('Manejarlo tú'),
      p(
        'El runtime exporta las mismas funciones que usa el botón, para un control a medida o un selector de tres posiciones claro / oscuro / sistema.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — resuelto, no guardado
toggleTheme()       // cambia
setTheme('dark')    // fija
setTheme('system')  // borra la anulación y vuelve a seguir al sistema`, 'javascript'),

      h2('Props'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Nombre accesible y tooltip.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Variante del botón.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'De qué paleta bebe.'],
      ]),
      p(
        code('themeScript()'),
        ' admite un ',
        code('nonce'),
        ' opcional, para un sitio con política de seguridad de contenidos.',
      ),
    ],
  })
