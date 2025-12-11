'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export const LogoutButton = ({ baseHref }: { baseHref: string }) => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      router.push(`${baseHref}/parents/login`)
      router.refresh()
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <Button variant="destructive" onClick={handleLogout} className="gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
