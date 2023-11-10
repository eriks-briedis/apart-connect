'use client'

import { TextField } from "@mui/material"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { SubmitButton } from "ui"
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
      <p className="text-center mb-4">
        Lūdzu ievadi savu epastu un paroli, lai ienāktu sistēmā.
      </p>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <TextField
            type="email"
            label="Epasts"
            placeholder="Epasts"
            className="w-full"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <TextField
            type="password"
            label="Parole"
            placeholder="Parole"
            className="w-full"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

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

        <p className="text-right">
          <a
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            href="/auth/reset-password"
          >
            Aizmirsi paroli?
          </a>
        </p>
      </form>
    </>
  )
}
