/*
 * The only script on the page.
 *
 * Tabs with panels, the dismiss button on an alert, the theme toggle
 * and close-on-outside-click for menus need it; everything else here
 * renders and works with this file deleted.
 */
import { toast } from 'sitelo/ui/client'

window.siteloToast = () =>
  toast('Saved. This came from sitelo/ui/client.', { color: 'success' })
