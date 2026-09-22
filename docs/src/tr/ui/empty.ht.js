import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Boş durum',
    description:
      'Bir listenin, içinde hiçbir şey olmadan önce nasıl göründüğü.',
    activeHref: '/tr/ui/empty',
    children: [
      p(
        'Boş bir alan hata gibi okunur. Bir boş durum, hangi alanın boş olduğunu, neden boş olduğunu ve sırada ne yapılacağını söyler — ve en kolay unutulan durumdur, çünkü geliştirme sırasında hep veri vardır.',
      ),

      h2('Temel boş durum'),
      demo(`empty({
  title: 'Henüz yazı yok',
  description: 'src/posts içine bir Markdown dosyası ekleyin, burada görünsün.',
})`, { align: 'stretch' }),

      h2('Bir simgeyle'),
      p(
        'Simge süstür — ',
        code('aria-hidden'),
        ' ile işaretlenir, çünkü başlık neler olduğunu zaten söyler.',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: 'Burada bir şey yok',
  description: 'Bu klasörde hiç sayfa yok.',
})`, { align: 'stretch' }),

      h2('Bir eylemle'),
      p('Çocuklar eylem sırası olur.'),
      demo(`empty({
  icon: icon('search'),
  title: '“islands” için sonuç yok',
  description: 'Yazımı denetleyin ya da bunun yerine belgelere göz atın.',
},
  button({ href: '/docs' }, 'Belgelere göz at'),
  button({ variant: 'outline', color: 'neutral' }, 'Aramayı temizle'),
)`, { align: 'stretch' }),

      h2('Bir kartta'),
      demo(`card(
  cardHeader({ title: 'Dağıtımlar' }),
  cardBody(
    empty({
      title: 'Henüz dağıtım yok',
      description: 'main dalına gönderin, ilk derleme burada görünsün.',
    }, button({ size: 'sm' }, 'Bir depo bağla')),
  ),
)`, { align: 'stretch' }),

      h2('Bir tablonun yerine'),
      p(
        'Altında hiç satır olmayan bir başlık işlemek yerine tabloyu bir boş durumla değiştirin.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'Derleme geçmişi' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'İşleme' }], rows })
      : cardBody(empty({
          title: 'Kayıtlı derleme yok',
          description: 'Site en az bir kez dağıtıldığında çalıştırmalar burada görünür.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['icon', 'Child', '', 'Başlığın üstündeki süs simgesi; ekran okuyuculardan gizlenir.'],
        ['title', 'Child', '', 'Birkaç sözcükle neyin boş olduğu.'],
        ['description', 'Child', '', 'Neden boş olduğu ya da bu konuda ne yapılacağı.'],
      ]),
      p('Çocuklar, açıklamanın altında eylem sırası olarak işlenir.'),
    ],
  })
