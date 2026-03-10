import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Chip, alpha, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import DataTable from '@/shared/ui/DataTable/DataTable'
import type { DataTableColDef, DataTableSelection } from '@/shared/ui/DataTable/types'
import {
  apiAdminGetUsers,
  apiBlockUser,
  apiUnblockUser,
  apiMakeAdmin,
  apiRemoveAdmin,
  apiDeleteUser,
} from '@/entities/admin/api/admin.api'
import UserActionsToolbar from './UserActionsToolbar'

type UserRow = {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  blocked: boolean
}

export default function UsersTable() {
  const { t } = useTranslation('common')
  const [selection, setSelection] = useState<DataTableSelection>([])
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: apiAdminGetUsers,
  })

  const blockMutation = useMutation({
    mutationFn: apiBlockUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const unblockMutation = useMutation({
    mutationFn: apiUnblockUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const makeAdminMutation = useMutation({
    mutationFn: apiMakeAdmin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const removeAdminMutation = useMutation({
    mutationFn: apiRemoveAdmin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: apiDeleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const rows: UserRow[] = useMemo(() => {
    return (data?.items ?? []).map((u) => ({
      id: u.id,
      name: u.name ?? '—',
      email: u.email,
      role: u.role,
      blocked: u.blocked,
    }))
  }, [data])

  const columns: Array<DataTableColDef<UserRow>> = useMemo(
    () => [
      { field: 'name', headerName: t('usersTable.name'), flex: 1, minWidth: 160 },
      { field: 'email', headerName: t('usersTable.email'), flex: 1, minWidth: 220 },
      {
        field: 'role',
        headerName: t('usersTable.role'),
        width: 120,
        renderCell: ({ value }) => (
          <Chip
            label={value}
            size="small"
            color={value === 'ADMIN' ? 'secondary' : 'default'}
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: 'blocked',
        headerName: t('usersTable.status'),
        width: 120,
        renderCell: ({ value }) => (
          <Chip
            label={value ? t('usersTable.blocked') : t('usersTable.active')}
            size="small"
            color={value ? 'error' : 'success'}
            sx={{ fontWeight: 600 }}
          />
        ),
      },
    ],
    [t],
  )

  const toolbar = (
    <Box
      sx={(theme) => ({
        p: 1.5,
        mb: 1.5,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
        background: alpha(theme.palette.background.default, 0.6),
      })}
    >
      <UserActionsToolbar
        selection={selection}
        onClear={() => setSelection([])}
        onBlock={() => selection.forEach((id) => blockMutation.mutate(String(id)))}
        onUnblock={() => selection.forEach((id) => unblockMutation.mutate(String(id)))}
        onMakeAdmin={() => selection.forEach((id) => makeAdminMutation.mutate(String(id)))}
        onRemoveAdmin={() => selection.forEach((id) => removeAdminMutation.mutate(String(id)))}
        onDelete={() => selection.forEach((id) => deleteMutation.mutate(String(id)))}
      />
    </Box>
  )

  return (
    <DataTable<UserRow>
      rows={rows}
      columns={columns}
      loading={isLoading}
      error={isError ? t('usersTable.failedToLoad') : undefined}
      selectionModel={selection}
      onSelectionModelChange={(m) => setSelection(m)}
      toolbar={toolbar}
      emptyTitle={t('usersTable.emptyTitle')}
      emptyDescription={t('usersTable.emptyDescription')}
      sx={{
        '& .MuiDataGrid-row:hover': {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
        },
      }}
    />
  )
}