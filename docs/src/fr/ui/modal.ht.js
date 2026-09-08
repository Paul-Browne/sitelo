import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Modale',
    description:
      'Un dialogue bâti sur l’API popover — le navigateur gère l’ouverture, le fond, le clic à l’extérieur et Échap.',
    activeHref: '/fr/ui/modal',
    extraHead: uiHead(),
    children: [
      p(
        'Une modale est un élément ',
        code('popover'),
        '. N’importe quel bouton dont le ',
        code('popovertarget'),
        ' correspond à l’',
        code('id'),
        ' de la modale l’ouvre — sans le moindre script, y compris pour le fond, la fermeture au clic extérieur, Échap et la gestion du focus, dont le navigateur se charge.',
      ),
      p(
        'C’est pourquoi l’',
        code('id'),
        ' est obligatoire et que le composant lève une erreur sans lui : l’id est tout le câblage.',
      ),

      h2('Modale de base'),
      p('Chaque modale de cette page s’ouvre vraiment — essayez.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Ouvrir la modale'),
  modal({ id: 'demo-basic', title: 'Reconstruire le site ?' },
    'Cela lance sitelo build et republie dist/.',
  ),
)`),

      h2('Avec un pied'),
      p(
        'Un bouton de fermeture est n’importe quel bouton pointant vers le même id avec ',
        code('popovertargetaction="hide"'),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Supprimer la page…'),
  modal({
    id: 'demo-confirm',
    title: 'Supprimer cette page ?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Annuler'),
      button({ color: 'danger' }, 'Supprimer'),
    ),
  }, 'C’est irréversible. Le HTML généré disparaît au prochain build.'),
)`),

      h2('Tailles'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Petite'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Moyenne'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Grande'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Petite' }, 'size: sm — environ 24rem.'),
  modal({ id: 'demo-md', title: 'Moyenne' }, 'Le défaut — environ 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Grande' }, 'size: lg — environ 48rem.'),
)`),

      h2('Des formulaires dans une modale'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'Nouvelle page…'),
  modal({
    id: 'demo-form',
    title: 'Nouvelle page',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Annuler'),
      button({ type: 'submit' }, 'Créer'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Titre', name: 'modal-title', placeholder: 'À propos' }),
      selectField({ label: 'Extension', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Sans bouton de fermeture'),
      p(
        code('closable: false'),
        ' retire le × du coin. Échap et le clic à l’extérieur la ferment toujours — un popover ne peut pas être rendu vraiment bloquant, et c’est de toute façon le bon comportement la plupart du temps.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'Sans bouton de fermeture'),
  modal({ id: 'demo-bare', title: 'Appuyez sur Échap', closable: false },
    'Ou cliquez n’importe où en dehors de ce dialogue.',
  ),
)`),

      h2('Contenu long'),
      p('Le corps défile ; l’en-tête et le pied restent en place.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Modale longue'),
  modal({
    id: 'demo-long',
    title: 'Notes de version',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Fermer'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Changement ' + (index + 1) + ' — quelque chose a été corrigé.'),
      ),
    ),
  ),
)`),

      h2('Défilement de l’arrière-plan'),
      p(
        'La page derrière une modale ouverte ne défile pas. C’est la seule chose que l’API popover vous laisse, et elle est faite en CSS ici — aucun script, rien à initialiser. Passez ',
        code('lockScroll: false'),
        ' pour laisser l’arrière-plan défiler comme d’habitude.',
      ),

      h2('Prise en charge des navigateurs'),
      p(
        'L’API popover est disponible dans tous les navigateurs actuels. Dans un navigateur trop ancien pour la connaître, la modale se rend en ligne dans la page au lieu de par-dessus : visible et utilisable, simplement pas superposée. Rien ne disparaît.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obligatoire. Ce que vise le popovertarget d’un déclencheur.'],
        ['title', 'Child', '', 'Titre, et nom accessible du dialogue.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Largeur maximale.'],
        ['footer', 'Child', '', 'Rangée du bas, sur sa propre bande teintée.'],
        ['closable', 'boolean', 'true', 'Afficher le × dans l’en-tête.'],
        ['closeLabel', 'string', "'Close'", 'Nom accessible de ce bouton.'],
        ['lockScroll', 'boolean', 'true', 'Empêcher la page derrière de défiler tant qu’elle est ouverte.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' rend ce × tout seul, pour un en-tête que vous construisez vous-même.',
      ),
    ],
  })
