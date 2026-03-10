import type { Field } from './field.types'

export function validateFieldName(name: string): boolean {
  return name.trim().length > 0 && name.length <= 100
}

export function validateField(field: Field): boolean {
  return validateFieldName(field.name)
}
