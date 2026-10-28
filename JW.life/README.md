# JW.life

App web progressiva (PWA) personale per tenere traccia degli **obiettivi spirituali** e dei **versetti biblici preferiti**. Tema scuro, stile "glass" in tonalità di blu.

## Cosa fa

- **Obiettivi**: settimanali, mensili, annuali o a tempo indeterminato. A fine periodo l'obiettivo passa in "Da verificare" e lo segni come fatto o non fatto. Quelli completati si possono rifare con "Riprova".
- **Versetti**: salvi riferimento, testo e note personali, e li raggruppi per tema (es. Amore). I gruppi diventano filtri.
- **Adunanze**: segni le tue parti con data e ora; scegli se il promemoria arriva 3 giorni prima, il giorno prima o il giorno stesso. Compare in alto nella sezione e, se attivi le notifiche, anche come avviso all'apertura dell'app.
- **Bibbia**: tutti i 66 libri con i capitoli; tocchi un capitolo per segnarlo come letto e puoi aggiungere una nota. Vedi il progresso per libro e totale (1189 capitoli).
- I dati restano **solo sul tuo dispositivo** (localStorage), niente account e niente server.

## Struttura

```
JW.life/
├── index.html
├── manifest.json
├── sw.js              # service worker (uso offline)
├── css/style.css
├── js/app.js
└── assets/
    ├── logo-spiritual.png   # logo nell'app e nella schermata di avvio
    ├── icon-192.png / icon-512.png   # icone PWA
    ├── icon-maskable-512.png         # icona adattiva Android
    ├── apple-touch-icon.png          # icona iPhone/iPad
    └── favicon-48.png
```

## Come usarla

1. Il logo e tutte le icone sono già in `assets/`.
2. Pubblica su **GitHub Pages**: *Settings → Pages → Deploy from branch → main / root*. Servono HTTPS e un account che supporti Pages per repo privati.
3. Apri l'indirizzo dal telefono:
   - **iPhone**: Safari → Condividi → *Aggiungi a Home*.
   - **Android**: Chrome → menu → *Installa app*.
4. In locale puoi provarla con `python3 -m http.server` e aprendo `http://localhost:8000`.

## Note

- Se aggiorni i file, cambia il numero di versione `CACHE` in `sw.js` (es. `jwlife-v2`) per forzare l'aggiornamento.
- Svuotando i dati del browser si perdono obiettivi e versetti: un export/backup è tra le prossime idee.

- I promemoria e le notifiche funzionano quando apri l'app: per notifiche a app chiusa servirebbe un piccolo server push.
