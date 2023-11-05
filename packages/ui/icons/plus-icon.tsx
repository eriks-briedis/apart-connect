import * as React from 'react';
import { BaseIcon, type IconProps } from './icon';

export function PlusIcon({ className }: IconProps): JSX.Element {
  return (
    <BaseIcon className={className}>
      <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  )
}
