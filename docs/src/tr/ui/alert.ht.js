import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Uyarı',
    description:
      'Bir şeyin durumu hakkında bir ileti; simgesi ve duyuru rolü rengi izler.',
    activeHref: '/tr/ui/alert',
    children: [
      p(
        'Bir uyarı, okura sayfa ya da yaptığı bir işlem hakkında bir şey söyler. Renk, simgeyi ve ARIA rolünü birlikte seçer: ',
        code('danger'),
        ' ve ',
        code('warning'),
        ' kendilerini ',
        code('role="alert"'),
        ' olarak duyurur, daha sessiz olan her şey kibar bir ',
        code('role="status"'),
        ' olur.',
      ),

      h2('Renkler'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'Dikkat' }, 'sitelo’nun yeni bir sürümü var.'),
  alert({ color: 'success', title: 'Dağıtıldı' }, '1,7 saniyede 169 sayfa yayımlandı.'),
  alert({ color: 'warning', title: 'Yavaş sayfa' }, 'Bir sayfanın işlenmesi 500 ms’den uzun sürdü.'),
  alert({ color: 'danger', title: 'Derleme başarısız' }, 'İki iç bağlantı var olmayan sayfaları gösteriyor.'),
  alert({ color: 'neutral', title: 'Not' }, 'Bu projede adalar kapalı.'),
)`, { align: 'stretch' }),

      h2('Başlıksız'),
      p('Tek satırlık bir uyarının cümlenin üstünde bir başlığa ihtiyacı yoktur.'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Kaydedildi.'),
  alert({ color: 'danger' }, 'Bu e-posta adresi zaten kullanımda.'),
)`, { align: 'stretch' }),

      h2('Türevler'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'Varsayılan — renkli bir yüzey.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Saydam, renkli bir kenarlıkla.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'Kaçırılmaması gereken bir şey için paletin tam rengi.'),
)`, { align: 'stretch' }),

      h2('Simgeler'),
      p(
        'Her rengin varsayılan bir simgesi vardır. Kendi biçimlendirmenizi ',
        code('icon'),
        ' olarak geçirin ya da hiç olmaması için ',
        code('icon: false'),
        ' kullanın.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'Simgesiz' }, 'Yalnızca metin.'),
  alert({
    color: 'primary',
    title: 'Özel bir simge',
    icon: icon('star'),
  }, 'Her SVG çalışır — simgeler bir bağımlılık değil, biçimlendirmedir.'),
)`, { align: 'stretch' }),

      h2('Kapatılabilir'),
      p('Kapatma düğmesi kendi işleyicisini taşır:'),
      codeBlock(
        'İşlenen biçimlendirme',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'Yani aşağıdaki uyarı, bu sayfada hiçbir şey içe aktarılmadan gerçekten kapanır. O modül hiç gelmezse düğme işlenir ve bir şey yapmaz; bu yüzden bir uyarı, bir iletinin göründüğü tek yer olmamalıdır.',
      ),
      demo(`alert({ color: 'primary', title: 'Kapatılabilir', dismissible: true },
  '× işaretine tıklayın — işleyici ilk basışta kendini getirir.',
)`, { align: 'stretch' }),

      h2('Zengin içerik'),
      p('Uyarılar her tür çocuğu alır, bu yüzden içinde bir eylem ya da bir liste yaşayabilir.'),
      demo(`alert({ color: 'danger', title: 'Bağlantı denetimi başarısız' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'İki bağlantı üretilmemiş sayfaları gösteriyor:'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: '/docs sayfasından bağlandı' }),
      listItem({ title: '/blog/draft', description: '/blog sayfasından bağlandı' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Ayrıntıları göster'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Yok say'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Paleti, varsayılan simgeyi ve ARIA rolünü seçer.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Uyarının taşıdığı ağırlık.'],
        ['title', 'Child', '', 'Kalın ilk satır.'],
        ['icon', 'Child | false', '', 'Özel simge biçimlendirmesi ya da hiç olmaması için false.'],
        ['dismissible', 'boolean', 'false', 'Kendi işleyicisini içe aktaran bir kapatma düğmesi ekler.'],
        ['dismissLabel', 'string', "'Dismiss'", 'O düğmenin erişilebilir adı.'],
      ]),
    ],
  })
