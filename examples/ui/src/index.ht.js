import { body, div, head, html, link, meta, script, title } from 'javascript-to-html'
import * as ui from 'sitelo/ui'

const icons = {
  plus: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 4v12M4 10h12"/></svg>',
  arrow: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M11 5l5 5-5 5"/></svg>',
  dots: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="16" cy="10" r="1.6"/></svg>',
  menu: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h14M3 10h14M3 14h14"/></svg>',
}

/** One labelled block of the gallery. */
const section = (id, heading, description, ...children) =>
  ui.stack(
    { as: 'section', id, gap: 'md', style: 'scroll-margin-top: 5rem' },
    ui.stack(
      { gap: 'xs' },
      ui.heading({ level: 2, size: 'h3' }, heading),
      ui.text({ tone: 'muted' }, description),
    ),
    ...children,
  )

/** A row that wraps, for showing several variants side by side. */
const row = (...children) =>
  ui.stack({ direction: 'row', gap: 'sm', wrap: true, align: 'center' }, ...children)

const COLORS = ['primary', 'neutral', 'success', 'warning', 'danger']

export default () =>
  html(
    { lang: 'en' },
    head(
      meta({ charset: 'utf-8' }),
      meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      title('sitelo-ui'),
      meta({ name: 'description', content: 'Every component in sitelo-ui, on one page.' }),
      // Applies a stored theme choice before the first paint.
      ui.themeScript(),
      // The whole stylesheet, inline. No file to copy, no extra request.
      ui.styles(),
      link({ rel: 'icon', href: 'data:,' }),
    ),
    body(
      { style: 'background: var(--su-bg); color: var(--su-text); margin: 0' },

      ui.appBar(
        { brand: 'sitelo-ui', sticky: true, blur: true },
        ui.appBarNav(
          { style: 'display: none' },
          ui.navLink({ href: '#buttons' }, 'Buttons'),
          ui.navLink({ href: '#forms' }, 'Forms'),
          ui.navLink({ href: '#data' }, 'Data'),
          ui.navLink({ href: '#overlays' }, 'Overlays'),
        ),
        ui.appBarSpacer(),
        ui.appBarActions(
          ui.themeToggle(),
          ui.menu(
            { trigger: ui.iconButton({ label: 'More', icon: icons.dots, variant: 'ghost', color: 'neutral' }), align: 'end' },
            ui.menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
            ui.menuItem({ href: 'https://sitelo.dev/docs' }, 'Docs'),
            ui.menuSeparator(),
            ui.menuItem({ popovertarget: 'about' }, 'About this page'),
          ),
          ui.iconButton({
            label: 'Open navigation',
            icon: icons.menu,
            variant: 'ghost',
            color: 'neutral',
            popovertarget: 'nav-drawer',
          }),
        ),
      ),

      ui.container(
        { size: 'md', style: 'padding-block: 3rem 5rem' },
        ui.stack(
          { gap: 'xl' },

          ui.stack(
            { gap: 'md' },
            row(ui.chip({ color: 'primary', dot: true }, 'Zero runtime')),
            ui.heading({ level: 1 }, 'Components that are just functions'),
            ui.text(
              { variant: 'lead' },
              'Every component on this page returns a string of HTML. Nothing ships to the browser except the one small script that tabs, toasts and the theme toggle ask for.',
            ),
            row(
              ui.button({ size: 'lg', endIcon: icons.arrow }, 'Get started'),
              ui.button({ size: 'lg', variant: 'outline', color: 'neutral', href: '#buttons' }, 'Browse components'),
            ),
          ),

          ui.divider(),

          section(
            'buttons',
            'Buttons',
            'Five variants across five colors, in three sizes. Give one an href and it renders an anchor instead.',
            row(
              ...['solid', 'soft', 'outline', 'ghost', 'link'].map((variant) =>
                ui.button({ variant }, variant),
              ),
            ),
            row(...COLORS.map((color) => ui.button({ color, variant: 'soft' }, color))),
            row(
              ui.button({ size: 'sm' }, 'Small'),
              ui.button({ size: 'md' }, 'Medium'),
              ui.button({ size: 'lg' }, 'Large'),
              ui.button({ startIcon: icons.plus }, 'With icon'),
              ui.button({ loading: true }, 'Saving'),
              ui.button({ disabled: true }, 'Disabled'),
              ui.iconButton({ label: 'Add', icon: icons.plus, variant: 'soft' }),
            ),
            ui.buttonGroup(
              { label: 'Alignment' },
              ui.button({ variant: 'outline', color: 'neutral' }, 'Left'),
              ui.button({ variant: 'outline', color: 'neutral' }, 'Center'),
              ui.button({ variant: 'outline', color: 'neutral' }, 'Right'),
            ),
          ),

          section(
            'typography',
            'Typography',
            'A type scale that picks its own element: variant h2 renders an &lt;h2&gt;.',
            ui.card(
              ui.cardBody(
                ui.stack(
                  { gap: 'sm' },
                  ui.text({ variant: 'overline' }, 'Overline'),
                  ui.heading({ level: 3, size: 'h2' }, 'A heading'),
                  ui.text({ variant: 'lead' }, 'Lead copy, one step up from body text.'),
                  ui.text(
                    'Body text with ',
                    ui.link({ href: '#typography' }, 'a link'),
                    ', some ',
                    ui.code('inline code'),
                    ', and a shortcut: ',
                    ui.kbd('⌘'),
                    ' ',
                    ui.kbd('K'),
                    '.',
                  ),
                  ui.text({ variant: 'caption' }, 'Caption text, for the small print.'),
                  ui.text({ lines: 2, tone: 'muted' },
                    'Clamped to two lines. ' + 'This sentence exists only to give the clamp something to cut off, so it repeats itself at some length. '.repeat(3),
                  ),
                ),
              ),
            ),
          ),

          section(
            'cards',
            'Cards and layout',
            'A grid that auto-fits as many columns as will fit, with no media queries.',
            ui.grid(
              { min: '15rem' },
              ...[
                ['Outlined', 'outlined', 'The default surface.'],
                ['Elevated', 'elevated', 'Shadow instead of a border.'],
                ['Flat', 'flat', 'Tinted, no border at all.'],
              ].map(([name, variant, copy]) =>
                ui.card(
                  { variant },
                  ui.cardHeader({ title: name, subtitle: `variant: ${variant}` }),
                  ui.cardBody(ui.text({ variant: 'small', tone: 'muted' }, copy)),
                  ui.cardFooter({ divided: true }, ui.button({ variant: 'ghost', size: 'sm' }, 'Action')),
                ),
              ),
            ),
          ),

          section(
            'forms',
            'Forms',
            'Labels, help text, error messages and ids wired together for you.',
            ui.card(
              ui.cardBody(
                ui.stack(
                  { gap: 'lg' },
                  ui.grid(
                    { min: '14rem' },
                    ui.textField({ label: 'Name', name: 'name', placeholder: 'Ada Lovelace', required: true }),
                    ui.textField({
                      label: 'Email',
                      name: 'email',
                      type: 'email',
                      help: 'We never share it.',
                    }),
                    ui.textField({
                      label: 'Site',
                      name: 'site',
                      startAdornment: 'https://',
                      error: 'That is not a URL.',
                    }),
                    ui.selectField({
                      label: 'Theme',
                      name: 'theme',
                      options: ['Light', 'Dark', { value: 'auto', label: 'System' }],
                      value: 'auto',
                    }),
                  ),
                  ui.textareaField({
                    label: 'Message',
                    name: 'message',
                    rows: 3,
                    placeholder: 'Tell us what happened…',
                  }),
                  ui.choiceGroup({
                    legend: 'Plan',
                    name: 'plan',
                    direction: 'row',
                    options: [
                      { value: 'free', label: 'Free' },
                      { value: 'pro', label: 'Pro' },
                      { value: 'team', label: 'Team', disabled: true },
                    ],
                    value: 'pro',
                  }),
                  row(
                    ui.checkbox({ label: 'Email me updates', name: 'updates', checked: true }),
                    ui.checkbox({ label: 'Unavailable', disabled: true }),
                    ui.toggle({ label: 'Public site', checked: true }),
                  ),
                ),
              ),
              ui.cardFooter(
                { divided: true, style: 'justify-content: flex-end' },
                ui.button({ variant: 'ghost', color: 'neutral' }, 'Cancel'),
                ui.button({ type: 'submit' }, 'Save changes'),
              ),
            ),
          ),

          section(
            'data',
            'Data display',
            'Avatars, badges, chips, tooltips, tables and lists.',
            row(
              ui.avatarGroup(
                { max: 3 },
                ui.avatar({ name: 'Ada Lovelace' }),
                ui.avatar({ name: 'Grace Hopper' }),
                ui.avatar({ name: 'Alan Turing' }),
                ui.avatar({ name: 'Katherine Johnson' }),
                ui.avatar({ name: 'Barbara Liskov' }),
              ),
              ui.badge({ content: 128 }, ui.button({ variant: 'soft', color: 'neutral' }, 'Inbox')),
              ui.badge({ dot: true, color: 'success', label: 'Online' }, ui.avatar({ name: 'Ada L' })),
              ui.tooltip(
                { content: 'Tooltips need no script' },
                ui.button({ variant: 'outline', color: 'neutral' }, 'Hover me'),
              ),
            ),
            row(...COLORS.map((color) => ui.chip({ color, dot: true }, color))),
            ui.table({
              striped: true,
              hover: true,
              caption: 'Build output',
              columns: [
                { key: 'page', header: 'Page' },
                { key: 'size', header: 'Size', align: 'end' },
                {
                  header: 'Status',
                  align: 'end',
                  render: (page) => ui.chip({ color: page.ok ? 'success' : 'danger', size: 'sm' }, page.ok ? 'ok' : 'failed'),
                },
              ],
              rows: [
                { page: '/', size: '4.1 kB', ok: true },
                { page: '/docs', size: '12.7 kB', ok: true },
                { page: '/blog/[slug]', size: '8.2 kB', ok: false },
              ],
            }),
            ui.list(
              ui.listItem({
                start: ui.avatar({ name: 'Routing', size: 'sm', color: 'primary' }),
                title: 'File-based routing',
                description: 'src/about.ht.js becomes /about',
                end: ui.chip({ size: 'sm' }, 'core'),
                href: '#data',
              }),
              ui.listItem({
                start: ui.avatar({ name: 'Data', size: 'sm', color: 'success' }),
                title: 'Build-time data',
                description: 'data() runs once, with fetch caching',
                end: ui.chip({ size: 'sm' }, 'core'),
                href: '#data',
              }),
            ),
          ),

          section(
            'feedback',
            'Feedback',
            'Alerts, progress, spinners and skeletons.',
            ui.stack(
              { gap: 'sm' },
              ...COLORS.map((color) =>
                ui.alert(
                  { color, title: `${color[0].toUpperCase()}${color.slice(1)}`, dismissible: color === 'primary' },
                  'The icon and the announcement role both follow the colour.',
                ),
              ),
            ),
            ui.grid(
              { min: '16rem' },
              ui.card(ui.cardBody(ui.progress({ value: 72, label: 'Building', showValue: true }))),
              ui.card(ui.cardBody(ui.progress({ label: 'Waiting', color: 'neutral' }))),
              ui.card(
                ui.cardBody(
                  ui.stack(
                    { gap: 'sm' },
                    row(ui.spinner({ label: 'Loading' }), ui.text({ variant: 'small', tone: 'muted' }, 'Loading…')),
                    ui.skeleton({ lines: 3 }),
                  ),
                ),
              ),
            ),
            row(
              ui.button(
                { variant: 'soft', color: 'success', onclick: "window.siteloToast && window.siteloToast()" },
                'Show a toast',
              ),
            ),
          ),

          section(
            'navigation',
            'Navigation',
            'Breadcrumbs, pagination and tabs — in link form, or with panels that swap in place.',
            ui.breadcrumbs({
              items: [
                { label: 'Home', href: '#' },
                { label: 'Docs', href: '#navigation' },
                { label: 'Components' },
              ],
            }),
            ui.pagination({ page: 5, count: 12, href: (page) => `#page-${page}` }),
            ui.tabs({
              variant: 'pills',
              items: [
                { id: 'install', label: 'Install', panel: ui.card(ui.cardBody(ui.code('npm install sitelo'))) },
                { id: 'use', label: 'Use', panel: ui.card(ui.cardBody(ui.code("import * as ui from 'sitelo/ui'"))) },
                { id: 'build', label: 'Build', panel: ui.card(ui.cardBody(ui.code('sitelo build'))) },
              ],
            }),
          ),

          section(
            'overlays',
            'Overlays',
            'The modal, the drawer and the accordion are the browser’s own — popover and details, no script.',
            row(
              ui.button({ popovertarget: 'confirm' }, 'Open modal'),
              ui.button({ variant: 'outline', color: 'neutral', popovertarget: 'nav-drawer' }, 'Open drawer'),
            ),
            ui.accordion({
              name: 'faq',
              items: [
                {
                  title: 'Does this ship any JavaScript?',
                  content: 'Only if you import sitelo/ui/client. Everything on this page except the tabs, the toast and the theme toggle works without it.',
                  open: true,
                },
                {
                  title: 'How do I change the colours?',
                  content: 'theme({ primary: { base: "#5b5bd6" } }) after styles(). Every component reads the same custom properties.',
                },
                {
                  title: 'Can I use my own markup?',
                  content: 'Yes — components are ordinary functions returning strings, so anything javascript-to-html renders nests inside them.',
                },
              ],
            }),
          ),
        ),
      ),

      ui.modal(
        { id: 'confirm', title: 'Delete this page?', footer: ui.stack(
          { direction: 'row', gap: 'sm' },
          ui.button({ variant: 'ghost', color: 'neutral', popovertarget: 'confirm', popovertargetaction: 'hide' }, 'Cancel'),
          ui.button({ color: 'danger' }, 'Delete'),
        ) },
        'This cannot be undone. The generated HTML is removed on the next build.',
      ),

      ui.modal(
        { id: 'about', title: 'About' },
        'Every component in sitelo-ui, rendered on one static page at build time.',
      ),

      ui.drawer(
        { id: 'nav-drawer', title: 'Navigation' },
        ui.stack(
          { gap: 'xs' },
          ...[
            ['Buttons', '#buttons'],
            ['Typography', '#typography'],
            ['Cards', '#cards'],
            ['Forms', '#forms'],
            ['Data display', '#data'],
            ['Feedback', '#feedback'],
            ['Navigation', '#navigation'],
            ['Overlays', '#overlays'],
          ].map(([label, href]) => ui.navLink({ href }, label)),
        ),
      ),

      ui.toasts(),

      div(
        { style: 'border-top: 1px solid var(--su-border); padding: 2rem 0' },
        ui.container(
          { size: 'md' },
          ui.text({ variant: 'small', tone: 'muted', align: 'center' }, 'Built with sitelo-ui'),
        ),
      ),

      script({ type: 'module', src: '/main.js' }),
    ),
  )
