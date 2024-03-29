'use client'

import { PageHeader } from '@/app/components'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PropertyForm } from '../components'
import { useCreateProperty } from '../hooks'

export default function NewProperty() {
  const router = useRouter()
  const [createResult, createProperty] = useCreateProperty()

  useEffect(() => {
    if (!createResult) {
      return
    }

    if (!createResult.success) {
      alert('Neizdevās izveidot māju')
      return
    }

    router.push(`/properties`)
  }, [createResult, router])

  return (
    <div>
      <PageHeader header="Jauna māja" backLink="/properties"></PageHeader>
      <div className="py-2 px-4">
        <p className="pb-4">
          Aizpildi šo formu, lai pievienotu jaunu māju.
        </p>
        <PropertyForm onSubmit={createProperty} />
      </div>
    </div>
  )
}
