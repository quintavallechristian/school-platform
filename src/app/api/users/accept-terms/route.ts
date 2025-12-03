import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Verifica che l'utente sia autenticato
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    // Aggiorna l'utente con i flag di accettazione
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        acceptedPrivacyPolicy: true,
        acceptedTermsOfService: true,
        acceptanceDate: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Accettazione registrata con successo',
    })
  } catch (error) {
    console.error("Errore durante l'accettazione:", error)
    return NextResponse.json(
      { error: "Errore durante l'elaborazione della richiesta" },
      { status: 500 },
    )
  }
}
