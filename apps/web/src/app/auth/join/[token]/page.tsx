'use client'

import { useRouter } from 'next/navigation'
import { RegisterForm } from '../../components/RegisterForm'
import { RegisterInput, useRegister } from '../../register/hooks'
import { useEffect } from 'react'


export default function JoinPage({ params }: any) {
  const token = params.token
  const router = useRouter()
  if (!token) {
    router.push('/auth/register')
  }

  const [registerResponse, register] = useRegister()

  useEffect(() => {
    if (!registerResponse) {
      return
    }

    if (!registerResponse.success) {
      alert('Neizdevās izveidot kontu')
      return
    }

    router.push('/auth/login')
  }, [registerResponse, router])

  const submit = (formData: RegisterInput) => {
    register({ ...formData, token })
  }

  return (
    <>
      <h5 className="text-center mb-2">Izveidot jaunu kontu</h5>
      <p className="mb-4">
        Lūdzu, aizpildi šo formu, lai izveidotu jaunu kontu.
      </p>
      <RegisterForm onSubmit={submit} />
    </>
  )
}
