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
  /*
   * English pages only. Every translation is the same template with
   * different copy, so their scores track the English ones — and seven
   * locales is seven times the browser time for the same findings.
   *
   * Each locale's home page is flat (`de.html`) and the rest of it lives
   * under a directory (`de/docs/cli.html`), so both shapes are excluded.
   */
  lighthouse: {
    formFactor: 'desktop',
    exclude: ['{de,es,fr,pt,ru,zh}.html', '{de,es,fr,pt,ru,zh}/**'],
  },
}
