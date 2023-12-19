'use client'

import { PageHeader } from '@/app/components'
import { InitiativeForm, defaultInitiative } from '@/app/components/initiatives/initiativeForm'
import { useEffect, useRef, useState } from 'react'
import { useCreateInitiative, useGetProperty } from '../../hooks'

export default function AddResidentPage({ params }: any) {
  const [success, setSuccess] = useState<boolean>(false)
  const [createResult, createInitiative] = useCreateInitiative()
  const [property, setProperty] = useState<any>(null)
  const [propertyResponse, setPropertyResponse] = useGetProperty()
  const id = parseInt(params.id, 10)
  const formRef = useRef<any>();
  const [newInitiative, setNewInitiative] = useState<any>(defaultInitiative)

  useEffect(() => {
    setPropertyResponse(id)
  }, [])

  useEffect(() => {
    if (!createResult) {
      return
    }

    if (!createResult.success) {
      alert('Neizdevās izveidot aptauju')
      return
    }

    setSuccess(true)
    setNewInitiative({
      ...defaultInitiative,
      propertyId: property.id,
    })
  }, [createResult, property])

  useEffect(() => {
    if (!propertyResponse) {
      return
    }

    if (!propertyResponse.success) {
      alert('Neizdevās ielādēt māju')
      return
    }

    setProperty(propertyResponse.data)
  }, [propertyResponse])

  useEffect(() => {
    if (!property) {
      return
    }

    setNewInitiative({
      ...newInitiative,
      propertyId: property.id,
    })
  }, [property, setNewInitiative]) // @TODO: fix dependency array

  return (
    <>
      <PageHeader
        header={`${property ? property.name + ': ' : ''}Pievienot aptauju`}
        backLink={`/properties/${id}}`}
      ></PageHeader>
      <div className="px-4 py-2">
        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <div className="font-bold">Izdevās!</div>
            <span className="block sm:inline">

            </span>
          </div>
        )}
        <InitiativeForm ref={formRef} initiative={newInitiative} onSubmit={createInitiative} />
      </div>
    </>
  )
}
