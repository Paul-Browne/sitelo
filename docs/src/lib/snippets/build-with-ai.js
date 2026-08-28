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

const AGENTS_RU = `# sitelo

Этот проект использует [sitelo](https://sitelo.js.org) — генератор статических сайтов на базе Vite.

## Правила

- Страницы — это модули внутри \`src/\` с расширениями вроде \`.ht.js\` / \`.ht.ts\` / \`.ht.jsx\`, которые **экспортируют по умолчанию функцию (или строку), возвращающую HTML**.
- **Не** добавляй React, Next.js, Astro или любой компонентный фреймворк с гидратацией, если пользователь не попросил об этом явно.
- Маршрутизация строится на файлах: \`about.ht.js\` → \`/about\`, \`[slug].ht.js\` → динамическая (используй \`generateStaticParams\` для \`sitelo build\`).
- Загружай данные через \`export async function data(ctx)\`. Для HTTP с кэшем используй \`fetchWithCache\` из \`sitelo\`.
- В \`dist/\` попадает только тот JS/CSS, на который ссылается HTML. Оставляй серверный код без ссылок, чтобы он никогда не публиковался.
- Конфигурация лежит в \`sitelo.config.js\`. Параметры Vite — под ключом \`vite\`.
- Команды: \`sitelo\` (dev), \`sitelo build\`, \`sitelo preview\`.
- Актуальные API смотри на https://sitelo.js.org/llms.txt и https://sitelo.js.org/docs — не выдумывай API из других фреймворков.
- Для разметки предпочитай [javascript-to-html](https://ht.js.org) (\`ht.js\`): функции-теги, возвращающие строки HTML. Документация: https://ht.js.org
`

const AGENTS_ZH = `# sitelo

本项目使用 [sitelo](https://sitelo.js.org) —— 一个由 Vite 驱动的静态站点生成器。

## 规则

- 页面是 \`src/\` 下的模块，扩展名形如 \`.ht.js\` / \`.ht.ts\` / \`.ht.jsx\`，并且**默认导出一个返回 HTML 的函数（或字符串）**。
- 除非用户明确要求，**不要**引入 React、Next.js、Astro 或任何组件/水合框架。
- 路由基于文件：\`about.ht.js\` → \`/about\`，\`[slug].ht.js\` → 动态路由（\`sitelo build\` 时使用 \`generateStaticParams\`）。
- 用 \`export async function data(ctx)\` 加载数据。需要带缓存的 HTTP 时，使用 \`sitelo\` 提供的 \`fetchWithCache\`。
- 只有被 HTML 引用的 JS/CSS 才会打包进 \`dist/\`。让服务端代码保持无引用，它就永远不会被发布。
- 配置写在 \`sitelo.config.js\` 里。Vite 选项放在 \`vite\` 下。
- 命令：\`sitelo\`（dev）、\`sitelo build\`、\`sitelo preview\`。
- 当前 API 请阅读 https://sitelo.js.org/llms.txt 和 https://sitelo.js.org/docs —— 不要照搬其他框架的 API。
- 标记优先使用 [javascript-to-html](https://ht.js.org)（\`ht.js\`）：返回 HTML 字符串的标签函数。文档：https://ht.js.org
`

const CURSOR_RU = `---
description: соглашения статических сайтов sitelo
alwaysApply: true
---

# sitelo

Страницы — это модули \`.ht.js\` (и т. п.), возвращающие строки HTML, а не компоненты React/Next/Astro.
Для разметки предпочитай javascript-to-html (https://ht.js.org). Используй файловую маршрутизацию, \`data()\` и \`sitelo build\`.
Об API sitelo смотри https://sitelo.js.org/llms.txt
`

const CURSOR_ZH = `---
description: sitelo 静态站点约定
alwaysApply: true
---

# sitelo

页面是返回 HTML 字符串的 \`.ht.js\`（等）模块，而不是 React/Next/Astro 组件。
标记优先使用 javascript-to-html (https://ht.js.org)。使用基于文件的路由、\`data()\` 和 \`sitelo build\`。
sitelo 的 API 请参阅 https://sitelo.js.org/llms.txt
`

const AGENTS_PT = `# sitelo

Este projeto usa o [sitelo](https://sitelo.js.org) — um gerador de sites estáticos assente no Vite.

## Regras

- As páginas são módulos dentro de \`src/\` com extensões como \`.ht.js\` / \`.ht.ts\` / \`.ht.jsx\` que **exportam por omissão uma função (ou string) que devolve HTML**.
- **Não** introduzas React, Next.js, Astro nem qualquer framework de componentes/hidratação, a menos que o utilizador peça explicitamente.
- O encaminhamento baseia-se em ficheiros: \`about.ht.js\` → \`/about\`, \`[slug].ht.js\` → dinâmica (usa \`generateStaticParams\` para \`sitelo build\`).
- Carrega dados com \`export async function data(ctx)\`. Usa \`fetchWithCache\` do \`sitelo\` para HTTP com cache.
- Só o JS/CSS referenciado a partir do HTML entra em \`dist/\`. Deixa o código de servidor sem referências para que nunca seja publicado.
- A configuração vive em \`sitelo.config.js\`. Coloca as opções do Vite sob \`vite\`.
- Comandos: \`sitelo\` (dev), \`sitelo build\`, \`sitelo preview\`.
- Para as APIs atuais, lê https://sitelo.js.org/llms.txt e https://sitelo.js.org/docs — não inventes APIs de outras frameworks.
- Prefere [javascript-to-html](https://ht.js.org) (\`ht.js\`) para a marcação: funções de etiqueta que devolvem strings HTML. Docs: https://ht.js.org
`

const CURSOR_PT = `---
description: convenções de sites estáticos do sitelo
alwaysApply: true
---

# sitelo

As páginas são módulos \`.ht.js\` (etc.) que devolvem strings HTML — não componentes de React/Next/Astro.
Prefere javascript-to-html (https://ht.js.org) para a marcação. Usa encaminhamento por ficheiros, \`data()\` e \`sitelo build\`.
Consulta https://sitelo.js.org/llms.txt para as APIs do sitelo.
`

const BY_LOCALE = {
  en: { agents: AGENTS_EN, cursorRule: CURSOR_EN },
  es: { agents: AGENTS_ES, cursorRule: CURSOR_ES },
  fr: { agents: AGENTS_FR, cursorRule: CURSOR_FR },
  de: { agents: AGENTS_DE, cursorRule: CURSOR_DE },
  ru: { agents: AGENTS_RU, cursorRule: CURSOR_RU },
  zh: { agents: AGENTS_ZH, cursorRule: CURSOR_ZH },
  pt: { agents: AGENTS_PT, cursorRule: CURSOR_PT },
}

export function buildWithAiSnippets(lang = 'en') {
  return BY_LOCALE[lang] ?? BY_LOCALE.en
}
