import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

import { robotsTxtSource } from '../src/robots.js';
import { createFixture } from './helpers/fixture.js';

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(rootDir, 'bin', 'sitelo.js');

const GENERATED = 'User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n';
const OWN = 'User-agent: *\nDisallow: /drafts/\n';

/** A copy of the basic fixture, which sets `site`, changed by `setup`. */
function fixture(t, setup = () => {}) {
  const dir = createFixture('basic');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  setup(dir);
  return dir;
}

async function build(dir) {
  await execFileAsync(process.execPath, [cliPath, 'build', '--logLevel', 'error'], {
    cwd: dir,
    env: process.env,
  });

  const file = path.join(dir, 'dist', 'robots.txt');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

/** Start `sitelo dev` on a free port, stopped when the test ends. */
async function dev(t, dir) {
  const port = await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, () => {
      const { port: free } = server.address();
      server.close(() => resolve(free));
    });
  });

  const child = spawn(
    process.execPath,
    [cliPath, 'dev', '--port', String(port), '--strictPort', '--logLevel', 'error'],
    { cwd: dir, env: process.env, stdio: 'ignore' },
  );
  t.after(() => child.kill('SIGTERM'));

  const base = `http://localhost:${port}`;
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (await fetch(`${base}/`).then(() => true, () => false)) break;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  return base;
}

test('robotsTxtSource: allows everything and names the sitemap under site', () => {
  assert.equal(robotsTxtSource({ site: 'https://example.com', sitemap: true }), GENERATED);
  assert.equal(
    robotsTxtSource({ site: 'https://example.com/docs/', sitemap: true }),
    'User-agent: *\nAllow: /\n\nSitemap: https://example.com/docs/sitemap.xml\n',
  );
});

test('robotsTxtSource: no sitemap line without a site or a sitemap', () => {
  const allowAll = 'User-agent: *\nAllow: /\n';
  assert.equal(robotsTxtSource(), allowAll);
  assert.equal(robotsTxtSource({ sitemap: true }), allowAll);
  assert.equal(robotsTxtSource({ site: 'https://example.com', sitemap: false }), allowAll);
});

test('a build writes robots.txt pointing at its sitemap', async (t) => {
  const dir = fixture(t);
  assert.equal(await build(dir), GENERATED);
  assert.ok(fs.existsSync(path.join(dir, 'dist', 'sitemap.xml')));
});

test('a build without site writes robots.txt with no sitemap line', async (t) => {
  const dir = fixture(t, (d) => {
    fs.writeFileSync(path.join(d, 'sitelo.config.js'), 'export default {}\n');
  });
  assert.equal(await build(dir), 'User-agent: *\nAllow: /\n');
});

test('a robots.txt in public/ is shipped as written', async (t) => {
  const dir = fixture(t, (d) => {
    fs.mkdirSync(path.join(d, 'public'));
    fs.writeFileSync(path.join(d, 'public', 'robots.txt'), OWN);
  });
  assert.equal(await build(dir), OWN);
});

test('a robots.txt in the pages directory is shipped as written', async (t) => {
  const dir = fixture(t, (d) => {
    fs.writeFileSync(path.join(d, 'src', 'robots.txt'), OWN);
  });
  assert.equal(await build(dir), OWN);
});

test('robots: false writes no robots.txt', async (t) => {
  const dir = fixture(t, (d) => {
    fs.writeFileSync(
      path.join(d, 'sitelo.config.js'),
      "export default { site: 'https://example.com', robots: false }\n",
    );
  });
  assert.equal(await build(dir), null);
});

test('the dev server answers /robots.txt, ahead of a catch-all page', async (t) => {
  // html-pages routes `/robots.txt` as a page, so a catch-all would
  // otherwise render it, and without one its 404 page would answer.
  const dir = fixture(t, (d) => {
    fs.writeFileSync(
      path.join(d, 'src', '[...path].ht.js'),
      'export default () => `<html><body>catch-all</body></html>`\n',
    );
  });
  const base = await dev(t, dir);

  const res = await fetch(`${base}/robots.txt`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /^text\/plain/);
  assert.equal(await res.text(), GENERATED);
});

test('the dev server serves a robots.txt from the pages directory, as a build ships it', async (t) => {
  const dir = fixture(t, (d) => {
    fs.writeFileSync(path.join(d, 'src', 'robots.txt'), OWN);
  });
  const base = await dev(t, dir);

  const res = await fetch(`${base}/robots.txt`);
  assert.equal(res.status, 200);
  assert.equal(await res.text(), OWN);
});
