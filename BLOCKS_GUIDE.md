# Guida ai Blocchi Personalizzati nelle Pages

## 🎨 Cos'è un blocco?

I **blocchi** sono sezioni componibili che puoi aggiungere alle tue pagine dal pannello admin. Sono come mattoncini LEGO: puoi combinarli per creare pagine uniche senza scrivere codice.

## 📦 Blocchi disponibili

### 1. **Call to Action** (CTA)

Perfetto per sezioni come "Conosci il Nostro Team" o "Iscriviti Ora"

**Campi:**

- **Titolo**: Titolo principale del blocco
- **Sottotitolo**: Descrizione o testo esplicativo
- **Immagine di sfondo**: (opzionale, non ancora implementato nel design)
- **Pulsanti**: Fino a 3 pulsanti con:
  - Testo del pulsante
  - Link (URL)
  - Stile (Primario, Secondario, Outline, Ghost)

**Esempio d'uso:**

```
Titolo: "Conosci il Nostro Team"
Sottotitolo: "Scopri i nostri insegnanti e le loro competenze"
Pulsante 1: "Vedi gli Insegnanti" → /chi-siamo/insegnanti
```

---

### 2. **Testo Formattato** (Rich Text)

Per aggiungere paragrafi di testo con formattazione

**Campi:**

- **Contenuto**: Editor rich text completo

**Esempio d'uso:**

```
Usa questo blocco per sezioni narrative, liste, citazioni, ecc.
```

---

### 3. **Griglia di Card**

Per mostrare più elementi in una griglia (es: servizi, valori, features)

**Campi:**

- **Titolo della sezione**: (opzionale) Titolo sopra la griglia
- **Numero di colonne**: 2, 3 o 4 colonne
- **Card**: Array di card, ognuna con:
  - Titolo
  - Descrizione
  - Immagine
  - Link (opzionale)

**Esempio d'uso:**

```
Titolo: "I Nostri Valori"
Colonne: 3
Card 1: "Inclusività" + descrizione
Card 2: "Innovazione" + descrizione
Card 3: "Eccellenza" + descrizione
```

---

### 4. **File Scaricabili** (File Download)

Per caricare documenti scaricabili come PDF, moduli, circolari, ecc.

**Campi:**

- **Titolo della sezione**: (opzionale) Es: "Documenti Utili", "Moduli da scaricare"
- **Descrizione**: (opzionale) Testo introduttivo
- **File**: Array di file, ognuno con:
  - File (PDF, DOC, XLS, ZIP, ecc.)
  - Titolo (opzionale, se vuoto usa il nome del file)
  - Descrizione (opzionale)

**Caratteristiche:**

- 📄 Icone colorate in base al tipo di file (PDF rosso, DOC blu, XLS verde)
- 📊 Mostra automaticamente dimensione e formato del file
- ⬇️ Pulsante "Scarica" per ogni file
- 📱 Layout responsive a 2 colonne su desktop, 1 su mobile

**Esempio d'uso:**

```
Titolo: "Moduli di Iscrizione"
Descrizione: "Scarica i moduli necessari per l'iscrizione"

File 1:
  - File: modulo-iscrizione-2024.pdf
  - Titolo: "Modulo di Iscrizione A.S. 2024/2025"
  - Descrizione: "Da compilare e consegnare in segreteria"

File 2:
  - File: autocertificazione.pdf
  - Titolo: "Autocertificazione"
```

---

**Campi:**

- **Titolo della sezione**: (opzionale) Titolo sopra la griglia
- **Numero di colonne**: 2, 3 o 4 colonne
- **Card**: Array di card, ognuna con:
  - Titolo
  - Descrizione
  - Immagine
  - Link (opzionale)

**Esempio d'uso:**

```
Titolo: "I Nostri Valori"
Colonne: 3
Card 1: "Inclusività" + descrizione
Card 2: "Innovazione" + descrizione
Card 3: "Eccellenza" + descrizione
```

## 🎯 Come creare una pagina "Chi Siamo" con blocchi

### Passo 1: Crea la pagina base

1. Vai su `/admin/collections/pages`
2. Clicca "Create New"
3. Compila:
   - **Titolo**: `Chi Siamo`
   - **Slug**: `chi-siamo`
   - **Sottotitolo**: `Scopri di più sulla nostra scuola e il nostro team di insegnanti`
   - **Contenuto principale**: Scrivi la missione della scuola

### Passo 2: Aggiungi il contenuto principale

Nel campo "Contenuto principale", scrivi:

```
La Nostra Missione

La nostra scuola si impegna a fornire un'educazione di qualità che prepara gli studenti per il futuro.
Crediamo nell'apprendimento innovativo e nell'inclusività.

Con un team di insegnanti dedicati e appassionati, creiamo un ambiente di apprendimento stimolante
dove ogni studente può crescere e raggiungere il proprio potenziale.
```

### Passo 3: Aggiungi un blocco "Call to Action"

1. Scorri giù fino a "Blocchi Personalizzati"
2. Clicca "+ Add Call To Action"
3. Compila:
   - **Titolo**: `Conosci il Nostro Team`
   - **Sottotitolo**: `Scopri i nostri insegnanti e le loro competenze`
   - Clicca "+ Add Pulsanti"
     - **Testo**: `Vedi gli Insegnanti`
     - **Link**: `/chi-siamo/insegnanti`
     - **Stile**: Primario

### Passo 4: (Opzionale) Aggiungi una griglia di card

1. Clicca "+ Add Griglia Di Card"
2. Compila:
   - **Titolo della sezione**: `I Nostri Valori`
   - **Numero di colonne**: 3
   - Clicca "+ Add Card" (ripeti 3 volte):

     **Card 1:**
     - Titolo: `Inclusività`
     - Descrizione: `Accogliamo ogni studente valorizzando le sue unicità`

     **Card 2:**
     - Titolo: `Innovazione`
     - Descrizione: `Usiamo metodi didattici moderni e tecnologia`

     **Card 3:**
     - Titolo: `Eccellenza`
     - Descrizione: `Puntiamo all'eccellenza in ogni aspetto educativo`

### Passo 5: Salva

Clicca "Save" in alto a destra

### Passo 6: Visualizza

Vai su `/pagine/chi-siamo` per vedere il risultato!

## 🔄 Ordinare i blocchi

I blocchi appaiono nell'ordine in cui li aggiungi. Per riordinarli:

1. Usa i pulsanti "↑" e "↓" accanto a ogni blocco
2. Oppure trascina i blocchi nell'ordine desiderato

## ❌ Eliminare un blocco

Clicca sul pulsante "🗑️" accanto al blocco che vuoi rimuovere.

## 🎨 Esempio completo: Pagina "Iscrizioni"

Ecco come creare una pagina con file scaricabili:

### Struttura:

```
📄 Iscrizioni
  └─ 🏆 Hero
      ├─ Titolo: "Iscrizioni A.S. 2024/2025"
      └─ Sottotitolo: "Tutte le informazioni per iscrivere tuo figlio"

  └─ 📝 Contenuto principale
      └─ Testo con date e scadenze

  └─ 📦 Blocchi:
      ├─ 📄 File Scaricabili "Moduli di Iscrizione"
      │   ├─ modulo-iscrizione.pdf
      │   ├─ autocertificazione.pdf
      │   └─ liberatoria-privacy.pdf
      │
      ├─ 📋 Griglia di Card "Documenti Necessari"
      │   ├─ Card 1: Documento identità
      │   ├─ Card 2: Codice fiscale
      │   └─ Card 3: Certificato vaccinazioni
      │
      └─ 🎯 Call to Action "Hai bisogno di aiuto?"
          └─ Pulsante "Contatta la Segreteria"
```

## 🎨 Esempio completo: Pagina "Chi Siamo"

Struttura finale:

```
📄 Chi Siamo
  └─ 🏆 Hero (automatico)
      ├─ Titolo: "Chi Siamo"
      └─ Sottotitolo: "Scopri di più sulla nostra scuola..."

  └─ 📝 Contenuto principale
      └─ Testo sulla missione

  └─ 📦 Blocchi:
      ├─ 📋 Griglia di Card "I Nostri Valori" (3 card)
      └─ 🎯 Call to Action "Conosci il Nostro Team" (con pulsante)
```

Risultato visivo:

```
+------------------------------------------+
|         CHI SIAMO (Hero)                 |
|  Scopri di più sulla nostra scuola...    |
+------------------------------------------+

La Nostra Missione
[testo della missione...]

+-------------+-------------+-------------+
| Inclusività | Innovazione | Eccellenza  |
| [desc]      | [desc]      | [desc]      |
+-------------+-------------+-------------+

+------------------------------------------+
|     Conosci il Nostro Team              |
|  Scopri i nostri insegnanti...          |
|     [Vedi gli Insegnanti]               |
+------------------------------------------+
```

## 💡 Tips & Best Practices

### ✅ DO:

- Usa **Call to Action** per guidare l'utente ad azioni importanti
- Usa **Griglia di Card** per presentare informazioni multiple in modo ordinato
- Usa **Testo Formattato** per sezioni narrative lunghe
- Combina più blocchi per creare layout ricchi

### ❌ DON'T:

- Non aggiungere troppi blocchi CTA (max 2-3 per pagina)
- Non usare troppi colori/stili diversi
- Non dimenticare di testare su mobile

## 🚀 Blocchi implementati ✅

- ✅ **Call to Action**: Sezioni CTA con pulsanti personalizzabili
- ✅ **Testo Formattato**: Rich text editor completo
- ✅ **Griglia di Card**: Card responsive in 2/3/4 colonne
- ✅ **File Scaricabili**: Upload e download di PDF, DOC, XLS, ecc.

## 🚀 Blocchi futuri (TODO)

Potremmo aggiungere:

- **Image Gallery**: Galleria di immagini con lightbox
- **Video Embed**: Incorpora video YouTube/Vimeo
- **Accordion/FAQ**: Contenuti espandibili per domande frequenti
- **Stats Counter**: Contatori numerici animati
- **Testimonials**: Recensioni/testimonianze con foto
- **Timeline**: Timeline temporale per mostrare la storia
- **Contact Form**: Modulo di contatto integrato
- **Google Maps**: Mappa con posizione della scuola

## 🛠️ Per sviluppatori

### Aggiungere un nuovo tipo di blocco

1. Modifica `/src/collections/Pages.ts` - aggiungi il blocco nell'array `blocks`
2. Rigenera i tipi: `npm run generate:types`
3. Crea il componente in `/src/components/PageBlocks/[NomeBlock].tsx`
4. Registra il blocco in `/src/components/PageBlocks/PageBlocks.tsx`

Esempio:

```typescript
// In Pages.ts
{
  slug: 'imageGallery',
  labels: {
    singular: 'Galleria Immagini',
    plural: 'Gallerie Immagini',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
```
