'use client'

import { useEffect } from 'react'
import { useProperties } from './hooks'
import Link from 'next/link'

export default function Properties() {
  const [properties, getProperties] = useProperties()

  useEffect(() => {
    getProperties()
  }, [])

  return (
    <div>
      <h1>Manas mājas</h1>
      <Link className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="/properties/new">Pievienot jaunu</Link>
      {properties.map((property) => (
        <div key={property.id}>
          <h2>{property.name}</h2>
          <p>{property.address} {property.city} {property.zip}</p>
        </div>
      ))}
    </div>
  )
}
