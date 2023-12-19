'use client'

import { PageHeader } from '@/app/components';
import { InitiativeForm } from '@/app/components/initiatives/initiativeForm';
import { useGetProperty, useUpdateInitiative } from '@/app/properties/hooks';
import { GET } from '@/app/utils';
import { useEffect, useState } from 'react';
import { HTTPResponse, InitiativeModel } from 'shared';
import useSWR from 'swr';

export default function EditInitiativePage({ params }: any) {
  const [property, setProperty] = useState<any>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [updateResponse, updateInitiative] = useUpdateInitiative()
  const [propertyResponse, setPropertyResponse] = useGetProperty()
  const initiativeId = parseInt(params.initiativeId, 10)
  const propertyId = parseInt(params.id, 10)
  const { data } = useSWR<HTTPResponse<InitiativeModel>>(`/initiatives/${initiativeId}`, GET)
  const initiative = data?.data

  useEffect(() => {
    setPropertyResponse(propertyId)
  }, [])

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
    if (!updateResponse) {
      return
    }

    if (!updateResponse.success) {
      alert('Neizdevās izveidot aptauju')
      return
    }

    setSuccess(true)
  }, [updateResponse])

  return (
    <>
      <PageHeader header="Labot aptauju" backLink={`/properties/${params.id}/initiatives/${params.initiativeId}`}></PageHeader>
      <div className="p-4">
        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <div className="font-bold">Izdevās!</div>
            <span className="block sm:inline">
              Aptauja veiksmīgi labota.
            </span>
          </div>
        )}
        <InitiativeForm initiative={initiative} onSubmit={(input) => updateInitiative(initiativeId, input)} />
      </div>
    </>
  )
}
