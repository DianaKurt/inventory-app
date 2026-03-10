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

        sx={sx}
      />
    </Box>
  )
}