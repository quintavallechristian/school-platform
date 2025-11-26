import React from 'react'

export function PrivacyPolicyContent() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {/* Header principale */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          Privacy Policy
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-950/20 rounded">
          <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
        </p>
      </div>

      {/* Introduzione */}
      <div className="mb-10 p-6 bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <p className="text-lg leading-relaxed m-0">
          La presente informativa descrive le modalità con cui{' '}
          <strong>Christian Quintavalle</strong>, con sede in
          <strong> via R.A. Livatino 10/D</strong>, Codice Fiscale <strong>QNTCRS92E05G888C</strong>{' '}
          (“Titolare”), tratta i dati personali degli utenti che utilizzano la piattaforma{' '}
          <strong>scuoleinfanzia</strong>.
        </p>
      </div>

      {/* Sezione 1: Titolare */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-blue-500">
          1. Titolare del trattamento
        </h3>
        <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 m-0 list-none pl-0">
            <li>
              <strong>Titolare:</strong> Christian Quintavalle
            </li>
            <li>
              <strong>Indirizzo:</strong> via R.A. Livatino 10/D
            </li>
            <li>
              <strong>Email:</strong> privacy@scuoleinfanzia.eu
            </li>
          </ul>
        </div>
      </section>

      {/* Sezione 2: Dati raccolti */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-2 border-b-2 border-purple-500">
          2. Tipologie di dati raccolti
        </h3>

        {/* 2.1 Dati forniti direttamente */}
        <div className="mb-8 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
          <h4 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            2.1 Dati forniti direttamente dall’utente
          </h4>
          <p className="mb-3 text-neutral-700 dark:text-neutral-300">
            Durante la registrazione o utilizzo della piattaforma vengono raccolti:
          </p>
          <ul className="space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>Nome e cognome</li>
            <li>Email</li>
            <li>Password (hashata)</li>
            <li>Nome della scuola</li>
          </ul>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Dopo la creazione dell’account, l’utente può inserire volontariamente ulteriori dati
            come numero di telefono o indirizzo della scuola.
          </p>
        </div>

        {/* 2.2 Contenuti caricati */}
        <div className="mb-8 p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-l-4 border-purple-500">
          <h4 className="text-xl font-semibold text-purple-800 dark:text-purple-400 mb-3 flex items-center gap-2">
            <span className="text-2xl">📁</span>
            2.2 Contenuti caricati dagli utenti
          </h4>
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Gli utenti possono caricare documenti, foto o materiali multimediali. Il contenuto è
            deciso e gestito esclusivamente dagli utenti/singole scuole. Il Titolare non determina
            le finalità né il contenuto dei file caricati.
          </p>
        </div>

        {/* 2.3 Dati automatici */}
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            2.3 Dati raccolti automaticamente
          </h4>
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Non raccogliamo indirizzi IP, user agent o log di navigazione personalizzati.
            Utilizziamo Google Analytics per raccogliere dati statistici aggregati e anonimizzati
            relativi all’utilizzo della piattaforma.
          </p>
        </div>
      </section>

      {/* Sezione 3: Finalità */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-teal-500">
          3. Finalità del trattamento
        </h3>
        <div className="p-6 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-900">
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            I dati personali vengono trattati per le seguenti finalità:
          </p>
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>
                <strong>Creazione e gestione dell’account</strong> (base giuridica: contratto)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>
                <strong>Gestione dei pagamenti e abbonamenti</strong> tramite Stripe (contratto)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>
                <strong>Invio di email transazionali</strong> tramite Brevo (contratto)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>
                <strong>Invio di comunicazioni scolastiche</strong> predisposte dalla singola scuola
                (contratto / interesse pubblico del titolare-scuola)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>
                <strong>Analisi dell’utilizzo</strong> tramite Google Analytics (consenso)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>
                <strong>Sicurezza e prevenzione abusi</strong> (interesse legittimo)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>
                <strong>Assistenza clienti</strong> (contratto)
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Sezione 4: Ruolo */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-orange-500">
          4. Ruolo della piattaforma e dei suoi utenti
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
            <p className="text-neutral-700 dark:text-neutral-300 m-0">
              Per i dati personali degli amministratori, docenti e genitori, il Titolare opera come{' '}
              <strong>Titolare del trattamento</strong>.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <p className="text-neutral-700 dark:text-neutral-300 m-0">
              Per i contenuti caricati dalle scuole (es. foto, documenti), ogni scuola agisce come{' '}
              <strong>Titolare autonomo</strong>, mentre scuoleinfanzia opera come{' '}
              <strong>Responsabile del trattamento</strong> ai sensi dell’art. 28 GDPR. Le scuole
              hanno la responsabilità di raccogliere eventuali consensi necessari (es. foto minori).
            </p>
          </div>
        </div>
      </section>

      {/* Sezione 5: Servizi terzi */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-indigo-500">
          5. Servizi terzi che trattano dati personali
        </h3>
        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-500">
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Per il funzionamento della piattaforma utilizziamo servizi terzi che agiscono come
            Responsabili del trattamento o sub-responsabili:
          </p>
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>Vercel Inc.</strong> – Hosting del sito e della piattaforma
            </li>
            <li>
              <strong>Cloudflare R2</strong> – Archiviazione dei file caricati
            </li>
            <li>
              <strong>Stripe Payments Europe</strong> – Gestione dei pagamenti
            </li>
            <li>
              <strong>Google LLC</strong> – Analytics (solo previo consenso)
            </li>
            <li>
              <strong>Brevo (ex Sendinblue)</strong> – Invio email transazionali
            </li>
          </ul>
        </div>
      </section>

      {/* Sezione 6: Trasferimenti */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-red-500">
          6. Trasferimenti extra UE
        </h3>
        <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
          <p className="text-neutral-700 dark:text-neutral-300 mb-3">
            I dati possono essere trattati in Paesi non appartenenti all’Unione Europea. In tali
            casi, il Titolare si assicura che siano adottate{' '}
            <strong>Clausole Contrattuali Standard (SCC)</strong> e misure aggiuntive per garantire
            un livello di protezione adeguato, in conformità agli artt. 44–49 GDPR.
          </p>
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            I server utilizzati dai nostri fornitori possono trovarsi nell’UE o negli Stati Uniti.
          </p>
        </div>
      </section>

      {/* Sezione 7: Conservazione */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-cyan-500">
          7. Conservazione dei dati
        </h3>
        <div className="p-6 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-900">
          <p className="mb-3 text-neutral-700 dark:text-neutral-300">
            I dati personali sono conservati:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>finché l’account rimane attivo;</li>
            <li>fino a richiesta di cancellazione da parte dell’utente;</li>
            <li>per il tempo necessario alla gestione amministrativa e legale.</li>
          </ul>
        </div>
      </section>

      {/* Sezione 8: Diritti */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-emerald-500">
          8. Diritti dell’utente
        </h3>
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
          <p className="mb-3 text-neutral-700 dark:text-neutral-300">
            L’utente può esercitare i diritti previsti dagli artt. 15–22 GDPR:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-neutral-700 dark:text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span> accesso ai dati
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span> rettifica
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span> cancellazione (“diritto all’oblio”)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span> limitazione del trattamento
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span> portabilità
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span> opposizione
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span> revoca del consenso (per Analytics)
            </li>
          </ul>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            Le richieste possono essere inviate a: <strong>privacy@scuoleinfanzia.eu</strong>.
          </p>
        </div>
      </section>

      {/* Sezione 9: Sicurezza */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-rose-500">
          9. Sicurezza dei dati
        </h3>
        <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900">
          <p className="mb-3 text-neutral-700 dark:text-neutral-300">
            Il Titolare adotta misure di sicurezza tecniche e organizzative per proteggere i dati,
            tra cui:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>connessioni protette (HTTPS)</li>
            <li>cifratura dei dati in transito</li>
            <li>gestione sicura delle credenziali</li>
            <li>controllo degli accessi</li>
            <li>backup su infrastrutture sicure</li>
          </ul>
        </div>
      </section>

      {/* Sezione 10: Contatti */}
      <section className="mb-6">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-indigo-500">
          10. Contatti
        </h3>
        <div className="p-6 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg border border-indigo-200 dark:border-indigo-900">
          <p className="text-neutral-700 dark:text-neutral-300 m-0">
            Per domande relative alla presente informativa:
            <br />
            <strong className="text-indigo-700 dark:text-indigo-400 text-lg">
              privacy@scuoleinfanzia.eu
            </strong>
          </p>
        </div>
      </section>
    </div>
  )
}
