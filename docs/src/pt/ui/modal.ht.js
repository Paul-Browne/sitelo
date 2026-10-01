import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'Um <dialog> a sério, aberto em modo modal — o navegador trata do fundo, do foco, do Escape e do clique fora.',
    activeHref: '/pt/ui/modal',
    children: [
      p(
        'Um modal é um ',
        code('<dialog>'),
        '. Qualquer botão com ',
        code('commandfor'),
        ' a apontar para o ',
        code('id'),
        ' do modal e ',
        code("command: 'show-modal'"),
        ' abre-o em modo modal: a página por trás fica inerte, por isso o foco e o leitor de ecrã ficam lá dentro. Sem script nenhum — o fundo, o Escape e o clique fora são todos do navegador.',
      ),
      p(
        'É por isso que o ',
        code('id'),
        ' é obrigatório e que o componente lança um erro sem ele: o id é toda a canalização.',
      ),

      h2('Modal básico'),
      p('Todos os modais desta página abrem mesmo — experimenta.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Abrir modal'),
  modal({ id: 'demo-basic', title: 'Reconstruir o site?' },
    'Isto corre o sitelo build e volta a publicar dist/.',
  ),
)`),

      h2('Com rodapé'),
      p(
        'Um botão de fechar é qualquer botão que aponte para o mesmo id com ',
        code("command: 'close'"),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Eliminar página…'),
  modal({
    id: 'demo-confirm',
    title: 'Eliminar esta página?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Cancelar'),
      button({ color: 'danger' }, 'Eliminar'),
    ),
  }, 'Isto não se pode desfazer. O HTML gerado desaparece na próxima construção.'),
)`),

      h2('Tamanhos'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Pequeno'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Médio'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Grande'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Pequeno' }, 'size: sm — cerca de 24rem.'),
  modal({ id: 'demo-md', title: 'Médio' }, 'A predefinição — cerca de 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Grande' }, 'size: lg — cerca de 48rem.'),
)`),

      h2('Formulários dentro de um modal'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'Página nova…'),
  modal({
    id: 'demo-form',
    title: 'Página nova',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Cancelar'),
      button({ type: 'submit' }, 'Criar'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Título', name: 'modal-title', placeholder: 'Acerca' }),
      selectField({ label: 'Extensão', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Sem botão de fechar'),
      p(
        code('closable: false'),
        ' tira o × do canto. O Escape e o clique fora continuam a fechá-lo; com ',
        code("closedby: 'closerequest'"),
        ' só o Escape o fecha.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'Sem botão de fechar'),
  modal({ id: 'demo-bare', title: 'Carrega em Escape', closable: false },
    'Ou clica em qualquer sítio fora deste diálogo.',
  ),
)`),

      h2('Conteúdo longo'),
      p('O corpo desliza; o cabeçalho e o rodapé ficam onde estão.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Modal longo'),
  modal({
    id: 'demo-long',
    title: 'Notas de versão',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Fechar'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Alteração ' + (index + 1) + ' — corrigiu-se alguma coisa.'),
      ),
    ),
  ),
)`),

      h2('Deslocamento do fundo'),
      p(
        'A página por trás de um modal aberto não desliza. É a única coisa que um diálogo modal te deixa a ti, e aqui está feita em CSS — sem script, e sem nada para inicializar. Passa ',
        code('lockScroll: false'),
        ' para deixar o fundo deslizar como de costume.',
      ),

      h2('Suporte dos navegadores'),
      p(
        'Abrir um diálogo com o command de um botão funciona em todos os navegadores atuais — Chrome 135, Firefox 144 e Safari 26.2 ou posteriores. Num mais antigo, o button() acrescenta um onclick que descarrega umas centenas de bytes de /su/dialog.js para fazer o mesmo — só aí, e só no primeiro clique. O Safari ainda não fecha um diálogo com um clique fora (closedby), e é o mesmo ficheiro que trata disso lá.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obrigatório. Aquilo para onde aponta o commandfor de um acionador.'],
        ['title', 'Child', '', 'Cabeçalho, e nome acessível do diálogo.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Largura máxima.'],
        ['footer', 'Child', '', 'Fila inferior, na sua própria faixa tingida.'],
        ['closable', 'boolean', 'true', 'Mostrar o × no cabeçalho.'],
        ['closeLabel', 'string', "'Close'", 'Nome acessível desse botão.'],
        ['lockScroll', 'boolean', 'true', 'Impedir que a página por trás deslize enquanto está aberto.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' desenha esse × sozinho, para um cabeçalho que construas tu.',
      ),
    ],
  })
