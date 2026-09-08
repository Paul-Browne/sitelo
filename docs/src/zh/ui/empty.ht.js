import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '空状态',
    description: '列表在还没有任何内容时该长成什么样。',
    activeHref: '/zh/ui/empty',
    extraHead: uiHead(),
    children: [
      p(
        '一片空白看起来就像出了 bug。空状态会说明哪块是空的、为什么空，以及接下来该做什么——而它恰恰是最容易被忘掉的场景，因为开发时永远都有数据。',
      ),

      h2('基础空状态'),
      demo(`empty({
  title: '还没有文章',
  description: '往 src/posts 放一个 Markdown 文件，它就会出现在这里。',
})`, { align: 'stretch' }),

      h2('带图标'),
      p(
        '图标只是装饰——它带着 ',
        code('aria-hidden'),
        '，因为标题已经把情况说清楚了。',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: '这里什么都没有',
  description: '这个目录里没有任何页面。',
})`, { align: 'stretch' }),

      h2('带操作'),
      p('子元素会成为那一行操作按钮。'),
      demo(`empty({
  icon: icon('search'),
  title: '没有「区块」的搜索结果',
  description: '检查一下拼写，或者直接去翻文档。',
},
  button({ href: '/zh/docs' }, '浏览文档'),
  button({ variant: 'outline', color: 'neutral' }, '清空搜索'),
)`, { align: 'stretch' }),

      h2('在卡片中'),
      demo(`card(
  cardHeader({ title: '部署记录' }),
  cardBody(
    empty({
      title: '还没有部署过',
      description: '推送到 main，第一次构建就会出现在这里。',
    }, button({ size: 'sm' }, '连接一个仓库')),
  ),
)`, { align: 'stretch' }),

      h2('用来替代表格'),
      p(
        '与其渲染一个下面没有任何行的表头，不如把表格换成空状态。',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: '构建历史' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: '提交' }], rows })
      : cardBody(empty({
          title: '没有构建记录',
          description: '站点至少部署过一次之后，运行记录就会出现在这里。',
        })),
  )
})()`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['icon', 'Child', '', '标题上方的装饰性字形；对屏幕阅读器隐藏。'],
        ['title', 'Child', '', '用几个字说明什么是空的。'],
        ['description', 'Child', '', '为什么是空的，或者该怎么办。'],
      ]),
      p('子元素会渲染成描述下方的那一行操作。'),
    ],
  })
