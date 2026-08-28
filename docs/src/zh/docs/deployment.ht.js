import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/zh.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('zh')

export default () =>
  docsLayout({
    title: '部署',
    description:
      '把 sitelo 站点部署到 Netlify、Vercel、Cloudflare Pages、AWS Amplify、GitHub Pages 或任意静态托管。',
    activeHref: '/zh/docs/deployment',
    children: [
      p(
        'sitelo 的构建产物就是普通静态文件：',
        code('sitelo build'),
        ' 会把 HTML、CSS 和 JS 写入 ',
        code('dist/'),
        '。任何静态托管都可以 —— 下面的配置只假设 ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '。',
      ),
      p(
        '干净 URL 就是带 ',
        code('index.html'),
        ' 的目录（',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '），所以漂亮的 URL 开箱即用，不需要任何重定向规则。',
        code('404.html'),
        ' 会自动产出 —— 这正是 Netlify、Cloudflare Pages 和 GitHub Pages 都认得的约定。',
      ),
      p(
        '这些配置的可直接复制版本都在',
        a({ href: '/zh/examples/basic' }, '基础示例'),
        '里（仓库中的 ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        '）。',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        '在控制台构建：把构建命令设为 ',
        code('npm run build'),
        '，输出目录设为 ',
        code('dist'),
        '。或者用命令行部署：',
        code('npx wrangler pages deploy dist'),
        '。',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        '若只用 S3 + CloudFront：先 ',
        code('npm run build'),
        '，再把 ',
        code('dist/'),
        ' 同步到存储桶。',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        '部署在子路径下（',
        code('user.github.io/repo'),
        '）？构建时加上 ',
        code('--base /repo/'),
        '。',
      ),
      h2('发布之前'),
      ul(
        { class: 'docs-list' },
        li(
          '在 ',
          code('sitelo.config.js'),
          ' 中设置 ',
          code('site'),
          '，以便生成 ',
          code('sitemap.xml'),
          ' —— 参见',
          a({ href: '/zh/docs/configuration' }, '配置'),
        ),
        li(
          '添加 ',
          code('src/404.ht.js'),
          ' 做一个带自家风格的「未找到」页面（否则会产出一个简洁的默认页）',
        ),
        li(code('sitelo preview'), ' 在本地提供生产构建，供你做最后检查'),
      ),
    ],
  })
