import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '复选框',
    description: '把复选框和它的标签合成一个控件——是真正的 input，用 CSS 装扮而不是替换掉。',
    activeHref: '/zh/ui/checkbox',
    extraHead: uiHead(),
    children: [
      p(
        code('checkbox()'),
        ' 渲染出一个 ',
        code('<label>'),
        '，里面包着真正的 ',
        code('<input type="checkbox">'),
        ' 和你看到的那个小方框。input 在视觉上被藏起来，但依然存在：能聚焦、会随表单提交，整个标签都是点击区域——勾选标记直接由 input 自己的 ',
        code(':checked'),
        ' 状态画出来，全程没有脚本。',
      ),

      h2('基础复选框'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: '通过邮件告知我更新', name: 'updates' }),
  checkbox({ label: '已勾选', name: 'checked', checked: true }),
)`),

      h2('颜色'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('禁用'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: '不可用', disabled: true }),
  checkbox({ label: '已开启并锁定', checked: true, disabled: true }),
)`),

      h2('长标签'),
      p(
        '方框会与第一行文字对齐，而不是相对整段文字居中。',
      ),
      demo(`checkbox({
  label: '每次构建后都跑一遍 Lighthouse 审计，任一分数低于阈值时让构建失败。',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('分组'),
      p(
        code('choiceGroup()'),
        ' 会由数据生成一组复选框，共用一个图例和 name。给 ',
        code('value'),
        ' 传数组即可勾选多项。',
      ),
      demo(`choiceGroup({
  legend: '生成',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Pagefind 索引' },
  ],
  help: '每一项都会在构建结束时写入 dist/。',
})`, { align: 'stretch' }),

      h2('横向排列'),
      demo(`choiceGroup({
  legend: '类别',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('搭配 field'),
      p(
        '单个复选框上面通常不需要再加一层标签。当一整组确实需要时，',
        code('field()'),
        ' 会给它和文本框一样的标签、帮助文本和错误处理。',
      ),
      demo(`field({ label: '条款', error: '需要接受条款才能继续。' },
  checkbox({ label: '我接受这些条款', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['label', 'Child', '', '方框旁边的文字。想要光秃秃的控件就省略它。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '勾选时的颜色。'],
        ['checked', 'boolean', 'false', '是否一开始就勾选。'],
        ['name', 'string', '', '表单字段名。'],
        ['value', 'string | number', '', '勾选时提交的值。'],
        ['disabled', 'boolean', 'false', '禁用 input 并让标签变淡。'],
      ]),
      p(
        '其余属性都会落到 ',
        code('<input>'),
        ' 上，而不是标签上——所以 ',
        code('required'),
        '、',
        code('onchange'),
        ' 和 ',
        code('data-*'),
        ' 都去到你预期的地方。要给标签本身加样式，请用 ',
        code('class'),
        '。',
      ),
      p(
        '由数据生成的一整组，请看',
        code('单选组'),
        '页面上的 ',
        code('choiceGroup()'),
        '——两种情况下它接受同样的选项，靠 ',
        code("type: 'checkbox'"),
        ' 切换。',
      ),
    ],
  })
