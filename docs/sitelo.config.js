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
    /*
     * Lighthouse screenshots the whole page for its report overlays, and
     * on documentation this long that is a quarter of the audit's runtime
     * — measured, with identical scores either way. Nothing here reads the
     * saved report, so it is pure cost.
     */
    flags: {
      disableFullPageScreenshot: true,
      /*
       * A backstop, not the mechanism. Lighthouse waits 45s by default
       * before giving up on a page; if anything ever stops settling on a
       * runner again, this bounds the damage to a third of that. The
       * three gated categories read the DOM and score the same either
       * way, measured.
       */
      maxWaitForLoad: 15_000,
      /*
       * The actual fix. Lighthouse holds a navigation open until the main
       * thread has been quiet for a second, and on a two-core runner that
       * moment never arrives — every page sat at the ceiling and reported
       * "loaded too slowly", while its network log showed 14 requests, all
       * under 25ms, none unfinished. So it was never waiting on the site.
       *
       * Dropping that one condition halves the wait here (2.36s -> 1.07s)
       * with every score identical; the load event and the network-quiet
       * wait, which are what the DOM actually depends on, both stay.
       */
      cpuQuietThresholdMs: 0,
    },
    exclude: ['{de,es,fr,pt,ru,zh}.html', '{de,es,fr,pt,ru,zh}/**', '404.html'],
    /*
     * No `performance` threshold, deliberately.
     *
     * These three are *checked* — an alt attribute, a meta description, a
     * lang — so they score the same on any machine, which is what makes
     * them worth gating at all. Performance is *measured*, and the machine
     * is part of the measurement: pages scoring 100 here come back around
     * 60 on a hosted runner (two shared cores, no GPU, software
     * rendering). That gap is the runner, not the site, so gating on it
     * would only ever block a deploy for the wrong reason. It still
     * prints on every run — read it as a trend.
     *
     * 90 admits one lower-weight failure: a page with no meta description
     * scores seo 91 and passes here, while a missing alt (a11y 80) is
     * still caught. Every page scores 100 today, so there is room to
     * tighten this to 100 whenever it feels worth the noise.
     */
    thresholds: {
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    },
  },
}