import { useState } from 'react';
import { GET } from '../utils';

export function useGetPropertyUsers(): [any, (propertyId: number) => Promise<void>] {
  const [response, setResponse] = useState<any>(null)

  const getUsers = async (propertyId: number) => {
    const response = await GET(`/properties/${propertyId}/users`)
    setResponse(response)
  }

  return [response, getUsers]
}
