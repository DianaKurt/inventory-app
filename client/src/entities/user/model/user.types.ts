export type User = {
  id: string
  email: string
  name: string | null
  avatarUrl?: string | null
}

export type UserPublic = Pick<User, 'id' | 'email' | 'name' | 'avatarUrl'>
