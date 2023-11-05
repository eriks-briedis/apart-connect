import * as React from 'react';
import { BaseIcon, type IconProps } from './icon';

export function XMarkIcon({ className }: IconProps): JSX.Element {
  return (
    <BaseIcon className={className}>
      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  )
}
