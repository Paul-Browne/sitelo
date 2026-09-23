import { br, div, em, fragment, iframe, span, strong } from 'javascript-to-html'
import * as ui from 'sitelo/ui'
import * as extras from 'sitelo/ui-extras'

import { createCodeHelpers } from './code.js'
import { DEFAULT_LOCALE } from './i18n.js'

/*
 * A few plain elements the demos need for scaffolding — a wrapper to
 * scroll inside, a fragment when a demo has two roots (a trigger and
 * the modal it opens). Only names that do not collide with a component
 * are here; `table` and `link`, for instance, stay the sitelo-ui ones.
 */
const ELEMENTS = { br, div, em, fragment, span, strong }

/*
 * Names the demo source can use bare: the core components, the extras
 * — one scope for both sections, since an extra's demo wraps core
 * components and nothing in either collides — and the scaffolding
 * above. `default` is a reserved word and cannot be a parameter, so it
 * never reaches the evaluator.
 */
const COMPONENTS = { ...ui, ...extras }
const SCOPE = [
  ...Object.keys(COMPONENTS).filter((name) => name !== 'default'),
  ...Object.keys(ELEMENTS),
]
const VALUES = SCOPE.map((name) => COMPONENTS[name] ?? ELEMENTS[name])

/**
 * Run a demo snippet and return its HTML.
 *
 * The snippet is evaluated rather than paired with a hand-written copy,
 * so what a page renders and what it prints cannot drift apart. This is
 * build-time only and the source is authored in this repository — no
 * visitor input reaches it.
 *
 * @param {string} source - An expression, or statements ending in `return`.
 * @returns {string}
 */
function run(source) {
  const body = /(^|\n)\s*return\s/.test(source) ? source : `return (${source})`

  try {
    return new Function(...SCOPE, body)(...VALUES)
  } catch (error) {
    throw new Error(`Demo failed to render:\n${source}\n\n${error.message}`, {
      cause: error,
    })
  }
}

/**
 * Render a snippet without showing its source — for the small previews
 * on the section's landing page.
 *
 * @param {string} source
 * @returns {string}
 */
export function preview(source) {
  return run(String(source).trim())
}

/**
 * Column headings for {@link createUiDemo}'s props table.
 *
 * A page whose table is not a list of props — the parts of a card, the
 * arguments to `toast()` — passes its own headings instead.
 */
const TABLE_HEADERS = {
  en: ['Prop', 'Type', 'Default', 'Description'],
  es: ['Prop', 'Tipo', 'Por defecto', 'Descripción'],
  fr: ['Prop', 'Type', 'Défaut', 'Description'],
  de: ['Prop', 'Typ', 'Standard', 'Beschreibung'],
  ru: ['Проп', 'Тип', 'По умолчанию', 'Описание'],
  zh: ['属性', '类型', '默认值', '说明'],
  pt: ['Prop', 'Tipo', 'Predefinição', 'Descrição'],
  it: ['Prop', 'Tipo', 'Predefinito', 'Descrizione'],
  pl: ['Prop', 'Typ', 'Domyślnie', 'Opis'],
  tr: ['Prop', 'Tür', 'Varsayılan', 'Açıklama'],
  id: ['Prop', 'Tipe', 'Bawaan', 'Deskripsi'],

}

/**
 * Control labels for the grain sandbox. `color` also carries the one
 * line of help the picker needs: it has no "none", so white stands in.
 */
const SANDBOX_LABELS = {
  en: { type: 'Type', frequency: 'Frequency', octaves: 'Octaves', seed: 'Seed', color: 'Colour', colorHelp: 'Transparent or white leaves it grey; alpha is how much.', opacity: 'Opacity', blend: 'Blend', background: 'Background', preview: 'Play with the controls.' },
  es: { type: 'Tipo', frequency: 'Frecuencia', octaves: 'Octavas', seed: 'Semilla', color: 'Color', colorHelp: 'Transparente o blanco lo deja gris; el alfa es cuánto.', opacity: 'Opacidad', blend: 'Mezcla', background: 'Fondo', preview: 'Juega con los controles.' },
  fr: { type: 'Type', frequency: 'Fréquence', octaves: 'Octaves', seed: 'Graine', color: 'Couleur', colorHelp: 'Transparent ou blanc le laisse gris ; l’alpha dit combien.', opacity: 'Opacité', blend: 'Fusion', background: 'Arrière-plan', preview: 'Jouez avec les réglages.' },
  de: { type: 'Art', frequency: 'Frequenz', octaves: 'Oktaven', seed: 'Seed', color: 'Farbe', colorHelp: 'Transparent oder Weiß lässt es grau; Alpha sagt, wie stark.', opacity: 'Deckkraft', blend: 'Mischen', background: 'Hintergrund', preview: 'Spielen Sie mit den Reglern.' },
  ru: { type: 'Тип', frequency: 'Частота', octaves: 'Октавы', seed: 'Зерно генератора', color: 'Цвет', colorHelp: 'Прозрачный или белый оставляет серым; альфа — насколько.', opacity: 'Непрозрачность', blend: 'Смешивание', background: 'Фон', preview: 'Покрутите ручки.' },
  zh: { type: '类型', frequency: '频率', octaves: '倍频', seed: '种子', color: '颜色', colorHelp: '透明或白色就是保持灰色；alpha 决定上多少。', opacity: '不透明度', blend: '混合', background: '背景', preview: '动动这些控件。' },
  pt: { type: 'Tipo', frequency: 'Frequência', octaves: 'Oitavas', seed: 'Semente', color: 'Cor', colorHelp: 'Transparente ou branco deixa-o cinzento; o alfa é o quanto.', opacity: 'Opacidade', blend: 'Mistura', background: 'Fundo', preview: 'Brinque com os controlos.' },
  it: { type: 'Tipo', frequency: 'Frequenza', octaves: 'Ottave', seed: 'Seme', color: 'Colore', colorHelp: 'Trasparente o bianco lo lascia grigio; l’alfa dice quanto.', opacity: 'Opacità', blend: 'Fusione', background: 'Sfondo', preview: 'Gioca con i controlli.' },
  pl: { type: 'Typ', frequency: 'Częstotliwość', octaves: 'Oktawy', seed: 'Ziarno', color: 'Kolor', colorHelp: 'Przezroczysty albo biały zostawia szary; alfa decyduje ile.', opacity: 'Krycie', blend: 'Mieszanie', background: 'Tło', preview: 'Pobaw się suwakami.' },
  tr: { type: 'Tür', frequency: 'Frekans', octaves: 'Oktavlar', seed: 'Tohum', color: 'Renk', colorHelp: 'Saydam ya da beyaz onu gri bırakır; alfa ne kadar olduğunu söyler.', opacity: 'Saydamsızlık', blend: 'Karışım', background: 'Arka plan', preview: 'Denetimlerle oynayın.' },
  id: { type: 'Tipe', frequency: 'Frekuensi', octaves: 'Oktaf', seed: 'Benih', color: 'Warna', colorHelp: 'Transparan atau putih membuatnya tetap abu-abu; alfa menentukan seberapa banyak.', opacity: 'Opasitas', blend: 'Pembauran', background: 'Latar', preview: 'Mainkan kontrolnya.' },

}

/**
 * Labels for {@link createUiDemo}'s preset preview: the frame's own
 * title, and the words on the controls inside it.
 */
const PRESET_LABELS = {
  en: { frame: 'The components, restyled by the preset', button: 'Button', input: 'Input', dropdown: 'Dropdown', addUser: 'Add user', previous: 'Previous', next: 'Next', sound: 'Sound', sync: 'Sync', off: 'Off', on: 'On', share: 'Share', label: 'Label', search: 'Search', searchFor: 'Search for …', progress: 'Progress', slider: 'Slider', cardTitle: 'A card', cardBody: 'Raised out of the page it sits on.', solid: 'Solid', outline: 'Outline', ghost: 'Ghost', saved: 'Saved', savedBody: 'Your changes are live.' },
  es: { frame: 'Los componentes, con el estilo del preset', button: 'Botón', input: 'Campo', dropdown: 'Desplegable', addUser: 'Añadir usuario', previous: 'Anterior', next: 'Siguiente', sound: 'Sonido', sync: 'Sincronizar', off: 'Apagado', on: 'Encendido', share: 'Compartir', label: 'Etiqueta', search: 'Buscar', searchFor: 'Buscar…', progress: 'Progreso', slider: 'Control deslizante', cardTitle: 'Una tarjeta', cardBody: 'En relieve sobre la página en la que está.', solid: 'Sólido', outline: 'Contorno', ghost: 'Fantasma', saved: 'Guardado', savedBody: 'Tus cambios ya están publicados.' },
  fr: { frame: 'Les composants, restylés par le préréglage', button: 'Bouton', input: 'Champ', dropdown: 'Liste déroulante', addUser: 'Ajouter un utilisateur', previous: 'Précédent', next: 'Suivant', sound: 'Son', sync: 'Synchroniser', off: 'Désactivé', on: 'Activé', share: 'Partager', label: 'Étiquette', search: 'Rechercher', searchFor: 'Rechercher…', progress: 'Progression', slider: 'Curseur', cardTitle: 'Une carte', cardBody: 'En relief sur la page qui la porte.', solid: 'Plein', outline: 'Contour', ghost: 'Fantôme', saved: 'Enregistré', savedBody: 'Vos modifications sont en ligne.' },
  de: { frame: 'Die Komponenten, im Stil des Presets', button: 'Button', input: 'Eingabe', dropdown: 'Auswahl', addUser: 'Nutzer hinzufügen', previous: 'Zurück', next: 'Weiter', sound: 'Ton', sync: 'Synchronisieren', off: 'Aus', on: 'An', share: 'Teilen', label: 'Label', search: 'Suche', searchFor: 'Suchen nach …', progress: 'Fortschritt', slider: 'Schieberegler', cardTitle: 'Eine Karte', cardBody: 'Aus der Seite gehoben, auf der sie liegt.', solid: 'Gefüllt', outline: 'Umriss', ghost: 'Ghost', saved: 'Gespeichert', savedBody: 'Deine Änderungen sind live.' },
  ru: { frame: 'Компоненты в стиле пресета', button: 'Кнопка', input: 'Поле', dropdown: 'Список', addUser: 'Добавить пользователя', previous: 'Назад', next: 'Вперёд', sound: 'Звук', sync: 'Синхронизация', off: 'Выкл.', on: 'Вкл.', share: 'Поделиться', label: 'Метка', search: 'Поиск', searchFor: 'Искать…', progress: 'Прогресс', slider: 'Ползунок', cardTitle: 'Карточка', cardBody: 'Приподнята над страницей, на которой лежит.', solid: 'Заливка', outline: 'Контур', ghost: 'Призрак', saved: 'Сохранено', savedBody: 'Изменения уже на сайте.' },
  zh: { frame: '使用该预设重新设计的组件', button: '按钮', input: '输入框', dropdown: '下拉菜单', addUser: '添加用户', previous: '上一个', next: '下一个', sound: '声音', sync: '同步', off: '关', on: '开', share: '分享', label: '标签', search: '搜索', searchFor: '搜索…', progress: '进度', slider: '滑块', cardTitle: '一张卡片', cardBody: '从所在的页面上凸起。', solid: '实心', outline: '描边', ghost: '幽灵', saved: '已保存', savedBody: '你的更改已经上线。' },
  pt: { frame: 'Os componentes, com o estilo do preset', button: 'Botão', input: 'Campo', dropdown: 'Lista pendente', addUser: 'Adicionar utilizador', previous: 'Anterior', next: 'Seguinte', sound: 'Som', sync: 'Sincronizar', off: 'Desligado', on: 'Ligado', share: 'Partilhar', label: 'Etiqueta', search: 'Pesquisar', searchFor: 'Pesquisar…', progress: 'Progresso', slider: 'Controlo deslizante', cardTitle: 'Um cartão', cardBody: 'Em relevo sobre a página onde está.', solid: 'Sólido', outline: 'Contorno', ghost: 'Fantasma', saved: 'Guardado', savedBody: 'As suas alterações já estão publicadas.' },
  it: { frame: 'I componenti, con lo stile del preset', button: 'Pulsante', input: 'Campo', dropdown: 'Menu a tendina', addUser: 'Aggiungi utente', previous: 'Precedente', next: 'Successivo', sound: 'Suono', sync: 'Sincronizza', off: 'Spento', on: 'Acceso', share: 'Condividi', label: 'Etichetta', search: 'Cerca', searchFor: 'Cerca…', progress: 'Avanzamento', slider: 'Cursore', cardTitle: 'Una card', cardBody: 'In rilievo sulla pagina che la ospita.', solid: 'Pieno', outline: 'Contorno', ghost: 'Ghost', saved: 'Salvato', savedBody: 'Le modifiche sono online.' },
  pl: { frame: 'Komponenty w stylu presetu', button: 'Przycisk', input: 'Pole', dropdown: 'Lista rozwijana', addUser: 'Dodaj użytkownika', previous: 'Poprzedni', next: 'Następny', sound: 'Dźwięk', sync: 'Synchronizacja', off: 'Wył.', on: 'Wł.', share: 'Udostępnij', label: 'Etykieta', search: 'Szukaj', searchFor: 'Szukaj…', progress: 'Postęp', slider: 'Suwak', cardTitle: 'Karta', cardBody: 'Wypukła nad stroną, na której leży.', solid: 'Pełny', outline: 'Kontur', ghost: 'Duch', saved: 'Zapisano', savedBody: 'Zmiany są już widoczne.' },
  tr: { frame: 'Bileşenler, hazır ayarla yeniden biçimlenmiş', button: 'Düğme', input: 'Alan', dropdown: 'Açılır liste', addUser: 'Kullanıcı ekle', previous: 'Önceki', next: 'Sonraki', sound: 'Ses', sync: 'Eşitle', off: 'Kapalı', on: 'Açık', share: 'Paylaş', label: 'Etiket', search: 'Ara', searchFor: 'Ara…', progress: 'İlerleme', slider: 'Kaydırıcı', cardTitle: 'Bir kart', cardBody: 'Üzerinde durduğu sayfadan kabarık.', solid: 'Dolgulu', outline: 'Çerçeveli', ghost: 'Hayalet', saved: 'Kaydedildi', savedBody: 'Değişiklikleriniz yayında.' },
  id: { frame: 'Komponen, dengan gaya preset', button: 'Tombol', input: 'Isian', dropdown: 'Daftar pilihan', addUser: 'Tambah pengguna', previous: 'Sebelumnya', next: 'Berikutnya', sound: 'Suara', sync: 'Sinkron', off: 'Mati', on: 'Nyala', share: 'Bagikan', label: 'Label', search: 'Cari', searchFor: 'Cari…', progress: 'Kemajuan', slider: 'Penggeser', cardTitle: 'Sebuah kartu', cardBody: 'Menonjol dari halaman tempatnya berada.', solid: 'Padat', outline: 'Garis tepi', ghost: 'Hantu', saved: 'Tersimpan', savedBody: 'Perubahan Anda sudah tayang.' },
}

/*
 * The preset preview's own document, before the gallery: a sync from the
 * page around it, then a height that follows the content.
 *
 * The docs toggle writes `data-theme` on the outer <html>, and a frame is
 * a document of its own that never sees it — so the frame copies both
 * attributes across, now and whenever they change, before its body is
 * painted. Same origin, since a `srcdoc` document is the page's own.
 */
const PRESET_SYNC =
  "(function(){var r=document.documentElement,h=parent.document.documentElement,n=['data-theme','data-su-theme'];" +
  'function s(){n.forEach(function(a){var v=h.getAttribute(a);v==null?r.removeAttribute(a):r.setAttribute(a,v)})}' +
  's();new MutationObserver(s).observe(h,{attributes:true,attributeFilter:n})})()'

/*
 * Sized to its content, which changes with the frame's width: the grid
 * wraps. The attribute height on the element is what a reader without
 * script gets.
 */
const PRESET_FIT =
  "(function(){var f=frameElement;function z(){f.style.height=document.documentElement.scrollHeight+'px'}" +
  'new ResizeObserver(z).observe(document.body)})()'

/** The preview's own few rules: a ground for the preset to sit on. */
const PRESET_PAGE_CSS =
  'body{margin:0;padding:2rem 1.5rem;background:var(--su-bg);color:var(--su-text);font-family:var(--su-font-sans)}' +
  '.preset-tile{aspect-ratio:1;max-width:11rem;display:grid;place-items:center}' +
  '.preset-glyph{font-size:4.5rem;font-weight:600;line-height:1;color:var(--su-primary)}'

/**
 * The colour pickers are Web Awesome's `<wa-color-picker>`, for the one
 * thing a native `<input type="color">` cannot do: alpha. Loaded from
 * their CDN on this page alone — the theme sheet the component needs,
 * and the component itself rather than the autoloader, so nothing is
 * fetched on speculation.
 */
const WEB_AWESOME = 'https://ka-f.webawesome.com/webawesome@3.12.0'

/** Every `mix-blend-mode`, in the order the spec lists them. */
const BLEND_MODES = [
  'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn',
  'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity',
]

/** Demo helpers bound to a locale. */
export function createUiDemo(lang = DEFAULT_LOCALE) {
  const { code, codeBlock } = createCodeHelpers(lang)
  const defaultHeaders = TABLE_HEADERS[lang] ?? TABLE_HEADERS[DEFAULT_LOCALE]
  const sandboxLabels = SANDBOX_LABELS[lang] ?? SANDBOX_LABELS[DEFAULT_LOCALE]
  const presetLabels = PRESET_LABELS[lang] ?? PRESET_LABELS[DEFAULT_LOCALE]

  /**
   * A live example above the code that produced it.
   *
   * @param {string} source
   * @param {object} [options]
   * @param {string} [options.label] - Corner label on the code block.
   * @param {'center' | 'start' | 'stretch'} [options.align]
   * @returns {string}
   */
  function demo(source, { label = '', align = 'center' } = {}) {
    const snippet = String(source).replace(/^\n+|\s+$/g, '')

    return div(
      { class: 'ui-demo' },
      div(
        {
          class: `ui-demo-preview ui-demo-preview--${align}`,
          // The demos are illustrations of the code below them; a screen
          // reader gets nothing from a second, unlabelled copy of every
          // control on the page.
          'data-pagefind-ignore': '',
        },
        run(snippet),
      ),
      codeBlock(label, snippet, 'javascript'),
    )
  }

  /**
   * Descriptions are prose, and prose in these tables mentions tags —
   * `<a>`, `<button>`. javascript-to-html passes children through
   * verbatim, so without this they would be parsed as markup and
   * silently disappear from the table.
   *
   * @param {unknown} value
   * @returns {unknown}
   */
  const escapeText = (value) =>
    typeof value === 'string'
      ? value
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
      : value

  /**
   * An API table: name, type, default, description.
   *
   * `table()` from sitelo/ui, which brings the frame — the rule, the
   * radius and the horizontal scroll the widest of these needs on a
   * phone — and its `columns` API, which puts the `code()` wrapping of
   * a cell next to the heading it belongs under rather than three rows
   * away in a `map`. The `docs-table` classes stay on top of it for the
   * two things this site does differently: uppercase monospace headings,
   * and a last column that wraps while the rest do not.
   *
   * @param {[string, string, string, string][]} rows
   * @param {object} [options]
   * @param {[string, string, string, string]} [options.headers]
   * @returns {string}
   */
  function propsTable(rows, { headers = defaultHeaders } = {}) {
    return ui.table({
      class: 'docs-table docs-table--wrap-last',
      columns: [
        { header: headers[0], render: (row) => code(row.name) },
        { header: headers[1], render: (row) => (row.type ? code(row.type) : '') },
        {
          header: headers[2],
          render: (row) => (row.fallback ? code(row.fallback) : '—'),
        },
        { header: headers[3], render: (row) => escapeText(row.description) },
      ],
      rows: rows.map(([name, type, fallback, description]) => ({
        name,
        type,
        fallback,
        description,
      })),
    })
  }

  /**
   * The grain sandbox on `/ui-extras/grain`: every prop as a control, a
   * grain to watch, and the call that would render it.
   *
   * The server draws the resting state — the theme's own opacity is not
   * known until the page loads, so `main.js` reads it off the grain and
   * sets the slider before anyone touches it. Frequency is offered as
   * 0–2000 for a thousandth of the real value: a range input steps in
   * integers, and `0.57` is not something a thumb can land on.
   *
   * @returns {string}
   */
  function grainSandbox() {
    const t = sandboxLabels
    const field = (name, control) =>
      div({ class: 'ui-sandbox-field', 'data-sandbox': name }, control)

    /*
     * A Web Awesome picker inside sitelo-ui's own field, so it lines up
     * with the sliders: the label and help are the field's, and the
     * `for` reaches the picker because it is form-associated — so the
     * picker gets no label of its own, which it would render. `opacity`
     * makes the value `#rrggbbaa`, which is what `color` reads as how
     * much tint. The panel is pared down to the grid and the two sliders
     * in styles.css.
     */
    const colorPicker = ({ id, label, help, value }) =>
      ui.field(
        { label, help, for: id },
        `<wa-color-picker id="${id}" value="${value}" opacity format="hex" without-format-toggle></wa-color-picker>`,
      )

    return div(
      { class: 'ui-sandbox', 'data-grain-sandbox': '' },
      div(
        { class: 'ui-sandbox-controls' },
        // Two to a row: the dropdowns together, then the sliders, then the
        // two colours — the second is the surface behind the grain, which
        // half the blend modes are really a question about.
        field('type', ui.selectField({
          label: t.type, name: 'sandbox-type', size: 'sm',
          options: ['fractal', 'turbulence'], value: 'fractal',
        })),
        field('blend', ui.selectField({
          label: t.blend, name: 'sandbox-blend', size: 'sm', options: BLEND_MODES, value: 'normal',
        })),
        field('frequency', ui.sliderField({
          label: t.frequency, name: 'sandbox-frequency', min: 0, max: 2, value: 0.57, step: 0.001, showValue: true,
        })),
        field('octaves', ui.sliderField({
          label: t.octaves, name: 'sandbox-octaves', min: 1, max: 8, value: 3, showValue: true,
        })),
        field('seed', ui.sliderField({
          label: t.seed, name: 'sandbox-seed', min: 0, max: 500, value: 0, showValue: true,
        })),
        field('opacity', ui.sliderField({
          label: t.opacity, name: 'sandbox-opacity', min: 0, max: 1, value: 0.16, step: 0.01, showValue: true,
        })),
        field('color', colorPicker({ id: 'sandbox-color', label: t.color, help: t.colorHelp, value: '#ffffffff' })),
        // The server cannot know the theme's surface; main.js reads it off
        // the preview and sets the picker, as it does the opacity.
        field('background', colorPicker({ id: 'sandbox-background', label: t.background, value: '#ffffffff' })),
      ),
      extras.grain(
        { id: 'grain-sandbox', class: 'ui-sandbox-preview' },
        ui.text({ variant: 'lead', align: 'center' }, t.preview),
      ),
      div({ 'data-sandbox-code': '' }, codeBlock('', 'grain(…)', 'javascript')),
    )
  }

  /**
   * A preset, shown on the components it restyles.
   *
   * In a frame rather than a {@link demo}, because a preset cannot be
   * scoped: it sets its tokens on `:root` and restyles every `su-` class
   * it names, so dropped into this page it would restyle the docs around
   * it too. A frame is a document of its own, and the preset gets all of
   * it — ground included — exactly as a site that picked it would.
   *
   * The core sheet is linked, at the same URL every docs page already
   * loads, so it comes out of the cache. The preset is inlined: the
   * plugin copies a sheet into the build when a page links it, and a
   * `<link>` inside `srcdoc` is escaped text it rightly passes over —
   * linked here, it would work in dev and 404 in production.
   *
   * @param {string} preset
   * @returns {string}
   */
  function presetPreview(preset) {
    const t = presetLabels
    const soft = { variant: 'soft', color: 'neutral' }
    // `stylesheet({ preset })` is the core and then the preset, and the
    // core is already on the page — so only the part after it is new.
    const presetCss = ui.stylesheet({ preset }).slice(ui.stylesheet().length)

    const gallery = ui.stack(
      { gap: 'xl' },
      ui.grid(
        { min: '12rem', gap: 'xl', align: 'start' },
        ui.card({ class: 'preset-tile' }, span({ class: 'preset-glyph', 'aria-hidden': 'true' }, 'Aa')),
        ui.stack(
          { gap: 'lg' },
          ui.button({ ...soft, block: true }, t.button),
          ui.input({ 'aria-label': t.input, placeholder: t.input }),
          ui.select({ 'aria-label': t.dropdown, options: [t.dropdown] }),
          ui.button({ ...soft, block: true, startIcon: ui.icon('user') }, t.addUser),
        ),
        ui.stack(
          { gap: 'lg' },
          ui.stack(
            { direction: 'row', gap: 'md', align: 'center', wrap: true },
            ui.iconButton({ ...soft, icon: ui.icon('chevron-left'), label: t.previous }),
            ui.iconButton({ ...soft, icon: ui.icon('chevron-right'), label: t.next }),
            ui.toggle({ label: t.sound }),
          ),
          ui.stack(
            { direction: 'row', gap: 'md', align: 'center', wrap: true },
            ui.radio({ name: 'preset-radio', label: t.off }),
            ui.radio({ name: 'preset-radio', label: t.on, checked: true }),
            ui.toggle({ label: t.sync, checked: true }),
          ),
          ui.stack(
            { direction: 'row', gap: 'md', wrap: true },
            ui.button({ ...soft, endIcon: ui.icon('share') }, t.share),
            ui.button({ ...soft, startIcon: ui.icon('location') }, t.label),
          ),
        ),
      ),
      ui.input({ 'aria-label': t.search, placeholder: t.searchFor, startAdornment: ui.icon('search') }),
      ui.grid(
        { min: '16rem', gap: 'xl', align: 'start' },
        ui.stack(
          { gap: 'lg' },
          ui.progress({ value: 50, label: t.progress, showValue: true }),
          ui.sliderField({ label: t.slider, value: 50, showValue: true }),
          ui.alert({ color: 'success', title: t.saved }, t.savedBody),
        ),
        ui.card(
          ui.cardHeader(ui.cardTitle(t.cardTitle)),
          ui.cardBody(ui.text(t.cardBody)),
          ui.cardFooter(
            ui.button(t.solid),
            ui.button({ variant: 'outline' }, t.outline),
            ui.button({ variant: 'ghost' }, t.ghost),
          ),
        ),
      ),
    )

    const page =
      `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">` +
      `<title>${t.frame}</title><script>${PRESET_SYNC}</script>` +
      ui.styles() +
      `<style data-sitelo-ui-${preset}>${presetCss}</style><style>${PRESET_PAGE_CSS}</style>` +
      `</head><body>${gallery}<script>${PRESET_FIT}</script></body></html>`

    return iframe({
      class: 'ui-preset-frame',
      title: t.frame,
      /*
       * Escaped beyond the quotes javascript-to-html already escapes. Left
       * raw, the attribute is a second `<head>`, `</head>` and `</body>`
       * sitting ahead of the page's real ones, and anything that edits
       * HTML by finding the first of those — a dev server injecting its
       * client, a host injecting analytics — writes into the frame
       * instead. The browser decodes them back before parsing the frame.
       */
      srcdoc: page.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
      height: 720,
      loading: 'lazy',
      'data-pagefind-ignore': '',
    })
  }

  /** What the sandbox needs in `<head>`: pass it as `extraHead`. */
  function grainSandboxHead() {
    return [
      `<link rel="stylesheet" href="${WEB_AWESOME}/styles/themes/default.css">`,
      `<script type="module" src="${WEB_AWESOME}/components/color-picker/color-picker.js"></script>`,
    ]
  }

  return { demo, propsTable, presetPreview, grainSandbox, grainSandboxHead }
}

const en = createUiDemo(DEFAULT_LOCALE)

export const demo = en.demo
export const propsTable = en.propsTable
export const presetPreview = en.presetPreview
export const grainSandbox = en.grainSandbox
export const grainSandboxHead = en.grainSandboxHead
