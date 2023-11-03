'use client'

import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { Input, SubmitButton } from "ui"
import { useLogin } from "./hooks"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState('')
  const [loginResponse, login] = useLogin()

  useEffect(() => {
    if (!loginResponse) {
      return
    }

    if (!loginResponse.success) {
      // @TODO: Add proper error handling
      alert('Invalid login credentials')
      return
    }

    router.push('/properties')
  }, [loginResponse, router])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    login({ email, password })
  }

  return (
    <>
      <h5 className="text-center mb-4">Login</h5>
      <form onSubmit={onSubmit}>
        <Input type="email" name="email" placeholder="Epasts" required value={email} onChange={setEmail}>
          Epasts
        </Input>

        <Input type="password" name="password" placeholder="Parole" required value={password} onChange={setPassword}>
          Parole
        </Input>

        <div className="mb-4 text-center">
          <SubmitButton>Ienākt</SubmitButton>
        </div>

        <p className="text-right">
          <span className="pr-1">Vēl nav konta?</span>
          <a
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            href="/auth/register"
          >
            Reģistrēties
          </a>
        </p>
      </form>
    </>
  )
}
