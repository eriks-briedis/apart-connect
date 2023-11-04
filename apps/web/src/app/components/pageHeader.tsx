import Link from 'next/link'

export interface PageHeaderProps {
  header: string
  backLink?: string
  children?: React.ReactNode
}

export function PageHeader({ backLink, children, header }: PageHeaderProps): JSX.Element {
  return (
    <div className="flex items-center justify-between h-14 pr-4 border-b border-b-gray-300">
      <div className="flex">
        {backLink && (
          <Link href={backLink} className="w-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
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
