import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { GET, getAuthToken, removeAuthToken } from '../utils';
import { HTTPResponse, UserLoginModel } from 'shared';

export function useCheckUser(): [HTTPResponse<UserLoginModel> | null, () => Promise<void>] {
  const router = useRouter()
  const [response, setResponse] = useState(null)

  const getUser = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    const response = await GET('/auth/me')

    if (!response.data) {
      removeAuthToken()
      router.push('/auth/login')
      return
    }

    setResponse(response)
  }, [router])

  return [response, getUser]
}
