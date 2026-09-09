import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '徽标',
    description: '别在所包裹元素角上的一个计数或小圆点。',
    activeHref: '/zh/ui/badge',
    extraHead: uiHead(),
    children: [
      p(
        '徽标包住某个元素，并在它的上角别一个记号：收件箱按钮上的未读数、头像上的在线圆点。被标记的东西作为子元素传进去。',
      ),

      h2('基础徽标'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, '收件箱')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('颜色'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('上限'),
      p(
        '超过 ',
        code('max'),
        ' 的计数会显示成 ',
        code('n+'),
        '，这样徽标就不会宽到把它所依附的元素带歪。',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, '九')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, '封顶到 99')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('圆点'),
      p(
        '圆点只说「有变化」，不说变了多少。请给它一个 ',
        code('label'),
        '——光秃秃的圆点对屏幕阅读器毫无意义，所以没有标签时它会被彻底移出无障碍树。',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: '在线' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: '需要处理' },
    iconButton({
      label: '设置',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('给计数加说明'),
      p(
        '孤零零一个数字脱离上下文就含糊不清。',
        code('label'),
        ' 会成为徽标的无障碍名称，读出来是「4 条未读消息」，而不是「4」。',
      ),
      demo(`badge({ content: 4, label: '4 条未读消息' },
  button({ variant: 'soft', color: 'neutral' }, '收件箱'),
)`),

      h2('改变计数'),
      p(
        '计数是一个页面打开着时最可能变化的数字。',
        code('setBadge()'),
        ' 会像服务端那样把它压到 ',
        code('max'),
        '，把播报文本一起带上，并且把清空后的徽标移出无障碍树——徽标就是这样消失的。',
      ),
      p('播报文本是站点自己的措辞，所以徽标只要有它，就把它一起传进去：'),
      codeBlock('任意位置', `button({ onclick: "import('/su/badge.js').then(m=>m.set('inbox',0))" }, 'Mark all read')`, 'javascript'),
      p('或者从你自己的模块里调用——如果本来就有一个在跑的话：'),
      codeBlock('src/main.js', `import { setBadge } from 'sitelo/ui/client'

setBadge('inbox', 7, { label: '7 unread messages' })`, 'javascript'),

      h2('属性'),
      propsTable([
        ['content', 'string | number', '', '徽标显示的内容。设置了 dot 时会被忽略。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", '徽标颜色。'],
        ['dot', 'boolean', 'false', '用一个小圆点代替数值。'],
        ['max', 'number', '99', '超过这个数的计数显示为 n+。'],
        ['label', 'string', '', '徽标本身的无障碍名称。'],
      ]),
    ],
  })
