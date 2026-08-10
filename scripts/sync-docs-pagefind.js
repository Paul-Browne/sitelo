import { cp, rm } from 'node:fs/promises'

/** Copy the Pagefind bundle into docs/public so `docs:dev` can serve it. */
await rm('docs/public/pagefind', { recursive: true, force: true })
await cp('docs/dist/pagefind', 'docs/public/pagefind', { recursive: true })
console.log('[docs] synced pagefind → docs/public/pagefind')
