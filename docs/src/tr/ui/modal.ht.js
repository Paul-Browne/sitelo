import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'Kip olarak açılan gerçek bir <dialog> — arka planı, odağı, Escape’i ve dışarı tıklamayı tarayıcı halleder.',
    activeHref: '/tr/ui/modal',
    children: [
      p(
        'Kip bir ',
        code('<dialog>'),
        ' öğesidir. ',
        code('commandfor'),
        ' değeri kipin ',
        code('id'),
        ' değerini gösteren ve ',
        code("command: 'show-modal'"),
        ' taşıyan herhangi bir düğme onu kip olarak açar: arkadaki sayfa etkisiz (inert) hale gelir, böylece odak ve ekran okuyucu içeride kalır. Hiçbir yerde betik yok; arka plan, Escape ve dışarı tıklama tarayıcının işi.',
      ),
      p(
        code('id'),
        ' değerinin zorunlu olmasının ve bileşenin o olmadan hata fırlatmasının nedeni budur: kimlik, bağlantının tamamıdır.',
      ),

      h2('Temel kip'),
      p('Bu sayfadaki her kip gerçekten açılır — deneyin.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Kipi aç'),
  modal({ id: 'demo-basic', title: 'Site yeniden derlensin mi?' },
    'Bu, sitelo build çalıştırır ve dist/ dizinini yeniden yayımlar.',
  ),
)`),

      h2('Alt bilgiyle'),
      p(
        'Kapatma düğmesi, aynı kimliği gösteren ve ',
        code("command: 'close'"),
        ' taşıyan herhangi bir düğmedir.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Sayfayı sil…'),
  modal({
    id: 'demo-confirm',
    title: 'Bu sayfa silinsin mi?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Vazgeç'),
      button({ color: 'danger' }, 'Sil'),
    ),
  }, 'Bu geri alınamaz. Üretilen HTML bir sonraki derlemede kaldırılır.'),
)`),

      h2('Boyutlar'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Küçük'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Orta'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Büyük'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Küçük' }, 'size: sm — yaklaşık 24rem.'),
  modal({ id: 'demo-md', title: 'Orta' }, 'Varsayılan — yaklaşık 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Büyük' }, 'size: lg — yaklaşık 48rem.'),
)`),

      h2('Kip içinde formlar'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'Yeni sayfa…'),
  modal({
    id: 'demo-form',
    title: 'Yeni sayfa',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Vazgeç'),
      button({ type: 'submit' }, 'Oluştur'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Başlık', name: 'modal-title', placeholder: 'Hakkında' }),
      selectField({ label: 'Uzantı', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Kapatma düğmesi olmadan'),
      p(
        code('closable: false'),
        ' köşedeki × işaretini kaldırır. Escape ve dışarı tıklamak yine kapatır; ',
        code("closedby: 'closerequest'"),
        ' ile yalnızca Escape kapatır.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'Kapatma düğmesi yok'),
  modal({ id: 'demo-bare', title: 'Escape’e basın', closable: false },
    'Ya da bu iletişim kutusunun dışında bir yere tıklayın.',
  ),
)`),

      h2('Uzun içerik'),
      p('Gövde kaydırılır; başlık ve alt bilgi yerinde kalır.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Uzun kip'),
  modal({
    id: 'demo-long',
    title: 'Sürüm notları',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Kapat'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, (index + 1) + '. değişiklik — bir şey düzeltildi.'),
      ),
    ),
  ),
)`),

      h2('Arka planın kaydırılması'),
      p(
        'Açık bir kipin ardındaki sayfa kaydırılmaz. Kipli bir iletişim kutusunun size bıraktığı tek şey budur ve burada CSS ile yapılır — betik yok, başlatılacak bir şey yok. Arka planın her zamanki gibi kaydırılmasına izin vermek için ',
        code('lockScroll: false'),
        ' geçirin.',
      ),

      h2('Tarayıcı desteği'),
      p(
        'Bir iletişim kutusunu düğmenin command değeriyle açmak her güncel tarayıcıda çalışır — Chrome 135, Firefox 144 ve Safari 26.2 ve sonrası. Daha eski bir tarayıcıda button(), aynı işi yapmak için birkaç yüz baytlık /su/dialog.js dosyasını yükleyen bir onclick ekler — yalnızca orada ve yalnızca ilk tıklamada. Dışarı tıklayınca kapatmayı (closedby) Safari henüz desteklemiyor; orada da bunu aynı dosya üstlenir.',
      ),

      h2('Proplar'),
      propsTable([
        ['id', 'string', '', 'Zorunlu. Bir tetikleyicinin commandfor değerinin gösterdiği şey.'],
        ['title', 'Child', '', 'Başlık ve iletişim kutusunun erişilebilir adı.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'En büyük genişlik.'],
        ['footer', 'Child', '', 'Kendi renkli şeridinde alt satır.'],
        ['closable', 'boolean', 'true', 'Başlıkta × gösterir.'],
        ['closeLabel', 'string', "'Close'", 'O düğme için erişilebilir ad.'],
        ['lockScroll', 'boolean', 'true', 'Açıkken ardındaki sayfanın kaydırılmasını durdurur.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' kendiniz kurduğunuz bir başlık için o × işaretini tek başına işler.',
      ),
    ],
  })
