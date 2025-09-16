# Ghigus Frontend

Applicazione frontend costruita con [React](https://react.dev/), [Vite](https://vitejs.dev/) e [TypeScript](https://www.typescriptlang.org/). Lo stile è gestito tramite [Tailwind CSS](https://tailwindcss.com/) e i grafici sono resi con [Recharts](https://recharts.org/).

## Requisiti

- Node.js 18+ (consigliata la LTS più recente)
- npm, pnpm oppure yarn

## Variabili d'ambiente

Copia il file `.env.example` in `.env` e personalizza la variabile se necessario:

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL="https://api.ghigus.it"
```

> ℹ️ L'endpoint è un placeholder: aggiorna il valore con l'URL reale dell'API. Se l'API non è configurata per accettare richieste dal dominio del frontend, abilita il CORS lato server oppure utilizza un proxy di sviluppo.

## Installazione dipendenze

```bash
npm install
```

## Comandi disponibili

- `npm run dev`: avvia il server di sviluppo di Vite con hot reload.
- `npm run build`: esegue il type-check e produce la build ottimizzata in `dist/`.
- `npm run preview`: avvia un server locale per ispezionare la build prodotta.

## Struttura del progetto

```
src/
├── components/        # Componenti UI riutilizzabili (FileDrop, AssumptionsForm, ...)
├── lib/               # Wrapper API e utilità condivise
├── pages/             # Pagine principali (Dashboard, NewCase, Results, ReportEditor)
├── types.ts           # Tipi e interfacce condivisi
└── main.tsx / App.tsx # Bootstrap dell'applicazione e routing
```

## Note su CORS

L'applicazione effettua chiamate tramite `fetch` verso `VITE_API_BASE_URL`. Assicurati che il servizio remoto esponga le intestazioni CORS corrette (ad esempio `Access-Control-Allow-Origin`) per consentire al browser di completare le richieste. In ambiente di sviluppo puoi usare un proxy (come quello integrato in Vite) per aggirare temporaneamente le limitazioni.
