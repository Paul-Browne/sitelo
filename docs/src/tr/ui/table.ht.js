import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Tablo',
    description:
      'Geniş bir tablonun sayfayı bozmasını önleyen bir kaydırma kabı içinde, veriden satırlar ve sütunlar.',
    activeHref: '/tr/ui/table',
    children: [
      p(
        code('columns'),
        ' ve ',
        code('rows'),
        ' geçirin, tablo kendini başlığıyla birlikte kursun. Yatay bir kaydırma kabına sarılıdır, bu yüzden bir telefonun gösterebileceğinden çok sütunu olan bir tablo sayfayı germek yerine kendi içinde kaydırılır. Hem ',
        code('table'),
        ' hem ',
        code('dataTable'),
        ' olarak dışa aktarılır.',
      ),

      h2('Temel tablo'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Sayfa' },
    { key: 'size', header: 'Boyut' },
    { key: 'time', header: 'İşleme süresi' },
  ],
  rows: [
    { page: '/', size: '4,1 kB', time: '12 ms' },
    { page: '/docs', size: '12,7 kB', time: '31 ms' },
    { page: '/examples', size: '9,4 kB', time: '24 ms' },
  ],
})`, { align: 'stretch' }),

      h2('Hizalama'),
      p('Sayılar, sütunlarının sonuna hizalandığında daha iyi okunur.'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Sayfa' },
    { key: 'bytes', header: 'Bayt', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4.112', gzip: '1.204' },
    { page: '/docs', bytes: '12.704', gzip: '3.910' },
    { page: '/examples', bytes: '9.388', gzip: '2.744' },
  ],
})`, { align: 'stretch' }),

      h2('Özel hücreler'),
      p(
        code('render'),
        ' fonksiyonu olan bir sütun bütün satırı alır ve hücrede ne olması gerekiyorsa onu döndürür — bir etiket, bir bağlantı, biçimlendirilmiş bir sayı.',
      ),
      demo(`table({
  columns: [
    { header: 'Sayfa', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Boyut', align: 'end' },
    { header: 'Durum', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'tamam' : 'başarısız') },
  ],
  rows: [
    { page: '/docs/routing', href: '/docs/routing', size: '18,2 kB', ok: true },
    { page: '/docs/data', href: '/docs/data', size: '21,7 kB', ok: true },
    { page: '/docs/islands', href: '/docs/islands', size: '24,1 kB', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Biçemler'),
      p(
        code('striped'),
        ' satırları dönüşümlü şeritler, ',
        code('hover'),
        ' işaretçinin altındaki satırı vurgular, ',
        code('dense'),
        ' ise çok satırlı bir tablo için dolguyu sıkılaştırır.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'şeritli',
    columns: [{ key: 'name', header: 'Ad' }, { key: 'value', header: 'Değer', align: 'end' }],
    rows: [{ name: 'sayfalar', value: '169' }, { name: 'varlıklar', value: '208' }, { name: 'toplam', value: '9,5 MB' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'üzerine gelme ve sıkı',
    columns: [{ key: 'name', header: 'Ad' }, { key: 'value', header: 'Değer', align: 'end' }],
    rows: [{ name: 'sayfalar', value: '169' }, { name: 'varlıklar', value: '208' }, { name: 'toplam', value: '9,5 MB' }],
  }),
)`, { align: 'stretch' }),

      h2('Altyazı'),
      p(
        'Altyazı, tabloyu çevresindeki metin olmadan karşılaşan herkes için adlandırır — tablo, ne olduğunu zaten söyleyen bir başlığın hemen altında değilse eklenmeye değer.',
      ),
      demo(`table({
  caption: 'Derleme çıktısı, en yeniden başlayarak',
  columns: [
    { key: 'commit', header: 'İşleme' },
    { key: 'when', header: 'Ne zaman' },
    { key: 'pages', header: 'Sayfalar', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: '4 dakika önce', pages: '169' },
    { commit: 'dcfaaae', when: '2 saat önce', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('Veriden'),
      p(
        'Satırlar sıradan bir dizidir, bu yüzden genellikle ',
        code('data()'),
        ' işlevinin zaten yüklediği şeydir — arada bir uyarlayıcı olmadan.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Merhaba dünya', date: '2026-01-14', reads: 1204 },
    { title: 'Önce statik', date: '2026-02-02', reads: 890 },
    { title: 'Çalışma zamanı yok', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Yazı' },
      { key: 'date', header: 'Yayımlandı' },
      { header: 'Okunma', align: 'end', render: (post) => post.reads.toLocaleString('tr') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Biçimlendirmeyi kendiniz yazmak'),
      p(
        code('columns'),
        ' propunu atlayın, tablo bunun yerine çocuklarını işlesin; böylece bir alt bilgi satırı ya da gruplanmış başlıkları olan bir tablo elle kurulabilir ve yine biçimlendirmeyi ve kaydırma kabını alır.',
      ),

      h2('Proplar'),
      propsTable([
        ['columns', 'TableColumn[]', '', 'Sütun başına { key, header, align, render }. Satırları elle yazmak için atlayın.'],
        ['rows', 'object[]', '[]', 'Satır başına bir nesne.'],
        ['caption', 'Child', '', 'Tablonun üstünde bir altyazı.'],
        ['striped', 'boolean', 'false', 'Satırları dönüşümlü şeritler.'],
        ['hover', 'boolean', 'false', 'İşaretçinin altındaki satırı vurgular.'],
        ['dense', 'boolean', 'false', 'Daha sıkı hücre dolgusu.'],
      ]),
    ],
  })
