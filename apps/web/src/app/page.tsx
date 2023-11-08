'use client'

import { useRouter } from 'next/navigation'
import { getAuthToken } from './utils'
import { useEffect } from 'react'


export default function Home() {
  const router = useRouter()
  const token = getAuthToken()
  useEffect(() => {
    if (!token) {
      router.push('/auth/login')
    }
  }, [token, router])
  return (
    <div></div>
  )
}
