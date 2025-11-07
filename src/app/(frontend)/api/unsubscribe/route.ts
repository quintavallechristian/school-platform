import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return new NextResponse('Token mancante', { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find subscriber by token
    const subscribers = await payload.find({
      collection: 'email-subscribers',
      where: {
        unsubscribeToken: {
          equals: token,
        },
      },
      limit: 1,
    })

    if (subscribers.docs.length === 0) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Errore - Disiscrizione</title>
            <style>
              body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              .error { color: #dc2626; }
            </style>
          </head>
          <body>
            <h1 class="error">❌ Errore</h1>
            <p>Token non valido o già utilizzato.</p>
            <a href="/">Torna alla home</a>
          </body>
        </html>
        `,
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
      )
    }

    const subscriber = subscribers.docs[0]

    // Deactivate subscription
    await payload.update({
      collection: 'email-subscribers',
      id: subscriber.id,
      data: {
        isActive: false,
      },
    })

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Disiscrizione completata</title>
          <style>
            body { 
              font-family: system-ui; 
              max-width: 600px; 
              margin: 50px auto; 
              padding: 20px; 
              text-align: center; 
              background: #f9fafb;
            }
            .card {
              background: white;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .success { color: #16a34a; font-size: 48px; }
            h1 { color: #1f2937; margin-top: 20px; }
            p { color: #6b7280; line-height: 1.6; }
            a { 
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            }
            a:hover { background: #1d4ed8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success">✅</div>
            <h1>Disiscrizione completata</h1>
            <p>Non riceverai più notifiche email sulle nuove comunicazioni.</p>
            <p>Se cambi idea, puoi sempre iscriverti nuovamente dalla pagina delle comunicazioni.</p>
            <a href="/comunicazioni">Vai alle comunicazioni</a>
          </div>
        </body>
      </html>
      `,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Errore</title>
        </head>
        <body>
          <h1>Errore durante la disiscrizione</h1>
          <p>Riprova più tardi.</p>
        </body>
      </html>
      `,
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  }
}
