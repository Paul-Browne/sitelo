import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Modale',
    description:
      'Un vrai <dialog>, ouvert en mode modal — le navigateur gère le fond, le focus, Échap et le clic à l’extérieur.',
    activeHref: '/fr/ui/modal',
    children: [
      p(
        'Une modale est un ',
        code('<dialog>'),
        '. N’importe quel bouton dont le ',
        code('commandfor'),
        ' vise l’',
        code('id'),
        ' de la modale, avec ',
        code("command: 'show-modal'"),
        ', l’ouvre en mode modal : la page derrière devient inerte, le focus et le lecteur d’écran restent donc dedans. Sans le moindre script — le fond, Échap et le clic à l’extérieur sont l’affaire du navigateur.',
      ),
      p(
        'C’est pourquoi l’',
        code('id'),
        ' est obligatoire et que le composant lève une erreur sans lui : l’id est tout le câblage.',
      ),

      h2('Modale de base'),
      p('Chaque modale de cette page s’ouvre vraiment — essayez.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Ouvrir la modale'),
  modal({ id: 'demo-basic', title: 'Reconstruire le site ?' },
    'Cela lance sitelo build et republie dist/.',
  ),
)`),

      h2('Avec un pied'),
      p(
        'Un bouton de fermeture est n’importe quel bouton pointant vers le même id avec ',
        code("command: 'close'"),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Supprimer la page…'),
  modal({
    id: 'demo-confirm',
    title: 'Supprimer cette page ?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Annuler'),
      button({ color: 'danger' }, 'Supprimer'),
    ),
  }, 'C’est irréversible. Le HTML généré disparaît au prochain build.'),
)`),

      h2('Tailles'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Petite'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Moyenne'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Grande'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Petite' }, 'size: sm — environ 24rem.'),
  modal({ id: 'demo-md', title: 'Moyenne' }, 'Le défaut — environ 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Grande' }, 'size: lg — environ 48rem.'),
)`),

      h2('Des formulaires dans une modale'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'Nouvelle page…'),
  modal({
    id: 'demo-form',
    title: 'Nouvelle page',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Annuler'),
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
        ' retire le × du coin. Échap et le clic à l’extérieur la ferment toujours ; avec ',
        code("closedby: 'closerequest'"),
        ', seul Échap la ferme.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'Sans bouton de fermeture'),
  modal({ id: 'demo-bare', title: 'Appuyez sur Échap', closable: false },
    'Ou cliquez n’importe où en dehors de ce dialogue.',
  ),
)`),

      h2('Contenu long'),
      p('Le corps défile ; l’en-tête et le pied restent en place.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Modale longue'),
  modal({
    id: 'demo-long',
    title: 'Notes de version',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Fermer'),
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
        'La page derrière une modale ouverte ne défile pas. C’est la seule chose qu’un dialogue modal vous laisse, et elle est faite en CSS ici — aucun script, rien à initialiser. Passez ',
        code('lockScroll: false'),
        ' pour laisser l’arrière-plan défiler comme d’habitude.',
      ),

      h2('Prise en charge des navigateurs'),
      p(
        'Ouvrir un dialogue depuis le command d’un bouton fonctionne dans tous les navigateurs actuels — Chrome 135, Firefox 144 et Safari 26.2 ou plus récents. Dans un plus ancien, button() ajoute un onclick qui charge quelques centaines d’octets de /su/dialog.js pour faire de même — là seulement, et au premier clic. Safari ne ferme pas encore un dialogue au clic extérieur (closedby) ; le même fichier s’en charge aussi.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obligatoire. Ce que vise le commandfor d’un déclencheur.'],
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
