import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '提示',
    description: '一条关于某件事状态的消息，图标和播报角色都跟着颜色走。',
    activeHref: '/zh/ui/alert',
    children: [
      p(
        '提示用来告诉读者页面的情况，或者他们刚做的操作的结果。颜色同时决定图标和 ARIA 角色：',
        code('danger'),
        ' 和 ',
        code('warning'),
        ' 会以 ',
        code('role="alert"'),
        ' 播报，更平静的一律是礼貌的 ',
        code('role="status"'),
        '。',
      ),

      h2('颜色'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: '注意' }, 'sitelo 有新版本可用。'),
  alert({ color: 'success', title: '已部署' }, '169 个页面在 1.7 秒内发布完成。'),
  alert({ color: 'warning', title: '页面偏慢' }, '有一个页面渲染用了超过 500 毫秒。'),
  alert({ color: 'danger', title: '构建失败' }, '两条站内链接指向了不存在的页面。'),
  alert({ color: 'neutral', title: '备注' }, '本项目已关闭服务端区块。'),
)`, { align: 'stretch' }),

      h2('不带标题'),
      p('一行字的提示不需要在句子上面再加个标题。'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, '已保存。'),
  alert({ color: 'danger' }, '该邮箱地址已被使用。'),
)`, { align: 'stretch' }),

      h2('变体'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, '默认样式——带一层淡淡的底色。'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, '透明底，配一圈彩色边框。'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, '实心的调色板颜色，留给绝对不能被忽略的内容。'),
)`, { align: 'stretch' }),

      h2('图标'),
      p(
        '每种颜色都有默认图标。用 ',
        code('icon'),
        ' 传入你自己的标记，或者用 ',
        code('icon: false'),
        ' 去掉图标。',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: '没有图标' }, '只有文字。'),
  alert({
    color: 'primary',
    title: '自定义图标',
    icon: icon('star'),
  }, '任何 SVG 都可以——图标是标记，不是依赖。'),
)`, { align: 'stretch' }),

      h2('可关闭'),
      p('关闭按钮自带处理函数：'),
      codeBlock(
        '生成的标记',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        '所以下面这条提示真的能关闭，而本页并没有导入任何东西。万一那个模块始终没到，按钮照样渲染、点了没反应——正因如此，提示不该是某条消息唯一出现的地方。',
      ),
      demo(`alert({ color: 'primary', title: '可关闭', dismissible: true },
  '点一下 × —— 处理函数会在第一次按下时自己取回来。',
)`, { align: 'stretch' }),

      h2('富内容'),
      p('提示接受任意子元素，所以里面可以放一个操作或者一份列表。'),
      demo(`alert({ color: 'danger', title: '链接检查未通过' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, '有两条链接指向了没有生成的页面：'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: '来自 /docs 的链接' }),
      listItem({ title: '/blog/draft', description: '来自 /blog 的链接' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, '查看详情'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, '忽略'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '决定配色、默认图标和 ARIA 角色。'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", '提示的视觉分量。'],
        ['title', 'Child', '', '加粗的首行。'],
        ['icon', 'Child | false', '', '自定义图标标记，false 表示不要图标。'],
        ['dismissible', 'boolean', 'false', '加一个关闭按钮，它会自行导入处理函数。'],
        ['dismissLabel', 'string', "'Dismiss'", '该按钮的无障碍名称。'],
      ]),
    ],
  })
