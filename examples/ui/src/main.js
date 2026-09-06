/*
 * The only script on the page, and it exists for one component.
 *
 * Tabs with panels, the dismiss button on an alert, the theme toggle
 * and close-on-outside-click for menus all fetch their own runtime from
 * an inline `onclick`, so none of them are here. `toast()` is the
 * exception: nothing on the page triggers it, so something has to.
 */
import { toast } from 'sitelo/ui/client'

window.siteloToast = () =>
  toast('Saved. This came from sitelo/ui/client.', { color: 'success' })
