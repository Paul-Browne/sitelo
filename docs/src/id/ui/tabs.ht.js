import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Tab',
    description:
      'Tiga bentuk: tautan, satu halaman per tab; panel yang bertukar di tempat; atau panel yang digerakkan URL.',
    activeHref: '/id/ui/tabs',
    children: [
      p(
        'Beri tiap item sebuah ',
        code('href'),
        ' dan tab-nya menjadi tautan — satu halaman per tab, tanpa skrip, ',
        code('aria-current'),
        ' pada yang aktif. Beri tiap item sebuah ',
        code('panel'),
        ' dan mereka menjadi grup radio yang panelnya bertukar di tempat, tetap tanpa skrip.',
      ),
      p(
        'Di situs statis, bentuk tautan biasanya yang tepat: ia memberi tiap tampilan sebuah URL, dan ia bertahan ketika JavaScript dimatikan. Raih panel ketika kontennya kecil dan pergantiannya tidak layak menghabiskan satu navigasi.',
      ),

      h2('Tab tautan'),
      p(
        'Ini benar-benar tautan — klik satu dan ia menavigasi. Garis bawahnya datang dari ',
        code('active'),
        ' atau ',
        code('value'),
        ' saat build, bukan dari kliknya, jadi tiap halaman menandai tabnya sendiri. Tidak ada bagian dari tab tautan yang bereaksi terhadap URL dengan sendirinya: untuk itu, bergantilah di tempat dengan panel di bawah.',
      ),
      demo(`tabs({
  items: [
    { label: 'Remah roti', href: '/ui/breadcrumbs' },
    { label: 'Tab', href: '/ui/tabs', active: true },
    { label: 'Paginasi', href: '/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Tab panel'),
      p(
        'Tab-nya adalah sebuah ',
        code('<label>'),
        ' untuk radio yang dijaga lembar gayanya agar tak terlihat, dan panel yang mengikuti radio tercentang itulah yang ditampilkan CSS. Tidak ada yang diimpor di halaman ini: pergantiannya, dan tombol panah yang berpindah antartab, adalah hal-hal yang sudah dilakukan grup radio.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Pasang', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Pakai', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Bangun', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Tab yang bisa ditaut langsung'),
      p(
        'Beri item berpanel itu sebuah ',
        code('href'),
        ' fragmen juga dan radionya digantikan tautan: URL-nya menamai tabnya, ',
        code(':target'),
        ' memilihnya, panel yang mengikutinya ditampilkan, dan pilihannya bertahan melewati muat ulang, tautan yang dibagikan, dan tombol kembali. Id-nya ada pada tabnya dan bukan pada panelnya karena peramban menggulirkan apa pun yang dinamai URL ke bagian atas jendela — menamai panelnya akan menggulirkan tabnya keluar dari layar yang baru saja Anda kliki. Hanya satu elemen dalam sebuah dokumen yang bisa menjadi ',
        code(':target'),
        ', jadi bentuk ini untuk satu rangkaian tab per halaman. Penggulirannya sendiri tidak bisa dibatalkan: mengikuti sebuah fragmen memang menggerakkan jendelanya menurut definisi. Yang bisa dilakukan sebuah halaman hanyalah memilih apa yang digulirkan dan ke mana ia mendarat, dan itulah gunanya id pada tabnya serta ',
        code('scroll-margin-block-start'),
        '-nya — setel dengan props ',
        code('scrollMargin'),
        ', dan beri kepala yang lengket setidaknya setinggi dirinya sendiri.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Penyiapan', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Panel ini adalah #tab-setup — salin URL-nya dan ia kembali.'))) },
    { id: 'deploy', label: 'Penerapan', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Dan yang ini #tab-deploy.'))) },
  ],
})`, { align: 'stretch' }),

      h2('Pil'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'Semua', href: '#all', active: true },
      { label: 'Panduan', href: '#guides' },
      { label: 'Contoh', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Warna'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Lainnya', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Lainnya', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Lainnya', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Banyak tab'),
      p('Daftar tabnya bergulir mendatar alih-alih membungkus, jadi barisnya menjaga bentuknya di ponsel. Tab panel justru membungkus — tiap panel harus mengikuti tabnya sendiri, dan itu tidak menyisakan elemen baris untuk digulirkan.'),
      demo(`tabs({
  items: [
    'Ringkasan', 'Perutean', 'Data', 'Aset', 'Gambar', 'Island', 'TypeScript', 'CLI', 'Penerapan',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Dinonaktifkan'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Tersedia', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Yang ini berfungsi.'))) },
    { id: 'soon', label: 'Segera hadir', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Aksesibilitas'),
      p(
        'Bentuk panelnya adalah grup radio sungguhan: tabnya adalah elemen ',
        code('<label>'),
        ' untuk radio yang berbagi satu ',
        code('name'),
        ', jadi pembaca layar mengumumkan yang mana dari berapa yang dipilih, dan tombol panah, Home serta End bekerja tanpa apa pun dimuat. Bentuk yang bisa ditaut langsung justru berupa tautan biasa, dan tidak membawa ',
        code('aria-current'),
        ' — ia akan ditulis sekali lalu menjadi salah setelah klik pertama. Ia sengaja bukan ARIA tablist — ',
        code('aria-selected'),
        ' ditulis sekali, di server, dan CSS tidak bisa menjaganya tetap benar saat Anda mengeklik. Bentuk tautannya juga bukan tablist: tautan yang menavigasi adalah tautan, dan memberi mereka semantik tab berarti berbohong tentang apa yang mereka lakukan.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'String, atau objek { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id item yang aktif. Mundur ke active, lalu ke yang pertama.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Bagaimana tab aktifnya ditandai.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Warna tab yang aktif.'],
        ['label', 'string', "'Tabs'", 'Nama yang dapat diakses untuk grupnya. Hanya bentuk panel.'],
        ['name', 'string', 'id item pertama', 'Nama grup radionya. Hanya dua rangkaian tab panel dalam satu halaman yang membutuhkannya.'],
        ['href', 'string', '', 'Pada sebuah item: halaman yang ditaut, atau — bersama panel — fragmen yang menamainya.'],
        ['scrollMargin', 'Space', "'lg'", 'Seberapa jauh di atas tabnya jendela berhenti. Hanya bentuk :target.'],
      ]),
    ],
  })
