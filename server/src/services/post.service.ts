import { prisma } from '../db'
import { canReadInventory, canWriteInventory } from './access.service'

export async function listPosts(params: { userId: string | null; inventoryId: string }) {
  const inventory = await prisma.inventory.findUnique({
    where: { id: params.inventoryId },
    select: {
      id: true,
      isPublic: true,
    },
  })

  if (!inventory) {
    throw { status: 404, message: 'inventory not found' }
  }

  if (!inventory.isPublic) {
    await canReadInventory(params.userId, params.inventoryId)
  }

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
  const body = String(params.bodyMd ?? '').trim()
  if (!body) throw { status: 400, message: 'bodyMd is required' }

  const inventory = await prisma.inventory.findUnique({
    where: { id: params.inventoryId },
    select: {
      id: true,
      isPublic: true,
    },
  })

  if (!inventory) {
    throw { status: 404, message: 'inventory not found' }
  }

  if (!inventory.isPublic) {
    await canWriteInventory(params.userId, params.inventoryId)
  }

  return prisma.post.create({
    data: {
      inventoryId: params.inventoryId,
      userId: params.userId,
      bodyMd: body,
    },
    select: { id: true, inventoryId: true, bodyMd: true, createdAt: true },
  })
}