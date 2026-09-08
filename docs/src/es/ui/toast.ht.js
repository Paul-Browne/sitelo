import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'
import { preview, uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toast',
    description:
      'Un mensaje pasajero en la esquina, añadido desde script a una región que la página ya dibujó.',
    activeHref: '/es/ui/toast',
    extraHead: uiHead(),
    children: [
      p(
        'El toast es el único componente de aquí que no puede ser estático: aparece como respuesta a que ocurre algo. La página dibuja una región vacía con ',
        code('toasts()'),
        ', y ',
        code('toast()'),
        ' desde ',
        code('sitelo/ui/client'),
        ' le añade cosas.',
      ),
      p(
        'La región es una zona viva cortés, así que todo lo que se añade se anuncia sin robar el foco.',
      ),

      h2('Puesta en marcha'),
      p('Pon la región en cualquier parte del body: es de posición fija, así que dónde da igual:'),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …la página…
  toasts(),
)`, 'javascript'),
      p(
        'Esta es la única parte del runtime que nada de la página dispara por ti, así que es la única que importas tú:',
      ),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

document.querySelector('#save').addEventListener('click', () => {
  toast('Guardado.', { color: 'success' })
})`, 'javascript'),
      p('O llega a él como hacen los componentes, y sáltate el bundle del todo:'),
      codeBlock('En cualquier parte', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('Guardado.'))" }, 'Guardar')`, 'javascript'),

      h2('Pruébalo'),
      p(
        'Esta página dibuja una región ',
        code('toasts()'),
        ' y carga el runtime, así que los botones de abajo producen toasts de verdad — abajo a la derecha.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "window.siteloUiToast && window.siteloUiToast('Guardado.', 'success')",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "window.siteloUiToast && window.siteloUiToast('Dos páginas no tienen meta descripción.', 'warning')",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "window.siteloUiToast && window.siteloUiToast('La compilación falló. Mira el informe de enlaces.', 'danger')",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "window.siteloUiToast && window.siteloUiToast('Este se queda hasta que lo cierres.', 'neutral', 0)",
  }, 'Hasta que se cierre'),
)`),
      // La zona viva a la que añaden los botones de esta página. Es de
      // posición fija, así que se dibuja aquí pero aparece en la esquina
      // de la ventana.
      preview('toasts()'),

      h2('Opciones'),
      p(
        code('duration'),
        ' es cuánto se queda el toast, en milisegundos; ',
        code('0'),
        ' lo mantiene hasta que alguien lo cierre. Todos los toasts llevan botón de cerrar, conectado al mismo manejador de descarte que usa una alerta.',
      ),
      codeBlock('Opciones', `toast('Guardado.', { color: 'success' })
toast('Sigo trabajando…', { color: 'neutral', duration: 0 })
toast('Desplegado en 1,7 s', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('Qué dibuja'),
      p(
        'Un toast es una ',
        code('alert()'),
        ' dentro de la región de toasts: el mismo marcado, los mismos colores, el mismo botón de descarte. Nada nuevo que aprender, y nada extra que estilizar.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Guardado.'),
  alert({ color: 'danger', dismissible: true }, 'La compilación falló. Mira el informe de enlaces.'),
)`, { align: 'stretch' }),

      h2('Cuándo usar uno'),
      p(
        'Un toast sirve para confirmar algo que el lector acaba de hacer. Es el sitio equivocado para cualquier cosa sobre la que tenga que actuar o que deba leer con cuidado: desaparece, es fácil no verlo, y en un sitio estático la mayoría de los mensajes van en la propia página como una ',
        code('alert()'),
        '.',
      ),

      h2('Props'),
      p(code('toasts()'), ' no admite props propias. ', code('toast()'), ' desde ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['message', 'string', '', 'El texto. Se pone como textContent, así que nunca se interpreta como marcado.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Qué paleta usar.'],
        ['duration', 'number', '4000', 'Milisegundos antes de desaparecer. 0 lo mantiene.'],
      ], { headers: ['Argumento', 'Tipo', 'Por defecto', 'Descripción'] }),
      p(
        'Devuelve el elemento que añadió, o ',
        code('null'),
        ' cuando la página no tiene región ',
        code('toasts()'),
        '.',
      ),
    ],
  })
