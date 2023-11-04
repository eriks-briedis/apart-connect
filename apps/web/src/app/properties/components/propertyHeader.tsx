import Link from "next/link"

export interface PropertyHeaderProps {
  header: string
  backLink?: string
  children?: React.ReactNode
}

export default function PropertyHeader({ backLink, children, header }: PropertyHeaderProps): JSX.Element {
  return (
    <div className="flex items-center justify-between h-14 pr-4 border-b border-b-gray-300">
      <div className="flex">
        {backLink && (
          <Link href={backLink} className="w-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
        )}
        {!backLink && (
          <div className="w-4"></div>
        )}
        <h1 className="text-xl">
          {header}
        </h1>
      </div>
      {children}
    </div>
  )
}
