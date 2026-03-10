import Link from '@mui/material/Link'
import type { UserPublic } from '../model/user.types'

type Props = {
  user: UserPublic
  href?: string
}

export default function UserLink({ user, href }: Props) {
  const label = user.name ?? user.email
  const to = href ?? `/users/${user.id}`
  return (
    <Link href={to} underline="hover">
      {label}
    </Link>
  )
}
