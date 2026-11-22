import assert from 'node:assert/strict';
import { test } from 'node:test';

import { mountEnhancements } from '../src/enhance-client.js';
import { ISLAND_LOAD_EVENT, mountIslands } from '../src/islands-client.js';

/**
 * The loader touches a small, well-defined slice of the DOM, so a stub
 * covers it without pulling in jsdom. `matches` stands in for the
 * `:not([data-sitelo-enhance-state])` half of the selector.
 */
function createElement(attributes = {}) {
  const attrs = new Map(Object.entries(attributes));

  return {
    getAttribute: (key) => attrs.get(key) ?? null,
    setAttribute: (key, value) => attrs.set(key, String(value)),
    get state() {
      return attrs.get('data-sitelo-enhance-state') ?? null;
    },
  };
}

function createRoot(elements) {
  const listeners = new Map();

  return {
    querySelectorAll: () => elements.filter((element) => element.state === null),
    addEventListener: (type, listener) => listeners.set(type, listener),
    dispatch: (type, event) => listeners.get(type)?.(event),
  };
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

/** A module whose default export records what it was called with. */
function recordingModule(calls) {
  return {
    default: (element, props) => {
      calls.push({ element, props });
    },
  };
}

test('load strategy imports the module, calls it with element and props, and is awaited', async () => {
  const calls = [];
  const element = createElement({
    'data-sitelo-enhance': 'counter',
    'data-sitelo-props': '{"start":3}',
  });

  await mountEnhancements(
    { counter: async () => recordingModule(calls) },
    { root: createRoot([element]) },
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0].element, element);
  assert.deepEqual(calls[0].props, { start: 3 });
  assert.equal(element.state, 'ready');
});

test('props default to an empty object', async () => {
  const calls = [];
  const element = createElement({ 'data-sitelo-enhance': 'copy' });

  await mountEnhancements(
    { copy: async () => recordingModule(calls) },
    { root: createRoot([element]) },
  );

  assert.deepEqual(calls[0].props, {});
});

test('a loader may resolve to the function itself', async () => {
  const seen = [];
  const element = createElement({ 'data-sitelo-enhance': 'inline' });

  await mountEnhancements(
    { inline: () => (el) => seen.push(el) },
    { root: createRoot([element]) },
  );

  assert.deepEqual(seen, [element]);
  assert.equal(element.state, 'ready');
});

test('an async enhancer is awaited before the element is ready', async () => {
  let release;
  const element = createElement({ 'data-sitelo-enhance': 'slow' });

  const mounted = mountEnhancements(
    {
      slow: async () => ({
        default: () => new Promise((resolve) => (release = resolve)),
      }),
    },
    { root: createRoot([element]) },
  );

  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(element.state, 'loading');

  release();
  await mounted;
  assert.equal(element.state, 'ready');
});

test('an unregistered name is an error, and inherited keys do not count', async () => {
  const errors = [];
  const missing = createElement({ 'data-sitelo-enhance': 'missing' });
  const proto = createElement({ 'data-sitelo-enhance': 'toString' });

  await mountEnhancements(
    {},
    {
      root: createRoot([missing, proto]),
      onError: (error, element) => errors.push({ error, element }),
    },
  );

  assert.equal(missing.state, 'error');
  assert.equal(proto.state, 'error');
  assert.match(String(errors[0].error), /No module registered for enhancement "missing"/);
  assert.equal(errors[1].element, proto);
});

test('a module without a default function, or one that throws, is an error', async () => {
  const errors = [];
  const empty = createElement({ 'data-sitelo-enhance': 'empty' });
  const broken = createElement({ 'data-sitelo-enhance': 'broken' });

  await mountEnhancements(
    {
      empty: async () => ({ named: () => {} }),
      broken: async () => ({
        default: () => {
          throw new Error('boom');
        },
      }),
    },
    { root: createRoot([empty, broken]), onError: (error) => errors.push(String(error)) },
  );

  assert.equal(empty.state, 'error');
  assert.equal(broken.state, 'error');
  assert.match(errors[0], /no default export function/);
  assert.match(errors[1], /boom/);
});

test('failures are logged when there is no onError', async (t) => {
  const logged = [];
  t.mock.method(console, 'error', (...args) => logged.push(args));

  await mountEnhancements(
    {},
    { root: createRoot([createElement({ 'data-sitelo-enhance': 'x' })]) },
  );

  assert.equal(logged.length, 1);
  assert.match(String(logged[0][0]), /\[sitelo\] enhancement failed/);
});

test('idle strategy defers the import and is not awaited', async (t) => {
  let idleCallback;
  stubGlobals(t, {
    requestIdleCallback: (callback) => {
      idleCallback = callback;
    },
  });

  let loads = 0;
  const element = createElement({
    'data-sitelo-enhance': 'later',
    'data-sitelo-when': 'idle',
  });

  await mountEnhancements(
    { later: async () => (loads++, () => {}) },
    { root: createRoot([element]) },
  );

  assert.equal(loads, 0, 'must not import before the browser is idle');
  assert.equal(element.state, 'pending');

  await idleCallback();
  assert.equal(loads, 1);
  assert.equal(element.state, 'ready');
});

test('visible strategy waits for intersection, with the element’s own margin', async (t) => {
  const observers = [];

  class FakeIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.disconnected = false;
      observers.push(this);
    }
    observe(target) {
      this.target = target;
    }
    disconnect() {
      this.disconnected = true;
    }
  }

  stubGlobals(t, { IntersectionObserver: FakeIntersectionObserver });

  let loads = 0;
  const element = createElement({
    'data-sitelo-enhance': 'below',
    'data-sitelo-when': 'visible',
    'data-sitelo-root-margin': '400px',
  });

  await mountEnhancements(
    { below: async () => (loads++, () => {}) },
    { root: createRoot([element]) },
  );

  const [observer] = observers;
  assert.equal(observer.target, element);
  assert.equal(observer.options.rootMargin, '400px');
  assert.equal(loads, 0, 'must not import before it is visible');

  observer.callback([{ isIntersecting: false }]);
  assert.equal(loads, 0);

  // Two entries for the same element in one batch still run it once.
  observer.callback([{ isIntersecting: true }, { isIntersecting: true }]);
  assert.equal(observer.disconnected, true);
  assert.equal(loads, 1);
});

test('calling mountEnhancements again never runs a module twice on one element', async () => {
  let runs = 0;
  const modules = { once: () => () => runs++ };
  const root = createRoot([createElement({ 'data-sitelo-enhance': 'once' })]);

  await mountEnhancements(modules, { root });
  await mountEnhancements(modules, { root });

  assert.equal(runs, 1);
});

test('enhancements inside a server island are mounted when it loads', async () => {
  const seen = [];
  const root = createRoot([]);

  await mountEnhancements({ inner: () => (el) => seen.push(el) }, { root });
  assert.equal(seen.length, 0);

  const inner = createElement({ 'data-sitelo-enhance': 'inner' });
  const island = createRoot([inner]);

  root.dispatch(ISLAND_LOAD_EVENT, { target: island });
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(seen, [inner]);
  assert.equal(inner.state, 'ready');
});

test('the islands loader announces each island it swaps in', async (t) => {
  stubGlobals(t, {
    fetch: async () => ({ ok: true, status: 200, text: async () => '<p>hi</p>' }),
  });

  const events = [];
  const attrs = new Map([['data-sitelo-island', 'greeting']]);
  const island = {
    innerHTML: '',
    getAttribute: (key) => attrs.get(key) ?? null,
    setAttribute: (key, value) => attrs.set(key, String(value)),
    dispatchEvent: (event) => events.push(event),
  };

  await mountIslands({ root: { querySelectorAll: () => [island] } });

  assert.equal(events.length, 1);
  assert.equal(events[0].type, ISLAND_LOAD_EVENT);
  assert.equal(events[0].type, 'sitelo:island-load');
  assert.equal(events[0].bubbles, true);
});

test('mountEnhancements rejects a missing module map', async () => {
  await assert.rejects(
    () => mountEnhancements(/** @type {any} */ (undefined), { root: createRoot([]) }),
    /takes a map of names to loaders/,
  );
});
