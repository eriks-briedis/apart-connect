'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function Register() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const response = await fetch('http://localhost:5005/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    })

    const data = await response.json()

    if (data) {
      router.push('/auth/login')
    }
  }

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="firstName">Vārds</label>
          <input type="text" placeholder="Vārds" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="lastName">Uzvārds</label>
          <input type="text" placeholder="Uzvārds" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Epasts</label>
          <input type="email" placeholder="Epasts" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Parole</label>
          <input type="password" placeholder="Parole" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Reģistrēties</button>
        <p>
          Jau ir konts? <a href="/auth/login">Ienākt</a>
        </p>
      </form>
    </>
  )
}
