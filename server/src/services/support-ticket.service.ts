import { env } from '../env'

export type SupportTicketPayload = {
  summary: string
  priority: 'High' | 'Average' | 'Low'
  reportedBy: {
    id: string
    name?: string | null
    email: string
  }
  inventory?: {
    id?: string | null
    title: string
  } | null
  link: string
  adminEmails: string[]
  createdAt?: string
}

function sanitizeFileNamePart(value: string) {
  return value
    .trim()
    .replace(/[^\w\-]+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 50)
}

function buildTicketJson(payload: SupportTicketPayload) {
  return {
    'Reported by': {
      id: payload.reportedBy.id,
      name: payload.reportedBy.name ?? null,
      email: payload.reportedBy.email,
    },
    Inventory: payload.inventory?.title ?? null,
    Link: payload.link,
    Priority: payload.priority,
    'Admins e-mail addresses': payload.adminEmails,
    Summary: payload.summary,
    CreatedAt: payload.createdAt ?? new Date().toISOString(),
  }
}

export async function createSupportTicket(payload: SupportTicketPayload) {
  const summary = String(payload.summary ?? '').trim()
  if (!summary) {
    throw { status: 400, message: 'summary is required' }
  }

  const priority = payload.priority
  if (!['High', 'Average', 'Low'].includes(priority)) {
    throw { status: 400, message: 'priority must be High, Average, or Low' }
  }

  if (!payload.reportedBy?.email) {
    throw { status: 400, message: 'reportedBy.email is required' }
  }

  if (!Array.isArray(payload.adminEmails) || payload.adminEmails.length === 0) {
    throw { status: 400, message: 'adminEmails must be a non-empty array' }
  }

  if (!env.DROPBOX_ACCESS_TOKEN) {
    throw { status: 500, message: 'DROPBOX_ACCESS_TOKEN is not configured' }
  }

  const now = new Date()
  const iso = now.toISOString()
  const safePriority = sanitizeFileNamePart(priority)
  const safeUser = sanitizeFileNamePart(payload.reportedBy.email)
  const safeDate = iso.replace(/[:.]/g, '-')
  const fileName = `support-ticket_${safePriority}_${safeUser}_${safeDate}.json`

  const basePath = env.DROPBOX_SUPPORT_TICKETS_PATH || '/support-tickets'
  const dropboxPath = `${basePath.replace(/\/+$/, '')}/${fileName}`

  const jsonBody = JSON.stringify(buildTicketJson({ ...payload, createdAt: iso }), null, 2)

  const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.DROPBOX_ACCESS_TOKEN}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: dropboxPath,
        mode: 'add',
        autorename: true,
        mute: false,
        strict_conflict: false,
      }),
    },
    body: jsonBody,
  })

  if (!response.ok) {
    const text = await response.text()
    throw {
      status: 502,
      message: 'Failed to upload support ticket to Dropbox',
      details: text,
    }
  }

  const uploaded = await response.json()

  return {
    ok: true,
    uploadedTo: 'dropbox' as const,
    fileName: uploaded.name ?? fileName,
    path: uploaded.path_display ?? dropboxPath,
  }
}