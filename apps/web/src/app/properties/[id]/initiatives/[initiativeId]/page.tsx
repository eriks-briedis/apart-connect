'use client'

import { PageHeader } from "@/app/components"
import { GET } from "@/app/utils"
import { HTTPResponse, InitiativeModel } from "shared"
import useSWR from "swr"

export default function Initiative({ params }: any) {
  const { id, initiativeId } = params
  const { data } = useSWR<HTTPResponse<InitiativeModel>>(`/initiatives/${initiativeId}`, GET)
  const initiative = data?.data

  return (
    <>
      <PageHeader header={`Aptauja: ${initiative?.label ?? ''}`} backLink={`/properties/${id}`}></PageHeader>
      {initiative && (
        <div className="py-2 px-4">
          <p>{initiative.description}</p>
        </div>
      )}
    </>
  )
}
