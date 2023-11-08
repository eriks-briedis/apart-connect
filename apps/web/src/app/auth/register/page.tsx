'use client'

import { TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { SubmitButton } from 'ui'
import { useRegister } from './hooks'

// regex for password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: ''
  })
  const [errors, setErrors] = useState<string>()

  const updateFormData = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  useEffect(() => {
    if (formData.password && !passwordRegex.test(formData.password)) {
      setErrors('Parolei jāsatur vismaz 8 simboli, 1 lielais burts un 1 cipars')

    } else if (formData.passwordRepeat && formData.passwordRepeat !== formData.password) {
      setErrors('Paroles nesakrīt')
    } else {
      setErrors(undefined)
    }

  }, [formData, setErrors])

  const [registerResponse, register] = useRegister()

  useEffect(() => {
    if (!registerResponse) {
      return
    }

    // @TODO: Add proper error handling
    if (!registerResponse.success) {
      alert('Invalid registration credentials')
      return
    }

    // @TODO: Show success message
    router.push('/auth/login')
  }, [registerResponse, router])

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (errors) {
      return
    }

    console.log(`calling register with ${formData}`)
    register({ ...formData })
  }, [errors, formData, register])

  return (
    <>
      <h5 className="text-center mb-4">Izveidot jaunu kontu</h5>
      <form onSubmit={onSubmit}>
        <TextField
          type="text"
          name="firstName"
          label="Vārds"
          className="w-full mb-4"
          placeholder="Vārds"
          required
          value={formData.firstName}
          onChange={(e) => updateFormData('firstName', e.target.value)}
        />

        <TextField
          type="text"
          name="lastName"
          label="Uzvārds"
          className="w-full mb-4"
          placeholder="Uzvārds"
          required
          value={formData.lastName}
          onChange={(e) => updateFormData('lastName', e.target.value)}
        />

        <TextField
          type="email"
          name="email"
          label="Epasts"
          className="w-full mb-4"
          placeholder="Epasts"
          required
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
        />

        <TextField
          type="password"
          name="password"
          label="Parole"
          className="w-full mb-4"
          placeholder="Parole"
          required
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
        />

        <TextField
          type="password"
          name="passwordRepeat"
          label="Parole Atkārtoti"
          className="w-full mb-4"
          placeholder="Parole Atkārtoti"
          required
          value={formData.passwordRepeat}
          onChange={(e) => updateFormData('passwordRepeat', e.target.value)}
        />

        {errors && (
          <div className="mb-4 text-red-600 dark:text-red-500">
            {errors}
          </div>
        )}

        <div className="mb-4 text-center">
          <SubmitButton>Reģistrēties</SubmitButton>
        </div>

        <p className="text-right">
          Jau ir konts? <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="/auth/login">Ienākt</a>
        </p>
      </form>
    </>
  )
}
