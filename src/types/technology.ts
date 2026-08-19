export type TechnologyType =
  | 'LANGUAGE'
  | 'FRAMEWORK'
  | 'DATABASE'
  | 'CLOUD'
  | 'PLATFORM'
  | 'TOOL'

export interface TechnologyOption {
  id: number
  code: string
  nameVi: string
  nameEn: string
  type: TechnologyType
  active: boolean
}
