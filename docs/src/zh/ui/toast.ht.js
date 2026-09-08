import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/zh.js'
import { preview, uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: '轻提示',
    description: '角落里一条转瞬即逝的消息，由脚本添加进页面已经渲染好的那块区域。',
    activeHref: '/zh/ui/toast',
    extraHead: uiHead(),
    children: [
      p(
        '轻提示是这里唯一没法做成静态的组件：它是因为某件事发生了才出现的。页面用 ',
        code('toasts()'),
        ' 渲染出一块空区域，再由 ',
        code('sitelo/ui/client'),
        ' 里的 ',
        code('toast()'),
        ' 往里追加。',
      ),
      p(
        '这块区域是一个礼貌型的实时区域，所以追加进去的内容会被播报，但不会抢走焦点。',
      ),

      h2('接入方式'),
      p('把这块区域放在 body 里的任何地方——它是固定定位的，所以放哪儿都行：'),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …页面内容…
  toasts(),
)`, 'javascript'),
      p(
        '这是运行时里唯一没有任何页面元素替你触发的部分，所以也是唯一需要你自己导入的部分：',
      ),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

document.querySelector('#save').addEventListener('click', () => {
  toast('已保存。', { color: 'success' })
})`, 'javascript'),
      p('或者像其他组件那样去取它，把打包这一步整个跳过：'),
      codeBlock('任意位置', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('已保存。'))" }, '保存')`, 'javascript'),

      h2('试一试'),
      p(
        '本页渲染了一块 ',
        code('toasts()'),
        ' 区域并加载了运行时，所以下面这些按钮真的会弹出提示——在右下角。',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "window.siteloUiToast && window.siteloUiToast('已保存。', 'success')",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "window.siteloUiToast && window.siteloUiToast('有两个页面没有 meta description。', 'warning')",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "window.siteloUiToast && window.siteloUiToast('构建失败了。看看链接检查报告。', 'danger')",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "window.siteloUiToast && window.siteloUiToast('这条会一直留着，直到你关掉它。', 'neutral', 0)",
  }, '直到手动关闭'),
)`),
      // 本页按钮往里追加内容的那块实时区域。它是固定定位的，所以在这里
      // 渲染，却出现在视口的角落。
      preview('toasts()'),

      h2('选项'),
      p(
        code('duration'),
        ' 是这条提示停留多久，单位毫秒；',
        code('0'),
        ' 会让它一直留到有人关掉为止。每条提示都带关闭按钮，接的是和提示组件同一个关闭处理函数。',
      ),
      codeBlock('选项', `toast('已保存。', { color: 'success' })
toast('还在处理…', { color: 'neutral', duration: 0 })
toast('1.7 秒内完成部署', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('它渲染出什么'),
      p(
        '一条轻提示就是放在提示区域里的一个 ',
        code('alert()'),
        '——同样的标记、同样的配色、同样的关闭按钮。没有新东西要学，也没有额外样式要写。',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, '已保存。'),
  alert({ color: 'danger', dismissible: true }, '构建失败了。看看链接检查报告。'),
)`, { align: 'stretch' }),

      h2('什么时候该用它'),
      p(
        '轻提示用来确认读者刚做过的事。凡是需要他们采取行动、或者得仔细读的内容，都不该放这里——它会消失、很容易被错过，而且在静态站点上，多数消息本就该作为 ',
        code('alert()'),
        ' 待在页面里。',
      ),

      h2('属性'),
      p(code('toasts()'), ' 自己不接受任何属性。', code('sitelo/ui/client'), ' 里的 ', code('toast()'), '：'),
      propsTable([
        ['message', 'string', '', '文字内容。会设为 textContent，所以绝不会被当作标记解析。'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", '用哪一套配色。'],
        ['duration', 'number', '4000', '多少毫秒后消失。0 表示一直留着。'],
      ], { headers: ['参数', '类型', '默认值', '说明'] }),
      p(
        '它会返回自己添加的那个元素；当页面没有 ',
        code('toasts()'),
        ' 区域时返回 ',
        code('null'),
        '。',
      ),
    ],
  })
