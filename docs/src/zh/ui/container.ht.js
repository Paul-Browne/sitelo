import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '容器',
    description: '居中且限宽的一栏——多数页面最外层的那层包裹。',
    activeHref: '/zh/ui/container',
    extraHead: uiHead(),
    children: [
      p(
        '容器把内容居中、给宽度封顶让文字行保持易读，并留出一圈边距，免得在手机上有东西贴到屏幕边缘。它通常是 ',
        code('body()'),
        ' 里的第一样东西。',
      ),

      h2('基础容器'),
      demo(`container(
  text({ variant: 'lead' }, '里面的一切都保持居中，到了尺寸上限就不再变宽。'),
)`, { align: 'stretch' }),

      h2('尺寸'),
      p(
        '五档，从单栏可读宽度一直到完全不限。',
        code('sm'),
        ' 大约是 40rem——差不多就是正文想要的宽度。',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem（默认）'),
  ),
)`, { align: 'stretch' }),

      h2('自定义宽度'),
      p(
        code('width'),
        ' 接受任意 CSS 长度，并盖过 ',
        code('size'),
        '，留给那种尺度里没有的特殊页面。',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('边距'),
      p(
        '边距是内容与视口边缘之间保留的内边距。它接受一个间距令牌、若干个间距单位，或者一个原始长度值。',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, '更宽的边距，适合那种在平板上内容不该顶到边缘的页面。'),
)`, { align: 'stretch' }),

      h2('渲染为其他元素'),
      p(
        code('as'),
        ' 只换标签，其余一概不变——当容器同时也是页面的 ',
        code('<main>'),
        ' 或某个 ',
        code('<section>'),
        ' 时很有用。',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, '一个 main 元素'),
  text({ tone: 'muted' }, '布局一样，地标正确。'),
)`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", '采用哪一档宽度上限。'],
        ['width', 'string', '', '原始的 max-width，会盖过 size。'],
        ['gutter', 'Space', "'md'", '与视口边缘之间保留的横向内边距。'],
        ['as', 'string', "'div'", '渲染成哪个元素，例如 main 或 section。'],
      ]),
    ],
  })
