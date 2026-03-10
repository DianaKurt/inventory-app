import { Button } from '@mui/material'

type Props = {
  onPick: (file: File, dataUrl: string) => void
  accept?: string
}

export default function ImageUploader({ onPick, accept = 'image/*' }: Props) {
  return (
    <Button component="label" variant="outlined">
      Upload image
      <input
        hidden
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return

          const reader = new FileReader()
          reader.onload = () => onPick(file, String(reader.result ?? ''))
          reader.readAsDataURL(file)
          e.currentTarget.value = ''
        }}
      />
    </Button>
  )
}
