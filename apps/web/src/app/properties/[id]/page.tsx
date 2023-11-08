'use client'

import { PageHeader } from '@/app/components'
import { GET } from '@/app/utils'
import { Suspense } from 'react'
import { HTTPResponse, PropertyModel } from 'shared'
import useSWR from 'swr'
import { PropertyInitiatives } from './property-initiatives'
import { PropertyUsers } from './property-users'
import Link from 'next/link'

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

      <div className="px-4 py-4 text-center">
        <Link href={`/properties/${id}/edit`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Edit property
        </Link>
      </div>
    </>
  )
}
