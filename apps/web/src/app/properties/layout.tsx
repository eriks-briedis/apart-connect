'use client'

import { MainLayout } from "../components"

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
