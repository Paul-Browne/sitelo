import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Gruppo di radio',
    description:
      'Una scelta fra diverse, come veri input radio che condividono un nome — con una legenda e un ruolo di gruppo.',
    activeHref: '/it/ui/radio',
    children: [
      p(
        'I radio servono a scegliere esattamente un’opzione fra un insieme piccolo e visibile. ',
        code('radio()'),
        ' ne renderizza uno; ',
        code('choiceGroup()'),
        ' costruisce l’intero insieme da un array e gli dà la legenda e il ',
        code('role="radiogroup"'),
        ' che lo rendono un gruppo invece di un mucchio di input.',
      ),
      p(
        'Condividono un ',
        code('name'),
        ', quindi è il browser a occuparsi della mutua esclusività e della navigazione fra loro con le frecce. Qui non viene spedito alcuno script.',
      ),

      h2('Gruppo di base'),
      demo(`choiceGroup({
  legend: 'Piano',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Gratuito' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team' },
  ],
})`, { align: 'stretch' }),

      h2('In riga'),
      p(
        'Le etichette corte si leggono meglio su una riga sola. Quelle lunghe dovrebbero restare impilate, che è il comportamento predefinito.',
      ),
      demo(`choiceGroup({
  legend: 'Formato',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('Semplici stringhe'),
      p('Quando il valore e l’etichetta coincidono, passa delle stringhe.'),
      demo(`choiceGroup({
  legend: 'Livello di log',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Opzioni disattivate'),
      demo(`choiceGroup({
  legend: 'Renderer',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Statico' },
    { value: 'islands', label: 'Island server' },
    { value: 'ssr', label: 'SSR completo', disabled: true },
  ],
  help: 'L’SSR completo richiede un host Node, che questo progetto non ha.',
})`, { align: 'stretch' }),

      h2('Uno per volta'),
      p(
        'Usa ',
        code('radio()'),
        ' direttamente quando le opzioni non sono abbastanza uniformi da venire da un array — per esempio quando ciascuna porta una descrizione propria.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'A ogni push', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'Solo sui rilasci con tag' }),
  radio({ name: 'deploy', value: 'manual', label: 'Manualmente' }),
)`, { align: 'stretch' }),

      h2('Colori'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('In una scheda'),
      demo(`card(
  cardHeader({ title: 'Impostazioni di build', subtitle: 'Applicate al prossimo deploy' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'URL puliti',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'Attivi' },
          { value: 'off', label: 'Disattivi' },
        ],
      }),
      choiceGroup({
        legend: 'Immagini',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Ridimensiona e converti' },
          { value: 'copy', label: 'Copia così come sono' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Salva'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('choiceGroup()'), ':'),
      propsTable([
        ['legend', 'Child', '', 'Etichetta dell’intero gruppo.'],
        ['name', 'string', '', 'Nome di form condiviso — ciò che rende i radio esclusivi.'],
        ['options', 'Array', '[]', 'Stringhe, oppure oggetti { value, label, disabled }.'],
        ['value', 'string | number | Array', '', 'Quale opzione è selezionata. Un array per le caselle di controllo.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Quale controllo costruire. Sceglie anche il ruolo del gruppo.'],
        ['direction', "'row' | 'column'", "'column'", 'Come vengono disposte le opzioni.'],
        ['help', 'Child', '', 'Suggerimento sotto il gruppo.'],
      ]),
      p(
        code('radio()'),
        ' accetta le stesse props di ',
        code('checkbox()'),
        ': ',
        code('label'),
        ', ',
        code('color'),
        ', ',
        code('checked'),
        ', ',
        code('name'),
        ', ',
        code('value'),
        ' e ',
        code('disabled'),
        '.',
      ),
    ],
  })
