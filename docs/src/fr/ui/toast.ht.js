import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { preview, uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toast',
    description:
      'Un message éphémère dans le coin, ajouté par script dans une zone que la page a rendue.',
    activeHref: '/fr/ui/toast',
    extraHead: uiHead(),
    children: [
      p(
        'Le toast est le seul composant ici qui ne peut pas être statique : il apparaît en réponse à un événement. La page rend une zone vide avec ',
        code('toasts()'),
        ', et ',
        code('toast()'),
        ' depuis ',
        code('sitelo/ui/client'),
        ' y ajoute des éléments.',
      ),
      p(
        'La zone est une région live polie : tout ce qu’on y ajoute est annoncé sans voler le focus.',
      ),

      h2('Mise en place'),
      p('Placez la zone n’importe où dans le body — elle est en position fixe, donc l’endroit importe peu :'),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …la page…
  toasts(),
)`, 'javascript'),
      p(
        'C’est la seule partie du runtime que rien dans la page ne déclenche pour vous : c’est donc la seule que vous atteignez vous-même, depuis un attribut d’événement et sans rien dans le bundle :',
      ),
      codeBlock('N’importe où', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('Enregistré.',{color:'success'}))" }, 'Enregistrer')`, 'javascript'),
      p('Ou depuis votre propre module, quand il y en a déjà un qui tourne :'),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

toast('Enregistré.', { color: 'success' })`, 'javascript'),

      h2('Essayez'),
      p(
        'Cette page rend une zone ',
        code('toasts()'),
        ' et les boutons ci-dessous vont chercher le runtime eux-mêmes : ils produisent donc de vrais toasts — en bas à droite. Rien n’est chargé tant que vous n’en pressez pas un.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "import('/su/toast.js').then(m=>m.toast('Enregistré.',{color:'success'}))",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "import('/su/toast.js').then(m=>m.toast('Deux pages n’ont pas de méta description.',{color:'warning'}))",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "import('/su/toast.js').then(m=>m.toast('Le build a échoué. Voyez le rapport de liens.',{color:'danger'}))",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "import('/su/toast.js').then(m=>m.toast('Celui-ci reste jusqu’à ce que vous le fermiez.',{color:'neutral',duration:0}))",
  }, 'Jusqu’à fermeture'),
)`),
      // La région live dans laquelle les boutons de cette page ajoutent.
      // Elle est en position fixe : elle est rendue ici mais apparaît
      // dans le coin de la fenêtre.
      preview('toasts()'),

      h2('Options'),
      p(
        code('duration'),
        ' est la durée d’affichage, en millisecondes ; ',
        code('0'),
        ' le laisse jusqu’à ce que quelqu’un le ferme. Chaque toast a un bouton de fermeture, câblé sur le même gestionnaire que celui d’une alerte.',
      ),
      codeBlock('Options', `toast('Enregistré.', { color: 'success' })
toast('Toujours en cours…', { color: 'neutral', duration: 0 })
toast('Déployé en 1,7 s', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('Ce qu’il rend'),
      p(
        'Un toast est une ',
        code('alert()'),
        ' dans la zone des toasts — même balisage, mêmes couleurs, même bouton de fermeture. Rien de nouveau à apprendre, et rien de plus à styler.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Enregistré.'),
  alert({ color: 'danger', dismissible: true }, 'Le build a échoué. Voyez le rapport de liens.'),
)`, { align: 'stretch' }),

      h2('Quand en utiliser un'),
      p(
        'Un toast sert à confirmer ce que le lecteur vient de faire. C’est le mauvais endroit pour ce sur quoi il doit agir ou qu’il doit lire attentivement — il disparaît, il est facile à manquer, et sur un site statique la plupart des messages ont leur place dans la page elle-même, sous forme d’',
        code('alert()'),
        '.',
      ),

      h2('Props'),
      p(code('toasts()'), ' ne prend aucune prop. ', code('toast()'), ' depuis ', code('sitelo/ui/client'), ' :'),
      propsTable([
        ['message', 'string', '', 'Le texte. Posé en textContent, donc jamais interprété comme du balisage.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'La palette utilisée.'],
        ['duration', 'number', '4000', 'Millisecondes avant disparition. 0 le maintient.'],
      ], { headers: ['Argument', 'Type', 'Défaut', 'Description'] }),
      p(
        'Il renvoie l’élément ajouté, ou ',
        code('null'),
        ' quand la page n’a pas de zone ',
        code('toasts()'),
        '.',
      ),
    ],
  })
