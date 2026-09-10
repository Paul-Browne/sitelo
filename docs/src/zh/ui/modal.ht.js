import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '模态框',
    description: '基于 popover API 的对话框——打开、遮罩、点击外部和 Esc 都交给浏览器。',
    activeHref: '/zh/ui/modal',
    children: [
      p(
        '模态框就是一个 ',
        code('popover'),
        ' 元素。任何 ',
        code('popovertarget'),
        ' 与模态框 ',
        code('id'),
        ' 匹配的按钮都能打开它——全程没有脚本，遮罩、点击外部关闭、Esc 和焦点处理统统归浏览器管。',
      ),
      p(
        '这也是 ',
        code('id'),
        ' 必填、缺了就抛错的原因：那个 id 就是全部的接线。',
      ),

      h2('基础模态框'),
      p('本页每个模态框都是真能打开的——试试看。'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, '打开模态框'),
  modal({ id: 'demo-basic', title: '重新构建站点？' },
    '这会运行 sitelo build 并重新发布 dist/。',
  ),
)`),

      h2('带页脚'),
      p(
        '所谓关闭按钮，就是任何指向同一个 id 并带上 ',
        code('popovertargetaction="hide"'),
        ' 的按钮。',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, '删除页面…'),
  modal({
    id: 'demo-confirm',
    title: '要删除这个页面吗？',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, '取消'),
      button({ color: 'danger' }, '删除'),
    ),
  }, '此操作无法撤销。下次构建时生成的 HTML 就会消失。'),
)`),

      h2('尺寸'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, '小'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, '中'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, '大'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: '小' }, 'size: sm——大约 24rem。'),
  modal({ id: 'demo-md', title: '中' }, '默认值——大约 32rem。'),
  modal({ id: 'demo-lg', size: 'lg', title: '大' }, 'size: lg——大约 48rem。'),
)`),

      h2('模态框里的表单'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, '新建页面…'),
  modal({
    id: 'demo-form',
    title: '新建页面',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, '取消'),
      button({ type: 'submit' }, '创建'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: '标题', name: 'modal-title', placeholder: '关于' }),
      selectField({ label: '扩展名', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('不带关闭按钮'),
      p(
        code('closable: false'),
        ' 会去掉角落里的 ×。Esc 和点击外部仍然能关掉它——popover 没法做成真正的强制阻断，而且多数情况下这本来就是对的行为。',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, '没有关闭按钮'),
  modal({ id: 'demo-bare', title: '请按 Esc', closable: false },
    '或者点这个对话框以外的任何地方。',
  ),
)`),

      h2('长内容'),
      p('主体会滚动，头部和页脚待着不动。'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, '很长的模态框'),
  modal({
    id: 'demo-long',
    title: '发布说明',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, '关闭'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, '变更 ' + (index + 1) + '——修好了点东西。'),
      ),
    ),
  ),
)`),

      h2('背景滚动'),
      p(
        '模态框打开时，它背后的页面不会滚动。这是 popover API 唯一留给你自己处理的部分，而这里是用 CSS 做的——没有脚本，也没有什么需要初始化。传 ',
        code('lockScroll: false'),
        ' 就能让背景照常滚动。',
      ),

      h2('浏览器支持'),
      p(
        'popover API 在所有当前的浏览器里都可用。如果浏览器老到不认识它，模态框会内联渲染在页面里，而不是浮在上面：仍然看得见、用得了，只是没有覆盖效果。什么都不会消失。',
      ),

      h2('属性'),
      propsTable([
        ['id', 'string', '', '必填。触发按钮的 popovertarget 所指向的目标。'],
        ['title', 'Child', '', '标题，同时也是对话框的无障碍名称。'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", '最大宽度。'],
        ['footer', 'Child', '', '底部一行，带有自己的浅色底带。'],
        ['closable', 'boolean', 'true', '在头部显示 ×。'],
        ['closeLabel', 'string', "'Close'", '该按钮的无障碍名称。'],
        ['lockScroll', 'boolean', 'true', '打开期间阻止背后的页面滚动。'],
      ]),
      p(
        code('closeButton({ target })'),
        ' 会单独渲染那个 ×，供你自己搭建头部时使用。',
      ),
    ],
  })
