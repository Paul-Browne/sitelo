import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Grupo de radios',
    description:
      'Una opción entre varias, con inputs de radio de verdad que comparten nombre, más una leyenda y un rol de grupo.',
    activeHref: '/es/ui/radio',
    children: [
      p(
        'Los radios sirven para elegir exactamente una opción de un conjunto pequeño y visible. ',
        code('radio()'),
        ' dibuja uno; ',
        code('choiceGroup()'),
        ' construye el conjunto entero a partir de un array y le da la leyenda y el ',
        code('role="radiogroup"'),
        ' que lo convierten en un grupo y no en un montón de inputs.',
      ),
      p(
        'Comparten un ',
        code('name'),
        ', así que el navegador se ocupa de la exclusividad mutua y de moverse entre ellos con las flechas. Aquí no se envía ningún script.',
      ),

      h2('Grupo básico'),
      demo(`choiceGroup({
  legend: 'Plan',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Gratis' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Equipo' },
  ],
})`, { align: 'stretch' }),

      h2('En fila'),
      p(
        'Las etiquetas cortas se leen mejor en una sola línea. Las largas deberían quedarse apiladas, que es lo que hacen por defecto.',
      ),
      demo(`choiceGroup({
  legend: 'Formato',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('Cadenas simples'),
      p(
        'Cuando el valor y la etiqueta coinciden, pasa cadenas.',
      ),
      demo(`choiceGroup({
  legend: 'Nivel de registro',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Opciones deshabilitadas'),
      demo(`choiceGroup({
  legend: 'Renderizado',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Estático' },
    { value: 'islands', label: 'Islas de servidor' },
    { value: 'ssr', label: 'SSR completo', disabled: true },
  ],
  help: 'El SSR completo necesita un servidor Node, que este proyecto no tiene.',
})`, { align: 'stretch' }),

      h2('Uno a uno'),
      p(
        'Usa ',
        code('radio()'),
        ' directamente cuando las opciones no sean lo bastante uniformes como para venir de un array — por ejemplo, cuando cada una lleva su propia descripción.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'En cada push', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'Solo en versiones etiquetadas' }),
  radio({ name: 'deploy', value: 'manual', label: 'A mano' }),
)`, { align: 'stretch' }),

      h2('Colores'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('En una tarjeta'),
      demo(`card(
  cardHeader({ title: 'Ajustes de compilación', subtitle: 'Se aplican en el siguiente despliegue' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'URLs limpias',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'Sí' },
          { value: 'off', label: 'No' },
        ],
      }),
      choiceGroup({
        legend: 'Imágenes',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Redimensionar y convertir' },
          { value: 'copy', label: 'Copiar tal cual' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Guardar'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('choiceGroup()'), ':'),
      propsTable([
        ['legend', 'Child', '', 'Etiqueta del grupo entero.'],
        ['name', 'string', '', 'Nombre de formulario compartido: lo que hace exclusivos a los radios.'],
        ['options', 'Array', '[]', 'Cadenas, u objetos { value, label, disabled }.'],
        ['value', 'string | number | Array', '', 'Qué opción está marcada. Un array para casillas.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Qué control se construye. También elige el rol del grupo.'],
        ['direction', "'row' | 'column'", "'column'", 'Cómo se colocan las opciones.'],
        ['help', 'Child', '', 'Pista bajo el grupo.'],
      ]),
      p(code('radio()'), ' admite las mismas props que ', code('checkbox()'), ': ', code('label'), ', ', code('color'), ', ', code('checked'), ', ', code('name'), ', ', code('value'), ' y ', code('disabled'), '.'),
    ],
  })
