/**
 * Code samples for the "Todo app" example.
 */
const T = {
  en: {
    shellComment: 'static shell + inline import() handlers',
    handlersComment: 'exported handlers (loaded on demand)',
    todos: 'Todos',
    whatNeedsDoing: 'What needs doing?',
    add: 'Add',
    nothingYet: 'Nothing here yet.',
    left: 'left',
    remove: 'Remove',
    markComplete: 'Mark',
    complete: 'complete',
    jsxOnloadNote: 'React maps onLoad → synthetic event; spread lets us output raw onload=""',
    jsxOnsubmitNote: "same reason — raw onsubmit=\"\" not React's onSubmit",
  },
  es: {
    shellComment: 'estructura estática + manejadores import() en línea',
    handlersComment: 'manejadores exportados (se cargan bajo demanda)',
    todos: 'Tareas',
    whatNeedsDoing: '¿Qué hay que hacer?',
    add: 'Añadir',
    nothingYet: 'Aquí no hay nada todavía.',
    left: 'pendientes',
    remove: 'Eliminar',
    markComplete: 'Marcar',
    complete: 'como completada',
    jsxOnloadNote: 'React convierte onLoad en un evento sintético; el spread nos deja emitir onload="" tal cual',
    jsxOnsubmitNote: 'por lo mismo — onsubmit="" tal cual, no el onSubmit de React',
  },
  fr: {
    shellComment: 'coquille statique + gestionnaires import() en ligne',
    handlersComment: 'gestionnaires exportés (chargés à la demande)',
    todos: 'Tâches',
    whatNeedsDoing: 'Qu’y a-t-il à faire ?',
    add: 'Ajouter',
    nothingYet: 'Rien ici pour l’instant.',
    left: 'restantes',
    remove: 'Supprimer',
    markComplete: 'Marquer',
    complete: 'comme terminée',
    jsxOnloadNote: 'React transforme onLoad en événement synthétique ; le spread permet de produire un onload="" brut',
    jsxOnsubmitNote: 'même raison — onsubmit="" brut, pas le onSubmit de React',
  },
  de: {
    shellComment: 'statische Hülle + inline import()-Handler',
    handlersComment: 'exportierte Handler (bei Bedarf geladen)',
    todos: 'Aufgaben',
    whatNeedsDoing: 'Was ist zu tun?',
    add: 'Hinzufügen',
    nothingYet: 'Hier ist noch nichts.',
    left: 'offen',
    remove: 'Entfernen',
    markComplete: 'Markiere',
    complete: 'als erledigt',
    jsxOnloadNote: 'React macht aus onLoad ein synthetisches Event; per Spread geben wir ein rohes onload="" aus',
    jsxOnsubmitNote: 'aus demselben Grund — rohes onsubmit="", nicht Reacts onSubmit',
  },
  ru: {
    shellComment: 'статическая оболочка + встроенные обработчики import()',
    handlersComment: 'экспортируемые обработчики (загружаются по требованию)',
    todos: 'Задачи',
    whatNeedsDoing: 'Что нужно сделать?',
    add: 'Добавить',
    nothingYet: 'Здесь пока ничего нет.',
    left: 'осталось',
    remove: 'Удалить',
    markComplete: 'Отметить',
    complete: 'как выполненную',
    jsxOnloadNote: 'React превращает onLoad в синтетическое событие; spread позволяет вывести сырой onload=""',
    jsxOnsubmitNote: 'по той же причине — сырой onsubmit="", а не onSubmit из React',
  },
  zh: {
    shellComment: '静态外壳 + 内联 import() 处理函数',
    handlersComment: '导出的处理函数（按需加载）',
    todos: '待办事项',
    whatNeedsDoing: '有什么要做的？',
    add: '添加',
    nothingYet: '这里还什么都没有。',
    left: '项未完成',
    remove: '删除',
    markComplete: '标记',
    complete: '为已完成',
    jsxOnloadNote: 'React 会把 onLoad 变成合成事件；用展开语法才能输出原生的 onload=""',
    jsxOnsubmitNote: '同理 —— 输出原生的 onsubmit=""，而不是 React 的 onSubmit',
  },
  pt: {
    shellComment: 'estrutura estática + handlers import() em linha',
    handlersComment: 'handlers exportados (carregados a pedido)',
    todos: 'Tarefas',
    whatNeedsDoing: 'O que há para fazer?',
    add: 'Adicionar',
    nothingYet: 'Ainda não há nada aqui.',
    left: 'por fazer',
    remove: 'Remover',
    markComplete: 'Marcar',
    complete: 'como concluída',
    jsxOnloadNote: 'o React converte onLoad num evento sintético; o spread deixa-nos emitir um onload="" em bruto',
    jsxOnsubmitNote: 'pela mesma razão — onsubmit="" em bruto, não o onSubmit do React',
  },
}

export function todoSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  return {
    structure: `my-todo/
  sitelo.config.js
  package.json
  src/
    index.ht.js          # ${t.shellComment}
    css/
      styles.css
    js/
      todo.js            # ${t.handlersComment}`,

    pageTemplate: `export default () => \`
  <html lang="${htmlLang}">
    <head>
      <title>${t.todos} — sitelo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body onload="import('/js/todo.js').then((m) => m.hydrate())">
      <main>
        <h1>${t.todos}</h1>
        <form
          id="todo-form"
          autocomplete="off"
          onsubmit="event.preventDefault(); import('/js/todo.js').then((m) => m.handleSubmit(this))"
        >
          <input id="todo-input" name="title" type="text" placeholder="${t.whatNeedsDoing}" required>
          <button type="submit">${t.add}</button>
        </form>
        <ul id="todo-list"></ul>
        <p id="todo-empty" class="empty" hidden>${t.nothingYet}</p>
        <p class="meta"><span id="todo-count">0</span> ${t.left}</p>
      </main>
    </body>
  </html>
\``,

    pageHt: `import {
  html, head, title, meta, link, body, main, h1, form, input, button, ul, p, span,
} from 'javascript-to-html'

export default () =>
  html({ lang: '${htmlLang}' },
    head(
      title('${t.todos} — sitelo'),
      meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      { onload: "import('/js/todo.js').then((m) => m.hydrate())" },
      main(
        h1('${t.todos}'),
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
            placeholder: '${t.whatNeedsDoing}',
            required: '',
          }),
          button({ type: 'submit' }, '${t.add}'),
        ),
        ul({ id: 'todo-list' }),
        p({ id: 'todo-empty', class: 'empty', hidden: '' }, '${t.nothingYet}'),
        p({ class: 'meta' }, span({ id: 'todo-count' }, '0'), ' ${t.left}'),
      ),
    ),
  )`,

    pageJsx: `export default function Todos() {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>${t.todos} — sitelo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body
        {...{
          // ${t.jsxOnloadNote}
          onload: "import('/js/todo.js').then((m) => m.hydrate())",
        }}
      >
        <main>
          <h1>${t.todos}</h1>
          <form
            id="todo-form"
            autoComplete="off"
            {...{
              // ${t.jsxOnsubmitNote}
              onsubmit:
                "event.preventDefault(); import('/js/todo.js').then((m) => m.handleSubmit(this))",
            }}
          >
            <input
              id="todo-input"
              name="title"
              type="text"
              placeholder="${t.whatNeedsDoing}"
              required
            />
            <button type="submit">${t.add}</button>
          </form>
          <ul id="todo-list" />
          <p id="todo-empty" className="empty" hidden>
            ${t.nothingYet}
          </p>
          <p className="meta">
            <span id="todo-count">0</span> ${t.left}
          </p>
        </main>
      </body>
    </html>
  )
}`,

    todoJs: `import { button, input, label, li, span } from 'javascript-to-html'

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
            'aria-label': \`${t.markComplete} "\${todo.title}" ${t.complete}\`,
          }),
          span({ class: 'todo-title' }, todo.title),
        ),
        button(
          {
            type: 'button',
            class: 'todo-remove',
            onclick: IMPORT_REMOVE,
            'aria-label': \`${t.remove} "\${todo.title}"\`,
          },
          '${t.remove}',
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
}`,

    run: `npm install
npm run dev`,
  }
}
