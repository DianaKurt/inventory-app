import { apiPost } from '@/shared/api/http'
import type {
  CreateSupportTicketPayload,
  CreateSupportTicketResponse,
} from '../model/support-ticket.types'

export function createSupportTicket(payload: CreateSupportTicketPayload) {
  return apiPost<CreateSupportTicketResponse>('/support-tickets', payload)
}