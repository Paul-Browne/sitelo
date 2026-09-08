import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { preview, uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Тост',
    description:
      'Мимолётное сообщение в углу, добавляемое скриптом в область, которую нарисовала страница.',
    activeHref: '/ru/ui/toast',
    extraHead: uiHead(),
    children: [
      p(
        'Тост — единственный компонент здесь, который не может быть статическим: он появляется в ответ на событие. Страница рисует пустую область через ',
        code('toasts()'),
        ', а ',
        code('toast()'),
        ' из ',
        code('sitelo/ui/client'),
        ' в неё добавляет.',
      ),
      p(
        'Эта область — вежливая live-регион, поэтому всё добавленное объявляется, не перехватывая фокус.',
      ),

      h2('Подключение'),
      p('Положите область куда угодно в body — она фиксированного позиционирования, так что место не важно:'),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …страница…
  toasts(),
)`, 'javascript'),
      p(
        'Это единственная часть рантайма, которую за вас ничто на странице не запускает, — а значит, единственная, которую вы импортируете сами:',
      ),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

document.querySelector('#save').addEventListener('click', () => {
  toast('Сохранено.', { color: 'success' })
})`, 'javascript'),
      p('Или дотянитесь до него так же, как это делают компоненты, и вовсе обойдитесь без бандла:'),
      codeBlock('Где угодно', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('Сохранено.'))" }, 'Сохранить')`, 'javascript'),

      h2('Попробуйте'),
      p(
        'Эта страница рисует область ',
        code('toasts()'),
        ' и загружает рантайм, поэтому кнопки ниже действительно порождают тосты — справа внизу.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "window.siteloUiToast && window.siteloUiToast('Сохранено.', 'success')",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "window.siteloUiToast && window.siteloUiToast('У двух страниц нет meta description.', 'warning')",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "window.siteloUiToast && window.siteloUiToast('Сборка упала. Посмотрите отчёт по ссылкам.', 'danger')",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "window.siteloUiToast && window.siteloUiToast('Этот останется, пока вы его не закроете.', 'neutral', 0)",
  }, 'До закрытия'),
)`),
      // Живая область, в которую добавляют кнопки этой страницы. Она
      // фиксированного позиционирования, поэтому рисуется здесь, а
      // появляется в углу окна.
      preview('toasts()'),

      h2('Опции'),
      p(
        code('duration'),
        ' — сколько тост держится, в миллисекундах; ',
        code('0'),
        ' оставляет его до тех пор, пока кто-нибудь не закроет. У каждого тоста есть кнопка закрытия, подключённая к тому же обработчику, что и у уведомления.',
      ),
      codeBlock('Опции', `toast('Сохранено.', { color: 'success' })
toast('Всё ещё работаю…', { color: 'neutral', duration: 0 })
toast('Развёрнуто за 1,7 с', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('Что он рисует'),
      p(
        'Тост — это ',
        code('alert()'),
        ' внутри области тостов: та же разметка, те же цвета, та же кнопка закрытия. Учить нечего, оформлять дополнительно тоже.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Сохранено.'),
  alert({ color: 'danger', dismissible: true }, 'Сборка упала. Посмотрите отчёт по ссылкам.'),
)`, { align: 'stretch' }),

      h2('Когда его использовать'),
      p(
        'Тост подтверждает то, что читатель только что сделал. Для всего, на что нужно отреагировать или что нужно внимательно прочесть, это неподходящее место: он исчезает, его легко не заметить, а на статическом сайте большинство сообщений живут прямо в странице в виде ',
        code('alert()'),
        '.',
      ),

      h2('Пропсы'),
      p(code('toasts()'), ' собственных пропсов не принимает. ', code('toast()'), ' из ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['message', 'string', '', 'Текст. Ставится как textContent, поэтому никогда не разбирается как разметка.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Какую палитру взять.'],
        ['duration', 'number', '4000', 'Миллисекунд до исчезновения. 0 оставляет его висеть.'],
      ], { headers: ['Аргумент', 'Тип', 'По умолчанию', 'Описание'] }),
      p(
        'Возвращает добавленный элемент или ',
        code('null'),
        ', если на странице нет области ',
        code('toasts()'),
        '.',
      ),
    ],
  })
