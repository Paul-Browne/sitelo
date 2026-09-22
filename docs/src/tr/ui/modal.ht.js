import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'Popover API üzerine kurulu bir iletişim kutusu — açılmayı, arka planı, dışarı tıklamayı ve Escape’i tarayıcı halleder.',
    activeHref: '/tr/ui/modal',
    children: [
      p(
        'Kip bir ',
        code('popover'),
        ' öğesidir. ',
        code('popovertarget'),
        ' değeri kipin ',
        code('id'),
        ' değeriyle eşleşen herhangi bir düğme onu açar — hiçbir yerde betik yok; arka plan, hafif kapatma, Escape ve odak yönetimi dahil, hepsi tarayıcının işi.',
      ),
      p(
        code('id'),
        ' değerinin zorunlu olmasının ve bileşenin o olmadan hata fırlatmasının nedeni budur: kimlik, bağlantının tamamıdır.',
      ),

      h2('Temel kip'),
      p('Bu sayfadaki her kip gerçekten açılır — deneyin.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Kipi aç'),
  modal({ id: 'demo-basic', title: 'Site yeniden derlensin mi?' },
    'Bu, sitelo build çalıştırır ve dist/ dizinini yeniden yayımlar.',
  ),
)`),

      h2('Alt bilgiyle'),
      p(
        'Kapatma düğmesi, aynı kimliği gösteren ve ',
        code('popovertargetaction="hide"'),
        ' taşıyan herhangi bir düğmedir.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Sayfayı sil…'),
  modal({
    id: 'demo-confirm',
    title: 'Bu sayfa silinsin mi?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Vazgeç'),
      button({ color: 'danger' }, 'Sil'),
    ),
  }, 'Bu geri alınamaz. Üretilen HTML bir sonraki derlemede kaldırılır.'),
)`),

      h2('Boyutlar'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Küçük'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Orta'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Büyük'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Küçük' }, 'size: sm — yaklaşık 24rem.'),
  modal({ id: 'demo-md', title: 'Orta' }, 'Varsayılan — yaklaşık 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Büyük' }, 'size: lg — yaklaşık 48rem.'),
)`),

      h2('Kip içinde formlar'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'Yeni sayfa…'),
  modal({
    id: 'demo-form',
    title: 'Yeni sayfa',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Vazgeç'),
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
        ' köşedeki × işaretini kaldırır. Escape ve dışarı tıklamak yine kapatır — bir popover gerçekten engelleyici kılınamaz ve zaten çoğunlukla doğru davranış budur.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'Kapatma düğmesi yok'),
  modal({ id: 'demo-bare', title: 'Escape’e basın', closable: false },
    'Ya da bu iletişim kutusunun dışında bir yere tıklayın.',
  ),
)`),

      h2('Uzun içerik'),
      p('Gövde kaydırılır; başlık ve alt bilgi yerinde kalır.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Uzun kip'),
  modal({
    id: 'demo-long',
    title: 'Sürüm notları',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Kapat'),
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
        'Açık bir kipin ardındaki sayfa kaydırılmaz. Popover API’sinin size bıraktığı tek şey budur ve burada CSS ile yapılır — betik yok, başlatılacak bir şey yok. Arka planın her zamanki gibi kaydırılmasına izin vermek için ',
        code('lockScroll: false'),
        ' geçirin.',
      ),

      h2('Tarayıcı desteği'),
      p(
        'Popover API’si her güncel tarayıcıda bulunur. Onu bilmeyecek kadar eski bir tarayıcıda kip, sayfanın üstünde değil içinde satır içi işlenir — görünür ve kullanılabilir, yalnızca üste bindirilmemiş. Hiçbir şey kaybolmaz.',
      ),

      h2('Proplar'),
      propsTable([
        ['id', 'string', '', 'Zorunlu. Bir tetikleyicinin popovertarget değerinin gösterdiği şey.'],
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
