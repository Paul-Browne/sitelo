import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Kart',
    description:
      'Gruplanmış içerik için bir yüzey; başlığı, gövdesi, alt bilgisi ve ortamı birlikte durmayı bilir.',
    activeHref: '/tr/ui/card',
    children: [
      p(
        'Bir kart, ilgili içeriği kendi yüzeyinde gruplar. Parçalar — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — prop değil ayrı fonksiyonlardır, böylece yalnızca ihtiyaç duyduklarınızı kullanır ve tasarımın istediği sıraya koyarsınız.',
      ),

      h2('Temel kart'),
      demo(`card(
  cardHeader({ title: 'Dosya tabanlı yönlendirme', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'Klasörler yol olur. Köşeli parantezler parametre olur. Yapılandırılacak bir yönlendirici yoktur.')),
)`, { align: 'stretch' }),

      h2('Türevler'),
      p(
        'Varsayılan çerçevelidir. Yükseltilmiş, kenarlığı bir gölgeyle takas eder; düz ise ikisi yerine yüzeyi renklendirir.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('Alt bilgiyle'),
      p(
        code('divided'),
        ' alt bilginin üstüne ince çizgiyi ekler. Alt bilgi dibe itilir, bu yüzden bir sıradaki kartlar, üstlerindeki metin farklı uzunlukta olsa bile eylemlerini hizalar.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Temel site' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'En küçük proje, artı dağıtım yapılandırmaları.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Aç')),
  ),
  card(
    cardHeader({ title: 'Markdown blog' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Statik sayfalara işlenen bir .md dosyaları klasörü, bir RSS akışı ve hiç istemci JavaScript’i olmadan.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Aç')),
  ),
)`, { align: 'stretch' }),

      h2('Ortam'),
      p(
        code('cardMedia()'),
        ' kartın üstünü sabit bir en-boy oranında doldurur, böylece bir sıra kart, kaynak görseller ne ölçüde olursa olsun düzgün kalır.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'Varsayılan 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('Bütün bir kart bağlantı olarak'),
      p(
        'Karta bir ',
        code('href'),
        ' verin, bütün yüzey tek bir bağlantı olsun, yanında gelen üzerine gelme kalkışıyla birlikte. Bu biçimdeki bir kartın içine düğme ya da başka bağlantı koymayın — etkileşimli içerik bir bağlantının içine yuvalanamaz. Bunun yerine düz bir kartta alt bilgi düğmesi kullanın.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/docs/routing' },
    cardHeader({ title: 'Yönlendirme', subtitle: 'Rehberi okuyun' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Dinamik rotalar, hepsini yakalayanlar ve rota grupları.')),
  ),
  card({ href: '/docs/data' },
    cardHeader({ title: 'Veri yükleme', subtitle: 'Rehberi okuyun' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() derleme sırasında, getirme önbelleğiyle çalışır.')),
  ),
)`, { align: 'stretch' }),

      h2('Dolgu'),
      p(
        'Tek bir prop kartın her parçasının dolgusunu birden ayarlar.',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Serbest biçimli içerik'),
      p(
        'Parçalar bir kolaylıktır, zorunluluk değil — bir kart her tür çocuğu alır ve ',
        code('cardHeader()'),
        ' başlığın yanında, sağdaki bir avatar ya da menü düğmesi için kendi çocuklarını da kabul eder.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: '4 dakika önce dağıtıldı' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Derleme geçti'),
      chip({ color: 'neutral' }, '12 sayfa'),
      chip({ color: 'neutral' }, '4,1 kB'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Proplar'),
      p(code('card()'), ':'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'Yüzeyin sayfadan nasıl ayrıldığı.'],
        ['href', 'string', '', 'Bütün kartı bir bağlantı olarak işler.'],
        ['padding', 'Space', "'lg'", 'Kartın her parçasının kullandığı dolgu.'],
      ]),
      p('Parçalar:'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Başlık ve alt başlık, artı yanlarındaki her tür çocuk.'],
        ['cardTitle', 'as', "'h3'", 'Başlık elle kurulduğunda tek başına başlık.'],
        ['cardSubtitle', '', '', 'Bir başlığın altındaki soluk satır.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'Sabit en-boy oranında bir kapak görseli.'],
        ['cardBody', '', '', 'Ana içerik bölgesi.'],
        ['cardFooter', 'divided', 'false', 'Alttaki eylem sırası; divided üstüne ince çizgiyi ekler.'],
      ], { headers: ['Parça', 'Proplar', 'Varsayılan', 'Açıklama'] }),
    ],
  })
