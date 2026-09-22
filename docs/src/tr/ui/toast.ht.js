import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Bildirim',
    description:
      'Köşede geçici bir ileti; sayfanın işlediği bir bölgeye betikten eklenir.',
    activeHref: '/tr/ui/toast',
    children: [
      p(
        'Bildirim, buradaki statik olamayan tek bileşendir: bir şeyin olmasına yanıt olarak belirir. Sayfa ',
        code('toasts()'),
        ' ile boş bir bölge işler ve ',
        code('sitelo/ui/client'),
        ' içindeki ',
        code('toast()'),
        ' oraya ekler.',
      ),
      p(
        'Bölge kibar bir canlı bölgedir, bu yüzden eklenen her şey odağı çalmadan duyurulur.',
      ),

      h2('Kurulum'),
      p('Bölgeyi gövdenin herhangi bir yerine koyun — sabit konumludur, bu yüzden yeri önemli değildir:'),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …sayfa…
  toasts(),
)`, 'javascript'),
      p(
        'Bu, çalışma zamanının sayfadaki hiçbir şeyin sizin için tetiklemediği tek parçasıdır, dolayısıyla kendiniz uzandığınız tek parçadır — hiçbir şey paketlenmeden, bir olay özniteliğinden:',
      ),
      codeBlock('Herhangi bir yer', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('Kaydedildi.',{color:'success'}))" }, 'Kaydet')`, 'javascript'),
      p('Ya da zaten çalışan bir modülünüz varsa kendi modülünüzden:'),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

toast('Kaydedildi.', { color: 'success' })`, 'javascript'),

      h2('Deneyin'),
      p(
        'Bu sayfa bir ',
        code('toasts()'),
        ' bölgesi işler ve aşağıdaki düğmeler çalışma zamanını kendileri getirir, bu yüzden gerçekten bildirim üretirler — sağ altta. Siz birine basana dek hiçbir şey yüklenmez.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "import('/su/toast.js').then(m=>m.toast('Kaydedildi.',{color:'success'}))",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "import('/su/toast.js').then(m=>m.toast('İki sayfanın meta açıklaması yok.',{color:'warning'}))",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "import('/su/toast.js').then(m=>m.toast('Derleme başarısız oldu. Bağlantı raporunu denetleyin.',{color:'danger'}))",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "import('/su/toast.js').then(m=>m.toast('Bu, siz kapatana dek durur.',{color:'neutral',duration:0}))",
  }, 'Kapatılana dek'),
)`),
      // Bu sayfanın düğmelerinin eklediği canlı bölge. Sabit konumlu,
      // bu yüzden burada işlenir ama görünümün köşesinde belirir.
      preview('toasts()'),

      h2('Seçenekler'),
      p(
        code('duration'),
        ', bildirimin milisaniye cinsinden ne kadar duracağıdır; ',
        code('0'),
        ' onu biri kapatana dek yukarıda tutar. Her bildirim, bir uyarının kullandığı kapatma işleyicisine bağlı bir kapatma düğmesi alır.',
      ),
      codeBlock('Seçenekler', `toast('Kaydedildi.', { color: 'success' })
toast('Hâlâ çalışıyor…', { color: 'neutral', duration: 0 })
toast('1,7 sn’de dağıtıldı', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('Ne işlediği'),
      p(
        'Bildirim, bildirim bölgesindeki bir ',
        code('alert()'),
        ' öğesidir — aynı biçimlendirme, aynı renkler, aynı kapatma düğmesi. Öğrenilecek yeni bir şey ve biçimlendirilecek fazladan bir şey yok.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Kaydedildi.'),
  alert({ color: 'danger', dismissible: true }, 'Derleme başarısız oldu. Bağlantı raporunu denetleyin.'),
)`, { align: 'stretch' }),

      h2('Ne zaman kullanmalı'),
      p(
        'Bildirim, okurun az önce yaptığı bir şeyi onaylamak içindir. Üzerine işlem yapması ya da dikkatle okuması gereken hiçbir şey için doğru yer değildir — kaybolur, gözden kaçması kolaydır ve statik bir sitede çoğu ileti, bir ',
        code('alert()'),
        ' olarak sayfanın kendisine aittir.',
      ),

      h2('Proplar'),
      p(code('toasts()'), ' kendine ait prop almaz. ', code('sitelo/ui/client'), ' içindeki ', code('toast()'), ':'),
      propsTable([
        ['message', 'string', '', 'Metin. textContent olarak ayarlanır, bu yüzden hiçbir zaman biçimlendirme olarak ayrıştırılmaz.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Hangi paletin kullanılacağı.'],
        ['duration', 'number', '4000', 'Kaybolmadan önceki milisaniye. 0 onu yukarıda tutar.'],
      ], { headers: ['Argüman', 'Tür', 'Varsayılan', 'Açıklama'] }),
      p(
        'Eklediği öğeyi döndürür; sayfada ',
        code('toasts()'),
        ' bölgesi yoksa ',
        code('null'),
        ' döndürür.',
      ),
    ],
  })
