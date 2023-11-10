'use client'

import { POST, passwordRegex, setAuthToken } from '@/app/utils'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/navigation'
import { FormEvent, useCallback, useEffect, useState } from "react"
import { SubmitButton } from 'ui'

export default function VerifyPasswordResetPage({ params }: any) {
  const token = params.token
  const router = useRouter()
  const [errors, setErrors] = useState<string | undefined>()

  const [formData, setFormData] = useState({
    password: '',
    passwordRepeat: ''
  })

  useEffect(() => {
    if (formData.password && !passwordRegex.test(formData.password)) {
      setErrors('Parolei jāsatur vismaz 8 simboli, 1 lielais burts un 1 cipars')

    } else if (formData.passwordRepeat && formData.passwordRepeat !== formData.password) {
      setErrors('Paroles nesakrīt')
    } else {
      setErrors(undefined)
    }

  }, [formData, setErrors])

  const updateFormData = useCallback((key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }, [formData, setFormData])

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await POST(
      '/auth/verify',
      {
        token,
        type: 'reset-password',
        password: formData.password,
        passwordRepeat: formData.passwordRepeat,
      },
    )

    if (!response.success) {
      setErrors('Nevarēja atiestatīt paroli')
      return
    }

    if (response.token) {
      setAuthToken(response.token)
    }

    router.push('/properties')
  }, [formData, token, router])

  return (
    <>
      <p className="text-center mb-4">
        Lūdzu ievadi jauno paroli.
      </p>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <TextField
            type="password"
            name="password"
            label="Parole"
            className="w-full"
            placeholder="Parole"
            required
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <TextField
            type="password"
            name="passwordRepeat"
            label="Parole Atkārtoti"
            className="w-full"
            placeholder="Parole Atkārtoti"
            required
            value={formData.passwordRepeat}
            onChange={(e) => updateFormData('passwordRepeat', e.target.value)}
          />
        </div>

        {errors && (
          <div className="mb-4 text-red-600 dark:text-red-500">
            {errors}
          </div>
        )}

        <div className="mb-4 text-center">
          <SubmitButton>Saglabāt paroli</SubmitButton>
        </div>

        <p className="text-center">
          <a
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            href="/auth/reset-password"
          >
            Nosūtīt atiestatīšanas epastu
          </a>
        </p>
      </form>
    </>
  )
}
