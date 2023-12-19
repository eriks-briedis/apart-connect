'use client'

import { UpsertInitiativeInput } from '@/app/properties/hooks/useInitiative'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { FormEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { InitiativeModel } from 'shared'
import { SubmitButton } from 'ui'
import { TextEditor } from '../TextEditor'

export const defaultInitiative: UpsertInitiativeInput = {
  label: '',
  description: '',
  type: 'poll',
  status: 'draft',
  expiresAt: moment().add(1, 'week'),
  requiresSignature: false,
}

export interface InitiativeFormProps {
  initiative?: InitiativeModel
  onSubmit: (initiative: UpsertInitiativeInput) => void
  buttons?: JSX.Element
}
export const InitiativeForm = forwardRef(({ buttons, initiative, onSubmit }: InitiativeFormProps, ref) => {
  const [formValue, setFormValue] = useState<UpsertInitiativeInput>({
    label: '',
    description: '',
    type: 'poll',
    status: 'draft',
    expiresAt: moment().add(1, 'week'),
    requiresSignature: false,
  })

  useEffect(() => {
    if (!initiative) {
      return
    }

    setFormValue({
      label: initiative.label,
      description: initiative.description,
      type: initiative.type,
      status: initiative.status,
      expiresAt: moment(initiative.expiresAt),
      requiresSignature: initiative.requiresSignature,
      propertyId: initiative.propertyId,
    })
  }, [initiative, setFormValue])

  const updateFormValue = useCallback((key: string, value: string) => {
    setFormValue({
      ...formValue,
      [key]: value,
    })
  }, [formValue])

  const submit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(formValue)
  }, [formValue, onSubmit])

  useImperativeHandle(ref, () => ({
    reset() {
      setFormValue({
        label: '',
        description: '',
        type: 'poll',
        status: 'draft',
        expiresAt: moment().add(1, 'week'),
        requiresSignature: false,
      })
    }
  }));

  return (
    <form onSubmit={submit}>
      <div className="mb-4">
        <TextField
          required
          label="Nosaukums"
          className="w-full"
          value={formValue.label}
          onChange={(e) => updateFormValue('label', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <TextEditor
          value={formValue.description}
          onChange={(value) => updateFormValue('description', value)}
        />
      </div>

      <div className="mb-4">
        <FormControl>
          <FormLabel>Balsošanas tips</FormLabel>
          <RadioGroup
            row
            name="type"
          >
            <FormControlLabel
              value="poll"
              control={<Radio checked={formValue.type === 'poll'} onChange={() => updateFormValue('type', 'poll')} />}
              label="Aptauja"
            />
            <FormControlLabel
              value="majority"
              control={<Radio checked={formValue.type === 'majority'} onChange={() => updateFormValue('type', 'majority')} />}
              label="Vajadzīgs vairākums"
            />
            <FormControlLabel
              value="unanimous"
              control={<Radio checked={formValue.type === 'unanimous'} onChange={() => updateFormValue('type', 'unanimous')} />}
              label="Vajadzīgi 100%"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="mb-4">
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            className="w-full"
            label="Aptaujas beigu datums"
            minDate={moment().add(1, 'day')}
            value={formValue.expiresAt}
            onChange={(date: any) => updateFormValue('expiresAt', date)}
          />
        </LocalizationProvider>
      </div>

      <div className="mb-4">
        <Select label="Statuss" className="w-full" value={formValue.status} onChange={(e) => updateFormValue('status', e.target.value)}>
          <MenuItem value="draft">Melnraksts</MenuItem>
          <MenuItem value="open">Publicēts</MenuItem>
          <MenuItem value="closed">Aizvērts</MenuItem>
        </Select>
      </div>

      <div className="mb-4 flex justify-between">
        {buttons}
        <SubmitButton>Saglabāt</SubmitButton>
      </div>
    </form>
  )
})

InitiativeForm.displayName = 'InitiativeForm'
