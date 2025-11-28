import React from 'react'

export function TermsOfServiceContent() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {/* Header principale */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
          Termini e Condizioni d’Uso
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 dark:bg-purple-950/20 rounded">
          <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
        </p>
      </div>

      {/* Intro */}
      <div className="mb-10 p-6 bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <p className="text-lg leading-relaxed m-0">
          I presenti Termini e Condizioni regolano l’utilizzo della piattaforma{' '}
          <strong>School Platform</strong>, offerta da <strong>Christian Quintavalle</strong>, con
          sede in <strong>via R.A. Livatino 10/D</strong>, Codice Fiscale{' '}
          <strong>QNTCRS92E05G888C</strong> (“Titolare”). Accedendo alla piattaforma, l’utente
          accetta integralmente i presenti Termini.
        </p>
      </div>

      {/* Sezione 1 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-500">
          1. Definizioni
        </h3>
        <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
          <ul className="space-y-1 text-neutral-700 dark:text-neutral-300 m-0">
            <li>
              <strong>Piattaforma:</strong> il servizio School Platform.
            </li>
            <li>
              <strong>Utente:</strong> chiunque utilizzi la Piattaforma.
            </li>
            <li>
              <strong>School Admin:</strong> amministratore della scuola.
            </li>
            <li>
              <strong>Scuola:</strong> l’ente educativo che utilizza il sistema.
            </li>
            <li>
              <strong>Titolare del servizio:</strong> Christian Quintavalle.
            </li>
            <li>
              <strong>Contenuti:</strong> documenti, foto, testi e materiali caricati dagli utenti.
            </li>
          </ul>
        </div>
      </section>

      {/* Sezione 2 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-500">
          2. Oggetto del servizio
        </h3>
        <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            School Platform è un servizio SaaS che consente alle scuole di gestire comunicazioni,
            documenti, immagini, attività scolastiche e account interni. Il servizio è erogato in
            abbonamento tramite Stripe.
          </p>
        </div>
      </section>

      {/* Sezione 3 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-yellow-500">
          3. Creazione dell’account scolastico
        </h3>
        <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-l-4 border-yellow-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Lo School Admin deve essere autorizzato a rappresentare la scuola, fornire informazioni
            accurate e garantire un utilizzo corretto del servizio. Il Titolare può rifiutare
            registrazioni sospette.
          </p>
        </div>
      </section>

      {/* Sezione 4 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-red-500">
          4. Responsabilità della Scuola
        </h3>
        <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border-l-4 border-red-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            La scuola è l’unica responsabile dei dati personali trattati, dei contenuti caricati e
            delle comunicazioni inviate. È suo obbligo raccogliere i consensi necessari (es. foto
            minori).
          </p>
        </div>
      </section>

      {/* Sezione 5 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-purple-500">
          5. Responsabilità dei contenuti
        </h3>
        <div className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-l-4 border-purple-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Gli utenti sono responsabili del contenuto caricato. Il Titolare non controlla né
            approva i contenuti e non risponde di eventuali violazioni di copyright, privacy o
            diritti dei minori.
          </p>
        </div>
      </section>

      {/* Sezione 6 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-indigo-500">
          6. Utilizzo consentito
        </h3>
        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-500">
          <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>non utilizzare la piattaforma per attività illecite;</li>
            <li>non caricare contenuti non autorizzati;</li>
            <li>non condividere contenuti offensivi o discriminatori;</li>
            <li>non tentare accessi non autorizzati o attività fraudolente.</li>
          </ul>
        </div>
      </section>

      {/* Sezione 7 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-pink-500">
          7. Abbonamenti, pagamenti e trial
        </h3>
        <div className="p-6 bg-pink-50 dark:bg-pink-950/20 rounded-lg border-l-4 border-pink-500">
          <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>I pagamenti sono gestiti tramite Stripe.</li>
            <li>Il rinnovo è automatico (mensile o annuale).</li>
            <li>Il periodo di prova è valido una sola volta per scuola.</li>
            <li>
              La cancellazione interrompe i rinnovi futuri ma non dà diritto a rimborsi già
              maturati.
            </li>
          </ul>
        </div>
      </section>

      {/* Sezione 8 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-teal-500">
          8. Disponibilità del servizio
        </h3>
        <div className="p-6 bg-teal-50 dark:bg-teal-950/20 rounded-lg border-l-4 border-teal-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il Titolare garantisce una disponibilità media del servizio del 99%, salvo manutenzioni,
            problemi dei provider o cause di forza maggiore.
          </p>
        </div>
      </section>

      {/* Sezione 9 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-orange-500">
          9. Sicurezza informatica
        </h3>
        <div className="p-6 bg-orange-50 dark:bg-orange-950/20 rounded-lg border-l-4 border-orange-500">
          <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>connessioni HTTPS;</li>
            <li>cifratura dei dati in transito;</li>
            <li>gestione sicura delle credenziali;</li>
            <li>backup su storage affidabili;</li>
            <li>misure anti-accessi non autorizzati.</li>
          </ul>
        </div>
      </section>

      {/* Sezione 10 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-rose-500">
          10. Trattamento dei dati personali
        </h3>
        <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-lg border-l-4 border-rose-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            L’utilizzo della piattaforma implica il trattamento di dati personali. Documenti
            correlati:
          </p>
          <ul className="mt-3 space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>• Privacy Policy della Piattaforma</li>
            <li>• Privacy Policy della Scuola</li>
            <li>• Data Processing Agreement (DPA) obbligatorio per l’attivazione della scuola</li>
          </ul>
        </div>
      </section>

      {/* Sezione 11 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-lime-500">
          11. Cancellazione dell’account
        </h3>
        <div className="p-6 bg-lime-50 dark:bg-lime-950/20 rounded-lg border-l-4 border-lime-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            L’utente può richiedere la cancellazione del proprio account in qualsiasi momento.
            Alcuni dati possono essere conservati per obblighi legali o fiscali.
          </p>
        </div>
      </section>

      {/* Sezione 12 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-cyan-500">
          12. Limitazione di responsabilità
        </h3>
        <div className="p-6 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border-l-4 border-cyan-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il Titolare non è responsabile per danni indiretti, perdite di dati, profitti o
            opportunità. In ogni caso, la responsabilità massima non può superare l’importo pagato
            dall’utente nei 12 mesi precedenti.
          </p>
        </div>
      </section>

      {/* Sezione 13 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-indigo-500">
          13. Modifiche ai Termini
        </h3>
        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Il Titolare può aggiornare i presenti Termini in qualsiasi momento. Le modifiche saranno
            comunicate tramite la piattaforma. L’uso continuato costituisce accettazione.
          </p>
        </div>
      </section>

      {/* Sezione 14 */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-fuchsia-500">
          14. Legge applicabile
        </h3>
        <div className="p-6 bg-fuchsia-50 dark:bg-fuchsia-950/20 rounded-lg border-l-4 border-fuchsia-500">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            I presenti Termini sono regolati dalla legge italiana. Foro competente: Tribunale di
            competenza del Titolare.
          </p>
        </div>
      </section>

      {/* Sezione 15 */}
      <section className="mb-6">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-purple-500">
          15. Contatti
        </h3>
        <div className="p-6 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Per informazioni o richieste relative ai presenti Termini:
            <br />
            <strong className="text-purple-700 dark:text-purple-400 text-lg">
              privacy@scuoleinfanzia.eu
            </strong>
          </p>
        </div>
      </section>
    </div>
  )
}
