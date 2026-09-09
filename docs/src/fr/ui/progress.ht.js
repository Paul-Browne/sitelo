import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'
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

      h2('La faire avancer depuis le navigateur'),
      p(
        'Une barre est du HTML rendu côté serveur : le pourcentage est une propriété personnalisée sur le remplissage et un nombre dans ',
        code('aria-valuenow'),
        ', et rien dans la page ne change l’un ou l’autre tout seul. Donnez un ',
        code('id'),
        ' à la barre et ',
        code('setProgress'),
        ' déplace les deux ensemble — le remplissage, la valeur annoncée et le pourcentage à côté du libellé.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'Le maximum est retenu, donc les appels suivants ne sont qu’une valeur. Ou atteignez le module comme le font les composants, et faites l’impasse sur le bundle :',
      ),
      codeBlock('N’importe où', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Terminer')`, 'javascript'),
      p(
        'Passer ',
        code('null'),
        ' — ou tout ce qui n’est pas un nombre fini — rend la barre à l’animation indéterminée, si bien qu’un travail qui cesse de donner des chiffres n’a pas besoin d’un cas à part. ',
        code('getProgress()'),
        ' relit la valeur courante, sur l’échelle propre à la barre.',
      ),

      h2('Essayez'),
      p('Cette page charge le runtime : les boutons ci-dessous font réellement bouger la barre.'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'Envoi en cours', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Réinitialiser'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Terminé'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Inconnu'),
  ),
)`, { align: 'stretch' }),
      p(
        'Une barre sans libellé bouge aussi, mais elle reste ',
        code('aria-hidden'),
        ' — elle a été rendue sans nom exprès, et lui annoncer une valeur maintenant placerait dans l’arbre d’accessibilité un progressbar sans nom.',
      ),

      h2('Spinner'),
      p(
        'Il n’y a pas de composant spinner — le spinner est une icône, et ',
        code('spin'),
        ' est ce qui la fait tourner. Comme toute icône, elle est dimensionnée en ',
        code('em'),
        ' : elle s’accorde au texte qu’elle côtoie sans qu’on lui donne une taille.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('Le spinner en contexte'),
      p(
        'Donnez un ',
        code('label'),
        ' à un spinner isolé pour qu’il soit annoncé. Celui d’un bouton n’en a pas besoin — le bouton dit déjà ce qu’il fait.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'Chargement' }),
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
      p(code('setProgress()'), ' depuis ', code('sitelo/ui/client'), ' :'),
      propsTable([
        ['target', 'Element | string', '', 'La barre, ou l’id d’une barre. Si aucun élément ne porte cet id, la chaîne est essayée comme sélecteur.'],
        ['value', 'number | null', '', 'Où la placer. null la rend à l’animation indéterminée.'],
        ['options.max', 'number', '100', 'Ce qui compte comme terminé. Retenu pour les appels suivants.'],
      ]),
      p(
        'Le spinner n’a pas de props à lui — c’est ',
        code("icon('spinner', { spin: true })"),
        ', et il prend ce que prend ',
        code('icon()'),
        '.',
      ),
    ],
  })
