'use client'

import { PageHeader } from '@/app/components'
import { DELETE, GET, POST } from '@/app/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { HTTPResponse, InitiativeModel, PropertyModel } from 'shared'
import useSWR, { useSWRConfig } from 'swr'
import { Button } from 'ui'
import { Vote } from './vote'

export default function Initiative({ params }: any) {
  const { id, initiativeId } = params
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const { data } = useSWR<HTTPResponse<InitiativeModel>>(`/initiatives/${initiativeId}`, GET)
  const propertyResponse = useSWR<HTTPResponse<PropertyModel>>(`/properties/${id}`, GET)
  const initiative = data?.data
  const property = propertyResponse?.data?.data

  const publish = useCallback(async () => {
    const response = await POST(`/initiatives/${initiativeId}/publish`, {})
    if (!response.success) {
      alert('Neizdevās publicēt aptauju')
      return
    }

    mutate(`/initiatives/${initiativeId}`)
    mutate(`/properties/${id}`)
  }, [initiativeId, id, mutate])

  const deleteInitiative = useCallback(async () => {
    const response = await DELETE(`/initiatives/${initiativeId}`)
    if (!response.success) {
      alert('Neizdevās dzēst aptauju')
      return
    }

    router.push(`/properties/${id}`)
  }, [initiativeId, id, router])

  return (
    <>
      <PageHeader header={`Aptauja: ${initiative?.label ?? ''}`} backLink={`/properties/${id}`}></PageHeader>
      {initiative && (
        <div className="py-2 px-4">
          {initiative.status === 'open' && (
            <div>Jau nobalsojuši {initiative.totalVotes || 0} no {property?.numberOfUnits || 0}</div>
          )}
          <p className="mb-4" dangerouslySetInnerHTML={{__html: initiative.description}}></p>
          <hr className="mb-4" />
            <div>
              {initiative.canPublish && (
                <>
                  <p className="mb-4 text-slate-500 italic">
                    Šī aptauja ir sagatavota publicēšanai. Lai to publicētu, nospiediet pogu `Publicēt`.
                  </p>
                  <Button className="mr-2 bg-green-500 hover:bg-green-700" onClick={publish}>Publicēt</Button>
                </>
              )}
              {initiative.canDelete && (
                <Button className="bg-red-500 hover:bg-red-700 mr-2" onClick={deleteInitiative}>Dzēst</Button>
              )}
              {initiative.canEdit && (
                <Link
                  href={`/properties/${id}/initiatives/${initiative.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline h-10 inline-block"
                >
                  Labot
                </Link>
              )}
            </div>

          <Vote initiative={initiative} />
        </div>
      )}
    </>
  )
}
