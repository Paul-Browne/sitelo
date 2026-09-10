import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toast',
    description:
      'Uma mensagem passageira no canto, acrescentada por script a uma zona que a página desenhou.',
    activeHref: '/pt/ui/toast',
    children: [
      p(
        'O toast é o único componente aqui que não pode ser estático: aparece em resposta a algo que aconteceu. A página desenha uma zona vazia com ',
        code('toasts()'),
        ', e o ',
        code('toast()'),
        ' de ',
        code('sitelo/ui/client'),
        ' acrescenta-lhe coisas.',
      ),
      p(
        'A zona é uma região viva educada, por isso tudo o que lá for acrescentado é anunciado sem roubar o foco.',
      ),

      h2('Configuração'),
      p('Põe a zona em qualquer sítio do body — é de posição fixa, por isso o sítio não importa:'),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …a página…
  toasts(),
)`, 'javascript'),
      p(
        'Esta é a única parte do runtime que nada na página dispara por ti, por isso é a única que alcanças tu — a partir de um atributo de evento, sem nada no bundle:',
      ),
      codeBlock('Em qualquer sítio', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('Guardado.',{color:'success'}))" }, 'Guardar')`, 'javascript'),
      p('Ou a partir do teu próprio módulo, quando já houver um a correr:'),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

toast('Guardado.', { color: 'success' })`, 'javascript'),

      h2('Experimenta'),
      p(
        'Esta página desenha uma zona ',
        code('toasts()'),
        ' e os botões abaixo vão buscar o runtime eles próprios, por isso produzem mesmo toasts — em baixo à direita. Nada é carregado até carregares num.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "import('/su/toast.js').then(m=>m.toast('Guardado.',{color:'success'}))",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "import('/su/toast.js').then(m=>m.toast('Duas páginas não têm meta description.',{color:'warning'}))",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "import('/su/toast.js').then(m=>m.toast('A construção falhou. Vê o relatório de ligações.',{color:'danger'}))",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "import('/su/toast.js').then(m=>m.toast('Este fica até o fechares.',{color:'neutral',duration:0}))",
  }, 'Até ser fechado'),
)`),
      // A região viva onde os botões desta página acrescentam. É de posição
      // fixa, por isso é desenhada aqui mas aparece no canto da janela.
      preview('toasts()'),

      h2('Opções'),
      p(
        code('duration'),
        ' é quanto tempo o toast fica, em milissegundos; ',
        code('0'),
        ' mantém-no até alguém o fechar. Todos os toasts levam botão de fechar, ligado ao mesmo handler que um alerta usa.',
      ),
      codeBlock('Opções', `toast('Guardado.', { color: 'success' })
toast('Ainda a trabalhar…', { color: 'neutral', duration: 0 })
toast('Publicado em 1,7 s', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('O que desenha'),
      p(
        'Um toast é um ',
        code('alert()'),
        ' dentro da zona de toasts — a mesma marcação, as mesmas cores, o mesmo botão de fechar. Nada de novo para aprender, e nada de extra para estilizar.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Guardado.'),
  alert({ color: 'danger', dismissible: true }, 'A construção falhou. Vê o relatório de ligações.'),
)`, { align: 'stretch' }),

      h2('Quando usar um'),
      p(
        'Um toast serve para confirmar algo que o leitor acabou de fazer. É o sítio errado para o que ele tem de resolver ou de ler com atenção — desaparece, é fácil de perder, e num site estático a maioria das mensagens pertence à própria página, como um ',
        code('alert()'),
        '.',
      ),

      h2('Props'),
      p(code('toasts()'), ' não aceita props próprias. O ', code('toast()'), ' de ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['message', 'string', '', 'O texto. Definido como textContent, por isso nunca é interpretado como marcação.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Que paleta usar.'],
        ['duration', 'number', '4000', 'Milissegundos até desaparecer. 0 mantém-no.'],
      ], { headers: ['Argumento', 'Tipo', 'Predefinição', 'Descrição'] }),
      p(
        'Devolve o elemento que acrescentou, ou ',
        code('null'),
        ' quando a página não tem zona ',
        code('toasts()'),
        '.',
      ),
    ],
  })
