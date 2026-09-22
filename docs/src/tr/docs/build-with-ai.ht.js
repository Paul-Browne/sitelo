import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/tr.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('tr')

export default () =>
  docsLayout({
    title: 'Yapay zekâ ile geliştirme',
    description:
      'llms.txt, proje kuralları ve pratik ipuçlarıyla kodlama ajanlarına güncel sitelo bilgisi verin.',
    activeHref: '/tr/docs/build-with-ai',
    children: [
      p(
        'Yapay zekâ destekli düzenleyiciler ve kodlama ajanları sitelo konusunda sık sık yanlış tahmin eder — geçerli olmayan React, Next ya da Astro kalıplarına uzanırlar. Bu rehber, onları güncel sitelo belgelerine nasıl yönlendireceğinizi ve üretilen kodu modele uygun tutmayı gösterir.',
      ),
      h2('llms.txt'),
      p(
        'sitelo, frameworkün makine tarafından okunabilir bir özetini ',
        a({ href: '/llms.txt' }, 'sitelo.dev/llms.txt'),
        ' adresinde yayımlar. Birçok ajan bir URL getirebilir; sitelo kodu yazmadan önce sizinkinden bu dosyayı (ve insanlar için yazılmış belgeleri) okumasını isteyin.',
      ),
      ul(
        { class: 'docs-list' },
        li(a({ href: '/llms.txt' }, 'https://sitelo.dev/llms.txt'), ' — derli toplu API ve kurallar'),
        li(a({ href: '/tr/docs' }, 'https://sitelo.dev/docs'), ' — tüm rehberler'),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub README'),
          ' — zihinsel model ve özelliklere genel bakış',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — ',
          code('javascript-to-html'),
          ' belgeleri (JS içinde HTML yazmak için önerilir)',
        ),
      ),
      p(
        'Bir belge MCP sunucusunun aksine ',
        code('llms.txt'),
        ' kurulum gerektirmez — URL’i sohbete yapıştırın, proje kurallarına ekleyin ya da ajanın getirmesine izin verin.',
      ),
      h2('Proje kuralları'),
      p(
        'Aracınız kalıcı yönergeleri destekliyorsa (',
        code('AGENTS.md'),
        ', Cursor kuralları, Copilot yönergeleri, …), her oturumun doğru zihinsel modelle başlaması için kısa bir sitelo kuralı ekleyin. ',
        a({ href: '/tr/examples/basic' }, 'Temel örnek'),
        ', kopyalayabileceğiniz bir ',
        code('AGENTS.md'),
        ' içerir:',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Projenizde ',
        code('.cursor/rules/sitelo.mdc'),
        ' oluşturun (ya da aynı metni Cursor’ın proje kuralları arayüzüne yapıştırın):',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Yapay zekâ destekli sitelo çalışması için ipuçları'),
      ul(
        { class: 'docs-list' },
        li(
          'Bir şablondan başlayın — ajandan bir framework uydurmak yerine ',
          a({ href: '/tr/examples/basic' }, 'examples/basic'),
          ' ya da ',
          a({ href: '/tr/examples/wordpress' }, 'examples/wordpress'),
          ' üzerinden iskelet kurmasını isteyin.',
        ),
        li(
          'Biçimlendirme için ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          ') tercih edin — şablon motoru ya da React olmadan HTML dizeleri döndüren etiket fonksiyonları. JSX bileşen ağaçları uydurmasınlar diye ajanları ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ' adresine yönlendirin.',
        ),
        li(
          'Sayfalar HTML döndüren fonksiyonlardır — ',
          code('export default () => `<html>…</html>`'),
          ' ya da ',
          code('javascript-to-html'),
          ' ile birleştirin. Dizelere derlendiği sürece JSX de olur; React çalışma zamanı gerekmez.',
        ),
        li(
          'Özel bir Vite yapılandırmasına ihtiyacınız olduğunu bilmiyorsanız doğrudan ',
          code('vite'),
          ' değil, sitelo’nun CLI’ını kullanın — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          '.',
        ),
        li(
          'API’leri ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' ile doğrulayın — özellikle ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ' ve ',
          a({ href: '/tr/docs/islands' }, 'sunucu adaları'),
          '.',
        ),
        li(
          'Varsayılan olarak sıfır JS — yalnızca sayfanın istemci koduna ihtiyacı olduğunda bir ',
          code('<script>'),
          ' bağlayın; başvurulmayan modüller sunucuda kalır.',
        ),
        li(
          'İnceleyin ve çalıştırın — ajan sayfaları düzenledikten sonra her zaman ',
          code('sitelo build'),
          ' (ya da geliştirme sunucusunu) çalıştırın; üretilen biçimlendirmeyi taslak sayın.',
        ),
      ),
      p(
        a({ href: '/tr/docs' }, 'Başlarken'),
        ' · ',
        a({ href: '/tr/examples/basic' }, 'Temel örnek'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
