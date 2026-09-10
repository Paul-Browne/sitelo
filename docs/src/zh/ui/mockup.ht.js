import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '设备外框',
    description: '把截图放进一个框里——浏览器、窗口、手机或终端。',
    activeHref: '/zh/ui/mockup',
    children: [
      p(
        '用来在落地页上展示产品，或者在文档里放截图。外框只是装饰：那几个圆点、地址栏和刘海全都带 ',
        code('aria-hidden'),
        '，所以屏幕阅读器拿到的是里面的内容，而不是对外壳的描述。',
      ),

      h2('浏览器'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, '你好，世界'),
      text({ variant: 'small', tone: 'muted' }, '构建时渲染，以静态文件提供。'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('窗口'),
      p('同样的外框，但没有地址栏，适合一切不是网页的东西。'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, '一个没有网址的窗口。'),
  ),
)`, { align: 'stretch' }),

      h2('红绿灯按钮'),
      p(
        '这几个小圆点默认跟着主题走。',
        code("dots: 'mac'"),
        ' 会把它们涂成 macOS 的红、黄、绿——两种主题下都是同样三个颜色，因为它们的意义就在于一眼认得出来。',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, '一个你见过的窗口。'),
  ),
)`, { align: 'stretch' }),

      h2('终端'),
      p(
        code('code'),
        ' 这个变体在两种主题下都是深色的，终端本该如此。',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ 构建耗时 1.09 秒</div>' +
  '<div style="opacity: .7">  204 个页面 · 9.7 MB</div>',
)`, { align: 'stretch' }),

      h2('手机'),
      p(
        '当下的手机形态：一块浮在边框之内、与边框分离的灵动岛，而不是从边框上抠出来的刘海。请在屏幕顶部给它留出位置。',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, '静态站点，不用框架。'),
      button({ size: 'sm', block: true }, '开始使用'),
    ),
  ),
)`),

      h2('边框与灵动岛'),
      p(
        code('frame'),
        ' 给最外那圈上色——任意 CSS 颜色，所以机身配色写成十六进制值，而不是一个需要本库维护清单的名字。',
        code('notch: false'),
        ' 则为没有灵动岛的设备去掉它。',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('放一张截图'),
      p(
        '主体里的 ',
        code('<img>'),
        ' 会撑满外框的宽度。如果图片加载得晚、而页面又不该跳动，就配上 ',
        code('aspectRatio()'),
        '。',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="sitelo UI 组件画廊" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('尺寸'),
      p(
        '设备外框默认撑满容器。',
        code('size'),
        ' 则把它钉在固定宽度上。手机有自己的三档——22rem 的手机那就是平板了——而且在每一档都保持比例：圆角、边框和灵动岛都是宽度的比例，而不是固定长度。',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, '默认——通栏宽度'))),
)`, { align: 'stretch' }),

      h2('放进首屏区块'),
      p(
        '这正是它存在的搭配：把设备外框作为首屏区块的 ',
        code('media'),
        ' 传进去。',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: '看它跑起来',
  description: '送到浏览器时已经是静态 HTML。',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, '一个被裱起来的页面。'),
    ),
  ),
}, button('开始使用'))`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", '画哪一种外框。'],
        ['url', 'string', '', '显示在地址栏里。仅 browser 变体有效。'],
        ['dots', "'mono' | 'mac'", "'mono'", '那三个圆点长什么样。'],
        ['frame', 'string', '', '给最外圈上色。任意 CSS 颜色。仅手机有效。'],
        ['notch', 'boolean', 'true', '是否画出灵动岛。仅手机有效。'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", '固定宽度。中号会撑满容器。'],
      ]),
    ],
  })
