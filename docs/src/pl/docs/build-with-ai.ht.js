import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/pl.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('pl')

export default () =>
  docsLayout({
    title: 'Tworzenie z AI',
    description:
      'Daj agentom programistycznym aktualną wiedzę o sitelo dzięki llms.txt, regułom projektu i praktycznym wskazówkom.',
    activeHref: '/pl/docs/build-with-ai',
    children: [
      p(
        'Edytory z AI i agenci programistyczni często zgadują o sitelo źle — sięgają po wzorce Reacta, Nexta albo Astro, które tu nie obowiązują. Ten przewodnik pokazuje, jak skierować je do aktualnej dokumentacji sitelo i utrzymać generowany kod w zgodzie z modelem.',
      ),
      h2('llms.txt'),
      p(
        'sitelo publikuje czytelne dla maszyn streszczenie frameworka pod adresem ',
        a({ href: '/llms.txt' }, 'sitelo.dev/llms.txt'),
        '. Wielu agentów potrafi pobrać URL; poproś swojego, żeby przeczytał ten plik (i dokumentację dla ludzi), zanim zacznie pisać kod sitelo.',
      ),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/llms.txt' }, 'https://sitelo.dev/llms.txt'),
          ' — zwięzłe API i konwencje',
        ),
        li(a({ href: '/pl/docs' }, 'https://sitelo.dev/docs'), ' — pełne przewodniki'),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'README na GitHubie'),
          ' — model myślowy i przegląd możliwości',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — dokumentacja ',
          code('javascript-to-html'),
          ' (zalecana do pisania HTML-a w JS)',
        ),
      ),
      p(
        'W odróżnieniu od serwera MCP z dokumentacją ',
        code('llms.txt'),
        ' nie wymaga instalacji — wklej URL do czatu, dodaj go do reguł projektu albo pozwól agentowi go pobrać.',
      ),
      h2('Reguły projektu'),
      p(
        'Jeśli Twoje narzędzie obsługuje trwałe instrukcje (',
        code('AGENTS.md'),
        ', reguły Cursora, instrukcje Copilota, …), dodaj krótką regułę o sitelo, żeby każda sesja zaczynała się z właściwym modelem myślowym. ',
        a({ href: '/pl/examples/basic' }, 'Podstawowy przykład'),
        ' zawiera ',
        code('AGENTS.md'),
        ', który możesz skopiować:',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Utwórz ',
        code('.cursor/rules/sitelo.mdc'),
        ' w swoim projekcie (albo wklej ten sam tekst w interfejs reguł projektu w Cursorze):',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Wskazówki do pracy nad sitelo z AI'),
      ul(
        { class: 'docs-list' },
        li(
          'Zacznij od szablonu — poproś agenta, żeby zbudował rusztowanie z ',
          a({ href: '/pl/examples/basic' }, 'examples/basic'),
          ' albo ',
          a({ href: '/pl/examples/wordpress' }, 'examples/wordpress'),
          ', zamiast wymyślać framework.',
        ),
        li(
          'Do znaczników wybieraj ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          '): funkcje-znaczniki zwracające ciągi HTML, bez silnika szablonów i bez Reacta. Skieruj agentów na ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ', żeby nie wymyślały drzew komponentów JSX.',
        ),
        li(
          'Strony to funkcje zwracające HTML — ',
          code('export default () => `<html>…</html>`'),
          ' albo złożone z ',
          code('javascript-to-html'),
          '. JSX jest w porządku, dopóki kompiluje się do ciągów; runtime Reacta nie jest potrzebny.',
        ),
        li(
          'Używaj CLI sitelo — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' — a nie ',
          code('vite'),
          ' bezpośrednio, chyba że wiesz, że potrzebujesz własnej konfiguracji Vite.',
        ),
        li(
          'Weryfikuj API względem ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' — zwłaszcza ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ' i ',
          a({ href: '/pl/docs/islands' }, 'wyspy serwerowe'),
          '.',
        ),
        li(
          'Zero JS domyślnie — podlinkuj ',
          code('<script>'),
          ' tylko wtedy, gdy strona potrzebuje kodu klienckiego; moduły bez odwołań zostają na serwerze.',
        ),
        li(
          'Przejrzyj i uruchom — po edycjach agenta zawsze rób ',
          code('sitelo build'),
          ' (albo odpal serwer deweloperski); traktuj wygenerowane znaczniki jak szkic.',
        ),
      ),
      p(
        a({ href: '/pl/docs' }, 'Pierwsze kroki'),
        ' · ',
        a({ href: '/pl/examples/basic' }, 'Podstawowy przykład'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
