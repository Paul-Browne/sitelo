import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/zh.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('zh')

export default () =>
  docsLayout({
    title: '用 AI 开发',
    description:
      '通过 llms.txt、项目规则和一些实用建议，让编码智能体掌握最新的 sitelo 知识。',
    activeHref: '/zh/docs/build-with-ai',
    children: [
      p(
        'AI 编辑器和编码智能体常常把 sitelo 搞错 —— 它们会套用 React、Next 或 Astro 的写法，而这些在这里并不适用。本指南说明如何把它们指向最新的 sitelo 文档，并让生成的代码保持在正确的模型上。',
      ),
      h2('llms.txt'),
      p(
        'sitelo 在 ',
        a({ href: '/llms.txt' }, 'sitelo.js.org/llms.txt'),
        ' 发布了一份机器可读的框架摘要。很多智能体都能抓取 URL；在写 sitelo 代码之前，让它先读这个文件（以及给人看的文档）。',
      ),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/llms.txt' }, 'https://sitelo.js.org/llms.txt'),
          ' —— 精简的 API 与约定',
        ),
        li(
          a({ href: '/zh/docs' }, 'https://sitelo.js.org/zh/docs'),
          ' —— 完整指南',
        ),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub README'),
          ' —— 心智模型与功能概览',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' —— ',
          code('javascript-to-html'),
          ' 的文档（推荐用它在 JS 里写 HTML）',
        ),
      ),
      p(
        '与文档型 MCP 服务器不同，',
        code('llms.txt'),
        ' 不需要安装 —— 把 URL 贴进对话、写进项目规则，或者让智能体自己抓取即可。',
      ),
      h2('项目规则'),
      p(
        '如果你的工具支持长期指令（',
        code('AGENTS.md'),
        '、Cursor 规则、Copilot instructions，…），加一条简短的 sitelo 规则，让每次会话都从正确的心智模型开始。',
        a({ href: '/zh/examples/basic' }, '基础示例'),
        '里就有一份可以直接复制的 ',
        code('AGENTS.md'),
        '：',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        '在项目里创建 ',
        code('.cursor/rules/sitelo.mdc'),
        '（或把同样的文本粘进 Cursor 的项目规则界面）：',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('用 AI 开发 sitelo 的建议'),
      ul(
        { class: 'docs-list' },
        li(
          '从模板出发 —— 让智能体基于 ',
          a({ href: '/zh/examples/basic' }, 'examples/basic'),
          ' 或 ',
          a({ href: '/zh/examples/wordpress' }, 'examples/wordpress'),
          ' 搭骨架，而不是自己发明一套框架。',
        ),
        li(
          '标记优先使用 ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          '（',
          code('ht.js'),
          '）—— 返回 HTML 字符串的标签函数，不需要模板引擎，也不需要 React。把智能体指向 ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          '，免得它们凭空造出 JSX 组件树。',
        ),
        li(
          '页面就是返回 HTML 的函数 —— ',
          code('export default () => `<html>…</html>`'),
          '，或者用 ',
          code('javascript-to-html'),
          ' 组合。只要 JSX 能编译成字符串就没问题；并不需要 React 运行时。',
        ),
        li(
          '使用 sitelo 的 CLI —— ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' —— 而不是直接调用 ',
          code('vite'),
          '，除非你确定需要自定义的 Vite 配置。',
        ),
        li(
          '对照 ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' 核实 API —— 尤其是 ',
          code('generateStaticParams'),
          '、',
          code('fetchWithCache'),
          ' 和',
          a({ href: '/zh/docs/islands' }, '服务端区块'),
          '。',
        ),
        li(
          '默认零 JS —— 只有页面确实需要客户端代码时才引入 ',
          code('<script>'),
          '；未被引用的模块会留在服务端。',
        ),
        li(
          '复查并运行 —— 智能体改完页面后，务必跑一次 ',
          code('sitelo build'),
          '（或开发服务器）；把生成的标记当作草稿看待。',
        ),
      ),
      p(
        a({ href: '/zh/docs' }, '快速开始'),
        ' · ',
        a({ href: '/zh/examples/basic' }, '基础示例'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
