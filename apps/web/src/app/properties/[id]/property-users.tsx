import { Card } from "@/app/components"
import { GET } from "@/app/utils"
import Link from "next/link"
import { HTTPResponse, UserModel } from "shared"
import useSWR from "swr"
import { PlusIcon, UserIcon } from "ui"

export interface PropertyUsersProps {
  propertyId: string
}

export function PropertyUsers ({ propertyId }: PropertyUsersProps) {
  const { data } = useSWR<HTTPResponse<UserModel[]>>(`/properties/${propertyId}/users`, GET)
  const users = data?.data

  return (
    <div className="px-4 py-2">
      {users && (
        <>
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
        </>
      )}
    </div>
  )
}
