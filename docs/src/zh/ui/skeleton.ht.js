import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '骨架屏',
    description: '一块占位图形，形状就照着还没到位的内容来。',
    activeHref: '/zh/ui/skeleton',
    extraHead: uiHead(),
    children: [
      p(
        '骨架屏在内容加载时先顶上它的位置。在静态站点里这比在应用里少见——HTML 本来就已经在了——但它通常正是服务端区块的 ',
        code('fallback'),
        ' 该有的样子，也是客户端渲染区域在数据到来之前会显示的东西。',
      ),
      p(
        '骨架屏纯属装饰：每一块都带 ',
        code('aria-hidden'),
        '，免得屏幕阅读器读出一串空盒子。',
      ),

      h2('形状'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('文字'),
      p(
        code('lines'),
        ' 会画出一段的分量，最后一行短一些，好让它读起来像一段文字，而不是一整块。',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('照着真东西的形状来'),
      p(
        '当骨架屏与它所替代的排版一致时最有说服力——同样的卡片、同样的行、同样的尺寸。',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardBody(
      stack({ gap: 'md' },
        stack({ direction: 'row', gap: 'sm', align: 'center' },
          skeleton({ variant: 'circle', width: '2.5rem', height: '2.5rem' }),
          stack({ gap: 'xs', style: 'flex: 1' },
            skeleton({ variant: 'text', width: '60%' }),
            skeleton({ variant: 'text', width: '40%' }),
          ),
        ),
        skeleton({ lines: 3 }),
      ),
    ),
  ),
  card(
    cardBody(
      stack({ direction: 'row', gap: 'sm', align: 'center' },
        avatar({ name: 'Ada Lovelace' }),
        stack({ gap: 'none' },
          text({ variant: 'small' }, 'Ada Lovelace'),
          text({ variant: 'caption', tone: 'muted' }, '推送了 3 个提交'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('作为区块的兜底内容'),
      p(
        '服务端区块会把兜底内容随静态 HTML 一起发出去，然后在请求时换上渲染好的片段。骨架屏与那个片段形状一致，页面在片段到达时就不会跳动。',
      ),
      demo(`card(
  cardHeader({ title: '评论' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('动效'),
      p(
        '对于在系统里要求减少动态效果的人，那道微光会停下来——这由样式表处理，没有什么属性需要设置。',
      ),

      h2('属性'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", '占位块的形状。'],
        ['width', 'string', '', '任意 CSS 宽度。'],
        ['height', 'string', '', '任意 CSS 高度。'],
        ['lines', 'number', '', '画出这么多行文字，最后一行短一些。'],
      ]),
    ],
  })
