import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Onay kutusu',
    description:
      'Onay kutusu ve etiketi tek bir denetim olarak — değiştirilmiş değil, CSS ile biçimlendirilmiş gerçek bir girdi.',
    activeHref: '/tr/ui/checkbox',
    children: [
      p(
        code('checkbox()'),
        ', gerçek bir ',
        code('<input type="checkbox">'),
        ' ile gördüğünüz kutuyu saran bir ',
        code('<label>'),
        ' işler. Girdi görsel olarak gizlidir ama yerindedir, bu yüzden odaklanabilir, gönderilir ve bütün etiket bir vuruş hedefidir — işaret, hiçbir betik karışmadan girdinin kendi ',
        code(':checked'),
        ' durumundan çizilir.',
      ),

      h2('Temel onay kutusu'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Güncellemeleri e-postayla gönder', name: 'updates' }),
  checkbox({ label: 'İşaretli', name: 'checked', checked: true }),
)`),

      h2('Renkler'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Devre dışı'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Kullanılamaz', disabled: true }),
  checkbox({ label: 'Açık ve kilitli', checked: true, disabled: true }),
)`),

      h2('Uzun etiketler'),
      p(
        'Kutu, kendini bir paragrafa göre ortalamak yerine ilk satırla hizalı kalır.',
      ),
      demo(`checkbox({
  label: 'Her derlemeden sonra bir Lighthouse denetimi çalıştır ve bir puan eşiğinin altına düştüğünde derlemeyi düşür.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Gruplar'),
      p(
        code('choiceGroup()'),
        ' veriden bir onay kutusu kümesi kurar, ortak bir başlık ve adla. Birkaçını işaretlemek için ',
        code('value'),
        ' olarak bir dizi geçirin.',
      ),
      demo(`choiceGroup({
  legend: 'Üret',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Pagefind dizini' },
  ],
  help: 'Her biri derlemenin sonunda dist/ içine yazılır.',
})`, { align: 'stretch' }),

      h2('Bir sırada'),
      demo(`choiceGroup({
  legend: 'Kategoriler',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('Bir alanla'),
      p(
        'Tek bir onay kutusunun üstünde ayrıca bir etikete nadiren ihtiyacı olur. Bir grubun olduğunda ',
        code('field()'),
        ' ona bir metin alanıyla aynı etiket, yardım ve hata davranışını verir.',
      ),
      demo(`field({ label: 'Koşullar', error: 'Devam etmek için koşulları kabul etmeniz gerekir.' },
  checkbox({ label: 'Koşulları kabul ediyorum', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['label', 'Child', '', 'Kutunun yanındaki metin. Çıplak bir denetim için atlayın.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'İşaretliyken renk.'],
        ['checked', 'boolean', 'false', 'İşaretli başlayıp başlamayacağı.'],
        ['name', 'string', '', 'Form alanı adı.'],
        ['value', 'string | number', '', 'İşaretliyken gönderilen değer.'],
        ['disabled', 'boolean', 'false', 'Girdiyi devre dışı bırakır ve etiketi soluklaştırır.'],
      ]),
      p(
        'Geri kalan her şey etikete değil ',
        code('<input>'),
        ' öğesine iner — yani ',
        code('required'),
        ', ',
        code('onchange'),
        ' ve ',
        code('data-*'),
        ' beklediğiniz yere gider. Etiketin kendisini biçimlendirmek için ',
        code('class'),
        ' kullanın.',
      ),
      p(
        'Veriden kurulan bir küme için ',
        code('Seçenek grubu'),
        ' sayfasındaki ',
        code('choiceGroup()'),
        ' işlevine bakın — her iki durumda da aynı seçenekleri alır, ',
        code("type: 'checkbox'"),
        ' ile değiştirilir.',
      ),
    ],
  })
