import type {
  GridColDef,
  GridRowId,
  GridRowSelectionModel,
  GridValidRowModel,
} from '@mui/x-data-grid'

export type DataTableColDef<R extends GridValidRowModel = GridValidRowModel> = GridColDef<R>
export type DataTableRowId = GridRowId
export type DataTableSelection = GridRowSelectionModel
export type DataTableRowModel = GridValidRowModel
