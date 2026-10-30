// Pagefind writes its UI into /pagefind/ during `sitelo build`, so load it
// at runtime rather than linking it from the page.
const style = document.createElement('link')
style.rel = 'stylesheet'
style.href = '/pagefind/pagefind-ui.css'
document.head.appendChild(style)

await new Promise((resolve, reject) => {
  const script = document.createElement('script')
  script.src = '/pagefind/pagefind-ui.js'
  script.onload = resolve
  script.onerror = reject
  document.body.appendChild(script)
})

new PagefindUI({ element: '#search', showSubResults: true, autofocus: true })
