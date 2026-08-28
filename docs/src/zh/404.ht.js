import { a, p } from 'javascript-to-html'
import { code, pageLayout } from '../lib/zh.js'

export default () =>
  pageLayout({
    title: '404 —— 页面未找到',
    description: '这个页面不存在。',
    children: [
      p(
        '这里什么也没有。页面可能已经移走，或者链接已经失效。',
        '（本页就是 ',
        code('src/zh/404.ht.js'),
        '，sitelo 会把它产出为 ',
        code('dist/zh/404.html'),
        '。）',
      ),
      p(
        a({ href: '/zh' }, '首页'),
        ' · ',
        a({ href: '/zh/docs' }, '文档'),
        ' · ',
        a({ href: '/zh/examples' }, '示例'),
      ),
    ],
  })
