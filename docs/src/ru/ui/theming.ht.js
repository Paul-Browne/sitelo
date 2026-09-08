import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Темы',
    description:
      'Как затащить таблицу стилей на страницу и одним вызовом поменять любой цвет, скругление и шрифт.',
    activeHref: '/ru/ui/theming',
    extraHead: uiHead(),
    children: [
      p(
        'Все компоненты читают одни и те же кастомные свойства, поэтому тема — это просто набор переопределений на ',
        code(':root'),
        ': ни шага сборки, ни файла конфигурации, ни компонента, которому пришлось бы об этом сообщать.',
      ),

      h2('Подключить стили'),
      p(
        code('styles()'),
        ' возвращает элемент ',
        code('<style>'),
        ' со всей таблицей стилей, минифицированной, — около 7 кБ в gzip. Это вариант по умолчанию: он не может пропасть из ',
        code('dist/'),
        ' и не стоит лишнего запроса.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Мой сайт'),
  styles(),
)`, 'javascript'),
      p(
        'Если вам милее подключить её один раз ссылкой и дать браузеру кэшировать её между страницами, импортируйте CSS из собираемого входного файла — Vite его выдаст:',
      ),
      codeBlock('src/main.js', `import 'sitelo/ui/styles.css'`, 'javascript'),
      p(
        'Берите что-то одно, не оба сразу. ',
        code('stylesheet()'),
        ' возвращает сырой CSS строкой, чтобы вы сами куда-нибудь его записали.',
      ),

      h2('Переопределение токенов'),
      p(
        code('theme()'),
        ' записывает переопределения. Ключи — это имена токенов в camelCase, объекты палитр или буквальные кастомные свойства, а идёт всё это ',
        code('после'),
        ' ',
        code('styles()'),
        ', так что побеждает.',
      ),
      codeBlock('src/index.ht.js', `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', active: '#3f3fb0', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }),
)`, 'javascript'),
      h2('Темы с областью действия'),
      p(
        code('selector'),
        ' ограничивает переопределения поддеревом, а не всей страницей. Именно это и делают три панели ниже: одни и те же компоненты, три разные палитры, одна страница.',
      ),
      demo(`fragment(
  theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff', soft: '#e6e6fa', softFg: '#33338f', border: '#b9b9ee' } }, { selector: '.theme-indigo' }),
  theme({ primary: { base: '#b0357a', hover: '#962e68', fg: '#ffffff', soft: '#fbe4f0', softFg: '#7d1f53', border: '#f0a9ce' } }, { selector: '.theme-pink' }),
  theme({ radiusMd: '999px', radiusLg: '1.5rem' }, { selector: '.theme-round' }),
  grid({ min: '11rem' },
    div({ class: 'theme-indigo' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'индиго'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-pink' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'розовая'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-round' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'скруглённая'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Тёмная тема'),
      p(
        'Тёмная определяется сама по ',
        code('prefers-color-scheme'),
        '. Явный ',
        code('data-theme'),
        ' или ',
        code('data-su-theme'),
        ' со значением ',
        code('light'),
        ' или ',
        code('dark'),
        ' на любом предке это перебивает — именно так демо на этом сайте следуют за переключателем в верхней панели.',
      ),
      p(
        'Передайте ',
        code('dark'),
        ' для переопределений, которые должны действовать только там. Это разом закрывает и атрибут, и медиазапрос.',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('Что можно переопределить'),
      p(
        'Пять палитр по девять слотов, шкала интервалов, типографика, скругления, тени и цвета поверхностей. Каждое из этого — кастомное свойство: откройте таблицу стилей или инспектор браузера, и все они окажутся на ',
        code(':root'),
        '.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    ...['primary', 'neutral', 'success', 'warning', 'danger'].map((color) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: 3.5rem; height: 2rem; border-radius: 0.4rem; background: var(--su-' + color + ')' }),
        text({ variant: 'caption', tone: 'muted' }, color),
      ),
    ),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true, align: 'flex-end' },
    ...['xs', 'sm', 'md', 'lg', 'xl'].map((step) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: var(--su-space-' + step + '); height: 2rem; border-radius: 0.2rem; background: var(--su-neutral)' }),
        text({ variant: 'caption', tone: 'muted' }, step),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Именование'),
      p(
        'Ключ в camelCase превращается в свойство в kebab-case: ',
        code('radiusMd'),
        ' — это ',
        code('--su-radius-md'),
        ', а ',
        code('fontSans'),
        ' — ',
        code('--su-font-sans'),
        '. Вложенный объект разворачивается так же: ',
        code('{ primary: { softFg: … } }'),
        ' задаёт ',
        code('--su-primary-soft-fg'),
        '. А ключ, уже начинающийся с ',
        code('--'),
        ', берётся ровно так, как написан, — это запасной выход для всего, чего преобразование не покрывает.',
      ),
      p(
        'В палитре девять слотов: ',
        code('base'),
        ', ',
        code('hover'),
        ', ',
        code('active'),
        ', ',
        code('fg'),
        ', ',
        code('soft'),
        ', ',
        code('softHover'),
        ', ',
        code('softFg'),
        ', ',
        code('border'),
        ' и ',
        code('ring'),
        '. Задавайте только те, что меняете.',
      ),

      h2('Контраст'),
      p(
        'Поставляемые палитры проходят WCAG AA относительно поверхностей, на которых лежат, в обеих темах, и в репозитории есть тест, который валит сборку, если это перестанет быть правдой. На вашу собственную тему он не распространяется: сверьте свой ',
        code('fg'),
        ' со своим ',
        code('base'),
        ', прежде чем выкатывать её.',
      ),

      h2('Пропсы'),
      p(code('styles()'), ' и ', code('stylesheet()'), ':'),
      propsTable([
        ['minify', 'boolean', 'true', 'Убрать комментарии и пробелы.'],
        ['nonce', 'string', '', 'CSP-nonce для выдаваемого элемента style. Только у styles().'],
      ]),
      p(code('theme(tokens, options)'), ':'),
      propsTable([
        ['selector', 'string', "':root'", 'Ограничивает переопределения поддеревом.'],
        ['dark', 'object', '', 'Переопределения, действующие только в тёмной теме.'],
        ['nonce', 'string', '', 'CSP-nonce.'],
      ]),
    ],
  })
