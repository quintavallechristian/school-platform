import React from 'react'

export function DpaContent() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {/* Header principale */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
          Data Processing Agreement (DPA)
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 dark:bg-purple-950/20 rounded">
          <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
        </p>
      </div>

      {/* Intro */}
      <div className="mb-10 p-6 bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <p className="text-lg leading-relaxed m-0">
          Il presente Data Processing Agreement (“<strong>DPA</strong>”) disciplina il trattamento
          dei dati personali effettuato da
          <strong> Christian Quintavalle</strong> (“<strong>Responsabile</strong>”) per conto della
          scuola che utilizza la piattaforma
          <strong> scuoleinfanzia</strong> (“<strong>Titolare</strong>”), ai sensi dell’art. 28 del
          Regolamento (UE) 2016/679 (GDPR).
        </p>
      </div>

      {/* Sezione 1 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-purple-500">
          1. Parti del contratto
        </h3>
        <div className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-l-4 border-purple-500">
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Titolare del trattamento:</strong> La scuola che crea un account su School
              Platform tramite un rappresentante autorizzato.
            </li>
            <li>
              <strong>Responsabile del trattamento:</strong> Christian Quintavalle – via R.A.
              Livatino 10/D – CF QNTCRS92E05G888C – privacy@scuoleinfanzia.eu
            </li>
          </ul>
        </div>
      </section>

      {/* Sezione 2 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-500">
          2. Oggetto del trattamento
        </h3>
        <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il Responsabile fornisce al Titolare la piattaforma scuoleinfanzia per la gestione di
            comunicazioni, documenti, immagini, attività scolastiche e utenti. Il Responsabile
            tratta i dati esclusivamente per conto del Titolare, secondo le sue istruzioni.
          </p>
        </div>
      </section>

      {/* Sezione 3 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-500">3. Durata</h3>
        <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il presente DPA è valido per tutta la durata del rapporto contrattuale tra scuola e
            piattaforma. Alla cessazione del servizio, il DPA si risolve automaticamente.
          </p>
        </div>
      </section>

      {/* Sezione 4 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-orange-500">
          4. Tipologia di dati trattati
        </h3>
        <div className="p-6 bg-orange-50 dark:bg-orange-950/20 rounded-lg border-l-4 border-orange-500">
          <ul className="text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>• Dati di contatto: nome, cognome, email, telefono (se inserito dalla scuola)</li>
            <li>• Dati di accesso: account, ruoli e permessi interni</li>
            <li>• Contenuti caricati: documenti, foto, materiali didattici</li>
            <li>• Dati relativi all’uso tecnico della piattaforma</li>
          </ul>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 m-0">
            <strong>Il Responsabile non tratta autonomamente dati dei minori.</strong> Eventuali
            dati o immagini di minori sono inseriti dal Titolare, sotto sua esclusiva
            responsabilità.
          </p>
        </div>
      </section>

      {/* Sezione 5 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-teal-500">
          5. Finalità del trattamento
        </h3>
        <div className="p-6 bg-teal-50 dark:bg-teal-950/20 rounded-lg border-l-4 border-teal-500">
          <ul className="text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>• Erogazione del servizio scuoleinfanzia</li>
            <li>• Hosting e archiviazione dei contenuti</li>
            <li>• Invio di email transazionali e notifiche</li>
            <li>• Manutenzione tecnica, aggiornamenti e supporto</li>
            <li>• Sicurezza informatica</li>
            <li>• Analisi statistiche aggregate (non identificative)</li>
          </ul>
        </div>
      </section>

      {/* Sezione 6 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-yellow-500">
          6. Istruzioni del Titolare
        </h3>
        <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-l-4 border-yellow-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il Responsabile tratta i dati solo secondo istruzioni documentate del Titolare, non li
            utilizza per finalità proprie e non li divulga a terzi non autorizzati.
          </p>
        </div>
      </section>

      {/* Sezione 7 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-indigo-500">
          7. Sub-responsabili
        </h3>
        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-500">
          <p className="text-neutral-700 dark:text-neutral-300 mb-3">
            Il Titolare autorizza il Responsabile a utilizzare i seguenti sub-responsabili:
          </p>
          <ul className="space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Vercel Inc.</strong> – Hosting
            </li>
            <li>
              <strong>Cloudflare R2</strong> – Storage
            </li>
            <li>
              <strong>Stripe Payments Europe</strong> – Pagamenti
            </li>
            <li>
              <strong>Brevo</strong> – Email transazionali
            </li>
            <li>
              <strong>Google LLC</strong> – Analytics
            </li>
          </ul>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 m-0">
            Tutti i sub-responsabili adottano adeguate garanzie ai sensi dell’art. 28 GDPR, incluse
            Clausole Contrattuali Standard.
          </p>
        </div>
      </section>

      {/* Sezione 8 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-red-500">
          8. Sicurezza dei dati
        </h3>
        <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border-l-4 border-red-500">
          <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>cifratura dei dati in transito (HTTPS)</li>
            <li>controllo accessi basato su ruoli</li>
            <li>backup regolari e storage sicuro</li>
            <li>misure anti-intrusione</li>
            <li>segregazione multi-tenant</li>
          </ul>
        </div>
      </section>

      {/* Sezione 9 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-rose-500">
          9. Data Breach
        </h3>
        <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-lg border-l-4 border-rose-500">
          <p className="text-neutral-700 dark:text-neutral-300 mb-3">
            In caso di violazione dei dati personali, il Responsabile informerà il Titolare
            tempestivamente e comunque entro 48 ore, fornendo:
          </p>
          <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>descrizione dell’incidente</li>
            <li>tipologia di dati coinvolti</li>
            <li>misure adottate</li>
            <li>azioni correttive proposte</li>
          </ul>
        </div>
      </section>

      {/* Sezione 10 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-teal-500">
          10. Obblighi del Titolare
        </h3>
        <div className="p-6 bg-teal-50 dark:bg-teal-950/20 rounded-lg border-l-4 border-teal-500">
          <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>raccogliere i consensi necessari (es. foto minori)</li>
            <li>gestire correttamente gli accessi e i ruoli</li>
            <li>non caricare dati eccessivi o non pertinenti</li>
            <li>fornire istruzioni conformi al GDPR</li>
            <li>rispondere alle richieste degli interessati</li>
          </ul>
        </div>
      </section>

      {/* Sezione 11 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-yellow-500">
          11. Accesso ai dati
        </h3>
        <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-l-4 border-yellow-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il Responsabile non accede ai dati se non strettamente necessario per assistenza
            tecnica. Ogni accesso è limitato, tracciato e basato su riservatezza.
          </p>
        </div>
      </section>

      {/* Sezione 12 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-indigo-500">
          12. Trasferimenti extra UE
        </h3>
        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Alcuni servizi possono comportare trasferimenti extra UE. Il Responsabile garantisce
            l’adozione di Clausole Contrattuali Standard (SCC) e misure aggiuntive adeguate.
          </p>
        </div>
      </section>

      {/* Sezione 13 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-cyan-500">
          13. Conservazione e cancellazione
        </h3>
        <div className="p-6 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border-l-4 border-cyan-500">
          <p className="text-neutral-700 dark:text-neutral-300 mb-3">
            Al termine del servizio o su istruzione del Titolare:
          </p>
          <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>i dati vengono cancellati o restituiti entro 30 giorni</li>
            <li>i backup vengono sovrascritti entro 90 giorni</li>
            <li>i log tecnici sono conservati solo per la sicurezza</li>
          </ul>
        </div>
      </section>

      {/* Sezione 14 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-emerald-500">
          14. Limitazione di responsabilità
        </h3>
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border-l-4 border-emerald-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il Responsabile non è responsabile per contenuti caricati dal Titolare o dai suoi
            utenti, né per l’uso improprio della piattaforma. La responsabilità massima non può
            superare l’importo pagato dal Titolare negli ultimi 12 mesi.
          </p>
        </div>
      </section>

      {/* Sezione 15 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-red-500">15. Audit</h3>
        <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border-l-4 border-red-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il Titolare può richiedere informazioni sulle misure di sicurezza adottate dal
            Responsabile. Audit fisici o ispettivi sono esclusi salvo obblighi di legge.
          </p>
        </div>
      </section>

      {/* Sezione 16 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-indigo-500">
          16. Clausola finale
        </h3>
        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il presente DPA è parte integrante dei Termini e Condizioni e viene accettato
            automaticamente al momento della creazione della scuola su scuoleinfanzia.
          </p>
        </div>
      </section>
    </div>
  )
}
