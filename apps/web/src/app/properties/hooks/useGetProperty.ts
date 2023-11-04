import { GET } from '@/app/utils'
import { useState } from 'react'

export function useGetProperty(): [any, (propertyId: number) => Promise<void>] {
  //@TODO: add types
  const [property, setProperty] = useState<any>(null)

  const getProperties = async (propertyId: number) => {
    const response = await GET(`/properties/${propertyId}`)
    setProperty(response)
  }

  return [property, getProperties]
}
