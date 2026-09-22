import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'İskelet',
    description:
      'Henüz gelmemiş içeriğin biçiminde bir yer tutucu.',
    activeHref: '/tr/ui/skeleton',
    children: [
      p(
        'İskelet, içerik yüklenirken onun yerini tutar. Statik bir sitede bu, bir uygulamadakinden daha seyrek gerekir — HTML zaten oradadır — ama bir adanın ',
        code('fallback'),
        ' değerinin genellikle bu olması gerekir; istemcide işlenen bir bölgenin verisi gelmeden gösterdiği şey de budur.',
      ),
      p(
        'İskeletler süstür: her biri ',
        code('aria-hidden'),
        ' taşır, böylece bir ekran okuyucuya boş kutu listesi okunmaz.',
      ),

      h2('Biçimler'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Metin'),
      p(
        code('lines'),
        ' bir paragraf kadarını işler; son satır kısadır, böylece blok değil düzyazı gibi okunur.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('Gerçek şeyin biçiminde'),
      p(
        'Bir iskelet en çok, yerini aldığı yerleşime uyduğunda inandırıcıdır — aynı kart, aynı satırlar, aynı boyutlar.',
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
          text({ variant: 'caption', tone: 'muted' }, '3 işleme gönderdi'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Bir ada yedeği olarak'),
      p(
        'Sunucu adası, yedeğini statik HTML içinde yayımlar ve istek anında işlenen parçayı yerine koyar. Parçayla aynı biçimdeki bir iskelet, parça geldiğinde sayfanın zıplamasını önler.',
      ),
      demo(`card(
  cardHeader({ title: 'Yorumlar' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Hareket'),
      p(
        'Parıltı, sisteminden hareketi azaltmasını istemiş olan herkes için durur — bu, ayarlanacak bir prop olmadan stil sayfasında halledilir.',
      ),

      h2('Proplar'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'Yer tutucunun biçimi.'],
        ['width', 'string', '', 'Herhangi bir CSS genişliği.'],
        ['height', 'string', '', 'Herhangi bir CSS yüksekliği.'],
        ['lines', 'number', '', 'Bu kadar metin satırı işler, sonuncusu kısa.'],
      ]),
    ],
  })
