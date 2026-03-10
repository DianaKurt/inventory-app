import * as React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import type { Tag } from '../model/tag.types'
import { fetchTags } from '../api/tag.api'

type Props = {
  value: string[]
  onChange: (next: string[]) => void
  label?: string
  placeholder?: string
  disabled?: boolean
}

export default function TagInput({
  value,
  onChange,
  label = 'Tags',
  placeholder,
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [options, setOptions] = React.useState<Tag[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    let alive = true

    async function run() {
      if (!open) return
      setLoading(true)
      try {
        const data = await fetchTags(inputValue)
        if (alive) setOptions(data)
      } finally {
        if (alive) setLoading(false)
      }
    }

    void run()
    return () => {
      alive = false
    }
  }, [open, inputValue])

  const optionNames = options.map((t) => t.name)

  return (
    <Autocomplete<string, true, false, true>
      multiple
      freeSolo
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disabled={disabled}
      options={optionNames}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, next) => setInputValue(next)}
      onChange={(_, next) => onChange(next)}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
