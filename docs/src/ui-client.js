/*
 * sitelo-ui's optional runtime, loaded only on the pages under /ui.
 *
 * It is what makes those demos real rather than pictures of themselves:
 * panel tabs actually swap, a dismissible alert actually closes, the
 * toast button actually shows a toast, the theme toggle actually
 * toggles. Every one of them still renders correctly with this file
 * removed, which is the point those pages are making.
 */
import { toast } from 'sitelo/ui/client'

/*
 * The Toast page's demo buttons call this from an `onclick` attribute,
 * which is the only way a demo snippet — a string of HTML, rendered at
 * build time — can reach a function at all. It is guarded on the page
 * too, so the buttons are inert rather than broken if this never loads.
 */
window.siteloUiToast = (message, color, duration) =>
  toast(message, { color, ...(duration === undefined ? {} : { duration }) })
