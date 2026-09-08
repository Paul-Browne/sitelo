import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '主题切换',
    description: '浅色/深色开关，附带那段行内脚本，让已保存的选择在进入页面时不会闪一下。',
    activeHref: '/zh/ui/theme-toggle',
    extraHead: uiHead(),
    children: [
      p(
        'sitelo-ui 自己就会根据 ',
        code('prefers-color-scheme'),
        ' 判断深色模式——如果一个站点乐意跟着操作系统走，那本页的东西一样都不需要。这个切换按钮是为了让读者能覆盖那个判断。',
      ),
      p(
        '它是四个需要脚本的组件之一，因为这个选择存在 ',
        code('localStorage'),
        ' 里，而只有脚本读得到。按钮会在第一次按下时自己去取那段脚本。',
      ),

      h2('接入方式'),
      p('往 head 里放两样东西，再把按钮放到它该在的地方：'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // 在首次绘制之前应用已保存的选择
  styles(),
)

body(
  appBar({ brand: '我的站点' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        '没有第三个文件。',
        code('themeScript()'),
        ' 是故意做成阻塞且内联的——任何被推迟的东西都会等页面先画一遍，而那正是它要防的那道深色闪光——至于切换动作本身，则搭在按钮上：',
      ),
      codeBlock('生成的标记', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        '两者要配套用。',
        code('themeScript()'),
        ' 同时也是在加载时给切换按钮标上 ',
        code('aria-pressed'),
        ' 的那一位：这时还没人按过任何东西，按钮自己根本无从知道最终定的是哪套主题。',
      ),

      h2('切换按钮'),
      p(
        '那个图标是纯 CSS，直接读主题属性得来——所以在首次绘制时它就已经是对的，早于任何脚本运行。它显示的是点击后会切换到哪一种。',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        '这些按钮是真能用的——本页加载了运行时。点一下会在 ',
        code('<html>'),
        ' 上设置 ',
        code('data-su-theme'),
        '，那是 sitelo-ui 自己的属性，所以只有本页里的 sitelo-ui 组件会跟着变。本站其余部分跟的是它自己的 ',
        code('data-theme'),
        '，由顶栏里的那个切换按钮设置。在你自己的站点上，这两者只会存在一个。',
      ),

      h2('在应用栏中'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, '文档')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, '开始使用'),
  ),
)`, { align: 'stretch' }),

      h2('主题是怎么定下来的'),
      p(
        '依次是：任意祖先元素上显式的 ',
        code('data-theme'),
        ' 或 ',
        code('data-su-theme'),
        ' 优先；都没有的话，由 ',
        code('prefers-color-scheme'),
        ' 决定。两个属性名都认，是为了让 sitelo-ui 能待在一个本来就有自己主题开关的站点里——本文档正是这种情况。',
      ),

      h2('自己来驱动'),
      p(
        '运行时导出了按钮所用的那几个函数，方便你做自定义控件，或者做一个浅色 / 深色 / 跟随系统的三态选择器。',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' —— 解析后的结果，不是存储值
toggleTheme()       // 切换
setTheme('dark')    // 固定
setTheme('system')  // 清掉覆盖，重新跟随系统`, 'javascript'),

      h2('属性'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", '无障碍名称，同时也是悬停提示。'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", '按钮变体。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", '取用哪一套配色。'],
      ]),
      p(
        code('themeScript()'),
        ' 接受一个可选的 ',
        code('nonce'),
        '，供设有内容安全策略的站点使用。',
      ),
    ],
  })
