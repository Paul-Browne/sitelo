import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(rootDir, 'bin', 'sitelo.js');
const fixtureDir = path.join(rootDir, 'test', 'fixtures', 'basic');
const distDir = path.join(fixtureDir, 'dist');

async function runBuild(cwd) {
  await execFileAsync(process.execPath, [cliPath, 'build'], {
    cwd,
    env: process.env,
  });
}

test('sitelo build renders pages and generated extras', async (t) => {
  const cleanup = () => {
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
    fs.rmSync(path.join(fixtureDir, '.vite-plugin-html-pages'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  await runBuild(fixtureDir);

  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const notFoundHtml = fs.readFileSync(path.join(distDir, '404.html'), 'utf8');
  const sitemapXml = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');

  assert.match(indexHtml, /Hello from sitelo fixture/);
  assert.match(indexHtml, /<!DOCTYPE html>/i);
  assert.match(notFoundHtml, /404/);
  assert.match(sitemapXml, /<loc>https:\/\/example\.com\/<\/loc>/);

  assert.ok(
    fs.existsSync(path.join(fixtureDir, '.sitelo', 'types')),
    'expected generated types under .sitelo/types',
  );
  assert.equal(
    fs.existsSync(path.join(fixtureDir, '.vite-plugin-html-pages')),
    false,
    'sitelo consumers should not get .vite-plugin-html-pages/',
  );
});

test('sitelo errors when sitelo.config.js and vite.config both register the plugin', async () => {
  const viteConfigPath = path.join(fixtureDir, 'vite.config.mjs');

  fs.writeFileSync(
    viteConfigPath,
    `import { defineConfig } from 'vite'
import htmlPages from ${JSON.stringify(path.join(rootDir, 'src/index.js'))}

export default defineConfig({
  plugins: [htmlPages()],
})
`,
  );

  try {
    await assert.rejects(
      () => runBuild(fixtureDir),
      /Found both sitelo\.config\.js/,
    );
  } finally {
    fs.rmSync(viteConfigPath, { force: true });
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  }
});
