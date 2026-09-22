import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Düzyazı',
    description:
      'Sizin yazmadığınız bir HTML bloğunu biçimlendirin — Markdown çıktısı, bir CMS alanı, bir RSS açıklaması.',
    activeHref: '/tr/ui/prose',
    children: [
      p(
        'Bir Markdown işleyicisi size çıplak etiketler verir: ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — tutunacak hiçbir sınıf olmadan. ',
        code('prose()'),
        ' o HTML’i sarar ve biçimlendirir.',
      ),
      p(
        'Bu, kitaplıktaki tek bilinçli istisnadır. Başka her yerde biçimlendirme, tam da sizin seçmediğiniz biçimlendirmeye hiç dokunmasın diye ',
        code('su-'),
        ' sınıflarıyla sınırlandırılmıştır; burada hedeflenecek sınıf olmadığından kurallar çıplak etiketlerle eşleşir — ama yalnızca sarmalayıcının içinde.',
      ),

      h2('Temel düzyazı'),
      demo(`prose(
  '<h2>Başlarken</h2>' +
  '<p>HTML döndüren bir fonksiyon yazın. <code>sitelo build</code> çalıştırın. <code>dist/</code> dizinini yayımlayın.</p>' +
  '<ul><li>Dosya tabanlı yönlendirme</li><li>Derleme zamanı veri</li><li>İstemci çalışma zamanı yok</li></ul>'
)`, { align: 'stretch' }),

      h2('Biçimlendirdiği her şey'),
      demo(`prose(
  '<h3>Bir başlık</h3>' +
  '<p><a href="/docs">bir bağlantı</a>, <strong>kalın</strong> ve <code>satır içi kod</code> içeren gövde metni.</p>' +
  '<blockquote><p>Çevresindeki metinden ayrılmış bir alıntı.</p></blockquote>' +
  '<ol><li>Birinci</li><li>İkinci<ul><li>İç içe</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Selam&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Seçenek</th><th>Varsayılan</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Aramak için <kbd>⌘</kbd> <kbd>K</kbd> tuşlarına basın.</p>'
)`, { align: 'stretch' }),

      h2('Boyutlar'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Küçük</strong> — bir kart özeti ya da kenar çubuğu için.</p>'),
  prose('<p><strong>Orta</strong> — varsayılan, makale gövde metni için.</p>'),
  prose({ size: 'lg' }, '<p><strong>Büyük</strong> — kısa, öne çıkan bir giriş için.</p>'),
)`, { align: 'stretch' }),

      h2('Bir Markdown blogla'),
      p(
        'Blog örneğinin istediği biçim: Markdown’ı derleme sırasında işleyin, sonucu sarın ve yayımlayın.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'tr' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked, üzerinde hiç sınıf olmayan bir HTML dizesi döndürür
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Düzyazı içinde bileşenler'),
      p(
        'Her düzyazı kuralı, bir ',
        code('su-'),
        ' sınıfı taşıyan öğeleri dışarıda bırakır; böylece bir düzyazı bloğuna bırakılan bir bileşen, makale kenar boşluklarını almak yerine kendi biçimlendirmesini korur.',
      ),
      demo(`prose(
  '<p>Biraz işlenmiş Markdown, sonra bir bileşen:</p>',
  alert({ color: 'warning', title: 'Hâlâ normal bir uyarı' },
    'Çevresindeki düzyazı bloğu tarafından yeniden biçimlendirilmez.'),
  '<p>Ve düzyazıya dönüş.</p>',
)`, { align: 'stretch' }),

      h2('Güven üzerine bir söz'),
      p(
        code('prose()'),
        ' çocuklarını HTML olarak işler — bütün mesele budur ve ',
        code('javascript-to-html'),
        ' baştan sona böyle çalışır. HTML denetiminizde olmayan bir yerden geliyorsa buraya gelmeden önce temizleyin. Ham HTML’i kapatılmış bir Markdown işleyicisi genellikle yeterlidir.',
      ),

      h2('Proplar'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Temel yazı boyutu; geri kalan her şey ondan em cinsinden ölçeklenir.'],
        ['as', 'string', "'div'", 'İşlenecek öğe, örneğin article.'],
      ]),
    ],
  })
