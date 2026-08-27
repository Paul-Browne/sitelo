import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  collectBuildStats,
  formatBuildReport,
  formatBytes,
  formatDuration,
  normalizeBuildReportOptions,
} from '../src/report.js';

function makeOutDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitelo-report-'));

  for (const [relative, size] of Object.entries(files)) {
    const full = path.join(dir, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, Buffer.alloc(size, 'x'));
  }

  return dir;
}

test('normalizeBuildReportOptions: defaults, disabling, and overrides', () => {
  assert.deepEqual(normalizeBuildReportOptions(undefined), { top: 5 });
  assert.deepEqual(normalizeBuildReportOptions(true), { top: 5 });
  assert.equal(normalizeBuildReportOptions(false), null);
  assert.deepEqual(normalizeBuildReportOptions({ top: 2 }), { top: 2 });
  assert.deepEqual(normalizeBuildReportOptions({ top: 0 }), { top: 0 });
});

test('normalizeBuildReportOptions: rejects invalid values', () => {
  assert.throws(() => normalizeBuildReportOptions([]), /must be a boolean/);
  assert.throws(() => normalizeBuildReportOptions('yes'), /must be a boolean/);
  assert.throws(
    () => normalizeBuildReportOptions({ top: -1 }),
    /non-negative integer/,
  );
  assert.throws(
    () => normalizeBuildReportOptions({ top: 1.5 }),
    /non-negative integer/,
  );
});

test('formatBytes matches Vite base-1000 units', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(999), '999 B');
  assert.equal(formatBytes(1000), '1.0 kB');
  assert.equal(formatBytes(753_600), '753.6 kB');
  assert.equal(formatBytes(1_000_000), '1.00 MB');
  assert.equal(formatBytes(2_310_000), '2.31 MB');
});

test('formatDuration switches units at one second', () => {
  assert.equal(formatDuration(0), '0ms');
  assert.equal(formatDuration(268.4), '268ms');
  assert.equal(formatDuration(999), '999ms');
  assert.equal(formatDuration(1000), '1.00s');
  assert.equal(formatDuration(1432), '1.43s');
});

test('collectBuildStats groups files and totals them', async (t) => {
  const dir = makeOutDir({
    'index.html': 100,
    'about/index.html': 200,
    'main.js': 300,
    'styles.css': 50,
    'img/hero.webp': 5000,
    'fonts/body.woff2': 400,
    'sitemap.xml': 25,
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const stats = await collectBuildStats({ root: dir, outDir: '.' });

  assert.equal(stats.files, 7);
  assert.equal(stats.bytes, 100 + 200 + 300 + 50 + 5000 + 400 + 25);

  const byKey = Object.fromEntries(stats.groups.map((g) => [g.key, g]));

  assert.deepEqual(
    { files: byKey.pages.files, bytes: byKey.pages.bytes },
    { files: 2, bytes: 300 },
  );
  assert.equal(byKey.js.files, 1);
  assert.equal(byKey.css.files, 1);
  assert.equal(byKey.images.bytes, 5000);
  assert.equal(byKey.fonts.bytes, 400);
  // sitemap.xml is not one of the named groups
  assert.equal(byKey.other.files, 1);
});

test('collectBuildStats sorts largest files first, with relative paths', async (t) => {
  const dir = makeOutDir({
    'small.css': 10,
    'img/huge.png': 9000,
    'medium.js': 500,
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const stats = await collectBuildStats({ root: dir, outDir: '.' });

  assert.deepEqual(
    stats.largest.map((f) => f.path),
    [path.join('img', 'huge.png'), 'medium.js', 'small.css'],
  );
  assert.equal(stats.largest[0].bytes, 9000);
});

test('collectBuildStats returns null for a missing or empty outDir', async (t) => {
  const dir = makeOutDir({});
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.equal(await collectBuildStats({ root: dir, outDir: 'nope' }), null);
  assert.equal(await collectBuildStats({ root: dir, outDir: '.' }), null);
});

test('formatBuildReport renders groups, largest, and timings', async (t) => {
  const dir = makeOutDir({
    'index.html': 100,
    'img/hero.png': 9000,
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const stats = await collectBuildStats({ root: dir, outDir: '.' });
  const output = formatBuildReport(
    stats,
    { vite: 161, images: 35, total: 260 },
    { top: 5 },
  ).join('\n');

  assert.match(output, /pages\s+1 file\s+100 B/);
  assert.match(output, /images\s+1 file\s+9\.0 kB/);
  assert.match(output, /total\s+2 files\s+9\.1 kB/);
  assert.match(output, /largest/);
  assert.match(output, /hero\.png/);
  assert.match(output, /vite 161ms · images 35ms · total 260ms/);
});

test('formatBuildReport honours top and omits an empty largest list', async (t) => {
  const dir = makeOutDir({ 'a.js': 30, 'b.js': 20, 'c.js': 10 });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const stats = await collectBuildStats({ root: dir, outDir: '.' });

  const topOne = formatBuildReport(stats, {}, { top: 1 }).join('\n');
  assert.match(topOne, /a\.js/);
  assert.doesNotMatch(topOne, /b\.js/);

  const none = formatBuildReport(stats, {}, { top: 0 }).join('\n');
  assert.doesNotMatch(none, /largest/);
});
