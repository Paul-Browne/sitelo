import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Modal',
    description:
      'Um diálogo construído sobre a API de popover — o navegador trata da abertura, do fundo, do clique fora e do Escape.',
    activeHref: '/pt/ui/modal',
    children: [
      p(
        'Um modal é um elemento ',
        code('popover'),
        '. Qualquer botão cujo ',
        code('popovertarget'),
        ' corresponda ao ',
        code('id'),
        ' do modal abre-o — sem script nenhum, incluindo o fundo, o fecho ao clicar fora, o Escape e a gestão do foco, tudo isso propriedade do navegador.',
      ),
      p(
        'É por isso que o ',
        code('id'),
        ' é obrigatório e que o componente lança um erro sem ele: o id é toda a canalização.',
      ),

      h2('Modal básico'),
      p('Todos os modais desta página abrem mesmo — experimenta.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Abrir modal'),
  modal({ id: 'demo-basic', title: 'Reconstruir o site?' },
    'Isto corre o sitelo build e volta a publicar dist/.',
  ),
)`),

      h2('Com rodapé'),
      p(
        'Um botão de fechar é qualquer botão que aponte para o mesmo id com ',
        code('popovertargetaction="hide"'),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Eliminar página…'),
  modal({
    id: 'demo-confirm',
    title: 'Eliminar esta página?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Cancelar'),
      button({ color: 'danger' }, 'Eliminar'),
    ),
  }, 'Isto não se pode desfazer. O HTML gerado desaparece na próxima construção.'),
)`),

      h2('Tamanhos'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Pequeno'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Médio'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Grande'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Pequeno' }, 'size: sm — cerca de 24rem.'),
  modal({ id: 'demo-md', title: 'Médio' }, 'A predefinição — cerca de 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Grande' }, 'size: lg — cerca de 48rem.'),
)`),

      h2('Formulários dentro de um modal'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'Página nova…'),
  modal({
    id: 'demo-form',
    title: 'Página nova',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Cancelar'),
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
        ' tira o × do canto. O Escape e o clique fora continuam a fechá-lo — um popover não pode ser tornado verdadeiramente bloqueante, e de qualquer forma esse é normalmente o comportamento certo.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'Sem botão de fechar'),
  modal({ id: 'demo-bare', title: 'Carrega em Escape', closable: false },
    'Ou clica em qualquer sítio fora deste diálogo.',
  ),
)`),

      h2('Conteúdo longo'),
      p('O corpo desliza; o cabeçalho e o rodapé ficam onde estão.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Modal longo'),
  modal({
    id: 'demo-long',
    title: 'Notas de versão',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Fechar'),
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
        'A página por trás de um modal aberto não desliza. É a única coisa que a API de popover te deixa a ti, e aqui está feita em CSS — sem script, e sem nada para inicializar. Passa ',
        code('lockScroll: false'),
        ' para deixar o fundo deslizar como de costume.',
      ),

      h2('Suporte dos navegadores'),
      p(
        'A API de popover está disponível em todos os navegadores atuais. Num demasiado antigo para a conhecer, o modal é desenhado dentro da página em vez de por cima dela: visível e utilizável, apenas não sobreposto. Nada desaparece.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obrigatório. Aquilo para onde aponta o popovertarget de um acionador.'],
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
