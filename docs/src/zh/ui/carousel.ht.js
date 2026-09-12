import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '轮播',
    description: '可以滚动、边滚边吸附的幻灯片——圆点和箭头由样式表交给浏览器去画。',
    activeHref: '/zh/ui/carousel',
    children: [
      p(
        '这里的轮播就是一个滚动容器，加上一排会吸附的幻灯片。这些浏览器本来就会：滑动、触控板、Shift+滚轮和方向键在首次绘制时就能用，什么都不用加载，也没有什么要激活。',
      ),
      p(
        '在浏览器办得到的地方，圆点和箭头根本不是标记。它们是每张幻灯片上的 ',
        code('::scroll-marker'),
        ' 和轨道上的 ',
        code('::scroll-button()'),
        '——样式表提出要求，浏览器来画、来命名、来接上滚动位置、标出当前那一张，并在两端自动禁用。这个组件没有任何 ',
        code('data-'),
        ' 属性，也没有要导入的模块：状态就是滚动偏移，而浏览器早就有了。',
      ),
      p(
        '在办不到的地方，会换成一排真正的圆点接手：每张幻灯片一个链接，它本身就能用；而在第一次滚动或第一次点触时，它会去取几百字节的脚本，让自己表现得跟原生圆点一样——跟着滚动走，并且在移动轨道时不把页面一起带走。',
      ),

      h2('一次一张'),
      p('默认行为。每张幻灯片填满轨道，吸附在起点并停在那里，不会一下子飞出三张。'),
      demo(`carousel({
  items: ['海岸', '港口', '田野', '老城'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('一次几张'),
      p(
        code('perView'),
        ' 是多少张幻灯片填满轨道，',
        code('min'),
        ' 则是一张能窄到什么程度的下限。这个下限用来代替媒体查询：一旦每张分到的轨道宽度低于它，幻灯片就保持这个宽度，能放下的数量随之变少——跟 ',
        code('grid()'),
        ' 用 auto-fit 玩的是同一招。',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['路由', '数据', '静态资源', '图片', 'Islands', '搜索'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, '指南'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('露出下一张的一角'),
      p(
        '带小数的 ',
        code('perView'),
        ' 会留出下一张的一条边，这是在完全不加控件的情况下，告诉别人"这里能滚"最省事的办法。',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['一', '二', '三'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('不用自己写断点的响应式'),
      p(
        code('perView'),
        ' 写成自定义属性，所以一条媒体查询就能改它，不必动标记——组件也不需要知道你的断点：',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('吸附'),
      p(
        '吸附默认是 ',
        code('mandatory'),
        '：滚动总会停在某一张上。',
        code("snap: 'proximity'"),
        ' 只在停得离某一张很近时才把它拉过去，而 ',
        code('snap: false'),
        ' 让轨道自由滚动——一排小东西要的正是这个，停在两者之间也无所谓。',
      ),
      demo(`carousel({
  snap: false,
  perView: 4,
  min: '7rem',
  gap: 'sm',
  arrows: false,
  items: ['sitelo', 'vite', 'pagefind', 'sharp', 'lighthouse', 'rollup', 'esbuild'].map((name) =>
    chip({ size: 'lg', color: 'neutral', style: 'width: 100%; justify-content: center' }, name)),
})`, { align: 'stretch' }),

      h2('圆点和箭头放在哪'),
      p(
        '两者都是可选的，默认都开着。把圆点关掉，轨道的滚动条就回来了——两样都没有的轮播，会变成一个没有任何东西说明它能滚的滚动容器。',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['只有圆点', '第二张', '第三张'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['只有箭头', '第二张', '第三张'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('当浏览器没有滚动标记时'),
      p(
        '这时圆点就是真正的链接，每张幻灯片一个，各自指向自己那张的 id——每张幻灯片都拿到一个 id 就是为了这个。这一层什么都不加载就已经能用：点一下就把轨道滚到它那张，因为跟着片段走本来就是浏览器自己会做的事。',
      ),
      p(
        '在第一次滚动或第一次点触时，轨道和圆点会去取 ',
        code('/su/carousel.js'),
        '——从它们自己的事件属性里取，跟这里每个组件取自己模块的方式一样。所以没人碰过的页面什么都不会下载，而在已经有原生标记的地方，更是一点都不取。从那一刻起它是双向的：圆点跟着滚动走，不管是什么让它动的——滑动、触控板、方向键、拖动滚动条——而点一下圆点会滚动轨道，并把页面留在原处。',
      ),
      p(
        '最后这一点才是这段脚本真正的用处。光秃秃的片段除了轨道，还会把窗口移向那张幻灯片，而一个把页面从点它的手指底下抽走的轮播，根本不是谁说"圆点"时的意思。点击是在属性里取消的，不是在 import 里面——动态 import 要晚一瞬才到，那时浏览器早就跟着链接走了。',
        code('scrollMargin'),
        ' 管的是仅剩的那种情况：JavaScript 关着，链接就只是链接。',
      ),
      p(
        '它们指向的 id 来自 ',
        code('name'),
        '、来自轮播自己的 ',
        code('id'),
        '，两者都没有时则来自幻灯片内容的摘要——这样同一页上的两个轮播就不会撞在一起，也不必彼此知情。要是某一张幻灯片值得从别处链接过来，就给那一项一个自己的 ',
        code('id'),
        '。',
      ),

      h2('给幻灯片命名'),
      p(
        '每个圆点都以它那张幻灯片命名，因为圆点是一个控件，而没有名字的控件，屏幕阅读器只能念作"按钮"。默认名字是幻灯片的序号。把某一项写成对象可以给它起个更好的名字，或者用 ',
        code('slideLabel'),
        ' 按你自己的说法来数。',
      ),
      demo(`carousel({
  label: '产品照片',
  perView: 2,
  min: '10rem',
  items: [
    { label: '厨房', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, '厨房'))) },
    { label: '露台', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, '露台'))) },
    { label: '花园', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, '花园'))) },
  ],
})`, { align: 'stretch' }),

      h2('自己来驱动'),
      p(
        '两个函数，留给由页面来移动轮播的时候——一个"看照片"按钮、表单里的一步、页面上别处的一个链接：',
      ),
      codeBlock('src/main.js', `import { setSlide, getSlide } from 'sitelo/ui/client'

setSlide('gallery', 2)  // 滚到第三张，并标上它的圆点
getSlide('gallery')     // 2`, 'javascript'),
      p('或者从事件属性里调用，页面里一点打包的脚本都不用：'),
      codeBlock('任何地方', `button({ onclick: "import('/su/carousel.js').then(m=>m.set('gallery',0))" }, '回到开头')`, 'javascript'),

      h2('它不做的事'),
      p(
        '它不会循环回第一张，也不会自己往前走。这两件事 CSS 都做不到，所以两件都不在这里——循环或自动播放的轮播需要脚本，而这个组件不想成为一个页面去加载脚本的理由。自动播放本来也值得放弃：它动的正是别人此刻在读的那一块。',
      ),
      p(
        '关掉 JavaScript 时，它也无法在轨道被滑动之后标出正在显示的是哪一张，也无法在不移动页面的前提下跳到某一张。第一个圆点是在构建时标上的，因为静止时看到的正是那一张；此后要让它一直正确，是只有脚本才做得到的事。滑动、触控板和按键在两种情况下都照常。',
      ),

      h2('无障碍'),
      p(
        '轨道是一个有名字的分组，带 ',
        code('tabindex="0"'),
        '，这样键盘能到达这个可滚动区域，并在任何引擎里用方向键走完它，而不只是在那些会自己给滚动容器焦点的引擎里。一个页面上不止一个时，用 ',
        code('label'),
        ' 给它起名。',
      ),
      p(
        '在浏览器会画它们的地方，圆点会作为一组标签暴露出来，箭头则是到了两端会自行禁用的按钮——这些全由浏览器搭建，所以没有一处会和真正显示着的那张幻灯片脱节。这正是这种形态胜过脚本版本的理由：没有第二份状态可以出错。',
      ),
      p(
        '后备圆点是链接，每个都以自己那张幻灯片命名，每个的点击目标是 24px，而不是圆点看上去的 8px。正在显示的那一张带 ',
        code('aria-current'),
        '——它既是屏幕阅读器会读的状态，也是样式表着色的依据：要维持正确的只有一份状态，而不是两份可能互相矛盾的。它被渲染在第一个圆点上，因为静止时看到的就是那一张，之后便随滚动移动。在原生标记取代它们的地方，这些链接是 ',
        code('display: none'),
        '，所以会连同画面一起离开无障碍树，而不是被念两遍。',
      ),

      h2('属性'),
      propsTable([
        ['items', 'Array', '[]', '幻灯片。可以是一个子节点，或带任意其他幻灯片属性的 { label, content }。子节点也是幻灯片，排在 items 之后。'],
        ['perView', 'number', '1', '多少张幻灯片填满轨道。小数会露出下一张的一角。'],
        ['min', 'string', '', '一张幻灯片宽度的下限，让窄屏少放几张，而不是把每张压细。'],
        ['gap', 'Space', "'md'", '幻灯片之间的间距。'],
        ['align', "'start' | 'center' | 'end'", "'start'", '幻灯片停在哪里。'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", '滚动落到一张上的力度。'],
        ['dots', 'boolean', 'true', '轨道下方的圆点——浏览器有原生滚动标记时用它，没有时每张幻灯片一个链接，再由一个小模块加以增强。关掉会让滚动条回来，也完全不需要脚本。'],
        ['arrows', 'boolean', 'true', '轨道之上的箭头。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '当前那张幻灯片的圆点颜色。'],
        ['label', 'string', "'Carousel'", '可滚动区域的无障碍名称。'],
        ['previousLabel', 'string', "'Previous slide'", '后退箭头的无障碍名称。'],
        ['nextLabel', 'string', "'Next slide'", '前进箭头的无障碍名称。'],
        ['slideLabel', '(index, count) => string', '序号', '为没有自己命名的幻灯片取名。'],
        ['name', 'string', '轮播的 id，否则用摘要', '后备圆点所链接的幻灯片 id 前缀。'],
        ['scrollMargin', 'Space', "'lg'", '后备圆点跳到某张幻灯片时，窗口停在它上方多远处。'],
        ['as', 'string', "'div'", '要渲染的元素。'],
      ]),
    ],
  })
