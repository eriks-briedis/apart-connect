'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { HTTPResponse, PropertyModel } from 'shared'
import useSWR from 'swr'
import { BuildingIcon, PlusIcon } from 'ui'
import { Card, PageHeader } from '../components'
import { GET } from '../utils'

export default function Properties() {
  const { data } = useSWR<HTTPResponse<PropertyModel[]>>(`/properties`, GET)
  const properties = data?.data

  return (
    <div>
      <PageHeader header="Manas mājas"></PageHeader>

      <div className="py-2 px-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          {!!properties && properties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`} className="block">
              <Card
                icon={<BuildingIcon className="w-12 h-12 stroke-current" />}
                title={property.name}
                description={`${property.address} ${property.city} ${property.zip}`}
              />
            </Link>
          ))}

          <Link href={`/properties/new`}>
            <Card
              icon={<PlusIcon className="w-12 h-12 stroke-current" />}
              title="Pievienot jaunu"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
