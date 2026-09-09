import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as ui from '../src/ui/index.js';
import * as badge from '../src/ui/runtime/badge.js';
import * as pressed from '../src/ui/runtime/pressed.js';
import { get, set } from '../src/ui/runtime/progress.js';
import { sync } from '../src/ui/runtime/slider.js';
import * as steps from '../src/ui/runtime/steps.js';

/*
 * The runtime touches a small, well-defined slice of the DOM, so a stub
 * covers it without pulling in jsdom — the same trade `islands-client`
 * makes. What it is pointed at is the component's own output, parsed,
 * rather than a tree written out by hand here: the thing worth testing
 * is that the two halves agree about the markup, and a hand-built
 * fixture would agree with whatever this file assumed.
 */

const SELF_CLOSING = new Set(['br', 'hr', 'img', 'input']);

/** Parse `class="a b" data-x=""` into a map. */
function attributes(source) {
  const found = new Map();

  for (const [, name, value] of source.matchAll(/([^\s=/>]+)(?:="([^"]*)")?/g)) {
    if (name) found.set(name, value ?? '');
  }

  return found;
}

/** The handful of selector forms the runtime modules actually write. */
function matches(node, selector) {
  if (selector.startsWith('.')) {
    return (node.attrs.get('class') ?? '').split(/\s+/).includes(selector.slice(1));
  }

  if (selector.startsWith('[')) {
    const [, name, value] = selector.slice(1, -1).match(/^([^=]+)(?:="(.*)")?$/);

    return value === undefined ? node.attrs.has(name) : node.attrs.get(name) === value;
  }

  throw new Error(`the stub does not implement "${selector}"`);
}

function element(name, attrs) {
  const node = {
    name,
    attrs,
    children: [],
    parent: null,
    textContent: '',

    get classList() {
      const list = () => (node.attrs.get('class') ?? '').split(/\s+/).filter(Boolean);

      const write = (next) => node.attrs.set('class', [...next].join(' '));

      return {
        contains: (value) => list().includes(value),
        toggle(value, on) {
          const next = new Set(list());

          if (on) next.add(value);
          else next.delete(value);
          write(next);
        },
        add: (...values) => write(new Set([...list(), ...values])),
        remove(...values) {
          const next = new Set(list());

          for (const value of values) next.delete(value);
          write(next);
        },
      };
    },

    style: {
      declarations: new Map(
        (attrs.get('style') ?? '')
          .split(';')
          .filter(Boolean)
          .map((part) => part.split(':').map((half) => half.trim()))
          .map(([property, value]) => [property, value]),
      ),
      setProperty(property, value) {
        this.declarations.set(property, value);
      },
      removeProperty(property) {
        this.declarations.delete(property);
      },
      getPropertyValue(property) {
        return this.declarations.get(property) ?? '';
      },
    },

    get value() {
      return attrs.get('value') ?? '';
    },
    set value(next) {
      attrs.set('value', String(next));
    },

    getAttribute: (key) => attrs.get(key) ?? null,
    setAttribute: (key, value) => attrs.set(key, String(value)),
    removeAttribute: (key) => attrs.delete(key),
    hasAttribute: (key) => attrs.has(key),

    get className() {
      return attrs.get('class') ?? '';
    },
    set className(next) {
      attrs.set('class', String(next));
    },

    append(child) {
      child.parent = node;
      node.children.push(child);
    },

    remove() {
      const at = node.parent?.children.indexOf(node) ?? -1;

      if (at !== -1) node.parent.children.splice(at, 1);
    },

    get parentElement() {
      return node.parent?.name === '#document' ? null : node.parent;
    },

    querySelector(selector) {
      return node.querySelectorAll(selector)[0] ?? null;
    },

    querySelectorAll(selector) {
      const found = [];

      for (const child of node.children) {
        if (!child.name) continue;
        if (matches(child, selector)) found.push(child);
        found.push(...child.querySelectorAll(selector));
      }

      return found;
    },

    closest(selector) {
      for (let at = node; at; at = at.parent) if (matches(at, selector)) return at;

      return null;
    },
  };

  return node;
}

/** Build a tree from a component's HTML, and index it by `id`. */
function render(html) {
  const root = element('#document', new Map());
  const stack = [root];
  const byId = new Map();
  const pattern = /<(\/)?([a-z]+)((?:\s+[^\s=/>]+(?:="[^"]*")?)*)\s*(\/?)>/g;
  let cursor = 0;
  let match;

  while ((match = pattern.exec(html))) {
    const [, closing, name, source, slash] = match;
    const text = html.slice(cursor, match.index);

    cursor = pattern.lastIndex;

    if (text) stack.at(-1).textContent += text;

    if (closing) {
      stack.pop();
      continue;
    }

    const node = element(name, attributes(source));

    node.parent = stack.at(-1);
    node.parent.children.push(node);

    if (node.attrs.has('id')) byId.set(node.attrs.get('id'), node);
    if (!slash && !SELF_CLOSING.has(name)) stack.push(node);
  }

  globalThis.document = {
    getElementById: (id) => byId.get(id) ?? null,
    querySelector: (selector) => root.querySelector(selector),
    createElement: (name) => element(name, new Map()),
  };

  return root.children[0];
}

/** The drawn width, which is the only thing a sighted reader sees. */
function drawn(bar) {
  return bar.querySelector('.su-progress-fill').style.getPropertyValue('--su-progress-value');
}

test('set() moves the fill, the announced value and the label together', () => {
  const bar = render(ui.progress({ value: 25, label: 'Building', showValue: true, id: 'b' }));

  set('b', 60);

  assert.equal(drawn(bar), '60%');
  assert.equal(bar.querySelector('.su-progress-bar').getAttribute('aria-valuenow'), '60');
  assert.equal(bar.querySelector('[data-su-progress-value]').textContent, '60%');
});

test('a bar rendered indeterminate can be given a value', () => {
  // The label span is rendered empty for exactly this: there is nowhere
  // to write the percentage if the server left the span out.
  const root = render(ui.progress({ label: 'Waiting', showValue: true, id: 'b' }));
  const bar = root.querySelector('.su-progress-bar');

  set('b', 30);

  assert.ok(!bar.classList.contains('su-progress-bar--indeterminate'));
  assert.equal(bar.getAttribute('aria-valuenow'), '30');
  assert.equal(bar.getAttribute('aria-valuemax'), '100');
  assert.equal(root.querySelector('[data-su-progress-value]').textContent, '30%');
});

test('a value of null hands the bar back to the animation', () => {
  const root = render(ui.progress({ value: 40, label: 'Building', showValue: true, id: 'b' }));
  const bar = root.querySelector('.su-progress-bar');

  set('b', null);

  assert.ok(bar.classList.contains('su-progress-bar--indeterminate'));
  assert.equal(bar.getAttribute('aria-valuenow'), null);
  assert.equal(drawn(root), '');
  assert.equal(root.querySelector('[data-su-progress-value]').textContent, '');
  assert.equal(get('b'), null);
});

test('the scale the server rendered survives a call that does not repeat it', () => {
  const root = render(ui.progress({ value: 10, max: 60, label: 'Images', id: 'b' }));

  set('b', 30);

  assert.equal(drawn(root), '50%');
  assert.equal(get('b'), 30, 'get() answers on the bar’s own scale, not in percent');
});

test('a max passed once is remembered for the calls after it', () => {
  const root = render(ui.progress({ label: 'Uploading', id: 'b' }));

  set('b', 128, { max: 512 });
  assert.equal(drawn(root), '25%');

  set('b', 256);
  assert.equal(drawn(root), '50%', 'the second call did not fall back to a scale of 100');
});

test('an unlabelled bar is moved but still announces nothing', () => {
  // It was rendered aria-hidden on purpose. Giving it a value now would
  // put a nameless progressbar in the accessibility tree.
  const root = render(ui.progress({ value: 40, id: 'b' }));
  const bar = root.querySelector('.su-progress-bar');

  set('b', 90);

  assert.equal(drawn(root), '90%');
  assert.equal(bar.getAttribute('role'), null);
  assert.equal(bar.getAttribute('aria-valuenow'), null);
  assert.equal(bar.getAttribute('aria-hidden'), 'true');
  assert.equal(get('b'), 90, 'the drawing is the only record, and get() reads it');
});

test('a value outside the range is clamped, the way the component clamps it', () => {
  const root = render(ui.progress({ value: 0, label: 'Building', id: 'b' }));

  set('b', 300);
  assert.equal(drawn(root), '100%');

  set('b', -5);
  assert.equal(drawn(root), '0%');
});

test('an unusable value is no value at all', () => {
  const root = render(ui.progress({ value: 50, label: 'Building', id: 'b' }));
  const bar = root.querySelector('.su-progress-bar');

  set('b', Number.NaN);

  assert.ok(bar.classList.contains('su-progress-bar--indeterminate'));
  assert.ok(!drawn(root).includes('NaN'));
});

test('a target that is not on the page is not an error', () => {
  render(ui.progress({ value: 50, label: 'Building', id: 'b' }));

  assert.equal(set('nope', 10), null);
  assert.equal(get('nope'), null);
  assert.equal(set('#not a selector', 10), null);
});

test('the bar can be aimed at directly, not only through its wrapper', () => {
  const root = render(ui.progress({ value: 10, label: 'Building', showValue: true }));
  const bar = root.querySelector('.su-progress-bar');

  set(bar, 75);

  assert.equal(drawn(root), '75%');
  assert.equal(
    root.querySelector('[data-su-progress-value]').textContent,
    '75%',
    'the label above the bar was still found',
  );
});

/* ------------------------------------------------------------------ *
 * Slider
 * ------------------------------------------------------------------ */

test('the slider fetches its own handler, so the output is never stale', () => {
  // Unlike the rest of this file's subjects, nothing on the page has to
  // call this one: a shown value that does not follow the thumb is a
  // bug, not a feature the site opts into.
  const html = ui.slider({ value: 40, showValue: true });

  assert.match(html, /oninput="import\('\/su\/slider\.js'\)\.then\(m=>m\.sync\(this\)\)"/);
  assert.ok(!ui.slider({ value: 40 }).includes('oninput'), 'no output, nothing to sync');
});

test('sync() copies the thumb into the output beside it', () => {
  const row = render(ui.slider({ value: 40, showValue: true, id: 'vol' }));
  const input = document.getElementById('vol');

  assert.equal(row.querySelector('.su-slider-output').textContent, '40');

  input.value = 75;
  sync(input);

  assert.equal(row.querySelector('.su-slider-output').textContent, '75');
});

/* ------------------------------------------------------------------ *
 * Pressed
 * ------------------------------------------------------------------ */

test('setPressed() with no state flips whichever way the button is', () => {
  const button = render(ui.toggleButton({ pressed: false, id: 'bold' }, 'Bold'));

  assert.equal(pressed.set('bold'), true);
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.equal(pressed.set('bold'), false);
  assert.equal(pressed.get('bold'), false);
});

test('pressing one button in a single-choice group lets go of the rest', () => {
  const group = render(ui.toggleGroup({ items: ['day', 'week', 'month'], value: 'day', id: 'span' }));
  const [day, week] = group.querySelectorAll('.su-toggle-btn');

  pressed.set(week, true);

  assert.equal(week.getAttribute('aria-pressed'), 'true');
  assert.equal(day.getAttribute('aria-pressed'), 'false');
  assert.deepEqual(pressed.get('span'), ['week']);
});

test('a group that took an array keeps every button it is given', () => {
  // An array `value` was the server saying more than one can be on, and
  // `data-su-multiple` is how that survives into the browser.
  const group = render(ui.toggleGroup({ items: ['b', 'i', 'u'], value: ['b'], id: 'marks' }));
  const [bold, italic] = group.querySelectorAll('.su-toggle-btn');

  pressed.set(italic, true);

  assert.equal(bold.getAttribute('aria-pressed'), 'true');
  assert.deepEqual(pressed.get('marks'), ['b', 'i']);
});

test('setPressed() ignores anything that is not a toggle', () => {
  render(ui.button({ id: 'plain' }, 'Save'));

  assert.equal(pressed.set('plain', true), null);
  assert.equal(pressed.get('plain'), null);
  assert.equal(pressed.get('nope'), null);
});

/* ------------------------------------------------------------------ *
 * Steps
 * ------------------------------------------------------------------ */

test('setStep() moves every step, not just the one it is given', () => {
  const flow = render(ui.steps({ items: ['One', 'Two', 'Three'], current: 0, id: 'flow' }));

  steps.set('flow', 2);

  const states = flow.querySelectorAll('.su-step').map((step) =>
    ['complete', 'current', 'upcoming'].find((name) =>
      step.classList.contains(`su-step--${name}`),
    ),
  );

  assert.deepEqual(states, ['complete', 'complete', 'current']);
  assert.equal(flow.querySelectorAll('[aria-current="step"]').length, 1);
  assert.equal(steps.get('flow'), 2);
});

test('a step past the last one is a finished flow', () => {
  const flow = render(ui.steps({ items: ['One', 'Two'], current: 0, id: 'flow' }));

  steps.set('flow', 2);

  assert.equal(flow.querySelectorAll('.su-step--complete').length, 2);
  assert.equal(flow.querySelectorAll('[aria-current="step"]').length, 0);
  assert.equal(steps.get('flow'), 2, 'with nothing in progress, get() answers the count');
});

test('the tick and the number are both in the markup, so nothing redraws', () => {
  // The runtime only ever changes class names; which marker shows is the
  // stylesheet's business, and that is what keeps the glyph in one place.
  const flow = render(ui.steps({ items: ['One', 'Two'], current: 0, id: 'flow' }));
  const marker = flow.querySelector('.su-step-marker');

  assert.ok(marker.querySelector('.su-step-number'), 'the number is there');
  assert.ok(marker.querySelector('.su-icon'), 'and so is the tick');
});

test('setStep() ignores a target that is not a flow', () => {
  render(ui.steps({ items: ['One'], id: 'flow' }));

  assert.equal(steps.set('nope', 1), null);
  assert.equal(steps.get('nope'), null);
});

/* ------------------------------------------------------------------ *
 * Badge
 * ------------------------------------------------------------------ */

test('setBadge() writes the count and the text that announces it', () => {
  const root = render(ui.badge({ content: 4, label: '4 unread messages', id: 'inbox' }, 'x'));

  badge.set('inbox', 7, { label: '7 unread messages' });

  assert.equal(root.querySelector('[data-su-badge-value]').textContent, '7');
  assert.equal(root.querySelector('.su-visually-hidden').textContent, '7 unread messages');
  assert.equal(badge.get('inbox'), 7);
});

test('a count past the clamp reads as the clamp, on the server’s own scale', () => {
  const root = render(ui.badge({ content: 4, max: 20, id: 'cart' }, 'x'));

  badge.set('cart', 63);

  assert.equal(root.querySelector('[data-su-badge-value]').textContent, '20+');
  assert.equal(badge.get('cart'), '20+', 'the real figure never reached the browser');
});

test('a max given once is remembered for the calls after it', () => {
  const root = render(ui.badge({ content: 1, id: 'cart' }, 'x'));

  badge.set('cart', 12, { max: 9 });
  assert.equal(root.querySelector('[data-su-badge-value]').textContent, '9+');

  badge.set('cart', 11);
  assert.equal(root.querySelector('[data-su-badge-value]').textContent, '9+');
});

test('an emptied badge leaves the accessibility tree, the way it was rendered', () => {
  const root = render(ui.badge({ content: 3, id: 'inbox' }, 'x'));
  const mark = root.querySelector('.su-badge');

  badge.set('inbox', null);

  assert.equal(mark.textContent, '');
  assert.equal(mark.getAttribute('aria-hidden'), 'true');
  assert.equal(badge.get('inbox'), null);

  badge.set('inbox', 2);
  assert.equal(mark.getAttribute('aria-hidden'), null, 'and comes back when it has something to say');
});

test('setBadge() ignores a target that is not a badge', () => {
  render(ui.badge({ content: 1, id: 'inbox' }, 'x'));

  assert.equal(badge.set('nope', 4), null);
  assert.equal(badge.get('nope'), null);
});

test('a label given to a badge that never had one is added, not dropped', () => {
  // The component hides the digits from the accessibility tree whenever
  // it renders a label, so writing the text alone would announce the
  // count twice — the runtime has to build the same shape.
  const root = render(ui.badge({ content: 3, id: 'inbox' }, 'x'));

  badge.set('inbox', 5, { label: '5 unread messages' });

  assert.equal(root.querySelector('.su-visually-hidden').textContent, '5 unread messages');
  assert.equal(root.querySelector('[data-su-badge-value]').getAttribute('aria-hidden'), 'true');
});

test('an emptied label takes the hidden span with it', () => {
  const root = render(ui.badge({ content: 3, label: '3 unread', id: 'inbox' }, 'x'));

  badge.set('inbox', null, { label: '' });

  assert.equal(root.querySelector('.su-visually-hidden'), null);
  assert.equal(root.querySelector('[data-su-badge-value]').getAttribute('aria-hidden'), null);
  assert.equal(root.querySelector('.su-badge').getAttribute('aria-hidden'), 'true');
});
