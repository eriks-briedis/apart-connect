import { GET, passwordRegex } from '@/app/utils';
import TextField from '@mui/material/TextField/TextField';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { SubmitButton } from 'ui';
import { RegisterInput } from '../register/hooks';

export interface RegisterFormProps {
  email?: string
  onSubmit: (formData: RegisterInput) => void
}

export function RegisterForm({ email, onSubmit }: RegisterFormProps): JSX.Element {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: ''
  })
  const [errors, setErrors] = useState<string>()

  const verifyEmail = async (email: string) => {
    const response = await GET('/auth/availability', { email })

    if (!response.success) {
      setErrors('Nevarēja pārbaudīt epasta adresi')
      return
    }

    if (!response.data) {
      setErrors('Šāds epasts jau ir reģistrēts')
    }
  }

  const updateFormData = useCallback((key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }, [formData])

  useEffect(() => {
    if (email) {
      updateFormData('email', email)
    }
  }, [email, updateFormData])

  useEffect(() => {
    if (formData.password && !passwordRegex.test(formData.password)) {
      setErrors('Parolei jāsatur vismaz 8 simboli, 1 lielais burts un 1 cipars')

    } else if (formData.passwordRepeat && formData.passwordRepeat !== formData.password) {
      setErrors('Paroles nesakrīt')
    } else {
      setErrors(undefined)
    }

  }, [formData, setErrors])

  const submit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (errors) {
      return
    }

    onSubmit(formData)
  }, [errors, formData, onSubmit])

  return (
    <form onSubmit={submit}>
      <div className="mb-4">
        <TextField
          type="text"
          name="firstName"
          label="Vārds"
          className="w-full"
          placeholder="Vārds"
          required
          value={formData.firstName}
          onChange={(e) => updateFormData('firstName', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <TextField
          type="text"
          name="lastName"
          label="Uzvārds"
          className="w-full"
          placeholder="Uzvārds"
          required
          value={formData.lastName}
          onChange={(e) => updateFormData('lastName', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <TextField
          type="email"
          name="email"
          label="Epasts"
          className="w-full"
          placeholder="Epasts"
          disabled={!!email}
          required
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          onBlur={(e) => verifyEmail(e.target.value)}
        />
      </div>

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
        <SubmitButton>Reģistrēties</SubmitButton>
      </div>
    </form>
  )
}
