import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Bouton bascule',
    description:
      'Un bouton qui reste enfoncé — un réglage montré comme un bouton plutôt que comme une case à cocher.',
    activeHref: '/fr/ui/toggle-button',
    children: [
      p(
        'Un bouton bascule est activé ou non, et le dit avec ',
        code('aria-pressed'),
        '. Le gras dans un éditeur de texte, un filtre appliqué, un panneau affiché.',
      ),
      p(
        'Il n’y a pas d’input caché derrière : ',
        code('aria-pressed'),
        ' est tout l’état, donc une bascule rendue côté serveur montre un réglage, et ',
        code('setPressed()'),
        ' est ce qui le change. Prenez ',
        code('checkbox()'),
        ' quand cela appartient à un formulaire, et ',
        code('toggle()'),
        ' — l’interrupteur — quand c’est un réglage dans une liste.',
      ),

      h2('Bascule de base'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Gras'),
  toggleButton('Italique'),
  toggleButton('Souligné'),
)`),

      h2('Variantes'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline activé'),
    toggleButton({ variant: 'outline' }, 'Outline désactivé'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost activé'),
    toggleButton({ variant: 'ghost' }, 'Ghost désactivé'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft activé'),
    toggleButton({ variant: 'soft' }, 'Soft désactivé'),
  ),
)`, { align: 'start' }),

      h2('Tailles'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Petit'),
  toggleButton({ size: 'md', pressed: true }, 'Moyen'),
  toggleButton({ size: 'lg', pressed: true }, 'Grand'),
)`),

      h2('Avec des icônes'),
      p(
        'Une bascule uniquement en icône réclame un nom accessible — passez ',
        code('aria-label'),
        ', qui tombe sur le bouton.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Gras',
    title: 'Gras',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': 'Italique',
    title: 'Italique',
    startIcon: icon('italic'),
  }),
)`),

      h2('Désactivé'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'Activé, verrouillé'),
  toggleButton({ disabled: true }, 'Désactivé, verrouillé'),
)`),

      h2('Lui faire faire quelque chose'),
      p(
        'Un appel retourne l’attribut ; le style suit. Dans un ',
        code('toggleGroup()'),
        ' à choix unique, il relâche aussi ses voisins.',
      ),
      codeBlock('N’importe où', `toggleButton({ onclick: "import('/su/pressed.js').then(m=>m.set(this))" }, 'Bold')`, 'javascript'),
      p('Ou depuis votre propre module, quand il y en a déjà un qui tourne :'),
      codeBlock('src/main.js', `import { setPressed } from 'sitelo/ui/client'

setPressed('bold')`, 'javascript'),

      h2('Props'),
      propsTable([
        ['pressed', 'boolean', 'false', 'Pose aria-pressed. Ensuite, setPressed() le change.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'L’allure du bouton non enfoncé.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'La même échelle que button().'],
        ['disabled', 'boolean', 'false', 'Désactive le bouton.'],
      ]),
      p(
        'Tout le reste tombe sur ',
        code('button()'),
        ' — ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ' et le reste. Pour un ensemble, voyez ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
