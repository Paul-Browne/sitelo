import assert from 'node:assert/strict';
import { test } from 'node:test';

import { mountIslands } from '../src/islands-client.js';

/**
 * The loader touches a small, well-defined slice of the DOM, so a stub
 * covers it without pulling in jsdom.
 */
function createElement(attributes = {}) {
  const attrs = new Map(Object.entries(attributes));

  return {
    innerHTML: '<p>fallback</p>',
    getAttribute: (key) => attrs.get(key) ?? null,
    setAttribute: (key, value) => attrs.set(key, String(value)),
    get state() {
      return attrs.get('data-sitelo-island-state') ?? null;
    },
  };
}

function createRoot(elements) {
  return { querySelectorAll: () => elements };
}

/** Swap in globals for one test and restore them afterwards. */
function stubGlobals(t, globals) {
  const originals = new Map();

  for (const [key, value] of Object.entries(globals)) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    globalThis[key] = value;
  }

  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
}

function fetchStub(calls, body = '<p>rendered</p>') {
  return async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => body };
  };
}

test('load strategy fetches immediately and is awaited', async (t) => {
  const calls = [];
  stubGlobals(t, { fetch: fetchStub(calls) });

  const element = createElement({ 'data-sitelo-island': 'comments' });

  await mountIslands({ root: createRoot([element]) });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/_sitelo/islands/comments');
  assert.equal(element.innerHTML, '<p>rendered</p>');
  assert.equal(element.state, 'loaded');
});

test('props and signature are forwarded as query parameters', async (t) => {
  const calls = [];
  stubGlobals(t, { fetch: fetchStub(calls) });

  const element = createElement({
    'data-sitelo-island': 'profile',
    'data-sitelo-props': '{"userId":7}',
    'data-sitelo-sig': 'abc123',
  });

  await mountIslands({ root: createRoot([element]) });

  const url = new URL(calls[0].url, 'https://example.com');
  assert.equal(url.searchParams.get('props'), '{"userId":7}');
  assert.equal(url.searchParams.get('sig'), 'abc123');
});

test('idle strategy defers the fetch and is not awaited', async (t) => {
  const calls = [];
  let idleCallback;

  stubGlobals(t, {
    fetch: fetchStub(calls),
    requestIdleCallback: (cb) => {
      idleCallback = cb;
    },
  });

  const element = createElement({
    'data-sitelo-island': 'comments',
    'data-sitelo-when': 'idle',
  });

  await mountIslands({ root: createRoot([element]) });

  // mountIslands resolved without waiting for the island.
  assert.equal(calls.length, 0);
  assert.equal(element.state, null);

  idleCallback();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(calls.length, 1);
  assert.equal(element.state, 'loaded');
});

test('visible strategy waits for intersection', async (t) => {
  const calls = [];
  const observed = [];
  let trigger;
  let disconnected = false;

  class FakeIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      trigger = (isIntersecting) => callback([{ isIntersecting }]);
    }
    observe(element) {
      observed.push({ element, options: this.options });
    }
    disconnect() {
      disconnected = true;
    }
  }

  stubGlobals(t, {
    fetch: fetchStub(calls),
    IntersectionObserver: FakeIntersectionObserver,
  });

  const element = createElement({
    'data-sitelo-island': 'comments',
    'data-sitelo-when': 'visible',
  });

  await mountIslands({ root: createRoot([element]) });

  assert.equal(calls.length, 0, 'must not fetch before it is visible');
  assert.equal(observed.length, 1);
  assert.equal(observed[0].options.rootMargin, '200px');

  // Off-screen scroll events must not trigger a load.
  trigger(false);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls.length, 0);

  trigger(true);
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(calls.length, 1);
  assert.equal(disconnected, true, 'observer should stop after loading');
  assert.equal(element.state, 'loaded');
});

test('per-island rootMargin overrides the mount default', async (t) => {
  const observed = [];

  class FakeIntersectionObserver {
    constructor(_callback, options) {
      this.options = options;
    }
    observe(element) {
      observed.push({ element, options: this.options });
    }
    disconnect() {}
  }

  stubGlobals(t, {
    fetch: fetchStub([]),
    IntersectionObserver: FakeIntersectionObserver,
  });

  const element = createElement({
    'data-sitelo-island': 'comments',
    'data-sitelo-when': 'visible',
    'data-sitelo-root-margin': '800px',
  });

  await mountIslands({ root: createRoot([element]), rootMargin: '100px' });

  assert.equal(observed[0].options.rootMargin, '800px');
});

test('visible falls back to loading now without IntersectionObserver', async (t) => {
  const calls = [];
  stubGlobals(t, { fetch: fetchStub(calls), IntersectionObserver: undefined });
  delete globalThis.IntersectionObserver;

  const element = createElement({
    'data-sitelo-island': 'comments',
    'data-sitelo-when': 'visible',
  });

  await mountIslands({ root: createRoot([element]) });

  assert.equal(calls.length, 1, 'must load rather than never appear');
  assert.equal(element.state, 'loaded');
});

test('a timeout signal is passed to fetch, and 0 disables it', async (t) => {
  const calls = [];
  stubGlobals(t, { fetch: fetchStub(calls) });

  const element = createElement({ 'data-sitelo-island': 'comments' });
  await mountIslands({ root: createRoot([element]), timeout: 50 });

  const signal = calls[0].init.signal;
  assert.ok(signal, 'expected an AbortSignal');
  assert.equal(signal.aborted, false);

  const other = createElement({ 'data-sitelo-island': 'comments' });
  await mountIslands({ root: createRoot([other]), timeout: 0 });

  assert.equal(calls[1].init.signal, undefined);
});

test('a slow island aborts and keeps its fallback', async (t) => {
  // `AbortSignal.timeout()` schedules an unref'd timer, so with a fetch
  // stub that never settles the loop would drain before it fires. A
  // browser has no such problem; the test just needs something ref'd.
  const keepAlive = setInterval(() => {}, 5);
  t.after(() => clearInterval(keepAlive));

  stubGlobals(t, {
    fetch: (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () =>
          reject(new Error('aborted')),
        );
      }),
  });

  const element = createElement({ 'data-sitelo-island': 'comments' });
  const errors = [];

  await mountIslands({
    root: createRoot([element]),
    timeout: 25,
    onError: (error) => errors.push(error),
  });

  assert.equal(errors.length, 1);
  assert.equal(element.innerHTML, '<p>fallback</p>');
  assert.equal(element.state, 'error');
});

test('a failed response keeps the fallback and reports the error', async (t) => {
  stubGlobals(t, {
    fetch: async () => ({ ok: false, status: 500, text: async () => '' }),
  });

  const element = createElement({ 'data-sitelo-island': 'comments' });
  const errors = [];

  await mountIslands({
    root: createRoot([element]),
    onError: (error) => errors.push(error),
  });

  assert.equal(errors.length, 1);
  assert.match(String(errors[0].message), /responded 500/);
  assert.equal(element.innerHTML, '<p>fallback</p>');
  assert.equal(element.state, 'error');
});
