import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

/** 一个格子：可读大小的图形，加上要敲的名字。 */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* 按字母序，直接取自库本身，这样页面就不会落后于它所记录的那套图标。 */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * 靠给自身路径上色来填充的图形，区别于那些另带一张画的图形——判断依据是两种
 * 形态是不是同一段标记，这样任何示例都不会落后于图标集。
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * 填充示例是算出来的，而不是手写清单——源码就是页面打印出来的东西，所以某个
 * 图形一旦变得可填充，它自己就会出现在这里，不必有人记着去添加。
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: '图标',
    description:
      '同一套网格上的 99 个图形，内联渲染，因此图标会取用周围文字的颜色和大小。',
    activeHref: '/zh/ui/icons',
    extraHead: uiHead(),
    children: [
      p(
        code('icon()'),
        ' 返回一个内联的 ',
        code('<svg>'),
        '。每个图形都画在同样的 24×24 网格上，是 ',
        code('currentColor'),
        ' 的无填充线条，所以它会继承所处位置的颜色和字号，自己不需要任何样式。',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('在组件里'),
      p(
        '图标和其他子元素没什么两样。因为它按 ',
        code('em'),
        ' 定尺寸，不用告诉它旁边的文字有多大，它自己就能配上：',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), '下载'),
  button({ variant: 'outline' }, icon('external-link'), '打开'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), '删除'),
  iconButton({ label: '搜索', variant: 'soft', icon: icon('search') }),
)`),

      h2('尺寸'),
      p(
        '默认是 ',
        code('1em'),
        '，也就是周围文字的大小。想跳出这个尺寸时，',
        code('size'),
        ' 接受一个令牌或任意 CSS 长度：',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('颜色'),
      p(
        '没有颜色属性。图标用 ',
        code('currentColor'),
        ' 绘制，所以取用所处上下文的颜色——正是这一点让一套图标能在五套配色里通用：',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('无障碍名称'),
      p(
        '图标默认带 ',
        code('aria-hidden'),
        '，这在绝大多数时候都是对的：紧挨着「删除」二字的图标不该再被播报一遍。只有当意思全靠图标承载时，才给它一个 ',
        code('label'),
        '，那时它会变成带该名称的 ',
        code('role="img"'),
        '。',
      ),
      codeBlock('', `icon('trash')                     // 装饰性——隐藏
button(icon('trash'), '删除')      // 由文字来表达

icon('trash', { label: '删除' })   // 作为图像播报

// 纯图标按钮标注的是按钮，而不是里面那个图形
iconButton({ label: '删除', icon: icon('trash') })`, 'javascript'),

      h2('填充'),
      p(
        code('filled'),
        ' 把图形涂实，而不是只描边。两种形态用的是同一条路径——只有 ',
        code('fill'),
        ' 属性不同——所以它们的外缘严丝合缝，不可能走样。',
      ),
      demo(fillDemo()),
      p('同样这些名字，填充后：'),
      demo(fillDemo({ filled: true })),
      p(
        '它做成属性而不是另起一套名字，是因为「已填充」几乎总是一种',
        code('状态'),
        '——已保存、已点赞、已评分——所以它要的是布尔值，而不是另一个字符串：',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? '已保存' : '保存' })

// 而不是
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        '状态类图形的填充方式不一样，因为它们的记号位于形状',
        code('内部'),
        '。把圆涂实会吞掉那个对勾，所以改成把记号从圆里挖出来：',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        '这几个另带一张画——实心形状加上用 ',
        code('fill-rule: evenodd'),
        ' 挖掉的记号——因为这种挖空没法只靠改一个属性从描边路径得到。外形画在描边的外缘上，所以两种形态最终的轮廓仍然一致。属性还是同一个；某个图形走的是哪套机制，那是它自己的事。',
      ),
      p(
        '折角箭头压根没有内部可涂——它是一条开放的线——所以它会填成自身三个点所描出的三角形，同时保留把拐角磨圆的那道描边：',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' 列出所有会响应 ',
        code('filled'),
        ' 的图形。没有填充形态的图形会忽略它、继续保持描边——把 ',
        code('eye'),
        ' 涂实会丢掉瞳孔，',
        code('tag'),
        ' 会丢掉那个孔，所以它们都不假装自己能填。',
      ),

      h2('旋转'),
      p(
        code('spin'),
        ' 让图形转起来——本是为 ',
        code('spinner'),
        ' 准备的，不过也没人拦着你在重新加载时转 ',
        code('refresh'),
        '。在 ',
        code('prefers-reduced-motion'),
        ' 下它会慢到几乎不动，而不是停下，因为停住的加载图看起来像坏了。',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), '保存中…'),
)`),

      h2('整套图标'),
      p(
        '名字描述的是画本身，而不是它派的用场——是 ',
        code('x-circle'),
        ' 而不是 ',
        code('error'),
        '——因为同一张画会用在互不相干的地方，而描述图形的名字在那时依然成立。下面的别名覆盖了常见意图。',
      ),
      gallery(),

      h2('品牌标识'),
      p(
        '这套图标带了八个品牌标识——',
        code('facebook'),
        '、',
        code('google'),
        '、',
        code('instagram'),
        '、',
        code('linkedin'),
        '、',
        code('tiktok'),
        '、',
        code('whatsapp'),
        '、',
        code('x-twitter'),
        ' 和 ',
        code('youtube'),
        '。它们同样接受 ',
        code('size'),
        ' 和 ',
        code('label'),
        '，同样用 ',
        code('currentColor'),
        ' 绘制：',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), '分享'),
)`),
      p(
        '它们是对别人商标的复制，而不是按本库风格画的图形，所以有意破了两条规矩：它们是实心形状而非线条——徽标本来就是这样——而且比例取自品牌，而不是这套网格。',
        code('filled'),
        ' 对它们没有意义：它们本来就是实心的。',
      ),
      p(
        '图形来自 Simple Icons，以 CC0 发布。这只覆盖画本身，不覆盖商标：请用它们来指代它们所命名的东西——个人主页链接、分享按钮——而不要用在你自己的产品上。',
      ),
      p(
        '名字是 ',
        code('x-twitter'),
        ' 而不是 ',
        code('x'),
        '，因为 ',
        code('x'),
        ' 已经是 ',
        code('close'),
        ' 的别名，关闭按钮突然变成一个徽标会是很难堪的意外。',
        code('twitter'),
        ' 也指向它。',
      ),

      h2('别名'),
      p('下面每一个渲染的都是上面列出的某个图形，只是换成你更可能想到的名字：'),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('你自己的图标'),
      p(
        code('registerIcons()'),
        ' 可以加一个图形，或者替换一个内置图形。标记就是 ',
        code('<svg>'),
        ' 的内容——画在同样的 24×24 网格上、不加填充，好让 ',
        code('currentColor'),
        ' 能作用到它们。在页面会导入的某个模块里调用一次即可：',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // 用一个已存在的名字会到处替换掉它，想给内置图标换个画法又不想 fork 本库，
  // 就是这么做的。
  check: '<path d="m5 13 4 4 10-11"/>',
  // 单个闭合形状，这样它就能像内置图标一样响应 \`filled\`。
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                   // 你的图形
icon('check')                  // 现在也是你的了

registerIcons({ check: null }) // 再换回内置的`, 'javascript'),

      h2('为什么用内联，而不是雪碧图'),
      p(
        '图标是渲染进页面的，而不是用 ',
        code('<use>'),
        ' 从一个 ',
        code('icons.svg'),
        ' 里取。雪碧图每页大约省下上百个 gzip 后的 HTML 字节，代价却是一次往返请求——重复的标记恰恰是 gzip 最擅长的场景，所以雪碧图想去重的东西，大半已经被去过重了。内联还意味着没有文件要产出、没有 base 路径要配置，也没有东西会从 ',
        code('dist'),
        ' 里丢失——和 ',
        code('styles()'),
        ' 做的是同一笔交易。',
      ),

      h2('属性'),
      propsTable([
        ['name', 'string', '', '要哪个图形。也可以直接作为第一个参数传入。'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", '一个令牌，或任意 CSS 长度。默认是 1em。'],
        ['label', 'string', '', '以这个名字作为图像播报，而不是隐藏它。'],
        ['spin', 'boolean', 'false', '让它持续旋转。'],
        ['filled', 'boolean', 'false', '把图形涂实而不是描边。不可填充的图形会忽略它。'],
      ]),
      p(
        '未知的名字会什么都不渲染，而不是抛错——一个纯装饰的属性不该有本事让构建失败。',
        code('hasIcon(name)'),
        ' 告诉你某个图标存不存在，',
        code('iconNames()'),
        ' 列出全部，而 ',
        code('fillableIcons()'),
        ' 列出接受 ',
        code('filled'),
        ' 的那些。',
      ),
    ],
  })
