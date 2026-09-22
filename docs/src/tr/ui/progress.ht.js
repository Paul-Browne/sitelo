import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'İlerleme',
    description:
      'Sonu bilinen iş için bir çubuk, bilinmeyen iş için bir döndürücü.',
    activeHref: '/tr/ui/progress',
    children: [
      p(
        'Ne kadar kaldığını bildiğiniz her durumda belirli bir çubuk kullanın — okura bir şey söyleyen tek çubuk odur. ',
        code('value'),
        ' propunu atlayın, bunun yerine çubuk canlanır; bu “hâlâ çalışıyor” der, fazlasını değil.',
      ),

      h2('Belirli'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Belirsiz'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        code('label'),
        ' taşımayan bir çubuk ',
        code('aria-hidden'),
        ' ile işaretlenir — erişilebilir adı olmayan bir progressbar rolü bir ekran okuyucuya hiçbir şey söylemez, bu yüzden etiketsiz bir çubuk süs sayılır. Okurun izlemesi gereken her şeyi etiketleyin.',
      ),

      h2('Etiketler'),
      p(
        'Etiket neler olduğunu adlandırır; ',
        code('showValue'),
        ' sağa yüzdeyi ekler.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Sayfalar işleniyor', showValue: true }),
  progress({ value: 30, max: 60, label: 'Görseller optimize ediliyor', showValue: true }),
  progress({ label: 'Dağıtım bekleniyor' }),
)`, { align: 'stretch' }),

      h2('Renkler ve yükseklik'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Geçti', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Zayıfladı', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'Başarısız', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('100 dışında bir ölçek'),
      p(
        code('max'),
        ' önce bir yüzde hesaplamak yerine ham sayıları geçirmenizi sağlar — toplam sayfa içinden derlenen sayfalar.',
      ),
      demo(`progress({ value: 118, max: 169, label: '169 sayfadan 118’i', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Tarayıcıdan hareket ettirmek'),
      p(
        'Çubuk sunucuda işlenmiş HTML’dir: yüzde, dolgudaki bir özel özellik ve ',
        code('aria-valuenow'),
        ' içindeki bir sayıdır; sayfadaki hiçbir şey ikisini de kendiliğinden değiştirmez. Çubuğa bir ',
        code('id'),
        ' verin, ',
        code('setProgress'),
        ' ikisini birlikte hareket ettirsin — dolgu, duyurulan değer ve etiketin yanındaki yüzde.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'En büyük değer hatırlanır, bu yüzden sonraki çağrılar yalnızca bir değerdir. Ya da modüle, bileşenlerin kendi modüllerine uzandığı biçimde uzanın ve paketi tümüyle atlayın:',
      ),
      codeBlock('Herhangi bir yer', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Bitir')`, 'javascript'),
      p(
        code('null'),
        ' — ya da sonlu bir sayı olmayan herhangi bir şey — geçirmek çubuğu belirsiz canlandırmaya geri verir, böylece sayı bildirmeyi bırakan işlerin ayrıca ele alınması gerekmez. ',
        code('getProgress()'),
        ' geçerli değeri, çubuğun kendi ölçeğinde geri okur.',
      ),

      h2('Deneyin'),
      p('Bu sayfa çalışma zamanını yükler, bu yüzden aşağıdaki düğmeler çubuğu gerçekten hareket ettirir.'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'Yükleniyor', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Sıfırla'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '%35'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '%80'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Bitti'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Bilinmiyor'),
  ),
)`, { align: 'stretch' }),
      p(
        'Etiketsiz bir çubuk da hareket ettirilir ama ',
        code('aria-hidden'),
        ' kalır — bilerek adsız işlenmişti ve şimdi üzerinde bir değer duyurmak erişilebilirlik ağacına adsız bir progressbar koyardı.',
      ),

      h2('Döndürücü'),
      p(
        'Bir döndürücü bileşeni yoktur — döndürücü bir simgedir ve onu döndüren şey ',
        code('spin'),
        ' propudur. Her simge gibi ',
        code('em'),
        ' cinsinden boyutlandırılır, bu yüzden kendisine bir boyut söylenmeden yanındaki metne uyar.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('Bağlam içinde döndürücü'),
      p(
        'Tek başına duran bir döndürücüye duyurulsun diye bir ',
        code('label'),
        ' verin. Bir düğmenin içindekine gerekmez — düğme ne yaptığını zaten söyler.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'Yükleniyor' }),
    text({ variant: 'small', tone: 'muted' }, 'Son derleme getiriliyor…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Dağıtılıyor'),
    button({ variant: 'outline', loading: true }, 'Bağlantılar denetleniyor'),
  ),
)`, { align: 'start' }),

      h2('Proplar'),
      p(code('progress()'), ' — ', code('progressBar'), ' olarak da dışa aktarılır:'),
      propsTable([
        ['value', 'number', '', 'Ne kadar ilerlediği. Belirsiz canlandırma için atlayın.'],
        ['max', 'number', '100', 'Hangi değerin tamamlanmış sayılacağı.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Dolgu rengi.'],
        ['label', 'Child', '', 'Çubuğun üstündeki metin; aynı zamanda erişilebilir adı.'],
        ['showValue', 'boolean', 'false', 'Etiketin yanında yüzdeyi gösterir.'],
        ['height', 'Space', "'0.5rem'", 'Çubuk kalınlığı.'],
      ]),
      p(code('sitelo/ui/client'), ' içindeki ', code('setProgress()'), ':'),
      propsTable([
        ['target', 'Element | string', '', 'Çubuk ya da birinin kimliği. Hiçbir öğe o kimliği taşımıyorsa bir seçici denenir.'],
        ['value', 'number | null', '', 'Nereye taşınacağı. null onu belirsiz canlandırmaya döndürür.'],
        ['options.max', 'number', '100', 'Neyin tamamlanmış sayılacağı. Sonraki çağrılar için hatırlanır.'],
      ]),
      p(
        'Döndürücünün kendine ait propu yoktur — o ',
        code("icon('spinner', { spin: true })"),
        ' ifadesidir ve ',
        code('icon()'),
        ' ne alıyorsa onu alır.',
      ),
    ],
  })
