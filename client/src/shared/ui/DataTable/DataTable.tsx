import { Box, type SxProps, type Theme } from '@mui/material'
import {
  DataGrid,
  type GridValidRowModel,
  type GridRowSelectionModel,
} from '@mui/x-data-grid'

import EmptyState from '../EmptyState'
import type { DataTableColDef } from './types'

type Props<R extends GridValidRowModel> = {
  rows: R[]
  columns: Array<DataTableColDef<R>>
  loading?: boolean
  error?: string
  selectionModel?: GridRowSelectionModel
  onSelectionModelChange?: (m: GridRowSelectionModel) => void
  onRowClick?: (row: R) => void
  toolbar?: React.ReactNode
  emptyTitle: string
  emptyDescription?: string
  sx?: SxProps<Theme>
}

export default function DataTable<R extends GridValidRowModel>({
  rows,
  columns,
  loading,
  error,
  selectionModel,
  onSelectionModelChange,
  onRowClick,
  toolbar,
  emptyTitle,
  emptyDescription,
  sx,
}: Props<R>) {
  if (error) {
    return <EmptyState title={error} />
  }

  if (!loading && rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <Box sx={{ width: '100%' }}>
      {toolbar ? <Box sx={{ mb: 2 }}>{toolbar}</Box> : null}

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 720 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(m) => onSelectionModelChange?.(m)}
            onRowClick={(p) => onRowClick?.(p.row as R)}
            autoHeight
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
            sx={[
              {
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'background.paper',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'action.hover',
                  fontWeight: 700,
                },
                '& .MuiDataGrid-cell': {
                  alignItems: 'center',
                },
                '& .MuiDataGrid-row': {
                  cursor: onRowClick ? 'pointer' : 'default',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid',
                  borderColor: 'divider',
                },
              },
              ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
          />
        </Box>
      </Box>
    </Box>
  )
}