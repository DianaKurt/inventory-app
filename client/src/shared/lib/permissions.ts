export type Role = 'guest' | 'user' | 'admin'

export function canAccessAdmin(role: Role) {
  return role === 'admin'
}
