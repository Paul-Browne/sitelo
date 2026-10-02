import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Una sola fuente monoespaciada sobre un fondo azul marino oscuro, al estilo de Advent of Code: acciones entre corchetes, enlaces verdes y un brillo en lo que está encendido.',
    activeHref: '/es/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' es una sola fuente monoespaciada sobre un fondo azul marino oscuro, compuesta como Advent of Code: texto gris, enlaces verdes que se iluminan al pasar el cursor, blanco para lo importante y un brillo de su propio color en las pocas cosas encendidas. Una acción es una palabra entre corchetes, ',
        code('[Guardar]'),
        '; una casilla es ',
        code('[ ]'),
        ' hasta que es ',
        code('[X]'),
        ', y un encabezado de segundo nivel queda delimitado como ',
        code('--- Título ---'),
        '. Nada tiene esquinas redondeadas y nada flota sobre una sombra suave: un borde es una línea, y una tarjeta elevada lleva doble línea. El modo oscuro es el aspecto original; el modo claro conserva la fuente, los corchetes y las esquinas rectas y los imprime en azul marino sobre papel pálido, sin el brillo.',
      ),
      presetPreview('terminal'),

      h2('Cómo usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mi sitio'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        'Compón también la página con él —su fondo, su gris y su fuente— y los componentes quedan sobre ella como arriba. El preset usa Source Code Pro si la página la carga y, si no, la monoespaciada del sistema; no descarga nada.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Tus propios colores'),
      p(
        code('theme()'),
        ' sigue funcionando por encima, así que un preset es un punto de partida y no un fork. El brillo se dibuja en el color del texto que lo lleva, así que una paleta que cambies brilla en su nuevo color: aquí el primario pasa a ámbar, como un terminal más antiguo. El éxito es el dorado de una estrella, como la referencia marca un puzle resuelto; dale un verde del mismo modo si lo prefieres. Dos tokens son propios del preset: ',
        code('--su-tm-bright'),
        ', el blanco de los encabezados y de todo lo elegido, y ',
        code('--su-tm-glow'),
        ', la sombra que lleva lo encendido, que es ',
        code('none'),
        ' en modo claro.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    { primary: { base: '#8a5200', hover: '#734400', active: '#5c3600', soft: '#f6e6cc', softFg: '#4d2e00' } },
    { dark: { primary: { base: '#ffb000', hover: '#ffd480', active: '#e69e00', soft: '#33260d', softFg: '#ffd480' } } },
  ),
)`, 'javascript'),
    ],
  })
