import { POST } from '@/app/utils';
import { useCallback, useEffect, useState } from 'react';
import { InitiativeModel } from 'shared';
import { Button } from 'ui';

export interface VoteProps {
  initiative: InitiativeModel
}

export function Vote({ initiative }: any) {
  const [justVoted, setVoted] = useState<boolean>(false)
  const [canUserVote, setCanVote] = useState<boolean>(true)
  const onVote = useCallback(async (vote: boolean) => {
    const submit = async () => {
      const response = await POST(`/votes`, {
        initiativeId: initiative.id,
        vote,
      })

      if (!response.success) {
        alert('Neizdevās nobalsot')
      }

      setVoted(true)
      setCanVote(false)
    }
    submit().catch((e) => {
      alert('Neizdevās nobalsot')
    })
  }, [initiative])

  useEffect(() => {
    setCanVote(initiative.canVote)
  }, [initiative])

  return (
    <>
      {justVoted && (
        <div className="py-4 px-4 bg-green-300 rounded-md">
          <p className="text-green-800">Paldies! Jūsu balsojums ir reģistrēts.</p>
        </div>
      )}
      {canUserVote && initiative.status === 'open' && (
        <div className="py-4">
          <Button isSubmit={false} onClick={() => onVote(true)} className="mr-2">Atbalstu</Button>
          <Button isSubmit={false} onClick={() => onVote(false)} className="bg-red-500">Neatbalstu</Button>
        </div>
      )}
      {!justVoted && !canUserVote && (
        <div className="py-2 px-4 bg-slate-300 rounded-md">
          <p className="text-slate-700">Jūs jau esat nobalsojis.</p>
        </div>
      )}
    </>
  )
}
