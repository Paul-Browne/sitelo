import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '切换组',
    description: '分段控件：把若干切换按钮拼成一个，或者做成链接，让每一段各自对应一个页面。',
    activeHref: '/zh/ui/toggle-group',
    extraHead: uiHead(),
    children: [
      p(
        '切换组是一排读起来像单个控件的选项。用 ',
        code('items'),
        ' 来搭，再用 ',
        code('value'),
        ' 指明哪一个是选中的。',
      ),

      h2('基础切换组'),
      demo(`toggleGroup({
  label: '文本对齐',
  value: 'center',
  items: [
    { value: 'left', label: '左对齐' },
    { value: 'center', label: '居中' },
    { value: 'right', label: '右对齐' },
  ],
})`),

      h2('纯字符串'),
      demo(`toggleGroup({ label: '密度', value: '舒适', items: ['紧凑', '舒适', '宽松'] })`),

      h2('链接'),
      p(
        '这通常才是静态站点想要的形态：每一段就是一个页面。带 ',
        code('href'),
        ' 的项会渲染成锚点，当前项标的是 ',
        code('aria-current="page"'),
        '，而不是 ',
        code('aria-pressed'),
        '——因为链接并不是一个被你按下去的按钮。',
      ),
      demo(`toggleGroup({
  label: '分区',
  value: 'ui',
  items: [
    { value: 'docs', label: '文档', href: '/zh/docs' },
    { value: 'ui', label: 'UI', href: '/zh/ui' },
    { value: 'examples', label: '示例', href: '/zh/examples' },
  ],
})`),

      h2('可以同时开多个'),
      p(
        '给 ',
        code('value'),
        ' 传一个数组。无论哪种情况，容器都只是普通的 ',
        code('group'),
        '——用 ',
        code('radiogroup'),
        ' 是不对的，因为这些是被按下的按钮，而不是单选钮。',
      ),
      demo(`toggleGroup({
  label: '格式',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: '加粗' },
    { value: 'italic', label: '斜体' },
    { value: 'underline', label: '下划线' },
  ],
})`),

      h2('尺寸与变体'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: '小号', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: '中号', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: '大号', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('禁用某些项'),
      demo(`toggleGroup({
  label: '渲染方式',
  value: 'static',
  items: [
    { value: 'static', label: '静态' },
    { value: 'islands', label: '区块' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('放在工具栏里'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: '对齐', value: '左对齐', size: 'sm', items: ['左对齐', '居中', '右对齐'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: '字形', value: ['加粗'], size: 'sm', items: ['加粗', '斜体'] }),
)`),

      h2('什么时候该换别的'),
      p(
        '如果这个选择要随表单一起提交，请用 ',
        code('choiceGroup()'),
        '——真正的单选钮，不需要脚本。如果每一段都是一个页面，请优先用上面的链接形态。切换组适合的是「由页面自己去响应」的那种选择。',
      ),

      h2('属性'),
      propsTable([
        ['items', 'Array', '[]', '字符串，或 { value, label, href, disabled } 对象。'],
        ['value', 'string | number | Array', '', '哪一项处于开启状态。可以多选时传数组。'],
        ['label', 'string', '', '这一组的无障碍名称。'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", '作用于每一项。'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", '未开启的项长什么样。'],
      ]),
    ],
  })
