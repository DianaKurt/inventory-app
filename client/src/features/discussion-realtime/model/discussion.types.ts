export type DiscussionMessage = {
  id: string
  text: string
  createdAt: string
  userId?: string
}

export type DiscussionEventMap = {
  'discussion:message': DiscussionMessage
}
