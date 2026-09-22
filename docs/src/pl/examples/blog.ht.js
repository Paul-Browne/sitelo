import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pl.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('pl')

export default () =>
  examplesLayout({
    title: 'Blog w Markdownie',
    description:
      'Katalog plików markdown → statyczny blog z kanałem RSS, zbudowany przez sitelo i marked.',
    activeHref: '/pl/examples/blog',
    children: [
      p(
        'Podręcznikowe zastosowanie stron statycznych: pliki markdown w katalogu, jedna statyczna strona na wpis, kanał RSS i zero JavaScriptu po stronie klienta. Pełne źródło w ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '.',
      ),
      h2('Co dostajesz'),
      ul(
        { class: 'docs-list' },
        li('Stronę główną z listą wpisów, od najnowszego'),
        li(
          code('/blog/[slug]'),
          ' — jedną statyczną stronę HTML na plik markdown, dzięki ',
          code('generateStaticParams'),
        ),
        li(
          code('rss.xml'),
          ' — generowany przez sitelo z konfiguracji ',
          code('rss'),
        ),
        li(code('sitemap.xml'), ' — włączana przez ustawienie ', code('site')),
        li('Zero wysłanego JS-a — markdown jest parsowany podczas buildu, w Node'),
      ),
      h2('Układ projektu'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Pisz wpisy w markdownie'),
      p(
        'Wpisy żyją w ',
        code('content/'),
        ' — poza ',
        code('src/'),
        ', więc sitelo nigdy nie traktuje ich jak stron ani zasobów. Frontmatter to zwykłe linie ',
        code('klucz: wartość'),
        ':',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. Przeczytaj je i wyrenderuj w Node'),
      p(
        'Mały moduł wyłącznie serwerowy czyta katalog, parsuje frontmatter i renderuje markdown przez ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        '. Ponieważ nic w HTML-u nie odwołuje się do tego modułu, nigdy nie trafia on do przeglądarki.',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. Wypisz wpisy na stronie głównej'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Jedna statyczna strona na wpis'),
      p(
        code('generateStaticParams'),
        ' zwraca podczas buildu każdy slug; ',
        code('data()'),
        ' wczytuje dla każdej strony pasujący wpis.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. RSS w gratisie'),
      p(
        'Z powyższą konfiguracją ',
        code('rss'),
        ' polecenie ',
        code('sitelo build'),
        ' wypuszcza ',
        code('dist/rss.xml'),
        ' z jednym elementem na każdą stronę pod ',
        code('/blog'),
        ' — bez dodatkowego kodu.',
      ),
      p(
        a({ href: '/pl/docs/routing' }, 'Dokumentacja routingu'),
        ' · ',
        a({ href: '/pl/docs/data' }, 'Dokumentacja wczytywania danych'),
        ' · ',
        a({ href: '/pl/docs/configuration' }, 'Dokumentacja konfiguracji'),
      ),
    ],
  })
