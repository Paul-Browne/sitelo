const STORAGE_KEY = 'sitelo-todo-example'

/** @typedef {{ id: string, title: string, done: boolean }} Todo */

/** @returns {Todo[]} */
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

/** @param {Todo[]} todos */
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const IMPORT_CHANGE =
  "import('/js/todo.js').then((m) => m.handleChange(this))"
const IMPORT_REMOVE =
  "import('/js/todo.js').then((m) => m.handleRemove(this))"

function els() {
  return {
    list: document.querySelector('#todo-list'),
    empty: document.querySelector('#todo-empty'),
    count: document.querySelector('#todo-count'),
  }
}

function render() {
  const { list, empty, count } = els()
  if (!list || !empty || !count) return

  const todos = loadTodos()
  list.replaceChildren()

  for (const todo of todos) {
    const li = document.createElement('li')
    li.className = todo.done ? 'todo is-done' : 'todo'
    li.dataset.id = todo.id

    const label = document.createElement('label')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = todo.done
    checkbox.setAttribute('onchange', IMPORT_CHANGE)
    checkbox.setAttribute('aria-label', `Mark “${todo.title}” complete`)

    const title = document.createElement('span')
    title.className = 'todo-title'
    title.textContent = todo.title

    label.append(checkbox, title)

    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'todo-remove'
    remove.textContent = 'Remove'
    remove.setAttribute('onclick', IMPORT_REMOVE)
    remove.setAttribute('aria-label', `Remove “${todo.title}”`)

    li.append(label, remove)
    list.append(li)
  }

  count.textContent = String(todos.filter((t) => !t.done).length)
  empty.hidden = todos.length > 0
}

/** Load todos from localStorage into the list (call from body onload). */
export function hydrate() {
  render()
}

/** @param {HTMLFormElement} form */
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

/** @param {HTMLInputElement} checkbox */
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

/** @param {HTMLButtonElement} button */
export function handleRemove(button) {
  const item = button.closest('[data-id]')
  if (!(item instanceof HTMLElement) || !item.dataset.id) return

  saveTodos(loadTodos().filter((todo) => todo.id !== item.dataset.id))
  render()
}
