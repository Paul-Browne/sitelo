import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'İpucu',
    description:
      'Üzerine gelme ve odakta kısa bir ipucu, tümüyle CSS ile çizilmiş.',
    activeHref: '/tr/ui/tooltip',
    children: [
      p(
        'İpucu metni bir veri özniteliğinde yaşar ve bir sözde öğe tarafından çizilir; bu yüzden betik yoktur, çalışma anında konumlandırılacak bir şey yoktur ve DOM’da geride bir şey kalmaz. Üzerine gelindiğinde ve klavye odağında belirir; bununla kuralın ',
        code(':focus-within'),
        ' yarısı ilgilenir.',
      ),

      h2('Temel ipucu'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'Panoya kopyala' },
    iconButton({
      label: 'Kopyala',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: 'Siteyi yeniden derle' },
    button({ variant: 'outline', color: 'neutral' }, 'Yeniden derle'),
  ),
)`),

      h2('Konum'),
      p('Varsayılan olarak üstte, üstte yer yoksa altta.'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Tetikleyicinin üstünde' },
    button({ variant: 'soft', color: 'neutral' }, 'Üst'),
  ),
  tooltip({ content: 'Tetikleyicinin altında', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Alt'),
  ),
)`),

      h2('Erişilebilir adlar'),
      p(
        'İpucu metni süstür — ekran okuyucuların güvenilir biçimde duyurmadığı CSS ',
        code('content'),
        ' değerinden çizilir. İçerideki denetimin yine de kendi erişilebilir adına ihtiyacı vardır; bunu sağlayan şey ',
        code('iconButton()'),
        ' işlevinin ',
        code('label'),
        ' propudur. İpucu, denetimin adının söylemediği bir şey söylüyorsa onu görsel olarak gizli bir span içinde yinelemek için ',
        code('label: true'),
        ' geçirin.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Hemen üretime dağıtır', label: true },
    button({ color: 'danger' }, 'Dağıt'),
  ),
)`),

      h2('Metin üzerinde'),
      p('İpucu, satır içi içeriği bir düğmeyi sardığı kadar rahat sarar.'),
      demo(`text(
  'Derleme ',
  tooltip({ content: 'outDir ile yapılandırılabilir' }, code('dist/')),
  ' dizinine yazar, başka hiçbir yere değil.',
)`, { align: 'stretch' }),

      h2('Ne zaman kullanılmamalı'),
      p(
        'İpuçları dokunmatikte belirmez ve işaretçi ayrılır ayrılmaz kaybolur. Okurun mutlaka alması gereken her şey — bir hata iletisi, zorunlu bir alanın açıklaması — bir ipucuna değil, alanın kendisindeki ',
        code('help'),
        ' metnine aittir.',
      ),

      h2('Proplar'),
      propsTable([
        ['content', 'string', '', 'İpucu metni.'],
        ['placement', "'top' | 'bottom'", "'top'", 'Tetikleyicinin hangi yanında belireceği.'],
        ['label', 'boolean', 'false', 'Metni ayrıca gizli bir span içinde ekran okuyuculara açar.'],
      ]),
    ],
  })
