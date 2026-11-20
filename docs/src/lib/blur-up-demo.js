/**
 * The demo under "Blur-up placeholders" on the images page: four photos,
 * each showing the placeholder sitelo paints behind it until a click swaps
 * in the photo. The placeholders are sitelo's own output, made by
 * docs/scripts/blur-up.mjs; the swap is `initBlurUpDemo()` in main.js.
 *
 * The photo sits under its placeholder, already in the page, so a click
 * changes what is shown rather than starting a download — the point is
 * the comparison. Without the script, the placeholders stay.
 *
 * Kept out of search and the page's Markdown copy, like the component
 * demos: with nothing to see or click, all that would be left there is
 * four byte counts and an instruction to click.
 */
import { button, div, figcaption, figure, img, p, span } from 'javascript-to-html'
import { BLUR_UP_PHOTOS } from './blur-up-photos.js'

/** Per locale: what each photo shows, and the line under the demo. */
const T = {
  en: {
    alts: {
      fjord: 'A fjord between rocky cliffs',
      pug: 'A pug wrapped in a checked blanket',
      jellyfish: 'An orange jellyfish in deep blue water',
      walrus: 'Walruses resting on a beach',
    },
    hint: 'Each picture starts as its placeholder. Click one to swap in the photo, and again to swap back. Under each: what the placeholder adds to the page, then what the photo weighs.',
  },
  de: {
    alts: {
      fjord: 'Ein Fjord zwischen Felswänden',
      pug: 'Ein Mops, eingewickelt in eine karierte Decke',
      jellyfish: 'Eine orange Qualle in tiefblauem Wasser',
      walrus: 'Walrosse, die an einem Strand ruhen',
    },
    hint: 'Jedes Bild beginnt als sein Platzhalter. Klick eines an, um das Foto einzusetzen, und noch einmal, um zurückzuwechseln. Darunter: was der Platzhalter der Seite hinzufügt, dann was das Foto wiegt.',
  },
  es: {
    alts: {
      fjord: 'Un fiordo entre acantilados rocosos',
      pug: 'Un carlino envuelto en una manta de cuadros',
      jellyfish: 'Una medusa naranja en agua azul profundo',
      walrus: 'Morsas descansando en una playa',
    },
    hint: 'Cada imagen empieza como su marcador. Haz clic en una para ver la foto, y otra vez para volver. Debajo de cada una: lo que el marcador añade a la página y lo que pesa la foto.',
  },
  fr: {
    alts: {
      fjord: 'Un fjord entre des falaises rocheuses',
      pug: 'Un carlin enveloppé dans une couverture à carreaux',
      jellyfish: 'Une méduse orange dans une eau d’un bleu profond',
      walrus: 'Des morses au repos sur une plage',
    },
    hint: 'Chaque image commence par son aperçu. Cliquez sur l’une d’elles pour afficher la photo, et à nouveau pour revenir. Sous chacune : ce que l’aperçu ajoute à la page, puis le poids de la photo.',
  },
  it: {
    alts: {
      fjord: 'Un fiordo tra pareti rocciose',
      pug: 'Un carlino avvolto in una coperta a quadri',
      jellyfish: 'Una medusa arancione nell’acqua blu profondo',
      walrus: 'Trichechi che riposano su una spiaggia',
    },
    hint: 'Ogni immagine parte dal suo segnaposto. Fai clic su una per far comparire la foto, e di nuovo per tornare indietro. Sotto ciascuna: quanto il segnaposto aggiunge alla pagina, poi quanto pesa la foto.',
  },
  pl: {
    alts: {
      fjord: 'Fiord między skalnymi urwiskami',
      pug: 'Mops owinięty kraciastym kocem',
      jellyfish: 'Pomarańczowa meduza w ciemnoniebieskiej wodzie',
      walrus: 'Morsy odpoczywające na plaży',
    },
    hint: 'Każdy obraz zaczyna jako swój zastępnik. Kliknij jeden, aby pokazać zdjęcie, i jeszcze raz, aby wrócić. Pod każdym: ile zastępnik dodaje do strony, a potem ile waży zdjęcie.',
  },
  pt: {
    alts: {
      fjord: 'Um fiorde entre falésias rochosas',
      pug: 'Um pug enrolado numa manta aos quadrados',
      jellyfish: 'Uma alforreca laranja em água azul-escura',
      walrus: 'Morsas a descansar numa praia',
    },
    hint: 'Cada imagem começa como o seu marcador. Clica numa para mostrar a foto, e outra vez para voltar. Por baixo de cada uma: o que o marcador acrescenta à página e quanto pesa a foto.',
  },
  ru: {
    alts: {
      fjord: 'Фьорд между скалистыми обрывами',
      pug: 'Мопс, укутанный в клетчатый плед',
      jellyfish: 'Оранжевая медуза в тёмно-синей воде',
      walrus: 'Моржи отдыхают на пляже',
    },
    hint: 'Каждая картинка сначала показана заглушкой. Нажмите на неё, чтобы показать фотографию, и ещё раз, чтобы вернуться. Под каждой: сколько заглушка добавляет к странице, затем сколько весит фотография.',
  },
  tr: {
    alts: {
      fjord: 'Kayalık uçurumlar arasında bir fiyort',
      pug: 'Ekose bir battaniyeye sarılmış bir pug',
      jellyfish: 'Koyu mavi suda turuncu bir denizanası',
      walrus: 'Bir kumsalda dinlenen morslar',
    },
    hint: 'Her görsel önce yer tutucusuyla başlar. Fotoğrafı göstermek için birine tıklayın, geri dönmek için yeniden tıklayın. Her birinin altında: yer tutucunun sayfaya eklediği boyut, ardından fotoğrafın ağırlığı.',
  },
  id: {
    alts: {
      fjord: 'Fjord di antara tebing berbatu',
      pug: 'Anjing pug terbungkus selimut kotak-kotak',
      jellyfish: 'Ubur-ubur oranye di air biru tua',
      walrus: 'Walrus berbaring di pantai',
    },
    hint: 'Setiap gambar dimulai sebagai placeholder-nya. Klik salah satunya untuk menampilkan fotonya, dan klik lagi untuk kembali. Di bawah masing-masing: tambahan placeholder pada halaman, lalu berat fotonya.',
  },
  zh: {
    alts: {
      fjord: '岩壁之间的峡湾',
      pug: '裹着格子毯的巴哥犬',
      jellyfish: '深蓝海水中的橙色水母',
      walrus: '在海滩上休息的海象',
    },
    hint: '每张图片一开始显示的都是它的占位图。点击一张即可换成照片，再点一次换回来。每张下方依次是：占位图给页面增加的大小，以及照片本身的大小。',
  },
}

const kilobytes = (bytes) => `${Math.round(bytes / 1000)} kB`

/** @param {string} lang */
export function blurUpDemo(lang = 'en') {
  const t = T[lang] ?? T.en

  return div(
    { class: 'blur-up-demo', 'data-pagefind-ignore': '' },
    div(
      { class: 'blur-up-demo-grid' },
      BLUR_UP_PHOTOS.map((photo) =>
        figure(
          { class: 'blur-up-demo-item' },
          button(
            { class: 'blur-up-demo-tile', type: 'button', 'aria-pressed': 'false', 'data-blur-up': '' },
            img({
              src: photo.src,
              alt: t.alts[photo.name],
              width: photo.width,
              height: photo.height,
              loading: 'lazy',
              decoding: 'async',
            }),
            span({ class: 'blur-up-demo-placeholder', style: photo.style, 'aria-hidden': 'true' }),
          ),
          figcaption({ class: 'blur-up-demo-size' }, `${photo.pageBytes} B → ${kilobytes(photo.photoBytes)}`),
        ),
      ),
    ),
    p({ class: 'blur-up-demo-hint' }, t.hint),
  )
}
