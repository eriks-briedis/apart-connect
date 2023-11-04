import { useState } from 'react';
import { GET } from '../utils';

export function useGetUsers(): [any, () => Promise<void>] {
  const [response, setResponse] = useState<any>(null)

  const getUsers = async () => {
    const response = await GET(`/users`)
    setResponse(response)
  }

  return [response, getUsers]
}
