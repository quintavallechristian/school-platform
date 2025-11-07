import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Pagina non trovata</h2>
        <p className="text-muted-foreground mb-8">
          La pagina che stai cercando non esiste o è stata rimossa.
        </p>
        <Link href="/">
          <Button>Torna alla Home</Button>
        </Link>
      </div>
    </div>
  )
}
