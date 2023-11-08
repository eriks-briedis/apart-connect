'use client'

import { useRouter } from 'next/navigation'
import { getAuthToken } from './utils'


export default function Home() {
  const router = useRouter()
  const token = getAuthToken()
  if (!token) {
    router.push('/auth/login')
  }
  return (
    <div></div>
  )
}
