import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Progression',
    description:
      'Une barre pour un travail dont on connaît la fin, un spinner pour celui dont on l’ignore.',
    activeHref: '/fr/ui/progress',
    extraHead: uiHead(),
    children: [
      p(
        'Prenez une barre déterminée dès que vous savez ce qu’il reste — c’est la seule qui dise quelque chose au lecteur. Omettez ',
        code('value'),
        ' et la barre s’anime à la place, ce qui dit « ça travaille encore », et rien de plus.',
      ),

      h2('Déterminée'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Indéterminée'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'Une barre sans ',
        code('label'),
        ' est marquée ',
        code('aria-hidden'),
        ' — un rôle progressbar sans nom accessible ne dit rien à un lecteur d’écran, donc une barre sans libellé est traitée comme de la décoration. Nommez tout ce que le lecteur est censé suivre.',
      ),

      h2('Libellés'),
      p(
        'Un libellé nomme ce qui se passe ; ',
        code('showValue'),
        ' ajoute le pourcentage à droite.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Rendu des pages', showValue: true }),
  progress({ value: 30, max: 60, label: 'Optimisation des images', showValue: true }),
  progress({ label: 'En attente du déploiement' }),
)`, { align: 'stretch' }),

      h2('Couleurs et épaisseur'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Réussi', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Dégradé', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'En échec', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('Une échelle autre que 100'),
      p(
        code('max'),
        ' vous laisse passer les nombres bruts — pages construites sur pages totales — plutôt que de calculer d’abord un pourcentage.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 pages sur 169', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Spinner'),
      p(
        'Un spinner est dimensionné en ',
        code('em'),
        ' : il s’accorde au texte qu’il côtoie sans qu’on lui donne une taille.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  spinner({ size: 'sm' }),
  spinner(),
  spinner({ size: 'lg' }),
)`),

      h2('Le spinner en contexte'),
      p(
        'Donnez un ',
        code('label'),
        ' à un spinner isolé pour qu’il soit annoncé. Celui d’un bouton n’en a pas besoin — le bouton dit déjà ce qu’il fait.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    spinner({ label: 'Chargement' }),
    text({ variant: 'small', tone: 'muted' }, 'Récupération du dernier build…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Déploiement'),
    button({ variant: 'outline', loading: true }, 'Vérification des liens'),
  ),
)`, { align: 'start' }),

      h2('Props'),
      p(code('progress()'), ' — exporté aussi comme ', code('progressBar'), ' :'),
      propsTable([
        ['value', 'number', '', 'Où l’on en est. Omettez-la pour l’animation indéterminée.'],
        ['max', 'number', '100', 'La valeur qui compte comme terminée.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Couleur du remplissage.'],
        ['label', 'Child', '', 'Texte au-dessus de la barre ; aussi son nom accessible.'],
        ['showValue', 'boolean', 'false', 'Afficher le pourcentage à côté du libellé.'],
        ['height', 'Space', "'0.5rem'", 'Épaisseur de la barre.'],
      ]),
      p(code('spinner()'), ' :'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diamètre. Le moyen est dimensionné en em, pour s’accorder au texte voisin.'],
        ['label', 'string', '', 'Nom accessible. Sans lui, le spinner est masqué aux lecteurs d’écran.'],
      ]),
    ],
  })
