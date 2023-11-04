'use client'

import { POST } from '@/app/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../components';

export default function NotificationsPage({ params }: any) {
  const token = params.token
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      return
    }

    const acceptInvitation = async () => {
      const response = await POST(`/invitations/accept`, { token })
      if (!response.success) {
        // @TODO: show error message
        alert('Neizdevās apstrādāt ielūgumu')
        router.push('/notifications')
        return
      }

      setIsLoading(false)
      router.push('/properties')
    }

    setIsLoading(true)
    acceptInvitation().catch((e) => {
      // @TODO: show error message
      alert('Neizdevās apstrādāt ielūgumu')
      console.error(e)
      setIsLoading(false)
    })
  }, [token, router])

  return (
    <>
      <PageHeader header="Ielūgums" backLink="/notifications"></PageHeader>
      {isLoading && (
        <div className="py-2 px-4">
          <p className="pb-4">
            Apstrādā ielūgumu...
          </p>
        </div>
      )}
    </>
  )
}
