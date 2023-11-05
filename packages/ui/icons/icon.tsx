import * as React from 'react';

export interface IconProps {
  className?: string;
}

export interface BaseIconProps extends IconProps {
  children: React.ReactNode;
}

export function BaseIcon({ className = 'w-6 h-6 stroke-black', children }: BaseIconProps): JSX.Element {
  return (
    <svg className={className} fill="none" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  )
}
