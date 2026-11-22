/**
 * Code samples for the Enhancements page.
 */
const T = {
  en: {
    addOne: 'Add one',
    readFromMarkup: 'Read what the markup already says.',
    listByHand: 'Every module, listed by hand.',
    propsComment: 'minLength comes from the page; the element is the form.',
    loadWithPage: 'Load as soon as the page does — the default.',
    waitIdle: 'Wait for an idle callback.',
    waitVisible: 'Wait until it scrolls into view.',
    startEarly: 'start loading 400px early',
  },
  es: {
    addOne: 'Sumar uno',
    readFromMarkup: 'Lee lo que el marcado ya dice.',
    listByHand: 'Cada módulo, escrito a mano.',
    propsComment: 'minLength viene de la página; el elemento es el formulario.',
    loadWithPage: 'Carga en cuanto lo hace la página — el valor por defecto.',
    waitIdle: 'Espera a un callback de inactividad.',
    waitVisible: 'Espera a que entre en pantalla.',
    startEarly: 'empieza a cargar 400px antes',
  },
  fr: {
    addOne: 'Ajouter un',
    readFromMarkup: 'Lire ce que le balisage dit déjà.',
    listByHand: 'Chaque module, listé à la main.',
    propsComment: 'minLength vient de la page ; l’élément est le formulaire.',
    loadWithPage: 'Charge dès que la page charge — le comportement par défaut.',
    waitIdle: 'Attend un callback d’inactivité.',
    waitVisible: 'Attend que l’élément entre dans le viewport.',
    startEarly: 'commence à charger 400px en avance',
  },
  de: {
    addOne: 'Eins dazu',
    readFromMarkup: 'Lesen, was das Markup schon sagt.',
    listByHand: 'Jedes Modul, von Hand aufgelistet.',
    propsComment: 'minLength kommt von der Seite; das Element ist das Formular.',
    loadWithPage: 'Lädt, sobald die Seite lädt — der Standard.',
    waitIdle: 'Wartet auf einen Idle-Callback.',
    waitVisible: 'Wartet, bis das Element sichtbar wird.',
    startEarly: 'beginnt 400px früher zu laden',
  },
  ru: {
    addOne: 'Добавить',
    readFromMarkup: 'Читаем то, что уже есть в разметке.',
    listByHand: 'Каждый модуль перечислен вручную.',
    propsComment: 'minLength приходит со страницы; элемент — это форма.',
    loadWithPage: 'Загружается сразу вместе со страницей — по умолчанию.',
    waitIdle: 'Ждёт момента простоя.',
    waitVisible: 'Ждёт появления в области просмотра.',
    startEarly: 'начать загрузку на 400px раньше',
  },
  zh: {
    addOne: '加一',
    readFromMarkup: '读取标记里已经写好的内容。',
    listByHand: '每个模块都手写列出。',
    propsComment: 'minLength 来自页面；元素就是这个表单。',
    loadWithPage: '页面一加载就取——默认行为。',
    waitIdle: '等待空闲回调。',
    waitVisible: '等到滚动进入视口。',
    startEarly: '提前 400px 开始加载',
  },
  pt: {
    addOne: 'Somar um',
    readFromMarkup: 'Lê o que a marcação já diz.',
    listByHand: 'Cada módulo, listado à mão.',
    propsComment: 'minLength vem da página; o elemento é o formulário.',
    loadWithPage: 'Carrega assim que a página carrega — o valor por omissão.',
    waitIdle: 'Espera por um callback de inatividade.',
    waitVisible: 'Espera até entrar no ecrã.',
    startEarly: 'começa a carregar 400px antes',
  },
  it: {
    addOne: 'Aggiungi uno',
    readFromMarkup: 'Legge ciò che il markup dice già.',
    listByHand: 'Ogni modulo, elencato a mano.',
    propsComment: 'minLength arriva dalla pagina; l’elemento è il form.',
    loadWithPage: 'Carica appena lo fa la pagina — il comportamento predefinito.',
    waitIdle: 'Aspetta una callback di inattività.',
    waitVisible: 'Aspetta che entri nella vista.',
    startEarly: 'inizia a caricare 400px prima',
  },
  pl: {
    addOne: 'Dodaj jeden',
    readFromMarkup: 'Odczytaj to, co już jest w znacznikach.',
    listByHand: 'Każdy moduł wypisany ręcznie.',
    propsComment: 'minLength pochodzi ze strony; elementem jest formularz.',
    loadWithPage: 'Ładuj razem ze stroną — domyślnie.',
    waitIdle: 'Poczekaj na wywołanie w bezczynności.',
    waitVisible: 'Poczekaj, aż wejdzie w pole widzenia.',
    startEarly: 'zacznij ładować 400px wcześniej',
  },
  tr: {
    addOne: 'Bir ekle',
    readFromMarkup: 'İşaretlemenin zaten söylediğini oku.',
    listByHand: 'Her modül elle listelenir.',
    propsComment: 'minLength sayfadan gelir; öğe formun kendisidir.',
    loadWithPage: 'Sayfa yüklenir yüklenmez yükle — varsayılan.',
    waitIdle: 'Boşta kalma geri çağrısını bekle.',
    waitVisible: 'Görünüme girene dek bekle.',
    startEarly: '400px erken yüklemeye başla',
  },
  id: {
    addOne: 'Tambah satu',
    readFromMarkup: 'Baca apa yang sudah ada di markup.',
    listByHand: 'Setiap modul ditulis tangan.',
    propsComment: 'minLength datang dari halaman; elemennya adalah form.',
    loadWithPage: 'Muat begitu halaman dimuat — bawaannya.',
    waitIdle: 'Tunggu callback saat menganggur.',
    waitVisible: 'Tunggu sampai tergulir ke tampilan.',
    startEarly: 'mulai memuat 400px lebih awal',
  },
}

export function enhanceSnippets(lang = 'en') {
  const t = T[lang] ?? T.en

  return {
    counterModule: `// ${t.readFromMarkup}
export default (element) => {
  const output = element.querySelector('output')
  let count = Number(output.value)

  element.querySelector('button').addEventListener('click', () => {
    output.value = String(++count)
  })
}`,

    pageTemplate: `import { enhance } from 'sitelo/enhance'

export default () => \`
  <html>
    <body>
      \${enhance('counter', {}, '<button type="button">${t.addOne}</button> <output>0</output>')}
      <script type="module" src="/enhance.js"></script>
    </body>
  </html>
\``,

    pageHt: `import { html, body, button, fragment, output, script } from 'javascript-to-html'
import { enhance } from 'sitelo/enhance'

export default () =>
  html(
    body(
      enhance(
        'counter',
        {},
        fragment(button({ type: 'button' }, '${t.addOne}'), ' ', output('0')),
      ),
      script({ type: 'module', src: '/enhance.js' }),
    ),
  )`,

    pageJsx: `import { enhanceAttributes } from 'sitelo/enhance'

export default function Home() {
  return (
    <html>
      <body>
        <div {...enhanceAttributes('counter')}>
          <button type="button">${t.addOne}</button> <output>0</output>
        </div>
        <script type="module" src="/enhance.js" />
      </body>
    </html>
  )
}`,

    registry: `import { mountEnhancements } from 'sitelo/enhance/client'

// ${t.listByHand}
mountEnhancements({
  counter: () => import('./client/counter.js'),
  search: () => import('./client/search.js'),
})`,

    formTemplate: `import { enhanceAttributes } from 'sitelo/enhance'

export default () => \`
  <html>
    <body>
      <form action="/search" \${enhanceAttributes('search', { minLength: 2 })}>
        <input name="q" type="search">
      </form>
      <script type="module" src="/enhance.js"></script>
    </body>
  </html>
\``,

    formHt: `import { html, body, form, input, script } from 'javascript-to-html'
import { enhanceAttributes } from 'sitelo/enhance'

export default () =>
  html(
    body(
      form(
        { action: '/search' },
        enhanceAttributes('search', { minLength: 2 }),
        input({ name: 'q', type: 'search' }),
      ),
      script({ type: 'module', src: '/enhance.js' }),
    ),
  )`,

    formJsx: `import { enhanceAttributes } from 'sitelo/enhance'

export default function Search() {
  return (
    <html>
      <body>
        <form action="/search" {...enhanceAttributes('search', { minLength: 2 })}>
          <input name="q" type="search" />
        </form>
        <script type="module" src="/enhance.js" />
      </body>
    </html>
  )
}`,

    searchModule: `// ${t.propsComment}
export default (form, { minLength }) => {
  const input = form.querySelector('input')

  form.addEventListener('submit', (event) => {
    if (input.value.trim().length < minLength) event.preventDefault()
  })
}`,

    strategy: `// ${t.loadWithPage}
enhance('counter', {}, '…')

// ${t.waitIdle}
enhance('share', {}, '…', { when: 'idle' })

// ${t.waitVisible}
enhance('chart', {}, '…', {
  when: 'visible',
  rootMargin: '400px',   // ${t.startEarly}
})`,

    buildError: `index.html uses enhancement "countr", which no mountEnhancements() call
registers. Did you mean "counter"? Registered: counter, search.`,

    stateCss: `[data-sitelo-enhance-state="ready"] .no-js-hint { display: none; }`,
  }
}
