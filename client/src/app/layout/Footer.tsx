import { Box, Typography, Divider, Stack, Button } from '@mui/material'
import { useState } from 'react'
import SupportTicketDialog from '@/features/support-ticket/ui/SupportTicketDialog'
import { useAuth } from '@/app/providers/AuthProvider'

export default function Footer() {
  const [supportOpen, setSupportOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      <Box sx={{ mt: 6 }}>
        <Divider />

        <Box
          sx={{
            py: 3,
            px: 2,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'center', sm: 'center' }}
            spacing={1.5}
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Inventory App. All rights reserved. By Diana S
            </Typography>

            <Button
              variant="text"
              onClick={() => setSupportOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Create support ticket
            </Button>
          </Stack>
        </Box>
      </Box>

      <SupportTicketDialog
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        reportedBy={{
          id: user?.id ?? 'guest',
          name: user?.email ?? 'Guest',
          email: user?.email ?? 'guest@example.com',
        }}
        inventory={null}
        adminEmails={['admin@example.com']}
      />
    </>
  )
}