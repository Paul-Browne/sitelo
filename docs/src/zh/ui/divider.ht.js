import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '分割线',
    description: '区块之间的一条线，中间可以带文字，也可以不带。',
    activeHref: '/zh/ui/divider',
    extraHead: uiHead(),
    children: [
      p(
        '分割线用来分开成组的内容。它渲染的是带 ',
        code('role="separator"'),
        ' 的元素，而不是 ',
        code('<hr>'),
        '，因为文字要放在里面，而 ',
        code('<hr>'),
        ' 不接受子元素。',
      ),

      h2('基础分割线'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, '上面的一切。'),
  divider(),
  text({ tone: 'muted' }, '下面的一切。'),
)`, { align: 'stretch' }),

      h2('带文字'),
      p('子元素会变成一段居中在线条里的文字。'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, '使用 GitHub 继续'),
  divider('或'),
  button({ block: true }, '使用邮箱继续'),
)`, { align: 'stretch' }),

      h2('间距'),
      p(
        code('spacing'),
        ' 设定上下的外边距，取自和其他一切相同的那套尺度。',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, '紧凑'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, '默认'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, '宽松'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, '结束'),
)`, { align: 'stretch' }),

      h2('垂直'),
      p(
        '垂直分割线需要一个能给它高度的父元素——也就是子项会拉伸的 flex 行，而 ',
        code('stack()'),
        ' 默认就是这样。',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4.1 kB'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 个页面'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 个区块'),
)`),

      h2('属性'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", '线条朝哪个方向走。'],
        ['spacing', 'Space', "'md'", '线条两侧的外边距。'],
      ]),
    ],
  })
