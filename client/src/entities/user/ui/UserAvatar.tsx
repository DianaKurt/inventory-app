import Avatar from '@mui/material/Avatar'
import type { UserPublic } from '../model/user.types'

type Props = {
  user: UserPublic
  size?: number
}

function initials(nameOrEmail: string) {
  const s = nameOrEmail.trim()
  if (!s) return '?'
  const parts = s.split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''
  const out = (first + second).toUpperCase()
  return out || s[0]!.toUpperCase()
}

export default function UserAvatar({ user, size = 32 }: Props) {
  const label = user.name ?? user.email
  return (
    <Avatar
      src={user.avatarUrl ?? undefined}
      alt={label}
      sx={{ width: size, height: size }}
    >
      {initials(label)}
    </Avatar>
  )
}
