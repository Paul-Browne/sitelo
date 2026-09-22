import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Izgara',
    description:
      'Sığabildiği kadar sütun sığdıran duyarlı bir ızgara — kesme noktası yok, medya sorgusu yok.',
    activeHref: '/tr/ui/grid',
    children: [
      p(
        code('columns'),
        ' olmadan bir ızgara, alanın elverdiği ölçüde en az ',
        code('min'),
        ' genişliğinde olabildiğince çok raya kendiliğinden sığar ve her biri artanı eşit paylaşır. Bir kart listesinin istediği davranış budur ve kesme noktası gerektirmez: bu sayfayı yeniden boyutlandırın, aşağıdaki tanıtımlar kendiliğinden yeniden akar.',
      ),

      h2('Kendiliğinden sığdırma'),
      p('Varsayılan. Raylar en az 16rem genişliğindedir.'),
      demo(`grid(
  ...['Yönlendirme', 'Veri yükleme', 'Varlıklar', 'Görseller', 'Adalar', 'Arama'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Ray genişliği'),
      p(
        code('min'),
        ', ızgara daha az sütuna düşmeden önce bir rayın ne kadar darlaşabileceğini belirler. Küçük olması daha çok sütun demektir.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Sabit sayıda sütun'),
      p(
        'Sayı görünümle birlikte değişmemesi gerektiğinde bir sayı geçirin. Her ray eşit bir paydır.',
      ),
      demo(`grid({ columns: 3 },
  ...['Bir', 'İki', 'Üç'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Özel bir şablon'),
      p(
        'Bir dize doğrudan ',
        code('grid-template-columns'),
        ' olarak geçirilir; bir kenar çubuğu ile içerik bölünmesi ya da CSS ızgarasının ifade edebildiği başka her şey için.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Kenar çubuğu'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Satırın gerisini alan içerik.'))),
)`, { align: 'stretch' }),

      h2('Boşluk ve hizalama'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Kısa'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'İçinde iki satır metin olan daha uzun bir kart; align değerinin daha kısa komşularına ne yaptığını göstermek için.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Kısa'))),
)`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['columns', 'number | string', '', 'Sabit bir ray sayısı ya da ham bir grid-template-columns değeri. Kendiliğinden sığdırma için atlayın.'],
        ['min', 'string', "'16rem'", 'Kendiliğinden sığdırırken en küçük ray genişliği.'],
        ['gap', 'Space', "'md'", 'Raylar ve satırlar arasındaki boşluk.'],
        ['align', 'string', "'stretch'", 'Herhangi bir align-items değeri.'],
        ['as', 'string', "'div'", 'İşlenecek öğe.'],
      ]),
      p(
        'Bir ray, ',
        code('min'),
        ' değeri kullanılabilir alandan büyük olsa bile hiçbir zaman ızgaranın kendisinden geniş olmaz — bu yüzden 16rem’lik bir alt sınır, 320 piksellik bir telefonda yatay kaydırma çubuğuna yol açmaz.',
      ),
    ],
  })
