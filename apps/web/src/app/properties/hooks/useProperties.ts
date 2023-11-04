import { GET } from '@/app/utils';
import { useState } from 'react';
import { HTTPResponse, PropertyModel } from 'shared';

export function useProperties(): [HTTPResponse<PropertyModel[]> | null, () => Promise<void>] {
  const [properties, setProperties] = useState<HTTPResponse<PropertyModel[]> | null>(null)

  const getProperties = async () => {
    const response = await GET('/properties')
    setProperties(response)
  }

  return [properties, getProperties]
}
