'use client'

import { PageHeader } from '@/app/components'
import { useRouter } from 'next/navigation'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Input, SubmitButton } from 'ui'
import { useCreateProperty } from '../hooks'

export default function NewProperty() {
  const router = useRouter()
  const [createResult, createProperty] = useCreateProperty()
  const [formValue, setFormValue] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: 'LV',
  })

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

  const updateFormValue = useCallback((key: string, value: string) => {
    setFormValue({
      ...formValue,
      [key]: value,
    })
  }, [formValue])

  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    createProperty(formValue)
  }, [formValue, createProperty])

  return (
    <div>
      <PageHeader header="Jauna māja" backLink="/properties"></PageHeader>
      <div className="py-2 px-4">
        <p className="pb-4">
          Aizpildi šo formu, lai pievienotu jaunu māju.
        </p>
        <form onSubmit={onSubmit}>
          <Input
            placeholder="Nosaukums"
            name="name"
            required
            value={formValue.name}
            onChange={(value) => updateFormValue('name', value)}
          >
            Nosaukums
          </Input>

          <Input
            placeholder="Adrese"
            name="address"
            required
            value={formValue.address}
            onChange={(value) => updateFormValue('address', value)}
          >
            Adrese
          </Input>

          <Input
            placeholder="Pilsēta"
            name="city"
            required
            value={formValue.city}
            onChange={(value) => updateFormValue('city', value)}
          >
            Pilsēta
          </Input>

          <Input
            placeholder="Pasta indekss"
            name="zip"
            required
            value={formValue.zip}
            onChange={(value) => updateFormValue('zip', value)}
          >
            Pasta indekss
          </Input>

          <Input
            placeholder="Valsts"
            name="country"
            required
            value={formValue.country}
            onChange={(value) => updateFormValue('country', value)}
          >
            Valsts
          </Input>

          <div className="mb-4 flex justify-end">
            <SubmitButton>Saglabāt</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}
