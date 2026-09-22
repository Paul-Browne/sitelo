import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Açılır liste',
    description:
      'Diğer girdilerle uyumlu biçimlendirilmiş, seçenekleri veriden kurulan yerli bir select.',
    activeHref: '/tr/ui/select',
    children: [
      p(
        'Bu, tarayıcının kendi açılır listesini kullanan gerçek bir ',
        code('<select>'),
        ' öğesidir — yani JavaScript olmadan çalışır, telefonda doğru açılır ve bu kitaplıktan hiçbir şey olmadan klavyeyle gezilebilir.',
      ),
      p(
        code('select()'),
        ' çıplak denetimdir; ',
        code('selectField()'),
        ' onu tıpkı ',
        code('textField()'),
        ' gibi bir etiket, yardım metni ve hata iletisiyle sarar.',
      ),

      h2('Temel açılır liste'),
      p(
        'Seçenekler düz dize olabilir; bu durumda değer ile etiket aynıdır.',
      ),
      demo(`selectField({
  label: 'Tema',
  name: 'theme',
  options: ['Açık', 'Koyu', 'Sistem'],
})`, { align: 'stretch' }),

      h2('Değerler ve etiketler'),
      p(
        'Gönderilen değer, kişinin okuduğu metinden farklı olduğunda nesne geçirin. ',
        code('value'),
        ' seçili seçeneği işaretler.',
      ),
      demo(`selectField({
  label: 'Çıktı',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — varsayılan' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Yer tutucu'),
      p(
        'Yer tutucu, devre dışı bir ilk seçenek olarak işlenir ve ',
        code('value'),
        ' yokken seçili olur — böylece alan, geçerli bir seçim olmadan boş başlar.',
      ),
      demo(`selectField({
  label: 'Dağıtım hedefi',
  name: 'target',
  placeholder: 'Bir sunucu seçin…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Gruplar'),
      p(
        'Kendi ',
        code('options'),
        ' dizisi olan bir girdi bir ',
        code('<optgroup>'),
        ' olur.',
      ),
      demo(`selectField({
  label: 'Sayfa uzantısı',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Boyutlar'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Küçük', name: 'sm', size: 'sm', options: ['Bir', 'İki'] }),
  selectField({ label: 'Orta', name: 'md', size: 'md', options: ['Bir', 'İki'] }),
  selectField({ label: 'Büyük', name: 'lg', size: 'lg', options: ['Bir', 'İki'] }),
)`, { align: 'stretch' }),

      h2('Yardım, hata ve devre dışı'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Yerel ayar',
    name: 'locale',
    options: ['en', 'es', 'fr'],
    help: 'html lang özniteliği için kullanılır.',
  }),
  selectField({
    label: 'Framework',
    name: 'framework',
    placeholder: 'Birini seçin…',
    options: ['sitelo'],
    error: 'Devam etmek için bir framework seçin.',
  }),
  selectField({
    label: 'Plan',
    name: 'plan',
    options: ['Ücretsiz'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('Veriden'),
      p(
        'Seçenekler yalnızca bir dizidir, bu yüzden genellikle sayfa için ',
        code('data()'),
        ' işlevinin zaten yüklediği şeyden gelirler.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Merhaba dünya' },
    { slug: 'static-first', title: 'Önce statik' },
    { slug: 'no-runtime', title: 'Çalışma zamanı yok' },
  ]

  return selectField({
    label: 'Öne çıkan yazı',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'Dizeler, { value, label, disabled } nesneleri ya da bir grup için { label, options }.'],
        ['value', 'string | number', '', 'Hangi seçeneğin seçili olduğu.'],
        ['placeholder', 'string', '', 'Devre dışı ilk seçenek, değer yokken seçili olur.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Denetim yüksekliği ve metin boyutu.'],
        ['name', 'string', '', 'Form alanı adı; kimlik ondan türetilir.'],
        ['invalid', 'boolean', 'false', 'aria-invalid ayarlar. selectField bunu sizin için error değerinden ayarlar.'],
        ['disabled', 'boolean', 'false', 'Denetimi devre dışı bırakır.'],
      ]),
      p(
        code('selectField()'),
        ' ek olarak ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ' ve ',
        code('fieldClass'),
        ' alır — bkz. ',
        code('textField()'),
        '. Çocuklar üretilen seçeneklerin ardına eklenir, böylece ihtiyaç duyduklarınızı elle yazabilirsiniz.',
      ),
    ],
  })
