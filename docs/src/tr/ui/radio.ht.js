import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Seçenek grubu',
    description:
      'Bir ad paylaşan gerçek radyo girdileriyle, birkaçından bir seçim — bir başlık ve bir grup rolüyle.',
    activeHref: '/tr/ui/radio',
    children: [
      p(
        'Radyolar, küçük ve görünür bir kümeden tam olarak bir seçeneği seçmek içindir. ',
        code('radio()'),
        ' bir tane işler; ',
        code('choiceGroup()'),
        ' bütün kümeyi bir diziden kurar ve ona, onu bir girdi yığını değil bir grup yapan başlığı ve ',
        code('role="radiogroup"'),
        ' rolünü verir.',
      ),
      p(
        'Bir ',
        code('name'),
        ' paylaşırlar, bu yüzden birbirini dışlamayı ve aralarındaki ok tuşu gezinmesini tarayıcı halleder. Burada hiçbir şey betik yayımlamaz.',
      ),

      h2('Temel seçenek grubu'),
      demo(`choiceGroup({
  legend: 'Plan',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Ücretsiz' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Takım' },
  ],
})`, { align: 'stretch' }),

      h2('Bir sırada'),
      p(
        'Kısa etiketler tek satırda daha iyi okunur. Uzun olanlar yığılı kalmalıdır, ki varsayılan da budur.',
      ),
      demo(`choiceGroup({
  legend: 'Cihaz biçimi',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('Düz dizeler'),
      p(
        'Değer ile etiket aynı olduğunda dize geçirin.',
      ),
      demo(`choiceGroup({
  legend: 'Günlük düzeyi',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Devre dışı seçenekler'),
      demo(`choiceGroup({
  legend: 'İşleyici',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Statik' },
    { value: 'islands', label: 'Sunucu adaları' },
    { value: 'ssr', label: 'Tam SSR', disabled: true },
  ],
  help: 'Tam SSR bir Node sunucusu ister, bu projede öyle bir şey yok.',
})`, { align: 'stretch' }),

      h2('Teker teker'),
      p(
        'Seçenekler bir diziden gelecek kadar benzeşmiyorsa — örneğin her birinin kendi açıklaması varsa — doğrudan ',
        code('radio()'),
        ' kullanın.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'Her gönderimde', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'Yalnızca etiketli sürümlerde' }),
  radio({ name: 'deploy', value: 'manual', label: 'Elle' }),
)`, { align: 'stretch' }),

      h2('Renkler'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('Bir kartta'),
      demo(`card(
  cardHeader({ title: 'Derleme ayarları', subtitle: 'Bir sonraki dağıtımda uygulanır' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Temiz URL’ler',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'Açık' },
          { value: 'off', label: 'Kapalı' },
        ],
      }),
      choiceGroup({
        legend: 'Görseller',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Yeniden boyutlandır ve dönüştür' },
          { value: 'copy', label: 'Olduğu gibi kopyala' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Kaydet'),
  ),
)`, { align: 'stretch' }),

      h2('Proplar'),
      p(code('choiceGroup()'), ':'),
      propsTable([
        ['legend', 'Child', '', 'Bütün grup için etiket.'],
        ['name', 'string', '', 'Ortak form adı — radyoları birbirini dışlar kılan şey.'],
        ['options', 'Array', '[]', 'Dizeler ya da { value, label, disabled } nesneleri.'],
        ['value', 'string | number | Array', '', 'Hangi seçeneğin işaretli olduğu. Onay kutuları için bir dizi.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Hangi denetimin kurulacağı. Grup rolünü de seçer.'],
        ['direction', "'row' | 'column'", "'column'", 'Seçeneklerin nasıl dizildiği.'],
        ['help', 'Child', '', 'Grubun altındaki ipucu.'],
      ]),
      p(code('radio()'), ', ', code('checkbox()'), ' ile aynı propları alır: ', code('label'), ', ', code('color'), ', ', code('checked'), ', ', code('name'), ', ', code('value'), ' ve ', code('disabled'), '.'),
    ],
  })
