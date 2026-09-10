import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Seletor',
    description:
      'Um select nativo, estilizado a condizer com os outros campos, com opções construídas a partir de dados.',
    activeHref: '/pt/ui/select',
    children: [
      p(
        'Isto é um ',
        code('<select>'),
        ' a sério, com o menu do próprio navegador — o que significa que funciona sem JavaScript, abre bem num telemóvel, e navega-se com o teclado sem precisar de nada desta biblioteca.',
      ),
      p(
        'O ',
        code('select()'),
        ' é o controlo nu; o ',
        code('selectField()'),
        ' envolve-o numa etiqueta, texto de ajuda e mensagem de erro, tal como o ',
        code('textField()'),
        ' faz.',
      ),

      h2('Seletor básico'),
      p(
        'As opções podem ser simples cadeias, e nesse caso o valor e a etiqueta são o mesmo.',
      ),
      demo(`selectField({
  label: 'Tema',
  name: 'theme',
  options: ['Claro', 'Escuro', 'Sistema'],
})`, { align: 'stretch' }),

      h2('Valores e etiquetas'),
      p(
        'Passa objetos quando o valor submetido é diferente do texto que a pessoa lê. O ',
        code('value'),
        ' marca a opção selecionada.',
      ),
      demo(`selectField({
  label: 'Saída',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — a predefinição' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Texto indicativo'),
      p(
        'Um placeholder aparece como primeira opção desativada, selecionada quando não há ',
        code('value'),
        ' — por isso o campo começa vazio sem ser uma escolha válida.',
      ),
      demo(`selectField({
  label: 'Destino de publicação',
  name: 'target',
  placeholder: 'Escolhe um alojamento…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Grupos'),
      p(
        'Uma entrada com o seu próprio array ',
        code('options'),
        ' passa a ser um ',
        code('<optgroup>'),
        '.',
      ),
      demo(`selectField({
  label: 'Extensão da página',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Tamanhos'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Pequeno', name: 'sm', size: 'sm', options: ['Um', 'Dois'] }),
  selectField({ label: 'Médio', name: 'md', size: 'md', options: ['Um', 'Dois'] }),
  selectField({ label: 'Grande', name: 'lg', size: 'lg', options: ['Um', 'Dois'] }),
)`, { align: 'stretch' }),

      h2('Ajuda, erro e desativado'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Idioma',
    name: 'locale',
    options: ['en', 'es', 'fr'],
    help: 'Usado no atributo lang do html.',
  }),
  selectField({
    label: 'Framework',
    name: 'framework',
    placeholder: 'Escolhe uma…',
    options: ['sitelo'],
    error: 'Escolhe uma framework para continuar.',
  }),
  selectField({
    label: 'Plano',
    name: 'plan',
    options: ['Grátis'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('A partir de dados'),
      p(
        'As opções são apenas um array, por isso costumam vir daquilo que o ',
        code('data()'),
        ' já carregou para a página.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Olá mundo' },
    { slug: 'static-first', title: 'Estático primeiro' },
    { slug: 'no-runtime', title: 'Sem runtime' },
  ]

  return selectField({
    label: 'Artigo em destaque',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'Cadeias, objetos { value, label, disabled }, ou { label, options } para um grupo.'],
        ['value', 'string | number', '', 'Que opção está selecionada.'],
        ['placeholder', 'string', '', 'Primeira opção desativada, selecionada quando não há valor.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Altura do controlo e tamanho do texto.'],
        ['name', 'string', '', 'Nome do campo; o id é derivado dele.'],
        ['invalid', 'boolean', 'false', 'Define aria-invalid. O selectField trata disso a partir do error.'],
        ['disabled', 'boolean', 'false', 'Desativa o controlo.'],
      ]),
      p(
        'O ',
        code('selectField()'),
        ' aceita ainda ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ' e ',
        code('fieldClass'),
        ' — vê ',
        code('textField()'),
        '. Os filhos são acrescentados depois das opções geradas, por isso podes escrever à mão as que precisares.',
      ),
    ],
  })
