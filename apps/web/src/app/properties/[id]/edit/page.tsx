'use client'

import { DELETE, GET, PATCH } from '@/app/utils'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { HTTPResponse, PropertyModel } from 'shared'
import useSWR from 'swr'
import { Button } from 'ui'
import { PropertyForm } from '../../components'
import { PageHeader } from '@/app/components'

export default function EditPropertyPage({ params }: any) {
  const id = params.id
  const router = useRouter()
  const { data } = useSWR<HTTPResponse<PropertyModel>>(`/properties/${id}`, GET)
  const property = data?.data
  const [success, setSuccess] = useState<boolean>(false)

  const updateProperty = async (property: Record<string, any>) => {
    const response = await PATCH(`/properties/${id}`, { ...property })

    if (!response.success) {
      alert('Neizdevās saglabāt izmaiņas')
      return
    }

    setSuccess(true)
  }

  const onDelete = useCallback(async () => {
    const response = await DELETE(`/properties/${id}`)

    if (!response.success) {
      alert('Neizdevās dzēst māju')
      return
    }

    router.push(`/properties`)
  }, [id, router])

  return (
    <>
      <PageHeader header={property?.name ?? '...'} backLink={`/properties/${property?.id}`}></PageHeader>
      <div className="px-4 py-2">
        {success && (
          <div className="mb-4 py-4 px-4 bg-green-300 rounded-md">
            <p className="text-green-800">Izmaiņas veiksmīgi saglabātas!</p>
          </div>
        )}
        <PropertyForm
          buttons={<Button isSubmit={false} className="bg-red-500 hover:bg-red-700 mr-2" onClick={onDelete}>Izdzēst</Button>}
          property={property}
          onSubmit={updateProperty}
        />
      </div>
    </>
  )
}
