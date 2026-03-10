import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Stack,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
} from '@mui/material'
import Panel from '@/shared/ui/Panel/Panel'
import { apiPost } from '@/shared/api/http'
import type { ItemDetailsDto } from '../ItemPage'

type ApiFieldType = 'TEXT_SINGLE' | 'TEXT_MULTI' | 'NUMBER' | 'LINK' | 'BOOLEAN'

type Field = ItemDetailsDto['fields'][number]

export default function ItemForm({ data }: { data: ItemDetailsDto }) {
  const qc = useQueryClient()
  const itemId = data.item.id

  const fields = useMemo(
    () => [...data.fields].sort((a, b) => a.order - b.order),
    [data.fields],
  )

  // local form state: fieldId - primitive value
  const [values, setValues] = useState<Record<string, any>>({})

  // init values from API (per itemId / fields)
  useEffect(() => {
    const map: Record<string, any> = {}

    for (const f of fields) {
      const raw = data.valuesByFieldId?.[f.id]

      if (!raw) {
        map[f.id] = f.type === 'BOOLEAN' ? false : ''
        continue
      }

      switch (f.type) {
        case 'TEXT_SINGLE':
        case 'TEXT_MULTI':
          map[f.id] = raw.textValue ?? ''
          break
        case 'NUMBER':
          map[f.id] = raw.numberValue ?? ''
          break
        case 'LINK':
          map[f.id] = raw.linkValue ?? ''
          break
        case 'BOOLEAN':
          map[f.id] = Boolean(raw.boolValue)
          break
      }
    }

    setValues(map)
  }, [itemId, fields, data.valuesByFieldId])

  const saveOneField = useMutation({
    mutationFn: async (p: { fieldId: string; value: any }) => {
      return apiPost(`/items/${itemId}/values`, p)
    },
  })

  const onSaveAll = async () => {
    const tasks = fields.map((f) => {
      const v = values[f.id]
      return saveOneField.mutateAsync({
        fieldId: f.id,
        value: normalizeValue(f.type, v),
      })
    })

    await Promise.all(tasks)
    await qc.invalidateQueries({ queryKey: ['item', itemId] })
  }

  return (
    <Panel>
      <Stack spacing={3}>
        <Typography variant="subtitle1" fontWeight={800}>
          Edit item
        </Typography>

        {saveOneField.isError ? (
          <Alert severity="error">
            {(saveOneField.error as any)?.message ?? 'Failed to save'}
          </Alert>
        ) : null}

        {fields.map((field) => (
          <Stack key={field.id} spacing={0.8}>
            {renderFieldInput({
              field,
              value: values[field.id],
              onChange: (val) =>
                setValues((prev) => ({ ...prev, [field.id]: val })),
            })}
          </Stack>
        ))}

        <Divider />

        <Button
          variant="contained"
          size="large"
          disabled={saveOneField.isPending}
          onClick={onSaveAll}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 750 }}
        >
          {saveOneField.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </Stack>
    </Panel>
  )
}

function normalizeValue(type: ApiFieldType, v: any) {
  switch (type) {
    case 'NUMBER':
      return v === '' || v === null || v === undefined ? null : Number(v)
    case 'BOOLEAN':
      return Boolean(v)
    case 'TEXT_SINGLE':
    case 'TEXT_MULTI':
    case 'LINK':
    default:
      return v === undefined || v === null ? '' : String(v)
  }
}

function renderFieldInput({
  field,
  value,
  onChange,
}: {
  field: Field
  value: any
  onChange: (v: any) => void
}) {
  switch (field.type) {
    case 'TEXT_SINGLE':
      return (
        <TextField
          label={field.title}
          helperText={field.description}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
        />
      )

    case 'TEXT_MULTI':
      return (
        <TextField
          label={field.title}
          helperText={field.description}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />
      )

    case 'NUMBER':
      return (
        <TextField
          label={field.title}
          helperText={field.description}
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
        />
      )

    case 'LINK':
      return (
        <TextField
          label={field.title}
          helperText={field.description}
          type="url"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
        />
      )

    case 'BOOLEAN':
      return (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label={field.title}
        />
      )

    default:
      return null
  }
}