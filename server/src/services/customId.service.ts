import { prisma } from '../db'

type FormatPart =
  | { kind: 'text'; value: string }
  | { kind: 'seq'; pad?: number }
  | { kind: 'rand'; len?: number }

function padLeft(n: number, width: number) {
  const s = String(n)
  return s.length >= width ? s : '0'.repeat(width - s.length) + s
}

function randDigits(len: number) {
  let out = ''
  for (let i = 0; i < len; i++) out += String(Math.floor(Math.random() * 10))
  return out
}

export function previewCustomId(format: FormatPart[], seq: number) {
  return format
    .map((p) => {
      if (p.kind === 'text') return p.value
      if (p.kind === 'seq') return padLeft(seq, p.pad ?? 4)
      if (p.kind === 'rand') return randDigits(p.len ?? 6)
      return ''
    })
    .join('')
}


export async function generateAndReserveCustomId(params: {
  inventoryId: string
  attempts?: number
}) {
  const attempts = params.attempts ?? 5

  for (let i = 0; i < attempts; i++) {
    const out = await prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.findUnique({
        where: { id: params.inventoryId },
        select: { id: true, customIdFormat: true, customIdSeq: true },
      })
      if (!inv) throw { status: 404, message: 'Inventory not found' }

      const format = (inv.customIdFormat ?? []) as any as FormatPart[]
      const seq = inv.customIdSeq

      const customId = previewCustomId(format, seq)

      await tx.inventory.update({
        where: { id: params.inventoryId },
        data: { customIdSeq: { increment: 1 } },
      })

      return { customId }
    })

    // We catch the conflict in CreateItem
    return out.customId
  }

  throw { status: 500, message: 'Failed to generate customId' }
}