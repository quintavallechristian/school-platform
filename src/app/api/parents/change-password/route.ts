import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get user from JWT token
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    // Verify token and get user
    let user
    try {
      const result = await payload.auth({
        headers: new Headers({ Authorization: `JWT ${token}` }),
      })
      user = result.user
    } catch (error) {
      console.error('Auth error:', error)
      return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 })
    }

    // Check if user is a parent
    if (!user || user.role !== 'parent') {
      return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
    }

    // Get passwords from request
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Password attuale e nuova password sono obbligatorie' },
        { status: 400 },
      )
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La nuova password deve essere di almeno 8 caratteri' },
        { status: 400 },
      )
    }

    // Verify current password by attempting to login
    try {
      await payload.login({
        collection: 'users',
        data: {
          email: user.email,
          password: currentPassword,
        },
      })
    } catch (error) {
      console.error('Error:', error)
      return NextResponse.json({ error: 'La password attuale non è corretta' }, { status: 400 })
    }

    // Update password
    try {
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: newPassword,
        },
      })

      return NextResponse.json({ message: 'Password aggiornata con successo' }, { status: 200 })
    } catch (error) {
      console.error('Error updating password:', error)
      return NextResponse.json(
        { error: "Errore durante l'aggiornamento della password" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
