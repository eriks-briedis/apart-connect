'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useProperties } from './hooks'
import { PageHeader } from '../components'

export default function Properties() {
  const [properties, getProperties] = useProperties()

  useEffect(() => {
    getProperties()
  }, [])

  return (
    <div>
      <PageHeader header="Manas mājas"></PageHeader>

      <div className="py-2 px-4">
        <div className="grid grid-cols-4 gap-4">
          {properties.map((property) => (
            <div key={property.id} className="shadow rounded-md hover:bg-gray-100">
              <Link href={`/properties/${property.id}`}>
                <div className="w-100 h-40 bg-gray-300 rounded-t-md flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div> {/* TODO: add image */}
                <div className="p-2">
                  <h2 className="text-xl font-semibold">
                    {property.name}
                  </h2>
                  <p>{property.address} {property.city} {property.zip}</p>
                </div>
              </Link>
            </div>
          ))}

          <div className="shadow rounded-md hover:bg-gray-100">
            <Link href={`/properties/new`}>
              <div className="w-100 h-40 bg-gray-300 rounded-t-md flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              </div>
              <div className="p-2">
                <h2 className="text-xl font-semibold">
                  Pievienot jaunu
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
