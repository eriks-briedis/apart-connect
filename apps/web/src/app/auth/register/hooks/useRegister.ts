import { POST } from '@/app/utils'
import { useState } from 'react'

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

// @TODO: fix types
export function useRegister(): [any, (input: RegisterInput) => Promise<any>] {
  const [response, setResponse] = useState(null)

  const register = async (input: RegisterInput) => {
    const response = await POST('/auth/register', { ...input })

    setResponse(response)
  }

  return [response, register]
}
