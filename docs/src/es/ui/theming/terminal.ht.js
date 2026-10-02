import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Una consola de sistema: una sola fuente monoespaciada sobre negro, paneles de línea fina, etiquetas en mayúsculas negritas y un acento cian con todo lo seleccionado en vídeo inverso.',
    activeHref: '/es/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' es una consola de sistema: una sola fuente monoespaciada sobre un fondo negro, paneles de línea fina con la cabecera separada por una raya, y cada etiqueta —un botón, el rótulo de un campo, una pestaña, la cabecera de una columna— en mayúsculas negritas y espaciadas. El cian es el acento: encabezados, títulos de panel, el botón sólido, el foco y todo lo seleccionado, que se imprime en vídeo inverso, oscuro sobre cian, como un terminal resalta una fila. Las demás paletas son sus colores de estado, verde, amarillo y rojo, y un botón de contorno o una etiqueta se dibujan en su color, línea y texto por igual. Nada tiene esquinas redondeadas y nada proyecta sombra. El modo oscuro es el aspecto original; el modo claro conserva cada línea, cada mayúscula y cada esquina recta y lo imprime en negro sobre casi blanco.',
      ),
      presetPreview('terminal'),

      h2('Cómo usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mi sitio'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-176ac9d8.css">`, 'javascript'),
      p(
        'Compón también la página con él —su fondo, su color de texto y su fuente— y los componentes quedan sobre ella como arriba. El preset usa JetBrains Mono, IBM Plex Mono o Source Code Pro si la página carga alguna y, si no, la monoespaciada del sistema; no descarga nada.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Tus propios colores'),
      p(
        code('theme()'),
        ' sigue funcionando por encima, así que un preset es un punto de partida y no un fork: aquí el acento pasa a un ámbar de fósforo. Dos tokens son propios del preset: ',
        code('--su-tm-tracking'),
        ', el espaciado de una etiqueta en mayúsculas, y ',
        code('--su-tm-track'),
        ', el carril por el que corre una barra de progreso o un control deslizante.',
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
