import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Geçiş grubu',
    description:
      'Bölmeli bir denetim: tek bir denetime birleştirilmiş geçiş düğmeleri ya da her bölmesi kendi sayfası olan bağlantılar.',
    activeHref: '/tr/ui/toggle-group',
    children: [
      p(
        'Geçiş grubu, tek bir denetim gibi okunan bir seçenek sırasıdır. Onu ',
        code('items'),
        ' propundan kurun ve hangisinin açık olduğunu ',
        code('value'),
        ' ile söyleyin.',
      ),

      h2('Temel grup'),
      demo(`toggleGroup({
  label: 'Metin hizalaması',
  value: 'center',
  items: [
    { value: 'left', label: 'Sol' },
    { value: 'center', label: 'Orta' },
    { value: 'right', label: 'Sağ' },
  ],
})`),

      h2('Düz dizeler'),
      demo(`toggleGroup({ label: 'Yoğunluk', value: 'ferah', items: ['sıkı', 'ferah', 'geniş'] })`),

      h2('Bağlantılar'),
      p(
        'Statik bir sitenin genellikle istediği biçim budur: her bölme bir sayfadır. ',
        code('href'),
        ' taşıyan öğeler çapa olarak işlenir ve etkin olan ',
        code('aria-pressed'),
        ' değil ',
        code('aria-current="page"'),
        ' ile işaretlenir, çünkü bağlantı, içeri bastığınız bir düğme değildir.',
      ),
      demo(`toggleGroup({
  label: 'Bölüm',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Belgeler', href: '/docs' },
    { value: 'ui', label: 'UI', href: '/ui' },
    { value: 'examples', label: 'Örnekler', href: '/examples' },
  ],
})`),

      h2('Birden fazlası açık'),
      p(
        code('value'),
        ' olarak bir dizi geçirin. Kap her hâlükârda düz bir ',
        code('group'),
        ' öğesidir — bir ',
        code('radiogroup'),
        ' yanlış olurdu, çünkü bunlar radyo değil basılı düğmelerdir.',
      ),
      demo(`toggleGroup({
  label: 'Biçimlendirme',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Kalın' },
    { value: 'italic', label: 'Eğik' },
    { value: 'underline', label: 'Altı çizili' },
  ],
})`),

      h2('Boyutlar ve türevler'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Küçük', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Orta', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Büyük', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Devre dışı öğeler'),
      demo(`toggleGroup({
  label: 'İşleyici',
  value: 'static',
  items: [
    { value: 'static', label: 'Statik' },
    { value: 'islands', label: 'Adalar' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('Bir araç çubuğunda'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Hizalama', value: 'Sol', size: 'sm', items: ['Sol', 'Orta', 'Sağ'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Biçem', value: ['Kalın'], size: 'sm', items: ['Kalın', 'Eğik'] }),
)`),

      h2('Ne zaman başka bir şey kullanmalı'),
      p(
        'Seçim bir formla gönderiliyorsa ',
        code('choiceGroup()'),
        ' kullanın — gerçek radyolar, betik gerekmez. Her bölme bir sayfaysa yukarıdaki bağlantı biçimini tercih edin. Geçiş grubu, sayfanın kendisinin üzerine işlem yaptığı bir seçim içindir.',
      ),

      h2('Proplar'),
      propsTable([
        ['items', 'Array', '[]', 'Dizeler ya da { value, label, href, disabled } nesneleri.'],
        ['value', 'string | number | Array', '', 'Hangi öğenin açık olduğu. Birkaçı olabiliyorsa bir dizi.'],
        ['label', 'string', '', 'Grup için erişilebilir ad.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Her öğeye uygulanır.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Kapalı bir öğenin görünüşü.'],
      ]),
    ],
  })
