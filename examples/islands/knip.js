import { knipConfig } from 'sitelo/knip'

/*
 * Pages and islands are entries already. The rest is what nothing
 * imports: the script the pages load with a `<script src>`, and the
 * islands endpoint each host mounts on its own terms.
 */
export default knipConfig({
  entry: ['src/js/islands.js!', 'api/islands/[...path].js!', 'netlify/functions/islands.mjs!'],
  ignore: ['dist/**'],
})
