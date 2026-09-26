import * as ui from 'sitelo/ui'

/*
 * The row of numbers, shared by the island and the page's loading state
 * so the box does not jump when the island arrives. Values are a size
 * down from the default: a region name is longer than a number.
 */
export const statRow = (...stats) =>
  ui.statGroup(
    {
      columns: 'repeat(auto-fit, minmax(11rem, 1fr))',
      style: '--su-text-3xl: var(--su-text-xl)',
    },
    ...stats,
  )
