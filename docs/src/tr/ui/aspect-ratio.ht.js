import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'En boy oranı',
    description:
      'Bir kutuyu sabit bir biçimde tutun, böylece içerik yüklendiğinde sayfadaki hiçbir şey oynamasın.',
    activeHref: '/tr/ui/aspect-ratio',
    children: [
      p(
        'Yükseklik, daha hiçbir şey yüklenmeden genişlikten bilinir; bu yüzden geç gelen bir görsel ya da gömülü içerik sayfanın gerisini aşağı itmez. Çocuk kutuyu doldurur ve mektup kutusu yapılmak yerine kırpılır.',
      ),

      h2('Temel en-boy oranı'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Sık kullanılan oranlar'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Gömülü içerikler'),
      p(
        'Bu bileşenin var olma nedeni: bir ',
        code('<iframe>'),
        ' öğesinin kendine ait bir boyutu yoktur, bu yüzden bir oran olmadan çöker ya da elle yazılmış bir yükseklik ister.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">buraya bir &lt;iframe&gt; gelirdi</div>',
)`, { align: 'stretch' }),

      h2('Bir kartın içinde'),
      p(
        code('cardMedia()'),
        ' bunu bir kartın üstü için zaten yapar. Kutu başka bir yerdeyse ',
        code('aspectRatio()'),
        ' işlevine uzanın.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — yerleşik')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — başka her yerde'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Kırpma'),
      p(
        'Çocuk, doldurmak üzere gerilir ve ',
        code('object-fit: cover'),
        ' ile kırpılır. Kırpılmaması gereken bir şey için — bir logo, bir şema — bu sayfadaki her tanıtımın yaptığı gibi çocuğa ',
        code('object-fit: contain'),
        ' verin.',
      ),

      h2('Proplar'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'Herhangi bir CSS aspect-ratio değeri.'],
        ['as', 'string', "'div'", 'İşlenecek öğe.'],
      ]),
    ],
  })
