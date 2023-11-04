import { POST, setAuthToken } from '@/app/utils'
import { useState } from 'react'
import { HTTPResponse, UserLoginModel } from 'shared'

export interface LoginInput {
  email: string
  password: string
}

export function useLogin(): [HTTPResponse<UserLoginModel> | null, (input: LoginInput) => Promise<any>] {
  const [response, setResponse] = useState<HTTPResponse<UserLoginModel> | null>(null)

  const login = async ({ email, password }: LoginInput) => {
    const response = await POST('/auth/login', { email, password })
    if (response.token) {
      setAuthToken(response.token)
    }

    setResponse(response)
  }

  return [response, login]
}
