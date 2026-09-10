import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Шаги',
    description:
      'Пронумерованный путь, где пройденные шаги отмечены как выполненные.',
    activeHref: '/ru/ui/steps',
    children: [
      p(
        code('current'),
        ' — индекс текущего шага. Всё, что до него, завершено и получает галочку; всё, что после, ещё впереди. Текущий помечается ',
        code('aria-current="step"'),
        ', поэтому он не только окрашен, но и объявляется.',
      ),

      h2('Простые шаги'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Установить' },
    { title: 'Написать страницу' },
    { title: 'Собрать' },
    { title: 'Развернуть' },
  ],
})`, { align: 'stretch' }),

      h2('С описаниями'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Установить', description: 'npm install -D sitelo' },
    { title: 'Написать страницу', description: 'src/index.ht.js' },
    { title: 'Собрать', description: 'sitelo build' },
    { title: 'Развернуть', description: 'Опубликовать dist/' },
  ],
})`, { align: 'stretch' }),

      h2('Вертикально'),
      p('Лучше, когда описания длиннее пары слов.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Добавьте пакет', description: 'sitelo приносит собственный Vite, так что ставить больше нечего.' },
    { title: 'Напишите функцию, возвращающую HTML', description: 'Один файл в src/ — это уже целый сайт.' },
    { title: 'Опубликуйте результат', description: 'dist/ — это обычные статические файлы, их примет любой хостинг.' },
  ],
})`, { align: 'stretch' }),

      h2('Пока ничего не сделано'),
      demo(`steps({ current: 0, items: ['Установить', 'Настроить', 'Развернуть'] })`, { align: 'stretch' }),

      h2('Всё сделано'),
      p(
        'Поставьте ',
        code('current'),
        ' за последний индекс — и все шаги читаются как завершённые.',
      ),
      demo(`steps({ current: 3, items: ['Установить', 'Настроить', 'Развернуть'] })`, { align: 'stretch' }),

      h2('На телефоне'),
      p(
        'Горизонтальному ряду на узком экране деваться некуда, поэтому ниже 40rem он сам становится вертикальным — никаких пропсов не нужно. Сузьте это окно, чтобы увидеть.',
      ),

      h2('Подпись для списка'),
      p(
        'Список — это ',
        code('<ol>'),
        ', порядок в нём уже заложен. Добавляйте ',
        code('label'),
        ', когда на странице больше одного набора шагов и их нужно различать.',
      ),
      demo(`steps({
  label: 'Ход развёртывания',
  current: 1,
  items: ['Сборка', 'Загрузка', 'Сброс кэша'],
})`, { align: 'stretch' }),

      h2('Продвигать поток'),
      p(
        'Состояние — это три имени класса и один ',
        code('aria-current'),
        ', разбросанные по всем шагам. ',
        code('setStep()'),
        ' двигает их вместе, так что мастер, который идёт вперёд в браузере, — это один вызов, а не цикл.',
      ),
      p('Индекс за последним шагом оставляет завершёнными все — так и выглядит законченный поток. Или прямо из атрибута события, без единого байта в бандле:'),
      codeBlock('Где угодно', `button({ onclick: "import('/su/steps.js').then(m=>m.set('checkout',2))" }, 'Next')`, 'javascript'),
      p('Или из вашего собственного модуля, если он и так уже работает:'),
      codeBlock('src/main.js', `import { setStep } from 'sitelo/ui/client'

setStep('checkout', 2)`, 'javascript'),

      h2('Пропсы'),
      propsTable([
        ['items', 'Array', '[]', 'Строки или объекты { title, description }.'],
        ['current', 'number', '0', 'Индекс текущего шага.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Раскладка. Горизонтальная ниже 40rem становится вертикальной.'],
        ['label', 'string', '', 'Доступное имя списка.'],
      ]),
    ],
  })
