/**
 * Code samples for the sitelo-ui page.
 *
 * Only the prose inside the samples is translated — the API is the same
 * in every locale.
 */
const T = {
  en: {
    mySite: 'My site',
    hello: 'Hello',
    leadCopy: 'A page built from components.',
    readDocs: 'Read the docs',
    routing: 'Routing',
    fileBased: 'File based',
    becomesAbout: 'src/about.ht.js becomes /about.',
    readMore: 'Read more',
    inlineComment: 'the whole sheet in the page — no request at all',
    themingComment: 'After styles(), so these win.',
    themeScriptComment: 'applies the stored choice before the first paint',
    anywhereComment: '…anywhere in the body',
    email: 'Email',
    neverShared: 'Never shared.',
    site: 'Site',
    notAUrl: 'Not a URL.',
    plan: 'Plan',
    free: 'Free',
    pro: 'Pro',
    save: 'Save',
    deleteEllipsis: 'Delete…',
    deletePage: 'Delete this page?',
    deleteWord: 'Delete',
    cannotUndo: 'This cannot be undone.',
    linkTabsComment: 'Link tabs: one page per tab, no script at all.',
    panelTabsComment: 'Panel tabs: swap in place, and fetch the code to do it themselves.',
    docsLabel: 'Docs',
    installLabel: 'Install',
    useLabel: 'Use',
    pageCol: 'Page',
    sizeCol: 'Size',
    statusCol: 'Status',
    failedWord: 'failed',
  },
  es: {
    mySite: 'Mi sitio',
    hello: 'Hola',
    leadCopy: 'Una página construida con componentes.',
    readDocs: 'Leer la documentación',
    routing: 'Rutas',
    fileBased: 'Basado en archivos',
    becomesAbout: 'src/about.ht.js pasa a ser /about.',
    readMore: 'Leer más',
    inlineComment: 'la hoja entera en la página, sin ninguna petición',
    themingComment: 'Después de styles(), para que estos ganen.',
    themeScriptComment: 'aplica la elección guardada antes del primer pintado',
    anywhereComment: '…en cualquier parte del body',
    email: 'Correo',
    neverShared: 'Nunca se comparte.',
    site: 'Sitio',
    notAUrl: 'No es una URL.',
    plan: 'Plan',
    free: 'Gratis',
    pro: 'Pro',
    save: 'Guardar',
    deleteEllipsis: 'Eliminar…',
    deletePage: '¿Eliminar esta página?',
    deleteWord: 'Eliminar',
    cannotUndo: 'Esto no se puede deshacer.',
    linkTabsComment: 'Pestañas de enlace: una página por pestaña, sin ningún script.',
    panelTabsComment: 'Pestañas con panel: cambian en el sitio y piden solas el código para hacerlo.',
    docsLabel: 'Docs',
    installLabel: 'Instalar',
    useLabel: 'Usar',
    pageCol: 'Página',
    sizeCol: 'Tamaño',
    statusCol: 'Estado',
    failedWord: 'falló',
  },
  fr: {
    mySite: 'Mon site',
    hello: 'Bonjour',
    leadCopy: 'Une page construite à partir de composants.',
    readDocs: 'Lire la documentation',
    routing: 'Routage',
    fileBased: 'Basé sur les fichiers',
    becomesAbout: 'src/about.ht.js devient /about.',
    readMore: 'En savoir plus',
    inlineComment: 'la feuille entière dans la page, sans aucune requête',
    themingComment: 'Après styles(), pour que ces valeurs l’emportent.',
    themeScriptComment: 'applique le choix enregistré avant le premier rendu',
    anywhereComment: '…n’importe où dans le body',
    email: 'E-mail',
    neverShared: 'Jamais partagé.',
    site: 'Site',
    notAUrl: 'Ce n’est pas une URL.',
    plan: 'Formule',
    free: 'Gratuit',
    pro: 'Pro',
    save: 'Enregistrer',
    deleteEllipsis: 'Supprimer…',
    deletePage: 'Supprimer cette page ?',
    deleteWord: 'Supprimer',
    cannotUndo: 'Cette action est irréversible.',
    linkTabsComment: 'Onglets liens : une page par onglet, aucun script.',
    panelTabsComment: 'Onglets à panneaux : échange sur place, et ils vont chercher le code eux-mêmes.',
    docsLabel: 'Docs',
    installLabel: 'Installer',
    useLabel: 'Utiliser',
    pageCol: 'Page',
    sizeCol: 'Taille',
    statusCol: 'Statut',
    failedWord: 'échec',
  },
  de: {
    mySite: 'Meine Website',
    hello: 'Hallo',
    leadCopy: 'Eine Seite aus Komponenten.',
    readDocs: 'Zur Dokumentation',
    routing: 'Routing',
    fileBased: 'Dateibasiert',
    becomesAbout: 'src/about.ht.js wird zu /about.',
    readMore: 'Mehr erfahren',
    inlineComment: 'die ganze Datei in der Seite — gar keine Anfrage',
    themingComment: 'Nach styles(), damit diese Werte gewinnen.',
    themeScriptComment: 'wendet die gespeicherte Wahl vor dem ersten Rendern an',
    anywhereComment: '…irgendwo im body',
    email: 'E-Mail',
    neverShared: 'Wird nie weitergegeben.',
    site: 'Website',
    notAUrl: 'Das ist keine URL.',
    plan: 'Tarif',
    free: 'Kostenlos',
    pro: 'Pro',
    save: 'Speichern',
    deleteEllipsis: 'Löschen…',
    deletePage: 'Diese Seite löschen?',
    deleteWord: 'Löschen',
    cannotUndo: 'Das lässt sich nicht rückgängig machen.',
    linkTabsComment: 'Link-Tabs: eine Seite pro Tab, ganz ohne Skript.',
    panelTabsComment: 'Panel-Tabs: wechseln an Ort und Stelle und holen sich den Code dafür selbst.',
    docsLabel: 'Docs',
    installLabel: 'Installieren',
    useLabel: 'Verwenden',
    pageCol: 'Seite',
    sizeCol: 'Größe',
    statusCol: 'Status',
    failedWord: 'fehlgeschlagen',
  },
  ru: {
    mySite: 'Мой сайт',
    hello: 'Привет',
    leadCopy: 'Страница, собранная из компонентов.',
    readDocs: 'Читать документацию',
    routing: 'Маршрутизация',
    fileBased: 'На основе файлов',
    becomesAbout: 'src/about.ht.js становится /about.',
    readMore: 'Подробнее',
    inlineComment: 'вся таблица прямо в странице — ни одного запроса',
    themingComment: 'После styles(), чтобы победили эти значения.',
    themeScriptComment: 'применяет сохранённый выбор до первой отрисовки',
    anywhereComment: '…где угодно в body',
    email: 'Эл. почта',
    neverShared: 'Никому не передаётся.',
    site: 'Сайт',
    notAUrl: 'Это не URL.',
    plan: 'Тариф',
    free: 'Бесплатный',
    pro: 'Pro',
    save: 'Сохранить',
    deleteEllipsis: 'Удалить…',
    deletePage: 'Удалить эту страницу?',
    deleteWord: 'Удалить',
    cannotUndo: 'Это действие необратимо.',
    linkTabsComment: 'Вкладки-ссылки: по странице на вкладку, без единого скрипта.',
    panelTabsComment: 'Вкладки с панелями: переключаются на месте и сами подгружают нужный код.',
    docsLabel: 'Документация',
    installLabel: 'Установка',
    useLabel: 'Использование',
    pageCol: 'Страница',
    sizeCol: 'Размер',
    statusCol: 'Статус',
    failedWord: 'ошибка',
  },
  zh: {
    mySite: '我的网站',
    hello: '你好',
    leadCopy: '一个用组件搭建的页面。',
    readDocs: '查看文档',
    routing: '路由',
    fileBased: '基于文件',
    becomesAbout: 'src/about.ht.js 对应 /about。',
    readMore: '了解更多',
    inlineComment: '整份样式表就在页面里——一次请求都不用',
    themingComment: '放在 styles() 之后，这些值才会生效。',
    themeScriptComment: '在首次绘制前应用已保存的选择',
    anywhereComment: '……body 中的任意位置',
    email: '邮箱',
    neverShared: '绝不外传。',
    site: '网站',
    notAUrl: '这不是一个 URL。',
    plan: '套餐',
    free: '免费',
    pro: 'Pro',
    save: '保存',
    deleteEllipsis: '删除…',
    deletePage: '删除这个页面？',
    deleteWord: '删除',
    cannotUndo: '此操作无法撤销。',
    linkTabsComment: '链接式标签页：一个标签一个页面，完全不需要脚本。',
    panelTabsComment: '面板式标签页：就地切换，所需代码由它们自己加载。',
    docsLabel: '文档',
    installLabel: '安装',
    useLabel: '使用',
    pageCol: '页面',
    sizeCol: '大小',
    statusCol: '状态',
    failedWord: '失败',
  },
  pt: {
    mySite: 'O meu site',
    hello: 'Olá',
    leadCopy: 'Uma página construída a partir de componentes.',
    readDocs: 'Ler a documentação',
    routing: 'Rotas',
    fileBased: 'Baseado em ficheiros',
    becomesAbout: 'src/about.ht.js passa a ser /about.',
    readMore: 'Saber mais',
    inlineComment: 'a folha inteira na página, sem pedido nenhum',
    themingComment: 'Depois de styles(), para que estes prevaleçam.',
    themeScriptComment: 'aplica a escolha guardada antes da primeira pintura',
    anywhereComment: '…em qualquer sítio do body',
    email: 'E-mail',
    neverShared: 'Nunca é partilhado.',
    site: 'Site',
    notAUrl: 'Não é um URL.',
    plan: 'Plano',
    free: 'Grátis',
    pro: 'Pro',
    save: 'Guardar',
    deleteEllipsis: 'Eliminar…',
    deletePage: 'Eliminar esta página?',
    deleteWord: 'Eliminar',
    cannotUndo: 'Isto não pode ser desfeito.',
    linkTabsComment: 'Separadores de ligação: uma página por separador, sem qualquer script.',
    panelTabsComment: 'Separadores com painel: trocam no lugar e vão buscar sozinhos o código.',
    docsLabel: 'Docs',
    installLabel: 'Instalar',
    useLabel: 'Usar',
    pageCol: 'Página',
    sizeCol: 'Tamanho',
    statusCol: 'Estado',
    failedWord: 'falhou',
  },
}

export function uiSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  return {
    install: `npm install sitelo javascript-to-html`,

    page: `import { body, head, html, meta, title } from 'javascript-to-html'
import { styles, container, stack, heading, text, button } from 'sitelo/ui'

export default () => html({ lang: '${htmlLang}' },
  head(
    meta({ charset: 'utf-8' }),
    meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
    title('${t.mySite}'),
    styles(),
  ),
  body(
    container({ size: 'md' },
      stack({ gap: 'md' },
        heading({ level: 1 }, '${t.hello}'),
        text({ variant: 'lead' }, '${t.leadCopy}'),
        button({ href: '/docs' }, '${t.readDocs}'),
      ),
    ),
  ),
)`,

    namespace: `import * as ui from 'sitelo/ui'

ui.card(
  ui.cardHeader({ title: '${t.routing}', subtitle: '${t.fileBased}' }),
  ui.cardBody(ui.text('${t.becomesAbout}')),
  ui.cardFooter({ divided: true }, ui.button({ size: 'sm' }, '${t.readMore}')),
)`,

    inline: `import { styles } from 'sitelo/ui'

head(
  // ${t.inlineComment}
  styles({ inline: true }),
)`,

    theming: `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  // ${t.themingComment}
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }, {
    dark: { primary: { base: '#8f8ff0' } },
  }),
)`,

    handler: `<!-- rendered by alert({ dismissible: true }) -->
<button class="su-alert-dismiss"
        onclick="import('/su/alert.js').then(m=>m.dismiss(this))">
  &times;
</button>`,

    client: `// src/main.js
import { toast } from 'sitelo/ui/client'`,

    themeToggle: `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // ${t.themeScriptComment}
  styles(),
)

// ${t.anywhereComment}
themeToggle()`,

    form: `import { card, cardBody, cardFooter, button, stack, textField, selectField } from 'sitelo/ui'

card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: '${t.email}', name: 'email', type: 'email', help: '${t.neverShared}' }),
      textField({ label: '${t.site}', name: 'site', startAdornment: 'https://', error: '${t.notAUrl}' }),
      selectField({ label: '${t.plan}', name: 'plan', options: ['${t.free}', '${t.pro}'], value: '${t.pro}' }),
    ),
  ),
  cardFooter({ divided: true }, button({ type: 'submit' }, '${t.save}')),
)`,

    modal: `import { button, modal } from 'sitelo/ui'

button({ popovertarget: 'confirm' }, '${t.deleteEllipsis}')

modal({
  id: 'confirm',
  title: '${t.deletePage}',
  footer: button({ color: 'danger' }, '${t.deleteWord}'),
}, '${t.cannotUndo}')`,

    tabs: `// ${t.linkTabsComment}
tabs({ items: [
  { label: '${t.docsLabel}', href: '/docs', active: true },
  { label: 'API', href: '/api' },
] })

// ${t.panelTabsComment}
tabs({ value: 'use', items: [
  { id: 'install', label: '${t.installLabel}', panel: code('npm install sitelo') },
  { id: 'use', label: '${t.useLabel}', panel: code("import * as ui from 'sitelo/ui'") },
] })`,

    table: `table({
  striped: true,
  columns: [
    { key: 'page', header: '${t.pageCol}' },
    { key: 'size', header: '${t.sizeCol}', align: 'end' },
    { header: '${t.statusCol}', render: (row) => chip({ color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : '${t.failedWord}') },
  ],
  rows: pages,
})`,

    passthrough: `button({ id: 'save', 'data-analytics': 'save-click', onclick: 'save()' }, '${t.save}')
// <button type="button" id="save" data-analytics="save-click" onclick="save()" class="su-btn …">`,
  }
}
