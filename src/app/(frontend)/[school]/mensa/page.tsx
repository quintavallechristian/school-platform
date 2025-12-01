import { notFound, redirect } from 'next/navigation'
import { getCurrentSchool, getSchoolActiveMenu, isFeatureEnabled } from '@/lib/school'
import { getSchoolBaseHref } from '@/lib/linkUtils'
import { headers } from 'next/headers'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import type { Menu } from '@/payload-types'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'

type DayMenu = {
  isSpecialDish?: boolean | null
  dishes?: Array<{
    dish: string
    id?: string | null
  }> | null
}

type WeekData = {
  lunedì?: DayMenu
  martedì?: DayMenu
  mercoledì?: DayMenu
  giovedì?: DayMenu
  venerdì?: DayMenu
  notes?: string | null
}

export default async function MensaPage({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  const headersList = await headers()
  const host = headersList.get('host') || ''
  const baseHref = getSchoolBaseHref(school, host)

  // Reindirizza alla homepage se la feature mensa è disabilitata
  if (!isFeatureEnabled(school, 'menu')) {
    redirect(`/${schoolSlug}`)
  }

  const activeMenu = (await getSchoolActiveMenu(school.id)) as Menu | null

  // Formatta le date di validità
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const validityPeriod =
    activeMenu?.validFrom || activeMenu?.validTo
      ? `${formatDate(activeMenu.validFrom) || 'Data non specificata'} - ${formatDate(activeMenu.validTo) || 'Data non specificata'}`
      : null

  const renderDayMenu = (dayMenu: DayMenu | undefined) => {
    if (!dayMenu || !dayMenu.dishes || dayMenu.dishes.length === 0) {
      return <p className="text-sm text-muted-foreground italic">Nessun piatto disponibile</p>
    }

    return (
      <div>
        {dayMenu.isSpecialDish && <p className="font-semibold mb-2">PIATTO UNICO:</p>}
        <ul className="space-y-2 text-sm">
          {dayMenu.dishes.map((item, index) => (
            <li key={item.id || index}>- {item.dish}</li>
          ))}
        </ul>
      </div>
    )
  }

  const weeks = activeMenu
    ? [
        { number: '1°', data: activeMenu.week1 as WeekData },
        { number: '2°', data: activeMenu.week2 as WeekData },
        { number: '3°', data: activeMenu.week3 as WeekData },
        { number: '4°', data: activeMenu.week4 as WeekData },
      ]
    : []

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Hero
        title="Mensa Scolastica"
        subtitle="Scopri il menù settimanale e le informazioni sul servizio mensa"
        backgroundImage="/images/canteen-hero.jpg"
      />
      <Breadcrumbs baseHref={baseHref} />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Periodo di validità */}
          {validityPeriod && (
            <SpotlightCard className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold text-center">
                📅 Periodo di validità: {validityPeriod}
              </p>
            </SpotlightCard>
          )}

          <SpotlightCard className="px-0 py-0">
            <table
              className="min-w-full border-collapse"
              role="table"
              aria-label="Menù settimanale"
            >
              <caption className="sr-only">
                Tabella del menù settimanale della mensa scolastica, organizzata per settimane e
                giorni
              </caption>
              <thead>
                <tr className="bg-primary/10">
                  <th
                    scope="col"
                    className="border border-border px-4 py-3 text-left font-semibold"
                  >
                    Sett. del mese
                  </th>
                  <th
                    scope="col"
                    className="border border-border px-4 py-3 text-left font-semibold"
                  >
                    Lunedì
                  </th>
                  <th
                    scope="col"
                    className="border border-border px-4 py-3 text-left font-semibold"
                  >
                    Martedì
                  </th>
                  <th
                    scope="col"
                    className="border border-border px-4 py-3 text-left font-semibold"
                  >
                    Mercoledì
                  </th>
                  <th
                    scope="col"
                    className="border border-border px-4 py-3 text-left font-semibold"
                  >
                    Giovedì
                  </th>
                  <th
                    scope="col"
                    className="border border-border px-4 py-3 text-left font-semibold"
                  >
                    Venerdì
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeks.length > 0 ? (
                  weeks.map((week) => (
                    <tr key={week.number} className="hover:bg-accent/50 transition-colors">
                      <th
                        scope="row"
                        className="border border-border px-4 py-4 font-semibold align-top text-left"
                      >
                        {week.number}
                      </th>
                      <td className="border border-border px-4 py-4 align-top">
                        {renderDayMenu(week.data?.lunedì as DayMenu)}
                      </td>
                      <td className="border border-border px-4 py-4 align-top">
                        {renderDayMenu(week.data?.martedì as DayMenu)}
                      </td>
                      <td className="border border-border px-4 py-4 align-top">
                        {renderDayMenu(week.data?.mercoledì as DayMenu)}
                      </td>
                      <td className="border border-border px-4 py-4 align-top">
                        {renderDayMenu(week.data?.giovedì as DayMenu)}
                      </td>
                      <td className="border border-border px-4 py-4 align-top">
                        {renderDayMenu(week.data?.venerdì as DayMenu)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="border border-border px-4 py-8 text-center">
                      <p className="text-muted-foreground">
                        Nessun menù attivo. Aggiungi e attiva un menù dal pannello di
                        amministrazione.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </SpotlightCard>

          <SpotlightCard className="mt-8 bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Note Importanti</h3>
            <div className="rounded-md">
              {weeks.length > 0 &&
                weeks.map(
                  (week) =>
                    week.data?.notes && (
                      <div
                        key={`${week.number}-notes`}
                        className="rounded-md bg-primary/5 p-3 mt-4"
                      >
                        <p className="text-sm font-medium mb-1">Note settimana {week.number}:</p>
                        <p className="text-sm whitespace-pre-line text-muted-foreground">
                          {week.data.notes}
                        </p>
                      </div>
                    ),
                )}
              {activeMenu?.generalNotes ? (
                <p className="text-sm whitespace-pre-line  mt-8">{activeMenu.generalNotes}</p>
              ) : (
                <ul className="space-y-2 text-sm mt-8">
                  <li>• Tutti i piatti sono preparati con ingredienti freschi e di stagione</li>
                  <li>• Il menù può subire variazioni in base alla disponibilità dei prodotti</li>
                  <li>• Sono disponibili menù alternativi per allergie e intolleranze</li>
                  <li>• L&apos;acqua e il pane sono sempre inclusi nel pasto</li>
                </ul>
              )}
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  return {
    title: `Menù Mensa`,
    description: `Consulta il menù settimanale della mensa`,
  }
}
