import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Rozet',
    description:
      'Sardığı şeyin köşesine iliştirilmiş bir sayı ya da nokta.',
    activeHref: '/tr/ui/badge',
    children: [
      p(
        'Bir rozet bir şeyi sarar ve üst köşesine bir işaret iliştirir: bir gelen kutusu düğmesindeki okunmamış iletiler, bir avatardaki çevrimiçi noktası. İşaretlediği şeyi çocuk olarak alır.',
      ),

      h2('Temel rozet'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ content: 4 }, button({ variant: 'soft', color: 'neutral' }, 'Gelen kutusu')),
  badge({ content: 12 }, avatar({ name: 'Ada Lovelace' })),
)`),

      h2('Renkler'),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 3, color: 'primary' }, button({ variant: 'soft', color: 'neutral' }, 'Primary')),
  badge({ content: 3, color: 'neutral' }, button({ variant: 'soft', color: 'neutral' }, 'Neutral')),
  badge({ content: 3, color: 'success' }, button({ variant: 'soft', color: 'neutral' }, 'Success')),
  badge({ content: 3, color: 'warning' }, button({ variant: 'soft', color: 'neutral' }, 'Warning')),
  badge({ content: 3, color: 'danger' }, button({ variant: 'soft', color: 'neutral' }, 'Danger')),
)`),

      h2('Üst sınır'),
      p(
        code('max'),
        ' değerinin üstündeki bir sayı ',
        code('n+'),
        ' olarak işlenir, böylece bir rozet hiçbir zaman üzerinde durduğu şeyin dengesini bozacak kadar genişlemez.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center', wrap: true },
  badge({ content: 9 }, button({ variant: 'soft', color: 'neutral' }, 'Dokuz')),
  badge({ content: 250 }, button({ variant: 'soft', color: 'neutral' }, '99 ile sınırlı')),
  badge({ content: 250, max: 999 }, button({ variant: 'soft', color: 'neutral' }, 'max: 999')),
)`),

      h2('Nokta'),
      p(
        'Bir nokta, ne kadar olduğunu söylemeden “bir şey değişti” der. Ona bir ',
        code('label'),
        ' verin — çıplak bir nokta bir ekran okuyucu için hiçbir şey ifade etmez, bu yüzden etiketsizse erişilebilirlik ağacından tümüyle gizlenir.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', align: 'center' },
  badge({ dot: true, color: 'success', label: 'Çevrimiçi' }, avatar({ name: 'Ada Lovelace' })),
  badge({ dot: true, color: 'warning', label: 'İlgi gerekiyor' },
    iconButton({
      label: 'Ayarlar',
      variant: 'soft',
      color: 'neutral',
      icon: icon('settings'),
    }),
  ),
)`),

      h2('Sayıyı etiketlemek'),
      p(
        'Çıplak bir sayı bağlam dışında belirsizdir. ',
        code('label'),
        ' rozetin erişilebilir adı olur, böylece “4” yerine “4 okunmamış ileti” diye okunur.',
      ),
      demo(`badge({ content: 4, label: '4 okunmamış ileti' },
  button({ variant: 'soft', color: 'neutral' }, 'Gelen kutusu'),
)`),

      h2('Sayıyı değiştirmek'),
      p(
        'Bir sayı, sayfa açıkken değişmesi en olası sayıdır. ',
        code('setBadge()'),
        ' onu sunucunun yaptığı gibi ',
        code('max'),
        ' değerine sıkıştırır, duyurulan metni yanında tutar ve boşalan bir rozeti erişilebilirlik ağacından düşürür — bir rozet böyle kaybolur.',
      ),
      p('Duyurulan metin sitenin kendi metnidir, bu yüzden rozetin bir tanesi olduğunda onu geçirin:'),
      codeBlock('Herhangi bir yer', `button({ onclick: "import('/su/badge.js').then(m=>m.set('inbox',0))" }, 'Tümünü okundu işaretle')`, 'javascript'),
      p('Ya da zaten çalışan bir modülünüz varsa kendi modülünüzden:'),
      codeBlock('src/main.js', `import { setBadge } from 'sitelo/ui/client'

setBadge('inbox', 7, { label: '7 okunmamış ileti' })`, 'javascript'),

      h2('Proplar'),
      propsTable([
        ['content', 'string | number', '', 'Rozetin gösterdiği şey. dot ayarlıyken yok sayılır.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'danger'", 'Rozet rengi.'],
        ['dot', 'boolean', 'false', 'Bir değer yerine küçük bir nokta.'],
        ['max', 'number', '99', 'Bunun üstündeki sayılar n+ olarak işlenir.'],
        ['label', 'string', '', 'Rozetin kendisi için erişilebilir ad.'],
      ]),
    ],
  })
