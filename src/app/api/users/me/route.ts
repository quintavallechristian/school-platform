import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
      return Response.json({ user: null }, { status: 401 })
    }

    // Verifica il token e ottieni l'utente
    const { user } = await payload.auth({
      headers: request.headers,
    })

    if (!user) {
      return Response.json({ user: null }, { status: 401 })
    }

    return Response.json({ user })
  } catch (error) {
    console.error('Error fetching current user:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
