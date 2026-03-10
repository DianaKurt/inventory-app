import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import { useAuth} from '@/app/providers/AuthProvider'
import RealtimeBridge from '@/features/discussion-realtime/ui/RealtimeBridge'

export default function RootLayout() {
  const { isAuthed } = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {isAuthed && <RealtimeBridge />}

      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}
