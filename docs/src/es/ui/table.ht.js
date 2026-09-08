import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tabla',
    description:
      'Filas y columnas a partir de datos, dentro de un contenedor con scroll que evita que una tabla ancha rompa la página.',
    activeHref: '/es/ui/table',
    extraHead: uiHead(),
    children: [
      p(
        'Pasa ',
        code('columns'),
        ' y ',
        code('rows'),
        ' y la tabla se construye sola, cabecera incluida. Va envuelta en un contenedor con scroll horizontal, así que una tabla con más columnas de las que cabe en un móvil se desplaza por su cuenta en vez de estirar la página. Se exporta como ',
        code('table'),
        ' y como ',
        code('dataTable'),
        '.',
      ),

      h2('Tabla básica'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Página' },
    { key: 'size', header: 'Tamaño' },
    { key: 'time', header: 'Tiempo de render' },
  ],
  rows: [
    { page: '/', size: '4,1 kB', time: '12 ms' },
    { page: '/docs', size: '12,7 kB', time: '31 ms' },
    { page: '/examples', size: '9,4 kB', time: '24 ms' },
  ],
})`, { align: 'stretch' }),

      h2('Alineación'),
      p('Los números se leen mejor alineados al final de su columna.'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Página' },
    { key: 'bytes', header: 'Bytes', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4.112', gzip: '1.204' },
    { page: '/docs', bytes: '12.704', gzip: '3.910' },
    { page: '/examples', bytes: '9.388', gzip: '2.744' },
  ],
})`, { align: 'stretch' }),

      h2('Celdas a medida'),
      p(
        'Una columna con función ',
        code('render'),
        ' recibe la fila entera y devuelve lo que deba ir en la celda: un chip, un enlace, un número formateado.',
      ),
      demo(`table({
  columns: [
    { header: 'Página', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Tamaño', align: 'end' },
    { header: 'Estado', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'fallo') },
  ],
  rows: [
    { page: '/docs/routing', href: '/es/docs/routing', size: '18,2 kB', ok: true },
    { page: '/docs/data', href: '/es/docs/data', size: '21,7 kB', ok: true },
    { page: '/docs/islands', href: '/es/docs/islands', size: '24,1 kB', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Estilos'),
      p(
        code('striped'),
        ' alterna bandas en las filas, ',
        code('hover'),
        ' resalta la fila bajo el puntero, y ',
        code('dense'),
        ' aprieta el relleno para una tabla con muchas filas.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'con bandas',
    columns: [{ key: 'name', header: 'Nombre' }, { key: 'value', header: 'Valor', align: 'end' }],
    rows: [{ name: 'páginas', value: '169' }, { name: 'recursos', value: '208' }, { name: 'total', value: '9,5 MB' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'con hover y densa',
    columns: [{ key: 'name', header: 'Nombre' }, { key: 'value', header: 'Valor', align: 'end' }],
    rows: [{ name: 'páginas', value: '169' }, { name: 'recursos', value: '208' }, { name: 'total', value: '9,5 MB' }],
  }),
)`, { align: 'stretch' }),

      h2('Título de tabla'),
      p(
        'Un caption nombra la tabla para quien llegue a ella sin el texto de alrededor: merece la pena siempre que la tabla no esté justo debajo de un encabezado que ya diga qué es.',
      ),
      demo(`table({
  caption: 'Salida de la compilación, la más reciente primero',
  columns: [
    { key: 'commit', header: 'Commit' },
    { key: 'when', header: 'Cuándo' },
    { key: 'pages', header: 'Páginas', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: 'hace 4 minutos', pages: '169' },
    { commit: 'dcfaaae', when: 'hace 2 horas', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('Desde datos'),
      p(
        'Las filas son un array normal, así que suelen ser lo que ',
        code('data()'),
        ' ya cargó, sin adaptador de por medio.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Hola mundo', date: '2026-01-14', reads: 1204 },
    { title: 'Primero lo estático', date: '2026-02-02', reads: 890 },
    { title: 'Sin runtime', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Entrada' },
      { key: 'date', header: 'Publicada' },
      { header: 'Lecturas', align: 'end', render: (post) => post.reads.toLocaleString('es') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Escribir el marcado tú'),
      p(
        'Omite ',
        code('columns'),
        ' y la tabla dibuja sus hijos en su lugar, así que una tabla con fila de pie o con cabeceras agrupadas se puede construir a mano y aun así recibir el estilo y el contenedor con scroll.',
      ),

      h2('Props'),
      propsTable([
        ['columns', 'TableColumn[]', '', '{ key, header, align, render } por columna. Omítelo para escribir las filas a mano.'],
        ['rows', 'object[]', '[]', 'Un objeto por fila.'],
        ['caption', 'Child', '', 'Un título sobre la tabla.'],
        ['striped', 'boolean', 'false', 'Alterna bandas en las filas.'],
        ['hover', 'boolean', 'false', 'Resalta la fila bajo el puntero.'],
        ['dense', 'boolean', 'false', 'Relleno de celda más ajustado.'],
      ]),
    ],
  })
