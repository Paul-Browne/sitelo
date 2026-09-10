import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Alternador de tema',
    description:
      'Um interruptor claro/escuro, com o script inline que impede uma escolha guardada de piscar à entrada.',
    activeHref: '/pt/ui/theme-toggle',
    children: [
      p(
        'O sitelo-ui resolve o modo escuro sozinho a partir do ',
        code('prefers-color-scheme'),
        ' — um site que se contenta em seguir o sistema operativo não precisa de nada desta página. O alternador serve para deixar o leitor sobrepor-se a isso.',
      ),
      p(
        'É um dos cinco componentes que precisam de script, porque a escolha vive no ',
        code('localStorage'),
        ' e só um script a consegue ler. O botão vai buscar esse script sozinho, ao primeiro toque.',
      ),

      h2('Configuração'),
      p('Duas coisas no head, e o botão onde lhe compete:'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // aplica a escolha guardada antes do primeiro desenho
  styles(),
)

body(
  appBar({ brand: 'O meu site' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        'Não há um terceiro ficheiro. O ',
        code('themeScript()'),
        ' é bloqueante e inline de propósito — tudo o que for adiado desenha primeiro, e é precisamente esse clarão escuro que ele existe para evitar — e a troca em si viaja no botão:',
      ),
      codeBlock('Marcação gerada', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        'Usa os dois em conjunto. O ',
        code('themeScript()'),
        ' é também o que marca o alternador com ',
        code('aria-pressed'),
        ' ao carregar: ainda nada foi premido, por isso o botão sozinho não pode saber que tema saiu.',
      ),

      h2('O alternador'),
      p(
        'O ícone é CSS puro, lido diretamente do atributo de tema — por isso já está certo no primeiro desenho, antes de qualquer script correr. Mostra para onde um clique vai trocar.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Estes botões funcionam — esta página carrega o runtime. Clicar num deles define ',
        code('data-su-theme'),
        ' no ',
        code('<html>'),
        ', que é o atributo próprio do sitelo-ui, por isso só mudam os componentes sitelo-ui desta página. O resto deste site segue o seu próprio ',
        code('data-theme'),
        ', definido pelo alternador da barra de topo. No teu site só existiria um deles.',
      ),

      h2('Numa barra da aplicação'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Documentação')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Começar'),
  ),
)`, { align: 'stretch' }),

      h2('Como o tema é resolvido'),
      p(
        'Por ordem: um ',
        code('data-theme'),
        ' ou ',
        code('data-su-theme'),
        ' explícito em qualquer antepassado ganha; falhando isso, decide o ',
        code('prefers-color-scheme'),
        '. Os dois nomes de atributo são respeitados para o sitelo-ui poder viver dentro de um site que já tem o seu próprio interruptor de tema — que é exatamente o que esta documentação faz.',
      ),

      h2('Conduzi-lo tu'),
      p(
        'O runtime exporta as mesmas funções que o botão usa, para um controlo à medida ou um seletor de três posições claro / escuro / sistema.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — resolvido, não guardado
toggleTheme()       // trocar
setTheme('dark')    // fixar
setTheme('system')  // limpar a preferência e voltar a seguir o SO`, 'javascript'),

      h2('Props'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Nome acessível e dica.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Variante do botão.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'De que paleta bebe.'],
      ]),
      p(
        'O ',
        code('themeScript()'),
        ' aceita um ',
        code('nonce'),
        ' opcional, para um site com política de segurança de conteúdo.',
      ),
    ],
  })
