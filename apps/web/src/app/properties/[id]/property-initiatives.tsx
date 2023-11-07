import { Card, Loading } from "@/app/components"
import { GET } from "@/app/utils"
import Link from "next/link"
import { HTTPResponse, InitiativeModel } from "shared"
import useSWR from "swr"
import { DocumentTextIcon, PlusIcon } from "ui"

export interface PropertyInitiativeProps {
  propertyId: number
}

export function PropertyInitiatives({ propertyId }: PropertyInitiativeProps) {
  const { data } = useSWR<HTTPResponse<InitiativeModel[]>>(`/properties/${propertyId}/initiatives`, GET)
  const initiatives = data?.data

  if (!data) {
    return
  }

  if (!initiatives) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-2">
      <div className="mb-2 font-bold">
        Mājas iedaptaujas ({initiatives.length}):
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {initiatives.map((initiative) => (
          <Link href={`/properties/${propertyId}/initiatives/${initiative.id}`} key={initiative.id}>
            <Card
              icon={<DocumentTextIcon className="w-12 h-12 stroke-current" />}
              title={initiative.label}
            />
          </Link>
        ))}
        <Link href={`/properties/${propertyId}/add-initiative`}>
          <Card
            icon={<PlusIcon className="w-12 h-12 stroke-current" />}
            title="Pievienot jaunu"
          />
        </Link>
      </div>
    </div>
  )
}
