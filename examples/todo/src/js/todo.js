import { button, input, label, li, span } from 'javascript-to-html'

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
            'aria-label': `Mark "${todo.title}" complete`,
          }),
          span({ class: 'todo-title' }, todo.title),
        ),
        button(
          {
            type: 'button',
            class: 'todo-remove',
            onclick: IMPORT_REMOVE,
            'aria-label': `Remove "${todo.title}"`,
          },
          'Remove',
        ),
      ),
    )
    .join('')

  // Set checked as a DOM property so it reflects current state
  for (const cb of list.querySelectorAll('input[type="checkbox"]')) {
    const item = cb.closest('[data-id]')
    const todo = todos.find((t) => t.id === item?.dataset.id)
    if (todo) cb.checked = todo.done
  }

  count.textContent = String(todos.filter((t) => !t.done).length)
  empty.hidden = todos.length > 0
}

/** Load todos from localStorage into the list (called from body onload). */
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
