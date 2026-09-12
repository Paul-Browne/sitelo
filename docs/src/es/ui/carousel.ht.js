import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Carrusel',
    description:
      'Diapositivas por las que se desplaza, encajando al pasar — y puntos y flechas que la hoja de estilos le pide al navegador.',
    activeHref: '/es/ui/carousel',
    children: [
      p(
        'Aquí un carrusel es un contenedor de desplazamiento y una fila de diapositivas que encajan. Eso ya lo sabe hacer cualquier navegador: deslizar, el trackpad, shift-rueda y las teclas de flecha funcionan en el primer pintado, sin cargar nada y sin nada que hidratar.',
      ),
      p(
        'Los puntos y las flechas no son marcado. Son ',
        code('::scroll-marker'),
        ' en cada diapositiva y ',
        code('::scroll-button()'),
        ' en la pista — pseudoelementos que pide la hoja de estilos y que el navegador dibuja, nombra, conecta a la posición de desplazamiento y desactiva en los extremos. Este componente no lleva ningún atributo ',
        code('data-'),
        ' ni módulo que importar: el estado es el desplazamiento, y el navegador ya lo tiene.',
      ),

      h2('De una en una'),
      p(
        'Lo predeterminado. Cada diapositiva llena la pista, encaja al principio y se queda ahí, en lugar de salir volando tres diapositivas más allá.',
      ),
      demo(`carousel({
  items: ['Costa', 'Puerto', 'Campos', 'Casco antiguo'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('Varias a la vez'),
      p(
        code('perView'),
        ' es cuántas diapositivas llenan la pista, y ',
        code('min'),
        ' es un suelo para lo estrecha que puede quedarse una. Ese suelo sustituye a una media query: en cuanto la parte de pista que le toca a una diapositiva cae por debajo, las diapositivas se quedan así de anchas y caben menos — el mismo truco que juega ',
        code('grid()'),
        ' con auto-fit.',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['Rutas', 'Datos', 'Assets', 'Imágenes', 'Islands', 'Búsqueda'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, 'Guía'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('Un vistazo a la siguiente'),
      p(
        'Un ',
        code('perView'),
        ' fraccionario deja asomar una franja de la diapositiva siguiente, que es la forma más barata de decir «esto se desplaza» sin ningún control a la vista.',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['Una', 'Dos', 'Tres'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('Adaptable sin un breakpoint propio'),
      p(
        code('perView'),
        ' se escribe como propiedad personalizada, así que una media query puede cambiarlo sin tocar el marcado — y sin que el componente tenga que conocer tus breakpoints:',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('El encaje'),
      p(
        'El encaje es ',
        code('mandatory'),
        ' por defecto: el desplazamiento siempre acaba sobre una diapositiva. ',
        code("snap: 'proximity'"),
        ' solo tira de él cuando termina cerca de una, y ',
        code('snap: false'),
        ' deja la pista desplazándose libremente — que es lo que quiere una fila de cosas pequeñas, donde quedarse entre dos no molesta.',
      ),
      demo(`carousel({
  snap: false,
  perView: 4,
  min: '7rem',
  gap: 'sm',
  arrows: false,
  items: ['sitelo', 'vite', 'pagefind', 'sharp', 'lighthouse', 'rollup', 'esbuild'].map((name) =>
    chip({ size: 'lg', color: 'neutral', style: 'width: 100%; justify-content: center' }, name)),
})`, { align: 'stretch' }),

      h2('Dónde van los puntos y las flechas'),
      p(
        'Ambos son opcionales y ambos vienen activados. Quitar los puntos devuelve la barra de desplazamiento de la pista, porque un carrusel sin ninguna de las dos cosas sería un contenedor que se desplaza sin nada que lo diga.',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['Solo puntos', 'Segunda', 'Tercera'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['Solo flechas', 'Segunda', 'Tercera'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('Nombrar las diapositivas'),
      p(
        'Cada punto lleva el nombre de su diapositiva, porque un punto es un control y un control sin nombre es un botón al que un lector de pantalla solo puede llamar «botón». Por defecto el nombre es el número de la diapositiva. Pasa un elemento como objeto para nombrarlo mejor, o ',
        code('slideLabel'),
        ' para contarlas con tus propias palabras.',
      ),
      demo(`carousel({
  label: 'Fotos del producto',
  perView: 2,
  min: '10rem',
  items: [
    { label: 'La cocina', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Cocina'))) },
    { label: 'La terraza', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Terraza'))) },
    { label: 'El jardín', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Jardín'))) },
  ],
})`, { align: 'stretch' }),

      h2('Lo que esto no hace'),
      p(
        'No vuelve en bucle a la primera diapositiva y no avanza solo. Ninguna de las dos cosas la puede hacer CSS, así que ninguna está aquí — un carrusel en bucle o con reproducción automática necesita un script, y este componente preferiría no ser el motivo por el que una página carga uno. Avanzar solo es además una pérdida que conviene: mueve justo aquello que alguien está leyendo.',
      ),
      p(
        'Los controles necesitan un motor que haya publicado los pseudoelementos de carrusel de CSS. Donde no sea el caso, el bloque ',
        code('@supports'),
        ' se salta y el carrusel sigue siendo un contenedor que encaja y muestra su barra de desplazamiento — deslizar, trackpad y teclas intactos. No hay nada roto, solo más sobrio.',
      ),

      h2('Accesibilidad'),
      p(
        'La pista es un grupo con nombre y ',
        code('tabindex="0"'),
        ', así que un teclado llega a la región desplazable y la recorre con las flechas en cualquier motor, no solo en los que enfocan los contenedores por su cuenta. Ponle nombre con ',
        code('label'),
        ' cuando una página tenga más de uno.',
      ),
      p(
        'Donde el navegador los dibuja, los puntos se exponen como una lista de pestañas y las flechas como botones que se desactivan solos en cada extremo — todo eso lo construye el navegador, así que nada de ello puede desincronizarse de la diapositiva que de verdad se está viendo. Ese es el argumento a favor de esta forma frente a una con script: no hay una segunda copia del estado que pueda equivocarse.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Diapositivas. Un hijo, o { label, content } con cualquier otro atributo para la diapositiva. Los hijos también son diapositivas y van después de items.'],
        ['perView', 'number', '1', 'Cuántas diapositivas llenan la pista. Fraccionario deja asomar la siguiente.'],
        ['min', 'string', '', 'Suelo para el ancho de una diapositiva, para que una pantalla estrecha muestre menos en vez de más finas.'],
        ['gap', 'Space', "'md'", 'Entre diapositivas.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Dónde queda una diapositiva al detenerse.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'Con cuánta firmeza el desplazamiento se asienta en una diapositiva.'],
        ['dots', 'boolean', 'true', 'Puntos bajo la pista. Desactivarlos devuelve la barra de desplazamiento.'],
        ['arrows', 'boolean', 'true', 'Flechas sobre la pista.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Color del punto de la diapositiva que se ve.'],
        ['label', 'string', "'Carousel'", 'Nombre accesible de la región desplazable.'],
        ['previousLabel', 'string', "'Previous slide'", 'Nombre accesible de la flecha hacia atrás.'],
        ['nextLabel', 'string', "'Next slide'", 'Nombre accesible de la flecha hacia delante.'],
        ['slideLabel', '(index, count) => string', 'el número', 'Nombra una diapositiva que no se nombró a sí misma.'],
        ['as', 'string', "'div'", 'Elemento a renderizar.'],
      ]),
    ],
  })
