import { layout } from '../layout.js'
import { posts } from './posts.js'

export const generateStaticParams = () => posts.map(({ slug }) => ({ slug }))
export const data = ({ params }) => posts.find((post) => post.slug === params.slug)

export default ({ data: post }) =>
  layout(
    { title: `${post.title} · Example`, description: post.description, modified: post.modified },
    `<article>
      <h1>${post.title}</h1>
      <p>Back to <a href="../">the blog</a>.</p>
      <pre><code class="language-js">const answer = 42</code></pre>
      <table><tr><th>Name</th><th>Value</th></tr><tr><td>a</td><td>1</td></tr></table>
    </article>`,
  )
