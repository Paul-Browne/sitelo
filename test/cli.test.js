import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import fs from 'node:fs';
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

test('sitelo build with pagefind: true indexes into dist/ and leaves public/ alone', async (t) => {
  const configPath = path.join(fixtureDir, 'sitelo.config.js');
  const originalConfig = fs.readFileSync(configPath, 'utf8');
  const searchPage = path.join(fixtureDir, 'src', 'search.ht.js');
  const publicDir = path.join(fixtureDir, 'public');
  const publicPagefind = path.join(publicDir, 'pagefind');

  const cleanup = () => {
    fs.writeFileSync(configPath, originalConfig);
    fs.rmSync(searchPage, { force: true });
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(publicDir, { recursive: true, force: true });
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

  // A page that links the bundle from its HTML. The page validator used to
  // fail this on a fresh checkout: nothing is behind /pagefind/ until the
  // index is written, after the Vite build the validator runs in.
  fs.writeFileSync(
    searchPage,
    "export default () => '<!doctype html><html lang=\"en\"><head><title>Search</title><link rel=\"stylesheet\" href=\"/pagefind/pagefind-ui.css\"><script src=\"/pagefind/pagefind-ui.js\" defer></script></head><body><main data-pagefind-body><h1>Search</h1></main></body></html>'\n",
  );

  const { stdout } = await runBuild(fixtureDir);

  assert.ok(
    fs.existsSync(path.join(distDir, 'pagefind', 'pagefind-ui.js')),
    'expected dist/pagefind/pagefind-ui.js',
  );
  assert.equal(fs.existsSync(publicDir), false, 'nothing is written into public/');
  assert.doesNotMatch(stdout, /public\/pagefind/);

  // A copy an earlier sitelo left is pointed out, and left alone.
  fs.mkdirSync(publicPagefind, { recursive: true });
  fs.writeFileSync(path.join(publicPagefind, 'pagefind-entry.json'), '{}');

  const { stdout: withLeftover } = await runBuild(fixtureDir);

  assert.match(withLeftover, /pagefind: public\/pagefind\/ is a copy an earlier sitelo kept there/);
  assert.deepEqual(fs.readdirSync(publicPagefind), ['pagefind-entry.json']);

  // syncPublic still copies, for a site that asks.
  fs.rmSync(publicDir, { recursive: true, force: true });
  fs.writeFileSync(
    configPath,
    `export default {
  site: 'https://example.com',
  pagefind: { syncPublic: true },
}
`,
  );

  await runBuild(fixtureDir);

  assert.ok(fs.existsSync(path.join(publicPagefind, 'pagefind-ui.js')), 'syncPublic: true copies');
});

test('sitelo dev serves search from the last build, under the base', async (t) => {
  const configPath = path.join(fixtureDir, 'sitelo.config.js');
  const originalConfig = fs.readFileSync(configPath, 'utf8');

  const cleanup = () => {
    fs.writeFileSync(configPath, originalConfig);
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(fixtureDir, 'public'), { recursive: true, force: true });
  };

  cleanup();
  t.after(cleanup);

  fs.writeFileSync(configPath, "export default { site: 'https://example.com', pagefind: true }\n");
  await runBuild(fixtureDir);

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
    [cliPath, 'dev', '--port', String(port), '--strictPort', '--base', '/repo/', '--logLevel', 'error'],
    { cwd: fixtureDir, env: process.env, stdio: 'ignore' },
  );
  t.after(() => child.kill('SIGTERM'));

  const url = `http://localhost:${port}/repo/pagefind/pagefind-ui.js`;
  const deadline = Date.now() + 15_000;
  let response;

  while (Date.now() < deadline) {
    response = await fetch(url).catch(() => null);
    if (response) break;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  assert.equal(response?.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /javascript/);
  assert.equal(fs.existsSync(path.join(fixtureDir, 'public')), false);
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
      /Found both plugin options in sitelo\.config\.js/,
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
    ['pagefind: "nonsense"', /"pagefind" must be true or an object/],
    ['buildReport: { top: -1 }', /"buildReport.top" must be a non-negative integer/],
    ['linkCheck: "loud"', /"linkCheck.mode" must be 'warn' or 'error'/],
  ];

  for (const [option, expected] of cases) {
    fs.writeFileSync(configPath, `export default { ${option} }\n`);

    const failure = await runBuild(fixtureDir).then(
      () => null,
      (error) => error,
    );

    assert.ok(failure, `expected { ${option} } to fail the build`);

    const output = `${failure.stdout ?? ''}${failure.stderr ?? ''}`;

    assert.match(output, expected);
    assert.doesNotMatch(
      output,
      /\[sitelo\] \[sitelo\]/,
      `doubled prefix for { ${option} }`,
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
    [cliPath, 'preview', '--port', String(port), '--strictPort', '--logLevel', 'error'],
    { cwd: fixtureDir, env: process.env, stdio: 'ignore' },
  );
  t.after(() => child.kill('SIGTERM'));

  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const up = await fetch(`http://localhost:${port}/`).then(() => true, () => false);
    if (up) break;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  const resolved = fs.readFileSync(modes, 'utf8').trim().split('\n')
  assert.ok(resolved.length > 0)
  assert.deepEqual(
    [...new Set(resolved)],
    ['serve production'],
    'every resolution of the config is in production mode',
  );
});
