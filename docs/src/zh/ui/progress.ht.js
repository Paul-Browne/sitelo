import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '进度',
    description: '知道何时结束的活儿用进度条，不知道的用加载转圈。',
    activeHref: '/zh/ui/progress',
    extraHead: uiHead(),
    children: [
      p(
        '只要你知道还剩多少，就用确定进度条——只有它才真的告诉了读者什么。省略 ',
        code('value'),
        '，进度条就会改成动画，那只说明「还在忙」，别的什么也没说。',
      ),

      h2('确定进度'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('不确定进度'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        '没有 ',
        code('label'),
        ' 的进度条会被标上 ',
        code('aria-hidden'),
        '——一个没有无障碍名称的 progressbar 角色对屏幕阅读器毫无意义，所以无标签的进度条一律当作装饰。凡是希望读者跟进的，都要给标签。',
      ),

      h2('标签'),
      p(
        '标签说明正在发生什么；',
        code('showValue'),
        ' 会在右侧加上百分比。',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: '正在渲染页面', showValue: true }),
  progress({ value: 30, max: 60, label: '正在优化图片', showValue: true }),
  progress({ label: '等待部署' }),
)`, { align: 'stretch' }),

      h2('颜色与高度'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: '通过', showValue: true }),
  progress({ value: 45, color: 'warning', label: '降级', showValue: true }),
  progress({ value: 20, color: 'danger', label: '失败中', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('不是 100 的刻度'),
      p(
        code('max'),
        ' 让你直接传原始数字——已构建页数对总页数——而不必先算出百分比。',
      ),
      demo(`progress({ value: 118, max: 169, label: '169 个页面中的第 118 个', showValue: true })`, {
        align: 'stretch',
      }),

      h2('从浏览器里推动它'),
      p(
        '进度条是服务端渲染出来的 HTML：百分比是填充上的一个自定义属性，数值在 ',
        code('aria-valuenow'),
        ' 里，页面上没有任何东西会自己去改动它们。给它一个 ',
        code('id'),
        '，',
        code('setProgress'),
        ' 就会把这几处一起改掉——填充、播报出来的值，以及标签旁边的百分比。',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        '最大值会被记住，所以后面的调用只要传值就够了。或者像组件找到自己那份运行时一样直接取用这个模块，完全绕开打包：',
      ),
      codeBlock('任意位置', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, '完成')`, 'javascript'),
      p(
        '传 ',
        code('null'),
        '——或者任何不是有限数字的东西——会把进度条交还给不确定动画，所以不再报数的任务不需要单独处理。',
        code('getProgress()'),
        ' 则按进度条自己的刻度把当前值读回来。',
      ),

      h2('试一试'),
      p('这个页面加载了运行时，所以下面的按钮是真的在推动这条进度条。'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: '上传中', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, '重置'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, '完成'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, '未知'),
  ),
)`, { align: 'stretch' }),
      p(
        '没有标签的进度条同样会动，但它仍然是 ',
        code('aria-hidden'),
        '——它当初就是故意不带名字渲染的，现在给它播报一个数值，只会往无障碍树里塞一个没有名字的 progressbar。',
      ),

      h2('加载转圈'),
      p(
        '没有单独的加载转圈组件——它就是一个图标，让它转起来的是 ',
        code('spin'),
        '。和所有图标一样，它按 ',
        code('em'),
        ' 定尺寸，所以不用告诉它大小，它自己就能配上旁边的文字。',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('放进上下文里'),
      p(
        '单独出现的加载转圈要给一个 ',
        code('label'),
        '，这样它才会被播报。按钮里的那个不需要——按钮本身已经说了它在干什么。',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: '加载中' }),
    text({ variant: 'small', tone: 'muted' }, '正在获取最新的构建…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, '部署中'),
    button({ variant: 'outline', loading: true }, '检查链接中'),
  ),
)`, { align: 'start' }),

      h2('属性'),
      p(code('progress()'), '——也以 ', code('progressBar'), ' 之名导出：'),
      propsTable([
        ['value', 'number', '', '进行到哪儿了。省略它就用不确定动画。'],
        ['max', 'number', '100', '哪个值算作完成。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", '填充颜色。'],
        ['label', 'Child', '', '进度条上方的文字；同时也是它的无障碍名称。'],
        ['showValue', 'boolean', 'false', '在标签旁显示百分比。'],
        ['height', 'Space', "'0.5rem'", '进度条的粗细。'],
      ]),
      p(code('setProgress()'), '，来自 ', code('sitelo/ui/client'), '：'),
      propsTable([
        ['target', 'Element | string', '', '进度条本身，或者它的 id。没有元素用这个 id 时，会当作选择器再试一次。'],
        ['value', 'number | null', '', '要移动到哪里。null 会把它交还给不确定动画。'],
        ['options.max', 'number', '100', '什么算完成。会被记住，供后续调用使用。'],
      ]),
      p(
        '加载转圈没有自己的属性——它就是 ',
        code("icon('spinner', { spin: true })"),
        '，',
        code('icon()'),
        ' 收什么它就收什么。',
      ),
    ],
  })
