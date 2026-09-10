import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '时间线',
    description: '沿着一条线依次排开的条目——更新日志、版本历史，或者一页「关于」。',
    activeHref: '/zh/ui/timeline',
    children: [
      p(
        '时间线就是一个旁边带竖线的有序列表。可以用 ',
        code('items'),
        ' 来搭，也可以在条目不够整齐、没法从数组生成时用 ',
        code('timelineItem()'),
        ' 子元素来写。',
      ),

      h2('基础时间线'),
      demo(`timeline({
  items: [
    { time: '2026 年 3 月', title: '组件库', description: 'sitelo-ui 带着九十个组件发布。' },
    { time: '2026 年 1 月', title: '服务端区块', description: '静态页面里有一部分区域在请求时才渲染。' },
    { time: '2025 年 10 月', title: '首个版本', description: '基于文件的路由，加上一条构建命令。' },
  ],
})`, { align: 'stretch' }),

      h2('彩色标记点'),
      demo(`timeline({
  items: [
    { time: '12:04', title: '部署成功', description: '发布了 204 个页面。', color: 'success' },
    { time: '12:03', title: 'Lighthouse 通过', description: '所有阈值都达标。', color: 'success' },
    { time: '12:01', title: '链接检查有警告', description: '有一条外链超时了。', color: 'warning' },
    { time: '12:00', title: '构建开始', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('带图标'),
      demo(`timeline(
  timelineItem({
    time: '刚刚',
    title: '已发布',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: '2 分钟前',
    title: '构建中',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('内容更丰富的条目'),
      p('条目的子元素会排在它的描述下面。'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: '页面区块', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: '维护', description: '升了依赖，并修好了链接检查器。' }),
)`, { align: 'stretch' }),

      h2('由数据生成'),
      p(
        '静态站点上的常见做法：由 ',
        code('data()'),
        ' 加载一个更新日志文件，直接映射成条目。',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: '页面区块' },
    { version: '2.6.3', date: '2026-02-14', summary: '维护' },
    { version: '2.6.0', date: '2026-01-20', summary: '服务端区块' },
  ]

  return timeline({
    items: releases.map((release) => ({
      time: release.date,
      title: 'v' + release.version,
      description: release.summary,
      color: 'primary',
    })),
  })
})()`, { align: 'stretch' }),

      h2('用时间线还是用步骤？'),
      p(
        '时间线记录已经发生过的事，可以从新到旧也可以从旧到新，并没有「当前位置」这一说。',
        code('steps()'),
        ' 展示的是在一条流程里走到哪儿了：有一步正在进行，其余分列它的前后。',
      ),

      h2('属性'),
      p(code('timeline()'), '：'),
      propsTable([
        ['items', 'Array', '[]', '带有下面这些 timelineItem 属性的对象。'],
      ]),
      p(code('timelineItem()'), '：'),
      propsTable([
        ['time', 'Child', '', '发生的时间——日期、版本号或时刻。'],
        ['title', 'Child', '', '发生了什么。'],
        ['description', 'Child', '', '下面的细节。'],
        ['icon', 'Child', '', '标记点里面的标记内容。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', '标记点的颜色。'],
      ]),
      p('条目的子元素会渲染在它的描述下方。'),
    ],
  })
