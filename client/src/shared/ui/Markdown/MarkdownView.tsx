import { Box, Typography } from '@mui/material'

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderBasic(md: string) {
  //**bold**, *italic*, `code`
  let html = escapeHtml(md)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/\n/g, '<br/>')
  return html
}

type Props = {
  value: string
  title?: string
}

export default function MarkdownView({ value, title }: Props) {
  return (
    <Box>
      {title ? (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {title}
        </Typography>
      ) : null}

      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          '& code': { fontFamily: 'monospace', px: 0.5 },
        }}
        dangerouslySetInnerHTML={{ __html: renderBasic(value) }}
      />
    </Box>
  )
}
