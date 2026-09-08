import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Insignia',
    description:
      'Un recuento o un punto prendido en la esquina de lo que envuelve.',
    activeHref: '/es/ui/badge',
    extraHead: uiHead(),
    children: [
      p(
        'Una insignia envuelve algo y le prende un marcador en la esquina superior: mensajes sin leer en un botón de bandeja de entrada, un punto de «en línea» en un avatar. Recibe como hijos aquello que marca.',
      ),

      h2('Insignia básica'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Bandeja de entrada')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Colores'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Máximo'),
      p(
        'Un recuento por encima de ',
        code('max'),
        ' se dibuja como ',
        code('n+'),
        ', así una insignia nunca crece tanto como para desequilibrar aquello sobre lo que se apoya.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Nueve')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, 'Tope en 99')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Punto'),
      p(
        'Un punto dice «algo ha cambiado» sin decir cuánto. Dale un ',
        code('label'),
        ': un punto pelado no significa nada para un lector de pantalla, así que sin él queda oculto por completo del árbol de accesibilidad.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'En línea' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'Requiere atención' },
    iconButton({
      label: 'Ajustes',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('Etiquetar el recuento'),
      p(
        'Un número a secas es ambiguo fuera de contexto. ',
        code('label'),
        ' pasa a ser el nombre accesible de la insignia, así que se lee como «4 mensajes sin leer» y no como «4».',
      ),
      demo(`badge({ content: 4, label: '4 mensajes sin leer' },
  button({ variant: 'soft', color: 'neutral' }, 'Bandeja de entrada'),
)`),

      h2('Props'),
      propsTable([
        ['content', 'string | number', '', 'Lo que muestra la insignia. Se ignora si dot está puesto.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Color de la insignia.'],
        ['dot', 'boolean', 'false', 'Un punto pequeño en lugar de un valor.'],
        ['max', 'number', '99', 'Los recuentos por encima de esto se dibujan como n+.'],
        ['label', 'string', '', 'Nombre accesible de la propia insignia.'],
      ]),
    ],
  })
