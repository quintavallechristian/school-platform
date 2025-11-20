# Rimuovere l'indice unico dal campo email

## Problema
MongoDB mantiene ancora l'indice unico sul campo `email` della collection `email-subscribers`, anche se abbiamo rimosso `unique: true` dal codice.

## Soluzione

### Opzione 1: Via MongoDB Compass (GUI)
1. Apri MongoDB Compass
2. Connettiti al tuo database
3. Vai alla collection `email-subscribers`
4. Clicca sulla tab "Indexes"
5. Trova l'indice chiamato `email_1`
6. Clicca su "Drop Index" per rimuoverlo

### Opzione 2: Via MongoDB Shell (CLI)
Esegui questo comando nel terminale:

```bash
# Connettiti al database MongoDB
mongosh "YOUR_DATABASE_URI"

# Seleziona il database (sostituisci con il nome del tuo database)
use your_database_name

# Rimuovi l'indice unico sul campo email
db.email-subscribers.dropIndex("email_1")

# Verifica che l'indice sia stato rimosso
db.email-subscribers.getIndexes()
```

### Opzione 3: Script Node.js
Crea un file temporaneo `remove-index.js`:

```javascript
const { MongoClient } = require('mongodb')

async function removeIndex() {
  const uri = process.env.DATABASE_URI
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    const db = client.db()
    const collection = db.collection('email-subscribers')
    
    // Rimuovi l'indice
    await collection.dropIndex('email_1')
    console.log('✅ Indice email_1 rimosso con successo!')
    
    // Mostra gli indici rimanenti
    const indexes = await collection.indexes()
    console.log('Indici rimanenti:', indexes)
  } catch (error) {
    console.error('❌ Errore:', error)
  } finally {
    await client.close()
  }
}

removeIndex()
```

Poi eseguilo:
```bash
node remove-index.js
```

## Verifica
Dopo aver rimosso l'indice, prova a creare due iscrizioni con la stessa email ma scuole diverse. Dovrebbe funzionare!

## Note
- L'indice `_id` è quello predefinito di MongoDB e non va rimosso
- Dopo aver rimosso l'indice, la validazione dell'unicità email+school sarà gestita dal nostro hook `beforeValidate`
