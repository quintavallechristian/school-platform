import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import RevokeCookieConsent from '@/components/CookieBanner/RevokeCookieConsent'
import { LandingFooter } from '@/components/LandingPage/LandingFooter'

export default async function CookiePolicyPage() {
  return (
    <>
      <div className="min-h-[calc(100vh-200px)] mb-20">
        <Hero title="Cookie Policy" big={false} />
        <SpotlightCard className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Header principale */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
                Cookie Policy
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
              </p>
            </div>

            {/* Introduzione */}
            <div className="mb-10 p-6 bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <p className="text-lg leading-relaxed m-0">
                La presente Cookie Policy descrive l&apos;uso dei cookie e tecnologie simili da
                parte della piattaforma
                <strong> ScuoleInfanzia</strong> (&quot;Sito&quot;, &quot;Piattaforma&quot;).
              </p>
            </div>

            {/* Sezione 1 */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-blue-500">
                1. Cosa sono i cookie
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                I cookie sono file di testo che un sito invia al browser dell&apos;utente per
                memorizzare informazioni necessarie al funzionamento del sito, alla sicurezza e
                all&apos;erogazione dei servizi. I cookie possono essere tecnici, analitici o di
                profilazione.
              </p>
            </section>

            {/* Sezione 2 */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-2 border-b-2 border-purple-500">
                2. Cookie utilizzati dalla piattaforma
              </h3>

              {/* 2.1 Cookie tecnici */}
              <div className="mb-8 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  2.1 Cookie tecnici necessari (sempre attivi)
                </h4>
                <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                  Questi cookie sono indispensabili per garantire:
                </p>
                <ul className="space-y-1 text-neutral-700 dark:text-neutral-300">
                  <li>autenticazione degli utenti;</li>
                  <li>gestione della sessione;</li>
                  <li>sicurezza del sistema;</li>
                  <li>funzionalità dell&apos;area riservata;</li>
                  <li>operatività della dashboard amministrativa.</li>
                </ul>

                <div className="mt-6 space-y-4">
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-md">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Cookie generati da Next.js
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                          next-auth.session-token
                        </code>{' '}
                        (o equivalenti)
                      </li>
                      <li>
                        <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                          next-auth.csrf-token
                        </code>
                      </li>
                    </ul>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                      <strong>Finalità:</strong> autenticazione e protezione CSRF
                      <br />
                      <strong>Tipo:</strong> tecnico / first-party
                      <br />
                      <strong>Durata:</strong> sessione o 30 giorni
                    </p>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-md">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Cookie generati da Payload CMS
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                          payload-token
                        </code>
                      </li>
                    </ul>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                      <strong>Finalità:</strong> sessione e accesso all&apos;amministrazione
                    </p>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-md">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Cookie tecnici Vercel (edge, routing)
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                          __vercel_live_token
                        </code>
                      </li>
                      <li>
                        <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                          __vercel_fingerprint
                        </code>
                      </li>
                    </ul>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
                      <strong>Finalità:</strong> stabilità del servizio e bilanciamento del carico
                    </p>
                  </div>
                </div>
              </div>

              {/* 2.2 Cookie analitici */}
              <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  2.2 Cookie analitici
                </h4>
                <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                  Utilizziamo <strong>Google Analytics 4</strong> per raccogliere dati statistici
                  anonimi e aggregati sull&apos;utilizzo della piattaforma, previo consenso
                  dell&apos;utente tramite banner cookie.
                </p>

                <div className="bg-white dark:bg-neutral-800 p-4 rounded-md">
                  <ul className="space-y-1 text-sm mb-3">
                    <li>
                      <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                        _ga
                      </code>{' '}
                      – Distinguere gli utenti
                    </li>
                    <li>
                      <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                        _ga_*
                      </code>{' '}
                      – Persistenza della sessione
                    </li>
                    <li>
                      <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                        _gid
                      </code>{' '}
                      – Identifica le visite in 24 ore
                    </li>
                  </ul>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Finalità:</strong> analisi statistiche sul traffico
                    <br />
                    <strong>Tipo:</strong> analitico / third-party
                    <br />
                    <strong>Durata:</strong> 1 giorno – 24 mesi
                    <br />
                    <strong>Provider:</strong> Google LLC
                  </p>
                </div>

                <p className="mt-4 text-sm font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-neutral-800 p-3 rounded-md">
                  ℹ️ I cookie analitici vengono installati <strong>solo dopo il consenso</strong>{' '}
                  espresso tramite il banner cookie conforme al GDPR.
                </p>
              </div>

              {/* 2.3 Cookie di terze parti */}
              <div className="mb-8 p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-l-4 border-purple-500">
                <h4 className="text-xl font-semibold text-purple-800 dark:text-purple-400 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔐</span>
                  2.3 Cookie di terze parti
                </h4>

                <div className="bg-white dark:bg-neutral-800 p-4 rounded-md">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Stripe (pagamenti)
                  </p>
                  <p className="mb-3 text-sm text-neutral-700 dark:text-neutral-300">
                    Durante il checkout, Stripe può impostare i propri cookie sul proprio dominio
                    per prevenzione frodi e gestione della sessione di pagamento.
                  </p>
                  <ul className="space-y-1 text-sm mb-3">
                    <li>
                      <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                        __stripe_mid
                      </code>
                    </li>
                    <li>
                      <code className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                        __stripe_sid
                      </code>
                    </li>
                  </ul>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                    Questi cookie <strong>non sono impostati dal nostro dominio</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Sezione 3 */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-orange-500">
                3. Cloudflare R2
              </h3>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                <p className="text-neutral-700 dark:text-neutral-300 m-0">
                  Cloudflare R2 viene utilizzato esclusivamente per l&apos;archiviazione dei media.
                  Questo servizio <strong>non imposta cookie</strong> sul browser dell&apos;utente.
                </p>
              </div>
            </section>

            {/* Sezione 4 */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-teal-500">
                4. Gestione del consenso
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-3">
                Al primo accesso, la piattaforma presenta un banner che consente all&apos;utente di:
              </p>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                  <span>accettare tutti i cookie;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                  <span>rifiutare i cookie non necessari;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                  <span>selezionare le categorie di cookie autorizzate;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                  <span>revocare il consenso in qualsiasi momento.</span>
                </li>
              </ul>
            </section>

            {/* Sezione 5 */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-red-500">
                5. Come disabilitare i cookie dal browser
              </h3>
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <p className="text-neutral-700 dark:text-neutral-300 m-0">
                  L&apos;utente può gestire o eliminare i cookie direttamente dalle impostazioni del
                  browser (Chrome, Firefox, Safari, Edge).{' '}
                  <strong className="text-red-700 dark:text-red-400">
                    La disabilitazione dei cookie tecnici può compromettere la funzionalità della
                    piattaforma.
                  </strong>
                </p>
              </div>
            </section>

            {/* Sezione 6 */}
            <section className="mb-6">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-indigo-500">
                6. Contatti
              </h3>
              <div className="p-6 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg border border-indigo-200 dark:border-indigo-900">
                <p className="text-neutral-700 dark:text-neutral-300 m-0">
                  Per qualsiasi richiesta riguardante i cookie o la privacy, è possibile scrivere a:
                  <br />
                  <strong className="text-indigo-700 dark:text-indigo-400 text-lg">
                    info@scuoleinfanzia.eu
                  </strong>
                </p>
              </div>
            </section>

            {/* Sezione Revoca Consenso */}
            <section className="mb-6 pt-6 border-t-2 border-neutral-200 dark:border-neutral-700">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-red-500">
                Revoca Consenso
              </h3>
              <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                  Se desideri revocare il consenso ai cookie precedentemente fornito, puoi farlo
                  cliccando sul pulsante qui sotto. Questa azione eliminerà le tue preferenze
                  salvate e il banner dei cookie verrà mostrato nuovamente.
                </p>
                <RevokeCookieConsent />
              </div>
            </section>
          </div>
        </SpotlightCard>
      </div>
      <LandingFooter />
    </>
  )
}
