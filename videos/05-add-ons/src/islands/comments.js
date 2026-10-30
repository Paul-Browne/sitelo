import { escapeHtml } from '../lib/escape.js'

export default async function comments({ props }) {
  // Props come from the browser, so treat them like a query string.
  const id = Number(props.recipeId)
  if (!Number.isInteger(id) || id < 1) return '<p>No comments.</p>'

  const res = await fetch(`https://dummyjson.com/comments/post/${id}`)
  if (!res.ok) throw new Error(`Comments failed with ${res.status}`)
  const { comments } = await res.json()

  if (comments.length === 0) return '<p class="meta">No comments yet. Be the first!</p>'

  return `
    <ul class="comments">
      ${comments.map((comment) => `
        <li>
          <strong>${escapeHtml(comment.user.fullName)}</strong>
          <p>${escapeHtml(comment.body)}</p>
          <span class="meta">♥ ${comment.likes}</span>
        </li>`).join('')}
    </ul>
  `
}
