import { notFound, redirect } from 'next/navigation'
import { getCurrentSchool, getSchoolActiveMenu, isFeatureEnabled } from '@/lib/school'
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
        title="Menù della Mensa"
        subtitle={
          activeMenu
            ? `${activeMenu.name} - ${school.name}`
            : `Scopri cosa mangiamo a scuola - ${school.name}`
        }
      />
      <Breadcrumbs />

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
            <h3 className="text-xl font-semibold mb-4">Note Importanti</h3>
            {activeMenu?.generalNotes ? (
              <div className="mb-4 p-4 bg-primary/5 rounded-md">
                <p className="text-sm whitespace-pre-line">{activeMenu.generalNotes}</p>
              </div>
            ) : null}
            <ul className="space-y-2 text-sm">
              <li>• Tutti i piatti sono preparati con ingredienti freschi e di stagione</li>
              <li>• Il menù può subire variazioni in base alla disponibilità dei prodotti</li>
              <li>• Sono disponibili menù alternativi per allergie e intolleranze</li>
              <li>• L&apos;acqua e il pane sono sempre inclusi nel pasto</li>
            </ul>
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
    title: `Menù Mensa - ${school.name}`,
    description: `Consulta il menù settimanale della mensa di ${school.name}`,
  }
}
