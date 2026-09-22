import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/tr.js'
import { preview } from '../../lib/ui-demo.js'

/**
 * Bileşen sayfası başına bir kart, tam olarak bileşen başvurusundaki gibi
 * gruplanmış. Her `demo` kendi kartına canlı olarak işlenir.
 */
const GROUPS = [
  ['Yerleşim', [
    ['/tr/ui/container', 'Kapsayıcı', 'Ortalanmış, genişliği sınırlı bir sayfa sütunu.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'ortalanmış'))`],
    ['/tr/ui/stack', 'Yığın', 'Boşluğu bir belirteçle verilen esnek bir satır ya da sütun.',
      `stack({ direction: 'row', gap: 'sm' }, chip('bir'), chip('iki'), chip('üç'))`],
    ['/tr/ui/grid', 'Izgara', 'Medya sorgusu olmadan sığabildiği kadar sütun sığdırır.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/tr/ui/divider', 'Ayırıcı', 'Bölümler arasında etiketli ya da etiketsiz bir çizgi.',
      `div({ style: 'width: 100%' }, divider('ya da'))`],
    ['/tr/ui/aspect-ratio', 'En boy oranı', 'Bir kutuyu sabit biçimde tutun, yüklenirken hiçbir şey kaymasın.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/tr/ui/card', 'Kart', 'Başlığı, gövdesi ve alt bilgisiyle gruplanmış içerik için bir yüzey.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'Bir kart')))`],
  ]],
  ['Tipografi', [
    ['/tr/ui/typography', 'Tipografi', 'Kendi öğesini seçen bir yazı ölçeği.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Başlık'), text({ variant: 'caption', tone: 'muted' }, 'Altyazı'))`],
    ['/tr/ui/prose', 'Düzyazı', 'Markdown’dan ya da bir CMS’ten gelen ham HTML’i biçimlendirin.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>Bir başlık</strong></p><p>Ve bir paragraf.</p>')`],
    ['/tr/ui/link', 'Bağlantı', 'Bir dış bağlantının ihtiyaç duyduğu özniteliklerle biçimlendirilmiş çapa.',
      `text({ variant: 'small' }, '', link({ href: '/docs' }, 'Belgeleri'), ' okuyun.')`],
    ['/tr/ui/icons', 'Simgeler', 'Tek ızgarada 99 glif; çevresindeki metinle boyutlanıp renklenir.',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['Girdiler', [
    ['/tr/ui/button', 'Düğme', 'Beş türev, beş renk, üç boyut.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Kaydet'), button({ size: 'sm', variant: 'outline' }, 'Vazgeç'))`],
    ['/tr/ui/button-group', 'Düğme grubu', 'Tek bir denetime birleştirilmiş düğmeler.',
      `buttonGroup({ label: 'Önizleme' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Bir'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'İki'))`],
    ['/tr/ui/text-field', 'Metin alanı', 'Etiket, denetim, yardım metni ve hata, birbirine bağlanmış.',
      `textField({ label: 'E-posta', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/tr/ui/select', 'Açılır liste', 'Uyumlu biçimlendirilmiş yerli bir select.',
      `selectField({ label: 'Tema', name: 'g-theme', size: 'sm', options: ['Açık', 'Koyu'], value: 'Koyu' })`],
    ['/tr/ui/checkbox', 'Onay kutusu', 'Değiştirilmiş değil, CSS ile biçimlendirilmiş gerçek bir girdi.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Site haritası', checked: true }), checkbox({ label: 'RSS akışı' }))`],
    ['/tr/ui/radio', 'Seçenek grubu', 'Bir ad paylaşan radyolarla, birkaçından bir seçim.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['free', 'pro'] })`],
    ['/tr/ui/switch', 'Anahtar', 'Hemen uygulanan bir ayar için açık/kapalı değiştirici.',
      `stack({ gap: 'sm' }, toggle({ label: 'Herkese açık', checked: true }), toggle({ label: 'Taslaklar' }))`],
    ['/tr/ui/slider', 'Kaydırıcı', 'Uyumlu biçimlendirilmiş yerli bir range girdisi.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Önizleme' }))`],
    ['/tr/ui/toggle-button', 'Geçiş düğmesi', 'Basılı kalan bir düğme.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'Açık'), toggleButton({ size: 'sm' }, 'Kapalı'))`],
    ['/tr/ui/toggle-group', 'Geçiş grubu', 'Düğme ya da bağlantı olarak bölmeli bir denetim.',
      `toggleGroup({ size: 'sm', label: 'Önizleme', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Veri gösterimi', [
    ['/tr/ui/avatar', 'Avatar', 'Varsa bir görsel, yoksa baş harfler.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/tr/ui/badge', 'Rozet', 'Bir köşeye iliştirilmiş bir sayı ya da nokta.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Gelen kutusu'))`],
    ['/tr/ui/chip', 'Etiket', 'Bir künye, bir durum, bir süzgeç.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'geçti'), chip({ color: 'neutral' }, 'statik'))`],
    ['/tr/ui/tooltip', 'İpucu', 'Üzerine gelme ve odakta bir ipucu, tümüyle CSS ile çizilmiş.',
      `tooltip({ content: 'Betik gerekmez' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Üzerime gel'))`],
    ['/tr/ui/table', 'Tablo', 'Bir kaydırma kabında, veriden satır ve sütunlar.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Sayfa' }, { key: 's', header: 'Boyut', align: 'end' }],
        rows: [{ p: '/', s: '4,1 kB' }, { p: '/docs', s: '12,7 kB' }] })`],
    ['/tr/ui/list', 'Liste', 'İki yanında birer şey bulunan satırlar.',
      `list({ plain: true }, listItem({ title: 'Yönlendirme', description: 'Dosya tabanlı' }))`],
    ['/tr/ui/figure', 'Şekil', 'Bir görsel ve altyazısı, tek bir şekil olarak.',
      `figure({ src: '/logo.svg', alt: '', caption: 'Bir altyazı', style: 'width: 7rem' })`],
    ['/tr/ui/carousel', 'Karusel', 'Yerine oturan slaytlar, tarayıcının çizdiği nokta ve oklarla.',
      `div({ style: 'width: 100%' }, carousel({ perView: 2.4, gap: 'sm', arrows: false, items: ['1', '2', '3'].map((n) =>
        aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          div({ style: 'display: grid; place-items: center; color: var(--su-text-subtle)' }, n))) }))`],
  ]],
  ['Geri bildirim', [
    ['/tr/ui/alert', 'Uyarı', 'Simgesi ve ARIA rolü rengini izleyen bir ileti.',
      `alert({ color: 'success' }, 'Dağıtıldı.')`],
    ['/tr/ui/empty', 'Boş durum', 'Bir listenin, içinde bir şey olmadan önce nasıl göründüğü.',
      `empty({ title: 'Burada bir şey yok', style: 'padding: 0' })`],
    ['/tr/ui/progress', 'İlerleme', 'Bilinen iş için bir çubuk, gerisi için bir döndürücü.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/tr/ui/skeleton', 'İskelet', 'Gelecek içeriğin biçiminde bir yer tutucu.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/tr/ui/toast', 'Bildirim', 'Betikten eklenen, geçici bir ileti.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Kaydedildi.'))`],
  ]],
  ['Gezinme', [
    ['/tr/ui/breadcrumbs', 'Gezinti yolu', 'Bu sayfada biten ata izi.',
      `breadcrumbs({ items: [{ label: 'Belgeler', href: '/docs' }, { label: 'UI' }] })`],
    ['/tr/ui/pagination', 'Sayfalama', 'Gerçek bağlantılar olarak, pencerelenmiş numaralı sayfalar.',
      `pagination({ page: 2, count: 5, href: (page) => '/tr/ui#p' + page })`],
    ['/tr/ui/tabs', 'Sekmeler', 'Bağlantılar, sekme başına bir sayfa — ya da yerinde değişen paneller.',
      `tabs({ variant: 'pills', items: [{ label: 'Bir', href: '/tr/ui#t1', active: true }, { label: 'İki', href: '/tr/ui#t2' }] })`],
    ['/tr/ui/app-bar', 'Uygulama çubuğu', 'Bir yanda marka, öbür yanda gezinme ve eylemler.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/tr/ui/theme-toggle', 'Tema değiştirici', 'Açık ve koyu, girişte parlamadan.',
      `themeToggle()`],
  ]],
  ['Katmanlar', [
    ['/tr/ui/modal', 'Modal', 'Popover API üzerinde bir iletişim kutusu — hiçbir yerde betik yok.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Kipi aç')`],
    ['/tr/ui/drawer', 'Çekmece', 'Kenardan bir panel, aynı popover işleyişi.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Çekmeceyi aç')`],
    ['/tr/ui/menu', 'Menü', 'details üzerine kurulu bir açılır menü, açma ve kapama bedava.',
      `chip({ color: 'neutral' }, 'Eylemler ▾')`],
    ['/tr/ui/accordion', 'Akordeon', 'Dışlayıcı kip dahil, katlanabilir bölümler.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'Bir soru' }] }))`],
    ['/tr/ui/collapsible', 'Katlanabilir', 'Akordeon süsleri olmadan tek bir “daha fazla göster”.',
      `collapsible({ trigger: 'Daha fazla göster' }, 'İstenene dek gizli.')`],
  ]],
  ['Bölümler', [
    ['/tr/ui/hero', 'Hero', 'Bir açılış sayfasının tepesi: manşet, cümle, eylemler.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'Bir manşet'), text({ variant: 'caption', tone: 'muted' }, 'Ve bir cümle.'))`],
    ['/tr/ui/footer', 'Alt bilgi', 'Bağlantı sütunları ve altlarında bir satır.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Belgeler'), text({ variant: 'caption', tone: 'muted' }, 'Rehber · Bileşenler'))`],
    ['/tr/ui/stat', 'İstatistik', 'Bakmaya değer bir sayı ve ne anlama geldiği.',
      `stat({ label: 'Sayfalar', value: '204', change: '+8', color: 'success' })`],
    ['/tr/ui/steps', 'Adımlar', 'Numaralı bir akış, biteni bitmiş olarak işaretlenmiş.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Kurulum', 'Derleme'] }))`],
    ['/tr/ui/timeline', 'Zaman çizelgesi', 'Bir çizgi boyunca sırayla girdiler.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Bölümler', color: 'primary' }] }))`],
    ['/tr/ui/mockup', 'Maket', 'Bir tarayıcı, pencere, telefon ya da uçbirim içinde ekran görüntüsü.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Biçimlendirme', [
    ['/tr/ui/theming', 'Temalar', 'Her renk, yarıçap ve yazı tipi, tek bir çağrıdan.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** Tek bir galeri kartı. Önizleme etkisizdir, ad ise gerilmiş bir bağlantıdır. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * Çapa değil div: bu önizlemeler gerçek düğmeler ve girdiler içerir ve
     * etkileşimli içerik bir bağlantının içine yuvalanamaz. Bunun yerine
     * adın çapası bütün kartın üzerine gerilir ve `inert`, tanıtım
     * denetimlerini sekme sırasından ve erişilebilirlik ağacından çıkarır.
     */
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — sitelo için bileşenler',
    description:
      'sitelo için bir bileşen kitaplığı: HTML döndüren fonksiyonlar olarak düğmeler, kartlar, formlar, tablolar ve kipler.',
    activeHref: '/tr/ui',
    children: [
      p(
        'sitelo-ui, sitelo için bir bileşen kitaplığıdır. Her bileşen bir HTML dizesi döndüren bir fonksiyondur, bu yüzden hâlihazırda yazdığınız sayfanın içine doğrudan yerleşir — derleyici yok, çalışma zamanı yok, hidrasyon yok.',
      ),
      p(
        'Bu bölümdeki her örnek, çevresindeki sayfayı işleyen derlemenin aynısı tarafından işlenir. Gördüğünüz şey, altındaki kodun ürettiği şeydir ve bu sitenin açık ile koyu temalarını izler, çünkü sitelo-ui belgelerin okuduğu ',
        code('data-theme'),
        ' özniteliğinin aynısını okur.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Kurulum'),
      p(
        'İki satır: bileşenleri içe aktarın ve head içine ',
        code('styles()'),
        ' koyun. ',
        a({ href: '/tr/docs/ui' }, 'Belgelerdeki Bileşenler sayfası'),
        ' kurulumu, temaları, çağırma kuralını ve isteğe bağlı istemci çalışma zamanını kapsar ve her dışa aktarımı tek bir tabloda listeler.',
      ),
      p(
        'Depodaki ',
        code('examples/ui'),
        ' dizini bütün kümeyi tek bir sayfada işler.',
      ),

      h2('Ekstralar'),
      p(
        'Her şey tek bir stil sayfasına ait değildir. Dokulu ve süslü olanlar — başlangıç olarak bir film greni — her bileşenin kendi sayfasını getirdiği ikinci bir giriş noktası olan ',
        a({ href: '/ui-extras' }, 'sitelo UI ekstralarında'),
        ' yaşar, böylece bir sayfa yalnızca kullandığını bağlar.',
      ),
    ],
  })
