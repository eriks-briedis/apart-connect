'use client'

import { useContext, useEffect, useState } from 'react';
import { NotificationModel } from 'shared';
import { CheckIcon, XMarkIcon } from 'ui';
import { InfoLinkButton, PageHeader, UserContext, WarningLinkButton } from '../components';
import { POST } from '../utils';
import moment from 'moment';

export default function NotificationsPage() {
  const context = useContext(UserContext);
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!context) {
      return
    }

    const user = context.user

    if (!user || !user.notifications) {
      return
    }

    setNotifications(user.notifications)
  }, [context])

  const onReject = async (notification: NotificationModel) => {
    const response = await POST(`/notifications/${notification.id}/reject`, { })
    if (!response.success) {
      alert('Neizdevās noraidīt paziņojumu')
      return
    }

    if (context?.refreshUser) {
      context.refreshUser()
    }
  }

  return (
    <>
      <PageHeader header="Paziņojumi" backLink="/properties"></PageHeader>
      <div className="py-2 px-4">
        {notifications?.map((notification: NotificationModel) => (
          <div key={notification.id} className="border-b border-gray-200 py-2">
            <div className="text-sm text-gray-500 mb-1">
              {moment(notification.createdAt).format('YYYY/MM/DD HH:mm')}
            </div>

            <div className="font-medium">
              <span className={!notification.read ? 'text-red-500': ''}>
                {notification.title}
              </span>
            </div>

            <div className="mb-4">{notification.message}</div>

            {!notification.read && (
              <div className="mb-2">
                <InfoLinkButton href={notification.url}>
                  <CheckIcon className="w-6 h-6 stroke-white"></CheckIcon>
                  Apstiprināt
                </InfoLinkButton>

                <WarningLinkButton href="#" onClick={() => onReject(notification)}>
                  <XMarkIcon className="w-6 h-6 stroke-white"></XMarkIcon>
                  Noraidīt
                </WarningLinkButton>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
