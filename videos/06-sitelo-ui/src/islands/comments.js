import * as ui from 'sitelo/ui'
import { escapeHtml } from '../lib/escape.js'

export default async function comments({ props }) {
  // Props come from the browser, so treat them like a query string.
  const id = Number(props.recipeId)
  if (!Number.isInteger(id) || id < 1) return ui.empty({ title: 'No comments' })

  const res = await fetch(`https://dummyjson.com/comments/post/${id}`)
  if (!res.ok) throw new Error(`Comments failed with ${res.status}`)
  const { comments } = await res.json()

  if (comments.length === 0) {
    return ui.empty({
      icon: ui.icon('comment-bubble'),
      title: 'No comments yet',
      description: 'Be the first!',
    })
  }

  return ui.list(
    comments.map((comment) =>
      ui.listItem({
        start: ui.avatar({ name: comment.user.fullName, size: 'sm' }),
        title: escapeHtml(comment.user.fullName),
        description: escapeHtml(comment.body),
        end: ui.text({ variant: 'small', tone: 'muted' }, ui.icon('heart'), ` ${comment.likes}`),
      }),
    ),
  )
}
