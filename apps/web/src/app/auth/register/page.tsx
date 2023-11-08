'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { RegisterForm } from '../components/RegisterForm'
import { RegisterInput, useRegister } from './hooks'

export default function Register() {
  const router = useRouter()
  const [registerResponse, register] = useRegister()

  useEffect(() => {
    if (!registerResponse) {
      return
    }

    // @TODO: Add proper error handling
    if (!registerResponse.success) {
      alert('Invalid registration credentials')
      return
    }

    // @TODO: Show success message
    router.push('/auth/login')
  }, [registerResponse, router])

  const onSubmit = (formData: RegisterInput) => {
    register({ ...formData })
  }

  return (
    <>
      <h5 className="text-center mb-4">Izveidot jaunu kontu</h5>

      <RegisterForm onSubmit={onSubmit} />

      <p className="text-right">
        Jau ir konts? <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="/auth/login">Ienākt</a>
      </p>
    </>
  )
}
