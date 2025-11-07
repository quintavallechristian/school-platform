import React from 'react'
import Hero from '@/components/Hero/Hero'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Menu } from '@/payload-types'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'

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

export default async function MensaPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const menuData = await payload.find({
    collection: 'menu',
    where: {
      isActive: {
        equals: true,
      },
    },
    limit: 1,
  })

  const activeMenu = menuData.docs[0] as Menu | undefined

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
        subtitle={activeMenu ? activeMenu.name : 'Scopri cosa mangiamo a scuola'}
      />

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
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border px-4 py-3 text-left font-semibold">
                    Sett. del mese
                  </th>
                  <th className="border border-border px-4 py-3 text-left font-semibold">Lunedì</th>
                  <th className="border border-border px-4 py-3 text-left font-semibold">
                    Martedì
                  </th>
                  <th className="border border-border px-4 py-3 text-left font-semibold">
                    Mercoledì
                  </th>
                  <th className="border border-border px-4 py-3 text-left font-semibold">
                    Giovedì
                  </th>
                  <th className="border border-border px-4 py-3 text-left font-semibold">
                    Venerdì
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeks.length > 0 ? (
                  weeks.map((week) => (
                    <tr key={week.number} className="hover:bg-accent/50 transition-colors">
                      <td className="border border-border px-4 py-4 font-semibold align-top">
                        {week.number}
                      </td>
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
