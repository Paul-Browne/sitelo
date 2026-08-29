import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/de.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('de')

export default () =>
  docsLayout({
    title: 'Mit KI entwickeln',
    description:
      'Gib Coding-Agenten aktuelles sitelo-Wissen mit llms.txt, Projektregeln und praktischen Tipps.',
    activeHref: '/de/docs/build-with-ai',
    children: [
      p(
        'KI-Editoren und Coding-Agenten liegen bei sitelo oft daneben: Sie greifen zu Mustern aus React, Next oder Astro, die hier nicht passen. Diese Anleitung zeigt, wie du sie auf die aktuelle sitelo-Dokumentation lenkst und generierten Code beim richtigen Modell hältst.',
      ),
      h2('llms.txt'),
      p(
        'sitelo veröffentlicht unter ',
        a({ href: '/llms.txt' }, 'sitelo.dev/llms.txt'),
        ' eine maschinenlesbare Zusammenfassung des Frameworks. Viele Agenten können eine URL abrufen; bitte deinen darum, diese Datei (und die Doku für Menschen) zu lesen, bevor er sitelo-Code schreibt.',
      ),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/llms.txt' }, 'https://sitelo.dev/llms.txt'),
          ' — API und Konventionen in kompakter Form',
        ),
        li(
          a({ href: '/de/docs' }, 'https://sitelo.dev/de/docs'),
          ' — vollständige Anleitungen',
        ),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'README auf GitHub'),
          ' — Denkmodell und Funktionsüberblick',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — Dokumentation zu ',
          code('javascript-to-html'),
          ' (empfohlen, um HTML in JS zu schreiben)',
        ),
      ),
      p(
        'Anders als ein Doku-MCP-Server braucht ',
        code('llms.txt'),
        ' keine Installation — füge die URL in den Chat ein, nimm sie in die Projektregeln auf, oder lass den Agenten sie abrufen.',
      ),
      h2('Projektregeln'),
      p(
        'Wenn dein Werkzeug dauerhafte Anweisungen unterstützt (',
        code('AGENTS.md'),
        ', Cursor-Regeln, Copilot-Instructions, …), ergänze eine kurze sitelo-Regel, damit jede Sitzung mit dem richtigen Denkmodell startet. Das ',
        a({ href: '/de/examples/basic' }, 'Basis-Beispiel'),
        ' enthält eine ',
        code('AGENTS.md'),
        ' zum Kopieren:',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Lege ',
        code('.cursor/rules/sitelo.mdc'),
        ' in deinem Projekt an (oder füge denselben Text in Cursors Oberfläche für Projektregeln ein):',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Tipps für KI-gestützte sitelo-Arbeit'),
      ul(
        { class: 'docs-list' },
        li(
          'Starte von einer Vorlage — lass den Agenten das Gerüst aus ',
          a({ href: '/de/examples/basic' }, 'examples/basic'),
          ' oder ',
          a({ href: '/de/examples/wordpress' }, 'examples/wordpress'),
          ' erzeugen, statt ein Framework zu erfinden.',
        ),
        li(
          'Bevorzuge ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          ') fürs Markup — Tag-Funktionen, die HTML-Strings zurückgeben, ohne Template-Engine und ohne React. Verweise Agenten auf ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ', damit sie keine JSX-Komponentenbäume erfinden.',
        ),
        li(
          'Seiten sind Funktionen, die HTML zurückgeben — ',
          code('export default () => `<html>…</html>`'),
          ' oder zusammengesetzt mit ',
          code('javascript-to-html'),
          '. JSX ist in Ordnung, solange es zu Strings kompiliert; eine React-Runtime ist nicht nötig.',
        ),
        li(
          'Nutze die sitelo-CLI — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' — statt ',
          code('vite'),
          ' direkt, sofern du nicht sicher eine eigene Vite-Konfiguration brauchst.',
        ),
        li(
          'Prüfe APIs gegen ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' — besonders ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ' und ',
          a({ href: '/de/docs/islands' }, 'Server-Islands'),
          '.',
        ),
        li(
          'Null JS von Haus aus — binde nur dann ein ',
          code('<script>'),
          ' ein, wenn die Seite Client-Code braucht; nicht referenzierte Module bleiben serverseitig.',
        ),
        li(
          'Prüfen und ausführen — starte nach jeder Änderung des Agenten an Seiten immer ',
          code('sitelo build'),
          ' (oder den Entwicklungsserver); behandle generiertes Markup als Entwurf.',
        ),
      ),
      p(
        a({ href: '/de/docs' }, 'Erste Schritte'),
        ' · ',
        a({ href: '/de/examples/basic' }, 'Basis-Beispiel'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
