# QA Playwright SaaS

Una piattaforma SaaS per il monitoraggio automatico di siti web utilizzando Playwright. Permette di configurare scenari di test personalizzati, eseguirli secondo schedule definite e ricevere notifiche in caso di errori.

## Struttura del Progetto

```
.
├── apps/
│   ├── web/                # Frontend Next.js
│   └── worker/             # Worker BullMQ con Playwright
├── infra/
│   ├── docker/             # Configurazioni Docker
│   │   ├── web.Dockerfile
│   │   └── worker.Dockerfile
│   └── prisma/             # Schema e client Prisma
├── packages/
│   └── shared/             # Codice condiviso (tipi, costanti, env)
├── .env.example            # Template per variabili d'ambiente
├── package.json            # Configurazione root del monorepo
├── pnpm-workspace.yaml     # Configurazione workspace PNPM
├── render.yaml             # Blueprint per deploy su Render
├── tsconfig.json           # Configurazione TypeScript base
└── turbo.json              # Configurazione Turborepo
```

## Comandi Locali

### Setup Iniziale

```bash
# Installare le dipendenze
pnpm install

# Copiare il file .env.example in .env e configurare le variabili
cp .env.example .env

# Generare il client Prisma
pnpm -F prisma generate

# Creare il database e applicare le migrazioni
pnpm db:migrate

# Popolare il database con dati di esempio
pnpm db:seed
```

### Sviluppo

```bash
# Avviare tutti i servizi in modalità sviluppo
pnpm dev

# Avviare solo il frontend
pnpm -F web dev

# Avviare solo il worker
pnpm -F worker dev
```

### Build

```bash
# Build di tutti i pacchetti e applicazioni
pnpm build

# Build di un singolo pacchetto/app
pnpm -F web build
pnpm -F worker build
pnpm -F shared build
```

### Database

```bash
# Applicare le migrazioni
pnpm db:migrate

# Creare una nuova migrazione
pnpm -F prisma migrate:dev

# Applicare le migrazioni in produzione
pnpm -F prisma migrate:deploy

# Aggiornare il database senza creare migrazioni (solo sviluppo)
pnpm -F prisma db:push

# Popolare il database con dati di esempio
pnpm -F prisma db:seed
```

## Scenari Playwright

Gli scenari Playwright sono script che definiscono le interazioni con il browser. Il sistema include due esempi:

### Scenario Base (basic.ts)

Verifica il titolo della pagina, cerca link rotti e cattura uno screenshot.

```typescript
// apps/worker/src/templates/basic.ts
async function run({ page, target, logger, MAX_LINKS_TO_CHECK }) {
  // Naviga all'URL del target
  await page.goto(target.url);
  
  // Verifica il titolo della pagina
  const title = await page.title();
  
  // Cerca link rotti (limitati a MAX_LINKS_TO_CHECK)
  // ...
  
  // Cattura uno screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  return { title, brokenLinks, jsErrors, assertions, assertionsPassed };
}
```

### Scenario Login (login.ts)

Verifica il processo di login utilizzando credenziali configurate.

```typescript
// apps/worker/src/templates/login.ts
async function run({ page, target, logger }) {
  // Recupera i parametri dalle variabili d'ambiente
  const params = {
    loginUrl: process.env.LOGIN_URL || target.url,
    usernameSelector: process.env.USERNAME_SELECTOR || 'input[type="email"]',
    // ...
  };
  
  // Naviga alla pagina di login e compila il form
  await page.goto(params.loginUrl);
  await page.fill(params.usernameSelector, params.username);
  await page.fill(params.passwordSelector, params.password);
  
  // Invia il form e verifica il successo
  // ...
  
  return { loginSuccess, jsErrors, assertions, assertionsPassed };
}
```

## Deploy su Render

### Prerequisiti

1. Account Render (https://render.com)
2. Account Stripe per il billing (opzionale)
3. Bucket S3 o compatibile per lo storage degli artefatti
4. Server SMTP per le notifiche email

### Istruzioni di Deploy

1. **Importare il Blueprint**
   - Accedi a Render e vai su "Blueprints"
   - Clicca "New Blueprint Instance"
   - Connetti il repository GitHub
   - Seleziona il repository e clicca "Apply"

2. **Configurare le Variabili d'Ambiente**
   - Render creerà automaticamente i servizi definiti in `render.yaml`
   - Per ogni servizio, configura le variabili d'ambiente mancanti:
     - `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` (da Stripe)
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (da Stripe)
     - `EMAIL_SERVER` e `EMAIL_FROM` (per le notifiche email)
     - `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` (per lo storage)
     - `SLACK_WEBHOOK_URL` (opzionale, per notifiche Slack)
     - `APP_URL` (URL pubblico dell'applicazione)

3. **Configurare il Webhook Stripe**
   - In Stripe, vai su "Developers" > "Webhooks"
   - Aggiungi un endpoint: `https://tua-app.onrender.com/api/webhooks/stripe`
   - Seleziona gli eventi: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

4. **Applicare le Migrazioni del Database**
   - Dopo il deploy iniziale, esegui le migrazioni:
   ```bash
   render run --service qa-playwright-web pnpm -F prisma migrate:deploy
   ```

5. **Verifica del Deploy**
   - Accedi all'URL dell'applicazione
   - Registra un account e verifica che tutto funzioni correttamente

## Note di Implementazione

- **Scheduler**: Il worker utilizza uno scheduler interno che controlla ogni 30 secondi i job da eseguire in base alle configurazioni cron.
- **Isolamento**: Ogni run viene eseguito in un browser context nuovo con un timeout di 60-120 secondi.
- **Limiti**: Il check dei link rotti è limitato a 50 link per evitare carichi eccessivi.
- **Docker**: L'immagine web non include Playwright per ridurre le dimensioni; Playwright è presente solo nell'immagine worker.