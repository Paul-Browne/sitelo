import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import { island, isValidIslandName } from '../src/islands.js';
import {
  createIslandsFromDirectory,
  createIslandsHandler,
  createIslandsNodeHandler,
  parseIslandProps,
  renderIsland,
} from '../src/islands-server.js';

const fixtureDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures',
  'basic',
);
test('island() emits a placeholder with escaped props', () => {
  const html = island(
    'comments',
    { postId: 'a<b"c', count: 2 },
    '<p>Loading…</p>',
  );

  assert.match(html, /^<div data-sitelo-island="comments"/);
  assert.match(html, /data-sitelo-props="/);
  assert.ok(html.includes('<p>Loading…</p>'));
  // Raw quote/angle from props must not appear unescaped in the attribute.
  assert.ok(!html.includes('a<b"c'));
  assert.ok(html.includes('a&lt;b'));
  assert.ok(html.includes('&quot;c'));
});

test('island() omits the props attribute when props are empty', () => {
  assert.equal(
    island('stats'),
    '<div data-sitelo-island="stats"></div>',
  );
});

test('island() rejects unsafe names', () => {
  assert.throws(() => island('../etc/passwd'), /Invalid island name/);
  assert.throws(() => island('a/b'), /Invalid island name/);
  assert.equal(isValidIslandName('my-island_2'), true);
  assert.equal(isValidIslandName('-leading'), false);
});

test('renderIsland supports functions, modules, and lazy loaders', async () => {
  const context = { name: 'x', props: { n: 1 } };

  assert.equal(
    await renderIsland(({ props }) => `<b>${props.n}</b>`, context),
    '<b>1</b>',
  );

  assert.equal(
    await renderIsland({ default: () => '<i>mod</i>' }, context),
    '<i>mod</i>',
  );

  assert.equal(
    await renderIsland(
      { default: { render: () => '<i>structured</i>' } },
      context,
    ),
    '<i>structured</i>',
  );

  assert.equal(
    await renderIsland(
      () => Promise.resolve({ default: () => '<i>lazy</i>' }),
      context,
    ),
    '<i>lazy</i>',
  );
});

test('renderIsland rejects non-string output and missing render', async () => {
  await assert.rejects(
    () => renderIsland({ notRender: true }, { name: 'bad' }),
    /has no render function/,
  );
  await assert.rejects(
    () => renderIsland(() => 42, { name: 'bad' }),
    /must return an HTML string/,
  );
});

test('parseIslandProps parses JSON objects and rejects garbage', () => {
  assert.deepEqual(parseIslandProps('{"a":1}'), { a: 1 });
  assert.deepEqual(parseIslandProps(null), {});
  assert.deepEqual(parseIslandProps('[1,2]'), {});
  assert.throws(() => parseIslandProps('{oops'), /Invalid island props/);
});

test('createIslandsFromDirectory maps native modules by name', async () => {
  const islandsDir = path.join(fixtureDir, 'src', 'islands');
  const islands = createIslandsFromDirectory(islandsDir);

  assert.ok(islands.greeting);
  assert.equal(typeof islands.greeting, 'function');

  const html = await renderIsland(islands.greeting, {
    name: 'greeting',
    props: { who: 'dir' },
  });
  assert.equal(html, '<p data-island-test>Hello dir from an island</p>');
});

test('createIslandsHandler renders islands and handles errors', async () => {
  const handler = createIslandsHandler({
    islands: {
      greeting: ({ props }) => `<p>Hello ${props.who ?? 'world'}</p>`,
      broken: () => {
        throw new Error('boom');
      },
    },
  });

  const okProps = encodeURIComponent(JSON.stringify({ who: 'sitelo' }));
  const ok = await handler(
    new Request(`http://test/_sitelo/islands/greeting?props=${okProps}`),
  );
  assert.equal(ok.status, 200);
  assert.equal(await ok.text(), '<p>Hello sitelo</p>');
  assert.match(ok.headers.get('content-type'), /text\/html/);

  const outside = await handler(new Request('http://test/other/route'));
  assert.equal(outside, null);

  const unknown = await handler(
    new Request('http://test/_sitelo/islands/nope'),
  );
  assert.equal(unknown.status, 404);

  const invalidName = await handler(
    new Request('http://test/_sitelo/islands/..%2Fbad'),
  );
  assert.equal(invalidName.status, 400);

  const invalidProps = await handler(
    new Request('http://test/_sitelo/islands/greeting?props=%7Boops'),
  );
  assert.equal(invalidProps.status, 400);

  const broken = await handler(
    new Request('http://test/_sitelo/islands/broken'),
  );
  assert.equal(broken.status, 500);
});

test('createIslandsNodeHandler adapts node req/res', async () => {
  const handler = createIslandsNodeHandler({
    islands: { ping: () => '<p>pong</p>' },
  });

  const req = {
    url: '/_sitelo/islands/ping',
    method: 'GET',
    headers: { host: 'localhost:3000' },
    socket: {},
  };

  const headers = {};
  let body = '';
  let statusCode = 0;

  const res = {
    set statusCode(value) {
      statusCode = value;
    },
    get statusCode() {
      return statusCode;
    },
    setHeader(key, value) {
      headers[key.toLowerCase()] = value;
    },
    end(chunk) {
      body = chunk ?? '';
    },
  };

  await handler(req, res);

  assert.equal(statusCode, 200);
  assert.equal(body, '<p>pong</p>');
  assert.match(headers['content-type'], /text\/html/);

  // Outside the endpoint falls through to next().
  let nextCalled = false;
  await handler(
    { ...req, url: '/somewhere-else' },
    res,
    () => {
      nextCalled = true;
    },
  );
  assert.equal(nextCalled, true);
});

test('island() emits loading strategies', () => {
  // `load` is the default and needs no attribute.
  assert.doesNotMatch(island('comments'), /data-sitelo-when/);
  assert.doesNotMatch(island('comments', {}, '', { when: 'load' }), /data-sitelo-when/);

  assert.match(
    island('comments', {}, '', { when: 'idle' }),
    /data-sitelo-when="idle"/,
  );
  assert.match(
    island('comments', {}, '', { when: 'visible' }),
    /data-sitelo-when="visible"/,
  );
});

test('island() emits rootMargin only for visible islands', () => {
  assert.match(
    island('comments', {}, '', { when: 'visible', rootMargin: '400px' }),
    /data-sitelo-root-margin="400px"/,
  );
  // Meaningless without an observer, so it is dropped.
  assert.doesNotMatch(
    island('comments', {}, '', { when: 'idle', rootMargin: '400px' }),
    /data-sitelo-root-margin/,
  );
});

test('island() rejects unknown loading strategies', () => {
  assert.throws(
    () => island('comments', {}, '', { when: 'eventually' }),
    /Invalid island loading strategy/,
  );
  assert.throws(
    () => island('comments', {}, '', { when: 'visible', rootMargin: 400 }),
    /rootMargin must be a string/,
  );
});

