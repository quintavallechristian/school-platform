'use server'

import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginParent(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const school = formData.get('school') as string

  if (!email || !password) {
    return { error: 'Inserisci email e password' }
  }

  const payload = await getPayloadHMR({ config })

  try {
    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (result.user) {
      // Check if user is a parent
      if (result.user.role !== 'parent') {
        return { error: 'Accesso consentito solo ai genitori' }
      }

      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Credenziali non valide' }
  }

  redirect(`/${school}/parents/dashboard`)
}
