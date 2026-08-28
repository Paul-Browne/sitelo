import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/zh.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('zh')

export default () =>
  examplesLayout({
    title: '基础站点',
    description:
      '一个最小的 sitelo 项目，以及 Netlify、Vercel、Cloudflare Pages 与 AWS Amplify 的静态部署配置。',
    activeHref: '/zh/examples/basic',
    children: [
      p(
        '最小但可用的 sitelo 站点：一个页面、一份样式表，以及若干发布 ',
        code('dist/'),
        ' 的托管配置。把这些配置复制到任何 sitelo 项目里 —— 它们只假设 ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '。',
      ),
      p(
        '可运行的副本在 sitelo 仓库的 ',
        code('examples/basic/'),
        ' 下。',
      ),
      h2('你会得到什么'),
      ul(
        { class: 'docs-list' },
        li('一个用 sitelo 构建的单页静态站点'),
        li(
          code('netlify.toml'),
          '、',
          code('vercel.json'),
          '、',
          code('wrangler.toml'),
          ' 和 ',
          code('amplify.yml'),
        ),
        li('从示例目录一键部署，或连接仓库部署'),
      ),
      h2('项目结构'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('构建'),
      codeBlock('shell', s.build, 'bash'),
      h2('部署'),
      p(
        '在 sitelo 单体仓库中，把平台的根目录或基础目录设为 ',
        code('examples/basic'),
        '。',
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
          '部署到 Vercel',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          '部署到 Netlify',
        ),
        '（出现提示时把基础目录设为 ',
        code('examples/basic'),
        '）。',
      ),
      h3('Cloudflare Pages'),
      p(
        '控制台：构建命令 ',
        code('npm run build'),
        '，输出目录 ',
        code('dist'),
        '。或者在本地构建后执行 ',
        code('npx wrangler pages deploy dist'),
        '。',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        '在 Amplify Hosting 中连接仓库。若只用 S3 + CloudFront，就在本地构建，然后把 ',
        code('dist/'),
        ' 同步到存储桶。',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        '在用 Cursor、Copilot 或其他智能体？把本示例里的 ',
        code('AGENTS.md'),
        ' 复制过去（或参见',
        a({ href: '/zh/docs/build-with-ai' }, '用 AI 开发'),
        '），免得工具自己发明 React/Next 的写法。',
      ),
      p(
        a({ href: '/zh/docs' }, '快速开始'),
        ' · ',
        a({ href: '/zh/docs/build-with-ai' }, '用 AI 开发'),
        ' · ',
        a({ href: '/zh/examples/todo' }, '待办应用'),
        ' · ',
        a({ href: '/zh/examples/islands' }, '服务端区块示例'),
      ),
    ],
  })
