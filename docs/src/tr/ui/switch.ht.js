import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Anahtar',
    description:
      'Hemen etkili olan bir ayar için açık/kapalı değiştirici — altında role="switch" taşıyan bir onay kutusu.',
    activeHref: '/tr/ui/switch',
    children: [
      p(
        'Anahtar, çevrilir çevrilmez uygulanan bir ayar içindir. Onay kutusu ise sonradan bir gönder düğmesiyle onayladığınız bir seçim içindir. Denetiminiz altında Kaydet bulunan bir formda duruyorsa o bir onay kutusudur.',
      ),
      p(
        'Bileşenin adı sıkıcı ama kaçınılmaz bir nedenle ',
        code('switch()'),
        ' değil ',
        code('toggle()'),
        ': ',
        code('switch'),
        ' ayrılmış bir sözcüktür, dolayısıyla bir içe aktarma bağı olamaz. Altında ',
        code('role="switch"'),
        ' taşıyan gerçek bir ',
        code('<input type="checkbox">'),
        ' vardır.',
      ),

      h2('Temel anahtar'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Herkese açık site', name: 'public' }),
  toggle({ label: 'Açık', name: 'on', checked: true }),
)`),

      h2('Renkler'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Devre dışı'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Kapalı ve kilitli', disabled: true }),
  toggle({ label: 'Açık ve kilitli', checked: true, disabled: true }),
)`),

      h2('Etiketsiz'),
      p(
        'Görünür etiketi olmayan bir anahtarın yine de erişilebilir bir ada ihtiyacı vardır. ',
        code('aria-label'),
        ' geçirin — girdiye düşer.',
      ),
      demo(`toggle({ 'aria-label': 'Pagefind aramasını aç', checked: true })`),

      h2('Bir ayarlar listesi'),
      p(
        'Alışıldık biçim: solda etiket, sağda anahtar, ayar başına bir satır.',
      ),
      demo(`return list(
  [
    ['Pagefind araması', 'Derlemenin sonunda her sayfayı dizinler.', true],
    ['Görsel optimizasyonu', 'Derleme sırasında görselleri yeniden boyutlandırır ve dönüştürür. sharp gerektirir.', true],
    ['Sunucu adaları', 'İşaretli bölgeleri istek anında işler.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['label', 'Child', '', 'Anahtarın yanındaki metin. Yoksa aria-label kullanın.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Açıkken pist rengi.'],
        ['checked', 'boolean', 'false', 'Açık başlayıp başlamayacağı.'],
        ['name', 'string', '', 'Form alanı adı.'],
        ['disabled', 'boolean', 'false', 'Girdiyi devre dışı bırakır ve satırı soluklaştırır.'],
      ]),
      p(
        'Geri kalan her şey ',
        code('<input>'),
        ' öğesine düşer; ',
        code('onchange'),
        ' ve ',
        code('aria-*'),
        ' oraya aittir.',
      ),
    ],
  })
