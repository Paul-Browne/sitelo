import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Текстовое поле',
    description:
      'Однострочный и многострочный ввод, где подпись, подсказка, сообщение об ошибке и id уже связаны за вас.',
    activeHref: '/ru/ui/text-field',
    extraHead: uiHead(),
    children: [
      p(
        'Здесь два слоя. ',
        code('input()'),
        ' и ',
        code('textarea()'),
        ' — голые элементы управления; ',
        code('textField()'),
        ' и ',
        code('textareaField()'),
        ' оборачивают один из них в подпись, подсказку и сообщение об ошибке и связывают их через ',
        code('for'),
        ' и ',
        code('aria-describedby'),
        '. Берите вторые, если только не собираете раскладку сами.',
      ),

      h2('Простое поле'),
      demo(`textField({ label: 'Имя', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Текст подсказки'),
      p(
        'Подсказка связана через ',
        code('aria-describedby'),
        ', поэтому скринридер читает её как часть поля, а не как отдельный текст после него.',
      ),
      demo(`textField({
  label: 'Почта',
  name: 'email',
  type: 'email',
  help: 'Мы пишем только о неудачных сборках.',
})`, { align: 'stretch' }),

      h2('Обязательное поле и ошибка'),
      p(
        code('error'),
        ' помечает поле недействительным, красит рамку, выставляет ',
        code('aria-invalid'),
        ' и наводит ',
        code('aria-describedby'),
        ' на сообщение — один проп, все четыре эффекта.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Проект', name: 'project', required: true, value: '' }),
  textField({
    label: 'Сайт',
    name: 'site',
    error: 'Это не URL.',
    value: 'sitelo точка dev',
  }),
)`, { align: 'stretch' }),

      h2('Размеры'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Маленькое', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Среднее', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Большое', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Приставки'),
      p(
        'Префикс или суффикс, приклеенный к самому полю, — для единиц измерения и постоянных кусков значения.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Сайт', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Таймаут сборки', name: 'timeout', endAdornment: 'секунд', value: '30' }),
)`, { align: 'stretch' }),

      h2('Отключено и только для чтения'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Отключено', name: 'disabled', value: 'Редактировать нельзя', disabled: true }),
  textField({ label: 'Только для чтения', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Многострочное'),
      p(
        code('textareaField()'),
        ' — то же поле вокруг ',
        code('<textarea>'),
        '. Его значение является содержимым элемента, а не атрибутом, и об этом заботится сам компонент.',
      ),
      demo(`textareaField({
  label: 'Описание',
  name: 'description',
  rows: 4,
  help: 'Показывается в результатах поиска и в карточках для соцсетей.',
  value: 'Генерация статических сайтов без настройки, на Vite.',
})`, { align: 'stretch' }),

      h2('В форме'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Имя', name: 'contact-name', required: true }),
      textField({ label: 'Почта', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'Сообщение', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Отмена'),
    button({ type: 'submit' }, 'Отправить'),
  ),
)`, { align: 'stretch' }),

      h2('Собрать самому'),
      p(
        code('field()'),
        ' — это обёртка сама по себе: она принимает любой элемент управления потомком, так что можно поставить два инпута в одну строку или использовать элемент, которого в этой библиотеке нет, с тем же оформлением подписи и ошибки.',
      ),
      p(
        'Одна подпись не может называть два элемента, поэтому здесь каждому инпуту нужно собственное доступное имя. Этим и заняты ',
        code('aria-label'),
        ': видимая подпись называет пару, а каждый инпут говорит, какой он край.',
      ),
      demo(`field({ label: 'Диапазон дат', help: 'Обе границы включаются.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'С' }),
    input({ type: 'date', name: 'to', 'aria-label': 'По' }),
  ),
)`, { align: 'stretch' }),

      h2('Пропсы'),
      h3('textField и textareaField'),
      propsTable([
        ['label', 'Child', '', 'Подпись поля. Из неё же выводится id элемента, когда нет name.'],
        ['name', 'string', '', 'Имя поля формы; из него выводится id.'],
        ['help', 'Child', '', 'Подсказка под элементом, связанная через aria-describedby.'],
        ['error', 'Child | false', '', 'Сообщение об ошибке. Заодно выставляет aria-invalid на элементе.'],
        ['required', 'boolean', 'false', 'Помечает подпись и сам элемент.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Высота элемента и размер текста.'],
        ['type', 'string', "'text'", 'Любой тип input. Только для textField.'],
        ['startAdornment', 'Child', '', 'Префикс, приклеенный к элементу. Только для textField.'],
        ['endAdornment', 'Child', '', 'Суффикс, приклеенный к элементу. Только для textField.'],
        ['value', 'string | number', '', 'Начальное значение.'],
        ['fieldClass', 'string', '', 'Класс для обёртки, а не для самого элемента.'],
      ]),
      p(
        'Идентификаторы выводятся из ',
        code('name'),
        ' — или из ',
        code('label'),
        ', когда name нет, — а не из счётчика, поэтому одна и та же страница на каждой сборке даёт одинаковый HTML. Передайте ',
        code('id'),
        ', чтобы задать свой.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'Текст подписи.'],
        ['help', 'Child', '', 'Подсказка под элементом.'],
        ['error', 'Child | false', '', 'Сообщение об ошибке; заодно добавляет обёртке состояние «недействительно».'],
        ['required', 'boolean', 'false', 'Добавляет к подписи пометку обязательности.'],
        ['for', 'string', '', 'Id элемента, который подписывается.'],
      ]),
    ],
  })
