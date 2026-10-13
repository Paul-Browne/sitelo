/**
 * The agent skills in `skills/`, installed with `npx skills add
 * Paul-Browne/sitelo` (https://github.com/vercel-labs/skills).
 *
 * A skill is prose an agent follows as instructions, so the ways it goes
 * wrong are quiet: a frontmatter field the installer rejects, a reference
 * file that was renamed, an import of a component that no longer exists.
 * The agent copies the example, the build fails in someone else's project,
 * and nothing here notices. This checks the shape the Agent Skills spec
 * (https://agentskills.io/specification) asks for, and that every API the
 * skills name is one the package exports.
 *
 * The component catalogue and the icon lists are compared both ways,
 * because a component or glyph added to the library and left out of the
 * skill is one no agent will reach for.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import * as ui from '../src/ui/index.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKILLS = path.join(ROOT, 'skills');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const skillNames = fs
  .readdirSync(SKILLS, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

/** Every Markdown file under `dir`, absolute. */
function markdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

/**
 * Split a SKILL.md into its frontmatter fields and body.
 *
 * Only the flat `key: value` lines these skills use; a nested `metadata`
 * map would need a real YAML parser, and would show up here as a field
 * this test does not know about.
 */
function readSkill(name) {
  const source = fs.readFileSync(path.join(SKILLS, name, 'SKILL.md'), 'utf8');
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source);
  assert.ok(match, `${name}/SKILL.md starts with a --- frontmatter block`);

  const fields = {};
  for (const line of match[1].split('\n')) {
    const field = /^([a-z-]+):\s*(.*)$/.exec(line);
    assert.ok(field, `${name}/SKILL.md frontmatter line is key: value — ${line}`);
    fields[field[1]] = field[2];
  }

  return { fields, body: match[2] };
}

/** The text of a `## heading` section, up to the next `## `. */
function section(markdown, heading) {
  const start = markdown.indexOf(`\n## ${heading}\n`);
  assert.notEqual(start, -1, `has a "## ${heading}" section`);
  const end = markdown.indexOf('\n## ', start + 1);
  return markdown.slice(start, end === -1 ? undefined : end);
}

/** The identifiers written in backticks, `like` `this`. */
const backticked = (text, pattern = /`([a-zA-Z][\w-]*)`/g) =>
  new Set([...text.matchAll(pattern)].map((match) => match[1]));

/** The module behind a `sitelo` or `sitelo/…` specifier, through the export map. */
async function loadEntry(specifier) {
  const key = specifier === 'sitelo' ? '.' : `./${specifier.slice('sitelo/'.length)}`;
  const entry = pkg.exports[key];
  assert.ok(entry, `${specifier} is in package.json "exports"`);
  return import(pathToFileURL(path.join(ROOT, entry.import)).href);
}

test('skills: there are skills to install', () => {
  assert.deepEqual(skillNames, ['sitelo', 'sitelo-ui']);
});

for (const name of skillNames) {
  test(`skills/${name}: frontmatter follows the Agent Skills spec`, () => {
    const { fields, body } = readSkill(name);

    assert.deepEqual(
      Object.keys(fields).filter((key) => !['name', 'description', 'license'].includes(key)),
      [],
      'only fields the spec defines and these skills use',
    );

    assert.equal(fields.name, name, 'name matches the directory');
    assert.ok(fields.name.length <= 64, 'name is at most 64 characters');
    assert.match(fields.name, /^[a-z0-9]+(-[a-z0-9]+)*$/, 'lowercase, digits and single hyphens');

    assert.ok(fields.description.length > 0, 'description is not empty');
    assert.ok(
      fields.description.length <= 1024,
      `description is at most 1024 characters (${fields.description.length})`,
    );
    // Some installers reject angle brackets in the metadata they index.
    assert.doesNotMatch(fields.description, /[<>]/, 'description has no angle brackets');
    assert.match(fields.description, /\bUse when\b/, 'description says when to use it');

    assert.ok(
      body.split('\n').length < 500,
      'SKILL.md stays under the 500 lines the spec recommends; move detail to references/',
    );
  });

  test(`skills/${name}: every relative link resolves inside the skill`, () => {
    const skillDir = path.join(SKILLS, name);

    for (const file of markdownFiles(skillDir)) {
      const text = fs.readFileSync(file, 'utf8');

      for (const [, href] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (/^(?:[a-z]+:|#)/i.test(href)) continue;

        const target = path.resolve(path.dirname(file), href.split('#')[0]);
        const where = path.relative(SKILLS, file);
        assert.ok(target.startsWith(skillDir + path.sep), `${where}: ${href} stays inside the skill`);
        assert.ok(fs.existsSync(target), `${where}: ${href} exists`);
      }
    }
  });

  test(`skills/${name}: every sitelo import names a real export`, async () => {
    for (const file of markdownFiles(path.join(SKILLS, name))) {
      const text = fs.readFileSync(file, 'utf8');
      const where = path.relative(SKILLS, file);

      for (const [, specifier] of text.matchAll(/['`](sitelo(?:\/[a-z-/]+)?)['`]/g)) {
        await loadEntry(specifier);
      }

      for (const [, names, specifier] of text.matchAll(
        /import\s*\{([^}]*)\}\s*from\s*'(sitelo(?:\/[a-z-/]+)?)'/g,
      )) {
        const exported = await loadEntry(specifier);

        for (const imported of names.split(',').map((part) => part.trim().split(/\s+as\s+/)[0])) {
          if (!imported) continue;
          assert.ok(imported in exported, `${where}: ${specifier} exports ${imported}`);
        }
      }
    }
  });
}

test('skills/sitelo-ui: every ui.* call is a sitelo/ui export', () => {
  for (const file of markdownFiles(path.join(SKILLS, 'sitelo-ui'))) {
    const text = fs.readFileSync(file, 'utf8');

    for (const [, called] of text.matchAll(/\bui\.([a-zA-Z]+)\(/g)) {
      assert.equal(
        typeof ui[called],
        'function',
        `${path.relative(SKILLS, file)}: ui.${called}() exists`,
      );
    }
  }
});

test('skills/sitelo-ui: the catalogue lists exactly what sitelo/ui exports', () => {
  const { body } = readSkill('sitelo-ui');
  const listed = backticked(section(body, 'What there is'));
  const exported = new Set(Object.keys(ui).filter((key) => key !== 'default'));

  // The aliases (`textLink`, `dataTable`, …) are named beside the
  // collisions they avoid rather than in the table.
  const named = backticked(body);
  assert.deepEqual(
    [...exported].filter((name) => !named.has(name)).sort(),
    [],
    'exports the skill never names',
  );
  assert.deepEqual(
    [...listed].filter((name) => !exported.has(name)).sort(),
    [],
    'catalogue entries sitelo/ui does not export',
  );
});

test('skills/sitelo-ui: the component reference covers every component', () => {
  const { body } = readSkill('sitelo-ui');
  const catalogue = section(body, 'What there is');
  // Icons and styling have references of their own.
  const components = catalogue
    .split('\n')
    .filter((row) => /^\| [A-Z]/.test(row) && !/^\| (?:Group|Icons|Styling) \|/.test(row))
    .flatMap((row) => [...backticked(row)]);

  const reference = fs.readFileSync(path.join(SKILLS, 'sitelo-ui/references/components.md'), 'utf8');
  const documented = backticked(reference, /`([a-zA-Z]+)(?:\(props\))?`/g);

  assert.ok(components.length > 50, 'read the catalogue rows');
  assert.deepEqual(
    components.filter((name) => !documented.has(name)),
    [],
    'components missing from references/components.md',
  );
});

test('skills/sitelo-ui: the icon reference matches the icon set', () => {
  const icons = fs.readFileSync(path.join(SKILLS, 'sitelo-ui/references/icons.md'), 'utf8');

  assert.deepEqual(
    [...backticked(section(icons, 'Glyphs'))].sort(),
    ui.iconNames(),
    'the glyph list is iconNames()',
  );

  const filled = /Fillable glyphs:([^.]*)\./.exec(section(icons, 'Filled'));
  assert.ok(filled, 'has a "Fillable glyphs: …." sentence');
  assert.deepEqual([...backticked(filled[1])].sort(), ui.fillableIcons());

  for (const alias of backticked(section(icons, 'Aliases'))) {
    if (alias === 'Alias' || alias === 'Glyph') continue;
    assert.ok(ui.hasIcon(alias), `${alias} resolves to a glyph`);
  }
});
