import { knexInstance } from '../db/knexfile'

export interface Vote {
  id: number
  user_id: number
  initiative_id: number
  value: boolean
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

export const getVotesByInitiativeId = async (initiativeId: number) => {
  return await Votes().where({ initiative_id: initiativeId })
}
