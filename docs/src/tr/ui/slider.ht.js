import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Kaydırıcı',
    description:
      'Diğer denetimlerle uyumlu biçimlendirilmiş yerli bir range girdisi.',
    activeHref: '/tr/ui/slider',
    children: [
      p(
        'Bu gerçek bir ',
        code('<input type="range">'),
        ' öğesidir — ok tuşları, Home ve End ile doğru duyuru hepsi tarayıcıdan gelir. Yalnızca pist ve tutamak biçimlendirilir.',
      ),

      h2('Temel kaydırıcı'),
      demo(`sliderField({ label: 'Kalite', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Aralık ve adım'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Ses', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Sütunlar', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Ölçek', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Değeri göstermek'),
      p(
        code('showValue'),
        ', pistin yanına sayfanın derlendiği değeri taşıyan bir ',
        code('<output>'),
        ' koyar ve girdi ilk sürüklemede kendi işleyicisini getirir, böylece sayı tutamağı izler. İçe aktarılacak bir şey yoktur: sessizce bayatlayan bir değer, hiç değer olmamasından kötü olurdu, bu yüzden bu size bırakılmamıştır.',
      ),
      demo(`sliderField({
  label: 'Görsel kalitesi',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Yüksek olması daha büyük ve derlemesi daha yavaştır.',
})`, { align: 'stretch' }),

      h2('Kendi kodunuzdan ayarlamak'),
      p(
        'Kaydırıcı bir form denetimidir, dolayısıyla sahibi okurdur — ama bir hazır ayar, bir sıfırlama düğmesi ya da ağdan gelen bir değer yine de onu hareket ettirebilmelidir. Ona bir ',
        code('id'),
        ' verin, ',
        code('setSlider'),
        ' bunu yapar ve ',
        code('<output>'),
        ' öğesini de yanında götürür.',
      ),
      codeBlock('src/main.js', `import { setSlider } from 'sitelo/ui/client'

setSlider('volume', 50)`, 'javascript'),
      p('Ya da modüle, bileşenlerin kendi modüllerine uzandığı biçimde uzanın ve paketi tümüyle atlayın:'),
      codeBlock('Herhangi bir yer', `button({ onclick: "import('/su/slider.js').then(m=>m.set('volume',50))" }, 'Yarım')`, 'javascript'),
      p(
        'Tarayıcı ',
        code('min'),
        ' ve ',
        code('max'),
        ' değerlerine sıkıştırır ve ',
        code('step'),
        ' değerine oturtur, bu yüzden geri gelen şey kaydırıcıya verilen değil indiği yerdir. ',
        code('input'),
        ' ve ',
        code('change'),
        ' ardından gelir, çünkü sürüklemeyi dinleyen bir önizlemenin, kendisinin yol açmadığı bir hareketi duymanın başka yolu yoktur. ',
        code('getSlider()'),
        ' değeri geri okur.',
      ),

      h2('Deneyin'),
      p('Bu sayfa çalışma zamanını yükler, bu yüzden aşağıdaki düğmeler kaydırıcıyı gerçekten hareket ettirir.'),
      demo(`stack({ gap: 'md' },
  slider({ id: 'demo-slider', value: 40, showValue: true, 'aria-label': 'Tanıtım' }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',0))" }, 'En az'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',50))" }, 'Yarım'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',100))" }, 'En çok'),
  ),
)`, { align: 'stretch' }),

      h2('Renkler'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Devre dışı'),
      demo(`sliderField({ label: 'Kilitli', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Etiketsiz'),
      p(
        'Çıplak bir ',
        code('slider()'),
        ' tek başına denetimdir — onu gösterecek görünür bir etiket yoksa ona bir ',
        code('aria-label'),
        ' verin.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Metin boyutu' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('Bir formda'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'En büyük görsel genişliği', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Kalite', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Kaydet'),
  ),
)`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['min', 'number | string', '0', 'Alt sınır.'],
        ['max', 'number | string', '100', 'Üst sınır.'],
        ['step', 'number | string', '', 'Artış. Tarayıcının varsayılanı olan 1 için atlayın.'],
        ['value', 'number | string', '', 'Başlangıç değeri.'],
        ['showValue', 'boolean', 'false', 'Derleme zamanı değerini taşıyan bir <output> ekler.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Tutamak rengi.'],
        ['name', 'string', '', 'Form alanı adı; kimlik ondan türetilir.'],
        ['disabled', 'boolean', 'false', 'Denetimi devre dışı bırakır.'],
      ]),
      p(
        code('sliderField()'),
        ' ek olarak ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ' ve ',
        code('required'),
        ' alır — bkz. ',
        code('textField()'),
        '.',
      ),
    ],
  })
