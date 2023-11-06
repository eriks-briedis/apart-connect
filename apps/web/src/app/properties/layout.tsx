'use client'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MainLayout } from '../components'

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <MainLayout>
        {children}
      </MainLayout>
    </LocalizationProvider>
  )
}
