import * as React from 'react';
import type { IconProps } from './icon';

export function CheckIcon({ className = 'w-6 h-6 stroke-black' }: IconProps): JSX.Element {
  return (
    <svg className={className} fill="none" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
