import * as React from 'react';
import { BaseIcon, type IconProps } from './icon';

export function CheckIcon({ className }: IconProps): JSX.Element {
  return (
    <BaseIcon className={className}>
      <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  )
}
