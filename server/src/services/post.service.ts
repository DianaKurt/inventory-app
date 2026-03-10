import { prisma } from '../db'
import { canReadInventory, canWriteInventory } from './access.service'

export async function listPosts(params: { userId: string | null; inventoryId: string }) {
  await canReadInventory(params.userId, params.inventoryId)

  const posts = await prisma.post.findMany({
    where: { inventoryId: params.inventoryId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  })

  return posts.map((p) => ({
    id: p.id,
    inventoryId: p.inventoryId,
    bodyMd: p.bodyMd,
    createdAt: p.createdAt,
    authorName: p.user.name ?? p.user.email,
  }))
}

export async function createPost(params: { userId: string; inventoryId: string; bodyMd: string }) {
  // they only write to owner/writer
  await canWriteInventory(params.userId, params.inventoryId)

  const body = String(params.bodyMd ?? '').trim()
  if (!body) throw { status: 400, message: 'bodyMd is required' }

  return prisma.post.create({
    data: {
      inventoryId: params.inventoryId,
      userId: params.userId,
      bodyMd: body,
    },
    select: { id: true, inventoryId: true, bodyMd: true, createdAt: true },
  })
}