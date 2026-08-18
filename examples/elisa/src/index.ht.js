import {
  getDepartments,
  categoryHref,
  labelFromSegment,
} from './lib/elisa.js'
import { siteChrome } from './lib/layout.js'

export async function data() {
  const departments = getDepartments()
  return { departments }
}

export default ({ data }) =>
  siteChrome({
    title: 'Kauppa — sitelo',
    description: 'Static catalog clone of Elisa kauppa devices.',
    body: `
      <main>
        <h1>Laitteet</h1>
        <p class="lede">
          Departments from Elisa’s device catalog. Product pages cover
          HANDSET groups (color variants on one URL).
        </p>
        <ul class="dept-grid">
          ${data.departments
            .map(
              (key) => `
            <li>
              <a href="${categoryHref(key)}">${labelFromSegment(key)}</a>
            </li>`,
            )
            .join('')}
        </ul>
      </main>
    `,
  })
