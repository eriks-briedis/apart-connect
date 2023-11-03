import * as React from "react";

export interface InputProps {
  type: string
  children?: React.ReactNode
  name: string
  value: string
  placeholder?: string
  required?: boolean
  onChange: (value: string) => void
}

export function Input({ type, children, name, placeholder, required, value, onChange }: InputProps): JSX.Element {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        { children }
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-blue-400 focus:border-blue-400 block w-full"
        onChange={(e) => {onChange(e.target.value)}}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </div>
  )
}
