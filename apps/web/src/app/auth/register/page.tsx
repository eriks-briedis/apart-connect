'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useRegister } from './hooks'
import { Input, SubmitButton } from 'ui'

export default function Register() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    register({ firstName, lastName, email, password })
  }

  return (
    <>
      <h5 className="text-center mb-4">Izveidot jaunu kontu</h5>
      <form onSubmit={onSubmit}>
        <Input type="text" name="firstName" placeholder="Vārds" required value={firstName} onChange={setFirstName}>
          Vārds
        </Input>

        <Input type="text" name="lastName" placeholder="Uzvārds" required value={lastName} onChange={setLastName}>
          Uzvārds
        </Input>

        <Input type="email" name="email" placeholder="Epasts" required value={email} onChange={setEmail}>
          Epasts
        </Input>

        <Input type="password" name="password" placeholder="Parole" required value={password} onChange={setPassword}>
          Parole
        </Input>

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
