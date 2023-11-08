'use client'

import { PageHeader, UserContext } from '@/app/components'
import { GET, POST } from '@/app/utils'
import { useCallback, useContext, useEffect, useState } from 'react'
import { HTTPResponse, InitiativeModel, PropertyModel } from 'shared'
import useSWR, { useSWRConfig } from 'swr'
import { Button } from 'ui'
import { Vote } from './vote'

export default function Initiative({ params }: any) {
  const { id, initiativeId } = params
  const { mutate } = useSWRConfig()
  const context = useContext(UserContext)
  const [canPublish, setCanPublish] = useState<boolean>(false)
  const { data } = useSWR<HTTPResponse<InitiativeModel>>(`/initiatives/${initiativeId}`, GET)
  const propertyResponse = useSWR<HTTPResponse<PropertyModel>>(`/properties/${id}`, GET)
  const initiative = data?.data
  const property = propertyResponse?.data?.data

  useEffect(() => {
    if (!context || !initiative) {
      return
    }

    const isOwner = context.user?.id === initiative?.createdBy
    const isDraft = initiative?.status === 'draft'

    setCanPublish(isOwner && isDraft)
  }, [context, initiative])

  const publish = useCallback(async () => {
    const response = await POST(`/initiatives/${initiativeId}/publish`, {})
    if (!response.success) {
      alert('Neizdevās publicēt aptauju')
      return
    }

    mutate(`/initiatives/${initiativeId}`)
    mutate(`/properties/${id}`)
  }, [initiativeId, id, mutate])

  return (
    <>
      <PageHeader header={`Aptauja: ${initiative?.label ?? ''}`} backLink={`/properties/${id}`}></PageHeader>
      {initiative && (
        <div className="py-2 px-4">
          <div>Jau nobalsojuši {initiative.totalVotes || 0} no {property?.numberOfUnits || 0}</div>
          <h5>{initiative.label}</h5>
          <p className="mb-4">{initiative.description}</p>
          {canPublish && (
            <div>
              <p className="mb-4 text-slate-500 italic">
                Šī aptauja ir sagatavota publicēšanai. Lai to publicētu, nospiediet pogu `Publicēt`.
              </p>
              <Button onClick={publish}>Publicēt</Button>
            </div>
          )}
          <Vote initiative={initiative} />
        </div>
      )}
    </>
  )
}
