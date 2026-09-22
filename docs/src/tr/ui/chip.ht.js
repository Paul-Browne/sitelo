import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Etiket',
    description:
      'Derli toplu bir etiket — bir künye, bir durum, bir süzgeç, bir sayı.',
    activeHref: '/tr/ui/chip',
    children: [
      p(
        'Etiketler küçük üst veri parçalarıdır: bir blog yazısının künyeleri, bir derlemenin durumu, bir sayfanın kategorileri. Varsayılan olarak satır içidirler, bu yüzden bir sıra etiket ',
        code('wrap'),
        ' özellikli bir ',
        code('stack'),
        ' ister.',
      ),

      h2('Temel etiket'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('statik'),
  chip('vite'),
  chip('sıfır-çalışma-zamanı'),
)`),

      h2('Renkler'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Türevler'),
      demo(`stack({ gap: 'sm' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'soft', color: 'primary' }, 'soft'),
    chip({ variant: 'soft', color: 'success' }, 'soft'),
    chip({ variant: 'soft', color: 'danger' }, 'soft'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'outline', color: 'primary' }, 'outline'),
    chip({ variant: 'outline', color: 'success' }, 'outline'),
    chip({ variant: 'outline', color: 'danger' }, 'outline'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'solid', color: 'primary' }, 'solid'),
    chip({ variant: 'solid', color: 'success' }, 'solid'),
    chip({ variant: 'solid', color: 'danger' }, 'solid'),
  ),
)`, { align: 'start' }),

      h2('Boyutlar'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'küçük'),
  chip({ size: 'md' }, 'orta'),
  chip({ size: 'lg' }, 'büyük'),
)`),

      h2('Durum noktası'),
      p(
        'Öndeki bir nokta etiketi bir duruma çevirir. Anlamı taşımaya tek başına renk yetmez, bu yüzden sözcüğü koruyun.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Derleme geçti'),
  chip({ color: 'warning', dot: true }, 'Sıraya alındı'),
  chip({ color: 'danger', dot: true }, 'Başarısız'),
  chip({ color: 'neutral', dot: true }, 'Atlandı'),
)`),

      h2('Bağlantılar'),
      p(
        'Bir etikete ',
        code('href'),
        ' verin, bir çapa işlesin — her künyenin bir sayfa olduğu bir künye listesinin alışıldık biçimi budur.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/docs/routing', color: 'primary' }, 'routing'),
  chip({ href: '/docs/data', color: 'primary' }, 'data'),
  chip({ href: '/docs/islands', color: 'primary' }, 'islands'),
)`),

      h2('Düğme olarak'),
      p(
        code('as'),
        ' öğeyi değiştirir; gezinmek yerine açıp kapatan bir süzgeç için.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'Tümü'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Rehberler'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Örnekler'),
)`),

      h2('Bir tabloda'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Sayfa' },
    { header: 'Durum', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'tamam' : 'başarısız') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Hangi paletten besleneceği.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Etiketin taşıdığı ağırlık.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Dolgu ve metin boyutu.'],
        ['href', 'string', '', 'Bir çapa işler.'],
        ['dot', 'boolean', 'false', 'Etiketin önüne bir durum noktası ekler.'],
        ['as', 'string', "'span'", 'href yokken işlenecek öğe.'],
      ]),
    ],
  })
