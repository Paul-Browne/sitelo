import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Una consola de sistema: una sola fuente monoespaciada sobre negro, paneles de línea fina, etiquetas en mayúsculas negritas y un acento cian con lo seleccionado en vídeo inverso.',
    activeHref: '/es/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' es una consola de sistema: una sola fuente monoespaciada sobre un fondo negro, paneles de línea fina con la cabecera separada por una raya, y cada etiqueta —un botón, la etiqueta de un campo, una pestaña, la cabecera de una columna— en mayúsculas, casi siempre en negrita. El cian es el acento: los encabezados grandes, los títulos de panel, el botón sólido y el foco. Lo seleccionado —una fila de tabla bajo el puntero, un segmento pulsado, una pestaña tipo píldora elegida, el número de la página actual, el elemento de menú bajo el puntero— se imprime en vídeo inverso, oscuro sobre cian, como una terminal resalta una fila. Las paletas de éxito, aviso y peligro son sus colores de estado, verde, amarillo y rojo, y un botón de contorno o un tag se dibujan en su color, línea y texto por igual. Nada es redondeado salvo un radio, y nada proyecta sombra. El modo oscuro es el aspecto original; el modo claro conserva cada línea, cada mayúscula y cada esquina recta y lo imprime en negro sobre casi blanco.',
      ),
      presetPreview('terminal'),

      h2('Cómo usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mi sitio'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-06767808.css">`, 'javascript'),
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
        ' sigue funcionando por encima, así que un preset es un punto de partida y no un fork: aquí el acento pasa a un ámbar de fósforo, también en las líneas con que se dibuja. Tres tokens son propios del preset: ',
        code('--su-tm-tracking'),
        ', el espaciado entre las mayúsculas de una etiqueta; ',
        code('--su-tm-track'),
        ', el carril por el que corre una barra de progreso o un deslizador; y ',
        code('--su-tm-field'),
        ', la línea que rodea un campo, que en modo oscuro es el mismo gris tenue de los paneles: súbela si quieres bordes de campo más marcados.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    {
      primary: {
        base: '#8a5200', hover: '#734400', active: '#5c3600',
        soft: '#f6e6cc', softHover: '#efd9b3', softFg: '#4d2e00',
        border: '#c9a066', ring: 'rgba(138, 82, 0, 0.3)',
      },
    },
    {
      dark: {
        primary: {
          base: '#ffb000', hover: '#ffd480', active: '#e69e00',
          soft: '#33260d', softHover: '#45330f', softFg: '#ffd480',
          border: '#d99600', ring: 'rgba(255, 176, 0, 0.4)',
        },
      },
    },
  ),
)`, 'javascript'),
    ],
  })
