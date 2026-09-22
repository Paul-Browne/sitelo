import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Uygulama çubuğu',
    description:
      'Bir sitenin en üstündeki çubuk: bir yanda marka, öbür yanda gezinme ve eylemler.',
    activeHref: '/tr/ui/app-bar',
    children: [
      p(
        'Bir uygulama çubuğu, içinde bir satır bulunan bir ',
        code('<header>'),
        ' öğesidir. Parçalar ayrıdır, böylece onları siz dizersiniz: bağlantılar için ',
        code('appBarNav()'),
        ', ardından geleni en uca itmek için ',
        code('appBarSpacer()'),
        ' ve sondaki düğmeler için ',
        code('appBarActions()'),
        '.',
      ),

      h2('Temel uygulama çubuğu'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Giriş yap'),
  ),
)`, { align: 'stretch' }),

      h2('Gezinmeyle birlikte'),
      p(
        code('navLink()'),
        ' bir çubuğa uygun bağlantı biçemidir; ',
        code('current'),
        ' etkin sayfayı renkle olduğu kadar ',
        code('aria-current'),
        ' ile de işaretler.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Belgeler'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Örnekler'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Başlayın'),
  ),
)`, { align: 'stretch' }),

      h2('İşaretli bir marka'),
      p(
        'Marka her tür biçimlendirmeyi alır ve ',
        code('href'),
        ' aksini söylemedikçe ',
        code('/'),
        ' adresine bağlanır.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Yapışkan ve bulanık'),
      p(
        code('sticky'),
        ' çubuğu kaydırma kabının üstüne sabitler; ',
        code('blur'),
        ' onu yarı saydam yapar, böylece içerik altından geçer. İkisi de burada sayfanın kendisinde değil, kaydırılan bir kutu içinde gösteriliyor.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'yapışkan')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Beni kaydırın — paragraf ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Küçük ekranlarda çekmeceyle'),
      p(
        'Alışıldık kalıp: masaüstünde çubuktaki bağlantılar, telefonda bir ',
        code('drawer()'),
        ' açan bir düğme. Çekmece bir popover’dır, bu yüzden düğmenin betiğe ihtiyacı yoktur.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Gezinmeyi aç',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'app-bar-drawer',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Gezinme' },
    navLink({ href: '#docs' }, 'Belgeler'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Örnekler'),
  ),
)`, { align: 'stretch' }),

      h2('Proplar'),
      p(code('appBar()'), ':'),
      propsTable([
        ['brand', 'Child', '', 'Baştaki marka bağlantısının içeriği.'],
        ['href', 'string', "'/'", 'Markanın bağlandığı yer.'],
        ['sticky', 'boolean', 'false', 'Kaydırmada çubuğu üste sabitler.'],
        ['blur', 'boolean', 'false', 'Arka plan bulanıklığıyla yarı saydam zemin.'],
        ['as', 'string', "'header'", 'İşlenecek öğe.'],
      ]),
      p('Parçalar:'),
      propsTable([
        ['appBarNav', '', '', 'Bağlantıları tutan bir nav öğesi.'],
        ['appBarSpacer', '', '', 'Esnek boşluk; ardından gelen her şey en uca gider.'],
        ['appBarActions', '', '', 'Sondaki düğme kümesi.'],
        ['navLink', 'href, current, color', '', 'Çubuk için biçimlendirilmiş bir bağlantı; current etkin sayfayı işaretler.'],
      ], { headers: ['Parça', 'Proplar', 'Varsayılan', 'Açıklama'] }),
    ],
  })
