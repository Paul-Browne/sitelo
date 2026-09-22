import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/it.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('it')

export default () =>
  docsLayout({
    title: 'Deploy',
    description:
      'Pubblica un sito sitelo su Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages o qualunque host statico.',
    activeHref: '/it/docs/deployment',
    children: [
      p(
        'Una build di sitelo è fatta di semplici file statici: ',
        code('sitelo build'),
        ' scrive HTML, CSS e JS in ',
        code('dist/'),
        '. Va bene qualunque host statico — le configurazioni qui sotto presuppongono soltanto ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Gli URL puliti sono cartelle con un ',
        code('index.html'),
        ' (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '), quindi gli URL eleganti funzionano da subito senza regole di redirect. Una ',
        code('404.html'),
        ' viene prodotta automaticamente — la convenzione che Netlify, Cloudflare Pages e GitHub Pages capiscono tutti.',
      ),
      p(
        'Versioni pronte da copiare di tutte queste si trovano nell’',
        a({ href: '/it/examples/basic' }, 'esempio di base'),
        ' (',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ' nel repository).',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Build dalla dashboard: imposta il comando di build ',
        code('npm run build'),
        ' e la cartella di output ',
        code('dist'),
        '. Oppure pubblica dalla CLI con ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'Per S3 + CloudFront puro: ',
        code('npm run build'),
        ', poi sincronizza ',
        code('dist/'),
        ' con il bucket.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        'Pubblichi sotto un sottopercorso (',
        code('user.github.io/repo'),
        ')? Fai la build con ',
        code('--base /repo/'),
        '.',
      ),
      h2('Prima di pubblicare'),
      ul(
        { class: 'docs-list' },
        li(
          'Imposta ',
          code('site'),
          ' in ',
          code('sitelo.config.js'),
          ' così viene generata la ',
          code('sitemap.xml'),
          ' — vedi ',
          a({ href: '/it/docs/configuration' }, 'Configurazione'),
        ),
        li(
          'Aggiungi un ',
          code('src/404.ht.js'),
          ' per una pagina “non trovato” con la tua identità (altrimenti ne viene prodotta una predefinita e pulita)',
        ),
        li(
          code('sitelo preview'),
          ' serve la build di produzione in locale per un ultimo controllo',
        ),
      ),
    ],
  })
