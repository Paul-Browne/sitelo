import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Campo de texto',
    description:
      'Entradas de texto de una o varias líneas, con la etiqueta, el texto de ayuda, el mensaje de error y los ids ya conectados por ti.',
    activeHref: '/es/ui/text-field',
    children: [
      p(
        'Aquí hay dos capas. ',
        code('input()'),
        ' y ',
        code('textarea()'),
        ' son los controles pelados; ',
        code('textField()'),
        ' y ',
        code('textareaField()'),
        ' envuelven uno en etiqueta, texto de ayuda y mensaje de error, y los conectan con ',
        code('for'),
        ' y ',
        code('aria-describedby'),
        '. Tira de los segundos salvo que estés construyendo la maquetación tú.',
      ),

      h2('Campo básico'),
      demo(`textField({ label: 'Nombre', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Texto de ayuda'),
      p(
        'El texto de ayuda se enlaza con ',
        code('aria-describedby'),
        ', así que un lector de pantalla lo lee como parte del campo y no como texto suelto detrás.',
      ),
      demo(`textField({
  label: 'Correo',
  name: 'email',
  type: 'email',
  help: 'Solo lo usamos para avisarte de compilaciones fallidas.',
})`, { align: 'stretch' }),

      h2('Obligatorio y con error'),
      p(
        'Un ',
        code('error'),
        ' marca el campo como inválido, colorea el borde, pone ',
        code('aria-invalid'),
        ' y apunta ',
        code('aria-describedby'),
        ' al mensaje: una prop, las cuatro cosas.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Proyecto', name: 'project', required: true, value: '' }),
  textField({
    label: 'Sitio',
    name: 'site',
    error: 'Eso no es una URL.',
    value: 'sitelo punto dev',
  }),
)`, { align: 'stretch' }),

      h2('Tamaños'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Pequeño', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Mediano', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Grande', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Adornos'),
      p(
        'Un prefijo o un sufijo pegados al propio control, para unidades y trozos fijos de un valor.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Sitio', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Tiempo límite de compilación', name: 'timeout', endAdornment: 'segundos', value: '30' }),
)`, { align: 'stretch' }),

      h2('Deshabilitado y de solo lectura'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Deshabilitado', name: 'disabled', value: 'No se puede editar', disabled: true }),
  textField({ label: 'Solo lectura', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Multilínea'),
      p(
        code('textareaField()'),
        ' es el mismo campo alrededor de un ',
        code('<textarea>'),
        '. Su valor es contenido del elemento y no un atributo, cosa de la que se encarga el componente.',
      ),
      demo(`textareaField({
  label: 'Descripción',
  name: 'description',
  rows: 4,
  help: 'Se muestra en los resultados de búsqueda y en las tarjetas sociales.',
  value: 'Generación de sitios estáticos sin configuración, sobre Vite.',
})`, { align: 'stretch' }),

      h2('En un formulario'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Nombre', name: 'contact-name', required: true }),
      textField({ label: 'Correo', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'Mensaje', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Cancelar'),
    button({ type: 'submit' }, 'Enviar'),
  ),
)`, { align: 'stretch' }),

      h2('Construirlo tú'),
      p(
        code('field()'),
        ' es el envoltorio por su cuenta: admite cualquier control como hijo, así que puedes poner dos inputs en una fila, o un control que esta biblioteca no tiene, con el mismo tratamiento de etiqueta y error.',
      ),
      p(
        'Una etiqueta no puede nombrar a dos controles, así que aquí cada input necesita su propio nombre accesible. Eso es lo que hacen los ',
        code('aria-label'),
        ': la etiqueta visible nombra la pareja, y cada input dice qué extremo es.',
      ),
      demo(`field({ label: 'Rango de fechas', help: 'Ambos extremos se incluyen.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'Desde' }),
    input({ type: 'date', name: 'to', 'aria-label': 'Hasta' }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      h3('textField y textareaField'),
      propsTable([
        ['label', 'Child', '', 'La etiqueta del campo. También deriva el id del control cuando no hay name.'],
        ['name', 'string', '', 'Nombre del campo; el id se deriva de él.'],
        ['help', 'Child', '', 'Pista bajo el control, enlazada con aria-describedby.'],
        ['error', 'Child | false', '', 'Mensaje de error. También pone aria-invalid en el control.'],
        ['required', 'boolean', 'false', 'Marca la etiqueta y el control.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Altura del control y tamaño del texto.'],
        ['type', 'string', "'text'", 'Cualquier tipo de input. Solo en textField.'],
        ['startAdornment', 'Child', '', 'Prefijo pegado al control. Solo en textField.'],
        ['endAdornment', 'Child', '', 'Sufijo pegado al control. Solo en textField.'],
        ['value', 'string | number', '', 'Valor inicial.'],
        ['fieldClass', 'string', '', 'Clase para el envoltorio, no para el control.'],
      ]),
      p(
        'Los ids se derivan de ',
        code('name'),
        ' — o de ',
        code('label'),
        ' cuando no hay name — y no de un contador, así que la misma página genera el mismo HTML en cada compilación. Pasa ',
        code('id'),
        ' para imponer otro.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'El texto de la etiqueta.'],
        ['help', 'Child', '', 'Pista bajo el control.'],
        ['error', 'Child | false', '', 'Mensaje de error; también añade el estado inválido al envoltorio.'],
        ['required', 'boolean', 'false', 'Añade la marca de obligatorio a la etiqueta.'],
        ['for', 'string', '', 'Id del control al que etiqueta.'],
      ]),
    ],
  })
