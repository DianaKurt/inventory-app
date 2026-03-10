import { useEffect } from 'react'
import { createMockRealtimeClient } from '../api/discussion.socket'

const client = createMockRealtimeClient()

export default function RealtimeBridge() {
  useEffect(() => {
    client.connect()
    return () => client.disconnect()
  }, [])

  return null
}
