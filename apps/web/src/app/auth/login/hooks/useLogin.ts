import { POST, setAuthToken } from '@/app/utils'
import { useState } from 'react'

export interface LoginInput {
  email: string
  password: string
}

// @TODO: fix types
export function useLogin(): [any, (input: LoginInput) => Promise<any>] {
  const [response, setResponse] = useState(null)

  const login = async ({ email, password }: LoginInput) => {
    const response = await POST('/auth/login', { email, password })

    if (response.token) {
      setAuthToken(response.token)
    }

    setResponse(response)
  }

  return [response, login]
}
