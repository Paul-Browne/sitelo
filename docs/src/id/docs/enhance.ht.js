import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/id.js'
import { enhanceSnippets } from '../../lib/snippets/enhance.js'

const s = enhanceSnippets('id')

export default () =>
  docsLayout({
    title: 'Enhancement',
    description:
      'Serahkan markup hasil render server ke modul browser kecil yang hanya dimuat di halaman yang memakainya.',
    activeHref: '/id/docs/enhance',
    children: [
      p(
        'Sebagian interaktivitas harus berjalan di browser: penghitung, tombol salin, form yang memeriksa dirinya saat Anda mengetik. ',
        code('enhance()'),
        ' menandai markup yang harus diambil alih sebuah modul. Server merender HTML seperti biasa, jadi halaman sudah berfungsi sebelum JavaScript tiba, dan browser hanya memuat modul di halaman yang memakainya. Modul menambahkan perilaku ke DOM yang ditemukannya. Tanpa hidrasi, tanpa runtime framework.',
      ),
      p(
        a({ href: '/id/docs/islands' }, 'Island server'),
        ' merender sebuah area di server saat halaman dibuka. Enhancement menjalankan kode untuk sebuah area di browser. Keduanya menerima argumen yang sama dan bisa dipakai bersama.',
      ),
      h2('Tulis modulnya'),
      p(
        'Enhancement adalah modul biasa, di mana saja di bawah ',
        code('src/'),
        '. Export default-nya menerima elemen dan props. Baca yang Anda perlukan dari markup yang sudah dirender server:',
      ),
      codeBlock('src/client/counter.js', s.counterModule, 'javascript'),
      p(
        'TypeScript juga bisa. Beri tipe pada fungsinya dengan ',
        code('Enhancer<Props>'),
        ' dari ',
        code('sitelo/enhance/client'),
        '.',
      ),
      h2('Pasang di halaman'),
      p(
        'Impor ',
        code('enhance()'),
        ' dari ',
        code('sitelo/enhance'),
        '. Argumennya sama dengan ',
        code('island()'),
        ': nama, props, HTML, dan opsi. HTML-nya masuk ke dalam sebuah ',
        code('<div>'),
        ' yang diterima modul.',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      p(
        'JSX meng-escape string yang dikembalikan sebuah fungsi, jadi tab JSX menyebarkan ',
        code('enhanceAttributes()'),
        ' ke elemennya. Penjelasannya ada di bawah.',
      ),
      h2('Daftarkan modulnya'),
      p(
        'Skrip yang ditautkan halaman memberikan peta nama ke modul kepada ',
        code('mountEnhancements()'),
        ':',
      ),
      codeBlock('src/enhance.js', s.registry, 'javascript'),
      p(
        'Peta ini sengaja ditulis tangan. Setiap ',
        code('import()'),
        ' adalah impor dinamis biasa, jadi build memberi setiap modul chunk-nya sendiri, dan halaman hanya mengunduh yang disebut oleh elemennya. Saat dev, Vite menyajikannya apa adanya. Karena ini kode biasa, TypeScript memeriksanya dan knip mengikutinya.',
      ),
      p(
        'Berikan ',
        code('when'),
        ' untuk menentukan kapan modul diimpor. Nilainya sama dengan island:',
      ),
      codeBlock('enhance-when', s.strategy, 'js'),
      ul(
        { class: 'docs-list' },
        li(code("'load'"), ' (bawaan) — begitu halaman dimuat'),
        li(code("'idle'"), ' — lewat ', code('requestIdleCallback'), ' (beralih ke timeout bila tidak ada)'),
        li(
          code("'visible'"),
          ' — saat elemen tergulir ke tampilan, lewat IntersectionObserver. ',
          code('rootMargin'),
          ' memulainya lebih awal, bawaannya ',
          code("'200px'"),
        ),
      ),
      h2('Elemen Anda sendiri'),
      p(
        code('enhance()'),
        ' membungkus markup dengan ',
        code('<div>'),
        '. Bila elemennya sendiri penting, misalnya ',
        code('<form>'),
        ' dengan ',
        code('action'),
        ' sendiri, pasang atributnya langsung dengan ',
        code('enhanceAttributes(name, props, options)'),
        '. Hasilnya objek atribut, jadi javascript-to-html dan JSX menerimanya sebagai atribut, dan di dalam template literal ia menjadi teks atribut:',
      ),
      pageCodeTabs({
        file: 'src/search.ht.js',
        template: s.formTemplate,
        ht: s.formHt,
        jsx: s.formJsx,
      }),
      p('Modul menerima form itu sendiri:'),
      codeBlock('src/client/search.js', s.searchModule, 'javascript'),
      h2('Apa yang diberikan sebagai props'),
      p(
        'Props adalah JSON yang ditulis ke halaman dan diberikan ke modul sebagai argumen kedua. Setiap elemen di halaman membawa salinannya sendiri, jadi berikan hanya yang belum dikatakan markup: pengaturan yang tidak punya tempat alami di HTML, seperti ',
        code('minLength'),
        ' di atas. Nilai yang ditampilkan halaman, seperti angka awal penghitung, lebih baik dibaca dari DOM agar keduanya tidak bisa berbeda. Data besar tempatnya di HTML itu sendiri, atau di file yang diambil modul.',
      ),
      p(
        'Tidak seperti props island, props ini tidak pernah kembali ke server, jadi tidak ada yang perlu ditandatangani. Namun props tetap terlihat di sumber halaman, jadi jangan taruh rahasia di dalamnya.',
      ),
      h2('Diperiksa saat build'),
      p(
        'Build membaca peta dari panggilan ',
        code('mountEnhancements()'),
        ' Anda dan gagal pada halaman yang menyebut enhancement yang tidak ada di peta:',
      ),
      codeBlock('sitelo build', s.buildError, 'text'),
      p(
        code("missingAssets: 'warn'"),
        ' mengubahnya menjadi peringatan, sama seperti untuk skrip yang hilang, dan ',
        code('sitelo'),
        ' (dev) memberi peringatan saat merender setiap halaman. Build harus bisa membaca petanya, jadi tulis sebagai literal objek di dalam panggilan, atau sebagai ',
        code('const'),
        ' di file yang sama. Peta yang disusun saat runtime, dengan spread atau diimpor dari modul lain, tidak bisa dibaca, dan saat itu tidak ada yang diperiksa. Enhancement di dalam island server dirender saat permintaan, jadi build juga tidak melihatnya.',
      ),
      h2('Status dan error'),
      p(
        'Atribut ',
        code('data-sitelo-enhance-state'),
        ' setiap elemen melewati ',
        code('pending'),
        ' (menunggu gilirannya), ',
        code('loading'),
        ', dan ',
        code('ready'),
        '. Jika modul gagal dimuat atau melempar error, statusnya ',
        code('error'),
        ', markup dari server tetap seperti semula, dan error dikirim ke ',
        code('mountEnhancements(modules, { onError })'),
        ', atau ke konsol. Pakai status ini di CSS bila halaman perlu berubah setelah modul siap:',
      ),
      codeBlock('styles.css', s.stateCss, 'css'),
      h2('Perlu diketahui'),
      ul(
        { class: 'docs-list' },
        li(
          'Enhancement yang sama boleh muncul berapa kali pun di satu halaman. Modul diunduh sekali dan berjalan sekali per elemen, jadi simpan state tiap elemen di dalam fungsi, dan cari dengan ',
          code('element.querySelector()'),
          ', bukan di seluruh dokumen.',
        ),
        li(
          'Enhancement di dalam island server dipasang saat HTML island tiba: loader island mengirim ',
          code('sitelo:island-load'),
          ', dan ',
          code('mountEnhancements()'),
          ' mendengarkannya. Muat kedua loader dari skrip yang sama.',
        ),
        li(
          code('mountEnhancements()'),
          ' tidak pernah menjalankan modul dua kali pada elemen yang sama, jadi aman memanggilnya lagi setelah Anda menambahkan markup sendiri.',
        ),
        li(
          'Ingin framework di satu kotak saja? Pasang dari modulnya, misalnya dengan ',
          code('createRoot(element).render(<Chart {...props} />)'),
          '. Hanya halaman dengan kotak itu yang mengunduhnya.',
        ),
      ),
    ],
  })
