import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Bascule de thème',
    description:
      'Un interrupteur clair/sombre, avec le script inline qui empêche un choix mémorisé de provoquer un flash à l’arrivée.',
    activeHref: '/fr/ui/theme-toggle',
    extraHead: uiHead(),
    children: [
      p(
        'sitelo-ui résout le mode sombre tout seul à partir de ',
        code('prefers-color-scheme'),
        ' — un site qui se contente de suivre le système d’exploitation n’a besoin de rien de cette page. La bascule sert à laisser un lecteur passer outre.',
      ),
      p(
        'C’est l’un des cinq composants qui réclament un script, parce que le choix vit dans ',
        code('localStorage'),
        ' et que seul un script peut le lire. Le bouton va chercher ce script lui-même, au premier appui.',
      ),

      h2('Mise en place'),
      p('Deux choses dans le head, et le bouton là où il a sa place :'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // applique le choix mémorisé avant le premier rendu
  styles(),
)

body(
  appBar({ brand: 'Mon site' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        'Il n’y a pas de troisième fichier. ',
        code('themeScript()'),
        ' est bloquant et inline exprès — tout ce qui est différé peint d’abord, ce qui est précisément le flash sombre qu’il existe pour éviter — et la bascule elle-même voyage sur le bouton :',
      ),
      codeBlock('Balisage rendu', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        'Associez les deux. ',
        code('themeScript()'),
        ' est aussi ce qui marque la bascule ',
        code('aria-pressed'),
        ' au chargement : rien n’a encore été pressé, donc le bouton seul ne peut pas savoir quel thème a été retenu.',
      ),

      h2('La bascule'),
      p(
        'L’icône est du CSS pur, lue directement sur l’attribut de thème — elle est donc déjà juste au premier rendu, avant qu’aucun script ne tourne. Elle montre ce vers quoi un clic va basculer.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Ces boutons fonctionnent — cette page charge le runtime. Cliquer sur l’un pose ',
        code('data-su-theme'),
        ' sur ',
        code('<html>'),
        ', qui est l’attribut propre à sitelo-ui : seuls les composants sitelo-ui de cette page changent donc. Le reste de ce site suit son propre ',
        code('data-theme'),
        ', posé par la bascule de la barre du haut. Sur votre site il n’y en aurait qu’une seule.',
      ),

      h2('Dans une barre d’application'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Documentation')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Commencer'),
  ),
)`, { align: 'stretch' }),

      h2('Comment le thème est résolu'),
      p(
        'Dans l’ordre : un ',
        code('data-theme'),
        ' ou ',
        code('data-su-theme'),
        ' explicite sur n’importe quel ancêtre l’emporte ; à défaut, c’est ',
        code('prefers-color-scheme'),
        ' qui décide. Les deux noms d’attribut sont honorés pour que sitelo-ui puisse vivre dans un site qui a déjà son propre sélecteur de thème — ce que fait précisément cette documentation.',
      ),

      h2('Le piloter soi-même'),
      p(
        'Le runtime exporte les mêmes fonctions que celles utilisées par le bouton, pour un contrôle sur mesure ou un sélecteur à trois positions clair / sombre / système.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — résolu, pas mémorisé
toggleTheme()       // bascule
setTheme('dark')    // fixe
setTheme('system')  // efface la préférence et suit de nouveau l’OS`, 'javascript'),

      h2('Props'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Nom accessible et infobulle.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Variante du bouton.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'La palette utilisée.'],
      ]),
      p(
        code('themeScript()'),
        ' prend un ',
        code('nonce'),
        ' facultatif, pour un site doté d’une politique de sécurité de contenu.',
      ),
    ],
  })
