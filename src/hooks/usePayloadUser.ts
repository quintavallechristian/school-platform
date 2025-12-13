'use client'
import { useEffect, useState, useCallback } from 'react'

export type PayloadUser = {
  id: string
  email: string
  role?: string
  firstName?: string
  lastName?: string
  phone?: string
  schools?: unknown[]
  children?: unknown[]
  [key: string]: unknown
}

export function usePayloadUser() {
  const [user, setUser] = useState<PayloadUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
        credentials: 'include',
      })

      if (!res.ok) {
        setUser(null)
      } else {
        const data = await res.json()
        setUser(data.user || data)
      }
    } catch (err) {
      console.error(err)
      setError('Errore di rete')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
    // Auto-refresh rimosso per evitare polling continuo
    // Se necessario, usa la funzione refresh() restituita dall'hook
  }, [fetchUser])

  return { user, loading, error, refresh: fetchUser }
}
