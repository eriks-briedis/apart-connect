'use client'

import { POST } from '@/app/utils';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { FormEvent, useCallback, useState } from 'react';
import { SubmitButton } from 'ui';

export default function PasswordResetPage() {
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<boolean>()
  const [success, setSuccess] = useState<boolean>(false)

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      return
    }

    const resetPassword = async () => {
      const response = await POST('/auth/reset-password', { email })

      if (!response.success) {
        setError(true)
        return
      }

      setSuccess(true)
      setEmail('')
    }

    resetPassword().catch(() => {
      setError(true)
    })
  }, [email])

  return (
    <>
      <p className="text-center mb-4">
        Lūdzu ievadi savu epastu, lai atiestatītu paroli.
      </p>
      {error && (
        <p className="text-center mb-4">
          Nevarēja atiestatīt paroli
        </p>
      )}
      {success && (
        <p className="text-center mb-4">
          Parole atiestatīta. Lūdzu pārbaudi savu epastu.
        </p>
      )}
      <form onSubmit={onSubmit}>
        <div className="mb-4">
        <TextField
          type="email"
          name="email"
          label="Epasts"
          className="w-full"
          placeholder="Epasts"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        <div className="mb-4 text-center">
          <SubmitButton>
            Atiestatīt paroli
          </SubmitButton>
        </div>

        <p className="text-center">
          <Link
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            href="/auth/login"
          >
            Atpakaļ
          </Link>
        </p>
      </form>
    </>
  )
}
