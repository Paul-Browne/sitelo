import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/zh.js'

export default () =>
  uiLayout({
    title: '模态框',
    description: '真正的 <dialog>，以模态方式打开——遮罩、焦点、Esc 和点击外部都交给浏览器。',
    activeHref: '/zh/ui/modal',
    children: [
      p(
        '模态框就是一个 ',
        code('<dialog>'),
        ' 元素。任何带有指向模态框 ',
        code('id'),
        ' 的 ',
        code('commandfor'),
        ' 和 ',
        code("command: 'show-modal'"),
        ' 的按钮都能以模态方式打开它：背后的页面变为惰性（inert），焦点和读屏器都会留在对话框内。全程没有脚本，遮罩、Esc 和点击外部关闭统统归浏览器管。',
      ),
      p(
        '这也是 ',
        code('id'),
        ' 必填、缺了就抛错的原因：那个 id 就是全部的接线。',
      ),

      h2('基础模态框'),
      p('本页每个模态框都是真能打开的——试试看。'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, '打开模态框'),
  modal({ id: 'demo-basic', title: '重新构建站点？' },
    '这会运行 sitelo build 并重新发布 dist/。',
  ),
)`),

      h2('带页脚'),
      p(
        '所谓关闭按钮，就是任何指向同一个 id 并带上 ',
        code("command: 'close'"),
        ' 的按钮。',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, '删除页面…'),
  modal({
    id: 'demo-confirm',
    title: '要删除这个页面吗？',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, '取消'),
      button({ color: 'danger' }, '删除'),
    ),
  }, '此操作无法撤销。下次构建时生成的 HTML 就会消失。'),
)`),

      h2('尺寸'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, '小'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, '中'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, '大'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: '小' }, 'size: sm——大约 24rem。'),
  modal({ id: 'demo-md', title: '中' }, '默认值——大约 32rem。'),
  modal({ id: 'demo-lg', size: 'lg', title: '大' }, 'size: lg——大约 48rem。'),
)`),

      h2('模态框里的表单'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, '新建页面…'),
  modal({
    id: 'demo-form',
    title: '新建页面',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, '取消'),
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
        ' 会去掉角落里的 ×。Esc 和点击外部仍然能关掉它；加上 ',
        code("closedby: 'closerequest'"),
        ' 后就只有 Esc 能关。',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, '没有关闭按钮'),
  modal({ id: 'demo-bare', title: '请按 Esc', closable: false },
    '或者点这个对话框以外的任何地方。',
  ),
)`),

      h2('长内容'),
      p('主体会滚动，头部和页脚待着不动。'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, '很长的模态框'),
  modal({
    id: 'demo-long',
    title: '发布说明',
    footer: button({ commandfor: 'demo-long', command: 'close' }, '关闭'),
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
        '模态框打开时，它背后的页面不会滚动。这是模态对话框唯一留给你自己处理的部分，而这里是用 CSS 做的——没有脚本，也没有什么需要初始化。传 ',
        code('lockScroll: false'),
        ' 就能让背景照常滚动。',
      ),

      h2('浏览器支持'),
      p(
        '用按钮的 command 打开对话框，所有当前的浏览器都支持——Chrome 135、Firefox 144、Safari 26.2 及更新版本。在更旧的浏览器里，button() 会加上一个 onclick，加载几百字节的 /su/dialog.js 来完成同样的事——只在那里，而且只在第一次点击时。Safari 目前还不支持点击外部关闭（closedby），在那里同样由这个文件处理。',
      ),

      h2('属性'),
      propsTable([
        ['id', 'string', '', '必填。触发按钮的 commandfor 所指向的目标。'],
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
