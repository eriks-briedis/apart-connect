import { PATCH, POST } from '@/app/utils';
import { useState } from 'react';
import { InitiativeStatus, InitiativeType } from 'shared';

export interface UpsertInitiativeInput {
  label: string
  description: string
  type: InitiativeType
  status: InitiativeStatus
  expiresAt: moment.Moment
  requiresSignature: boolean
  propertyId?: number
}

export const initiativeInputTransformer = (input: UpsertInitiativeInput) => ({
  ...input,
  expiresAt: input.expiresAt.toISOString(),
})

export function useCreateInitiative(): [any, (input: UpsertInitiativeInput) => Promise<any>] {
  const [response, createInitiative] = useState()

  const create = async (input: UpsertInitiativeInput) => {
    const result = await POST('/initiatives', {
      ...initiativeInputTransformer(input),
    })

    createInitiative(result)
  }

  return [response, create]
}

export function useUpdateInitiative(): [any, (id: number, input: UpsertInitiativeInput) => Promise<any>] {
  const [response, updateInitiative] = useState()

  const update = async (id: number, input: UpsertInitiativeInput) => {
    const result = await PATCH(`/initiatives/${id}`, {
      ...initiativeInputTransformer(input),
    })

    updateInitiative(result)
  }

  return [response, update]
}
