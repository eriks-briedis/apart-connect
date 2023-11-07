'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createContext, useEffect, useState } from 'react'
import { HTTPResponse, UserLoginModel } from 'shared'
import useSWR, { useSWRConfig } from 'swr'
import { GET } from '../utils'

export interface UserContextProps {
  user: UserLoginModel | null
  refreshUser: () => void
}

export const UserContext = createContext<UserContextProps | null>(null)

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const { data } = useSWR<HTTPResponse<UserLoginModel>>('/auth/me', GET)
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0)
  const [user, setUser] = useState<UserLoginModel | null>(null)

  useEffect(() => {
    if (!data) {
      return
    }

    if (!data.success) {
      router.push('/auth/login')
      return
    }

    setUser(data.data ?? null)
  }, [data, router])

  useEffect(() => {
    if (!user) {
      return
    }

    const unreadNotifications = user.notifications.filter((notification: any) => !notification.read).length
    setUnreadNotifications(unreadNotifications)
  }, [user])

  const onRefreshUser = () => {
    debugger
    mutate('/auth/me')
  }

  const onLogout = () => {
    localStorage.removeItem('apart-connect-token')
    router.push('/auth/login')
  }

  return (
    <>
      <div className="h-screen overflow-hidden border-t border-l border-r border-gray-400 px-3 py-10 bg-gray-200 flex justify-center pt-20 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-green-300 via-blue-500 to-purple-600">
        <div className="fixed top-0 left-0 right-0 bg-white drop-shadow-md">
          <div className="h-14 flex justify-between items-center">
            <div className="text-2xl font-bold pl-4">
              <span className="text-purple-600">Apart</span>
              <span className="font-medium text-blue-500">Connect</span>
            </div>
            <div className="flex pr-4">
              {user && (
                <>
                  <span className="pr-1">Sveiki, {user.firstName}!</span>
                  {!!unreadNotifications && (
                    <Link href="/notifications">
                      {/* red circle with white text */}
                      <span className="flex justify-center items-center w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold mx-2">
                        {unreadNotifications}
                      </span>
                    </Link>
                  )}
                  <a href="#" onClick={onLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full max-w-screen-xl bg-white shadow-lg rounded-md mb-4 drop-shadow-md">
          <UserContext.Provider value={{ user: user, refreshUser: () => onRefreshUser() }}>
            {children}
          </UserContext.Provider>
        </div>
      </div>
      <hr/>
    </>
  )
}
