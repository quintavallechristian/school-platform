# 🏫 School Platform - Multi-Tenant SaaS

Una piattaforma completa multi-tenant per la gestione di scuole, costruita con Payload CMS 3.x e Next.js 15.

## ✨ Caratteristiche Principali

### 🎯 Multi-Tenancy
- **Isolamento completo dei dati** - Ogni scuola ha i propri contenuti
- **Gestione autonoma** - School admin gestiscono la propria scuola
- **Personalizzazione** - Logo, colori e dominio per ogni scuola
- **Scalabile** - Supporta infinite scuole sulla stessa installazione

### 👥 Sistema di Ruoli
- **Super Admin** - Gestione globale di tutte le scuole
- **School Admin** - Amministrazione della propria scuola
- **Editor** - Creazione e modifica contenuti
- **Viewer** - Solo lettura

### 📚 Funzionalità per Scuola
- Blog/Articoli
- Eventi e calendario
- Comunicazioni di servizio con notifiche email
- Menù mensa settimanale
- Gallerie fotografiche
- Pagine personalizzabili
- Gestione insegnanti
- Iscrizioni newsletter

### 🎨 Personalizzazione
- Logo personalizzato per scuola
- Colori del tema configurabili
- Domini personalizzati (opzionale)
- Multi-lingua supportata

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+ 
- pnpm 9+
- MongoDB

### Installazione

1. **Clona il repository**
   ```bash
   git clone <repo-url>
   cd school-blog
   ```

2. **Installa le dipendenze**
   ```bash
   pnpm install
   ```

3. **Configura le variabili d'ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Modifica `.env` con i tuoi dati:
   ```env
   DATABASE_URI=mongodb://localhost:27017/school-platform
   PAYLOAD_SECRET=your-secret-key
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   RESEND_API_KEY=your-resend-api-key  # opzionale
   ```

4. **Genera i tipi TypeScript**
   ```bash
   npm run generate:types
   ```

5. **Avvia il server**
   ```bash
   pnpm dev
   ```

6. **Accedi all'admin**
   
   Apri `http://localhost:3000/admin` e crea il primo utente.

### Setup Multi-Tenant

#### Prima Installazione

Segui la guida completa in **[MULTITENANT_QUICKSTART.md](./MULTITENANT_QUICKSTART.md)**

Passi principali:
1. Crea il primo Super Admin (vedi guida)
2. Crea la prima scuola via `/admin/collections/schools`
3. Assegna la scuola al tuo utente
4. Inizia a creare contenuti!

#### Migrazione da Installazione Esistente

Se hai già dati nel database:

```bash
npm run migrate:multitenant
```

Questo script:
- Crea una scuola di default
- Assegna tutti i contenuti esistenti a questa scuola
- Aggiorna gli utenti con ruoli e scuola

## 📖 Documentazione

### Guide Essenziali
- **[MULTITENANT_QUICKSTART.md](./MULTITENANT_QUICKSTART.md)** - Setup rapido e primi passi
- **[SAAS_MULTITENANT_GUIDE.md](./SAAS_MULTITENANT_GUIDE.md)** - Guida completa (24 pagine)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Diagrammi architettura
- **[CHANGELOG.md](./CHANGELOG.md)** - Changelog dettagliato

### Guide Specifiche
- [BLOCKS_GUIDE.md](./BLOCKS_GUIDE.md) - Sistema di blocchi per pagine
- [PAGES_GUIDE.md](./PAGES_GUIDE.md) - Gestione pagine dinamiche
- [MENU_COLLECTION_GUIDE.md](./MENU_COLLECTION_GUIDE.md) - Sistema menù mensa
- [NAVBAR_CUSTOMIZATION_GUIDE.md](./NAVBAR_CUSTOMIZATION_GUIDE.md) - Personalizzazione navbar

## 🏗️ Architettura

```
┌────────────────────────────────────────┐
│         SUPER ADMIN (Globale)          │
└────────────────┬───────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
     ▼                       ▼
┌─────────────┐         ┌─────────────┐
│  Scuola A   │         │  Scuola B   │
├─────────────┤         ├─────────────┤
│ School Admin│         │ School Admin│
│ Editors     │         │ Editors     │
│ Viewers     │         │ Viewers     │
├─────────────┤         ├─────────────┤
│ Contenuti A │         │ Contenuti B │
│ Media A     │         │ Media B     │
│ Utenti A    │         │ Utenti B    │
└─────────────┘         └─────────────┘
```

Ogni scuola è completamente isolata dalle altre.

## 🛠️ Tecnologie

- **[Payload CMS 3.x](https://payloadcms.com)** - Headless CMS
- **[Next.js 15](https://nextjs.org)** - React Framework
- **[MongoDB](https://www.mongodb.com)** - Database
- **[TypeScript](https://www.typescriptlang.org)** - Type Safety
- **[Tailwind CSS 4](https://tailwindcss.com)** - Styling
- **[Resend](https://resend.com)** - Email Notifications

## 📂 Struttura Progetto

```
school-blog/
├── src/
│   ├── collections/        # Collezioni Payload
│   │   ├── Schools.ts     # ⭐ Gestione scuole
│   │   ├── Users.ts       # 🔄 Con ruoli e multi-tenant
│   │   ├── Articles.ts
│   │   ├── Events.ts
│   │   ├── Teachers.ts
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── access.ts      # ⭐ Access control multi-tenant
│   │   ├── school.ts      # ⭐ Utility functions
│   │   └── utils.ts
│   │
│   ├── app/
│   │   ├── (frontend)/    # Frontend pubblico
│   │   └── (payload)/     # Admin Payload
│   │
│   └── payload.config.ts
│
├── scripts/
│   └── migrate-to-multitenant.ts  # Script migrazione
│
└── docs/                  # Guide e documentazione
```

## 🔧 Scripts Disponibili

```bash
# Sviluppo
pnpm dev              # Avvia server sviluppo
pnpm build            # Build per produzione
pnpm start            # Avvia server produzione

# Payload
npm run generate:types     # Genera tipi TypeScript
npm run generate:importmap # Genera import map

# Migrazione
npm run migrate:multitenant  # Migra a multi-tenant

# Testing
pnpm test           # Esegue tutti i test
pnpm test:e2e       # Test end-to-end
pnpm test:int       # Test integrazione
```

## 🌐 Frontend Multi-Tenant

### Opzione 1: Path-based (Raccomandato per iniziare)

```
https://tuosito.it/scuola-a
https://tuosito.it/scuola-b
```

### Opzione 2: Subdomain-based

```
https://scuola-a.tuosito.it
https://scuola-b.tuosito.it
```

Vedi esempi in:
- `src/app/(frontend)/[school]/layout.example.tsx`
- `src/app/(frontend)/[school]/page.example.tsx`
- `middleware.example.ts`

## 🎯 Piani di Abbonamento

Ogni scuola può avere un piano:

| Piano | Utenti | Storage | Custom Domain |
|-------|--------|---------|---------------|
| Free | 5 | 1 GB | ❌ |
| Starter | 10 | 5 GB | Subdomain |
| Premium | 25 | 20 GB | ✅ |
| Enterprise | Unlimited | Custom | ✅ Multiple |

## 📊 Database Collections

### Sistema
- `schools` - Scuole (tenant)
- `users` - Utenti con ruoli
- `media` - File e immagini

### Contenuti (per scuola)
- `articles` - Blog/notizie
- `events` - Eventi
- `teachers` - Insegnanti
- `menu` - Menù mensa
- `pages` - Pagine personalizzate
- `calendar-days` - Calendario
- `communications` - Comunicazioni
- `gallery` - Gallerie foto
- `email-subscribers` - Iscritti newsletter

## 🔒 Sicurezza

### Access Control Automatico
- ✅ Isolamento dati garantito
- ✅ Filtri automatici su query
- ✅ Validazione ruoli e permessi
- ✅ Impossibile accedere a dati di altre scuole

### Best Practices
- HTTPS obbligatorio in produzione
- Variabili d'ambiente sicure
- Backup regolari database
- Monitoring attivo

## 🐛 Troubleshooting

### Errori TypeScript
```bash
npm run generate:types
```

### Non vedo i contenuti nell'admin
Verifica che il tuo utente abbia:
- Un ruolo assegnato
- Una scuola assegnata

### "Access denied"
Controlla:
1. Ruolo utente
2. Scuola assegnata
3. Access control nelle collezioni

Vedi [MULTITENANT_QUICKSTART.md](./MULTITENANT_QUICKSTART.md#troubleshooting) per altri problemi.

## 🚢 Deployment

### Vercel (Raccomandato)
1. Connetti repository a Vercel
2. Configura variabili d'ambiente
3. Deploy!

### Docker
```bash
docker-compose up -d
```

Vedi `docker-compose.yml` e `Dockerfile`.

## 📈 Roadmap

- [x] Multi-tenancy completo
- [x] Sistema ruoli
- [x] Access control
- [x] Tematizzazione per scuola
- [ ] Sistema billing
- [ ] Analytics per scuola
- [ ] Mobile app
- [ ] API pubbliche

## 🤝 Contributi

Contributi, issues e feature requests sono benvenuti!

## 📝 Licenza

MIT

## 💬 Supporto

Per domande o problemi:
1. Consulta la [documentazione](./SAAS_MULTITENANT_GUIDE.md)
2. Controlla il [troubleshooting](./MULTITENANT_QUICKSTART.md#troubleshooting)
3. Apri una issue su GitHub

---

**Fatto con ❤️ usando Payload CMS e Next.js**
