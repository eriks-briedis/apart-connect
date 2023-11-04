'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useProperties } from './hooks'
import { Card, PageHeader } from '../components'
import { PropertyModel } from 'shared'
import { BuildingIcon, PlusIcon } from 'ui'

export default function Properties() {
  const [response, getPropertiesResponse] = useProperties()
  const [properties, setProperties] = useState<PropertyModel[] | undefined>([])

  useEffect(() => {
    getPropertiesResponse()
  }, [])

  useEffect(() => {
    if (!response) {
      return
    }

    if (!response.success) {
      // @TODO: handle error
      alert('Neizdevās ielādēt mājas')
      return
    }

    setProperties(response.data)
  }, [response])

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
