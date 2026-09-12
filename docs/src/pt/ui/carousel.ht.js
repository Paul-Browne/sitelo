import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Carrossel',
    description:
      'Slides por onde se desliza, encaixando pelo caminho — e pontos e setas que a folha de estilos pede ao navegador.',
    activeHref: '/pt/ui/carousel',
    children: [
      p(
        'Um carrossel, aqui, é um contentor de deslocamento e uma fila de slides que encaixam. Isso qualquer navegador já sabe fazer: deslizar, o trackpad, shift-roda e as teclas de seta funcionam na primeira pintura, sem carregar nada e sem nada para hidratar.',
      ),
      p(
        'Onde o navegador consegue, os pontos e as setas não são marcação nenhuma. São ',
        code('::scroll-marker'),
        ' em cada slide e ',
        code('::scroll-button()'),
        ' na pista — pseudo-elementos que a folha de estilos pede e que o navegador desenha, nomeia, liga à posição de deslocamento, marca como atual e desativa nos extremos. Este componente não tem nenhum atributo ',
        code('data-'),
        ' nem módulo para importar: o estado é o deslocamento, e o navegador já o tem.',
      ),
      p(
        'Onde não consegue, entra uma fila de pontos de verdade: uma ligação por slide, que já funciona sozinha e que, no primeiro deslocamento ou no primeiro toque, vai buscar algumas centenas de bytes de script para se comportar como os pontos nativos — seguir o deslocamento e mover a pista sem levar a página com ela.',
      ),

      h2('Um de cada vez'),
      p(
        'O comportamento predefinido. Cada slide enche a pista, encaixa no início e fica lá, em vez de voar três slides adiante.',
      ),
      demo(`carousel({
  items: ['Costa', 'Porto', 'Campos', 'Centro histórico'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('Vários de uma vez'),
      p(
        code('perView'),
        ' é quantos slides enchem a pista, e ',
        code('min'),
        ' é um mínimo para a largura de um slide. Esse mínimo substitui uma media query: assim que a parte da pista que cabe a um slide fica abaixo dele, os slides mantêm essa largura e cabem menos — o mesmo truque que ',
        code('grid()'),
        ' faz com auto-fit.',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['Rotas', 'Dados', 'Assets', 'Imagens', 'Islands', 'Pesquisa'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, 'Guia'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('Uma espreitadela ao seguinte'),
      p(
        'Um ',
        code('perView'),
        ' fracionário deixa à vista uma tira do slide seguinte — a forma mais barata de dizer «isto desloca-se», sem controlo nenhum.',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['Um', 'Dois', 'Três'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('Adaptável sem um breakpoint seu'),
      p(
        code('perView'),
        ' é escrito como propriedade personalizada, por isso uma media query pode mudá-lo sem tocar na marcação — e sem o componente ter de conhecer os seus breakpoints:',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('O encaixe'),
      p(
        'O encaixe é ',
        code('mandatory'),
        ' por predefinição: um deslocamento vem sempre parar a um slide. ',
        code("snap: 'proximity'"),
        ' só o puxa quando acaba perto de um, e ',
        code('snap: false'),
        ' deixa a pista a deslocar-se livremente — que é o que uma fila de coisas pequenas quer, onde ficar entre duas não incomoda.',
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

      h2('Onde ficam os pontos e as setas'),
      p(
        'Ambos são opcionais e ambos vêm ligados. Desligar os pontos devolve a barra de deslocamento da pista, porque um carrossel sem uma coisa nem outra seria um contentor que se desloca sem nada que o diga.',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['Só pontos', 'Segundo', 'Terceiro'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['Só setas', 'Segundo', 'Terceiro'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('Quando o navegador não tem marcadores de deslocamento'),
      p(
        'Então os pontos são ligações a sério, uma por slide, cada uma a apontar para o id do seu — é por isso que cada slide recebe um. Isso já funciona sem carregar nada: tocar num ponto desloca a pista até ao seu slide, porque seguir um fragmento é coisa que o navegador já sabe fazer.',
      ),
      p(
        'No primeiro deslocamento ou no primeiro toque, a pista e os pontos vão buscar ',
        code('/su/carousel.js'),
        ' a partir dos seus próprios atributos de evento — como cada componente aqui vai buscar o seu módulo. Numa página que ninguém toca não se descarrega nada, e onde os marcadores nativos já existem, nada mesmo. A partir daí funciona nos dois sentidos: os pontos seguem o deslocamento, tenha sido o que for a movê-lo — um deslize, o trackpad, as teclas de seta, um arrastar da barra — e tocar num ponto desloca a pista e deixa a página onde estava.',
      ),
      p(
        'É para esta última parte que o script existe, na verdade. Um fragmento a seco move a janela para o slide além da pista, e um carrossel que tira a página debaixo do dedo que lhe toca não é o que alguém quis dizer com um ponto. O clique é cancelado no atributo e não dentro do import, porque um import dinâmico chega um instante depois e o navegador já seguiu a ligação. ',
        code('scrollMargin'),
        ' é onde a janela aterra no único caso que sobra: sem JavaScript, onde a ligação é apenas uma ligação.',
      ),
      p(
        'Os ids para onde apontam vêm de ',
        code('name'),
        ', do próprio ',
        code('id'),
        ' do carrossel ou — não havendo nenhum — de um resumo dos slides, para que dois carrosséis numa página não colidam sem que nenhum saiba do outro. Dê a um item o seu próprio ',
        code('id'),
        ' quando valer a pena ligar de outro sítio a um slide em particular.',
      ),

      h2('Dar nome aos slides'),
      p(
        'Cada ponto tem o nome do seu slide, porque um ponto é um controlo e um controlo sem nome é um botão a que um leitor de ecrã só pode chamar «botão». Por predefinição o nome é o número do slide. Passe um item como objeto para lhe dar um nome melhor, ou ',
        code('slideLabel'),
        ' para os contar nas suas próprias palavras.',
      ),
      demo(`carousel({
  label: 'Fotografias do produto',
  perView: 2,
  min: '10rem',
  items: [
    { label: 'A cozinha', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Cozinha'))) },
    { label: 'O terraço', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Terraço'))) },
    { label: 'O jardim', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Jardim'))) },
  ],
})`, { align: 'stretch' }),

      h2('Conduzi-lo você mesmo'),
      p(
        'Duas funções para quando é a página que move o carrossel — um botão «ver as fotografias», um passo de um formulário, uma ligação noutro ponto da página:',
      ),
      codeBlock('src/main.js', `import { setSlide, getSlide } from 'sitelo/ui/client'

setSlide('gallery', 2)  // desloca até ao terceiro e marca o ponto dele
getSlide('gallery')     // 2`, 'javascript'),
      p('Ou a partir de um atributo de evento, sem nada empacotado na página:'),
      codeBlock('Em qualquer sítio', `button({ onclick: "import('/su/carousel.js').then(m=>m.set('gallery',0))" }, 'Voltar ao início')`, 'javascript'),

      h2('O que isto não faz'),
      p(
        'Não volta em ciclo ao primeiro slide e não avança sozinho. Nenhuma das duas coisas está ao alcance do CSS, por isso nenhuma está aqui — um carrossel em ciclo ou com reprodução automática precisa de um script, e este componente prefere não ser a razão pela qual uma página carrega um. Avançar sozinho é, de resto, uma perda feliz: mexe precisamente naquilo que alguém está a ler.',
      ),
      p(
        'Com o JavaScript desligado também não consegue marcar que slide está à vista depois de a pista ser deslizada, nem chegar a um sem mexer na página. O primeiro ponto é marcado na compilação, porque em repouso é esse o slide à vista; mantê-lo certo depois disso é a única coisa que só o script consegue fazer. Deslizar, o trackpad e as teclas funcionam de qualquer maneira.',
      ),

      h2('Acessibilidade'),
      p(
        'A pista é um grupo com nome e ',
        code('tabindex="0"'),
        ', para que um teclado chegue à região deslocável e a percorra com as setas em qualquer motor, não só nos que dão foco aos contentores por conta própria. Dê-lhe nome com ',
        code('label'),
        ' quando uma página tiver mais do que um.',
      ),
      p(
        'Onde o navegador os desenha, os pontos são expostos como uma lista de separadores e as setas como botões que se desativam sozinhos em cada extremo — tudo isso é o navegador que constrói, por isso nada disso pode ficar fora de passo com o slide que está mesmo à vista. É esse o argumento a favor desta forma face a uma com script: não há uma segunda cópia do estado para errar.',
      ),
      p(
        'Os pontos da alternativa são ligações, cada uma com o nome do seu slide e cada uma um alvo de 24px em vez dos 8px que o ponto parece ter. O slide à vista leva ',
        code('aria-current'),
        ', que é ao mesmo tempo o que um leitor de ecrã lê e o que a folha de estilos colore: um só estado para manter certo em vez de dois que possam divergir. É renderizado no primeiro ponto, já que em repouso é esse o slide à vista, e daí em diante acompanha o deslocamento. Onde os marcadores nativos os substituem, as ligações estão em ',
        code('display: none'),
        ', pelo que saem da árvore de acessibilidade junto com a imagem em vez de serem lidas duas vezes.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Os slides. Um filho, ou { label, content } com quaisquer outros atributos para o slide. Os filhos também são slides e vêm a seguir aos items.'],
        ['perView', 'number', '1', 'Quantos slides enchem a pista. Fracionário deixa espreitar o seguinte.'],
        ['min', 'string', '', 'Mínimo para a largura de um slide, para um ecrã estreito mostrar menos em vez de mais finos.'],
        ['gap', 'Space', "'md'", 'Entre slides.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Onde um slide vem parar.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'Com que firmeza o deslocamento assenta num slide.'],
        ['dots', 'boolean', 'true', 'Pontos por baixo da pista — marcadores nativos onde o navegador os tem, e onde não tem, uma ligação por slide que um módulo pequeno melhora. Desligados devolvem a barra de deslocamento e não pedem script nenhum.'],
        ['arrows', 'boolean', 'true', 'Setas por cima da pista.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Cor do ponto do slide à vista.'],
        ['label', 'string', "'Carousel'", 'Nome acessível da região deslocável.'],
        ['previousLabel', 'string', "'Previous slide'", 'Nome acessível da seta para trás.'],
        ['nextLabel', 'string', "'Next slide'", 'Nome acessível da seta para a frente.'],
        ['slideLabel', '(index, count) => string', 'o número', 'Dá nome a um slide que não se nomeou a si próprio.'],
        ['name', 'string', 'o id do carrossel, ou um resumo', 'Prefixo dos ids de slide para onde apontam os pontos da alternativa.'],
        ['scrollMargin', 'Space', "'lg'", 'A que altura acima de um slide a janela para quando um ponto da alternativa leva até ele.'],
        ['as', 'string', "'div'", 'Elemento a renderizar.'],
      ]),
    ],
  })
