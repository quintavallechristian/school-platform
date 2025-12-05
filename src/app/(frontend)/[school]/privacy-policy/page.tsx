import { notFound } from 'next/navigation'
import { getCurrentSchool, getSchoolPrivacyPolicy } from '@/lib/school'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import type { PrivacyPolicy as PrivacyPolicyType } from '@/payload-types'

type PageProps = {
  params: Promise<{ school: string }>
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const privacyPolicy = await getSchoolPrivacyPolicy(school.id)

  if (!privacyPolicy) {
    return (
      <div className="min-h-[calc(100vh-200px)]">
        <Hero title={`Privacy Policy ${school.name}`} big={false} />
        <SpotlightCard className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Header principale */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary dark:from-primary dark:to-secondary bg-clip-text text-transparent mb-4">
                Informativa sul trattamento dei dati personali
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
              </p>
            </div>

            {/* Sezione 1: Titolare */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-blue-500">
                1. Titolare del trattamento
              </h3>
              <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
                <p className="mb-2 text-neutral-700 dark:text-neutral-300">
                  Il Titolare del trattamento è:
                </p>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 m-0 list-none pl-0">
                  <li>
                    <strong>{school.name}</strong>
                  </li>
                  <li>
                    <strong>Indirizzo:</strong> {school.contactInfo?.address || '—'}
                  </li>
                  <li>
                    <strong>Email:</strong> {school.contactInfo?.email || '—'}
                  </li>
                  <li>
                    <strong>Telefono:</strong> {school.contactInfo?.phone || '—'}
                  </li>
                </ul>
              </div>
            </section>

            {/* Sezione 2: Finalità */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-teal-500">
                2. Finalità del trattamento
              </h3>
              <div className="p-6 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-900">
                <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                  La scuola tratta i dati personali di alunni, genitori, docenti e personale per:
                </p>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span>comunicazioni scuola–famiglia;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span>gestione attività educative e amministrative;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span>condivisione di documenti, circolari e avvisi;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span>organizzazione di eventi e progetti scolastici;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span>gestione degli account sulla piattaforma scuoleinfanzia;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                    <span>
                      gestione di immagini o foto di attività scolastiche (previo consenso quando
                      richiesto).
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Sezione 3: Tipologie */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-2 border-b-2 border-purple-500">
                3. Tipologie di dati trattati
              </h3>
              <div className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-l-4 border-purple-500">
                <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                  La scuola può trattare i seguenti dati:
                </p>
                <ul className="space-y-1 text-neutral-700 dark:text-neutral-300 mb-4">
                  <li>dati anagrafici di studenti, genitori e personale;</li>
                  <li>dati di contatto (email, telefono);</li>
                  <li>documenti scolastici e comunicazioni;</li>
                  <li>foto, immagini o video caricati dalla scuola;</li>
                  <li>materiali didattici o informativi.</li>
                </ul>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 m-0">
                  La piattaforma scuoleinfanzia non tratta autonomamente dati dei minori: ogni
                  contenuto è gestito esclusivamente dalla scuola.
                </p>
              </div>
            </section>

            {/* Sezione 4: Modalità */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-orange-500">
                4. Modalità del trattamento
              </h3>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                <p className="text-neutral-700 dark:text-neutral-300 m-0">
                  I dati vengono trattati in forma elettronica tramite personale scolastico
                  autorizzato.
                </p>
              </div>
            </section>

            {/* Sezione 5: Base giuridica */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-green-500">
                5. Base giuridica
              </h3>
              <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
                <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                  Le basi giuridiche includono:
                </p>
                <ul className="space-y-1 text-neutral-700 dark:text-neutral-300">
                  <li>esecuzione di compiti di interesse pubblico;</li>
                  <li>obblighi legali della scuola;</li>
                  <li>consenso dell’interessato per attività specifiche (es. foto);</li>
                  <li>legittimo interesse del Titolare;</li>
                  <li>contratto per l’uso della piattaforma digitale.</li>
                </ul>
              </div>
            </section>

            {/* Sezione 6: Piattaforma */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-indigo-500">
                6. Utilizzo della piattaforma scuoleinfanzia
              </h3>
              <div className="space-y-4">
                <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-l-4 border-indigo-500">
                  <p className="mb-2 text-neutral-700 dark:text-neutral-300">
                    La scuola utilizza la piattaforma <strong>scuoleinfanzia</strong>, fornita da:
                  </p>
                  <ul className="space-y-1 text-neutral-700 dark:text-neutral-300 mb-4 list-none pl-0">
                    <li>
                      <strong>Christian Quintavalle</strong>
                    </li>
                    <li>via R.A. Livatino 10/D</li>
                    <li>privacy@scuoleinfanzia.eu</li>
                  </ul>
                  <p className="mb-2 text-neutral-700 dark:text-neutral-300">
                    scuoleinfanzia agisce come <strong>Responsabile del trattamento</strong> ai
                    sensi dell’art. 28 GDPR per:
                  </p>
                  <ul className="space-y-1 text-neutral-700 dark:text-neutral-300">
                    <li>gestione tecnica degli account;</li>
                    <li>hosting dei documenti e dei contenuti caricati dalla scuola;</li>
                    <li>invio comunicazioni;</li>
                    <li>sicurezza informatica;</li>
                    <li>supporto e manutenzione.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Sezione 7: Destinatari */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-red-500">
                7. Destinatari dei dati
              </h3>
              <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                  I dati possono essere comunicati a:
                </p>
                <ul className="space-y-1 text-neutral-700 dark:text-neutral-300">
                  <li>docenti e personale scolastico autorizzato;</li>
                  <li>scuoleinfanzia come Responsabile del trattamento;</li>
                  <li>provider tecnici del servizio (hosting, email, storage);</li>
                  <li>autorità pubbliche nei casi previsti dalla legge.</li>
                </ul>
              </div>
            </section>

            {/* Sezione 8: Trasferimenti */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-rose-500">
                8. Trasferimenti extra UE
              </h3>
              <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900">
                <p className="text-neutral-700 dark:text-neutral-300 m-0">
                  Alcuni fornitori tecnici possono trattare dati in Paesi non UE. I trasferimenti
                  avvengono tramite
                  <strong>Clausole Contrattuali Standard (SCC)</strong> e misure adeguate, ai sensi
                  degli artt. 44–49 GDPR.
                </p>
              </div>
            </section>

            {/* Sezione 9: Conservazione */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-cyan-500">
                9. Conservazione dei dati
              </h3>
              <div className="p-6 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-900">
                <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                  I dati vengono conservati per:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
                  <li>la durata dell’anno o ciclo scolastico;</li>
                  <li>il tempo richiesto dagli obblighi normativi;</li>
                  <li>la durata del rapporto con la piattaforma.</li>
                </ul>
              </div>
            </section>

            {/* Sezione 10: Diritti */}
            <section className="mb-10">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-emerald-500">
                10. Diritti degli interessati
              </h3>
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <p className="mb-3 text-neutral-700 dark:text-neutral-300">
                  Gli interessati possono esercitare i diritti previsti dagli artt. 15–22 GDPR:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> accesso
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> rettifica
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> cancellazione
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> limitazione
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> opposizione
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> revoca del consenso (se applicabile)
                  </li>
                </ul>
                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  Le richieste vanno inviate a: <strong>{school.contactInfo?.email || '—'}</strong>
                </p>
              </div>
            </section>

            {/* Sezione 11: Contatti */}
            <section className="mb-6">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b-2 border-indigo-500">
                11. Contatti
              </h3>
              <div className="p-6 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg border border-indigo-200 dark:border-indigo-900">
                <p className="text-neutral-700 dark:text-neutral-300 m-0">
                  Per qualsiasi comunicazione relativa alla privacy:
                  <br />
                  <strong>{school.name}</strong>
                  <br />
                  Email: {school.contactInfo?.email || '—'}
                </p>
              </div>
            </section>
          </div>
        </SpotlightCard>
      </div>
    )
  }

  // Se esiste una policy personalizzata, usa il contenuto salvato
  const typedPage = privacyPolicy as PrivacyPolicyType

  const hasRealContent = (content: unknown): boolean => {
    if (!content || typeof content !== 'object' || content === null) return false
    const lexicalContent = content as Record<string, unknown>
    if (!lexicalContent.root || typeof lexicalContent.root !== 'object') return false
    const root = lexicalContent.root as Record<string, unknown>
    if (!Array.isArray(root.children)) return false

    const hasTextInNode = (node: unknown): boolean => {
      if (!node || typeof node !== 'object') return false
      const lexicalNode = node as Record<string, unknown>
      if (typeof lexicalNode.text === 'string' && lexicalNode.text.trim().length > 0) return true
      if (Array.isArray(lexicalNode.children)) {
        return lexicalNode.children.some((child) => hasTextInNode(child))
      }
      return false
    }

    return root.children.some((child) => hasTextInNode(child))
  }

  const hasContent = hasRealContent(typedPage.content)

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero title={`Privacy Policy ${school.name}`} big={false} />
      <section>
        {hasContent && typedPage.content && (
          <SpotlightCard className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
            <RichTextRenderer content={typedPage.content} />
          </SpotlightCard>
        )}
      </section>
    </div>
  )
}
