---
title: Hello, world
date: 2026-08-01
description: The obligatory first post — how this blog is built.
---

This blog is a folder of markdown files rendered to static HTML by
[sitelo](https://sitelo.dev).

Each post is a `.md` file in `content/` with a few lines of frontmatter:

```md
---
title: Hello, world
date: 2026-08-01
description: The obligatory first post.
---
```

`src/lib/posts.js` reads the folder, parses the frontmatter, and renders the
body with [marked](https://marked.js.org). `src/blog/[slug].ht.js` turns every
file into a static page at build time via `generateStaticParams`.

No client-side JavaScript ships at all — it's just HTML and CSS.
