import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Скелетон',
    description:
      'Заглушка в форме содержимого, которое ещё не приехало.',
    activeHref: '/ru/ui/skeleton',
    children: [
      p(
        'Скелетон стоит вместо содержимого, пока оно грузится. На статическом сайте такое встречается реже, чем в приложении, — HTML уже на месте, — но именно им обычно и стоит быть ',
        code('fallback'),
        '-у острова, и именно это показывает область, отрисовываемая на клиенте, пока не пришли её данные.',
      ),
      p(
        'Скелетоны декоративны: у каждого есть ',
        code('aria-hidden'),
        ', чтобы скринридеру не зачитывали список пустых коробок.',
      ),

      h2('Формы'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Текст'),
      p(
        code('lines'),
        ' рисует объём целого абзаца, с короткой последней строкой, чтобы это читалось как текст, а не как блок.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('В форме настоящего'),
      p(
        'Скелетон убедительнее всего, когда повторяет ту раскладку, которую замещает: та же карточка, те же строки, те же размеры.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardBody(
      stack({ gap: 'md' },
        stack({ direction: 'row', gap: 'sm', align: 'center' },
          skeleton({ variant: 'circle', width: '2.5rem', height: '2.5rem' }),
          stack({ gap: 'xs', style: 'flex: 1' },
            skeleton({ variant: 'text', width: '60%' }),
            skeleton({ variant: 'text', width: '40%' }),
          ),
        ),
        skeleton({ lines: 3 }),
      ),
    ),
  ),
  card(
    cardBody(
      stack({ direction: 'row', gap: 'sm', align: 'center' },
        avatar({ name: 'Ada Lovelace' }),
        stack({ gap: 'none' },
          text({ variant: 'small' }, 'Ada Lovelace'),
          text({ variant: 'caption', tone: 'muted' }, 'Отправила 3 коммита'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Как запасной вариант острова'),
      p(
        'Серверный остров отгружает свой запасной вариант прямо в статическом HTML, а в момент запроса подменяет его отрендеренным фрагментом. Скелетон той же формы, что и фрагмент, не даёт странице прыгнуть, когда тот приедет.',
      ),
      demo(`card(
  cardHeader({ title: 'Комментарии' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Движение'),
      p(
        'Мерцание останавливается для тех, кто попросил систему уменьшить движение: это решается в таблице стилей, и никакого пропа задавать не нужно.',
      ),

      h2('Пропсы'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'Форма заглушки.'],
        ['width', 'string', '', 'Любая CSS-ширина.'],
        ['height', 'string', '', 'Любая CSS-высота.'],
        ['lines', 'number', '', 'Нарисовать столько строк текста, последнюю — короткой.'],
      ]),
    ],
  })
