import Link from 'next/link';

export interface LinkButtonProps {
  href: string
  onClick?: () => void
  children?: React.ReactNode
  className?: string
}

export function LinkButton({
  onClick,
  children,
  href,
  className = 'bg-blue-500 hover:bg-blue-700',
}: LinkButtonProps): JSX.Element {
  return (
    <Link
      href={href}
      onClick={() => !!onClick && onClick()}
      className={`inline-block py-2 px-4 mr-2 rounded-md drop-shadow hover:drop-shadow-sm transition duration-300 ease-in-out text-white ${className}`}
    >
      <div className="flex items-center text-inherit">
        {children}
      </div>
    </Link>
  )
}

export function SuccessLinkButton({ onClick, children, href }: LinkButtonProps): JSX.Element {
  return <LinkButton href={href} onClick={onClick} className="bg-green-500 hover:bg-green-600">{children}</LinkButton>
}

export function DangerLinkButton({ onClick, children, href }: LinkButtonProps): JSX.Element {
  return <LinkButton href={href} onClick={onClick} className="bg-red-500 hover:bg-red-600">{children}</LinkButton>
}

export function WarningLinkButton({ onClick, children, href }: LinkButtonProps): JSX.Element {
  return <LinkButton href={href} onClick={onClick} className="bg-yellow-500 hover:bg-yellow-600">{children}</LinkButton>
}

export function InfoLinkButton({ onClick, children, href }: LinkButtonProps): JSX.Element {
  return <LinkButton href={href} onClick={onClick} className="bg-blue-500 hover:bg-blue-600">{children}</LinkButton>
}
