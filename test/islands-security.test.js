import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  configureIslands,
  island,
  signIslandProps,
  verifyIslandProps,
} from '../src/islands.js';
import { createIslandsHandler } from '../src/islands-server.js';

const SECRET = 'test-secret-value';

function withSecret(t, secret) {
  configureIslands({ secret });
  t.after(() => configureIslands({ secret: undefined }));
}

async function callIsland(handler, name, params = {}) {
  const query = new URLSearchParams(params).toString();
  return handler(
    new Request(
      `https://example.com/_sitelo/islands/${name}${query ? `?${query}` : ''}`,
    ),
  );
}

const islands = {
  profile: ({ props }) => `<p>user ${props.userId ?? 'anonymous'}</p>`,
};

test('signIslandProps binds the signature to the island name', () => {
  const json = JSON.stringify({ userId: 1 });

  assert.notEqual(
    signIslandProps('profile', json, SECRET),
    signIslandProps('billing', json, SECRET),
  );
});

test('verifyIslandProps accepts only the exact name, props, and secret', () => {
  const json = JSON.stringify({ userId: 1 });
  const signature = signIslandProps('profile', json, SECRET);

  assert.equal(verifyIslandProps('profile', json, signature, SECRET), true);

  // Tampered props
  assert.equal(
    verifyIslandProps('profile', JSON.stringify({ userId: 2 }), signature, SECRET),
    false,
  );
  // Replayed against another island
  assert.equal(verifyIslandProps('billing', json, signature, SECRET), false);
  // Wrong secret
  assert.equal(verifyIslandProps('profile', json, signature, 'other'), false);
  // Missing or malformed signature
  assert.equal(verifyIslandProps('profile', json, undefined, SECRET), false);
  assert.equal(verifyIslandProps('profile', json, '', SECRET), false);
  assert.equal(verifyIslandProps('profile', json, 'short', SECRET), false);
});

test('island() signs props when a secret is configured', (t) => {
  withSecret(t, SECRET);

  const html = island('profile', { userId: 7 });
  const signature = html.match(/data-sitelo-sig="([^"]+)"/)?.[1];

  assert.ok(signature, 'expected a data-sitelo-sig attribute');
  assert.equal(
    verifyIslandProps('profile', JSON.stringify({ userId: 7 }), signature, SECRET),
    true,
  );
});

test('island() omits the signature when there are no props', (t) => {
  withSecret(t, SECRET);

  assert.doesNotMatch(island('profile'), /data-sitelo-sig/);
});

test('island() does not sign when no secret is configured', (t) => {
  withSecret(t, undefined);

  assert.doesNotMatch(island('profile', { userId: 7 }), /data-sitelo-sig/);
});

test('handler rejects forged props when a secret is set', async () => {
  const handler = createIslandsHandler({ islands, secret: SECRET });

  const honest = JSON.stringify({ userId: 1 });
  const signature = signIslandProps('profile', honest, SECRET);

  const ok = await callIsland(handler, 'profile', {
    props: honest,
    sig: signature,
  });
  assert.equal(ok.status, 200);
  assert.match(await ok.text(), /user 1/);

  // Same signature, different props: someone else's record.
  const forged = await callIsland(handler, 'profile', {
    props: JSON.stringify({ userId: 2 }),
    sig: signature,
  });
  assert.equal(forged.status, 403);

  // No signature at all.
  const unsigned = await callIsland(handler, 'profile', { props: honest });
  assert.equal(unsigned.status, 403);

  // Signature issued for a different island.
  const replayed = await callIsland(handler, 'profile', {
    props: honest,
    sig: signIslandProps('billing', honest, SECRET),
  });
  assert.equal(replayed.status, 403);
});

test('handler still serves prop-less islands when a secret is set', async () => {
  const handler = createIslandsHandler({ islands, secret: SECRET });

  const response = await callIsland(handler, 'profile');

  assert.equal(response.status, 200);
  assert.match(await response.text(), /user anonymous/);
});

test('handler accepts unsigned props when no secret is configured', async (t) => {
  withSecret(t, undefined);

  const handler = createIslandsHandler({ islands });

  const response = await callIsland(handler, 'profile', {
    props: JSON.stringify({ userId: 99 }),
  });

  assert.equal(response.status, 200);
  assert.match(await response.text(), /user 99/);
});

test('handler picks up the secret from the environment', async (t) => {
  const original = process.env.SITELO_ISLANDS_SECRET;
  process.env.SITELO_ISLANDS_SECRET = SECRET;
  t.after(() => {
    if (original === undefined) delete process.env.SITELO_ISLANDS_SECRET;
    else process.env.SITELO_ISLANDS_SECRET = original;
  });

  const handler = createIslandsHandler({ islands });

  const forged = await callIsland(handler, 'profile', {
    props: JSON.stringify({ userId: 2 }),
    sig: 'nope',
  });

  assert.equal(forged.status, 403);
});
