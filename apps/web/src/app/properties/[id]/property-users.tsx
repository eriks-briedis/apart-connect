import { Card } from "@/app/components"
import { GET } from "@/app/utils"
import { get } from "http"
import Link from "next/link"
import { useEffect, useState } from "react"
import { UserModel } from "shared"
import { PlusIcon, UserIcon } from "ui"

export interface PropertyUsersProps {
  propertyId: string
}

export function PropertyUsers ({ propertyId }: PropertyUsersProps) {
  const [users, setUsers] = useState<UserModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!propertyId) {
      return
    }

    const getUsers = async () => {
      const response = await GET(`/properties/${propertyId}/users`)
      setLoading(false)
      if (!response.success) {
        alert('Neizdevās ielādēt lietotājus')
        return
      }
      setUsers(response.data)
    }

    setLoading(true)
    getUsers().catch((e) => {
      setLoading(false)
      alert('Neizdevās ielādēt lietotājus')
    })

  }, [propertyId])

  return (
    <div className="px-4 py-2">
      <div className="mb-2 font-bold">
        Mājas iedzīvotāji ({users.length}):
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {users.map((user) => (
          <Card
            key={user.id}
            icon={<UserIcon className="w-12 h-12 stroke-current" />}
            title={`${user.firstName} ${user.lastName}`}
            description={`${user.email}`}
          />
        ))}
        <Link href={`/properties/${propertyId}/add-resident`}>
          <Card
            icon={<PlusIcon className="w-12 h-12 stroke-current" />}
            title="Pievienot jaunu"
          />
        </Link>
      </div>
    </div>
  )
}
