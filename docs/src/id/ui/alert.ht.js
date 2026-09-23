import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Peringatan',
    description:
      'Pesan tentang keadaan sesuatu, dengan ikon dan peran pengumuman yang mengikuti warnanya.',
    activeHref: '/id/ui/alert',
    children: [
      p(
        'Peringatan memberi tahu pembaca sesuatu tentang halaman atau tindakan yang baru mereka lakukan. Warnanya memilih ikon dan peran ARIA sekaligus: ',
        code('danger'),
        ' dan ',
        code('warning'),
        ' mengumumkan diri sebagai ',
        code('role="alert"'),
        ', selebihnya yang lebih tenang menjadi ',
        code('role="status"'),
        ' yang sopan.',
      ),

      h2('Warna'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'Perhatian' }, 'Versi baru sitelo tersedia.'),
  alert({ color: 'success', title: 'Diterapkan' }, '169 halaman diterbitkan dalam 1,7 detik.'),
  alert({ color: 'warning', title: 'Halaman lambat' }, 'Satu halaman butuh lebih dari 500 ms untuk dirender.'),
  alert({ color: 'danger', title: 'Build gagal' }, 'Dua tautan internal menunjuk halaman yang tidak ada.'),
  alert({ color: 'neutral', title: 'Catatan' }, 'Island dimatikan di proyek ini.'),
)`, { align: 'stretch' }),

      h2('Tanpa judul'),
      p('Peringatan satu baris tidak butuh judul di atas kalimatnya.'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Tersimpan.'),
  alert({ color: 'danger' }, 'Alamat email itu sudah dipakai.'),
)`, { align: 'stretch' }),

      h2('Varian'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'Bawaannya — permukaan berwarna lembut.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Transparan, dengan batas berwarna.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'Warna palet penuh, untuk sesuatu yang tidak boleh terlewat.'),
)`, { align: 'stretch' }),

      h2('Ikon'),
      p(
        'Setiap warna punya ikon bawaan. Berikan markup Anda sendiri sebagai ',
        code('icon'),
        ', atau ',
        code('icon: false'),
        ' agar tidak ada ikon.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'Tanpa ikon' }, 'Hanya teksnya.'),
  alert({
    color: 'primary',
    title: 'Ikon khusus',
    icon: icon('star'),
  }, 'SVG apa pun bisa — ikon adalah markup, bukan dependensi.'),
)`, { align: 'stretch' }),

      h2('Bisa ditutup'),
      p('Tombol tutupnya membawa penangannya sendiri:'),
      codeBlock(
        'Markup hasil render',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'Jadi peringatan di bawah ini benar-benar menutup tanpa ada yang diimpor di halaman ini. Jika modul itu tidak pernah datang, tombolnya tetap dirender dan tidak melakukan apa-apa — itulah sebabnya peringatan tidak boleh menjadi satu-satunya tempat sebuah pesan muncul.',
      ),
      demo(`alert({ color: 'primary', title: 'Bisa ditutup', dismissible: true },
  'Klik × — penangannya mengambil dirinya sendiri pada tekanan pertama.',
)`, { align: 'stretch' }),

      h2('Konten kaya'),
      p('Peringatan menerima anak apa pun, jadi sebuah tindakan atau daftar bisa tinggal di dalamnya.'),
      demo(`alert({ color: 'danger', title: 'Pemeriksaan tautan gagal' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'Dua tautan menunjuk halaman yang tidak dihasilkan:'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: 'ditautkan dari /docs' }),
      listItem({ title: '/blog/draft', description: 'ditautkan dari /blog' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Tampilkan detail'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Abaikan'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Memilih palet, ikon bawaan, dan peran ARIA-nya.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Seberapa berat bobot yang dibawa peringatannya.'],
        ['title', 'Child', '', 'Baris pertama yang tebal.'],
        ['icon', 'Child | false', '', 'Markup ikon khusus, atau false agar tidak ada.'],
        ['dismissible', 'boolean', 'false', 'Menambahkan tombol tutup yang mengimpor penangannya sendiri.'],
        ['dismissLabel', 'string', "'Dismiss'", 'Nama yang dapat diakses untuk tombol itu.'],
      ]),
    ],
  })
