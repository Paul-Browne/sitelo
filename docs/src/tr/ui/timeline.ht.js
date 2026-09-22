import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Zaman çizelgesi',
    description:
      'Bir çizgi boyunca sırayla girdiler — bir değişiklik günlüğü, bir sürüm geçmişi, bir hakkında sayfası.',
    activeHref: '/tr/ui/timeline',
    children: [
      p(
        'Zaman çizelgesi, yanında bir çizgi bulunan sıralı bir listedir. Onu ',
        code('items'),
        ' propundan ya da girdiler bir diziden gelecek kadar benzeşmiyorsa ',
        code('timelineItem()'),
        ' çocuklarından kurun.',
      ),

      h2('Temel zaman çizelgesi'),
      demo(`timeline({
  items: [
    { time: 'Mart 2026', title: 'Bileşen kitaplığı', description: 'sitelo-ui doksan bileşenle geliyor.' },
    { time: 'Ocak 2026', title: 'Sunucu adaları', description: 'Bölgeleri istek anında işlenen statik sayfalar.' },
    { time: 'Ekim 2025', title: 'İlk sürüm', description: 'Dosya tabanlı yönlendirme ve bir derleme komutu.' },
  ],
})`, { align: 'stretch' }),

      h2('Renkli işaretler'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Dağıtım başarılı', description: '204 sayfa yayımlandı.', color: 'success' },
    { time: '12:03', title: 'Lighthouse geçti', description: 'Bütün eşikler karşılandı.', color: 'success' },
    { time: '12:01', title: 'Bağlantı denetimi uyardı', description: 'Bir dış bağlantı zaman aşımına uğradı.', color: 'warning' },
    { time: '12:00', title: 'Derleme başladı', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('Simgelerle'),
      demo(`timeline(
  timelineItem({
    time: 'Az önce',
    title: 'Yayımlandı',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: '2 dakika önce',
    title: 'Derleniyor',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Zengin girdiler'),
      p('Bir öğenin çocukları, açıklamasının altına gider.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Sayfa bölümleri', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Bakım', description: 'Bağımlılık yükseltmeleri ve bir bağlantı denetleyicisi düzeltmesi.' }),
)`, { align: 'stretch' }),

      h2('Veriden'),
      p(
        'Statik bir sitedeki alışıldık biçim: ',
        code('data()'),
        ' tarafından yüklenen bir değişiklik günlüğü dosyası, doğrudan öğelere eşlenmiş.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Sayfa bölümleri' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Bakım' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Sunucu adaları' },
  ]

  return timeline({
    items: releases.map((release) => ({
      time: release.date,
      title: 'v' + release.version,
      description: release.summary,
      color: 'primary',
    })),
  })
})()`, { align: 'stretch' }),

      h2('Zaman çizelgesi mi, adımlar mı?'),
      p(
        'Zaman çizelgesi, en yeniden ya da en eskiden başlayarak ne olduğunu kaydeder ve geçerli bir konumu yoktur. ',
        code('steps()'),
        ' ise biri sürmekte, gerisi önünde ya da arkasında olan bir akıştaki ilerlemeyi gösterir.',
      ),

      h2('Proplar'),
      p(code('timeline()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Aşağıdaki timelineItem proplarını taşıyan nesneler.'],
      ]),
      p(code('timelineItem()'), ':'),
      propsTable([
        ['time', 'Child', '', 'Ne zaman olduğu — bir tarih, bir sürüm, bir saat.'],
        ['title', 'Child', '', 'Ne olduğu.'],
        ['description', 'Child', '', 'Altındaki ayrıntı.'],
        ['icon', 'Child', '', 'İşaretin içindeki biçimlendirme.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'İşaret rengi.'],
      ]),
      p('Bir öğenin çocukları, açıklamasının altında işlenir.'),
    ],
  })
