import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Metin alanı',
    description:
      'Tek ve çok satırlı metin girdileri; etiket, yardım metni, hata iletisi ve kimlikler sizin için birbirine bağlanmış.',
    activeHref: '/tr/ui/text-field',
    children: [
      p(
        'Burada iki katman var. ',
        code('input()'),
        ' ve ',
        code('textarea()'),
        ' çıplak denetimlerdir; ',
        code('textField()'),
        ' ve ',
        code('textareaField()'),
        ' bunlardan birini bir etiket, yardım metni ve hata iletisiyle sarar ve onları ',
        code('for'),
        ' ile ',
        code('aria-describedby'),
        ' aracılığıyla bağlar. Yerleşimi kendiniz kurmuyorsanız ikincisine uzanın.',
      ),

      h2('Temel metin alanı'),
      demo(`textField({ label: 'Ad', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Yardım metni'),
      p(
        'Yardım metni ',
        code('aria-describedby'),
        ' ile bağlanır, böylece bir ekran okuyucu onu alanın ardındaki başıboş metin olarak değil, alanın bir parçası olarak okur.',
      ),
      demo(`textField({
  label: 'E-posta',
  name: 'email',
  type: 'email',
  help: 'Yalnızca derleme hatalarını göndermek için kullanıyoruz.',
})`, { align: 'stretch' }),

      h2('Zorunlu ve hata'),
      p(
        'Bir ',
        code('error'),
        ' alanı geçersiz işaretler, kenarlığı renklendirir, ',
        code('aria-invalid'),
        ' ayarlar ve ',
        code('aria-describedby'),
        ' değerini iletiye yöneltir — tek prop, dördü birden.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Proje', name: 'project', required: true, value: '' }),
  textField({
    label: 'Site',
    name: 'site',
    error: 'Bu bir URL değil.',
    value: 'sitelo nokta dev',
  }),
)`, { align: 'stretch' }),

      h2('Boyutlar'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Küçük', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Orta', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Büyük', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Süslemeler'),
      p(
        'Birimler ve bir değerin sabit parçaları için denetimin kendisine iliştirilmiş bir önek ya da sonek.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Site', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Derleme zaman aşımı', name: 'timeout', endAdornment: 'saniye', value: '30' }),
)`, { align: 'stretch' }),

      h2('Devre dışı ve salt okunur'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Devre dışı', name: 'disabled', value: 'Düzenlenemez', disabled: true }),
  textField({ label: 'Salt okunur', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Çok satırlı'),
      p(
        code('textareaField()'),
        ' bir ',
        code('<textarea>'),
        ' çevresindeki aynı alandır. Değeri bir öznitelik değil öğe içeriğidir; bunu bileşen sizin için halleder.',
      ),
      demo(`textareaField({
  label: 'Açıklama',
  name: 'description',
  rows: 4,
  help: 'Arama sonuçlarında ve sosyal kartlarda gösterilir.',
  value: 'Vite ile çalışan, yapılandırma gerektirmeyen statik site üretimi.',
})`, { align: 'stretch' }),

      h2('Bir formda'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Ad', name: 'contact-name', required: true }),
      textField({ label: 'E-posta', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'İleti', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Vazgeç'),
    button({ type: 'submit' }, 'Gönder'),
  ),
)`, { align: 'stretch' }),

      h2('Kendiniz kurmak'),
      p(
        code('field()'),
        ' tek başına sarmalayıcıdır — çocuk olarak her tür denetimi alır, böylece bir satıra iki girdi ya da bu kitaplıkta bulunmayan bir denetimi aynı etiket ve hata davranışının altına koyabilirsiniz.',
      ),
      p(
        'Tek bir etiket iki denetimi adlandıramaz, bu yüzden burada her girdinin kendi erişilebilir adına ihtiyacı vardır. ',
        code('aria-label'),
        ' değerlerinin yaptığı budur: görünür etiket çifti adlandırır, her girdi ise hangi uç olduğunu söyler.',
      ),
      demo(`field({ label: 'Tarih aralığı', help: 'İki uç da dahildir.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'Başlangıç' }),
    input({ type: 'date', name: 'to', 'aria-label': 'Bitiş' }),
  ),
)`, { align: 'stretch' }),

      h2('Proplar'),
      h3('textField ve textareaField'),
      propsTable([
        ['label', 'Child', '', 'Alan etiketi. Ad yokken denetim kimliğini de türetir.'],
        ['name', 'string', '', 'Form alanı adı; kimlik ondan türetilir.'],
        ['help', 'Child', '', 'Denetimin altındaki ipucu, aria-describedby ile bağlanır.'],
        ['error', 'Child | false', '', 'Hata iletisi. Denetimde aria-invalid da ayarlar.'],
        ['required', 'boolean', 'false', 'Etiketi ve denetimi işaretler.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Denetim yüksekliği ve metin boyutu.'],
        ['type', 'string', "'text'", 'Herhangi bir girdi türü. Yalnızca textField.'],
        ['startAdornment', 'Child', '', 'Denetime iliştirilmiş önek. Yalnızca textField.'],
        ['endAdornment', 'Child', '', 'Denetime iliştirilmiş sonek. Yalnızca textField.'],
        ['value', 'string | number', '', 'Başlangıç değeri.'],
        ['fieldClass', 'string', '', 'Denetim yerine sarmalayıcı için sınıf.'],
      ]),
      p(
        'Kimlikler bir sayaçtan değil ',
        code('name'),
        ' değerinden — ya da ad yokken ',
        code('label'),
        ' değerinden — türetilir, böylece aynı sayfa her derlemede aynı HTML’i işler. Geçersiz kılmak için ',
        code('id'),
        ' geçirin.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'Etiket metni.'],
        ['help', 'Child', '', 'Denetimin altındaki ipucu.'],
        ['error', 'Child | false', '', 'Hata iletisi; sarmalayıcıya geçersiz durumunu da ekler.'],
        ['required', 'boolean', 'false', 'Etikete zorunlu işaretini ekler.'],
        ['for', 'string', '', 'Etiketlenen denetimin kimliği.'],
      ]),
    ],
  })
