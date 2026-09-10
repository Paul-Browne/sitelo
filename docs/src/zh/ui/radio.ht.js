import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '单选组',
    description: '在几个选项里挑一个：共用一个 name 的真正 radio 输入，外加图例和分组角色。',
    activeHref: '/zh/ui/radio',
    children: [
      p(
        '单选按钮用来在一小组可见选项里恰好选一个。',
        code('radio()'),
        ' 渲染其中一个；',
        code('choiceGroup()'),
        ' 从数组构建出整组，并给它加上图例和 ',
        code('role="radiogroup"'),
        '——正是这两样把它变成一个组，而不是一堆散装 input。',
      ),
      p(
        '它们共用一个 ',
        code('name'),
        '，所以互斥和方向键切换都由浏览器负责。这里不会送出任何脚本。',
      ),

      h2('基础单选组'),
      demo(`choiceGroup({
  legend: '套餐',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: '免费版' },
    { value: 'pro', label: '专业版' },
    { value: 'team', label: '团队版' },
  ],
})`, { align: 'stretch' }),

      h2('横向排列'),
      p(
        '短标签排成一行更好读。长标签还是竖着排比较好，那也是默认行为。',
      ),
      demo(`choiceGroup({
  legend: '设备形态',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('纯字符串'),
      p(
        '当值和标签本来就一样时，直接传字符串。',
      ),
      demo(`choiceGroup({
  legend: '日志级别',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('禁用某些选项'),
      demo(`choiceGroup({
  legend: '渲染方式',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: '静态' },
    { value: 'islands', label: '服务端区块' },
    { value: 'ssr', label: '完整 SSR', disabled: true },
  ],
  help: '完整 SSR 需要一个 Node 主机，而本项目没有。',
})`, { align: 'stretch' }),

      h2('一个一个来'),
      p(
        '当各个选项不够整齐、没法从数组里生成时——比如每一项都自带说明——就直接用 ',
        code('radio()'),
        '。',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: '每次推送都部署', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: '只在打了标签的发布时部署' }),
  radio({ name: 'deploy', value: 'manual', label: '手动部署' }),
)`, { align: 'stretch' }),

      h2('颜色'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('在卡片里'),
      demo(`card(
  cardHeader({ title: '构建设置', subtitle: '下次部署时生效' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: '干净 URL',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: '开' },
          { value: 'off', label: '关' },
        ],
      }),
      choiceGroup({
        legend: '图片',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: '缩放并转换格式' },
          { value: 'copy', label: '原样复制' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, '保存'),
  ),
)`, { align: 'stretch' }),

      h2('属性'),
      p(code('choiceGroup()'), '：'),
      propsTable([
        ['legend', 'Child', '', '整组的标签。'],
        ['name', 'string', '', '共用的表单字段名——正是它让这些单选互斥。'],
        ['options', 'Array', '[]', '字符串，或 { value, label, disabled } 对象。'],
        ['value', 'string | number | Array', '', '哪一项被选中。复选框时传数组。'],
        ['type', "'radio' | 'checkbox'", "'radio'", '构建哪种控件。同时也决定这一组的角色。'],
        ['direction', "'row' | 'column'", "'column'", '各选项怎么排布。'],
        ['help', 'Child', '', '这一组下方的提示。'],
      ]),
      p(code('radio()'), ' 接受和 ', code('checkbox()'), ' 一样的属性：', code('label'), '、', code('color'), '、', code('checked'), '、', code('name'), '、', code('value'), ' 和 ', code('disabled'), '。'),
    ],
  })
