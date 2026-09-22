import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'İstatistik',
    description:
      'Bakmaya değer bir sayı; ne anlama geldiği ve hangi yöne gittiğiyle.',
    activeHref: '/tr/ui/stat',
    children: [
      p(
        'İstatistik bir etiket, bir değer ve isteğe bağlı olarak bir değişimdir. ',
        code('statGroup()'),
        ' birkaçını, aralarında ayırıcılarla tek bir yüzeyde birleştirir.',
      ),

      h2('Temel istatistik'),
      demo(`statGroup(
  stat({ label: 'Sayfalar', value: '204' }),
  stat({ label: 'Derleme süresi', value: '1,1 sn' }),
  stat({ label: 'İstemci JS', value: '3,3 kB' }),
)`, { align: 'stretch' }),

      h2('Bir değişimle'),
      p(
        'Değişim rengini ',
        code('color'),
        ' propundan alır — doğru yöne giden bir sayı için yeşil, gitmeyen için kırmızı. Yalnızca renge güvenmeyin: işareti ya da sözcüğü koruyun.',
      ),
      demo(`statGroup(
  stat({ label: 'Sayfalar', value: '204', change: 'bu hafta +8', color: 'success' }),
  stat({ label: 'Derleme süresi', value: '1,1 sn', change: '−0,3 sn', color: 'success' }),
  stat({ label: 'Paket', value: '9,9 kB', change: '+1,2 kB', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Simgelerle'),
      demo(`statGroup(
  stat({
    label: 'Dağıtımlar',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: 'Katkıcılar',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('Yardım metni'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'erişilebilirlik',
    color: 'success',
    help: 'CI’da her İngilizce sayfada ölçülür.',
  }),
  stat({
    label: 'Pagefind dizini',
    value: '204',
    help: 'Her derlemenin sonunda yeniden kurulur.',
  }),
)`, { align: 'stretch' }),

      h2('Tek başına'),
      p('Tek bir istatistiğin gruba ihtiyacı yoktur — yalnızca kendine ait bir yüzeyi olmaz.'),
      demo(`card(
  cardBody(stat({ label: 'Toplam sayfa', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Sabit sütunlar'),
      p(
        'İstatistikler varsayılan olarak kendiliğinden sığar. Sayıların tek satırda kalması gerektiğinde ',
        code('columns'),
        ' sayıyı sabitler.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'Geçen', value: '215', color: 'success' }),
  stat({ label: 'Başarısız', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('Veriden'),
      demo(`return (() => {
  const report = [
    { label: 'Sayfalar', value: 204 },
    { label: 'Varlıklar', value: 208 },
    { label: 'Toplam', value: '9,7 MB' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['label', 'Child', '', 'Sayının neyi saydığı.'],
        ['value', 'Child', '', 'Tablo rakamlarıyla dizilmiş sayının kendisi.'],
        ['change', 'Child', '', 'color ile renklenen bir fark.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Değişimi ve simgeyi renklendirir.'],
        ['icon', 'Child', '', 'Etiketin üstündeki süs glifi.'],
        ['help', 'Child', '', 'Geri kalan her şeyin altındaki daha sessiz satır.'],
      ]),
      p(code('statGroup()'), ' şunu alır: ', code('columns'), ' — herhangi bir ', code('grid-template-columns'), ' değeri.'),
    ],
  })
