import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
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

      h2('加载转圈'),
      p(
        '加载转圈按 ',
        code('em'),
        ' 定尺寸，所以不用告诉它大小，它自己就能配上旁边的文字。',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  spinner({ size: 'sm' }),
  spinner(),
  spinner({ size: 'lg' }),
)`),

      h2('放进上下文里'),
      p(
        '单独出现的加载转圈要给一个 ',
        code('label'),
        '，这样它才会被播报。按钮里的那个不需要——按钮本身已经说了它在干什么。',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    spinner({ label: '加载中' }),
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
      p(code('spinner()'), '：'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", '直径。中号按 em 定尺寸，好配上旁边的文字。'],
        ['label', 'string', '', '无障碍名称。不给的话，加载转圈会对屏幕阅读器隐藏。'],
      ]),
    ],
  })
