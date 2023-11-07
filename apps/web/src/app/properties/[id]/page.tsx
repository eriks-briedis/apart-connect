'use client'

import { Loading, PageHeader } from '@/app/components'
import { GET } from '@/app/utils'
import { Suspense } from 'react'
import useSWR from 'swr'
import { PropertyInitiatives } from './property-initiatives'
import { PropertyUsers } from './property-users'
import { HTTPResponse, PropertyModel } from 'shared'

export default function PropertyPage({ params }: any) {
  const id = params.id
  const { data } = useSWR<HTTPResponse<PropertyModel>>(`/properties/${id}`, GET)
  const property = data?.data

  return (
    <>
      <PageHeader header={property?.name ?? '...'} backLink={`/properties`}></PageHeader>
      {property && (
        <div>
          <div className="px-4 py-2">
            <p>{property?.address} {property?.city} {property?.zip}</p>
          </div>
        </div>
      )}
      <Suspense fallback={<div>Loading...</div>}>
      </Suspense>
      <PropertyInitiatives propertyId={id} />
      <PropertyUsers propertyId={id} />
    </>
  )
}
