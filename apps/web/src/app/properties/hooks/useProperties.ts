import { GET } from '@/app/utils';
import { useState } from 'react';

export function useProperties(): [any[], () => Promise<void>] {
  //@TODO: add types
  const [properties, setProperties] = useState<any[]>([])

  const getProperties = async () => {
    const response = await GET('/properties')
    setProperties(response.properties)
  }

  return [properties, getProperties]
}
