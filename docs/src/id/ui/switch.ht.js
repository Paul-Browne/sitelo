import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Sakelar',
    description:
      'Pengalih nyala/mati untuk pengaturan yang langsung berlaku — sebuah kotak centang di baliknya, dengan role="switch".',
    activeHref: '/id/ui/switch',
    children: [
      p(
        'Sakelar dipakai untuk pengaturan yang berlaku begitu ia dibalik. Kotak centang dipakai untuk pilihan yang Anda konfirmasi kemudian, dengan tombol kirim. Jika kendali Anda duduk dalam formulir yang punya Simpan di bawahnya, itu kotak centang.',
      ),
      p(
        'Komponennya bernama ',
        code('toggle()'),
        ' alih-alih ',
        code('switch()'),
        ' karena alasan membosankan yang tak terhindarkan: ',
        code('switch'),
        ' adalah kata kunci, jadi ia tidak bisa menjadi pengikat impor. Di baliknya ada ',
        code('<input type="checkbox">'),
        ' sungguhan yang membawa ',
        code('role="switch"'),
        '.',
      ),

      h2('Sakelar dasar'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Situs publik', name: 'public' }),
  toggle({ label: 'Nyala', name: 'on', checked: true }),
)`),

      h2('Warna'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Dinonaktifkan'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Mati, dan terkunci', disabled: true }),
  toggle({ label: 'Nyala, dan terkunci', checked: true, disabled: true }),
)`),

      h2('Tanpa label'),
      p(
        'Sakelar tanpa label yang terlihat tetap butuh nama yang dapat diakses. Berikan ',
        code('aria-label'),
        ' — ia jatuh ke masukannya.',
      ),
      demo(`toggle({ 'aria-label': 'Aktifkan pencarian Pagefind', checked: true })`),

      h2('Daftar pengaturan'),
      p(
        'Bentuk yang lazim: labelnya di kiri, sakelarnya di kanan, satu baris per pengaturan.',
      ),
      demo(`return list(
  [
    ['Pencarian Pagefind', 'Mengindeks setiap halaman di akhir build.', true],
    ['Optimasi gambar', 'Mengubah ukuran dan mengonversi gambar saat build. Butuh sharp.', true],
    ['Island server', 'Merender bagian yang ditandai saat permintaan datang.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Teks di samping sakelarnya. Pakai aria-label ketika tidak ada.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Warna jalurnya saat nyala.'],
        ['checked', 'boolean', 'false', 'Apakah ia mulai dalam keadaan nyala.'],
        ['name', 'string', '', 'Nama bidang formulir.'],
        ['disabled', 'boolean', 'false', 'Menonaktifkan masukannya dan meredupkan barisnya.'],
      ]),
      p(
        'Selebihnya jatuh ke ',
        code('<input>'),
        ', dan di sanalah ',
        code('onchange'),
        ' serta ',
        code('aria-*'),
        ' seharusnya berada.',
      ),
    ],
  })
