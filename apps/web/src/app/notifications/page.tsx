'use client'

import { useContext, useEffect, useState } from 'react';
import { PageHeader, UserContext } from '../components';

// @TODO: properly type this
interface ActiveUser {
  notifications: Record<string, any>[]
  [key: string]: any
}

export default function NotificationsPage() {
  // @TOOD: properly type this
  const user = useContext(UserContext) as any as ActiveUser;
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!user || !user.notifications) {
      return
    }

    setNotifications(user.notifications)
  }, [user])

  return (
    <>
      <PageHeader header="Paziņojumi" backLink="/properties"></PageHeader>
      <div className="py-2 px-4">
        {notifications?.map((notification) => (
          <div key={notification.id} className="border-b border-gray-200 py-2">
            <div className={!notification.read ? 'text-red-500 font-medium': 'font-medium'}>{notification.title}</div>
            {/* @TODO: figure out what to do here */}
            <div dangerouslySetInnerHTML={{__html: notification.message}}></div>
          </div>
        ))}
      </div>
    </>
  )
}
