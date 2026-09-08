import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '开关',
    description: '给「一拨就生效」的设置用的开/关控件——底下是一个带 role="switch" 的复选框。',
    activeHref: '/zh/ui/switch',
    extraHead: uiHead(),
    children: [
      p(
        '开关适合那种一拨动就立刻生效的设置。复选框则适合稍后再用提交按钮确认的选择。如果你的控件待在一个底部有「保存」的表单里，那它应该是复选框。',
      ),
      p(
        '这个组件叫 ',
        code('toggle()'),
        ' 而不是 ',
        code('switch()'),
        '，理由无聊但躲不掉：',
        code('switch'),
        ' 是保留字，不能拿来当导入名。它底下是一个带 ',
        code('role="switch"'),
        ' 的真正 ',
        code('<input type="checkbox">'),
        '。',
      ),

      h2('基础开关'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: '公开站点', name: 'public' }),
  toggle({ label: '已开启', name: 'on', checked: true }),
)`),

      h2('颜色'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('禁用'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: '已关闭并锁定', disabled: true }),
  toggle({ label: '已开启并锁定', checked: true, disabled: true }),
)`),

      h2('不带标签'),
      p(
        '没有可见标签的开关同样需要无障碍名称。传一个 ',
        code('aria-label'),
        '，它会落到 input 上。',
      ),
      demo(`toggle({ 'aria-label': '启用 Pagefind 搜索', checked: true })`),

      h2('一份设置清单'),
      p(
        '常见做法：标签在左、开关在右，一项设置一行。',
      ),
      demo(`return list(
  [
    ['Pagefind 搜索', '构建结束时索引每一个页面。', true],
    ['图片优化', '构建时缩放并转换图片格式。需要 sharp。', true],
    ['服务端区块', '在请求时渲染被标记的区域。', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['label', 'Child', '', '开关旁边的文字。没有的话请用 aria-label。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '开启时轨道的颜色。'],
        ['checked', 'boolean', 'false', '是否一开始就是开的。'],
        ['name', 'string', '', '表单字段名。'],
        ['disabled', 'boolean', 'false', '禁用 input 并让整行变淡。'],
      ]),
      p(
        '其余属性都会落到 ',
        code('<input>'),
        ' 上——',
        code('onchange'),
        ' 和 ',
        code('aria-*'),
        ' 本来就该在那儿。',
      ),
    ],
  })
