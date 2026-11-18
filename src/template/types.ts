// Shape of template.json. Keys are stable: stored answers reference them.

export interface Tip {
  title: string
  text: string
}

export interface FieldSpec {
  key: string
  label: string
  hint?: string
}

interface BlockBase {
  key: string
  label: string
}

export interface InfoBlock extends BlockBase {
  type: 'info'
  text: string
}

export interface FieldBlock extends BlockBase {
  type: 'field'
  hint?: string
  wide?: boolean
}

export interface SignoffBlock extends BlockBase {
  type: 'signoff'
  hint?: string
}

export interface TableBlock extends BlockBase {
  type: 'table'
  columns: { key: string; label: string }[]
  rows: { key: string; label: string }[]
  allowAddRows?: boolean
}

export interface ChecklistBlock extends BlockBase {
  type: 'checklist'
  items: { key: string; label: string }[]
}

export interface SlotBlock extends BlockBase {
  type: 'slot'
  hint?: string
}

export interface SwatchBlock extends BlockBase {
  type: 'swatch'
}

export interface TerritoryBlock extends BlockBase {
  type: 'territory'
  fields: FieldSpec[]
  moodboard: { hint?: string }
}

export interface ConceptBlock extends BlockBase {
  type: 'concept'
  slot: { hint?: string }
  fields: FieldSpec[]
}

export type Block =
  | InfoBlock
  | FieldBlock
  | SignoffBlock
  | TableBlock
  | ChecklistBlock
  | SlotBlock
  | SwatchBlock
  | TerritoryBlock
  | ConceptBlock

export type BlockType = Block['type']

export interface Page {
  key: string
  code: string
  title: string
  description: string
  tip?: Tip
  optional?: boolean
  exportable?: boolean
  private?: boolean
  swatchFields?: string[]
  blocks: Block[]
}

export interface Phase {
  key: string
  number: string
  title: string
  summary: string
  pages: Page[]
}

export interface Template {
  version: number
  phases: Phase[]
}

/** A page together with its phase and position in the whole process. */
export interface PageRef {
  phase: Phase
  page: Page
  /** `{phase.key}.{page.key}`, the key used in the database. */
  id: string
  /** 1-based position across all phases. */
  number: number
}
