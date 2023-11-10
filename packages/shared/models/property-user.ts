export type PropertyUserRole = 'user' | 'property_admin' | 'super_admin'
export type PropertyUserStatus = 'active' | 'removed' | 'pending'

export interface PropertyUser {
  id: number
  propertyId: number
  userId: number
  role: PropertyUserRole
  status: PropertyUserStatus
  attachedAt: Date
  detachedAt: Date
  createdAt: Date
  updatedAt: Date
}
