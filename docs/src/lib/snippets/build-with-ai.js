/**
 * Project-rules files for the Build with AI page.
 *
 * These are copy-paste artefacts the reader drops into their own repo, so the
 * prose is translated in full — an agent reads them as instructions, and a
 * Spanish-speaking team writes the rest of that file in Spanish.
 */

const AGENTS_EN = `# sitelo

This project uses [sitelo](https://sitelo.js.org) — a Vite-powered static site generator.

## Rules

- Pages are modules under \`src/\` with extensions like \`.ht.js\` / \`.ht.ts\` / \`.ht.jsx\` that **export a default function (or string) returning HTML**.
- Do **not** introduce React, Next.js, Astro, or a component/hydration framework unless the user explicitly asks.
- Routing is file-based: \`about.ht.js\` → \`/about\`, \`[slug].ht.js\` → dynamic (use \`generateStaticParams\` for \`sitelo build\`).
- Load data with \`export async function data(ctx)\`. Use \`fetchWithCache\` from \`sitelo\` for cached HTTP.
- Only JS/CSS referenced from HTML is bundled into \`dist/\`. Keep server-only code unreferenced so it never ships.
- Config lives in \`sitelo.config.js\`. Put Vite options under \`vite\`.
- Commands: \`sitelo\` (dev), \`sitelo build\`, \`sitelo preview\`.
- For current APIs, read https://sitelo.js.org/llms.txt and https://sitelo.js.org/docs — do not invent APIs from other frameworks.
- Prefer [javascript-to-html](https://ht.js.org) (\`ht.js\`) for markup: tag functions that return HTML strings. Docs: https://ht.js.org
`

const AGENTS_ES = `# sitelo

Este proyecto usa [sitelo](https://sitelo.js.org) — un generador de sitios estáticos basado en Vite.

## Reglas

- Las páginas son módulos dentro de \`src/\` con extensiones como \`.ht.js\` / \`.ht.ts\` / \`.ht.jsx\` que **exportan por defecto una función (o cadena) que devuelve HTML**.
- **No** introduzcas React, Next.js, Astro ni ningún framework de componentes o hidratación salvo que el usuario lo pida explícitamente.
- El enrutado se basa en archivos: \`about.ht.js\` → \`/about\`, \`[slug].ht.js\` → dinámica (usa \`generateStaticParams\` para \`sitelo build\`).
- Carga datos con \`export async function data(ctx)\`. Usa \`fetchWithCache\` de \`sitelo\` para HTTP cacheado.
- Solo el JS/CSS referenciado desde el HTML se empaqueta en \`dist/\`. Deja el código de servidor sin referenciar para que nunca se publique.
- La configuración vive en \`sitelo.config.js\`. Pon las opciones de Vite bajo \`vite\`.
- Comandos: \`sitelo\` (dev), \`sitelo build\`, \`sitelo preview\`.
- Para las APIs actuales, lee https://sitelo.js.org/llms.txt y https://sitelo.js.org/docs — no inventes APIs de otros frameworks.
- Prefiere [javascript-to-html](https://ht.js.org) (\`ht.js\`) para el marcado: funciones de etiqueta que devuelven cadenas HTML. Docs: https://ht.js.org
`

const CURSOR_EN = `---
description: sitelo static site conventions
alwaysApply: true
---

# sitelo

Pages are \`.ht.js\` (etc.) modules that return HTML strings — not React/Next/Astro components.
Prefer javascript-to-html (https://ht.js.org) for markup. Use file-based routing, \`data()\`, and \`sitelo build\`.
Prefer https://sitelo.js.org/llms.txt for sitelo APIs.
`

const CURSOR_ES = `---
description: convenciones de sitios estáticos con sitelo
alwaysApply: true
---

# sitelo

Las páginas son módulos \`.ht.js\` (etc.) que devuelven cadenas HTML — no componentes de React/Next/Astro.
Prefiere javascript-to-html (https://ht.js.org) para el marcado. Usa enrutado por archivos, \`data()\` y \`sitelo build\`.
Consulta https://sitelo.js.org/llms.txt para las APIs de sitelo.
`

export function buildWithAiSnippets(lang = 'en') {
  return lang === 'es'
    ? { agents: AGENTS_ES, cursorRule: CURSOR_ES }
    : { agents: AGENTS_EN, cursorRule: CURSOR_EN }
}
