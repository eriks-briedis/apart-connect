import { knexInstance } from '../db/knexfile'

export enum VoteType {
  SIGNED = 'signed',
  SIMPLE = 'simple'
}

export enum VoteValue {
  YES = 'Y',
  NO = 'N'
}

export interface Vote {
  id: number
  user_id: number
  resolution_id: number
  value: VoteValue
  type: VoteType
  created_at: Date
  updated_at: Date
}

export const Votes = () => knexInstance<Vote>('vote')

export const createVote = async (vote: Partial<Vote>) => {
  return await Votes().insert({
    ...vote,
    created_at: new Date(),
    updated_at: new Date(),
  })
}
