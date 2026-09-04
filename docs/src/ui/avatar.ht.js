import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Avatar',
    description:
      'A person or a thing in a circle — an image when there is one, initials when there is not.',
    activeHref: '/ui/avatar',
    extraHead: uiHead(),
    children: [
      p(
        'Give an avatar a ',
        code('name'),
        ' and no ',
        code('src'),
        ' and it renders the initials instead of a broken image. That is the useful fallback for a contributor list where only some people have a photo.',
      ),

      h2('Basic avatar'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('With an image'),
      p(
        'When ',
        code('src'),
        ' is set, ',
        code('alt'),
        ' falls back to the name — so an avatar is never an unlabelled image.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Sizes'),
      p('The font size scales with the avatar, so initials stay proportionate.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Small One', size: 'sm' }),
  avatar({ name: 'Medium One', size: 'md' }),
  avatar({ name: 'Large One', size: 'lg' }),
)`),

      h2('Square'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Project A', square: true }),
  avatar({ name: 'Project B', square: true, color: 'success' }),
)`),

      h2('Colors'),
      p('An avatar with no image takes a soft palette background.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Icons and other content'),
      p('Children override the initials, for an icon or a single character.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="7" r="3"/><path d="M4 17c0-3 2.7-5 6-5s6 2 6 5"/></svg>',
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Groups'),
      p(
        code('avatarGroup()'),
        ' overlaps its children and collapses anything past ',
        code('max'),
        ' into a count.',
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

      h2('In a list'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Pushed 3 commits to main',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Opened a pull request',
  }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Used for the initials, the title and the image alt fallback.'],
        ['src', 'string', '', 'Image to show instead of initials.'],
        ['alt', 'string', '', 'Image alt text; falls back to name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diameter, and the font size of the initials.'],
        ['square', 'boolean', 'false', 'Rounded rectangle instead of a circle.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Palette for the initials background.'],
      ]),
      p(
        code('avatarGroup()'),
        ' takes ',
        code('max'),
        ' — how many to show before collapsing the rest into a count — and ',
        code('size'),
        ', which is only used for that count.',
      ),
    ],
  })
