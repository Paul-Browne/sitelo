import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Tooltip',
    description:
      'Una pista corta al pasar por encima y al recibir foco, dibujada enteramente con CSS.',
    activeHref: '/es/ui/tooltip',
    children: [
      p(
        'El texto del tooltip vive en un atributo de datos y lo dibuja un pseudoelemento, así que no hay script, no hay nada que posicionar en tiempo de ejecución y no queda nada en el DOM. Aparece al pasar por encima y al recibir foco de teclado, de lo que se ocupa la mitad ',
        code(':focus-within'),
        ' de la regla.',
      ),

      h2('Tooltip básico'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'Copiar al portapapeles' },
    iconButton({
      label: 'Copiar',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: 'Recompilar el sitio' },
    button({ variant: 'outline', color: 'neutral' }, 'Recompilar'),
  ),
)`),

      h2('Colocación'),
      p('Arriba por defecto, abajo cuando no hay sitio arriba.'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Encima del disparador' },
    button({ variant: 'soft', color: 'neutral' }, 'Arriba'),
  ),
  tooltip({ content: 'Debajo del disparador', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Abajo'),
  ),
)`),

      h2('Nombres accesibles'),
      p(
        'El texto del tooltip es decoración: se dibuja desde el ',
        code('content'),
        ' de CSS, que los lectores de pantalla no anuncian de forma fiable. El control de dentro sigue necesitando su propio nombre accesible, que es lo que da el ',
        code('label'),
        ' de ',
        code('iconButton()'),
        '. Cuando el tooltip diga algo que el nombre del control no dice, pasa ',
        code('label: true'),
        ' para repetirlo en un span oculto a la vista.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Despliega a producción de inmediato', label: true },
    button({ color: 'danger' }, 'Desplegar'),
  ),
)`),

      h2('Sobre texto'),
      p('Un tooltip envuelve contenido en línea con la misma facilidad con la que envuelve un botón.'),
      demo(`text(
  'La compilación escribe en ',
  tooltip({ content: 'Configurable con outDir' }, code('dist/')),
  ' y en ningún otro sitio.',
)`, { align: 'stretch' }),

      h2('Cuándo no usar uno'),
      p(
        'Los tooltips no aparecen al tocar la pantalla, y desaparecen en cuanto el puntero se va. Cualquier cosa que el lector deba tener sí o sí —un mensaje de error, la explicación de un campo obligatorio— va en el texto de ',
        code('help'),
        ' del propio campo, no en un tooltip.',
      ),

      h2('Props'),
      propsTable([
        ['content', 'string', '', 'El texto de la pista.'],
        ['placement', "'top' | 'bottom'", "'top'", 'A qué lado del disparador aparece.'],
        ['label', 'boolean', 'false', 'Exponer además el texto a los lectores de pantalla, en un span oculto.'],
      ]),
    ],
  })
