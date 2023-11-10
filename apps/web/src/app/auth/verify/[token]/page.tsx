'use client'

import { POST, setAuthToken } from '@/app/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyPage({ params }: any) {
  const token = params.token
  const router = useRouter()
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (!token) {
      return
    }

    const verifyToken = async () => {
      const response = await POST('/auth/verify', { token, type: 'verify' })
      if (!response.success) {
        setError(true)
        return
      }

      if (response.token) {
        setAuthToken(response.token)
      }

      router.push('/properties')
    }

    verifyToken().catch(() => {
      setError(true)
    })
  }, [token, router])


  return (
    <div className="text-center">
      {!error && <p>Pārbaudu epasta adresi...</p>}
      {error && (
        <>
          <p className="mb-4">Nevarēja pārbaudīt epasta adresi</p>
          <Link href="/auth/login" className="underline">
            Atpakaļ
          </Link>
        </>
      )}
    </div>
  )
}
