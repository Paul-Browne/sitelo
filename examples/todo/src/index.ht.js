export default () => `
  <html lang="en">
    <head>
      <title>Todos — sitelo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="A tiny todo app: static HTML from sitelo, interactivity via inline dynamic imports.">
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body onload="import('/js/todo.js').then((m) => m.hydrate())">
      <main>
        <h1>Todos</h1>
        <p class="lede">Static HTML from sitelo. Handlers load <code>/js/todo.js</code> on demand — saved to <code>localStorage</code>.</p>
        <form
          id="todo-form"
          autocomplete="off"
          onsubmit="event.preventDefault(); import('/js/todo.js').then((m) => m.handleSubmit(this))"
        >
          <label class="sr-only" for="todo-input">New todo</label>
          <input id="todo-input" name="title" type="text" placeholder="What needs doing?" required maxlength="200">
          <button type="submit">Add</button>
        </form>
        <ul id="todo-list" aria-live="polite"></ul>
        <p id="todo-empty" class="empty" hidden>Nothing here yet. Add a todo above.</p>
        <p class="meta"><span id="todo-count">0</span> left</p>
      </main>
    </body>
  </html>
`
