import raw from '../../template.json'
import type { BlockType, PageRef, Phase, Template } from './types'

export type * from './types'

export const BLOCK_TYPES: readonly BlockType[] = [
  'info',
  'field',
  'signoff',
  'table',
  'checklist',
  'slot',
  'swatch',
  'territory',
  'concept',
]

export const template = raw as unknown as Template

/** Every page in process order. */
export const allPages: PageRef[] = template.phases.flatMap((phase) =>
  phase.pages.map((page) => ({ phase, page, id: `${phase.key}.${page.key}`, number: 0 })),
)
allPages.forEach((ref, i) => (ref.number = i + 1))

export function findPhase(phaseKey: string | undefined): Phase | undefined {
  return template.phases.find((p) => p.key === phaseKey)
}

export function findPage(phaseKey: string | undefined, pageKey: string | undefined) {
  const index = allPages.findIndex((r) => r.phase.key === phaseKey && r.page.key === pageKey)
  if (index < 0) return undefined
  return { current: allPages[index], prev: allPages[index - 1], next: allPages[index + 1] }
}

export function pagePath(ref: Pick<PageRef, 'phase' | 'page'>) {
  return `/${ref.phase.key}/${ref.page.key}`
}

export function phasePath(phase: Phase) {
  return `/${phase.key}`
}

/** `01 discovery` */
export function phaseLabel(phase: Phase) {
  return `${phase.number} ${phase.title.toLowerCase()}`
}

/**
 * Structural checks on the template. Throws in development so a broken key
 * or unknown block type shows up immediately instead of as a blank page.
 */
export function validateTemplate(t: Template): string[] {
  const errors: string[] = []
  const unique = (keys: string[], where: string) => {
    const seen = new Set<string>()
    for (const k of keys) {
      if (seen.has(k)) errors.push(`duplicate key "${k}" in ${where}`)
      seen.add(k)
    }
  }
  unique(
    t.phases.map((p) => p.key),
    'phases',
  )
  for (const phase of t.phases) {
    unique(
      phase.pages.map((p) => p.key),
      phase.key,
    )
    for (const page of phase.pages) {
      const where = `${phase.key}.${page.key}`
      unique(
        page.blocks.map((b) => b.key),
        where,
      )
      for (const block of page.blocks) {
        if (!BLOCK_TYPES.includes(block.type)) {
          errors.push(`unknown block type "${block.type}" in ${where}.${block.key}`)
        }
        if (block.type === 'checklist') {
          unique(
            block.items.map((i) => i.key),
            `${where}.${block.key}`,
          )
        }
        if (block.type === 'swatch' && !page.swatchFields?.length) {
          errors.push(`swatch ${where}.${block.key} but page has no swatchFields`)
        }
      }
    }
  }
  return errors
}

if (import.meta.env.DEV) {
  const errors = validateTemplate(template)
  if (errors.length) throw new Error(`template.json is invalid:\n${errors.join('\n')}`)
}
