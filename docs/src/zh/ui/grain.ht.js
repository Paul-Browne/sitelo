import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '颗粒',
    description: '一层包裹，把胶片颗粒铺在它装着的任何东西上。',
    activeHref: '/zh/ui/grain',
    children: [
      p(
        '颗粒能让一大片纯色不再发平——英雄区、一条色带、一张原本只会读成光板矩形的卡片。它包裹内容的方式和 ',
        code('container()'),
        ' 一样，但自己不设宽度：纹理画在 ',
        code('::after'),
        ' 上，盖在子元素之上，并且不拦指针。',
      ),
      p(
        '这块贴片是一张静态的分形噪声 SVG，画一次然后平铺。改用 ',
        code('filter'),
        ' 去滤实时像素看起来差不多，但底下的东西每动一次就要重新栅格化一次。',
      ),

      h2('基础颗粒'),
      demo(`grain({ style: 'background: var(--su-surface-2); padding: 2rem; border-radius: 0.75rem' },
  text({ variant: 'lead', align: 'center' }, '有纹理了。'),
)`, { align: 'stretch' }),

      h2('强度'),
      p(
        '三档。主题定基础强度，强度再按比例缩放它——因为近黑的表面比纸面更吃颗粒：按感知明度量，同一块贴片在深色底上的斑点大约是 1.6 倍。所以深色模式下的 ',
        code('medium'),
        ' 是更低的不透明度，两边最后落在同一个位置。',
      ),
      demo(`grid({ min: '9rem' },
  ...['soft', 'medium', 'strong'].map((intensity) =>
    grain({ intensity, style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, intensity),
    ),
  ),
)`, { align: 'stretch' }),

      h2('尺度'),
      p('一块噪声贴片的大小。越小越细：更靠近胶片，离沙砾更远。'),
      demo(`grid({ min: '9rem' },
  ...['60px', '180px', '420px'].map((scale) =>
    grain({ scale, intensity: 'strong', style: 'background: var(--su-surface-2); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, scale),
    ),
  ),
)`, { align: 'stretch' }),

      h2('套在容器外面'),
      p(
        '颗粒自己不带宽度上限，这正是这一招能成的原因：外面那层通铺到边，里面的 ',
        code('container()'),
        ' 把文字保持在居中、可读的一栏里。',
      ),
      demo(`grain({ as: 'section', style: 'background: var(--su-primary-soft); padding-block: 2.5rem; border-radius: 0.75rem' },
  container({ size: 'sm' },
    stack({ gap: 'sm', align: 'center' },
      heading({ level: 2, size: 'h4' }, '一条有纹理的色带'),
      text({ tone: 'muted', align: 'center' }, '外面通宽，里面是可读的一栏。'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('盖在卡片上'),
      p(
        '纹理继承盒子自己的 ',
        code('border-radius'),
        '，所以包住一个圆角的东西不会把它的角削方。',
      ),
      demo(`grid({ min: '12rem' },
  grain({ style: 'border-radius: var(--su-radius-lg)' },
    card({ variant: 'elevated' },
      cardBody(text({ variant: 'small' }, '带颗粒')),
    ),
  ),
  card({ variant: 'elevated' },
    cardBody(text({ variant: 'small' }, '不带')),
  ),
)`, { align: 'stretch' }),

      h2('混合'),
      p(
        '默认情况下，纹理以自己的不透明度铺在内容上面。',
        code('blend'),
        ' 接受任何 ',
        code('mix-blend-mode'),
        '：',
        code('overlay'),
        ' 和 ',
        code('soft-light'),
        ' 会把颗粒推进底下的颜色里，而不是把它变灰。',
      ),
      demo(`grid({ min: '9rem' },
  ...['normal', 'overlay', 'soft-light'].map((blend) =>
    grain({ blend, intensity: 'strong', style: 'background: var(--su-primary-soft); padding: 1.5rem 1rem; border-radius: 0.5rem' },
      text({ variant: 'small', align: 'center' }, blend),
    ),
  ),
)`, { align: 'stretch' }),

      h2('属性'),
      propsTable([
        ['intensity', "'soft' | 'medium' | 'strong'", "'medium'", '纹理推到多重，相对于主题的基础值。'],
        ['opacity', 'number', '', '直接给的不透明度，盖过 intensity 和主题。'],
        ['scale', 'string', "'180px'", '一块噪声贴片的大小。'],
        ['blend', 'string', "'normal'", '纹理用的 mix-blend-mode。'],
        ['as', 'string', "'div'", '渲染成什么元素，比如 section。'],
      ]),
    ],
  })
