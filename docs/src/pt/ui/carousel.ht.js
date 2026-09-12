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
        'Os pontos e as setas não são marcação. São ',
        code('::scroll-marker'),
        ' em cada slide e ',
        code('::scroll-button()'),
        ' na pista — pseudo-elementos que a folha de estilos pede e que o navegador desenha, nomeia, liga à posição de deslocamento e desativa nos extremos. Este componente não tem nenhum atributo ',
        code('data-'),
        ' nem módulo para importar: o estado é o deslocamento, e o navegador já o tem.',
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

      h2('O que isto não faz'),
      p(
        'Não volta em ciclo ao primeiro slide e não avança sozinho. Nenhuma das duas coisas está ao alcance do CSS, por isso nenhuma está aqui — um carrossel em ciclo ou com reprodução automática precisa de um script, e este componente prefere não ser a razão pela qual uma página carrega um. Avançar sozinho é, de resto, uma perda feliz: mexe precisamente naquilo que alguém está a ler.',
      ),
      p(
        'Os controlos precisam de um motor que já tenha lançado os pseudo-elementos de carrossel do CSS. Onde não o tenha, o bloco ',
        code('@supports'),
        ' é ignorado e o carrossel continua a ser um contentor que encaixa, com a barra de deslocamento à vista — deslizar, trackpad e teclas na mesma. Nada está partido, apenas mais sóbrio.',
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

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Os slides. Um filho, ou { label, content } com quaisquer outros atributos para o slide. Os filhos também são slides e vêm a seguir aos items.'],
        ['perView', 'number', '1', 'Quantos slides enchem a pista. Fracionário deixa espreitar o seguinte.'],
        ['min', 'string', '', 'Mínimo para a largura de um slide, para um ecrã estreito mostrar menos em vez de mais finos.'],
        ['gap', 'Space', "'md'", 'Entre slides.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Onde um slide vem parar.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'Com que firmeza o deslocamento assenta num slide.'],
        ['dots', 'boolean', 'true', 'Pontos por baixo da pista. Desligados devolvem a barra de deslocamento.'],
        ['arrows', 'boolean', 'true', 'Setas por cima da pista.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Cor do ponto do slide à vista.'],
        ['label', 'string', "'Carousel'", 'Nome acessível da região deslocável.'],
        ['previousLabel', 'string', "'Previous slide'", 'Nome acessível da seta para trás.'],
        ['nextLabel', 'string', "'Next slide'", 'Nome acessível da seta para a frente.'],
        ['slideLabel', '(index, count) => string', 'o número', 'Dá nome a um slide que não se nomeou a si próprio.'],
        ['as', 'string', "'div'", 'Elemento a renderizar.'],
      ]),
    ],
  })
