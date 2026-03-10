import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { InputBase, Paper, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export default function GlobalSearchInput() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initial = useMemo(() => params.get('q') ?? '', [params])
  const [value, setValue] = useState(initial)

  const submit = () => {
    const q = value.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      sx={{
        px: 1,
        display: 'flex',
        alignItems: 'center',
        width: { xs: 200, sm: 320, md: 420 },
        borderRadius: 2,
      }}
      elevation={0}
      variant="outlined"
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
