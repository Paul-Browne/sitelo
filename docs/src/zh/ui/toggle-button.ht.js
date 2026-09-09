import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '切换按钮',
    description: '一个会保持按下状态的按钮——把设置做成按钮，而不是复选框。',
    activeHref: '/zh/ui/toggle-button',
    extraHead: uiHead(),
    children: [
      p(
        '切换按钮不是开就是关，并用 ',
        code('aria-pressed'),
        ' 把这件事说出来。文本编辑器里的加粗、已生效的筛选、正在显示的面板，都是这类。',
      ),
      p(
        '它背后既没有隐藏的 input，也没有脚本：在静态页面上，切换按钮是在',
        code('展示'),
        '一个状态，而不是改变它——改变它的是 ',
        code('setPressed()'),
        '。如果它属于表单，请改用 ',
        code('checkbox()'),
        '；如果它是列表里的一项设置，请用 ',
        code('toggle()'),
        '，也就是开关。',
      ),

      h2('基础切换按钮'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, '加粗'),
  toggleButton('斜体'),
  toggleButton('下划线'),
)`),

      h2('变体'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline 开'),
    toggleButton({ variant: 'outline' }, 'Outline 关'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost 开'),
    toggleButton({ variant: 'ghost' }, 'Ghost 关'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft 开'),
    toggleButton({ variant: 'soft' }, 'Soft 关'),
  ),
)`, { align: 'start' }),

      h2('尺寸'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, '小'),
  toggleButton({ size: 'md', pressed: true }, '中'),
  toggleButton({ size: 'lg', pressed: true }, '大'),
)`),

      h2('带图标'),
      p(
        '纯图标的切换按钮需要无障碍名称——传一个 ',
        code('aria-label'),
        '，它会落到按钮上。',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': '加粗',
    title: '加粗',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': '斜体',
    title: '斜体',
    startIcon: icon('italic'),
  }),
)`),

      h2('禁用'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, '开着且锁定'),
  toggleButton({ disabled: true }, '关着且锁定'),
)`),

      h2('让它真的做点事'),
      p(
        '一次调用把属性翻过来，样式自然跟上。在单选的 ',
        code('toggleGroup()'),
        ' 里，它还会顺手松开兄弟按钮。',
      ),
      codeBlock('任意位置', `toggleButton({ onclick: "import('/su/pressed.js').then(m=>m.set(this))" }, 'Bold')`, 'javascript'),
      p('或者从你自己的模块里调用——如果本来就有一个在跑的话：'),
      codeBlock('src/main.js', `import { setPressed } from 'sitelo/ui/client'

setPressed('bold')`, 'javascript'),

      h2('属性'),
      propsTable([
        ['pressed', 'boolean', 'false', '设置 aria-pressed。之后由 setPressed() 来改。'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", '未按下时按钮的样子。'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", '和 button() 同一套尺度。'],
        ['disabled', 'boolean', 'false', '禁用该按钮。'],
      ]),
      p(
        '其余属性都会落到 ',
        code('button()'),
        ' 上——',
        code('startIcon'),
        '、',
        code('endIcon'),
        '、',
        code('onclick'),
        ' 等等。要一整组的话，见 ',
        code('toggleGroup()'),
        '。',
      ),
    ],
  })
