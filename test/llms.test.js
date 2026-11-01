import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

import { markdownPath, normalizeLlmsOptions } from '../src/llms.js';
import { pageInfo } from '../src/markdown.js';
import { createFixture } from './helpers/fixture.js';

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(rootDir, 'bin', 'sitelo.js');

/** A copy of the llms fixture, changed by `setup`, built, removed after. */
async function build(t, setup = () => {}) {
  const dir = createFixture('llms');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  setup(dir);

  await execFileAsync(process.execPath, [cliPath, 'build', '--logLevel', 'error'], {
    cwd: dir,
    env: process.env,
  });

  const dist = path.join(dir, 'dist');
  const read = (file) => {
    const full = path.join(dist, file);
    return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
  };
  const markdown = fs
    .readdirSync(dist, { recursive: true })
    .map((file) => String(file).split(path.sep).join('/'))
    .filter((file) => file.endsWith('.md'))
    .sort();

  return { read, markdown };
}

const config = (options) => (dir) =>
  fs.writeFileSync(
    path.join(dir, 'sitelo.config.js'),
    `export default { site: 'https://example.com', llms: ${JSON.stringify(options)} }\n`,
  );

test('normalizeLlmsOptions: off, on, and an object with defaults', () => {
  assert.equal(normalizeLlmsOptions(undefined), null);
  assert.equal(normalizeLlmsOptions(false), null);
  assert.deepEqual(normalizeLlmsOptions(true), { exclude: [], full: true });
  assert.deepEqual(normalizeLlmsOptions({ exclude: 'drafts/**' }), { exclude: ['drafts/**'], full: true });
  assert.deepEqual(normalizeLlmsOptions({ full: false }), { exclude: [], full: false });
});

test('normalizeLlmsOptions: rejects what it cannot use', () => {
  assert.throws(() => normalizeLlmsOptions('yes'), /"llms" must be true or an object/);
  assert.throws(() => normalizeLlmsOptions([]), /"llms" must be true or an object/);
  assert.throws(() => normalizeLlmsOptions({ exclude: [1] }), /"llms\.exclude" must be/);
  assert.throws(() => normalizeLlmsOptions({ full: 'no' }), /"llms\.full" must be a boolean/);
});

test('markdownPath: beside the page, named for its URL', () => {
  assert.equal(markdownPath('/'), '/index.md');
  assert.equal(markdownPath('/about/'), '/about.md');
  assert.equal(markdownPath('/blog/hello/'), '/blog/hello.md');
  assert.equal(markdownPath('/docs/routing'), '/docs/routing.md');
});

test('pageInfo: title, description and noindex, whatever the attribute order', () => {
  assert.deepEqual(
    pageInfo(
      '<html><head><title> A  page </title>' +
        '<meta content="Says\n  <b>this</b>" name="description">' +
        '<meta content="noindex, nofollow" name="robots"></head><body></body></html>',
    ),
    { title: 'A page', description: 'Says <b>this</b>', noindex: true },
  );
  assert.deepEqual(pageInfo('<p>no head</p>'), { noindex: false });
});

test('a build writes llms.txt, a Markdown copy of each page and llms-full.txt', async (t) => {
  const { read, markdown } = await build(t);

  assert.deepEqual(
    markdown,
    ['about.md', 'blog.md', 'blog/hello.md', 'blog/tables.md', 'index.md'],
    'every page but the 404 and the noindex one',
  );

  assert.equal(
    read('llms.txt'),
    [
      '# Example',
      '',
      '> Notes on <b>tags</b> & building small sites.',
      '',
      '## Pages',
      '',
      '- [Welcome](https://example.com/index.md): Notes on <b>tags</b> & building small sites.',
      '- [About](https://example.com/about.md): Who writes this.',
      '',
      '## Blog',
      '',
      '- [Blog](https://example.com/blog.md): Every post.',
      '- [Hello](https://example.com/blog/hello.md): The first post.',
      '- [Tables](https://example.com/blog/tables.md): A post with a table and some code.',
      '',
      '## Optional',
      '',
      '- [Everything in one file](https://example.com/llms-full.txt): every page listed here, as Markdown, in this order',
      '',
    ].join('\n'),
  );

  assert.equal(
    read('blog/tables.md'),
    [
      '# Tables',
      '',
      '> A post with a table and some code.',
      '',
      // Resolved against the page, not the copy, which sits a level up.
      'Back to [the blog](https://example.com/blog/).',
      '',
      '```js',
      'const answer = 42',
      '```',
      '',
      '| Name | Value |',
      '| --- | --- |',
      '| a | 1 |',
      '',
    ].join('\n'),
  );

  assert.equal(
    read('about.md'),
    '# About\n\n> Who writes this.\n\nWritten by one person.\n',
    'a page without <main> loses its header and footer',
  );

  const full = read('llms-full.txt');
  assert.ok(full.startsWith('# Example\n\n> Notes on <b>tags</b> & building small sites.\n\n'));
  assert.deepEqual(
    [...full.matchAll(/^URL: (.+)$/gm)].map(([, url]) => url),
    [
      'https://example.com/',
      'https://example.com/about/',
      'https://example.com/blog/',
      'https://example.com/blog/hello/',
      'https://example.com/blog/tables/',
    ],
  );
});

test('a site’s own llms.txt is the intro, its own files stand, and exclude and full apply', async (t) => {
  const intro = '# Example notes\n\n> Hand-written summary.\n\nRead the blog first.\n';
  const { read, markdown } = await build(t, (dir) => {
    config({ exclude: 'blog/hello/**', full: false })(dir);
    fs.mkdirSync(path.join(dir, 'public'));
    fs.writeFileSync(path.join(dir, 'public', 'llms.txt'), intro);
    fs.writeFileSync(path.join(dir, 'public', 'about.md'), 'my own about\n');
  });

  const llms = read('llms.txt');
  assert.ok(llms.startsWith(`${intro}\n## Pages\n`), 'the intro, then the generated list');
  assert.doesNotMatch(llms, /hello/, 'excluded');
  assert.doesNotMatch(llms, /## Optional/, 'no llms-full.txt to point at');

  assert.equal(read('llms-full.txt'), null);
  assert.equal(read('about.md'), 'my own about\n');
  assert.ok(!markdown.includes('blog/hello.md'));
});

test('llms without site fails the build and says why', async (t) => {
  await assert.rejects(
    build(t, (dir) => fs.writeFileSync(path.join(dir, 'sitelo.config.js'), 'export default { llms: true }\n')),
    (error) => {
      assert.match(error.stderr, /\[sitelo\] "llms" needs "site"/);
      return true;
    },
  );
});
