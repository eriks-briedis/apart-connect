import { GET } from '@/app/utils'
import { useState } from 'react'
import { HTTPResponse, PropertyModel } from 'shared'

export function useGetProperty(): [HTTPResponse<PropertyModel> | null, (propertyId: number) => Promise<void>] {
  const [property, setProperty] = useState<HTTPResponse<PropertyModel> | null>(null)

  const getProperties = async (propertyId: number) => {
    const response = await GET(`/properties/${propertyId}`)
    setProperty(response)
  }

  return [property, getProperties]
}
