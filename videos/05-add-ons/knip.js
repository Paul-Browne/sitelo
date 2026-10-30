import { knipConfig } from 'sitelo/knip'

export default knipConfig({
  // Client scripts that pages link by URL, which knip cannot see
  entry: ['src/islands.js!', 'src/search.js!'],
})
