import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createSheet } from '../../src/ui/sheet.js';

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

/**
 * A sheet bound to a private copy of a CSS file, for the tests that edit
 * one to prove the read is not stale.
 *
 * `node --test` runs test *files* in parallel processes, so editing a
 * tracked source file races every other file that reads it. `ui.css` had
 * two editors — `ui.test.js` and `ui-runtime.test.js` — and `grain.css`
 * one, read concurrently by a second file. `writeFileSync` truncates
 * before it writes, so a reader in another process can see an empty
 * sheet: on a two-core runner that surfaced as eight failures in one
 * file, all of them `stylesheet()` returning `''`.
 *
 * The restore was the worse half. Both editors read the file, then wrote
 * that value back in a `finally`; read it mid-truncation and the
 * `finally` writes an empty `ui.css` into the working tree. CI is a
 * fresh checkout, so it only ever lost the run — a developer's checkout
 * would have lost the file.
 *
 * Each caller gets its own copy instead. `createSheet` is the same
 * factory `styles.js` and `grain.js` bind their own sheets with, so the
 * caching under test is the same code either way, and the cache is
 * this copy's own rather than the shared module-level one.
 *
 * @param {string} name sheet name, e.g. `'ui'`
 * @param {URL} source the CSS to copy
 */
export function editableSheet(name, source) {
  const original = fs.readFileSync(source, 'utf8');
  const dir = fs.mkdtempSync(path.join(ensureTmpRoot(), `${name}-sheet-`));
  const file = path.join(dir, `${name}.css`);

  fs.writeFileSync(file, original);

  process.on('exit', () => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  return {
    sheet: createSheet(name, pathToFileURL(file)),
    original,

    /**
     * Replace the copy's contents, as an edit to the real file would.
     *
     * The read is cached on the file's mtime, so the stamp has to move
     * too. Setting it is what the sleeps these tests used to carry were
     * waiting for — a second of wall clock each, and still a guess.
     *
     * @param {string} css
     */
    edit(css) {
      fs.writeFileSync(file, css);

      const later = new Date(fs.statSync(file).mtimeMs + 1000);

      fs.utimesSync(file, later, later);
    },
  };
}

function ensureTmpRoot() {
  const tmpRoot = path.join(rootDir, 'test', '.tmp');
  fs.mkdirSync(tmpRoot, { recursive: true });
  return tmpRoot;
}
