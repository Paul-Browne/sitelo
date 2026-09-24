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
  en: { frame: 'The components, restyled by the preset', button: 'Button', input: 'Input', dropdown: 'Dropdown', addUser: 'Add user', previous: 'Previous', next: 'Next', sound: 'Sound', sync: 'Sync', off: 'Off', on: 'On', share: 'Share', label: 'Label', search: 'Search', searchFor: 'Search for …', progress: 'Progress', slider: 'Slider', cardTitle: 'A card', cardBody: 'Raised out of the page it sits on.', solid: 'Solid', outline: 'Outline', ghost: 'Ghost', saved: 'Saved', savedBody: 'Your changes are live.', view: 'View', list: 'List', grid: 'Grid', board: 'Board', sections: 'Sections', overview: 'Overview', usage: 'Usage', api: 'API', overviewPanel: 'The whole look, in one call.', usagePanel: 'Link it after the core sheet.', apiPanel: 'One option: preset.', q1: 'What is a preset?', a1: 'A second sheet that restyles every component at once.', q2: 'Does it follow dark mode?', a2: 'Yes — try the toggle at the top of the page.', q3: 'Can I still use theme()?', a3: 'Yes, and it wins over the preset.', draft: 'Draft', live: 'Live', archived: 'Archived', notifications: 'Notifications', today: 'Today', shipped: 'Preset shipped', yesterday: 'Yesterday', written: 'Docs written', monday: 'Monday', sketched: 'First sketch', hoverMe: 'Hover over me', hello: 'Hello!', copied: 'Copied to clipboard', dismiss: 'Dismiss', account: 'Account', profile: 'Profile', confirm: 'Confirm', or: 'or' },
  es: { frame: 'Los componentes, con el estilo del preset', button: 'Botón', input: 'Campo', dropdown: 'Desplegable', addUser: 'Añadir usuario', previous: 'Anterior', next: 'Siguiente', sound: 'Sonido', sync: 'Sincronizar', off: 'Apagado', on: 'Encendido', share: 'Compartir', label: 'Etiqueta', search: 'Buscar', searchFor: 'Buscar…', progress: 'Progreso', slider: 'Control deslizante', cardTitle: 'Una tarjeta', cardBody: 'En relieve sobre la página en la que está.', solid: 'Sólido', outline: 'Contorno', ghost: 'Fantasma', saved: 'Guardado', savedBody: 'Tus cambios ya están publicados.', view: 'Vista', list: 'Lista', grid: 'Cuadrícula', board: 'Tablero', sections: 'Secciones', overview: 'Resumen', usage: 'Uso', api: 'API', overviewPanel: 'Todo el aspecto, en una llamada.', usagePanel: 'Enlázalo después de la hoja principal.', apiPanel: 'Una opción: preset.', q1: '¿Qué es un preset?', a1: 'Una segunda hoja que reestiliza todos los componentes a la vez.', q2: '¿Sigue el modo oscuro?', a2: 'Sí: prueba el interruptor de la parte superior de la página.', q3: '¿Puedo seguir usando theme()?', a3: 'Sí, y gana sobre el preset.', draft: 'Borrador', live: 'Publicado', archived: 'Archivado', notifications: 'Notificaciones', today: 'Hoy', shipped: 'Preset publicado', yesterday: 'Ayer', written: 'Documentación escrita', monday: 'Lunes', sketched: 'Primer boceto', hoverMe: 'Pasa el cursor por aquí', hello: '¡Hola!', copied: 'Copiado al portapapeles', dismiss: 'Cerrar', account: 'Cuenta', profile: 'Perfil', confirm: 'Confirmar', or: 'o' },
  fr: { frame: 'Les composants, restylés par le préréglage', button: 'Bouton', input: 'Champ', dropdown: 'Liste déroulante', addUser: 'Ajouter un utilisateur', previous: 'Précédent', next: 'Suivant', sound: 'Son', sync: 'Synchroniser', off: 'Désactivé', on: 'Activé', share: 'Partager', label: 'Étiquette', search: 'Rechercher', searchFor: 'Rechercher…', progress: 'Progression', slider: 'Curseur', cardTitle: 'Une carte', cardBody: 'En relief sur la page qui la porte.', solid: 'Plein', outline: 'Contour', ghost: 'Fantôme', saved: 'Enregistré', savedBody: 'Vos modifications sont en ligne.', view: 'Affichage', list: 'Liste', grid: 'Grille', board: 'Tableau', sections: 'Sections', overview: 'Aperçu', usage: 'Utilisation', api: 'API', overviewPanel: 'Tout le rendu, en un appel.', usagePanel: 'Liez-le après la feuille principale.', apiPanel: 'Une option : preset.', q1: 'Qu’est-ce qu’un préréglage ?', a1: 'Une seconde feuille qui restyle chaque composant d’un coup.', q2: 'Suit-il le mode sombre ?', a2: 'Oui — essayez le bouton en haut de la page.', q3: 'Puis-je encore utiliser theme() ?', a3: 'Oui, et il l’emporte sur le préréglage.', draft: 'Brouillon', live: 'En ligne', archived: 'Archivé', notifications: 'Notifications', today: 'Aujourd’hui', shipped: 'Préréglage publié', yesterday: 'Hier', written: 'Documentation rédigée', monday: 'Lundi', sketched: 'Première esquisse', hoverMe: 'Survolez-moi', hello: 'Bonjour !', copied: 'Copié dans le presse-papiers', dismiss: 'Fermer', account: 'Compte', profile: 'Profil', confirm: 'Confirmer', or: 'ou' },
  de: { frame: 'Die Komponenten, im Stil des Presets', button: 'Button', input: 'Eingabe', dropdown: 'Auswahl', addUser: 'Nutzer hinzufügen', previous: 'Zurück', next: 'Weiter', sound: 'Ton', sync: 'Synchronisieren', off: 'Aus', on: 'An', share: 'Teilen', label: 'Label', search: 'Suche', searchFor: 'Suchen nach …', progress: 'Fortschritt', slider: 'Schieberegler', cardTitle: 'Eine Karte', cardBody: 'Aus der Seite gehoben, auf der sie liegt.', solid: 'Gefüllt', outline: 'Umriss', ghost: 'Ghost', saved: 'Gespeichert', savedBody: 'Deine Änderungen sind live.', view: 'Ansicht', list: 'Liste', grid: 'Raster', board: 'Board', sections: 'Abschnitte', overview: 'Überblick', usage: 'Verwendung', api: 'API', overviewPanel: 'Der ganze Look, mit einem Aufruf.', usagePanel: 'Nach dem Kern-Stylesheet verlinken.', apiPanel: 'Eine Option: preset.', q1: 'Was ist ein Preset?', a1: 'Ein zweites Stylesheet, das jede Komponente auf einmal neu gestaltet.', q2: 'Folgt es dem Dunkelmodus?', a2: 'Ja — probier den Schalter oben auf der Seite.', q3: 'Kann ich theme() weiter nutzen?', a3: 'Ja, und es gewinnt gegen das Preset.', draft: 'Entwurf', live: 'Live', archived: 'Archiviert', notifications: 'Benachrichtigungen', today: 'Heute', shipped: 'Preset veröffentlicht', yesterday: 'Gestern', written: 'Doku geschrieben', monday: 'Montag', sketched: 'Erste Skizze', hoverMe: 'Fahr mit der Maus drüber', hello: 'Hallo!', copied: 'In die Zwischenablage kopiert', dismiss: 'Schließen', account: 'Konto', profile: 'Profil', confirm: 'Bestätigen', or: 'oder' },
  ru: { frame: 'Компоненты в стиле пресета', button: 'Кнопка', input: 'Поле', dropdown: 'Список', addUser: 'Добавить пользователя', previous: 'Назад', next: 'Вперёд', sound: 'Звук', sync: 'Синхронизация', off: 'Выкл.', on: 'Вкл.', share: 'Поделиться', label: 'Метка', search: 'Поиск', searchFor: 'Искать…', progress: 'Прогресс', slider: 'Ползунок', cardTitle: 'Карточка', cardBody: 'Приподнята над страницей, на которой лежит.', solid: 'Заливка', outline: 'Контур', ghost: 'Призрак', saved: 'Сохранено', savedBody: 'Изменения уже на сайте.', view: 'Вид', list: 'Список', grid: 'Сетка', board: 'Доска', sections: 'Разделы', overview: 'Обзор', usage: 'Использование', api: 'API', overviewPanel: 'Весь облик одним вызовом.', usagePanel: 'Подключите после основной таблицы.', apiPanel: 'Одна опция: preset.', q1: 'Что такое пресет?', a1: 'Вторая таблица стилей, которая разом переоформляет все компоненты.', q2: 'Он следует тёмной теме?', a2: 'Да — попробуйте переключатель вверху страницы.', q3: 'Можно ли по-прежнему использовать theme()?', a3: 'Да, и он побеждает пресет.', draft: 'Черновик', live: 'Опубликовано', archived: 'В архиве', notifications: 'Уведомления', today: 'Сегодня', shipped: 'Пресет выпущен', yesterday: 'Вчера', written: 'Документация написана', monday: 'Понедельник', sketched: 'Первый набросок', hoverMe: 'Наведите курсор', hello: 'Привет!', copied: 'Скопировано в буфер обмена', dismiss: 'Закрыть', account: 'Аккаунт', profile: 'Профиль', confirm: 'Подтверждение', or: 'или' },
  zh: { frame: '使用该预设重新设计的组件', button: '按钮', input: '输入框', dropdown: '下拉菜单', addUser: '添加用户', previous: '上一个', next: '下一个', sound: '声音', sync: '同步', off: '关', on: '开', share: '分享', label: '标签', search: '搜索', searchFor: '搜索…', progress: '进度', slider: '滑块', cardTitle: '一张卡片', cardBody: '从所在的页面上凸起。', solid: '实心', outline: '描边', ghost: '幽灵', saved: '已保存', savedBody: '你的更改已经上线。', view: '视图', list: '列表', grid: '网格', board: '看板', sections: '分区', overview: '概览', usage: '用法', api: 'API', overviewPanel: '整体观感，一次调用。', usagePanel: '链接在核心样式表之后。', apiPanel: '只有一个选项：preset。', q1: '预设是什么？', a1: '一份能一次性重新设计所有组件的第二份样式表。', q2: '它会跟随深色模式吗？', a2: '会——试试页面顶部的开关。', q3: '还能继续用 theme() 吗？', a3: '能，而且它优先于预设。', draft: '草稿', live: '已上线', archived: '已归档', notifications: '通知', today: '今天', shipped: '预设已发布', yesterday: '昨天', written: '文档已写好', monday: '星期一', sketched: '第一版草图', hoverMe: '将鼠标悬停在这里', hello: '你好！', copied: '已复制到剪贴板', dismiss: '关闭', account: '账户', profile: '资料', confirm: '确认', or: '或' },
  pt: { frame: 'Os componentes, com o estilo do preset', button: 'Botão', input: 'Campo', dropdown: 'Lista pendente', addUser: 'Adicionar utilizador', previous: 'Anterior', next: 'Seguinte', sound: 'Som', sync: 'Sincronizar', off: 'Desligado', on: 'Ligado', share: 'Partilhar', label: 'Etiqueta', search: 'Pesquisar', searchFor: 'Pesquisar…', progress: 'Progresso', slider: 'Controlo deslizante', cardTitle: 'Um cartão', cardBody: 'Em relevo sobre a página onde está.', solid: 'Sólido', outline: 'Contorno', ghost: 'Fantasma', saved: 'Guardado', savedBody: 'As suas alterações já estão publicadas.', view: 'Vista', list: 'Lista', grid: 'Grelha', board: 'Quadro', sections: 'Secções', overview: 'Visão geral', usage: 'Utilização', api: 'API', overviewPanel: 'O aspeto todo, numa chamada.', usagePanel: 'Liga-o depois da folha principal.', apiPanel: 'Uma opção: preset.', q1: 'O que é um preset?', a1: 'Uma segunda folha que muda o estilo de todos os componentes de uma vez.', q2: 'Segue o modo escuro?', a2: 'Sim — experimenta o interruptor no topo da página.', q3: 'Ainda posso usar o theme()?', a3: 'Sim, e ele prevalece sobre o preset.', draft: 'Rascunho', live: 'Publicado', archived: 'Arquivado', notifications: 'Notificações', today: 'Hoje', shipped: 'Preset publicado', yesterday: 'Ontem', written: 'Documentação escrita', monday: 'Segunda-feira', sketched: 'Primeiro esboço', hoverMe: 'Passa o rato por aqui', hello: 'Olá!', copied: 'Copiado para a área de transferência', dismiss: 'Fechar', account: 'Conta', profile: 'Perfil', confirm: 'Confirmar', or: 'ou' },
  it: { frame: 'I componenti, con lo stile del preset', button: 'Pulsante', input: 'Campo', dropdown: 'Menu a tendina', addUser: 'Aggiungi utente', previous: 'Precedente', next: 'Successivo', sound: 'Suono', sync: 'Sincronizza', off: 'Spento', on: 'Acceso', share: 'Condividi', label: 'Etichetta', search: 'Cerca', searchFor: 'Cerca…', progress: 'Avanzamento', slider: 'Cursore', cardTitle: 'Una card', cardBody: 'In rilievo sulla pagina che la ospita.', solid: 'Pieno', outline: 'Contorno', ghost: 'Ghost', saved: 'Salvato', savedBody: 'Le modifiche sono online.', view: 'Vista', list: 'Elenco', grid: 'Griglia', board: 'Bacheca', sections: 'Sezioni', overview: 'Panoramica', usage: 'Uso', api: 'API', overviewPanel: 'Tutto l’aspetto, con una chiamata.', usagePanel: 'Collegalo dopo il foglio principale.', apiPanel: 'Un’opzione: preset.', q1: 'Che cos’è un preset?', a1: 'Un secondo foglio che ridisegna ogni componente in un colpo solo.', q2: 'Segue la modalità scura?', a2: 'Sì — prova l’interruttore in cima alla pagina.', q3: 'Posso ancora usare theme()?', a3: 'Sì, e vince sul preset.', draft: 'Bozza', live: 'Online', archived: 'Archiviato', notifications: 'Notifiche', today: 'Oggi', shipped: 'Preset pubblicato', yesterday: 'Ieri', written: 'Documentazione scritta', monday: 'Lunedì', sketched: 'Primo schizzo', hoverMe: 'Passa il mouse qui', hello: 'Ciao!', copied: 'Copiato negli appunti', dismiss: 'Chiudi', account: 'Account', profile: 'Profilo', confirm: 'Conferma', or: 'o' },
  pl: { frame: 'Komponenty w stylu presetu', button: 'Przycisk', input: 'Pole', dropdown: 'Lista rozwijana', addUser: 'Dodaj użytkownika', previous: 'Poprzedni', next: 'Następny', sound: 'Dźwięk', sync: 'Synchronizacja', off: 'Wył.', on: 'Wł.', share: 'Udostępnij', label: 'Etykieta', search: 'Szukaj', searchFor: 'Szukaj…', progress: 'Postęp', slider: 'Suwak', cardTitle: 'Karta', cardBody: 'Wypukła nad stroną, na której leży.', solid: 'Pełny', outline: 'Kontur', ghost: 'Duch', saved: 'Zapisano', savedBody: 'Zmiany są już widoczne.', view: 'Widok', list: 'Lista', grid: 'Siatka', board: 'Tablica', sections: 'Sekcje', overview: 'Przegląd', usage: 'Użycie', api: 'API', overviewPanel: 'Cały wygląd jednym wywołaniem.', usagePanel: 'Dołącz go po głównym arkuszu.', apiPanel: 'Jedna opcja: preset.', q1: 'Czym jest preset?', a1: 'Drugim arkuszem, który zmienia wygląd każdego komponentu naraz.', q2: 'Czy podąża za trybem ciemnym?', a2: 'Tak — wypróbuj przełącznik na górze strony.', q3: 'Czy nadal mogę używać theme()?', a3: 'Tak, i wygrywa z presetem.', draft: 'Szkic', live: 'Opublikowane', archived: 'Zarchiwizowane', notifications: 'Powiadomienia', today: 'Dziś', shipped: 'Preset wydany', yesterday: 'Wczoraj', written: 'Dokumentacja napisana', monday: 'Poniedziałek', sketched: 'Pierwszy szkic', hoverMe: 'Najedź tutaj kursorem', hello: 'Cześć!', copied: 'Skopiowano do schowka', dismiss: 'Zamknij', account: 'Konto', profile: 'Profil', confirm: 'Potwierdzenie', or: 'lub' },
  tr: { frame: 'Bileşenler, hazır ayarla yeniden biçimlenmiş', button: 'Düğme', input: 'Alan', dropdown: 'Açılır liste', addUser: 'Kullanıcı ekle', previous: 'Önceki', next: 'Sonraki', sound: 'Ses', sync: 'Eşitle', off: 'Kapalı', on: 'Açık', share: 'Paylaş', label: 'Etiket', search: 'Ara', searchFor: 'Ara…', progress: 'İlerleme', slider: 'Kaydırıcı', cardTitle: 'Bir kart', cardBody: 'Üzerinde durduğu sayfadan kabarık.', solid: 'Dolgulu', outline: 'Çerçeveli', ghost: 'Hayalet', saved: 'Kaydedildi', savedBody: 'Değişiklikleriniz yayında.', view: 'Görünüm', list: 'Liste', grid: 'Izgara', board: 'Pano', sections: 'Bölümler', overview: 'Genel bakış', usage: 'Kullanım', api: 'API', overviewPanel: 'Bütün görünüm, tek çağrıyla.', usagePanel: 'Çekirdek stil sayfasından sonra bağlayın.', apiPanel: 'Tek seçenek: preset.', q1: 'Hazır ayar nedir?', a1: 'Her bileşeni tek seferde yeniden biçimlendiren ikinci bir stil sayfası.', q2: 'Koyu kipi izler mi?', a2: 'Evet — sayfanın üstündeki düğmeyi deneyin.', q3: 'theme() kullanmaya devam edebilir miyim?', a3: 'Evet, ve hazır ayarın önüne geçer.', draft: 'Taslak', live: 'Yayında', archived: 'Arşivlendi', notifications: 'Bildirimler', today: 'Bugün', shipped: 'Hazır ayar yayımlandı', yesterday: 'Dün', written: 'Belgeler yazıldı', monday: 'Pazartesi', sketched: 'İlk taslak', hoverMe: 'Fareyle üzerine gelin', hello: 'Merhaba!', copied: 'Panoya kopyalandı', dismiss: 'Kapat', account: 'Hesap', profile: 'Profil', confirm: 'Onay', or: 'veya' },
  id: { frame: 'Komponen, dengan gaya preset', button: 'Tombol', input: 'Isian', dropdown: 'Daftar pilihan', addUser: 'Tambah pengguna', previous: 'Sebelumnya', next: 'Berikutnya', sound: 'Suara', sync: 'Sinkron', off: 'Mati', on: 'Nyala', share: 'Bagikan', label: 'Label', search: 'Cari', searchFor: 'Cari…', progress: 'Kemajuan', slider: 'Penggeser', cardTitle: 'Sebuah kartu', cardBody: 'Menonjol dari halaman tempatnya berada.', solid: 'Padat', outline: 'Garis tepi', ghost: 'Hantu', saved: 'Tersimpan', savedBody: 'Perubahan Anda sudah tayang.', view: 'Tampilan', list: 'Daftar', grid: 'Kisi', board: 'Papan', sections: 'Bagian', overview: 'Ikhtisar', usage: 'Penggunaan', api: 'API', overviewPanel: 'Seluruh tampilan, dalam satu panggilan.', usagePanel: 'Tautkan setelah lembar inti.', apiPanel: 'Satu opsi: preset.', q1: 'Apa itu preset?', a1: 'Lembar kedua yang menata ulang setiap komponen sekaligus.', q2: 'Apakah ia mengikuti mode gelap?', a2: 'Ya — coba sakelar di bagian atas halaman.', q3: 'Masih bisakah saya memakai theme()?', a3: 'Bisa, dan ia menang atas preset.', draft: 'Draf', live: 'Tayang', archived: 'Diarsipkan', notifications: 'Notifikasi', today: 'Hari ini', shipped: 'Preset dirilis', yesterday: 'Kemarin', written: 'Dokumentasi ditulis', monday: 'Senin', sketched: 'Sketsa pertama', hoverMe: 'Arahkan kursor ke sini', hello: 'Halo!', copied: 'Disalin ke papan klip', dismiss: 'Tutup', account: 'Akun', profile: 'Profil', confirm: 'Konfirmasi', or: 'atau' },
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

/*
 * The controls in the frame that change something — the slider's
 * readout, the toggle group, the toast's close button — wired from out
 * here, on the frame's own
 * `onload`, with the same modules and calls the components use.
 *
 * From inside the frame they fail twice over. Chrome resolves an inline
 * handler's `import()` in a `srcdoc` document against `about:srcdoc`, so
 * `/su/slider.js` is not a URL there at all. And the plugin copies a
 * module into the build only when a page names it in an event attribute
 * — a name inside `srcdoc` is escaped text it rightly passes over — so a
 * module no other page happens to use, `pressed.js` today, would 404 in
 * production. On the frame's element, both go away: the import resolves
 * against this page, and the attribute is one the plugin reads.
 *
 * The base is the one the stylesheet is served from, which is the
 * runtime's by construction.
 */
const RUNTIME = ui.stylesUrl({ hash: false }).replace(/ui\.css$/, '')
const PRESET_WIRE =
  "const d=this.contentDocument;" +
  `d.addEventListener('input',e=>{if(e.target.matches('.su-slider'))import('${RUNTIME}slider.js').then(m=>m.sync(e.target))});` +
  // `true`, not a flip: a segment already chosen stays chosen, and the
  // module lets go of the rest of a single-choice group itself.
  `d.addEventListener('click',e=>{const b=e.target.closest('.su-toggle-group .su-toggle-btn');if(b)import('${RUNTIME}pressed.js').then(m=>m.set(b,true))});` +
  `d.addEventListener('click',e=>{const b=e.target.closest('.su-alert-dismiss');if(b)import('${RUNTIME}alert.js').then(m=>m.dismiss(b))})`

/*
 * The preview's own few rules: a ground for the preset to sit on. Each
 * preset says what the page's background has to be — the page colour
 * for most, the bloomed ground for glass, which only it defines.
 */
const PRESET_PAGE_CSS =
  'body{margin:0;padding:2rem 1.5rem;background:var(--su-glass-ground,var(--su-bg));color:var(--su-text);font-family:var(--su-font-sans)}' +
  '.preset-tile{aspect-ratio:1;max-width:11rem;display:grid;place-items:center}' +
  '.preset-glyph{font-size:4.5rem;font-weight:600;line-height:1;color:var(--su-primary)}' +
  // Its own width in the column, so the bubble centres over the button.
  '.preset-tooltip{align-self:flex-start}' +
  // The toast region, out of its corner and into the column.
  '.preset-toasts{position:static;max-width:none}'

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
          ui.divider({ spacing: 'none' }, t.or),
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
            ui.divider({ orientation: 'vertical', spacing: 'none' }),
            ui.button({ ...soft, startIcon: ui.icon('location') }, t.label),
          ),
        ),
      ),
      ui.input({ 'aria-label': t.search, placeholder: t.searchFor, startAdornment: ui.icon('search') }),
      // One of each: done, under way, still to come.
      ui.steps({ label: t.progress, current: 1, items: [t.account, t.profile, t.confirm] }),
      ui.grid(
        { min: '16rem', gap: 'xl', align: 'start' },
        ui.stack(
          { gap: 'lg' },
          ui.progress({ value: 50, label: t.progress, showValue: true }),
          // Its own `oninput` would import from inside the frame — see PRESET_WIRE.
          ui.sliderField({ label: t.slider, value: 50, showValue: true, oninput: null }),
          ui.alert({ color: 'success', title: t.saved }, t.savedBody),
          /*
           * A toast where it can be seen: the region the toasts render
           * into, held in the flow. The toast itself is the markup
           * `toast()` builds — no inline handler on its button, which
           * PRESET_WIRE answers from out here.
           */
          ui.toasts(
            { class: 'preset-toasts' },
            div(
              { class: 'su-alert su-alert--soft su-c-neutral' },
              div({ class: 'su-alert-content' }, t.copied),
              `<button type="button" class="su-alert-dismiss" aria-label="${t.dismiss}">&times;</button>`,
            ),
          ),
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
      ui.grid(
        { min: '16rem', gap: 'xl', align: 'start' },
        ui.stack(
          { gap: 'xl' },
          ui.accordion({
            name: 'preset-faq',
            items: [
              { title: t.q1, content: t.a1, open: true },
              { title: t.q2, content: t.a2 },
              { title: t.q3, content: t.a3 },
            ],
          }),
          ui.timeline({
            items: [
              { time: t.today, title: t.shipped, description: t.overviewPanel, color: 'success', icon: ui.icon('check') },
              { time: t.yesterday, title: t.written },
              { time: t.monday, title: t.sketched },
            ],
          }),
        ),
        ui.stack(
          { gap: 'lg' },
          ui.toggleGroup({ label: t.view, items: [t.list, t.grid, t.board], value: t.grid }),
          ui.tabs({
            variant: 'pills',
            name: 'preset-tabs',
            label: t.sections,
            items: [
              { label: t.overview, panel: t.overviewPanel },
              { label: t.usage, panel: t.usagePanel },
              { label: t.api, panel: t.apiPanel },
            ],
          }),
          ui.stack(
            { direction: 'row', gap: 'sm', wrap: true },
            ui.chip(t.draft),
            ui.chip({ color: 'success' }, t.live),
            ui.chip({ variant: 'outline' }, t.archived),
          ),
          ui.stack(
            { direction: 'row', gap: 'lg', align: 'center' },
            ui.badge({ content: 3 }, ui.avatar({ name: 'Ada Lovelace' })),
            ui.badge({ content: 12 }, ui.iconButton({ ...soft, icon: ui.icon('bell'), label: t.notifications })),
            ui.badge({ dot: true, color: 'success' }, ui.avatar({ name: 'Grace Hopper' })),
          ),
          ui.tooltip({ class: 'preset-tooltip', content: t.hello }, ui.button(soft, t.hoverMe)),
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
      onload: PRESET_WIRE,
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
