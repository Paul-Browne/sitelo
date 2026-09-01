export default {
  site: 'https://sitelo.dev',
  pagefind: true,
  /*
   * Flat `docs.html` rather than `docs/index.html`. GitHub Pages serves
   * `/docs` from `docs.html` directly; with the directory form it 301s
   * `/docs` → `/docs/`, which contradicts the `/docs` canonical every page
   * already emits. `src/404.ht.js` catches the trailing-slash form.
   */
  cleanUrls: false,
}
