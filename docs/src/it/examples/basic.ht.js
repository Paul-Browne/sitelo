import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/it.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('it')

export default () =>
  examplesLayout({
    title: 'Sito di base',
    description:
      'Un progetto sitelo minimo e le configurazioni di deploy statico per Netlify, Vercel, Cloudflare Pages e AWS Amplify.',
    activeHref: '/it/examples/basic',
    children: [
      p(
        'Il più piccolo sito sitelo che serva a qualcosa: una pagina, un foglio di stile e le configurazioni degli host che pubblicano ',
        code('dist/'),
        '. Copia le configurazioni in qualunque progetto sitelo — presuppongono soltanto ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Una copia eseguibile si trova nel repository di sitelo sotto ',
        code('examples/basic/'),
        '.',
      ),
      h2('Cosa ottieni'),
      ul(
        { class: 'docs-list' },
        li('Un sito statico di una pagina costruito con sitelo'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ' e ',
          code('amplify.yml'),
        ),
        li(
          'Deploy con un clic / collegando il repository dalla cartella dell’esempio',
        ),
      ),
      h2('Struttura del progetto'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Build'),
      codeBlock('shell', s.build, 'bash'),
      h2('Deploy'),
      p(
        'Dal monorepo di sitelo, imposta la cartella radice/base della piattaforma su ',
        code('examples/basic'),
        '.',
      ),
      h3('Netlify'),
      codeBlock('netlify.toml', s.netlifyToml, 'toml'),
      h3('Vercel'),
      codeBlock('vercel.json', s.vercelJson, 'json'),
      p(
        a(
          {
            href: 'https://vercel.com/new/clone?repository-url=https://github.com/paul-browne/sitelo&root-directory=examples/basic&project-name=sitelo-basic',
            rel: 'noopener',
          },
          'Pubblica su Vercel',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Pubblica su Netlify',
        ),
        ' (imposta la cartella base su ',
        code('examples/basic'),
        ' quando te lo chiede).',
      ),
      h3('Cloudflare Pages'),
      p(
        'Dashboard: comando di build ',
        code('npm run build'),
        ', cartella di output ',
        code('dist'),
        '. Oppure ',
        code('npx wrangler pages deploy dist'),
        ' dopo una build locale.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Collega il repository in Amplify Hosting. Per S3 + CloudFront puro, fai la build in locale e sincronizza ',
        code('dist/'),
        ' con il bucket.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        'Lavori con Cursor, Copilot o un altro agente? Copia ',
        code('AGENTS.md'),
        ' da questo esempio (oppure vedi ',
        a({ href: '/it/docs/build-with-ai' }, 'Creare con l’IA'),
        ') così gli strumenti non si inventano schemi React/Next.',
      ),
      p(
        a({ href: '/it/docs' }, 'Primi passi'),
        ' · ',
        a({ href: '/it/docs/build-with-ai' }, 'Creare con l’IA'),
        ' · ',
        a({ href: '/it/examples/todo' }, 'App todo'),
        ' · ',
        a({ href: '/it/examples/islands' }, 'Esempio sulle island server'),
      ),
    ],
  })
