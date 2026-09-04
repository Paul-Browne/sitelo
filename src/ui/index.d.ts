/**
 * Type definitions for sitelo-ui.
 *
 * Component props are open: anything a component does not name falls
 * through to the rendered element as an HTML attribute, so `id`,
 * `data-*` and `aria-*` type-check without being enumerated here.
 */

export type Child = string | number | boolean | null | undefined | Child[]

/** A props object followed by children, or children alone. */
export type Args<P> = [props?: P, ...children: Child[]] | Child[]

export type Color = 'primary' | 'neutral' | 'success' | 'warning' | 'danger'
export type Size = 'sm' | 'md' | 'lg'

/** A spacing token, a multiple of `--su-space-unit`, or a CSS length. */
export type Space = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | number | (string & {})

export interface BaseProps {
  class?: string
  style?: string
  id?: string
  [attribute: string]: unknown
}

/* -------------------------------------------------------------- *
 * Styles
 * -------------------------------------------------------------- */

export interface StyleOptions {
  /** Strip comments and whitespace. Default `true`. */
  minify?: boolean
  /** CSP nonce for the emitted `<style>`. */
  nonce?: string
}

/** The stylesheet as a `<style>` element, for `head()`. */
export function styles(options?: StyleOptions): string

/** The stylesheet as raw CSS. */
export function stylesheet(options?: { minify?: boolean }): string

export interface ThemeOptions {
  /** Scope the overrides. Default `':root'`. */
  selector?: string
  /** Overrides applied only in dark mode. */
  dark?: Record<string, unknown>
  nonce?: string
}

/**
 * Override design tokens. Keys are camelCase token names
 * (`radiusMd` → `--su-radius-md`), a palette object
 * (`{ primary: { base, hover, fg } }`), or a literal `--custom-property`.
 */
export function theme(tokens?: Record<string, unknown>, options?: ThemeOptions): string

/** Blocking script that applies a stored theme before the first paint. */
export function themeScript(options?: { nonce?: string }): string

/* -------------------------------------------------------------- *
 * Layout
 * -------------------------------------------------------------- */

export interface ContainerProps extends BaseProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Raw max-width, overriding `size`. */
  width?: string
  gutter?: Space
  as?: string
}

export function container(...args: Args<ContainerProps>): string

export interface StackProps extends BaseProps {
  direction?: 'row' | 'column'
  gap?: Space
  align?: string
  justify?: string
  wrap?: boolean | string
  inline?: boolean
  as?: string
}

export function stack(...args: Args<StackProps>): string

export interface GridProps extends BaseProps {
  /** Fixed track count, or a raw `grid-template-columns` value. */
  columns?: number | string
  /** Minimum track width when auto-fitting. Default `16rem`. */
  min?: string
  gap?: Space
  align?: string
  as?: string
}

export function grid(...args: Args<GridProps>): string

export interface DividerProps extends BaseProps {
  orientation?: 'horizontal' | 'vertical'
  spacing?: Space
}

export function divider(...args: Args<DividerProps>): string

export interface CardProps extends BaseProps {
  variant?: 'outlined' | 'elevated' | 'flat'
  /** Renders the card as a link. */
  href?: string
  padding?: Space
}

export function card(...args: Args<CardProps>): string

export interface CardHeaderProps extends BaseProps {
  title?: Child
  subtitle?: Child
}

export function cardHeader(...args: Args<CardHeaderProps>): string
export function cardTitle(...args: Args<BaseProps & { as?: string }>): string
export function cardSubtitle(...args: Args<BaseProps>): string
export function cardBody(...args: Args<BaseProps>): string
export function cardFooter(...args: Args<BaseProps & { divided?: boolean }>): string
export function cardMedia(props?: BaseProps & { src?: string; alt?: string; ratio?: string }): string

export interface AspectRatioProps extends BaseProps {
  /** Any CSS aspect-ratio value. Default `16 / 9`. */
  ratio?: string
  as?: string
}

/** Hold a box at a fixed ratio; the child fills and is cropped. */
export function aspectRatio(...args: Args<AspectRatioProps>): string

/* -------------------------------------------------------------- *
 * Typography
 * -------------------------------------------------------------- */

export type TextVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'lead' | 'body' | 'small' | 'caption' | 'overline'

export interface TextProps extends BaseProps {
  variant?: TextVariant
  tone?: 'default' | 'muted' | 'subtle'
  align?: 'start' | 'center' | 'end'
  truncate?: boolean
  /** Clamp to this many lines. */
  lines?: number
  as?: string
}

export function text(...args: Args<TextProps>): string

export interface HeadingProps extends BaseProps {
  /** Outline level, 1–6. Default `2`. */
  level?: number
  /** Visual size, when it should differ from `level`. */
  size?: TextVariant
}

export function heading(...args: Args<HeadingProps>): string

export interface LinkProps extends BaseProps {
  href?: string
  color?: Color
  /** Inherit the surrounding color until hovered. */
  subtle?: boolean
  /** Adds `target="_blank"` and the matching `rel`. */
  external?: boolean
}

export function link(...args: Args<LinkProps>): string
export const textLink: typeof link

export interface CodeProps extends BaseProps {
  /**
   * Literal code. Escaped, so tags are shown rather than built — use
   * this for samples. Children still render as HTML, for output that
   * has already been syntax-highlighted.
   */
  text?: string
}

export function code(...args: Args<CodeProps>): string
export const inlineCode: typeof code
export function kbd(...args: Args<BaseProps>): string
export function visuallyHidden(...args: Args<BaseProps>): string

export interface ProseProps extends BaseProps {
  size?: Size
  as?: string
}

/** Style raw HTML from a Markdown renderer or a CMS. */
export function prose(...args: Args<ProseProps>): string

/* -------------------------------------------------------------- *
 * Inputs
 * -------------------------------------------------------------- */

export interface ButtonProps extends BaseProps {
  variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'link'
  color?: Color
  size?: Size
  /** Renders an `<a>` instead of a `<button>`. */
  href?: string
  startIcon?: Child
  endIcon?: Child
  loading?: boolean
  disabled?: boolean
  /** Full width. */
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function button(...args: Args<ButtonProps>): string

export interface IconButtonProps extends ButtonProps {
  /** Accessible name. Required — the icon cannot provide one. */
  label: string
  icon?: Child
}

export function iconButton(props: IconButtonProps): string
export function buttonGroup(...args: Args<BaseProps & { label?: string }>): string

export interface FieldProps extends BaseProps {
  label?: Child
  help?: Child
  error?: Child | false
  required?: boolean
  /** Id of the control this labels. */
  for?: string
}

export function field(...args: Args<FieldProps>): string

export interface InputProps extends BaseProps {
  type?: string
  size?: Size
  name?: string
  value?: string | number
  placeholder?: string
  startAdornment?: Child
  endAdornment?: Child
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export function input(props?: InputProps): string
export const textInput: typeof input

export interface TextareaProps extends BaseProps {
  size?: Size
  rows?: number
  name?: string
  value?: string
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export function textarea(props?: TextareaProps): string

export type SelectOption =
  | string
  | number
  | { value?: string | number; label?: Child; disabled?: boolean }
  | { label?: string; options: SelectOption[] }

export interface SelectProps extends BaseProps {
  options?: SelectOption[]
  value?: string | number
  /** Disabled first option, selected when `value` is absent. */
  placeholder?: string
  size?: Size
  name?: string
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export function select(...args: Args<SelectProps>): string

/** A control wrapped in its label, help text and error message. */
export type LabelledProps<P> = P & {
  label?: Child
  help?: Child
  error?: Child | false
  required?: boolean
  /** Class for the wrapping field, not the control. */
  fieldClass?: string
}

export function textField(props?: LabelledProps<InputProps>): string
export function textareaField(props?: LabelledProps<TextareaProps>): string
export function selectField(props?: LabelledProps<SelectProps>): string

export interface CheckProps extends BaseProps {
  label?: Child
  color?: Color
  name?: string
  value?: string | number
  checked?: boolean
  disabled?: boolean
}

export function checkbox(props?: CheckProps): string
export function radio(props?: CheckProps): string

/** On/off switch. Named `toggle` because `switch` is a reserved word. */
export function toggle(props?: CheckProps): string

export interface ChoiceGroupProps extends BaseProps {
  legend?: Child
  name?: string
  options?: (string | number | { value: string | number; label?: Child; disabled?: boolean })[]
  type?: 'radio' | 'checkbox'
  value?: string | number | (string | number)[]
  help?: Child
  direction?: 'row' | 'column'
  as?: string
}

export function choiceGroup(...args: Args<ChoiceGroupProps>): string

export interface SliderProps extends BaseProps {
  min?: number | string
  max?: number | string
  step?: number | string
  value?: number | string
  /** Show the build-time value beside the track. */
  showValue?: boolean
  color?: Color
  name?: string
  invalid?: boolean
  disabled?: boolean
}

export function slider(props?: SliderProps): string
export function sliderField(props?: LabelledProps<SliderProps>): string

export interface ToggleButtonProps extends BaseProps {
  /** Sets aria-pressed. There is no script behind it. */
  pressed?: boolean
  variant?: 'outline' | 'ghost' | 'soft'
  size?: Size
  disabled?: boolean
}

export function toggleButton(...args: Args<ToggleButtonProps>): string

export interface ToggleGroupItem {
  value?: string | number
  label?: Child
  /** Renders a link marked with aria-current instead of a pressed button. */
  href?: string
  disabled?: boolean
}

export interface ToggleGroupProps extends BaseProps {
  items?: (ToggleGroupItem | string | number)[]
  /** Which item is on. An array when several can be. */
  value?: string | number | (string | number)[]
  label?: string
  size?: Size
  variant?: ToggleButtonProps['variant']
}

export function toggleGroup(...args: Args<ToggleGroupProps>): string

/* -------------------------------------------------------------- *
 * Data display
 * -------------------------------------------------------------- */

export interface AvatarProps extends BaseProps {
  src?: string
  alt?: string
  /** Falls back to initials when there is no `src`. */
  name?: string
  size?: Size
  square?: boolean
  color?: Color
}

export function avatar(...args: Args<AvatarProps>): string
export function avatarGroup(...args: Args<BaseProps & { max?: number; size?: Size }>): string

export interface BadgeProps extends BaseProps {
  content?: string | number
  color?: Color
  dot?: boolean
  /** Counts above this render as `n+`. Default `99`. */
  max?: number
  /** Accessible name for the badge itself. */
  label?: string
}

export function badge(...args: Args<BadgeProps>): string

export interface ChipProps extends BaseProps {
  color?: Color
  variant?: 'soft' | 'outline' | 'solid'
  size?: Size
  href?: string
  dot?: boolean
  as?: string
}

export function chip(...args: Args<ChipProps>): string

export interface TooltipProps extends BaseProps {
  content?: string
  placement?: 'top' | 'bottom'
  /** Also expose the text to screen readers. */
  label?: boolean
}

export function tooltip(...args: Args<TooltipProps>): string

export interface TableColumn<Row = any> {
  key?: string
  header?: Child
  align?: 'start' | 'center' | 'end'
  render?: (row: Row) => Child
}

export interface TableProps<Row = any> extends BaseProps {
  columns?: TableColumn<Row>[]
  rows?: Row[]
  caption?: Child
  striped?: boolean
  hover?: boolean
  dense?: boolean
}

export function table<Row = any>(...args: Args<TableProps<Row>>): string
export const dataTable: typeof table

export function list(...args: Args<BaseProps & { plain?: boolean; as?: string }>): string

export interface ListItemProps extends BaseProps {
  title?: Child
  description?: Child
  start?: Child
  end?: Child
  href?: string
  interactive?: boolean
  as?: string
}

export function listItem(...args: Args<ListItemProps>): string

export interface FigureProps extends BaseProps {
  src?: string
  alt?: string
  caption?: Child
  /** Holds the space before the image loads. */
  ratio?: string
}

export function figure(...args: Args<FigureProps>): string

/* -------------------------------------------------------------- *
 * Feedback
 * -------------------------------------------------------------- */

export interface AlertProps extends BaseProps {
  color?: Color
  variant?: 'soft' | 'outline' | 'solid'
  title?: Child
  /** Custom icon markup, or `false` for none. */
  icon?: Child | false
  /** Adds a close button; needs `sitelo/ui/client`. */
  dismissible?: boolean
  dismissLabel?: string
}

export function alert(...args: Args<AlertProps>): string

export interface ProgressProps extends BaseProps {
  /** Omit for the indeterminate animation. */
  value?: number
  max?: number
  color?: Color
  label?: Child
  showValue?: boolean
  height?: Space
}

export function progress(props?: ProgressProps): string
export const progressBar: typeof progress

export function spinner(props?: BaseProps & { size?: Size; label?: string }): string

export interface SkeletonProps extends BaseProps {
  variant?: 'rect' | 'text' | 'circle'
  width?: string
  height?: string
  /** Render this many text lines, the last one short. */
  lines?: number
}

export function skeleton(props?: SkeletonProps): string

export interface EmptyProps extends BaseProps {
  icon?: Child
  title?: Child
  description?: Child
}

/** The state a list is in before it has anything in it. */
export function empty(...args: Args<EmptyProps>): string

/** Live region that `toast()` from `sitelo/ui/client` appends to. */
export function toasts(...args: Args<BaseProps>): string

/* -------------------------------------------------------------- *
 * Navigation
 * -------------------------------------------------------------- */

export interface BreadcrumbItem {
  label?: Child
  href?: string
}

export interface BreadcrumbsProps extends BaseProps {
  items?: (BreadcrumbItem | string)[]
  separator?: Child
  label?: string
}

export function breadcrumbs(...args: Args<BreadcrumbsProps>): string

export interface PaginationProps extends BaseProps {
  page?: number
  count?: number
  /** Page number to URL. Without it, pages render as buttons. */
  href?: (page: number) => string
  /** Pages shown either side of the current one. Default `1`. */
  siblings?: number
  color?: Color
  label?: string
  previousLabel?: Child
  nextLabel?: Child
}

export function pagination(props?: PaginationProps): string

export interface TabItem {
  id?: string
  label?: Child
  /** Link form: one page per tab, no script. */
  href?: string
  /** Panel form: swaps in place; needs `sitelo/ui/client`. */
  panel?: Child
  active?: boolean
  disabled?: boolean
}

export interface TabsProps extends BaseProps {
  items?: (TabItem | string)[]
  /** Id of the active item. */
  value?: string
  variant?: 'underline' | 'pills'
  color?: Color
  label?: string
}

export function tabs(...args: Args<TabsProps>): string

export interface AppBarProps extends BaseProps {
  brand?: Child
  /** Where the brand links to. Default `'/'`. */
  href?: string
  sticky?: boolean
  blur?: boolean
  as?: string
}

export function appBar(...args: Args<AppBarProps>): string
export function appBarNav(...args: Args<BaseProps>): string
export function appBarSpacer(props?: BaseProps): string
export function appBarActions(...args: Args<BaseProps>): string
export function navLink(...args: Args<BaseProps & { href?: string; current?: boolean; color?: Color }>): string

/** Light/dark toggle. Needs `sitelo/ui/client` and `themeScript()`. */
export function themeToggle(props?: BaseProps & { label?: string; variant?: ButtonProps['variant']; color?: Color }): string

/* -------------------------------------------------------------- *
 * Overlays
 * -------------------------------------------------------------- */

export interface ModalProps extends BaseProps {
  /** Required: what a trigger's `popovertarget` points at. */
  id: string
  title?: Child
  size?: Size
  footer?: Child
  closable?: boolean
  closeLabel?: string
}

export function modal(...args: Args<ModalProps>): string
export function closeButton(props?: BaseProps & { target?: string; label?: string }): string

export interface DrawerProps extends BaseProps {
  id: string
  title?: Child
  side?: 'start' | 'end'
  width?: string
  closable?: boolean
  closeLabel?: string
}

export function drawer(...args: Args<DrawerProps>): string

export interface MenuProps extends BaseProps {
  /** Visible label. The `<summary>` is the trigger, so do not pass a `button()`. */
  trigger?: Child
  /** Markup placed before the label. */
  icon?: Child
  /** Accessible name — required when there is an icon and no `trigger`. */
  label?: string
  variant?: ButtonProps['variant']
  color?: Color
  size?: Size
  align?: 'start' | 'end'
  /** Extra classes for the trigger, rather than the wrapping details. */
  triggerClass?: string
}

export function menu(...args: Args<MenuProps>): string
export function menuItem(...args: Args<BaseProps & { href?: string; icon?: Child; as?: string }>): string
export function menuSeparator(props?: BaseProps): string

export interface AccordionItemData {
  title?: Child
  content?: Child
  open?: boolean
}

export interface AccordionProps extends BaseProps {
  items?: (AccordionItemData | string)[]
  /** Shared name makes the sections mutually exclusive. */
  name?: string
}

export function accordion(...args: Args<AccordionProps>): string
export function accordionItem(...args: Args<BaseProps & { title?: Child; open?: boolean; name?: string }>): string

export interface CollapsibleProps extends BaseProps {
  /** Trigger content. Text and icons only — a summary is already interactive. */
  trigger?: Child
  open?: boolean
}

export function collapsible(...args: Args<CollapsibleProps>): string

/* -------------------------------------------------------------- *
 * Sections
 * -------------------------------------------------------------- */

export interface HeroProps extends BaseProps {
  /** Small line above the title. */
  eyebrow?: Child
  title?: Child
  description?: Child
  /** Placed beside the text on a wide screen, above it on a narrow one. */
  media?: Child
  align?: 'center' | 'start'
  /** Heading level for the title. Default `1` — lower it for a mid-page hero. */
  level?: number
  as?: string
}

/** The top of a landing page. Children are the action row. */
export function hero(...args: Args<HeroProps>): string

export interface FooterProps extends BaseProps {
  /** A raw grid-template-columns value; auto-fits by default. */
  columns?: string
  as?: string
}

/** Site footer. Also exported as `siteFooter`, to sit beside `<footer>`. */
export function footer(...args: Args<FooterProps>): string
export const siteFooter: typeof footer

export function footerColumn(...args: Args<BaseProps & { title?: Child }>): string
export function footerBottom(...args: Args<BaseProps>): string

export interface StatProps extends BaseProps {
  label?: Child
  value?: Child
  /** A delta, coloured by `color`. */
  change?: Child
  color?: Color
  icon?: Child
  help?: Child
}

export function stat(props?: StatProps): string
export function statGroup(...args: Args<BaseProps & { columns?: string }>): string

export interface StepItem {
  title?: Child
  description?: Child
}

export interface StepsProps extends BaseProps {
  items?: (StepItem | string)[]
  /** Index of the step in progress. Earlier ones are complete. */
  current?: number
  direction?: 'horizontal' | 'vertical'
  label?: string
}

export function steps(props?: StepsProps): string

export interface TimelineItemProps extends BaseProps {
  title?: Child
  description?: Child
  time?: Child
  icon?: Child
  color?: Color
}

export function timeline(...args: Args<BaseProps & { items?: TimelineItemProps[] }>): string
export function timelineItem(...args: Args<TimelineItemProps>): string

export interface MockupProps extends BaseProps {
  variant?: 'browser' | 'window' | 'phone' | 'code'
  /** Shown in the address bar. Browser variant only. */
  url?: string
  size?: Size
}

/** A screenshot in a frame. The frame is decoration. */
export function mockup(...args: Args<MockupProps>): string

declare const ui: {
  [name: string]: (...args: any[]) => string
}

export default ui
