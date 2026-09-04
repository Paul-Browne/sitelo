import { h2, p } from 'javascript-to-html'
import { code } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Timeline',
    description:
      'Entries in order, down a line — a changelog, a release history, an about page.',
    activeHref: '/ui/timeline',
    extraHead: uiHead(),
    children: [
      p(
        'A timeline is an ordered list with a rule down the side. Build it from ',
        code('items'),
        ', or from ',
        code('timelineItem()'),
        ' children when the entries are not uniform enough to come from an array.',
      ),

      h2('Basic timeline'),
      demo(`timeline({
  items: [
    { time: 'March 2026', title: 'Component library', description: 'sitelo-ui ships with ninety components.' },
    { time: 'January 2026', title: 'Server islands', description: 'Static pages with regions rendered at request time.' },
    { time: 'October 2025', title: 'First release', description: 'File-based routing and a build command.' },
  ],
})`, { align: 'stretch' }),

      h2('Colored markers'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Deploy succeeded', description: '204 pages published.', color: 'success' },
    { time: '12:03', title: 'Lighthouse passed', description: 'All thresholds met.', color: 'success' },
    { time: '12:01', title: 'Link check warned', description: 'One external link timed out.', color: 'warning' },
    { time: '12:00', title: 'Build started', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('With icons'),
      demo(`timeline(
  timelineItem({
    time: 'Just now',
    title: 'Published',
    color: 'success',
    icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 10 3.5 3.5L15 6"/></svg>',
  }),
  timelineItem({
    time: '2 minutes ago',
    title: 'Building',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Rich entries'),
      p('Children of an item go under its description.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Page sections', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Maintenance', description: 'Dependency bumps and a link-checker fix.' }),
)`, { align: 'stretch' }),

      h2('From data'),
      p(
        'The usual shape on a static site: a changelog file loaded by ',
        code('data()'),
        ', mapped straight to items.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Page sections' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Maintenance' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Server islands' },
  ]

  return timeline({
    items: releases.map((release) => ({
      time: release.date,
      title: 'v' + release.version,
      description: release.summary,
      color: 'primary',
    })),
  })
})()`, { align: 'stretch' }),

      h2('Timeline or steps?'),
      p(
        'A timeline records what happened, newest or oldest first, and has no current position. ',
        code('steps()'),
        ' shows progress through a flow with one step in progress and the rest ahead of or behind it.',
      ),

      h2('Props'),
      p(code('timeline()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Objects with the timelineItem props below.'],
      ]),
      p(code('timelineItem()'), ':'),
      propsTable([
        ['time', 'Child', '', 'When it happened — a date, a version, a clock time.'],
        ['title', 'Child', '', 'What happened.'],
        ['description', 'Child', '', 'The detail under it.'],
        ['icon', 'Child', '', 'Markup inside the marker.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Marker colour.'],
      ]),
      p('Children of an item render under its description.'),
    ],
  })
