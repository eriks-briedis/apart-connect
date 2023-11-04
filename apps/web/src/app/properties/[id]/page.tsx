'use client'

import { PageHeader } from '@/app/components'
import { GET } from '@/app/utils'
import { Suspense, useEffect, useState } from 'react'
import { PropertyUsers } from './property-users'

export default function PropertyPage({ params }: any) {
  const [property, setProperty] = useState<any>(null)
  const id = params.id

  useEffect(() => {
    if (!id) {
      return
    }

    const getProperty = async () => {
      const response = await GET(`/properties/${id}`)
      if (!response.success) {
        alert('Neizdevās ielādēt māju')
        return
      }
      setProperty(response.data)
    }

    getProperty()
  }, [id])

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {property && (
          <div>
            <PageHeader header={property.name} backLink={`/properties`}></PageHeader>
            <div className="px-4 py-2">
              <p>{property?.address} {property?.city} {property?.zip}</p>
            </div>
          </div>
        )}
        <PropertyUsers propertyId={id} />
      </Suspense>
    </>
  )
}
