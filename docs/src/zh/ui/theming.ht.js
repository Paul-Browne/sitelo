import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '主题定制',
    description: '把样式表放到页面上，并用一次调用改掉每一种颜色、圆角和字体。',
    activeHref: '/zh/ui/theming',
    extraHead: uiHead(),
    children: [
      p(
        '所有组件读的都是同一批自定义属性，所以所谓主题不过是一组写在 ',
        code(':root'),
        ' 上的覆盖——没有构建步骤，没有配置文件，也没有哪个组件需要被告知这件事。',
      ),

      h2('把样式放进来'),
      p(
        code('styles()'),
        ' 返回一个装着整份样式表的 ',
        code('<style>'),
        ' 元素，已压缩——gzip 后大约 7 kB。它是默认做法，因为它不可能从 ',
        code('dist/'),
        ' 里丢失，也不多花一次请求。',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('我的站点'),
  styles(),
)`, 'javascript'),
      p(
        '如果你更想只链接一次、让浏览器跨页面缓存它，那就从打包的入口文件里导入这份 CSS，Vite 会把它产出出来：',
      ),
      codeBlock('src/main.js', `import 'sitelo/ui/styles.css'`, 'javascript'),
      p(
        '二选一，别两个都上。',
        code('stylesheet()'),
        ' 会把原始 CSS 作为字符串返回，方便你自己写到别处去。',
      ),

      h2('覆盖令牌'),
      p(
        code('theme()'),
        ' 负责写下这些覆盖。键可以是 camelCase 的令牌名、调色板对象，或者字面量自定义属性——而且它排在 ',
        code('styles()'),
        ' ',
        code('之后'),
        '，所以它说了算。',
      ),
      codeBlock('src/index.ht.js', `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', active: '#3f3fb0', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }),
)`, 'javascript'),
      h2('限定范围的主题'),
      p(
        '给一个 ',
        code('selector'),
        '，覆盖就只作用于某棵子树，而不是整个页面。下面这三块面板就是这么做的——同样的组件、三套不同配色，同处一页。',
      ),
      demo(`fragment(
  theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff', soft: '#e6e6fa', softFg: '#33338f', border: '#b9b9ee' } }, { selector: '.theme-indigo' }),
  theme({ primary: { base: '#b0357a', hover: '#962e68', fg: '#ffffff', soft: '#fbe4f0', softFg: '#7d1f53', border: '#f0a9ce' } }, { selector: '.theme-pink' }),
  theme({ radiusMd: '999px', radiusLg: '1.5rem' }, { selector: '.theme-round' }),
  grid({ min: '11rem' },
    div({ class: 'theme-indigo' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, '靛蓝'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-pink' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, '粉色'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-round' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, '圆角'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('深色模式'),
      p(
        '深色会自己根据 ',
        code('prefers-color-scheme'),
        ' 判断。任意祖先元素上显式写着 ',
        code('light'),
        ' 或 ',
        code('dark'),
        ' 的 ',
        code('data-theme'),
        ' 或 ',
        code('data-su-theme'),
        ' 会盖过它——本站的示例就是这样跟着顶栏那个开关走的。',
      ),
      p(
        '只想在深色下生效的覆盖，就传 ',
        code('dark'),
        '。它一次把属性和媒体查询都照顾到。',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('有哪些可以覆盖'),
      p(
        '五套调色板、每套九个槽位，一套间距尺度，还有字体、圆角、阴影和各种表面色。它们每一个都是自定义属性——打开样式表，或者浏览器的检查器，全都挂在 ',
        code(':root'),
        ' 上。',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    ...['primary', 'neutral', 'success', 'warning', 'danger'].map((color) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: 3.5rem; height: 2rem; border-radius: 0.4rem; background: var(--su-' + color + ')' }),
        text({ variant: 'caption', tone: 'muted' }, color),
      ),
    ),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true, align: 'flex-end' },
    ...['xs', 'sm', 'md', 'lg', 'xl'].map((step) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: var(--su-space-' + step + '); height: 2rem; border-radius: 0.2rem; background: var(--su-neutral)' }),
        text({ variant: 'caption', tone: 'muted' }, step),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('命名规则'),
      p(
        'camelCase 的键会变成 kebab-case 的属性：',
        code('radiusMd'),
        ' 就是 ',
        code('--su-radius-md'),
        '，',
        code('fontSans'),
        ' 就是 ',
        code('--su-font-sans'),
        '。嵌套对象也按同样方式展开——',
        code('{ primary: { softFg: … } }'),
        ' 设置的是 ',
        code('--su-primary-soft-fg'),
        '。而已经以 ',
        code('--'),
        ' 开头的键会原样使用，这就是那条留给映射规则覆盖不到之处的后门。',
      ),
      p(
        '一套调色板有九个槽位：',
        code('base'),
        '、',
        code('hover'),
        '、',
        code('active'),
        '、',
        code('fg'),
        '、',
        code('soft'),
        '、',
        code('softHover'),
        '、',
        code('softFg'),
        '、',
        code('border'),
        ' 和 ',
        code('ring'),
        '。只写你要改的那几个就行。',
      ),

      h2('对比度'),
      p(
        '随库附带的调色板在两种主题下都能相对其所处的表面达到 WCAG AA，仓库里还有一个测试，一旦这条不再成立就会让构建失败。你自己的主题不在它的覆盖范围内——发布之前，请自行核对你的 ',
        code('fg'),
        ' 与 ',
        code('base'),
        ' 的对比。',
      ),

      h2('属性'),
      p(code('styles()'), ' 和 ', code('stylesheet()'), '：'),
      propsTable([
        ['minify', 'boolean', 'true', '去掉注释和空白。'],
        ['nonce', 'string', '', '给产出的 style 元素用的 CSP nonce。仅 styles() 有效。'],
      ]),
      p(code('theme(tokens, options)'), '：'),
      propsTable([
        ['selector', 'string', "':root'", '把这些覆盖限定在某棵子树内。'],
        ['dark', 'object', '', '只在深色模式下生效的覆盖。'],
        ['nonce', 'string', '', 'CSP nonce。'],
      ]),
    ],
  })
