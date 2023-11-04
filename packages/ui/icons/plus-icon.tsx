import * as React from 'react';
import type { IconProps } from './icon';

export function PlusIcon({ className = 'w-6 h-6 stroke-black' }: IconProps): JSX.Element {
  return (
    <svg className={className} fill="none" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
