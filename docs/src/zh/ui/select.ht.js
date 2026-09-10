import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '下拉选择',
    description: '原生 select，样式与其他输入控件一致，选项由数据生成。',
    activeHref: '/zh/ui/select',
    children: [
      p(
        '这是真正的 ',
        code('<select>'),
        '，用的是浏览器自带的下拉面板——也就是说没有 JavaScript 也能用、在手机上会正确弹出，而且不靠本库的任何东西就能用键盘操作。',
      ),
      p(
        code('select()'),
        ' 是光秃秃的控件；',
        code('selectField()'),
        ' 会给它包上标签、帮助文本和错误信息，做法和 ',
        code('textField()'),
        ' 一样。',
      ),

      h2('基础下拉'),
      p(
        '选项可以是纯字符串，这时值和显示文字就是同一个。',
      ),
      demo(`selectField({
  label: '主题',
  name: 'theme',
  options: ['浅色', '深色', '跟随系统'],
})`, { align: 'stretch' }),

      h2('值与文字'),
      p(
        '当提交的值和人读到的文字不一样时，就传对象。',
        code('value'),
        ' 标出当前选中的那一项。',
      ),
      demo(`selectField({
  label: '输出目录',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ —— 默认值' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('占位文字'),
      p(
        '占位文字会渲染成一个被禁用的首项，在没有 ',
        code('value'),
        ' 时处于选中状态——这样字段一开始是空的，同时又不构成一个有效选择。',
      ),
      demo(`selectField({
  label: '部署目标',
  name: 'target',
  placeholder: '选一个托管平台…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('分组'),
      p(
        '带有自己 ',
        code('options'),
        ' 数组的条目会变成一个 ',
        code('<optgroup>'),
        '。',
      ),
      demo(`selectField({
  label: '页面扩展名',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('尺寸'),
      demo(`stack({ gap: 'md' },
  selectField({ label: '小号', name: 'sm', size: 'sm', options: ['一', '二'] }),
  selectField({ label: '中号', name: 'md', size: 'md', options: ['一', '二'] }),
  selectField({ label: '大号', name: 'lg', size: 'lg', options: ['一', '二'] }),
)`, { align: 'stretch' }),

      h2('帮助、错误与禁用'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: '语言',
    name: 'locale',
    options: ['en', 'es', 'fr'],
    help: '用于 html 的 lang 属性。',
  }),
  selectField({
    label: '框架',
    name: 'framework',
    placeholder: '选一个…',
    options: ['sitelo'],
    error: '请先选一个框架才能继续。',
  }),
  selectField({
    label: '套餐',
    name: 'plan',
    options: ['免费版'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('由数据生成'),
      p(
        '选项不过是一个数组，所以通常直接来自 ',
        code('data()'),
        ' 已经为这个页面加载好的东西。',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: '你好，世界' },
    { slug: 'static-first', title: '静态优先' },
    { slug: 'no-runtime', title: '没有运行时' },
  ]

  return selectField({
    label: '置顶文章',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['options', 'SelectOption[]', '[]', '字符串、{ value, label, disabled } 对象，或用 { label, options } 表示一个分组。'],
        ['value', 'string | number', '', '哪一项处于选中状态。'],
        ['placeholder', 'string', '', '被禁用的首项，在没有值时处于选中状态。'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", '控件高度和文字大小。'],
        ['name', 'string', '', '表单字段名；id 由它推导而来。'],
        ['invalid', 'boolean', 'false', '设置 aria-invalid。selectField 会根据 error 帮你设好。'],
        ['disabled', 'boolean', 'false', '禁用该控件。'],
      ]),
      p(
        code('selectField()'),
        ' 还额外接受 ',
        code('label'),
        '、',
        code('help'),
        '、',
        code('error'),
        '、',
        code('required'),
        ' 和 ',
        code('fieldClass'),
        '——见 ',
        code('textField()'),
        '。子元素会追加在生成的选项之后，所以需要什么都可以自己手写。',
      ),
    ],
  })
