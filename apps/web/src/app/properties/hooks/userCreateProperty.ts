import { POST } from '@/app/utils';
import { useState } from 'react';

export interface CreatePropertyInput {
  name: string
  address: string
  city: string
  zip: string
  country: string
  numberOfUnits: number
}

export function useCreateProperty(): [any, (input: CreatePropertyInput) => Promise<any>] {
  const [response, createProperty] = useState()

  const create = async (input: CreatePropertyInput) => {
    const result = await POST('/properties', { ...input })

    createProperty(result)
  }

  return [response, create]
}
