import { PageHeader } from "@/app/components";

export default function EditInitiativePage({ params }: any) {
  return (
    <>
      <PageHeader header="Labot aptauju" backLink={`/properties/${params.id}/initiatives/${params.initiativeId}`}></PageHeader>
    </>
  )
}
