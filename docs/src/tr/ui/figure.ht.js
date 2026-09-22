import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Şekil',
    description:
      'Bir görsel ve altyazısı, tek bir şekil olarak — görsel gelmeden önce yeri tutulmuş hâlde.',
    activeHref: '/tr/ui/figure',
    children: [
      p(
        'Bir ',
        code('<figure>'),
        ', altyazıyı betimlediği şeye bağlar; bir görselin altındaki paragraf bunu yapmaz. Yaygın durum için ',
        code('src'),
        ' geçirin ya da altyazılanmaya değer başka her şey için çocuk verin.',
      ),

      h2('Temel şekil'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'sitelo sözcük işareti',
  caption: 'Üst çubukta göründüğü biçimiyle sözcük işareti.',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('Tutulan bir oranla'),
      p(
        code('ratio'),
        ' görseli bir ',
        code('aspectRatio()'),
        ' içine sarar, böylece görsel yüklendiğinde altyazı sayfada aşağı zıplamaz.',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('Başka bir şeyi altyazılamak'),
      p(code('src'), ' olmadan, çocuklar şeklin içeriğidir.'),
      demo(`figure({ caption: 'Tablo 1 — varsayılan bir derlemenin çıktısı.' },
  table({
    dense: true,
    columns: [{ key: 'file', header: 'Dosya' }, { key: 'size', header: 'Boyut', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4,1 kB' },
      { file: '404.html', size: '860 B' },
      { file: 'sitemap.xml', size: '155 B' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Altyazılı kod'),
      p(
        code('code()'),
        ' üzerindeki ',
        code('text'),
        ' propuna dikkat: bu kitaplıkta çocuklar her yerde HTML olarak işlenir, bu yüzden etiket içeren bir örneğin kaçırılması gerekir, yoksa tarayıcı onu göstermek yerine kurar.',
      ),
      demo(`figure({ caption: 'Bir sitelo sayfasının tamamı.' },
  code({ text: 'export default () => "<h1>Merhaba</h1>"' }),
)`, { align: 'stretch' }),

      h2('Alt metni'),
      p(
        code('alt'),
        ' özniteliği her zaman yazılır, hiçbir şey vermezseniz boş olarak — hiç ',
        code('alt'),
        ' taşımayan bir görsel dosya adıyla duyurulur, ki bu sessizlikten kötüdür. Altyazı bunun yerini tutmaz: altyazıyı herkes okur, alt ise görseli göremeyen birine betimler.',
      ),
      p(
        'Altyazı zaten görselin söylediği her şeyi söylüyorsa doğru yanıt ',
        code("alt: ''"),
        ' değeridir.',
      ),

      h2('Düzyazıda'),
      p(
        'Bir Markdown işleyicisinden çıkan şekilleri ',
        code('prose()'),
        ' zaten biçimlendirir. Bu bileşen, kendiniz kurduğunuz şekiller içindir.',
      ),

      h2('Proplar'),
      propsTable([
        ['src', 'string', '', 'Görsel kaynağı. Atlayıp bunun yerine çocuk kullanın.'],
        ['alt', 'string', "''", 'Alt metni. Boş olsa bile her zaman yazılır.'],
        ['caption', 'Child', '', 'figcaption öğesi.'],
        ['ratio', 'string', '', 'Görsel yüklenmeden önce yeri tutar.'],
      ]),
    ],
  })
