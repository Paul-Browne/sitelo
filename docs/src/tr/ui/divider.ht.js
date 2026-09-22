import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Ayırıcı',
    description:
      'Bölümler arasında bir çizgi, ortasında etiketli ya da etiketsiz.',
    activeHref: '/tr/ui/divider',
    children: [
      p(
        'Ayırıcı, içerik gruplarını ayırır. Bir ',
        code('<hr>'),
        ' yerine ',
        code('role="separator"'),
        ' taşıyan bir öğe işler, çünkü içine bir etiket girer ve ',
        code('<hr>'),
        ' çocuk almaz.',
      ),

      h2('Temel ayırıcı'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Yukarıdaki her şey.'),
  divider(),
  text({ tone: 'muted' }, 'Aşağıdaki her şey.'),
)`, { align: 'stretch' }),

      h2('Etiketle'),
      p('Çocuklar, çizginin ortasında yer alan bir etiket olur.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'GitHub ile devam et'),
  divider('ya da'),
  button({ block: true }, 'E-posta ile devam et'),
)`, { align: 'stretch' }),

      h2('Boşluk'),
      p(
        code('spacing'),
        ' üstteki ve alttaki kenar boşluğunu, geri kalan her şeyin kullandığı aynı ölçekten ayarlar.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Sıkı'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'Varsayılan'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Ferah'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'Son'),
)`, { align: 'stretch' }),

      h2('Dikey'),
      p(
        'Dikey bir ayırıcı, ona yükseklik veren bir ebeveyn ister — öğeleri gerilen bir flex satırı, ki ',
        code('stack()'),
        ' varsayılan olarak bunu yapar.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4,1 kB'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 sayfa'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 ada'),
)`),

      h2('Proplar'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Çizginin hangi yöne gittiği.'],
        ['spacing', 'Space', "'md'", 'Çizginin iki yanındaki kenar boşluğu.'],
      ]),
    ],
  })
