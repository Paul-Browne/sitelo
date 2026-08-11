import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'

const structureSnippet = `my-todo/
  sitelo.config.js
  package.json
  src/
    index.ht.js          # static shell + inline import() handlers
    css/
      styles.css
    js/
      todo.js            # exported handlers (loaded on demand)`

const pageTemplate = `export default () => \`
  <html lang="en">
    <head>
      <title>Todos — sitelo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body onload="import('/js/todo.js').then((m) => m.hydrate())">
      <main>
        <h1>Todos</h1>
        <form
          id="todo-form"
          autocomplete="off"
          onsubmit="event.preventDefault(); import('/js/todo.js').then((m) => m.handleSubmit(this))"
        >
          <input id="todo-input" name="title" type="text" placeholder="What needs doing?" required>
          <button type="submit">Add</button>
        </form>
        <ul id="todo-list"></ul>
        <p id="todo-empty" class="empty" hidden>Nothing here yet.</p>
        <p class="meta"><span id="todo-count">0</span> left</p>
      </main>
    </body>
  </html>
\``

const pageHt = `import {
  html, head, title, meta, link, body, main, h1, form, input, button, ul, p, span,
} from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(
      title('Todos — sitelo'),
      meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      { onload: "import('/js/todo.js').then((m) => m.hydrate())" },
      main(
        h1('Todos'),
        form(
          {
            id: 'todo-form',
            autocomplete: 'off',
            onsubmit:
              "event.preventDefault(); import('/js/todo.js').then((m) => m.handleSubmit(this))",
          },
          input({
            id: 'todo-input',
            name: 'title',
            type: 'text',
            placeholder: 'What needs doing?',
            required: '',
          }),
          button({ type: 'submit' }, 'Add'),
        ),
        ul({ id: 'todo-list' }),
        p({ id: 'todo-empty', class: 'empty', hidden: '' }, 'Nothing here yet.'),
        p({ class: 'meta' }, span({ id: 'todo-count' }, '0'), ' left'),
      ),
    ),
  )`

const pageJsx = `export default function Todos() {
  return (
    <html lang="en">
      <head>
        <title>Todos — sitelo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body
        {...{
          // React maps onLoad → synthetic event; spread lets us output raw onload=""
          onload: "import('/js/todo.js').then((m) => m.hydrate())",
        }}
      >
        <main>
          <h1>Todos</h1>
          <form
            id="todo-form"
            autoComplete="off"
            {...{
              // same reason — raw onsubmit="" not React's onSubmit
              onsubmit:
                "event.preventDefault(); import('/js/todo.js').then((m) => m.handleSubmit(this))",
            }}
          >
            <input
              id="todo-input"
              name="title"
              type="text"
              placeholder="What needs doing?"
              required
            />
            <button type="submit">Add</button>
          </form>
          <ul id="todo-list" />
          <p id="todo-empty" className="empty" hidden>
            Nothing here yet.
          </p>
          <p className="meta">
            <span id="todo-count">0</span> left
          </p>
        </main>
      </body>
    </html>
  )
}`

const todoJsSnippet = `import { button, input, label, li, span } from 'javascript-to-html'

const STORAGE_KEY = 'sitelo-todo-example'

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function createId() {
  return \`\${Date.now().toString(36)}-\${Math.random().toString(36).slice(2, 8)}\`
}

const IMPORT_CHANGE = "import('/js/todo.js').then((m) => m.handleChange(this))"
const IMPORT_REMOVE = "import('/js/todo.js').then((m) => m.handleRemove(this))"

function render() {
  const list = document.querySelector('#todo-list')
  const empty = document.querySelector('#todo-empty')
  const count = document.querySelector('#todo-count')
  if (!list || !empty || !count) return

  const todos = loadTodos()

  list.innerHTML = todos
    .map((todo) =>
      li(
        {
          class: todo.done ? 'todo is-done' : 'todo',
          'data-id': todo.id,
        },
        label(
          input({
            type: 'checkbox',
            onchange: IMPORT_CHANGE,
            'aria-label': \`Mark "\${todo.title}" complete\`,
          }),
          span({ class: 'todo-title' }, todo.title),
        ),
        button(
          {
            type: 'button',
            class: 'todo-remove',
            onclick: IMPORT_REMOVE,
            'aria-label': \`Remove "\${todo.title}"\`,
          },
          'Remove',
        ),
      ),
    )
    .join('')

  for (const cb of list.querySelectorAll('input[type="checkbox"]')) {
    const item = cb.closest('[data-id]')
    const todo = todos.find((t) => t.id === item?.dataset.id)
    if (todo) cb.checked = todo.done
  }

  count.textContent = String(todos.filter((t) => !t.done).length)
  empty.hidden = todos.length > 0
}

export function hydrate() {
  render()
}

export function handleSubmit(form) {
  const input = form.elements.namedItem('title')
  if (!(input instanceof HTMLInputElement)) return

  const title = input.value.trim()
  if (!title) return

  saveTodos([{ id: createId(), title, done: false }, ...loadTodos()])
  input.value = ''
  input.focus()
  render()
}

export function handleChange(checkbox) {
  const item = checkbox.closest('[data-id]')
  if (!(item instanceof HTMLElement) || !item.dataset.id) return

  saveTodos(
    loadTodos().map((todo) =>
      todo.id === item.dataset.id ? { ...todo, done: checkbox.checked } : todo,
    ),
  )
  render()
}

export function handleRemove(button) {
  const item = button.closest('[data-id]')
  if (!(item instanceof HTMLElement) || !item.dataset.id) return

  saveTodos(loadTodos().filter((todo) => todo.id !== item.dataset.id))
  render()
}`

export default () =>
  examplesLayout({
    title: 'Todo app',
    description:
      'Static HTML with inline dynamic imports — handlers load /js/todo.js on demand.',
    activeHref: '/examples/todo',
    children: [
      p(
        'A classic interactive UI without a frontend framework. sitelo builds the page shell; event attributes call ',
        code("import('/js/todo.js').then(…)"),
        ' so the module loads only when needed. Full source in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('What you get'),
      ul(
        { class: 'docs-list' },
        li('Static HTML with ', code('onsubmit'), ' / ', code('onload'), ' (and list item) handlers'),
        li(
          code('src/js/todo.js'),
          ' — exported ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ', ',
          code('handleRemove'),
        ),
        li(
          'sitelo discovers literal ',
          code('import(\'/…\')'),
          ' in the HTML and bundles the file into ',
          code('dist/'),
          ' (see ',
          a({ href: '/docs/assets' }, 'Assets'),
          ')',
        ),
      ),
      h2('Project layout'),
      codeBlock('project', structureSnippet, 'bash'),
      h2('1. Inline imports in the page'),
      p(
        'No ',
        code('<script type="module" src>'),
        '. Handlers are HTML attributes that dynamically import the module and call an export, passing ',
        code('this'),
        ' (the element). That keeps page modules free of browser APIs (see ',
        a({ href: '/docs/pages#jsx-limitations' }, 'JSX limitations'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: pageTemplate,
        ht: pageHt,
        jsx: pageJsx,
      }),
      h2('2. Exported handlers'),
      p(
        'The module is a normal ES file under ',
        code('src/js/'),
        '. List items created at runtime use the same ',
        code('import(\'/js/todo.js\').then(…)'),
        ' pattern for ',
        code('onchange'),
        ' / ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', todoJsSnippet, 'javascript'),
      h2('3. Run'),
      codeBlock(
        'shell',
        `npm install
npm run dev`,
        'bash',
      ),
      p(
        'Or ',
        code('npm run build'),
        ' and host ',
        code('dist/'),
        ' anywhere static files are served.',
      ),
      p(
        a({ href: '/docs/assets' }, 'Assets & styling'),
        ' · ',
        a({ href: '/docs/pages#jsx-limitations' }, 'JSX limitations'),
        ' · ',
        a({ href: '/examples/basic' }, 'Basic site'),
      ),
    ],
  })
