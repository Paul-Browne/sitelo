import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Adımlar',
    description:
      'Arkanızda kalan adımları bitmiş olarak işaretleyen, numaralı bir akış.',
    activeHref: '/tr/ui/steps',
    children: [
      p(
        code('current'),
        ' sürmekte olan adımın dizinidir. Ondan önceki her şey tamamlanmıştır ve bir onay işareti alır; sonraki her şey henüz gelecektir. Geçerli olan ',
        code('aria-current="step"'),
        ' ile işaretlenir, böylece renklendiği gibi duyurulur da.',
      ),

      h2('Temel adımlar'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Kurulum' },
    { title: 'Bir sayfa yazın' },
    { title: 'Derleyin' },
    { title: 'Dağıtın' },
  ],
})`, { align: 'stretch' }),

      h2('Açıklamalarla'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Kurulum', description: 'npm install -D sitelo' },
    { title: 'Bir sayfa yazın', description: 'src/index.ht.js' },
    { title: 'Derleyin', description: 'sitelo build' },
    { title: 'Dağıtın', description: 'dist/ dizinini yayımlayın' },
  ],
})`, { align: 'stretch' }),

      h2('Dikey'),
      p('Açıklamalar birkaç sözcükten uzunsa daha iyidir.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Paketi ekleyin', description: 'sitelo kendi Vite’ını getirir, bu yüzden kurulacak başka bir şey yoktur.' },
    { title: 'HTML döndüren bir fonksiyon yazın', description: 'src/ altındaki tek bir dosya bütün bir sitedir.' },
    { title: 'Çıktıyı yayımlayın', description: 'dist/ düz statik dosyalardır — her sunucu onları kabul eder.' },
  ],
})`, { align: 'stretch' }),

      h2('Henüz hiçbir şey bitmedi'),
      demo(`steps({ current: 0, items: ['Kurulum', 'Yapılandırma', 'Dağıtım'] })`, { align: 'stretch' }),

      h2('Hepsi bitti'),
      p(
        code('current'),
        ' değerini son dizinin ötesine ayarlayın, her adım tamamlanmış okunsun.',
      ),
      demo(`steps({ current: 3, items: ['Kurulum', 'Yapılandırma', 'Dağıtım'] })`, { align: 'stretch' }),

      h2('Telefonda'),
      p(
        'Yatay bir sıranın dar bir ekranda gidecek yeri yoktur, bu yüzden 40rem altında kendiliğinden dikeye döner — prop gerekmez. Görmek için bu pencereyi daraltın.',
      ),

      h2('Etiketlemek'),
      p(
        'Liste bir ',
        code('<ol>'),
        ' öğesidir, sırayı zaten taşır. Sayfada birden çok adım kümesi varsa ve ayırt edilmeleri gerekiyorsa ',
        code('label'),
        ' ekleyin.',
      ),
      demo(`steps({
  label: 'Dağıtım ilerlemesi',
  current: 1,
  items: ['Derle', 'Yükle', 'Önbelleği geçersiz kıl'],
})`, { align: 'stretch' }),

      h2('Akışı ilerletmek'),
      p(
        'Durum, her adıma yayılmış üç sınıf adı ve bir ',
        code('aria-current'),
        ' değeridir. ',
        code('setStep()'),
        ' onları birlikte hareket ettirir, böylece tarayıcıda ilerleyen bir sihirbaz bir döngü değil tek bir çağrıdır.',
      ),
      p('Son adımın ötesindeki bir dizin hepsini tamamlanmış bırakır, ki bitmiş bir akış da böyle görünür. Ya da hiçbir şey paketlenmeden, bir olay özniteliğinden:'),
      codeBlock('Herhangi bir yer', `button({ onclick: "import('/su/steps.js').then(m=>m.set('checkout',2))" }, 'Sonraki')`, 'javascript'),
      p('Ya da zaten çalışan bir modülünüz varsa kendi modülünüzden:'),
      codeBlock('src/main.js', `import { setStep } from 'sitelo/ui/client'

setStep('checkout', 2)`, 'javascript'),

      h2('Proplar'),
      propsTable([
        ['items', 'Array', '[]', 'Dizeler ya da { title, description } nesneleri.'],
        ['current', 'number', '0', 'Sürmekte olan adımın dizini.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Yerleşim. Yatay olan 40rem altında dikeye döner.'],
        ['label', 'string', '', 'Liste için erişilebilir ad.'],
      ]),
    ],
  })
