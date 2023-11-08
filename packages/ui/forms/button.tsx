import * as React from "react";

export interface ButtonProps {
  isSubmit?: boolean
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Button({ isSubmit = true, className = '', onClick, children }: ButtonProps): JSX.Element {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
      onClick={() => {onClick && onClick()}}
      type={isSubmit ? "submit" : "button"}
    >
      {children}
    </button>
  )
}

export function SubmitButton({ children }: ButtonProps): JSX.Element {
  return <Button isSubmit>{children}</Button>
}
