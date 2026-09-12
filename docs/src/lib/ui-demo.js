import { br, div, em, fragment, span, strong } from 'javascript-to-html'
import * as ui from 'sitelo/ui'

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
 * Names the demo source can use bare. `default` is a reserved word and
 * cannot be a parameter, so it never reaches the evaluator.
 */
const SCOPE = [
  ...Object.keys(ui).filter((name) => name !== 'default'),
  ...Object.keys(ELEMENTS),
]
const VALUES = SCOPE.map((name) => ui[name] ?? ELEMENTS[name])

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
}

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
   * The grain sandbox: every prop as a control, a grain to watch, and
   * the call that would render it.
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
      ui.grain(
        { id: 'grain-sandbox', class: 'ui-sandbox-preview' },
        ui.text({ variant: 'lead', align: 'center' }, t.preview),
      ),
      div({ 'data-sandbox-code': '' }, codeBlock('', 'grain(…)', 'javascript')),
    )
  }

  /** What the sandbox needs in `<head>`: pass it as `extraHead`. */
  function grainSandboxHead() {
    return [
      `<link rel="stylesheet" href="${WEB_AWESOME}/styles/themes/default.css">`,
      `<script type="module" src="${WEB_AWESOME}/components/color-picker/color-picker.js"></script>`,
    ]
  }

  return { demo, propsTable, grainSandbox, grainSandboxHead }
}

const en = createUiDemo(DEFAULT_LOCALE)

export const demo = en.demo
export const propsTable = en.propsTable
export const grainSandbox = en.grainSandbox
export const grainSandboxHead = en.grainSandboxHead
