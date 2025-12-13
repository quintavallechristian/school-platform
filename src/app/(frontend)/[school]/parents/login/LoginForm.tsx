'use client'

import { useFormStatus } from 'react-dom'
import { loginParent } from './action'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Accesso in corso...' : 'Accedi'}
    </Button>
  )
}

export default function LoginForm({ school }: { school: string }) {
  const [state, formAction] = useActionState(loginParent, null)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="school" value={school} />
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email{' '}
          <span className="text-destructive" aria-label="campo obbligatorio">
            *
          </span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="mario.rossi@example.com"
          required
          aria-required="true"
          aria-invalid={state?.error ? 'true' : 'false'}
          aria-describedby={state?.error ? 'login-error' : undefined}
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
          <span className="text-destructive" aria-label="campo obbligatorio">
            *
          </span>
        </Label>
        <PasswordInput
          id="password"
          name="password"
          required
          aria-required="true"
          aria-invalid={state?.error ? 'true' : 'false'}
          aria-describedby={state?.error ? 'login-error' : undefined}
          autoComplete="current-password"
        />
      </div>
      {state?.error && (
        <div
          id="login-error"
          role="alert"
          aria-live="polite"
          className="text-sm text-red-500 font-medium text-center"
        >
          {state.error}
        </div>
      )}
      <SubmitButton />
    </form>
  )
}
