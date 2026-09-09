import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Переключатель темы',
    description:
      'Переключатель светлой и тёмной темы вместе со встроенным скриптом, из-за которого сохранённый выбор не мигает при входе.',
    activeHref: '/ru/ui/theme-toggle',
    extraHead: uiHead(),
    children: [
      p(
        'sitelo-ui сам определяет тёмный режим по ',
        code('prefers-color-scheme'),
        ': сайту, которого устраивает следовать за операционной системой, с этой страницы не нужно ничего. Переключатель нужен, чтобы читатель мог это переопределить.',
      ),
      p(
        'Это один из пяти компонентов, которым нужен скрипт, потому что выбор живёт в ',
        code('localStorage'),
        ', а прочитать его может только скрипт. Кнопка сама подгружает этот скрипт при первом нажатии.',
      ),

      h2('Подключение'),
      p('Две вещи в head и кнопка там, где ей место:'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // применяет сохранённый выбор до первой отрисовки
  styles(),
)

body(
  appBar({ brand: 'Мой сайт' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        'Третьего файла нет. ',
        code('themeScript()'),
        ' намеренно блокирующий и встроенный — всё отложенное рисуется раньше, а это и есть та самая тёмная вспышка, ради предотвращения которой он существует, — а само переключение едет на кнопке:',
      ),
      codeBlock('Итоговая разметка', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        'Используйте их в паре. ',
        code('themeScript()'),
        ' заодно и проставляет переключателю ',
        code('aria-pressed'),
        ' при загрузке: ведь ничего ещё не нажимали, и сама кнопка не может знать, какая тема получилась.',
      ),

      h2('Сам переключатель'),
      p(
        'Иконка — чистый CSS, считанный прямо с атрибута темы, поэтому она верна уже при первой отрисовке, до запуска любого скрипта. Она показывает, на что переключит клик.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Эти кнопки работают — страница подгружает рантайм. Клик выставляет ',
        code('data-su-theme'),
        ' на ',
        code('<html>'),
        ' — это собственный атрибут sitelo-ui, поэтому меняются только компоненты sitelo-ui на этой странице. Остальной сайт следует своему ',
        code('data-theme'),
        ', который задаёт переключатель в верхней панели. На вашем сайте он был бы один.',
      ),

      h2('В панели приложения'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Документация')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Начать'),
  ),
)`, { align: 'stretch' }),

      h2('Как определяется тема'),
      p(
        'По порядку: явный ',
        code('data-theme'),
        ' или ',
        code('data-su-theme'),
        ' на любом предке побеждает; если их нет, решает ',
        code('prefers-color-scheme'),
        '. Оба имени атрибутов учитываются, чтобы sitelo-ui мог жить внутри сайта, у которого уже есть собственный переключатель темы, — ровно так и устроена эта документация.',
      ),

      h2('Управлять самому'),
      p(
        'Рантайм экспортирует те же функции, которыми пользуется кнопка, — для собственного элемента управления или переключателя из трёх положений: светлая / тёмная / системная.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — вычисленная, не сохранённая
toggleTheme()       // переключить
setTheme('dark')    // закрепить
setTheme('system')  // снять переопределение и снова следовать за ОС`, 'javascript'),

      h2('Пропсы'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Доступное имя и всплывающая подсказка.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Вариант кнопки.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Из какой палитры брать цвета.'],
      ]),
      p(
        code('themeScript()'),
        ' принимает необязательный ',
        code('nonce'),
        ' — для сайта с политикой безопасности содержимого.',
      ),
    ],
  })
