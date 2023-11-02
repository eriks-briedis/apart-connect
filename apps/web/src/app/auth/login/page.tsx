'use client'

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()


    const response = await fetch('http://localhost:5005/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    // Handle response if necessary
    const data = await response.json()

    if (data.token) {
      localStorage.setItem('apart-connect-token', data.token)
      router.push('/properties')
    }
  }

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Epasts</label>
          <input type="email" placeholder="Epasts" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Parole</label>
          <input type="password" placeholder="Parole" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Ienākt</button>
        <p>
          Vēl nav konta? <a href="/auth/register">Reģistrēties</a>
        </p>
      </form>
    </>
  )
}
