import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '滑块',
    description: '原生的 range 输入，样式与其他控件保持一致。',
    activeHref: '/zh/ui/slider',
    extraHead: uiHead(),
    children: [
      p(
        '这是一个真正的 ',
        code('<input type="range">'),
        '——方向键、Home 和 End，以及正确的播报，全都来自浏览器。被改样式的只有轨道和滑钮。',
      ),

      h2('基础滑块'),
      demo(`sliderField({ label: '质量', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('范围与步长'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: '音量', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: '列数', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: '缩放', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('显示数值'),
      p(
        code('showValue'),
        ' 会在轨道旁放一个 ',
        code('<output>'),
        '，里面是构建时的那个值。想让它跟着滑钮走，只需你自己写一行脚本——本库不为此附带任何脚本，而一个悄悄过期的数字比没有数字更糟。',
      ),
      demo(`sliderField({
  label: '图片质量',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: '数值越高，文件越大，构建也越慢。',
})`, { align: 'stretch' }),
      codeBlock('src/main.js', `for (const range of document.querySelectorAll('.su-slider')) {
  const output = range.parentElement.querySelector('output')

  if (output) range.addEventListener('input', () => { output.value = range.value })
}`, 'javascript'),

      h2('颜色'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('禁用'),
      demo(`sliderField({ label: '已锁定', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('不带标签'),
      p(
        '光秃秃的 ',
        code('slider()'),
        ' 就是控件本身——当没有可见标签指向它时，请给它一个 ',
        code('aria-label'),
        '。',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': '文字大小' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('在表单里'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: '图片最大宽度', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: '质量', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, '保存'),
  ),
)`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['min', 'number | string', '0', '下界。'],
        ['max', 'number | string', '100', '上界。'],
        ['step', 'number | string', '', '步长。省略则用浏览器默认的 1。'],
        ['value', 'number | string', '', '初始值。'],
        ['showValue', 'boolean', 'false', '加一个 <output>，内容是构建时的值。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '滑钮的颜色。'],
        ['name', 'string', '', '表单字段名；id 由它推导而来。'],
        ['disabled', 'boolean', 'false', '禁用该控件。'],
      ]),
      p(
        code('sliderField()'),
        ' 还额外接受 ',
        code('label'),
        '、',
        code('help'),
        '、',
        code('error'),
        ' 和 ',
        code('required'),
        '——见 ',
        code('textField()'),
        '。',
      ),
    ],
  })
