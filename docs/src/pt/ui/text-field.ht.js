import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Campo de texto',
    description:
      'Entradas de texto de uma ou várias linhas, com a etiqueta, o texto de ajuda, a mensagem de erro e os ids já ligados por ti.',
    activeHref: '/pt/ui/text-field',
    children: [
      p(
        'Há aqui duas camadas. O ',
        code('input()'),
        ' e o ',
        code('textarea()'),
        ' são os controlos nus; o ',
        code('textField()'),
        ' e o ',
        code('textareaField()'),
        ' envolvem um deles numa etiqueta, texto de ajuda e mensagem de erro, e ligam-nos com ',
        code('for'),
        ' e ',
        code('aria-describedby'),
        '. Usa os segundos, a não ser que estejas a construir a disposição tu.',
      ),

      h2('Campo básico'),
      demo(`textField({ label: 'Nome', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Texto de ajuda'),
      p(
        'O texto de ajuda é ligado com ',
        code('aria-describedby'),
        ', por isso um leitor de ecrã lê-o como parte do campo e não como texto solto a seguir.',
      ),
      demo(`textField({
  label: 'Email',
  name: 'email',
  type: 'email',
  help: 'Só o usamos para avisar de construções falhadas.',
})`, { align: 'stretch' }),

      h2('Obrigatório e com erro'),
      p(
        'Um ',
        code('error'),
        ' marca o campo como inválido, colore o contorno, define ',
        code('aria-invalid'),
        ' e faz o ',
        code('aria-describedby'),
        ' apontar para a mensagem — uma prop, as quatro coisas.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Projeto', name: 'project', required: true, value: '' }),
  textField({
    label: 'Site',
    name: 'site',
    error: 'Isso não é um URL.',
    value: 'sitelo ponto dev',
  }),
)`, { align: 'stretch' }),

      h2('Tamanhos'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Pequeno', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Médio', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Grande', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Adornos'),
      p(
        'Um prefixo ou sufixo colado ao próprio controlo, para unidades e pedaços fixos de um valor.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Site', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Tempo limite da construção', name: 'timeout', endAdornment: 'segundos', value: '30' }),
)`, { align: 'stretch' }),

      h2('Desativado e só de leitura'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Desativado', name: 'disabled', value: 'Não editável', disabled: true }),
  textField({ label: 'Só de leitura', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Multilinha'),
      p(
        'O ',
        code('textareaField()'),
        ' é o mesmo campo à volta de um ',
        code('<textarea>'),
        '. O valor dele é conteúdo do elemento e não um atributo, coisa de que o componente trata por ti.',
      ),
      demo(`textareaField({
  label: 'Descrição',
  name: 'description',
  rows: 4,
  help: 'Mostrada nos resultados de pesquisa e nos cartões sociais.',
  value: 'Geração de sites estáticos sem configuração, com o Vite por baixo.',
})`, { align: 'stretch' }),

      h2('Num formulário'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Nome', name: 'contact-name', required: true }),
      textField({ label: 'Email', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'Mensagem', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Cancelar'),
    button({ type: 'submit' }, 'Enviar'),
  ),
)`, { align: 'stretch' }),

      h2('Construí-lo tu'),
      p(
        'O ',
        code('field()'),
        ' é o invólucro sozinho — aceita qualquer controlo como filho, por isso podes pôr duas entradas numa linha, ou um controlo que esta biblioteca não tem, com o mesmo tratamento de etiqueta e erro.',
      ),
      p(
        'Uma etiqueta não pode dar nome a dois controlos, por isso aqui cada entrada precisa do seu próprio nome acessível. É isso que os ',
        code('aria-label'),
        ' estão a fazer: a etiqueta visível dá nome ao par, e cada entrada diz que ponta é.',
      ),
      demo(`field({ label: 'Intervalo de datas', help: 'Ambos os extremos entram.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'De' }),
    input({ type: 'date', name: 'to', 'aria-label': 'Até' }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      h3('textField e textareaField'),
      propsTable([
        ['label', 'Child', '', 'A etiqueta do campo. Sem name, também deriva o id do controlo.'],
        ['name', 'string', '', 'Nome do campo; o id é derivado dele.'],
        ['help', 'Child', '', 'Dica sob o controlo, ligada por aria-describedby.'],
        ['error', 'Child | false', '', 'Mensagem de erro. Define também aria-invalid no controlo.'],
        ['required', 'boolean', 'false', 'Marca a etiqueta e o controlo.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Altura do controlo e tamanho do texto.'],
        ['type', 'string', "'text'", 'Qualquer tipo de input. Só no textField.'],
        ['startAdornment', 'Child', '', 'Prefixo colado ao controlo. Só no textField.'],
        ['endAdornment', 'Child', '', 'Sufixo colado ao controlo. Só no textField.'],
        ['value', 'string | number', '', 'Valor inicial.'],
        ['fieldClass', 'string', '', 'Classe para o invólucro em vez do controlo.'],
      ]),
      p(
        'Os ids derivam do ',
        code('name'),
        ' — ou do ',
        code('label'),
        ' quando não há name — e não de um contador, por isso a mesma página gera o mesmo HTML em cada construção. Passa ',
        code('id'),
        ' para o substituir.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'O texto da etiqueta.'],
        ['help', 'Child', '', 'Dica sob o controlo.'],
        ['error', 'Child | false', '', 'Mensagem de erro; acrescenta também o estado inválido ao invólucro.'],
        ['required', 'boolean', 'false', 'Acrescenta a marca de obrigatório à etiqueta.'],
        ['for', 'string', '', 'Id do controlo que está a ser etiquetado.'],
      ]),
    ],
  })
