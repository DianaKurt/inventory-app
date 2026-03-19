export type SupportTicketPriority = 'High' | 'Average' | 'Low'

export type SupportTicketReportedBy = {
  id: string
  name?: string | null
  email: string
}

export type SupportTicketInventory =
  | {
      id?: string | null
      title: string
    }
  | null

export type CreateSupportTicketPayload = {
  summary: string
  priority: SupportTicketPriority
  reportedBy: SupportTicketReportedBy
  inventory: SupportTicketInventory
  link: string
  adminEmails: string[]
  createdAt: string
}

export type CreateSupportTicketResponse = {
  ok: true
  fileName?: string
  uploadedTo?: 'dropbox' | 'onedrive'
}