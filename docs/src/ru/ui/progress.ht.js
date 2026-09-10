import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Прогресс',
    description:
      'Полоса для работы с известным концом и спиннер для работы без него.',
    activeHref: '/ru/ui/progress',
    children: [
      p(
        'Берите определённую полосу всякий раз, когда знаете, сколько осталось: только она хоть что-то сообщает читателю. Опустите ',
        code('value'),
        ' — и полоса вместо этого анимируется, что говорит «всё ещё работаю» и больше ничего.',
      ),

      h2('Определённый прогресс'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Неопределённый прогресс'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'Полоса без ',
        code('label'),
        ' помечается ',
        code('aria-hidden'),
        ': роль progressbar без доступного имени ничего не сообщает скринридеру, поэтому неподписанная полоса считается декорацией. Подписывайте всё, за чем читателю положено следить.',
      ),

      h2('Подписи'),
      p(
        'Подпись называет происходящее; ',
        code('showValue'),
        ' добавляет справа проценты.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Рендерим страницы', showValue: true }),
  progress({ value: 30, max: 60, label: 'Оптимизируем изображения', showValue: true }),
  progress({ label: 'Ждём развёртывания' }),
)`, { align: 'stretch' }),

      h2('Цвета и высота'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Успешно', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'С оговорками', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'Падает', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('Шкала не из 100'),
      p(
        code('max'),
        ' позволяет передавать сырые числа — собранных страниц из общего числа — вместо того чтобы сначала считать проценты.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 из 169 страниц', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Двигать её из браузера'),
      p(
        'Полоса — это HTML, отрисованный на сервере: процент лежит в пользовательском свойстве на заливке, а число — в ',
        code('aria-valuenow'),
        ', и ничто на странице не меняет ни то, ни другое само по себе. Дайте полосе ',
        code('id'),
        ', и ',
        code('setProgress'),
        ' сдвинет всё сразу — заливку, объявляемое значение и процент рядом с подписью.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'Максимум запоминается, так что дальше достаточно передавать значение. Или дотянитесь до модуля так же, как это делают компоненты, и обойдитесь без бандла вовсе:',
      ),
      codeBlock('Где угодно', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Завершить')`, 'javascript'),
      p(
        'Передача ',
        code('null'),
        ' — или чего угодно, что не является конечным числом — возвращает полосу к неопределённой анимации, поэтому работу, переставшую сообщать числа, не нужно выделять в отдельный случай. ',
        code('getProgress()'),
        ' читает текущее значение обратно, в собственной шкале полосы.',
      ),

      h2('Попробуйте'),
      p('Эта страница загружает рантайм, так что кнопки ниже действительно двигают полосу.'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'Загрузка', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Сброс'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Готово'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Неизвестно'),
  ),
)`, { align: 'stretch' }),
      p(
        'Полоса без подписи тоже сдвинется, но останется ',
        code('aria-hidden'),
        ' — её намеренно отрисовали без имени, и объявить ей значение сейчас значило бы поместить в дерево доступности progressbar без имени.',
      ),

      h2('Спиннер'),
      p(
        'Отдельного компонента-спиннера нет — спиннер это иконка, а вращает её ',
        code('spin'),
        '. Как и любая иконка, он задаётся в ',
        code('em'),
        ', поэтому подходит к любому соседнему тексту, и размер ему называть не нужно.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('Спиннер в контексте'),
      p(
        'Дайте одиночному спиннеру ',
        code('label'),
        ', чтобы его объявляли. Спиннеру внутри кнопки это не нужно: кнопка и так говорит, что делает.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'Загрузка' }),
    text({ variant: 'small', tone: 'muted' }, 'Получаем последнюю сборку…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Разворачиваем'),
    button({ variant: 'outline', loading: true }, 'Проверяем ссылки'),
  ),
)`, { align: 'start' }),

      h2('Пропсы'),
      p(code('progress()'), ' — экспортируется также как ', code('progressBar'), ':'),
      propsTable([
        ['value', 'number', '', 'Насколько продвинулись. Опустите для неопределённой анимации.'],
        ['max', 'number', '100', 'Какое значение считается завершением.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Цвет заливки.'],
        ['label', 'Child', '', 'Текст над полосой; он же её доступное имя.'],
        ['showValue', 'boolean', 'false', 'Показывать проценты рядом с подписью.'],
        ['height', 'Space', "'0.5rem'", 'Толщина полосы.'],
      ]),
      p(code('setProgress()'), ' из ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['target', 'Element | string', '', 'Полоса или её id. Если элемента с таким id нет, строка пробуется как селектор.'],
        ['value', 'number | null', '', 'Куда её сдвинуть. null возвращает её к неопределённой анимации.'],
        ['options.max', 'number', '100', 'Что считается завершённым. Запоминается для последующих вызовов.'],
      ]),
      p(
        'Своих пропсов у спиннера нет — это ',
        code("icon('spinner', { spin: true })"),
        ', и он принимает то же, что и ',
        code('icon()'),
        '.',
      ),
    ],
  })
