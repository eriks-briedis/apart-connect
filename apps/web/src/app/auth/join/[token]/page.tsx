'use client'

import { useRouter } from 'next/navigation'
import { RegisterForm } from '../../components/RegisterForm'
import { RegisterInput, useRegister } from '../../register/hooks'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { GET } from '@/app/utils'


export default function JoinPage({ params }: any) {
  const router = useRouter()
  const token = params.token
  if (!token) {
    router.push('/auth/register')
  }

  const { data } = useSWR(`/auth/invitation-token/${token}`, GET)
  const [email, setEmail] = useState<string>('')
  const [registerResponse, register] = useRegister()

  useEffect(() => {
    if (!data || email) {
      return
    }

    if (!data.success) {
      router.push('/auth/register')
      return
    }

    setEmail(data.data.email)
  }, [data, email, router])

  useEffect(() => {
    if (!registerResponse) {
      return
    }

    if (!registerResponse.success) {
      alert('Invalid registration credentials')
      return
    }

    window.location.href = '/auth/login'
  }, [registerResponse])

  const onSubmit = (formData: RegisterInput) => {
    register({ ...formData, token })
  }

  return (
    <>
      <h5 className="text-center mb-2">Izveidot jaunu kontu</h5>
      <p className="mb-4">
        Lūdzu, aizpildi šo formu, lai izveidotu jaunu kontu.
      </p>
      <RegisterForm email={email} onSubmit={onSubmit} />
    </>
  )
}
