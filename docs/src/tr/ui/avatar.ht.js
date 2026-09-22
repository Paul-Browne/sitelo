import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Avatar',
    description:
      'Daire içinde bir kişi ya da bir şey — varsa bir görsel, yoksa baş harfler.',
    activeHref: '/tr/ui/avatar',
    children: [
      p(
        'Bir avatara ',
        code('name'),
        ' verip ',
        code('src'),
        ' vermezseniz, bozuk bir görsel yerine baş harfleri işler. Yalnızca bazı kişilerin fotoğrafı olan bir katkıcı listesi için işe yarayan yedek budur.',
      ),

      h2('Temel avatar'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('Görselle birlikte'),
      p(
        code('src'),
        ' ayarlandığında ',
        code('alt'),
        ' ada geri düşer — böylece bir avatar hiçbir zaman etiketsiz bir görsel olmaz.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Boyutlar'),
      p('Yazı boyutu avatarla birlikte ölçeklenir, böylece baş harfler orantılı kalır.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Küçük Biri', size: 'sm' }),
  avatar({ name: 'Orta Biri', size: 'md' }),
  avatar({ name: 'Büyük Biri', size: 'lg' }),
)`),

      h2('Kare'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Proje A', square: true }),
  avatar({ name: 'Proje B', square: true, color: 'success' }),
)`),

      h2('Renkler'),
      p('Görseli olmayan bir avatar yumuşak bir palet zemini alır.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Simgeler ve başka içerik'),
      p('Çocuklar, bir simge ya da tek bir karakter için baş harfleri geçersiz kılar.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    icon('user'),
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Gruplar'),
      p(
        code('avatarGroup()'),
        ' çocuklarını üst üste bindirir ve ',
        code('max'),
        ' değerini aşan her şeyi bir sayıya indirir.',
      ),
      demo(`stack({ gap: 'md' },
  avatarGroup(
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
  ),
  avatarGroup({ max: 3 },
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
    avatar({ name: 'Katherine Johnson' }),
    avatar({ name: 'Barbara Liskov' }),
    avatar({ name: 'Margaret Hamilton' }),
  ),
  avatarGroup({ max: 2, size: 'sm' },
    avatar({ name: 'Ada Lovelace', size: 'sm' }),
    avatar({ name: 'Grace Hopper', size: 'sm' }),
    avatar({ name: 'Alan Turing', size: 'sm' }),
  ),
)`, { align: 'start' }),

      h2('Bir listede'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'main dalına 3 işleme gönderdi',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Bir çekme isteği açtı',
  }),
)`, { align: 'stretch' }),

      h2('Proplar'),
      propsTable([
        ['name', 'string', '', 'Baş harfler, başlık ve görsel alt yedeği için kullanılır.'],
        ['src', 'string', '', 'Baş harfler yerine gösterilecek görsel.'],
        ['alt', 'string', '', 'Görsel alt metni; ada geri düşer.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Çap ve baş harflerin yazı boyutu.'],
        ['square', 'boolean', 'false', 'Daire yerine yuvarlatılmış dikdörtgen.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Baş harf zemini için palet.'],
      ]),
      p(
        code('avatarGroup()'),
        ' şunları alır: ',
        code('max'),
        ' — gerisini bir sayıya indirmeden önce kaç tanesinin gösterileceği — ve yalnızca o sayı için kullanılan ',
        code('size'),
        '.',
      ),
    ],
  })
