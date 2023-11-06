'use client'

import { PageHeader } from "@/app/components"
import { GET } from "@/app/utils"
import { useEffect, useState } from "react"
import { InitiativeModel } from "shared"

export default function Initiative({ params }: any) {
  const { id, initiativeId } = params
  const [initiative, setInitiative] = useState<InitiativeModel | null>(null)

  useEffect(() => {
    if (!initiativeId) {
      return
    }

    const getInitiative = async () => {
      const response = await GET(`/initiatives/${initiativeId}`)
      if (!response.success) {
        alert('Neizdevās ielādēt aptauju')
        return
      }
      setInitiative(response.data)
    }

    getInitiative().catch((e) => {
      console.error(e)
      alert('Neizdevās ielādēt aptauju')
    })
  }, [initiativeId])

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
