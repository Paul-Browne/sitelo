import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Acordeón',
    description:
      'Secciones plegables con el propio <details> del navegador — incluido su modo exclusivo.',
    activeHref: '/es/ui/accordion',
    extraHead: uiHead(),
    children: [
      p(
        'Cada sección es un ',
        code('<details>'),
        '. Abrir, cerrar, el soporte de teclado y la búsqueda en la página vienen del navegador, y el acordeón funciona con JavaScript desactivado — algo que importa en unas preguntas frecuentes, que son su uso más común.',
      ),

      h2('Acordeón básico'),
      demo(`accordion({
  items: [
    { title: '¿Qué es sitelo?', content: 'Un generador de sitios estáticos sobre Vite. Las páginas son funciones que devuelven HTML.' },
    { title: '¿Incluye un runtime?', content: 'No. Nada llega al navegador salvo que enlaces un script tú mismo.' },
    { title: '¿Puedo usar TypeScript?', content: 'Sí — .ht.ts y .ht.tsx son extensiones de página como cualquier otra.' },
  ],
})`, { align: 'stretch' }),

      h2('Abierto por defecto'),
      demo(`accordion({
  items: [
    { title: 'Abierto al llegar', content: 'Esta tiene open: true.', open: true },
    { title: 'Cerrada', content: 'Esta no.' },
  ],
})`, { align: 'stretch' }),

      h2('Uno a la vez'),
      p(
        'Un ',
        code('name'),
        ' compartido hace las secciones mutuamente excluyentes: abrir una cierra las demás. Es el comportamiento propio del navegador para ',
        code('<details name>'),
        ', no un script.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'Primera', content: 'Abre otra y esta se cierra.', open: true },
    { title: 'Segunda', content: 'Y esta también.' },
    { title: 'Tercera', content: 'Solo hay una abierta a la vez.' },
  ],
})`, { align: 'stretch' }),

      h2('Contenido enriquecido'),
      p(
        'Construye las secciones con ',
        code('accordionItem()'),
        ' cuando el contenido sea más que un párrafo.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Instalar', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Añade el paquete y su compañero de marcado:'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Configurar' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Opcional. Las opciones de Vite van bajo la clave vite.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Desplegar' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Publica el directorio de salida en cualquier hosting estático.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Unas preguntas frecuentes'),
      p(
        'La forma para la que existe este componente: contenido que ya está en el HTML, plegado para poder ojearlo, y localizable por un buscador porque nunca salió de la página.',
      ),
      demo(`return (() => {
  const faq = [
    ['¿De verdad es sin configuración?', 'Un proyecto con un archivo en src/ y sin configuración compila. Todo lo demás es opcional.'],
    ['¿Cómo funcionan las rutas dinámicas?', 'Con corchetes en los nombres de archivo. generateStaticParams enumera qué construir.'],
    ['¿Y la búsqueda?', 'Pon pagefind: true y la compilación indexa todas las páginas.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('accordion()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Cadenas, u objetos { title, content, open }.'],
        ['name', 'string', '', 'Un name compartido hace las secciones mutuamente excluyentes.'],
      ]),
      p(code('accordionItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'La línea de resumen.'],
        ['open', 'boolean', 'false', 'Si empieza desplegada.'],
        ['name', 'string', '', 'El mismo efecto que en el padre, al construir los ítems a mano.'],
      ]),
    ],
  })
