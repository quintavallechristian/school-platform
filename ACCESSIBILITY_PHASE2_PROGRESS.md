# Rapporto Progressi Accessibilità - Fase 2

## ✅ Interventi Completati

### 1. Verifica e Miglioramento Alt Text
Tutte le immagini principali nei blocchi di contenuto e nelle pagine chiave sono state verificate.
- **ProjectListBlock**: Aggiornato per usare `project.cover.alt` se disponibile.
- **ArticleListBlock**: Aggiornato per usare `article.cover.alt` se disponibile.
- **TeacherListBlock**: Aggiornato per usare `teacher.photo.alt` se disponibile.
- **Pagina Progetti**: Aggiornato per usare `project.cover.alt` se disponibile.

### 2. Live Regions e Notifiche
Il componente `CommunicationsPopup` è stato reso pienamente accessibile.
- Aggiunto `role="dialog"` e `aria-modal="true"`.
- Aggiunto `aria-labelledby` per il titolo.
- Implementata gestione del focus (focus automatico all'apertura).
- Aggiornato `SpotlightCard` per supportare `forwardRef` e props HTML standard, migliorando la flessibilità.

### 3. Accessibilità Tabelle
La tabella del menù mensa (`mensa/page.tsx`) è stata ristrutturata.
- Aggiunto `<caption>` (visibile solo agli screen reader).
- Aggiunti attributi `scope="col"` alle intestazioni di colonna.
- Aggiunti attributi `scope="row"` alle intestazioni di riga (numero settimana).

### 4. Navigazione Contestuale (Breadcrumbs)
- Creato nuovo componente `Breadcrumbs` (`src/components/Breadcrumbs/Breadcrumbs.tsx`).
- **Posizionamento Aggiornato**: Il componente è stato inserito manualmente in ogni pagina (`page.tsx`) subito dopo il componente `Hero`, invece che nel layout globale. Questo assicura che sia sempre visibile sotto l'area hero, evitando sovrapposizioni con l'header o sfondi scuri.
- Implementato nelle pagine principali: Documenti, Progetti, Eventi, Blog, Mensa, Insegnanti.
- Implementato nelle pagine di dettaglio: Progetto singolo, Evento singolo.
- Il componente gestisce automaticamente i percorsi e fornisce etichette leggibili.

## 📝 Prossimi Passi (Fase 2 - Continuazione)

- **Test Manuale**: Verificare la navigazione con tastiera (Tab) su Breadcrumbs e Popup.
- **Screen Reader**: Testare l'annuncio del Popup e la lettura della tabella mensa.
- **Loading States**: Identificare aree dove il caricamento non è annunciato e implementare i componenti `LoadingSpinner` o `Skeleton` creati nella Fase 1.
