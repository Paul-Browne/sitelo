import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '文本框',
    description: '单行和多行文本输入，标签、帮助文本、错误信息和各种 id 都已经替你接好。',
    activeHref: '/zh/ui/text-field',
    extraHead: uiHead(),
    children: [
      p(
        '这里分两层。',
        code('input()'),
        ' 和 ',
        code('textarea()'),
        ' 是光秃秃的控件；',
        code('textField()'),
        ' 和 ',
        code('textareaField()'),
        ' 则把控件包上标签、帮助文本和错误信息，并用 ',
        code('for'),
        ' 和 ',
        code('aria-describedby'),
        ' 把它们连起来。除非你打算自己搭这套排版，否则请用后者。',
      ),

      h2('基础文本框'),
      demo(`textField({ label: '姓名', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('帮助文本'),
      p(
        '帮助文本通过 ',
        code('aria-describedby'),
        ' 关联，所以屏幕阅读器会把它当成这个字段的一部分来读，而不是后面一段游离的文字。',
      ),
      demo(`textField({
  label: '邮箱',
  name: 'email',
  type: 'email',
  help: '我们只会用它来通知构建失败。',
})`, { align: 'stretch' }),

      h2('必填与错误'),
      p(
        '一个 ',
        code('error'),
        ' 会把字段标为无效、给边框上色、设置 ',
        code('aria-invalid'),
        '，并让 ',
        code('aria-describedby'),
        ' 指向那条消息——一个属性，四件事全办了。',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: '项目', name: 'project', required: true, value: '' }),
  textField({
    label: '站点',
    name: 'site',
    error: '这不是一个 URL。',
    value: 'sitelo 点 dev',
  }),
)`, { align: 'stretch' }),

      h2('尺寸'),
      demo(`stack({ gap: 'md' },
  textField({ label: '小号', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: '中号', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: '大号', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('前后缀'),
      p(
        '贴在控件本身上的前缀或后缀，用来放单位和值里固定的那一截。',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: '站点', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: '构建超时', name: 'timeout', endAdornment: '秒', value: '30' }),
)`, { align: 'stretch' }),

      h2('禁用与只读'),
      demo(`stack({ gap: 'md' },
  textField({ label: '已禁用', name: 'disabled', value: '不能编辑', disabled: true }),
  textField({ label: '只读', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('多行'),
      p(
        code('textareaField()'),
        ' 就是同一个字段，只不过里面包的是 ',
        code('<textarea>'),
        '。它的值是元素内容而不是属性，这一点组件已经替你处理好了。',
      ),
      demo(`textareaField({
  label: '描述',
  name: 'description',
  rows: 4,
  help: '会出现在搜索结果和社交卡片里。',
  value: '由 Vite 驱动的零配置静态站点生成。',
})`, { align: 'stretch' }),

      h2('在表单里'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: '姓名', name: 'contact-name', required: true }),
      textField({ label: '邮箱', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: '留言', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, '取消'),
    button({ type: 'submit' }, '发送'),
  ),
)`, { align: 'stretch' }),

      h2('自己搭'),
      p(
        code('field()'),
        ' 就是单独那层外壳——它接受任意控件作为子元素，所以你可以把两个输入放在同一行，或者塞一个本库没有的控件，同时享有一样的标签和错误处理。',
      ),
      p(
        '一个标签没法同时命名两个控件，所以这里每个输入都需要自己的无障碍名称。那几个 ',
        code('aria-label'),
        ' 就是干这个的：可见标签命名的是这一对，而每个输入说明自己是哪一端。',
      ),
      demo(`field({ label: '日期范围', help: '两端都包含在内。' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': '起始' }),
    input({ type: 'date', name: 'to', 'aria-label': '结束' }),
  ),
)`, { align: 'stretch' }),

      h2('属性'),
      h3('textField 和 textareaField'),
      propsTable([
        ['label', 'Child', '', '字段标签。没有 name 时，控件的 id 也由它推导。'],
        ['name', 'string', '', '表单字段名；id 由它推导而来。'],
        ['help', 'Child', '', '控件下方的提示，用 aria-describedby 关联。'],
        ['error', 'Child | false', '', '错误信息。同时会在控件上设置 aria-invalid。'],
        ['required', 'boolean', 'false', '同时标记标签和控件。'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", '控件高度和文字大小。'],
        ['type', 'string', "'text'", '任意 input 类型。仅 textField 有效。'],
        ['startAdornment', 'Child', '', '贴在控件前面的前缀。仅 textField 有效。'],
        ['endAdornment', 'Child', '', '贴在控件后面的后缀。仅 textField 有效。'],
        ['value', 'string | number', '', '初始值。'],
        ['fieldClass', 'string', '', '加在外层容器上的类，而不是控件上。'],
      ]),
      p(
        'id 是从 ',
        code('name'),
        ' 推导出来的——没有 name 时则从 ',
        code('label'),
        ' 推导——而不是靠一个计数器，所以同一个页面每次构建都会生成一样的 HTML。想覆盖它就传 ',
        code('id'),
        '。',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', '标签文字。'],
        ['help', 'Child', '', '控件下方的提示。'],
        ['error', 'Child | false', '', '错误信息；同时给外层容器加上无效状态。'],
        ['required', 'boolean', 'false', '在标签上加必填标记。'],
        ['for', 'string', '', '被标注控件的 id。'],
      ]),
    ],
  })
