import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

/**
 * Copy a fixture into a private working directory for the calling test file.
 *
 * `node --test` runs test *files* in parallel processes, so any two files
 * sharing a fixture directory race each other — one file's `rm -rf dist`
 * lands mid-build in another's. Each file gets its own copy instead.
 *
 * The copy lives under `test/.tmp/` (inside the repo, so `node_modules`
 * resolution still walks up to the root) and is removed on process exit.
 *
 * @param {string} name fixture directory name under `test/fixtures/`
 * @returns {string} absolute path to the working copy
 */
export function createFixture(name) {
  const source = path.join(rootDir, 'test', 'fixtures', name);

  if (!fs.existsSync(source)) {
    throw new Error(`fixture "${name}" does not exist at ${source}`);
  }

  const workingDir = fs.mkdtempSync(
    path.join(ensureTmpRoot(), `${name}-`),
  );

  // Skip build output a previous local run may have left behind.
  const ignored = new Set(['dist', 'public', '.sitelo', 'node_modules']);

  fs.cpSync(source, workingDir, {
    recursive: true,
    filter: (from) => !ignored.has(path.basename(from)),
  });

  process.on('exit', () => {
    fs.rmSync(workingDir, { recursive: true, force: true });
  });

  return workingDir;
}

function ensureTmpRoot() {
  const tmpRoot = path.join(rootDir, 'test', '.tmp');
  fs.mkdirSync(tmpRoot, { recursive: true });
  return tmpRoot;
}
