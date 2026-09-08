import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Выпадающий список',
    description:
      'Нативный select, оформленный в тон остальным полям, с опциями, собранными из данных.',
    activeHref: '/ru/ui/select',
    extraHead: uiHead(),
    children: [
      p(
        'Это настоящий ',
        code('<select>'),
        ' с собственным выпадающим меню браузера — а значит, он работает без JavaScript, правильно открывается на телефоне и управляется с клавиатуры, ничего не получая от этой библиотеки.',
      ),
      p(
        code('select()'),
        ' — это голый элемент управления; ',
        code('selectField()'),
        ' оборачивает его подписью, подсказкой и сообщением об ошибке — ровно так же, как это делает ',
        code('textField()'),
        '.',
      ),

      h2('Простой список'),
      p(
        'Опции могут быть обычными строками — тогда значение и подпись совпадают.',
      ),
      demo(`selectField({
  label: 'Тема',
  name: 'theme',
  options: ['Светлая', 'Тёмная', 'Системная'],
})`, { align: 'stretch' }),

      h2('Значения и подписи'),
      p(
        'Передавайте объекты, когда отправляемое значение отличается от текста, который читает человек. ',
        code('value'),
        ' помечает выбранную опцию.',
      ),
      demo(`selectField({
  label: 'Каталог сборки',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — по умолчанию' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Заполнитель'),
      p(
        'Заполнитель рисуется отключённой первой опцией, выбранной, когда ',
        code('value'),
        ' не задан, — так поле стартует пустым, не будучи при этом допустимым выбором.',
      ),
      demo(`selectField({
  label: 'Куда развёртывать',
  name: 'target',
  placeholder: 'Выберите хостинг…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Группы'),
      p(
        'Запись с собственным массивом ',
        code('options'),
        ' превращается в ',
        code('<optgroup>'),
        '.',
      ),
      demo(`selectField({
  label: 'Расширение страницы',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Размеры'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Маленький', name: 'sm', size: 'sm', options: ['Раз', 'Два'] }),
  selectField({ label: 'Средний', name: 'md', size: 'md', options: ['Раз', 'Два'] }),
  selectField({ label: 'Большой', name: 'lg', size: 'lg', options: ['Раз', 'Два'] }),
)`, { align: 'stretch' }),

      h2('Подсказка, ошибка и отключение'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Язык',
    name: 'locale',
    options: ['en', 'es', 'fr'],
    help: 'Используется для атрибута lang у html.',
  }),
  selectField({
    label: 'Фреймворк',
    name: 'framework',
    placeholder: 'Выберите один…',
    options: ['sitelo'],
    error: 'Чтобы продолжить, выберите фреймворк.',
  }),
  selectField({
    label: 'Тариф',
    name: 'plan',
    options: ['Бесплатный'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('Из данных'),
      p(
        'Опции — это просто массив, поэтому обычно они берутся из того, что ',
        code('data()'),
        ' уже загрузил для страницы.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Привет, мир' },
    { slug: 'static-first', title: 'Статика прежде всего' },
    { slug: 'no-runtime', title: 'Никакого рантайма' },
  ]

  return selectField({
    label: 'Избранный пост',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'Строки, объекты { value, label, disabled } или { label, options } для группы.'],
        ['value', 'string | number', '', 'Какая опция выбрана.'],
        ['placeholder', 'string', '', 'Отключённая первая опция, выбранная, когда значения нет.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Высота элемента и размер текста.'],
        ['name', 'string', '', 'Имя поля формы; из него выводится id.'],
        ['invalid', 'boolean', 'false', 'Выставляет aria-invalid. selectField делает это за вас на основе error.'],
        ['disabled', 'boolean', 'false', 'Отключает элемент.'],
      ]),
      p(
        code('selectField()'),
        ' дополнительно принимает ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ' и ',
        code('fieldClass'),
        ' — см. ',
        code('textField()'),
        '. Потомки добавляются после сгенерированных опций, так что нужные можно дописать руками.',
      ),
    ],
  })
