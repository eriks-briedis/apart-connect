'use client'

import { GET } from '@/app/utils'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import PropertyHeader from '../components/propertyHeader'

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
      setProperty(response.property)
    }

    getProperty()
  }, [id])

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {property && (
          <div>
            <PropertyHeader header={property.name} backLink={`/properties`}>
              <Link
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                href={`/properties/${property.id}/add-resident`}
              >
                Pievienot iedzīvotāju
              </Link>
            </PropertyHeader>
            <p>{property?.address} {property?.city} {property?.zip}</p>
          </div>
        )}
      </Suspense>
    </>
  )
}
