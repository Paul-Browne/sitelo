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

const AGENTS_FR = `# sitelo

Ce projet utilise [sitelo](https://sitelo.js.org) — un générateur de sites statiques propulsé par Vite.

## Règles

- Les pages sont des modules dans \`src/\` avec des extensions comme \`.ht.js\` / \`.ht.ts\` / \`.ht.jsx\` qui **exportent par défaut une fonction (ou une chaîne) renvoyant du HTML**.
- N’introduis **pas** React, Next.js, Astro, ni un framework à composants/hydratation sauf demande explicite de l’utilisateur.
- Le routage se base sur les fichiers : \`about.ht.js\` → \`/about\`, \`[slug].ht.js\` → dynamique (utilise \`generateStaticParams\` pour \`sitelo build\`).
- Charge les données avec \`export async function data(ctx)\`. Utilise \`fetchWithCache\` depuis \`sitelo\` pour du HTTP mis en cache.
- Seuls les JS/CSS référencés depuis le HTML sont inclus dans \`dist/\`. Laisse le code serveur non référencé pour qu’il ne soit jamais livré.
- La configuration vit dans \`sitelo.config.js\`. Place les options Vite sous \`vite\`.
- Commandes : \`sitelo\` (dev), \`sitelo build\`, \`sitelo preview\`.
- Pour les API à jour, lis https://sitelo.js.org/llms.txt et https://sitelo.js.org/docs — n’invente pas d’API venant d’autres frameworks.
- Préfère [javascript-to-html](https://ht.js.org) (\`ht.js\`) pour le balisage : des fonctions de balise qui renvoient des chaînes HTML. Docs : https://ht.js.org
`

const AGENTS_DE = `# sitelo

Dieses Projekt verwendet [sitelo](https://sitelo.js.org) — einen Vite-basierten Generator für statische Websites.

## Regeln

- Seiten sind Module unter \`src/\` mit Endungen wie \`.ht.js\` / \`.ht.ts\` / \`.ht.jsx\`, die **eine Default-Funktion (oder einen String) exportieren, die HTML zurückgibt**.
- Führe **kein** React, Next.js, Astro oder Komponenten-/Hydration-Framework ein, sofern der Nutzer nicht ausdrücklich danach fragt.
- Das Routing basiert auf Dateien: \`about.ht.js\` → \`/about\`, \`[slug].ht.js\` → dynamisch (nutze \`generateStaticParams\` für \`sitelo build\`).
- Lade Daten mit \`export async function data(ctx)\`. Nutze \`fetchWithCache\` aus \`sitelo\` für gecachtes HTTP.
- Nur aus dem HTML referenziertes JS/CSS landet in \`dist/\`. Lass Server-Code unreferenziert, damit er nie ausgeliefert wird.
- Die Konfiguration liegt in \`sitelo.config.js\`. Vite-Optionen gehören unter \`vite\`.
- Befehle: \`sitelo\` (dev), \`sitelo build\`, \`sitelo preview\`.
- Für aktuelle APIs lies https://sitelo.js.org/llms.txt und https://sitelo.js.org/docs — erfinde keine APIs aus anderen Frameworks.
- Bevorzuge [javascript-to-html](https://ht.js.org) (\`ht.js\`) für Markup: Tag-Funktionen, die HTML-Strings zurückgeben. Docs: https://ht.js.org
`

const CURSOR_FR = `---
description: conventions de sites statiques sitelo
alwaysApply: true
---

# sitelo

Les pages sont des modules \`.ht.js\` (etc.) qui renvoient des chaînes HTML — pas des composants React/Next/Astro.
Préfère javascript-to-html (https://ht.js.org) pour le balisage. Utilise le routage par fichiers, \`data()\` et \`sitelo build\`.
Consulte https://sitelo.js.org/llms.txt pour les API de sitelo.
`

const CURSOR_DE = `---
description: sitelo-Konventionen für statische Websites
alwaysApply: true
---

# sitelo

Seiten sind \`.ht.js\`-Module (usw.), die HTML-Strings zurückgeben — keine React-/Next-/Astro-Komponenten.
Bevorzuge javascript-to-html (https://ht.js.org) für Markup. Nutze dateibasiertes Routing, \`data()\` und \`sitelo build\`.
Konsultiere https://sitelo.js.org/llms.txt für die sitelo-APIs.
`

const BY_LOCALE = {
  en: { agents: AGENTS_EN, cursorRule: CURSOR_EN },
  es: { agents: AGENTS_ES, cursorRule: CURSOR_ES },
  fr: { agents: AGENTS_FR, cursorRule: CURSOR_FR },
  de: { agents: AGENTS_DE, cursorRule: CURSOR_DE },
}

export function buildWithAiSnippets(lang = 'en') {
  return BY_LOCALE[lang] ?? BY_LOCALE.en
}
