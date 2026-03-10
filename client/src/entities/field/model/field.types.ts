export type FieldId = string

export type FieldType = 'singleLine' | 'multiLine' | 'number' | 'boolean' | 'link'

export type Field = {
  id: FieldId
  name: string
  type: FieldType
  order: number
  required: boolean
}
