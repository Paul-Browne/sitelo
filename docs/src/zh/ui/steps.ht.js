import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '步骤',
    description: '一条带编号的流程，走过的步骤都会标成已完成。',
    activeHref: '/zh/ui/steps',
    extraHead: uiHead(),
    children: [
      p(
        code('current'),
        ' 是正在进行的那一步的下标。它之前的都已完成并打上对勾；它之后的都还没到。当前那一步带着 ',
        code('aria-current="step"'),
        '，所以除了配色之外还会被播报出来。',
      ),

      h2('基础步骤'),
      demo(`steps({
  current: 1,
  items: [
    { title: '安装' },
    { title: '写一个页面' },
    { title: '构建' },
    { title: '部署' },
  ],
})`, { align: 'stretch' }),

      h2('带描述'),
      demo(`steps({
  current: 2,
  items: [
    { title: '安装', description: 'npm install -D sitelo' },
    { title: '写一个页面', description: 'src/index.ht.js' },
    { title: '构建', description: 'sitelo build' },
    { title: '部署', description: '发布 dist/' },
  ],
})`, { align: 'stretch' }),

      h2('垂直'),
      p('当描述超过寥寥几个字时，竖排更合适。'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: '装上这个包', description: 'sitelo 自带 Vite，所以别的什么都不用装。' },
    { title: '写一个返回 HTML 的函数', description: 'src/ 里放一个文件，就已经是一整个站点了。' },
    { title: '把产物发布出去', description: 'dist/ 就是纯静态文件——哪家托管都收。' },
  ],
})`, { align: 'stretch' }),

      h2('一步都还没做'),
      demo(`steps({ current: 0, items: ['安装', '配置', '部署'] })`, { align: 'stretch' }),

      h2('全部完成'),
      p(
        '把 ',
        code('current'),
        ' 设到最后一个下标之后，所有步骤就都读作已完成。',
      ),
      demo(`steps({ current: 3, items: ['安装', '配置', '部署'] })`, { align: 'stretch' }),

      h2('在手机上'),
      p(
        '横排在窄屏上无处可去，所以宽度低于 40rem 时它会自己变成竖排——不需要任何属性。把这个窗口拉窄就能看到。',
      ),

      h2('给它命名'),
      p(
        '这个列表是一个 ',
        code('<ol>'),
        '，顺序本来就写在里面了。当页面上有不止一组步骤、需要区分时，再加上 ',
        code('label'),
        '。',
      ),
      demo(`steps({
  label: '部署进度',
  current: 1,
  items: ['构建', '上传', '刷新缓存'],
})`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['items', 'Array', '[]', '字符串，或 { title, description } 对象。'],
        ['current', 'number', '0', '正在进行那一步的下标。'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", '排布方向。横排在 40rem 以下会转成竖排。'],
        ['label', 'string', '', '列表的无障碍名称。'],
      ]),
    ],
  })
