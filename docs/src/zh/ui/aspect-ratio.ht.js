import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '宽高比',
    description: '把一个盒子固定成某个形状，内容加载时页面上的东西就不会跳动。',
    activeHref: '/zh/ui/aspect-ratio',
    extraHead: uiHead(),
    children: [
      p(
        '还没加载任何东西时，高度就已经由宽度定下来了，所以姗姗来迟的图片或嵌入内容不会把页面其余部分往下挤。子元素会填满盒子并被裁切，而不是留出黑边。',
      ),

      h2('基础宽高比'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('常见比例'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('嵌入内容'),
      p(
        '这个组件存在的理由：',
        code('<iframe>'),
        ' 没有固有尺寸，不给比例就会塌掉，或者只能写死一个高度。',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">这里会放一个 &lt;iframe&gt;</div>',
)`, { align: 'stretch' }),

      h2('在卡片中'),
      p(
        '卡片顶部已经由 ',
        code('cardMedia()'),
        ' 做了这件事。盒子在别处时，才用 ',
        code('aspectRatio()'),
        '。',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia——内置')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio——其他任何地方'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('裁切'),
      p(
        '子元素会被拉伸填满，并按 ',
        code('object-fit: cover'),
        ' 裁切。对于不能被裁的东西——标志、图示——请在子元素上设置 ',
        code('object-fit: contain'),
        '，本页每个示例都是这么做的。',
      ),

      h2('属性'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", '任意 CSS aspect-ratio 值。'],
        ['as', 'string', "'div'", '渲染成哪个元素。'],
      ]),
    ],
  })
