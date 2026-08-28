import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/ru.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('ru')

export default () =>
  docsLayout({
    title: 'Разработка с ИИ',
    description:
      'Дайте кодовым агентам актуальные знания о sitelo с помощью llms.txt, правил проекта и практических советов.',
    activeHref: '/ru/docs/build-with-ai',
    children: [
      p(
        'ИИ-редакторы и кодовые агенты часто ошибаются насчёт sitelo: они тянутся к приёмам React, Next или Astro, которые здесь неприменимы. Это руководство показывает, как направить их на актуальную документацию sitelo и удержать генерируемый код в правильной модели.',
      ),
      h2('llms.txt'),
      p(
        'sitelo публикует машиночитаемое описание фреймворка по адресу ',
        a({ href: '/llms.txt' }, 'sitelo.js.org/llms.txt'),
        '. Многие агенты умеют загружать URL; попросите своего прочитать этот файл (и документацию для людей), прежде чем писать код на sitelo.',
      ),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/llms.txt' }, 'https://sitelo.js.org/llms.txt'),
          ' — компактное описание API и соглашений',
        ),
        li(
          a({ href: '/ru/docs' }, 'https://sitelo.js.org/ru/docs'),
          ' — полные руководства',
        ),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'README на GitHub'),
          ' — общая модель и обзор возможностей',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — документация ',
          code('javascript-to-html'),
          ' (рекомендуется для написания HTML на JS)',
        ),
      ),
      p(
        'В отличие от MCP-сервера с документацией, ',
        code('llms.txt'),
        ' не требует установки — вставьте URL в чат, добавьте его в правила проекта или дайте агенту загрузить его самому.',
      ),
      h2('Правила проекта'),
      p(
        'Если ваш инструмент поддерживает постоянные инструкции (',
        code('AGENTS.md'),
        ', правила Cursor, инструкции Copilot, …), добавьте короткое правило про sitelo, чтобы каждая сессия начиналась с верной модели. В ',
        a({ href: '/examples/basic' }, 'базовом примере'),
        ' есть ',
        code('AGENTS.md'),
        ', который можно скопировать:',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Создайте ',
        code('.cursor/rules/sitelo.mdc'),
        ' в своём проекте (или вставьте тот же текст в интерфейс правил проекта в Cursor):',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Советы по работе с sitelo и ИИ'),
      ul(
        { class: 'docs-list' },
        li(
          'Начинайте с шаблона — попросите агента развернуть каркас из ',
          a({ href: '/examples/basic' }, 'examples/basic'),
          ' или ',
          a({ href: '/examples/wordpress' }, 'examples/wordpress'),
          ', вместо того чтобы выдумывать фреймворк.',
        ),
        li(
          'Для разметки предпочитайте ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          ') — функции-теги, возвращающие строки HTML, без шаблонизатора и без React. Направьте агентов на ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ', чтобы они не выдумывали деревья JSX-компонентов.',
        ),
        li(
          'Страницы — это функции, возвращающие HTML: ',
          code('export default () => `<html>…</html>`'),
          ' или композиция через ',
          code('javascript-to-html'),
          '. JSX годится, пока компилируется в строки; рантайм React не нужен.',
        ),
        li(
          'Используйте CLI sitelo — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' — а не ',
          code('vite'),
          ' напрямую, если только вам точно не нужна своя конфигурация Vite.',
        ),
        li(
          'Сверяйте API с ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' — особенно ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ' и ',
          a({ href: '/ru/docs/islands' }, 'серверные острова'),
          '.',
        ),
        li(
          'Ноль JS по умолчанию — подключайте ',
          code('<script>'),
          ' только когда странице нужен клиентский код; модули без ссылок остаются на сервере.',
        ),
        li(
          'Проверяйте и запускайте — после правок агента всегда выполняйте ',
          code('sitelo build'),
          ' (или сервер разработки); считайте сгенерированную разметку черновиком.',
        ),
      ),
      p(
        a({ href: '/ru/docs' }, 'Начало работы'),
        ' · ',
        a({ href: '/examples/basic' }, 'Базовый пример'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
