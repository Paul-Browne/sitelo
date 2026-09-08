import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '提示框',
    description: '悬停和获得焦点时出现的一小段提示，完全用 CSS 画出来。',
    activeHref: '/zh/ui/tooltip',
    extraHead: uiHead(),
    children: [
      p(
        '提示文字放在一个 data 属性里，由伪元素画出来，所以没有脚本、运行时没有什么要定位、DOM 里也不会留下残余。它在悬停和键盘聚焦时出现，后者由规则里 ',
        code(':focus-within'),
        ' 那一半负责。',
      ),

      h2('基础提示框'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: '复制到剪贴板' },
    iconButton({
      label: '复制',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: '重新构建站点' },
    button({ variant: 'outline', color: 'neutral' }, '重新构建'),
  ),
)`),

      h2('位置'),
      p('默认在上方；上方放不下时改到下方。'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: '在触发元素上方' },
    button({ variant: 'soft', color: 'neutral' }, '上方'),
  ),
  tooltip({ content: '在触发元素下方', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, '下方'),
  ),
)`),

      h2('无障碍名称'),
      p(
        '提示文字属于装饰——它是由 CSS 的 ',
        code('content'),
        ' 画出来的，而屏幕阅读器并不可靠地播报这类内容。里面的控件仍然需要自己的无障碍名称，那正是 ',
        code('iconButton()'),
        ' 的 ',
        code('label'),
        ' 提供的。当提示说了控件名称没说的信息时，传 ',
        code('label: true'),
        '，让它在一个视觉上隐藏的 span 里再说一遍。',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: '会立刻部署到生产环境', label: true },
    button({ color: 'danger' }, '部署'),
  ),
)`),

      h2('用在文字上'),
      p('提示框包住行内内容和包住按钮一样自然。'),
      demo(`text(
  '构建只往 ',
  tooltip({ content: '可以用 outDir 配置' }, code('dist/')),
  ' 里写东西，别处一概不动。',
)`, { align: 'stretch' }),

      h2('什么时候别用'),
      p(
        '提示框在触摸屏上根本不出现，指针一走它就消失。凡是读者非看到不可的内容——错误信息、必填字段的说明——都该放在字段自己的 ',
        code('help'),
        ' 文本里，而不是提示框里。',
      ),

      h2('属性'),
      propsTable([
        ['content', 'string', '', '提示的文字。'],
        ['placement', "'top' | 'bottom'", "'top'", '出现在触发元素的哪一侧。'],
        ['label', 'boolean', 'false', '另外用一个隐藏 span 把文字也提供给屏幕阅读器。'],
      ]),
    ],
  })
