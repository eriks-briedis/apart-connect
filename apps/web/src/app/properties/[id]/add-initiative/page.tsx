'use client'

import { PageHeader } from '@/app/components'
import { POST } from '@/app/utils'
import { useCallback, useEffect, useState } from 'react'
import { Input, SubmitButton } from 'ui'
import { useGetProperty } from '../../hooks'
import TextField from '@mui/material/TextField'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

export default function AddResidentPage({ params }: any) {
  const [formValue, setFormValue] = useState({
    label: '',
    description: '',
    type: 'poll',
    status: 'draft',
    requiresSignature: false,
  })
  const [success, setSuccess] = useState<boolean>(false)
  const [property, setProperty] = useState<any>(null)
  const [propertyResponse, setPropertyResponse] = useGetProperty()
  const id = parseInt(params.id, 10)

  useEffect(() => {
    setPropertyResponse(id)
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

  const updateFormValue = useCallback((key: string, value: string) => {
    setFormValue({
      ...formValue,
      [key]: value,
    })
  }, [formValue])

  const onFormSubmit = async (e: any) => {
    e.preventDefault()

    const response = await POST(`/initiatives`, { ...formValue, propertyId: id })
    if (!response.success) {
      alert('Neizdevās izveidot aptauju')
      return
    }

    setSuccess(true)
    setFormValue({
      label: '',
      description: '',
      type: 'poll',
      status: 'draft',
      requiresSignature: false,
    })
  }

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
        <form onSubmit={onFormSubmit} className="py-2">
          <TextField
            required
            label="Nosaukums"
            className="w-full mb-4"
            value={formValue.label}
            onChange={(e) => updateFormValue('label', e.target.value)}
          />

          <TextField
            label="Apraksts par aptauju"
            className="w-full mb-4"
            multiline
            required
            rows={4}
            value={formValue.description}
            onChange={(e) => updateFormValue('description', e.target.value)}
          />

          <div className="mb-4">
            <FormControl>
              <FormLabel>Balsošanas tips</FormLabel>
              <RadioGroup
                row
                name="type"
              >
                <FormControlLabel
                  value="poll"
                  control={<Radio checked={formValue.type === 'poll'} onChange={() => updateFormValue('type', 'poll')} />}
                  label="Aptauja"
                />
                <FormControlLabel
                  value="majority"
                  control={<Radio checked={formValue.type === 'majority'} onChange={() => updateFormValue('type', 'majority')} />}
                  label="Vajadzīgs vairākums"
                />
                <FormControlLabel
                  value="unanimous"
                  control={<Radio checked={formValue.type === 'unanimous'} onChange={() => updateFormValue('type', 'unanimous')} />}
                  label="Vajadzīgi 100%"
                />
              </RadioGroup>
            </FormControl>
          </div>

          <SubmitButton>
            Izveidot
          </SubmitButton>
        </form>
      </div>
    </>
  )
}
