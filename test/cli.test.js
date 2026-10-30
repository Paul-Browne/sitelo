import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

import { createFixture } from './helpers/fixture.js';

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(rootDir, 'bin', 'sitelo.js');
const fixtureDir = createFixture('basic');
const distDir = path.join(fixtureDir, 'dist');

async function runBuild(cwd, args = []) {
  return execFileAsync(process.execPath, [cliPath, 'build', ...args], {
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

test('sitelo.config.js vite options are applied', async (t) => {
  const configPath = path.join(fixtureDir, 'sitelo.config.js');
  const originalConfig = fs.readFileSync(configPath, 'utf8');
  const customOutDir = path.join(fixtureDir, 'public-out');

  const cleanup = () => {
    fs.writeFileSync(configPath, originalConfig);
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(customOutDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  fs.writeFileSync(
    configPath,
    `export default {
  site: 'https://example.com',
  vite: {
    build: {
      outDir: 'public-out',
      emptyOutDir: true,
    },
  },
}
`,
  );

  await runBuild(fixtureDir);

  assert.ok(fs.existsSync(path.join(customOutDir, 'index.html')));
  assert.equal(fs.existsSync(path.join(distDir, 'index.html')), false);
});

test('rolldown plugin timings are off by default and re-enablable', async (t) => {
  const configPath = path.join(fixtureDir, 'sitelo.config.js');
  const originalConfig = fs.readFileSync(configPath, 'utf8');
  const probePath = path.join(fixtureDir, 'checks-probe.mjs');
  const outPath = path.join(fixtureDir, 'checks.json');

  const cleanup = () => {
    fs.writeFileSync(configPath, originalConfig);
    fs.rmSync(probePath, { force: true });
    fs.rmSync(outPath, { force: true });
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  // The warning itself only fires on a build slow enough to trip rolldown's
  // own threshold, which this fixture never is. So assert on the option Vite
  // resolves — that is the thing sitelo controls.
  fs.writeFileSync(
    probePath,
    `import fs from 'node:fs';

export const probe = (out) => ({
  name: 'checks-probe',
  configResolved(config) {
    fs.writeFileSync(
      out,
      JSON.stringify(config.build.rollupOptions.checks ?? null),
    );
  },
});
`,
  );

  const configWith = (overrides) =>
    `import { probe } from './checks-probe.mjs';

export default {
  site: 'https://example.com',
  vite: {
    plugins: [probe(${JSON.stringify(outPath)})],
    ${overrides}
  },
}
`;

  fs.writeFileSync(configPath, configWith(''));
  await runBuild(fixtureDir);
  assert.deepEqual(JSON.parse(fs.readFileSync(outPath, 'utf8')), {
    pluginTimings: false,
  });

  fs.writeFileSync(
    configPath,
    configWith('build: { rollupOptions: { checks: { pluginTimings: true } } },'),
  );
  await runBuild(fixtureDir);
  assert.deepEqual(
    JSON.parse(fs.readFileSync(outPath, 'utf8')),
    { pluginTimings: true },
    'sitelo.config.js `vite` should override the sitelo default',
  );
});

test('sitelo build with pagefind: true indexes and syncs to public/', async (t) => {
  const configPath = path.join(fixtureDir, 'sitelo.config.js');
  const originalConfig = fs.readFileSync(configPath, 'utf8');
  const publicPagefind = path.join(fixtureDir, 'public', 'pagefind');

  const cleanup = () => {
    fs.writeFileSync(configPath, originalConfig);
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(publicPagefind, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  fs.writeFileSync(
    configPath,
    `export default {
  site: 'https://example.com',
  pagefind: true,
}
`,
  );

  await runBuild(fixtureDir);

  assert.ok(
    fs.existsSync(path.join(distDir, 'pagefind', 'pagefind-ui.js')),
    'expected dist/pagefind/pagefind-ui.js',
  );
  assert.ok(
    fs.existsSync(path.join(publicPagefind, 'pagefind-ui.js')),
    'expected public/pagefind/pagefind-ui.js sync for dev',
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
    const failure = await runBuild(fixtureDir).then(
      () => null,
      (error) => error,
    );

    assert.ok(failure, 'expected the build to fail');

    const output = `${failure.stdout ?? ''}${failure.stderr ?? ''}`;

    assert.match(output, /\[sitelo\] Found both plugin options in sitelo\.config\.js/);
    assert.doesNotMatch(output, /\[sitelo\] \[sitelo\]/);
  } finally {
    fs.rmSync(viteConfigPath, { force: true });
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  }
});

test('sitelo build --base puts the ui runtime where its pages point', async (t) => {
  const configPath = path.join(fixtureDir, 'sitelo.config.js');
  const originalConfig = fs.readFileSync(configPath, 'utf8');
  const pagePath = path.join(fixtureDir, 'src', 'ui.ht.js');
  const viteConfigPath = path.join(fixtureDir, 'vite.config.mjs');

  const cleanup = () => {
    fs.writeFileSync(configPath, originalConfig);
    fs.rmSync(pagePath, { force: true });
    fs.rmSync(viteConfigPath, { force: true });
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  fs.writeFileSync(
    pagePath,
    `import * as ui from ${JSON.stringify(path.join(rootDir, 'src/ui/index.js'))}

export default () =>
  \`<html><head>\${ui.styles()}</head><body>\${ui.alert({ dismissible: true }, 'hi')}\${ui.themeToggle()}</body></html>\`
`,
  );

  /*
   * dist/ is served at /repo/, so every URL the page links or imports has
   * to start with /repo/ and name a file at the rest of it — the check a
   * GitHub Pages project site makes in production.
   */
  const assertServed = async (label) => {
    fs.rmSync(distDir, { recursive: true, force: true });
    await runBuild(fixtureDir, ['--base', '/repo/']);

    const html = fs.readFileSync(path.join(distDir, 'ui', 'index.html'), 'utf8');
    const urls = [
      ...html.matchAll(/href="([^"]*\/su\/[^"]*)"|import\('([^']*)'\)/g),
    ].map(([, href, specifier]) => href ?? specifier);

    assert.equal(urls.length, 3, `${label}: the sheet and two modules`);

    for (const url of urls) {
      assert.ok(url.startsWith('/repo/su/'), `${label}: ${url} is under the base`);
      assert.ok(
        fs.existsSync(path.join(distDir, url.slice('/repo/'.length))),
        `${label}: ${url} is in dist/ where /repo/ serves it`,
      );
    }

    assert.equal(fs.existsSync(path.join(distDir, 'repo')), false, `${label}: nothing under dist/repo/`);
  };

  await assertServed('default');

  fs.writeFileSync(
    configPath,
    `export default {
  site: 'https://example.com',
  uiClient: { base: '/repo/su/' },
}
`,
  );
  await assertServed('uiClient.base with the base in it');

  // Registered in vite.config, the plugin also runs in the server
  // html-pages renders pages through, which never sees --base.
  fs.rmSync(configPath);
  fs.writeFileSync(
    viteConfigPath,
    `import sitelo from ${JSON.stringify(path.join(rootDir, 'src/index.js'))}

export default { plugins: [sitelo()] }
`,
  );
  await assertServed('plugin in vite.config');
});

test('sitelo build prints a build report', async (t) => {
  const configPath = path.join(fixtureDir, 'sitelo.config.js');
  const originalConfig = fs.readFileSync(configPath, 'utf8');

  const cleanup = () => {
    fs.writeFileSync(configPath, originalConfig);
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  const { stdout } = await runBuild(fixtureDir);

  assert.match(stdout, /build report/);
  assert.match(stdout, /pages\s+\d+ files?\s+[\d.]+ (B|kB|MB)/);
  assert.match(stdout, /total\s+\d+ files?\s+[\d.]+ (B|kB|MB)/);
  assert.match(stdout, /largest/);
  // Phase timings: a build always has at least the vite phase and a total.
  assert.match(stdout, /vite \d+(\.\d+)?m?s/);
  assert.match(stdout, /total \d+(\.\d+)?m?s/);
});

test('sitelo build report can be disabled', async (t) => {
  const configPath = path.join(fixtureDir, 'sitelo.config.js');
  const originalConfig = fs.readFileSync(configPath, 'utf8');

  const cleanup = () => {
    fs.writeFileSync(configPath, originalConfig);
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  fs.writeFileSync(
    configPath,
    `export default {
  site: 'https://example.com',
  buildReport: false,
}
`,
  );

  const { stdout: disabled } = await runBuild(fixtureDir);
  assert.doesNotMatch(disabled, /build report/);

  // --logLevel silent suppresses it too, even with the default config.
  fs.writeFileSync(configPath, originalConfig);
  const { stdout: silent } = await runBuild(fixtureDir, [
    '--logLevel',
    'silent',
  ]);
  assert.doesNotMatch(silent, /build report/);
});

test('config errors carry exactly one [sitelo] prefix', async (t) => {
  const configPath = path.join(fixtureDir, 'sitelo.config.js');
  const originalConfig = fs.readFileSync(configPath, 'utf8');

  const cleanup = () => {
    fs.writeFileSync(configPath, originalConfig);
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  // bin/sitelo.js prefixes anything it reports, so modules on that path
  // must not prefix their own thrown messages.
  const cases = [
    ['{ pagefind: "nonsense" }', /"pagefind" must be true or an object/],
    ['{ buildReport: { top: -1 } }', /"buildReport.top" must be a non-negative integer/],
    ['{ linkCheck: "loud" }', /"linkCheck.mode" must be 'warn' or 'error'/],
    ['{ vite: "nope" }', /sitelo\.config\.js "vite" must be an object/],
    ['42', /sitelo\.config\.js must export a configuration object/],
  ];

  for (const [config, expected] of cases) {
    fs.writeFileSync(configPath, `export default ${config}\n`);

    const failure = await runBuild(fixtureDir).then(
      () => null,
      (error) => error,
    );

    assert.ok(failure, `expected ${config} to fail the build`);

    const output = `${failure.stdout ?? ''}${failure.stderr ?? ''}`;

    assert.match(output, expected);
    assert.doesNotMatch(
      output,
      /\[sitelo\] \[sitelo\]/,
      `doubled prefix for ${config}`,
    );
    assert.match(output, new RegExp(`\\[sitelo\\] ${expected.source}`));
  }
});


async function runCli(args, cwd = fixtureDir) {
  return execFileAsync(process.execPath, [cliPath, ...args], {
    cwd,
    env: process.env,
    // A regression here starts a server that never exits.
    timeout: 20_000,
  }).then(
    (result) => ({ code: 0, output: `${result.stdout}${result.stderr}` }),
    (error) => ({ code: error.code, signal: error.signal, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }),
  );
}

/**
 * Start `sitelo dev` or `sitelo preview` on a free port, stopped when the
 * test ends, and resolve with its URL once it answers.
 */
async function startServer(t, command) {
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
    [cliPath, command, '--port', String(port), '--strictPort', '--logLevel', 'error'],
    { cwd: fixtureDir, env: process.env, stdio: 'ignore' },
  );
  t.after(() => child.kill('SIGTERM'));

  const base = `http://localhost:${port}`;
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const up = await fetch(`${base}/`).then(() => true, () => false);
    if (up) break;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  return base;
}

test('a mistyped command or a stray argument fails instead of starting a server', async () => {
  const cases = [
    [['biuld'], /\[sitelo\] Unknown command: biuld \(expected dev, build, preview, lighthouse/],
    [['build', 'docs'], /\[sitelo\] Unexpected argument: docs \(to point sitelo at another directory, use --root docs\)/],
    [['dev', '--port', 'abc'], /\[sitelo\] --port must be a port number, got "abc"/],
    [['dev', '--port', '70000'], /\[sitelo\] --port must be a port number, got "70000"/],
    [['dev', '--logLevel', 'loud'], /\[sitelo\] --logLevel must be one of info, warn, error, silent, got "loud"/],
  ];

  for (const [args, expected] of cases) {
    const result = await runCli(args);

    assert.equal(result.signal ?? null, null, `sitelo ${args.join(' ')} had to be killed`);
    assert.equal(result.code, 1, `sitelo ${args.join(' ')} exits 1`);
    assert.match(result.output, expected);
  }
});

test('a failed build reports in sitelo\'s name, with stacks only under --debug', async (t) => {
  const pagePath = path.join(fixtureDir, 'src', 'index.ht.js');
  const originalPage = fs.readFileSync(pagePath, 'utf8');

  const cleanup = () => {
    fs.writeFileSync(pagePath, originalPage);
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  fs.writeFileSync(
    pagePath,
    'export default () => `<html><head><script type="module" src="/js/missing.js"></script></head><body></body></html>`\n',
  );

  const plain = await runCli(['build']);

  assert.equal(plain.code, 1);
  assert.match(
    plain.output,
    /\[sitelo\] Missing JavaScript asset \(src\/index\.ht\.js\): \/js\/missing\.js/,
  );
  assert.doesNotMatch(plain.output, /\[sitelo\] \[sitelo\]/);
  assert.doesNotMatch(plain.output, /vite-plugin-html-pages/);
  assert.doesNotMatch(plain.output, /node_modules/);
  assert.doesNotMatch(plain.output, /^\s+at /m);
  assert.match(plain.output, /--debug/);

  const debug = await runCli(['build', '--debug']);

  assert.equal(debug.code, 1);
  assert.match(debug.output, /\[sitelo\] Missing JavaScript asset/);
  assert.doesNotMatch(debug.output, /\[plugin vite-plugin-html-pages\]/);
  assert.match(debug.output, /^\s+at .*node_modules/m);
});

test('a JSON file that does not parse is named, not [object Object]', async (t) => {
  const pagePath = path.join(fixtureDir, 'src', 'index.ht.js');
  const dataPath = path.join(fixtureDir, 'src', 'data.json');
  const originalPage = fs.readFileSync(pagePath, 'utf8');

  const cleanup = () => {
    fs.writeFileSync(pagePath, originalPage);
    fs.rmSync(dataPath, { force: true });
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, '.sitelo'), {
      recursive: true,
      force: true,
    });
  };

  cleanup();
  t.after(cleanup);

  fs.writeFileSync(dataPath, '{ "a": 1, }\n');
  fs.writeFileSync(
    pagePath,
    "import data from './data.json';\nexport default () => `<html lang=\"en\"><head><title>x</title></head><body>${data.a}</body></html>`\n",
  );

  for (const args of [['build'], ['build', '--debug']]) {
    const result = await runCli(args);

    assert.equal(result.code, 1, `sitelo ${args.join(' ')} exits 1`);
    // Rolldown hands over the transform's options as the failing id, and
    // the Vite fork's plugin container puts the file back.
    assert.match(
      result.output,
      /\[sitelo\] .*src[\\/]data\.json\ntrailing comma at line 1 column 11/,
    );
    assert.doesNotMatch(result.output, /\[object Object\]/);
    assert.doesNotMatch(result.output, /\[sitelo\] \[sitelo\]/);
  }
});

test('a logLevel set in vite.config reaches the logger', async (t) => {
  const viteConfig = path.join(fixtureDir, 'vite.config.mjs');

  const cleanup = () => {
    fs.rmSync(viteConfig, { force: true });
    fs.rmSync(distDir, { recursive: true, force: true });
  };

  cleanup();
  t.after(cleanup);

  fs.writeFileSync(viteConfig, "export default { logLevel: 'silent' }\n");

  const quiet = await runCli(['build']);
  assert.equal(quiet.code, 0, quiet.output);
  // The logger sitelo hands Vite used to be made at `info` whatever the
  // config said, so this printed the whole build.
  assert.doesNotMatch(quiet.output, /built in|build report/);

  // The flag still wins over the file.
  const loud = await runCli(['build', '--logLevel', 'info']);
  assert.match(loud.output, /built in/);
});

test('sitelo preview resolves the config in production mode, like the build', async (t) => {
  const viteConfig = path.join(fixtureDir, 'vite.config.mjs');
  const modes = path.join(fixtureDir, 'modes.txt');

  const cleanup = () => {
    fs.rmSync(viteConfig, { force: true });
    fs.rmSync(modes, { force: true });
    fs.rmSync(distDir, { recursive: true, force: true });
  };

  cleanup();
  t.after(cleanup);

  await runBuild(fixtureDir);

  fs.writeFileSync(
    viteConfig,
    `import fs from 'node:fs'\nexport default ({ command, mode }) => { fs.appendFileSync(${JSON.stringify(modes)}, \`\${command} \${mode}\\n\`); return {} }\n`,
  );

  await startServer(t, 'preview');

  const resolved = fs.readFileSync(modes, 'utf8').trim().split('\n')
  assert.ok(resolved.length > 0)
  assert.deepEqual(
    [...new Set(resolved)],
    ['serve production'],
    'every resolution of the config is in production mode',
  );
});

/**
 * A build writes `about/index.html` for `/about`. Vite's preview server
 * only tries `about.html`, then answered with the home page and a 200 —
 * for `/about` and for a path that does not exist alike.
 */
test('sitelo preview serves clean URLs the way a static host does', async (t) => {
  const aboutPage = path.join(fixtureDir, 'src', 'about.ht.js');

  const cleanup = () => {
    fs.rmSync(aboutPage, { force: true });
    fs.rmSync(distDir, { recursive: true, force: true });
  };

  cleanup();
  t.after(cleanup);

  fs.writeFileSync(
    aboutPage,
    "export default () => '<html lang=\"en\"><head><title>About the fixture</title></head><body></body></html>'\n",
  );

  await runBuild(fixtureDir);
  assert.ok(fs.existsSync(path.join(distDir, 'about', 'index.html')));

  const base = await startServer(t, 'preview');
  const get = (pathname) => fetch(`${base}${pathname}`, { redirect: 'manual' });

  const about = await get('/about');
  assert.equal(about.status, 307);
  assert.equal(about.headers.get('location'), '/about/');

  const page = await get('/about/');
  assert.equal(page.status, 200);
  assert.match(await page.text(), /About the fixture/);

  const missing = await get('/nope');
  assert.equal(missing.status, 404);
  assert.equal(
    await missing.text(),
    fs.readFileSync(path.join(distDir, '404.html'), 'utf8'),
    'the build’s own 404 page',
  );
});

test('Vite\'s hints point at sitelo.config.js, not vite.config.js', async (t) => {
  const base = await startServer(t, 'dev');

  // The error overlay's tip ("You can also disable this overlay by setting
  // …"), which the client is served with.
  const client = await fetch(`${base}/@vite/client`).then((response) => response.text());
  assert.match(client, /"vite\.server\.hmr\.overlay"/);
  assert.match(client, /"sitelo\.config\.js"/);
  assert.doesNotMatch(client, /vite\.config\.js/);

  // The blocked-host error. fetch() would send its own Host header.
  const blocked = await new Promise((resolve, reject) => {
    http
      .get(`${base}/`, { headers: { host: 'example.com' } }, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => resolve({ status: response.statusCode, body }));
      })
      .on('error', reject);
  });
  assert.equal(blocked.status, 403);
  assert.match(
    blocked.body,
    /add "example\.com" to `vite\.server\.allowedHosts` in sitelo\.config\.js/,
  );
});
