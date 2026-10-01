import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
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


test('createIslandsHandler answers bad names without throwing, and only for own entries', async () => {
  const handler = createIslandsHandler({ islands: { ping: () => '<p>pong</p>' } });
  const call = (name) => handler(new Request(`http://localhost/_sitelo/islands/${name}`));

  // A malformed escape used to throw out of the handler.
  assert.equal((await call('%E0')).status, 400);

  // Every object answers to these; none of them is an island.
  for (const name of ['toString', 'constructor', 'valueOf', 'hasOwnProperty']) {
    const response = await call(name);
    assert.equal(response.status, 404, `${name} is not an island`);
  }
});

/** Send a raw HTTP request and return its status line, or what went wrong. */
function rawRequest(port, text) {
  return new Promise((resolve) => {
    const socket = net.connect(port, '127.0.0.1', () => socket.write(text));
    let received = '';
    socket.on('data', (chunk) => {
      received += chunk;
    });
    socket.on('close', () => resolve(received.split('\r\n')[0] || 'no response'));
    socket.on('error', (error) => resolve(`error ${error.code}`));
    // A request the server never answers is a failure, not a hang.
    socket.setTimeout(5_000, () => socket.destroy());
  });
}

test('createIslandsNodeHandler survives requests a WHATWG Request cannot represent', async (t) => {
  // The setup the README suggests for plain Node: nothing awaits the
  // promise, so before this a rejection here took the process down.
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(reason);
  process.on('unhandledRejection', onUnhandled);
  t.after(() => process.off('unhandledRejection', onUnhandled));

  const handler = createIslandsNodeHandler({ islands: { ping: () => '<p>pong</p>' } });
  const server = http.createServer((req, res) => handler(req, res));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());

  const { port } = server.address();
  const send = (requestLine, host = 'localhost') =>
    rawRequest(port, `${requestLine} HTTP/1.1\r\nHost: ${host}\r\nConnection: close\r\n\r\n`);

  assert.equal(await send('TRACE /'), 'HTTP/1.1 404 Not Found', 'not an island request: passed by');
  assert.equal(await send('GET /', '['), 'HTTP/1.1 404 Not Found', 'a Host that is not a host: passed by');
  assert.equal(await send('TRACE /_sitelo/islands/ping'), 'HTTP/1.1 400 Bad Request');
  assert.equal(await send('GET /_sitelo/islands/ping', '['), 'HTTP/1.1 400 Bad Request');
  assert.equal(await send('GET /_sitelo/islands/%E0'), 'HTTP/1.1 400 Bad Request');
  assert.equal(await send('GET /_sitelo/islands/ping'), 'HTTP/1.1 200 OK', 'and the server is still up');

  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(unhandled, []);
});

test('createIslandsNodeHandler hands a failure to next() rather than rejecting', async () => {
  const handler = createIslandsNodeHandler({ islands: { ping: () => '<p>pong</p>' } });
  const failing = {
    url: '/_sitelo/islands/ping',
    method: 'GET',
    headers: { host: 'localhost' },
    socket: {},
  };
  const res = {
    statusCode: 0,
    setHeader() {
      throw new Error('socket went away');
    },
    end() {},
  };

  let passed;
  await handler(failing, res, (error) => {
    passed = error;
  });

  assert.match(String(passed), /socket went away/);
});
