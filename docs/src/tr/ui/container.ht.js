import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Kapsayıcı',
    description:
      'Ortalanmış, genişliği sınırlı bir sütun — çoğu sayfadaki en dıştaki sarmalayıcı.',
    activeHref: '/tr/ui/container',
    children: [
      p(
        'Bir kapsayıcı içeriğini ortalar, metin satırları okunaklı kalsın diye genişliği sınırlar ve bir telefon ekranının kenarına hiçbir şey değmesin diye bir kenar boşluğu bırakır. Genellikle ',
        code('body()'),
        ' içindeki ilk şeydir.',
      ),

      h2('Temel kapsayıcı'),
      demo(`container(
  text({ variant: 'lead' }, 'İçerideki her şey ortalanmış kalır ve boyut sınırında büyümeyi bırakır.'),
)`, { align: 'stretch' }),

      h2('Boyutlar'),
      p(
        'Tek bir okunaklı sütundan hiç sınır olmamasına kadar beş adım. ',
        code('sm'),
        ' yaklaşık 40rem’dir — kabaca düzyazının istediği genişlik.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (varsayılan)'),
  ),
)`, { align: 'stretch' }),

      h2('Özel bir genişlik'),
      p(
        code('width'),
        ' herhangi bir CSS uzunluğunu alır ve ',
        code('size'),
        ' değerini geçersiz kılar; ölçekte bulunmayan bir şeye ihtiyaç duyan tek bir sayfa için.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Kenar boşluğu'),
      p(
        'Kenar boşluğu, içerik ile görünüm kenarı arasında tutulan dolgudur. Bir boşluk belirteci, boşluk birimi sayısı ya da ham bir uzunluk alır.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'Bir tablette içeriği kenara kadar gitmemesi gereken bir sayfa için daha geniş bir kenar boşluğu.'),
)`, { align: 'stretch' }),

      h2('Başka bir öğe olarak'),
      p(
        code('as'),
        ' başka hiçbir şeyi değiştirmeden etiketi değiştirir — kapsayıcı aynı zamanda sayfanın ',
        code('<main>'),
        ' ya da bir ',
        code('<section>'),
        ' öğesiyken kullanışlıdır.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'Bir main öğesi'),
  text({ tone: 'muted' }, 'Aynı yerleşim, doğru yer imi.'),
)`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Hangi genişlik sınırının uygulanacağı.'],
        ['width', 'string', '', 'size değerini geçersiz kılan ham bir max-width.'],
        ['gutter', 'Space', "'md'", 'Görünüm kenarına karşı tutulan satır içi dolgu.'],
        ['as', 'string', "'div'", 'İşlenecek öğe, örneğin main ya da section.'],
      ]),
    ],
  })
