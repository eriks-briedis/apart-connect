import { POST } from '@/app/utils'
import { useState } from 'react'
import { HTTPAcceptResponse, HTTPResponse } from 'shared'

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
  token?: string
}

export function useRegister(): [HTTPAcceptResponse | null, (input: RegisterInput) => Promise<any>] {
  const [response, setResponse] = useState(null)

  const register = async (input: RegisterInput) => {
    const response = await POST('/auth/register', { ...input })

    setResponse(response)
  }

  return [response, register]
}
