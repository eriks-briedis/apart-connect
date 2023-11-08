'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { PropertyModel } from 'shared'
import { Input, SubmitButton } from 'ui'
import { CreatePropertyInput } from '../hooks'

export interface PropertyFormProps {
  property?: PropertyModel
  onSubmit: (property: CreatePropertyInput) => void
  buttons?: JSX.Element
}

export function PropertyForm({ buttons, property, onSubmit }: PropertyFormProps): JSX.Element {
  const [formValue, setFormValue] = useState<CreatePropertyInput>({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: 'LV',
    numberOfUnits: 0,
  })

  useEffect(() => {
    if (!property) {
      return
    }

    setFormValue({
      name: property.name,
      address: property.address,
      city: property.city,
      zip: property.zip,
      country: property.country,
      numberOfUnits: property.numberOfUnits,
    })
  }, [property, setFormValue])

  const updateFormValue = useCallback((key: string, value: string) => {
    setFormValue({
      ...formValue,
      [key]: value,
    })
  }, [formValue])

  const submit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(formValue)
  }, [formValue, onSubmit])

  return (
    <form onSubmit={submit}>
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

      <Input
        placeholder="Dzīvokļu skaits"
        name="numberOfUnits"
        required
        type="number"
        value={`${formValue.numberOfUnits}`}
        onChange={(value) => updateFormValue('numberOfUnits', value)}
      >
        Dzīvokļu skaits
      </Input>

      <div className="mb-4 flex justify-between">
        {buttons}
        <SubmitButton>Saglabāt</SubmitButton>
      </div>
    </form>
  )
}
