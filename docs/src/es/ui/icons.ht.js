import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

/** Una celda: el glifo a un tamaño legible, con el nombre que se escribe. */
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

/* Alfabético, directo desde la biblioteca, para que la página no pueda
 * quedarse atrás respecto del conjunto que documenta. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * Los glifos que se rellenan pintando su propio trazado, frente a los que
 * llevan un segundo dibujo — se distinguen por si ambas formas son el mismo
 * marcado, así que ninguna demo puede quedarse atrás respecto del conjunto.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * La demo del relleno, escrita en lugar de listada a mano: la fuente es lo que
 * la página imprime, así que un glifo que pase a ser rellenable aparece aquí
 * sin que nadie tenga que acordarse de añadirlo.
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
    title: 'Iconos',
    description:
      'Un conjunto de 99 glifos sobre una misma retícula, dibujados en línea para que un icono tome el color y el tamaño del texto que lo rodea.',
    activeHref: '/es/ui/icons',
    extraHead: uiHead(),
    children: [
      p(
        code('icon()'),
        ' devuelve un ',
        code('<svg>'),
        ' en línea. Todos los glifos están dibujados sobre la misma retícula de 24×24 como trazos sin relleno en ',
        code('currentColor'),
        ', así que heredan el color y el tamaño de letra de aquello donde estén y no necesitan estilos propios.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('En un componente'),
      p(
        'Un icono es un hijo como cualquier otro. Como se dimensiona en ',
        code('em'),
        ', encaja con la etiqueta que tiene al lado sin que haya que decirle cuánto mide esa etiqueta:',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), 'Descargar'),
  button({ variant: 'outline' }, icon('external-link'), 'Abrir'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Eliminar'),
  iconButton({ label: 'Buscar', variant: 'soft', icon: icon('search') }),
)`),

      h2('Tamaño'),
      p(
        'Por defecto es ',
        code('1em'),
        ', el tamaño del texto que lo rodea. ',
        code('size'),
        ' admite un token o cualquier longitud CSS cuando quieres apartarte de eso:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Color'),
      p(
        'No hay prop de color. Un icono se dibuja en ',
        code('currentColor'),
        ', así que toma el color de su contexto, que es lo que hace que un solo conjunto funcione dentro de cinco paletas:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Nombres accesibles'),
      p(
        'Un icono es ',
        code('aria-hidden'),
        ' por defecto, que es lo correcto muchísimo más a menudo que no: un icono junto a la palabra «Eliminar» no debería anunciarse por segunda vez. Dale un ',
        code('label'),
        ' solo cuando el icono cargue con todo el significado, y pasará a ser ',
        code('role="img"'),
        ' con ese nombre.',
      ),
      codeBlock('', `icon('trash')                        // decorativo — oculto
button(icon('trash'), 'Eliminar')    // la palabra es la que habla

icon('trash', { label: 'Eliminar' }) // se anuncia como imagen

// Un botón de solo icono etiqueta el botón, no el glifo de dentro
iconButton({ label: 'Eliminar', icon: icon('trash') })`, 'javascript'),

      h2('Relleno'),
      p(
        code('filled'),
        ' pinta un glifo en vez de perfilarlo. Es el mismo trazado en ambos casos — solo cambia el atributo ',
        code('fill'),
        ' —, así que las dos formas comparten borde exterior exactamente y no pueden separarse.',
      ),
      demo(fillDemo()),
      p('Y los mismos nombres, rellenos:'),
      demo(fillDemo({ filled: true })),
      p(
        'Es una prop y no un segundo conjunto de nombres porque el estado relleno casi siempre es un ',
        code('estado'),
        ' — guardado, con me gusta, valorado —, así que pide un booleano y no otra cadena:',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Guardado' : 'Guardar' })

// en vez de
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'Los glifos de estado se rellenan de otra manera, porque su marca queda ',
        code('dentro'),
        ' de la forma. Pintar el círculo se tragaría la marca de verificación, así que en su lugar se recorta:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'Esos llevan un segundo dibujo — la forma maciza con la marca recortada mediante ',
        code('fill-rule: evenodd'),
        ' —, porque un recorte no se consigue desde el trazado del perfil cambiando un atributo. La forma exterior se dibuja en el borde exterior del perfil, así que ambas versiones acaban con la misma silueta. Es la misma prop en cualquier caso; qué mecanismo usa cada glifo es asunto suyo.',
      ),
      p(
        'Un chevrón no tiene interior que pintar — es una línea abierta —, así que se rellena hasta el triángulo que describen sus tres puntos, conservando el trazo que redondea las esquinas:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' lista todo lo que responde a ',
        code('filled'),
        '. Un glifo sin forma rellena lo ignora y se queda perfilado: rellenar ',
        code('eye'),
        ' perdería la pupila y ',
        code('tag'),
        ' su agujero, así que ninguno finge lo contrario.',
      ),

      h2('Giro'),
      p(
        code('spin'),
        ' rota el glifo — pensado para ',
        code('spinner'),
        ', aunque nada te impide girar ',
        code('refresh'),
        ' mientras algo se recarga. Baja a paso de tortuga en vez de detenerse bajo ',
        code('prefers-reduced-motion'),
        ', porque un spinner detenido parece roto.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'Guardando…'),
)`),

      h2('El conjunto'),
      p(
        'Los nombres describen el dibujo y no el trabajo que hace — ',
        code('x-circle'),
        ', no ',
        code('error'),
        ' — porque el mismo dibujo se usa para trabajos que no tienen que ver entre sí, y un nombre que describe la imagen sigue siendo cierto cuando eso pasa. Los alias de abajo cubren las intenciones habituales.',
      ),
      gallery(),

      h2('Marcas'),
      p(
        'Con el conjunto vienen ocho marcas: ',
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
        ' e ',
        code('youtube'),
        '. Siguen admitiendo ',
        code('size'),
        ' y ',
        code('label'),
        ' y se siguen dibujando en ',
        code('currentColor'),
        ':',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Compartir'),
)`),
      p(
        'Son reproducciones de marcas ajenas y no dibujos al estilo de esta biblioteca, así que rompen dos de sus reglas a propósito: son formas macizas en vez de trazos, que es lo que es un logotipo, y sus proporciones son las de la marca y no las de esta retícula. ',
        code('filled'),
        ' no significa nada para ellas: ya lo están.',
      ),
      p(
        'El arte viene de Simple Icons, que lo publica bajo CC0. Eso cubre el dibujo, no la marca registrada: úsalos para señalar aquello que nombran —un enlace a un perfil, un botón de compartir— y no en un producto tuyo.',
      ),
      p(
        'Es ',
        code('x-twitter'),
        ' y no ',
        code('x'),
        ', porque ',
        code('x'),
        ' ya es alias de ',
        code('close'),
        ' y que un botón de cerrar se convirtiera en un logotipo sería una sorpresa desagradable. ',
        code('twitter'),
        ' también resuelve a él.',
      ),

      h2('Alias'),
      p('Cada uno de estos dibuja un glifo de los de arriba, bajo el nombre al que es más probable que recurras:'),
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

      h2('Tus propios iconos'),
      p(
        code('registerIcons()'),
        ' añade un glifo, o reemplaza uno de serie. El marcado es el contenido del ',
        code('<svg>'),
        ': formas sobre la misma retícula de 24×24, sin rellenar para que ',
        code('currentColor'),
        ' les llegue. Llámalo una vez desde un módulo que importen tus páginas:',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // Un nombre que ya existe lo reemplaza en todas partes, y así es como se
  // reestiliza uno de serie sin bifurcar la biblioteca.
  check: '<path d="m5 13 4 4 10-11"/>',
  // Una sola forma cerrada, para que pueda responder a \`filled\` como los de serie.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                   // tu glifo
icon('check')                  // ahora también tuyo

registerIcons({ check: null }) // y de vuelta al de serie`, 'javascript'),

      h2('Por qué en línea y no un sprite'),
      p(
        'Los iconos se dibujan dentro de la página en vez de sacarse de un ',
        code('icons.svg'),
        ' con ',
        code('<use>'),
        '. Un sprite ahorra del orden de cien bytes gzipeados de HTML por página y cuesta un viaje de ida y vuelta a cambio: el marcado repetido es justo el caso en el que mejor se porta gzip, así que casi todo lo que un sprite existe para deduplicar ya está deduplicado. En línea significa además que no hay archivo que emitir, ni ruta base que configurar, ni nada que pueda faltar en ',
        code('dist'),
        ' — el mismo trato que hace ',
        code('styles({ inline: true })'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Qué glifo. Se puede pasar como primer argumento en su lugar.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'Un token, o cualquier longitud CSS. Por defecto es 1em.'],
        ['label', 'string', '', 'Anunciarlo como imagen con este nombre, en vez de ocultarlo.'],
        ['spin', 'boolean', 'false', 'Rotarlo continuamente.'],
        ['filled', 'boolean', 'false', 'Pintar el glifo en vez de perfilarlo. Los glifos que no se pueden rellenar lo ignoran.'],
      ]),
      p(
        'Un nombre desconocido no dibuja nada en vez de lanzar un error: una prop cosmética no debería poder tumbar una compilación. ',
        code('hasIcon(name)'),
        ' te dice si existe alguno, ',
        code('iconNames()'),
        ' los lista todos, y ',
        code('fillableIcons()'),
        ' los que admiten ',
        code('filled'),
        '.',
      ),
    ],
  })
