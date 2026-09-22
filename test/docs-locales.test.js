/**
 * Locale parity for the docs site.
 *
 * The docs ship in seven languages: English at the root, the rest under a
 * prefix (`docs/src/de/docs/cli.ht.js` → `/de/docs/cli`). Three things have
 * to agree for that to hold together — the page files on disk, the
 * `TRANSLATED_PATHS` registry the language switcher reads, and the chrome
 * strings in `docs/src/lib/i18n.js` — and nothing but this file checks that
 * they do.
 *
 * Both halves of the disagreement are silent. Register a path without
 * translating it and the switcher links a 404; translate one without
 * registering it and the translations build but nothing links them. Neither
 * fails the build, and with 73 paths across seven locales neither is
 * something you notice by reading.
 *
 * This lives in the library's suite because `npm test` is what CI runs on
 * every push; the docs workflow only builds and audits.
 */
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_FLAGS,
  LOCALE_NAMES,
  LOCALE_TAGS,
  OG_LOCALES,
  TRANSLATED_PATHS,
  isTranslated,
  localePath,
  strings,
} from '../docs/src/lib/i18n.js';

const SRC = fileURLToPath(new URL('../docs/src/', import.meta.url));
const PREFIXED = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

/**
 * Pages that exist in every locale but are deliberately not switchable.
 *
 * `/404` is served by the host for a URL that matched nothing, so there is no
 * "this page in another language" to offer — the alternates would describe a
 * page the reader never asked for.
 */
const UNSWITCHABLE = new Set(['/404']);

/**
 * Pages that exist in English only, deliberately.
 *
 * `ui-extras` documents components that ship outside the default UI bundle;
 * it is a footnote to `/ui`, not part of the guided read, and translating it
 * would cost the same as a docs page for a fraction of the audience.
 */
const ENGLISH_ONLY = new Set(['/ui-extras', '/ui-extras/grain']);

/**
 * Every page under `dir`, as the root-relative path it builds to.
 *
 * `index.ht.js` names its directory (`docs/index.ht.js` → `/docs`); every
 * other file names itself (`docs/cli.ht.js` → `/docs/cli`).
 */
function pagesUnder(dir, skipTopLevel = new Set()) {
  const found = new Set();

  const walk = (absolute, prefix) => {
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (prefix === '' && skipTopLevel.has(entry.name)) continue;
        walk(path.join(absolute, entry.name), `${prefix}/${entry.name}`);
      } else if (entry.name.endsWith('.ht.js')) {
        const base = entry.name.slice(0, -'.ht.js'.length);
        found.add(base === 'index' ? prefix || '/' : `${prefix}/${base}`);
      }
    }
  };

  walk(dir, '');
  return found;
}

/**
 * Does a page file back this root-relative path?
 *
 * Both shapes resolve, because the docs use both: `/about` comes from
 * `about.ht.js` and `/docs` from `docs/index.ht.js`.
 */
function hasPage(urlPath) {
  const relative = urlPath === '/' ? 'index' : urlPath.slice(1);

  return (
    existsSync(path.join(SRC, `${relative}.ht.js`)) ||
    existsSync(path.join(SRC, relative, 'index.ht.js'))
  );
}

const list = (paths) => [...paths].sort().map((p) => `  ${p}`).join('\n');

test('every translated path has a page in every locale', () => {
  const missing = [];

  for (const locale of LOCALES) {
    for (const translated of TRANSLATED_PATHS) {
      const urlPath = localePath(translated, locale);
      if (!hasPage(urlPath)) missing.push(urlPath);
    }
  }

  assert.deepEqual(
    missing.sort(),
    [],
    'TRANSLATED_PATHS promises these pages exist and the language switcher ' +
      `links them, but no file builds them:\n${list(missing)}`,
  );
});

test('every English page is translated or listed as an exception', () => {
  const unclassified = [...pagesUnder(SRC, new Set(LOCALES))].filter(
    (page) =>
      !isTranslated(page) &&
      !UNSWITCHABLE.has(page) &&
      !ENGLISH_ONLY.has(page),
  );

  assert.deepEqual(
    unclassified.sort(),
    [],
    'These English pages are in neither camp. Translate each one into every ' +
      'locale and add it to TRANSLATED_PATHS in docs/src/lib/i18n.js, or add ' +
      `it to ENGLISH_ONLY in this file:\n${list(unclassified)}`,
  );
});

test('no locale carries a page the switcher cannot reach', () => {
  const stray = [];

  for (const locale of PREFIXED) {
    const dir = path.join(SRC, locale);

    assert.ok(
      existsSync(dir),
      `LOCALES lists "${locale}" but docs/src/${locale}/ does not exist`,
    );

    for (const page of pagesUnder(dir)) {
      if (isTranslated(page) || UNSWITCHABLE.has(page)) continue;
      stray.push(localePath(page, locale));
    }
  }

  assert.deepEqual(
    stray.sort(),
    [],
    'These translations build but nothing links them, because their English ' +
      'path is not in TRANSLATED_PATHS in docs/src/lib/i18n.js:\n' +
      list(stray),
  );
});

test('the locale registries cover exactly LOCALES', () => {
  const expected = [...LOCALES].sort();

  for (const [name, registry] of Object.entries({
    LOCALE_NAMES,
    LOCALE_TAGS,
    LOCALE_FLAGS,
    OG_LOCALES,
  })) {
    assert.deepEqual(
      Object.keys(registry).sort(),
      expected,
      `${name} in docs/src/lib/i18n.js does not have one entry per locale`,
    );
  }
});

test('every locale has a complete set of chrome strings', () => {
  const english = strings(DEFAULT_LOCALE);
  const expected = Object.keys(english).sort();

  for (const locale of PREFIXED) {
    const localized = strings(locale);

    /*
     * `strings()` hands back the English object for a locale it has never
     * heard of, so identity is what catches a missing entry — comparing key
     * sets would compare English against itself and pass.
     */
    assert.notEqual(
      localized,
      english,
      `STRINGS in docs/src/lib/i18n.js has no entry for "${locale}", so its ` +
        'pages render English chrome',
    );

    assert.deepEqual(
      Object.keys(localized).sort(),
      expected,
      `STRINGS."${locale}" does not have the same keys as English; a missing ` +
        'one renders as `undefined` rather than falling back',
    );

    for (const key of expected) {
      assert.equal(
        typeof localized[key],
        typeof english[key],
        `STRINGS."${locale}".${key} is a ${typeof localized[key]} where ` +
          `English has a ${typeof english[key]}`,
      );
    }
  }
});
