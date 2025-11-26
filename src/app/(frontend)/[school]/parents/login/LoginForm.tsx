'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginParent } from './action'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Accesso in corso...' : 'Accedi'}
    </Button>
  )
}

export default function LoginForm({ school }: { school: string }) {
  const [state, formAction] = useFormState(loginParent, null)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="school" value={school} />
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="mario.rossi@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" required />
      </div>
      {state?.error && (
        <div className="text-sm text-red-500 font-medium text-center">{state.error}</div>
      )}
      <SubmitButton />
    </form>
  )
}
