import React from 'react'

export function TermsOfServiceContent() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
          Termini e Condizioni d’Uso
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 dark:bg-purple-950/20 rounded">
          <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
        </p>
      </div>

      {/* Introduzione */}
      <div className="mb-10 p-6 bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <p className="text-lg leading-relaxed m-0">
          I presenti Termini regolano l’utilizzo della piattaforma <strong>ScuoleInfanzia</strong>,
          offerta da Quintavalle Christian, Codice Fiscale <strong>QNTCRS92E05G888C</strong>{' '}
          (d&apos;ora in avanti &#34;Titolare&#34;). L’accesso o l’uso della piattaforma
          costituiscono piena accettazione dei presenti Termini.
        </p>
      </div>

      {/* 1. Definizioni */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-500">
          1. Definizioni
        </h3>
        <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 space-y-3 border-blue-500">
          <p>
            <strong>Piattaforma:</strong> il servizio ScuoleInfanzia.
          </p>
          <p>
            <strong>Utente:</strong> qualsiasi soggetto che accede alla Piattaforma.
          </p>
          <p>
            <strong>Amministratore scuola:</strong> Persona fisica che si occupa di registrare una
            scuola e gestire i contenuti, la struttura, i permessi e la privacy di una scuola nella
            piattaforma <strong>ScuoleInfanzia</strong>.
          </p>
          <p>
            <strong>Editor:</strong> Persona fisica che si occupa di gestire i contenuti di una
            scuola nella piattaforma <strong>ScuoleInfanzia</strong>.
          </p>
          <p>
            <strong>Utente Registrato:</strong> Persona fisica che si registra all&apos;area
            riservata di una singola scuola nella piattaforma <strong>ScuoleInfanzia</strong>.
          </p>
          <p>
            <strong>Scuola:</strong> ente educativo utilizzatore del servizio.
          </p>
          <p>
            <strong>Titolare del servizio:</strong> Christian Quintavalle.
          </p>
          <p>
            <strong>Contenuti:</strong> documenti, testi, foto e materiali caricati dagli utenti.
          </p>
        </div>
      </section>

      {/* 2. Oggetto del servizio */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-500">
          2. Oggetto del servizio
        </h3>
        <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
          <p>
            ScuoleInfanzia è un servizio SaaS che consente alle scuole di gestire comunicazioni,
            documenti, immagini, attività scolastiche, pagine web e utenti interni. La fruizione del
            servizio avviene tramite abbonamento gestito da Stripe. È disponibile un periodo di
            prova gratuito (“trial”) utilizzabile una sola volta per ogni scuola.
          </p>
        </div>
      </section>

      {/* 3. Creazione dell’account */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-yellow-500">
          3. Creazione dell’account scolastico
        </h3>
        <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-l-4 border-yellow-500">
          <p>
            L’amministratore scuola dichiara di essere autorizzato a rappresentare la scuola e a
            inserire dati veritieri. Il Titolare può rifiutare, sospendere o revocare account in
            caso di utilizzi sospetti, fraudolenti o contrari ai presenti Termini.
          </p>
        </div>
      </section>

      {/* 4. Responsabilità della Scuola */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-red-500">
          4. Responsabilità della Scuola
        </h3>
        <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border-l-4 border-red-500">
          <p>
            La scuola è l’unica responsabile dei dati personali trattati, dei contenuti caricati e
            delle comunicazioni inviate. La scuola deve raccogliere i consensi necessari ai sensi di
            legge (es. utilizzo di immagini di minori). Il Titolare non assume alcuna responsabilità
            sui contenuti caricati dagli utenti.
          </p>
        </div>
      </section>

      {/* 5. Responsabilità dei contenuti */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-purple-500">
          5. Responsabilità dei contenuti
        </h3>
        <div className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-l-4 border-purple-500">
          <p>
            Gli utenti mantengono la proprietà dei contenuti caricati. Tuttavia, concedono al
            Titolare una licenza non esclusiva, mondiale e gratuita per conservare, elaborare,
            pubblicare e mostrare tali contenuti al solo scopo di erogare il servizio. È vietato
            caricare contenuti che violino copyright, privacy o diritti di terzi.
          </p>
        </div>
      </section>

      {/* 6. Uso consentito & usi vietati */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-indigo-500">
          6. Uso consentito e azioni vietate
        </h3>
        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-500">
          <p className="font-semibold mb-2">
            L’utente si impegna a NON utilizzare la Piattaforma per:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>attività illecite o contrarie alle normative vigenti;</li>
            <li>caricare virus, malware, worm, trojan o codici dannosi;</li>
            <li>impersonare altre persone o generare account non autorizzati;</li>
            <li>invio di spam o comunicazioni indesiderate;</li>
            <li>caricare contenuti osceni, violenti, discriminatori o che incitino all’odio;</li>
            <li>
              tentare accessi non autorizzati, reverse engineering o elusione delle misure di
              sicurezza;
            </li>
            <li>violazioni di copyright o appropriazione indebita di contenuti altrui.</li>
          </ul>
        </div>
      </section>

      {/* 7. Abbonamenti */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-pink-500">
          7. Abbonamenti, pagamenti e trial
        </h3>
        <div className="p-6 bg-pink-50 dark:bg-pink-950/20 rounded-lg border-l-4 border-pink-500">
          <ul className="list-disc pl-5 space-y-1">
            <li>I pagamenti sono gestiti tramite Stripe.</li>
            <li>Il rinnovo dell’abbonamento è automatico.</li>
            <li>Il trial gratuito è attivabile una sola volta per scuola.</li>
            <li>
              La cancellazione interrompe i rinnovi futuri; gli importi già pagati non sono
              rimborsabili.
            </li>
            <li>
              Il Titolare può introdurre in futuro soglie tecniche (storage, numero utenti, ecc.);
              tali soglie saranno comunicate in anticipo.
            </li>
          </ul>
        </div>
      </section>

      {/* 8. Disponibilità del servizio */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-teal-500">
          8. Disponibilità, manutenzione e aggiornamenti
        </h3>
        <div className="p-6 bg-teal-50 dark:bg-teal-950/20 rounded-lg border-l-4 border-teal-500">
          <p>
            Il Titolare garantisce una disponibilità target del 99%. Tuttavia, la Piattaforma può
            essere soggetta a manutenzioni programmate o straordinarie. Il Titolare può distribuire
            aggiornamenti, patch o nuove versioni che potrebbero modificare funzionalità esistenti.
          </p>
        </div>
      </section>

      {/* 9. Sicurezza */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-orange-500">
          9. Sicurezza informatica
        </h3>
        <div className="p-6 bg-orange-50 dark:bg-orange-950/20 rounded-lg border-l-4 border-orange-500">
          <ul className="list-disc pl-5 space-y-1">
            <li>connessioni HTTPS;</li>
            <li>cifratura dei dati in transito;</li>
            <li>accessi protetti da credenziali sicure;</li>
            <li>backup su infrastrutture affidabili;</li>
            <li>monitoraggio anomalie e misure anti-abuso.</li>
          </ul>
        </div>
      </section>

      {/* 10. Dati personali */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-rose-500">
          10. Trattamento dei dati personali
        </h3>
        <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-lg border-l-4 border-rose-500">
          <p>
            L’utilizzo del servizio comporta il trattamento di dati personali. Documenti rilevanti:
          </p>
          <ul className="mt-2 space-y-1">
            <li>• Privacy Policy della Piattaforma</li>
            <li>• Privacy Policy della Scuola</li>
            <li>• Data Processing Agreement (DPA)</li>
          </ul>
        </div>
      </section>

      {/* 11. Cancellazione account */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-lime-500">
          11. Cancellazione dell’account
        </h3>
        <div className="p-6 bg-lime-50 dark:bg-lime-950/20 rounded-lg border-l-4 border-lime-500">
          <p>
            L’utente può richiedere in ogni momento la cancellazione del proprio account. Alcuni
            dati possono essere mantenuti per obblighi fiscali o legali.
          </p>
        </div>
      </section>

      {/* 12. Limitazioni di responsabilità */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-cyan-500">
          12. Limitazione di responsabilità
        </h3>
        <div className="p-6 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border-l-4 border-cyan-500">
          <p>
            Il Titolare non risponde per danni indiretti, perdita di dati, interruzioni del servizio
            o perdita di profitto. La responsabilità massima è limitata all’importo pagato nei 12
            mesi precedenti la contestazione.
          </p>
        </div>
      </section>

      {/* 13. Uso del nome/logo della scuola */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-500">
          13. Uso di nomi, loghi e testimonianze
        </h3>
        <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
          <p>
            La scuola autorizza il Titolare a utilizzare nome, logo ed eventuale screenshot pubblico
            del sito scolastico realizzato tramite la Piattaforma per finalità promozionali,
            portfolio e casi studio. La scuola può richiedere la revoca di tale utilizzo in
            qualsiasi momento.
          </p>
        </div>
      </section>

      {/* 14. Modifiche ai Termini */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-indigo-500">
          14. Modifiche ai Termini
        </h3>
        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-500">
          <p>
            Il Titolare può aggiornare i presenti Termini in qualsiasi momento. Le modifiche saranno
            comunicate tramite la Piattaforma. L’uso continuato del servizio costituisce
            accettazione.
          </p>
        </div>
      </section>

      {/* 15. Foro competente e risoluzione controversie */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-fuchsia-500">
          15. Risoluzione delle controversie e legge applicabile
        </h3>
        <div className="p-6 bg-fuchsia-50 dark:bg-fuchsia-950/20 rounded-lg border-l-4 border-fuchsia-500 space-y-2">
          <p>I presenti Termini sono regolati dalla legge italiana.</p>
          <p>
            Le parti si impegnano preliminarmente a tentare una procedura di mediazione presso un
            organismo riconosciuto in Italia. In caso di mancata conciliazione, la controversia sarà
            devoluta ad arbitrato rituale secondo diritto.
          </p>
          <p>
            Foro competente: <strong>Tribunale di Treviso</strong>, salvo norme inderogabili
            applicabili ai consumatori.
          </p>
        </div>
      </section>

      {/* 16. Contatti */}
      <section className="mb-6">
        <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-purple-500">
          16. Contatti
        </h3>
        <div className="p-6 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
          <p>
            Per informazioni o richieste:
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
