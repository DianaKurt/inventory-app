import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../db'

export type PublicUser = {
  id: string
  name: string | null
  email: string
  role: Role
}

function toPublicUser(u: any): PublicUser {
  return {
    id: u.id,
    name: u.name ?? null,
    email: u.email,
    role: u.role as Role,
  }
}

export async function loginByEmail(email: string, password: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw { status: 401, message: 'Invalid email or password' }

  if (user.blocked) throw { status: 403, message: 'User is blocked' }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw { status: 401, message: 'Invalid email or password' }

  return toPublicUser(user)
}

export async function getMe(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw { status: 401, message: 'Unauthorized' }
  if (user.blocked) throw { status: 403, message: 'User is blocked' }
  return toPublicUser(user)
}

export async function registerByEmail(params: {
  email: string
  password: string
  name?: string
  role?: Role
}): Promise<PublicUser> {
  const email = params.email.trim().toLowerCase()
  const passwordHash = await bcrypt.hash(params.password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name: params.name?.trim() || null,
      role: params.role ?? Role.USER,
      passwordHash,
    },
  })

  return toPublicUser(user)
}
