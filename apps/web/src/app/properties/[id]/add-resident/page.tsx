'use client'

import { PageHeader } from '@/app/components'
import { POST } from '@/app/utils'
import { useEffect, useState } from 'react'
import { Button, Input, SubmitButton } from 'ui'
import { useGetProperty } from '../../hooks'

export default function AddResidentPage({ params }: any) {
  const [email, setEmail] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [property, setProperty] = useState<any>(null)
  const [inviteLink, setInviteLink] = useState<string>('')
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

  const onFormSubmit = async (e: any) => {
    e.preventDefault()

    const response = await POST(`/invitations`, { email, propertyId: id })
    if (!response.success) {
      alert('Neizdevās aicināt iedzīvotāju')
      return
    }

    setSuccess(true)
    setEmail('')
  }

  const createInvitation = async () => {
    const response = await POST(`/invitations`, { propertyId: id })

    if (!response.success) {
      alert('Neizdevās izveidot ielūgumu')
      return
    }

    setInviteLink(response.data)
  }

  return (
    <>
      <PageHeader
        header={`${property ? property.name + ': ' : ''}Pievienot iedzīvotāju`}
        backLink={`/properties/${id}}`}
      ></PageHeader>
      <div className="px-4 py-2">
        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <div className="font-bold">Izdevās!</div>
            <span className="block sm:inline">Iedzīvotājam tika nosūtīts aicinājums uz norādīto epastu.</span>
          </div>
        )}
        {inviteLink && (
          <>
            Atverot šo saiti un reģistrējoties, iedzīvotājs tiks pievienots mājas iedzīvotāju sarakstam:
            <code className="text-sm bg-slate-300 p-3 mt-2 mb-4 inline-block rounded-md">
              {inviteLink}
            </code>
          </>
        )}
        {!inviteLink && (
          <div className="my-4">
            <Button isSubmit={false} className="bg-green-500 hover:bg-green-700 mr-2" onClick={createInvitation}>
              Izveidot ielūgumu
            </Button>
          </div>
        )}
        <form onSubmit={onFormSubmit}>
          <Input type="email" name="email" placeholder="Epasts" required value={email} onChange={setEmail}>
            Epasts
          </Input>

          <SubmitButton>
            Pievienot
          </SubmitButton>
        </form>
      </div>
    </>
  )
}
