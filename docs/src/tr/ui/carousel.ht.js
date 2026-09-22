import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Karusel',
    description:
      'Kaydırarak geçtiğiniz, giderken yerine oturan slaytlar — ve stil sayfasının tarayıcıdan çizmesini istediği noktalar ile oklar.',
    activeHref: '/tr/ui/carousel',
    children: [
      p(
        'Buradaki karusel, bir kaydırma kabı ve yerine oturan bir slayt sırasıdır. Bu kadarını her tarayıcı zaten yapmayı bilir: kaydırma, izleme yüzeyi, shift-tekerlek ve ok tuşları ilk boyamada, hiçbir şey yüklenmeden ve hidrasyona gerek kalmadan çalışır.',
      ),
      p(
        'Tarayıcının elverdiği yerde noktalar ve oklar hiç biçimlendirme değildir. Her slaytta ',
        code('::scroll-marker'),
        ' ve pistte ',
        code('::scroll-button()'),
        ' olarak dururlar — stil sayfasının istediği, tarayıcının sonra çizdiği, adlandırdığı, kaydırma konumuna bağladığı, geçerli olanı işaretlediği ve uçlarda devre dışı bıraktığı sözde öğeler. Bu bileşende tek bir ',
        code('data-'),
        ' özniteliği ve içe aktarılacak tek bir modül yoktur: durum, kaydırma konumudur ve tarayıcıda zaten vardır.',
      ),
      p(
        'Elvermediği yerde işlenmiş bir nokta sırası devreye girer: slayt başına bir bağlantı; tek başına çalışır ve yerli noktalar gibi davranmak için ilk kaydırmada ya da ilk dokunuşta birkaç yüz bayt betiğe uzanır — kaydırmayı izlemek ve sayfayı kıpırdatmadan pisti hareket ettirmek için.',
      ),

      h2('Her seferinde bir tane'),
      p(
        'Varsayılan. Her slayt pisti doldurur, başa oturur ve üç slayt ileri uçmak yerine orada durur.',
      ),
      demo(`carousel({
  items: ['Kıyı', 'Liman', 'Tarlalar', 'Eski şehir'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('Her seferinde birkaç tane'),
      p(
        code('perView'),
        ' pisti kaç slaytın dolduracağıdır, ',
        code('min'),
        ' ise birinin ne kadar darlaşabileceğinin alt sınırıdır. Bu alt sınır bir medya sorgusunun yerini tutar: bir slaytın pistteki payı onun altına düştüğünde slaytlar o genişlikte kalır ve daha azı sığar — ',
        code('grid()'),
        ' işlevinin auto-fit ile oynadığı aynı oyun.',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['Yönlendirme', 'Veri', 'Varlıklar', 'Görseller', 'Adalar', 'Arama'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, 'Rehber'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('Sonrakinden bir kırpıntı'),
      p(
        'Kesirli bir ',
        code('perView'),
        ' sonraki slayttan ince bir şerit gösterir; hiçbir süs olmadan “bu kaydırılır” demenin en ucuz yolu budur.',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['Bir', 'İki', 'Üç'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('Kendi kesme noktanız olmadan duyarlılık'),
      p(
        code('perView'),
        ' bir özel özellik olarak yazılır, bu yüzden bir medya sorgusu onu biçimlendirmeye dokunmadan — ve bileşenin sizin kesme noktalarınızı bilmesine gerek kalmadan — değiştirebilir:',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('Yerine oturma'),
      p(
        'Yerine oturma varsayılan olarak ',
        code('mandatory'),
        ' değerindedir: bir kaydırma hep bir slaytta durur. ',
        code("snap: 'proximity'"),
        ' onu yalnızca birine yakın bittiğinde çeker, ',
        code('snap: false'),
        ' ise pisti serbestçe kaydırır — ikisinin arasına inmenin sorun olmadığı, küçük şeylerden oluşan bir sıranın istediği budur.',
      ),
      demo(`carousel({
  snap: false,
  perView: 4,
  min: '7rem',
  gap: 'sm',
  arrows: false,
  items: ['sitelo', 'vite', 'pagefind', 'sharp', 'lighthouse', 'rollup', 'esbuild'].map((name) =>
    chip({ size: 'lg', color: 'neutral', style: 'width: 100%; justify-content: center' }, name)),
})`, { align: 'stretch' }),

      h2('Noktalar ve oklar nereye gider'),
      p(
        'İkisi de isteğe bağlıdır ve ikisi de varsayılan olarak açıktır. Noktaları kapatmak pistin kaydırma çubuğunu geri getirir, çünkü ikisi de olmayan bir karusel, kaydırıldığını söyleyecek hiçbir şeyi olmayan bir kaydırıcı olurdu.',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['Yalnızca noktalar', 'İkinci', 'Üçüncü'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['Yalnızca oklar', 'İkinci', 'Üçüncü'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('Tarayıcıda kaydırma işaretleyicileri yokken'),
      p(
        'O zaman noktalar gerçek bağlantılardır, slayt başına bir tane, her biri o slaytın kimliğini gösterir — her slayta bir kimlik verilmesinin nedeni budur. Bu kadarı hiçbir şey yüklenmeden çalışır: birine dokunmak pisti kendi slaytına kaydırır, çünkü bir parçayı izlemek tarayıcının zaten yaptığı bir şeydir.',
      ),
      p(
        'İlk kaydırmada ya da ilk dokunuşta pist ve noktalar kendi olay özniteliklerinden ',
        code('/su/carousel.js'),
        ' dosyasına uzanır — buradaki her bileşenin kendi modülüne uzanma biçimi budur; böylece kimsenin dokunmadığı bir sayfada hiçbir şey getirilmez ve yerli işaretleyicilerin zaten bulunduğu yerde hiçbir şey getirilmez. O andan sonra iş iki yönlü yürür: noktalar kaydırmayı izler — onu ne hareket ettirdiyse: bir kaydırma, bir izleme yüzeyi, ok tuşları, bir kaydırma çubuğu sürüklemesi — ve bir noktaya dokunmak pisti kaydırır, sayfayı olduğu yerde bırakır.',
      ),
      p(
        'Bu son bölüm betiğin asıl varlık nedenidir. Çıplak bir parça, pistle birlikte pencereyi de slayta taşır; ve kendisine dokunan parmağın altından sayfayı kaçıran bir karusel, kimsenin nokta derken kastettiği şey değildir. Tıklama, içe aktarmanın içinde değil öznitelikte iptal edilir, çünkü dinamik bir içe aktarma bir an sonra yerine oturur ve o ana dek tarayıcı bağlantıyı çoktan izlemiştir. ',
        code('scrollMargin'),
        ' geriye kalan tek durumda pencerenin nereye ineceğidir: JavaScript kapalı, bağlantının hâlâ yalnızca bir bağlantı olduğu durum.',
      ),
      p(
        'Gösterdikleri kimlikler ',
        code('name'),
        ' değerinden ya da karuselin kendi ',
        code('id'),
        ' değerinden gelir; ikisi de yoksa slaytların bir özetinden — böylece bir sayfadaki iki karusel, hiçbiri öbüründen haberdar edilmeden çakışmaz. Belirli bir slayt başka bir yerden bağlanmaya değerse ona kendi ',
        code('id'),
        ' değerini verin.',
      ),

      h2('Slaytları adlandırmak'),
      p(
        'Her nokta kendi slaytının adını taşır, çünkü nokta bir denetimdir ve adı olmayan bir denetim, bir ekran okuyucunun ancak “düğme” diyebileceği bir düğmedir. Varsayılan olarak ad, slaytın numarasıdır. Daha iyi bir ad vermek için bir öğeyi nesne olarak geçirin ya da onları kendi sözcüklerinizle numaralamak için ',
        code('slideLabel'),
        ' kullanın.',
      ),
      demo(`carousel({
  label: 'Ürün çekimleri',
  perView: 2,
  min: '10rem',
  items: [
    { label: 'Mutfak', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Mutfak'))) },
    { label: 'Teras', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Teras'))) },
    { label: 'Bahçe', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Bahçe'))) },
  ],
})`, { align: 'stretch' }),

      h2('Kendiniz sürmek'),
      p(
        'Bir karuseli sayfanın hareket ettirdiği durumlar için iki fonksiyon — bir “fotoğrafları gör” düğmesi, bir formdaki bir adım, sayfanın başka bir yerindeki bir bağlantı:',
      ),
      codeBlock('src/main.js', `import { setSlide, getSlide } from 'sitelo/ui/client'

setSlide('gallery', 2)  // üçüncü slayta kaydırır ve noktasını işaretler
getSlide('gallery')     // 2`, 'javascript'),
      p(
        'Ya da bir olay özniteliğinden, sayfaya hiçbir şey paketlenmeden:',
      ),
      codeBlock('Herhangi bir yer', `button({ onclick: "import('/su/carousel.js').then(m=>m.set('gallery',0))" }, 'Başa dön')`, 'javascript'),

      h2('Bunun yapmadıkları'),
      p(
        'İlk slayta geri dönmez ve kendi başına ilerlemez. İkisi de CSS’in yapabileceği şeyler değildir, bu yüzden ikisi de burada yoktur — dönen ya da kendiliğinden oynayan bir karusel bir betik ister ve bu bileşen, bir sayfanın betik yüklemesinin nedeni olmamayı yeğler. Kendiliğinden ilerleme zaten kaybedilmeye değer: birinin okuduğu şeyi altından çekip alır.',
      ),
      p(
        'JavaScript kapalıyken ayrıca pist kaydırıldıktan sonra hangi slaytın göründüğünü işaretleyemez ve sayfayı kıpırdatmadan birine ulaşamaz. İlk nokta derleme sırasında işaretlenir, çünkü durağanken görünen slayt odur; bundan sonra bunu doğru tutmak yalnızca betiğin yapabileceği tek iştir. Kaydırma, izleme yüzeyi ve tuşlar her hâlükârda çalışır.',
      ),

      h2('Erişilebilirlik'),
      p(
        'Pist, ',
        code('tabindex="0"'),
        ' taşıyan etiketli bir gruptur; böylece bir klavye kaydırılabilir bölgeye ulaşabilir ve yalnızca kaydırıcılara kendiliğinden odaklananlarda değil, her motorda ok tuşlarıyla dolaşabilir. Bir sayfada birden fazlası varsa onu ',
        code('label'),
        ' ile adlandırın.',
      ),
      p(
        'Tarayıcının onları çizdiği yerde noktalar bir sekme listesi, oklar ise her uçta kendilerini devre dışı bırakan düğmeler olarak açılır — bunların hepsini tarayıcı kurar, bu yüzden hiçbiri gerçekten görünen slayttan kopamaz. Bu biçimin betikli bir biçime karşı savunması budur: yanlış gidebilecek ikinci bir durum kopyası yoktur.',
      ),
      p(
        'Yedek noktalar bağlantıdır, her biri kendi slaytının adını taşır ve her biri noktanın göründüğü 8 pikselin değil, 24 pikselin hedefidir. Görünen slayt ',
        code('aria-current'),
        ' taşır; bu hem bir ekran okuyucunun okuduğu hem de stil sayfasının renklendirdiği şeydir — çelişebilecek iki durum yerine doğru tutulacak tek bir durum. Durağanken görünen slayt o olduğundan ilk noktaya işlenir ve oradan kaydırmayla birlikte yürür. Yerli işaretleyicilerin onların yerini aldığı yerde bağlantılar ',
        code('display: none'),
        ' olur, böylece iki kez okunmak yerine erişilebilirlik ağacını da resimle birlikte terk ederler.',
      ),

      h2('Proplar'),
      propsTable([
        ['items', 'Array', '[]', 'Slaytlar. Bir çocuk ya da slayt için başka öznitelikler taşıyan { label, content }. Çocuklar da slayttır ve öğeleri izler.'],
        ['perView', 'number', '1', 'Pisti kaç slaytın dolduracağı. Kesirli değer sonrakinden bir kırpıntı bırakır.'],
        ['min', 'string', '', 'Bir slaytın genişliğinin alt sınırı, böylece dar bir ekran daha ince değil daha az gösterir.'],
        ['gap', 'Space', "'md'", 'Slaytlar arasında.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Bir slaytın nerede durduğu.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'Kaydırmanın bir slayta ne kadar sıkı oturduğu.'],
        ['dots', 'boolean', 'true', 'Pistin altındaki noktalar — tarayıcıda varsa yerli kaydırma işaretleyicileri, yoksa slayt başına bir bağlantı, küçük bir modülle geliştirilmiş. Kapalı olması kaydırma çubuğunu geri getirir ve hiçbir betik istemez.'],
        ['arrows', 'boolean', 'true', 'Pistin üzerindeki oklar.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Görünen slaytın noktasının rengi.'],
        ['label', 'string', "'Carousel'", 'Kaydırılabilir bölge için erişilebilir ad.'],
        ['previousLabel', 'string', "'Previous slide'", 'Geri oku için erişilebilir ad.'],
        ['nextLabel', 'string', "'Next slide'", 'İleri oku için erişilebilir ad.'],
        ['slideLabel', '(index, count) => string', 'numara', 'Kendini adlandırmamış bir slaytı adlandırır.'],
        ['name', 'string', 'karusel kimliği, yoksa bir özet', 'Yedek noktaların bağlandığı slayt kimlikleri için önek.'],
        ['scrollMargin', 'Space', "'lg'", 'Bir yedek nokta pencereyi oraya götürdüğünde bir slaytın ne kadar üstünde durduğu.'],
        ['as', 'string', "'div'", 'İşlenecek öğe.'],
      ]),
    ],
  })
