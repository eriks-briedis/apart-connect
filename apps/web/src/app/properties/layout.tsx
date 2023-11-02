'use client'

import { useRouter } from 'next/navigation'
import { useCheckUser } from '../hooks/useCheckUser'

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user: any = useCheckUser()

  const onLogout = () => {
    localStorage.removeItem('apart-connect-token')
    router.push('/auth/login')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>
        <div>Sveiki, {user.firstName}!
        <a href="#" onClick={onLogout}>Izrakstīties</a></div>
      </div>
      <hr/>

      {children}
    </>
  )
}
