import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'
import { enhanceSnippets } from '../lib/snippets/enhance.js'

const s = enhanceSnippets('en')

export default () =>
  docsLayout({
    title: 'Enhancements',
    description:
      'Hand server-rendered markup to a small browser module, loaded only on pages that use it.',
    activeHref: '/docs/enhance',
    children: [
      p(
        'Some interactivity has to run in the browser: a counter, a copy button, a form that checks itself as you type. ',
        code('enhance()'),
        ' marks the markup a module should take over. The server renders the HTML as usual, so it works before any JavaScript arrives, and the browser loads the module only on pages that use it. The module adds behaviour to the DOM it finds. There is no hydration and no framework runtime.',
      ),
      p(
        'A ',
        a({ href: '/docs/islands' }, 'server island'),
        ' renders a region on a server when the page is viewed. An enhancement runs code for a region in the browser. The two take the same arguments and work together.',
      ),
      h2('Write the module'),
      p(
        'An enhancement is a plain module, anywhere under ',
        code('src/'),
        '. Its default export receives the element and the props. Read what you need from the markup, which the server already rendered:',
      ),
      codeBlock('src/client/counter.js', s.counterModule, 'javascript'),
      p(
        'TypeScript works too. Type the function with ',
        code('Enhancer<Props>'),
        ' from ',
        code('sitelo/enhance/client'),
        '.',
      ),
      h2('Place it in a page'),
      p(
        'Import ',
        code('enhance()'),
        ' from ',
        code('sitelo/enhance'),
        '. It takes the same arguments as ',
        code('island()'),
        ': a name, props, the HTML, and options. The HTML goes inside a ',
        code('<div>'),
        ' that the module receives.',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      p(
        'JSX escapes a string returned by a function, so the JSX tab spreads ',
        code('enhanceAttributes()'),
        ' onto the element instead. More on that below.',
      ),
      h2('Register the modules'),
      p(
        'The script the page links passes a map of names to modules to ',
        code('mountEnhancements()'),
        ':',
      ),
      codeBlock('src/enhance.js', s.registry, 'javascript'),
      p(
        'You write the map out by hand, on purpose. Each ',
        code('import()'),
        ' is an ordinary dynamic import, so the build gives every module its own chunk, and a page downloads only the ones its elements name. In dev, Vite serves them as they are. Because it is plain code, TypeScript checks it and knip follows it.',
      ),
      p(
        'Pass ',
        code('when'),
        ' to decide when a module is imported. It takes the same values as an island:',
      ),
      codeBlock('enhance-when', s.strategy, 'js'),
      ul(
        { class: 'docs-list' },
        li(code("'load'"), ' (default) — as soon as the page loads'),
        li(code("'idle'"), ' — on ', code('requestIdleCallback'), ' (falls back to a timeout)'),
        li(
          code("'visible'"),
          ' — when the element scrolls into view, via IntersectionObserver. ',
          code('rootMargin'),
          ' starts it early and defaults to ',
          code("'200px'"),
        ),
      ),
      h2('Your own element'),
      p(
        code('enhance()'),
        ' puts a ',
        code('<div>'),
        ' around the markup. When the element itself matters, like a ',
        code('<form>'),
        ' with its own ',
        code('action'),
        ', put the attributes on it with ',
        code('enhanceAttributes(name, props, options)'),
        '. It is an object of attributes, so javascript-to-html and JSX take it as attributes, and inside a template literal it becomes the attribute text:',
      ),
      pageCodeTabs({
        file: 'src/search.ht.js',
        template: s.formTemplate,
        ht: s.formHt,
        jsx: s.formJsx,
      }),
      p('The module gets the form itself:'),
      codeBlock('src/client/search.js', s.searchModule, 'javascript'),
      h2('What to pass as props'),
      p(
        'Props are JSON written into the page and handed to the module as its second argument. Every element on the page carries its own copy, so pass only what the markup does not already say: a setting with no natural place in the HTML, like ',
        code('minLength'),
        ' above. A value the page shows, like the counter’s starting number, is better read from the DOM, so the two cannot disagree. Large data belongs in the HTML itself, or in a file the module fetches.',
      ),
      p(
        'Unlike island props, these never go back to a server, so there is nothing to sign. They are in the page source, though, so keep secrets out of them.',
      ),
      h2('Checked when you build'),
      p(
        'The build reads the map out of your ',
        code('mountEnhancements()'),
        ' calls and fails on a page that names an enhancement the map does not have:',
      ),
      codeBlock('sitelo build', s.buildError, 'text'),
      p(
        code("missingAssets: 'warn'"),
        ' turns that into a warning, as it does for a missing script, and ',
        code('sitelo'),
        ' (dev) warns as each page renders. The build has to be able to read the map, so write it as an object literal in the call, or as a ',
        code('const'),
        ' in the same file. A map put together at runtime, with a spread or imported from another module, cannot be read, and then nothing is checked. Enhancements inside server islands are rendered at request time, so the build never sees them either.',
      ),
      h2('State and errors'),
      p(
        'Each element’s ',
        code('data-sitelo-enhance-state'),
        ' moves through ',
        code('pending'),
        ' (waiting for its moment), ',
        code('loading'),
        ' and ',
        code('ready'),
        '. If the module fails to load or throws, the state is ',
        code('error'),
        ', the server’s markup stays as it was, and the error goes to ',
        code('mountEnhancements(modules, { onError })'),
        ', or to the console. Use the state in CSS when the page should change once the module is in:',
      ),
      codeBlock('styles.css', s.stateCss, 'css'),
      h2('Good to know'),
      ul(
        { class: 'docs-list' },
        li(
          'The same enhancement can be on a page any number of times. The module is downloaded once and runs once per element, so keep per-element state inside the function, and look things up with ',
          code('element.querySelector()'),
          ' rather than across the whole document.',
        ),
        li(
          'An enhancement inside a server island is mounted when the island’s HTML arrives: the islands loader dispatches ',
          code('sitelo:island-load'),
          ', and ',
          code('mountEnhancements()'),
          ' listens for it. Load both loaders from the same script.',
        ),
        li(
          code('mountEnhancements()'),
          ' never runs a module twice on one element, so it is safe to call again after adding markup yourself.',
        ),
        li(
          'Want a framework in one box? Mount it from the module, as in ',
          code('createRoot(element).render(<Chart {...props} />)'),
          '. Only pages with that box download it.',
        ),
      ),
    ],
  })
