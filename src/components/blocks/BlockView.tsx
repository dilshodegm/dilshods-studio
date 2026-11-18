import type { Block, Page } from '../../template'
import { ChecklistBlockView } from './ChecklistBlockView'
import { ConceptBlockView } from './ConceptBlockView'
import { FieldBlockView } from './FieldBlockView'
import { InfoBlockView } from './InfoBlockView'
import { SignoffBlockView } from './SignoffBlockView'
import { SlotBlockView } from './SlotBlockView'
import { SwatchBlockView } from './SwatchBlockView'
import { TableBlockView } from './TableBlockView'
import { TerritoryBlockView } from './TerritoryBlockView'

export function BlockView({ block, page }: { block: Block; page: Page }) {
  switch (block.type) {
    case 'info':
      return <InfoBlockView block={block} />
    case 'field':
      return <FieldBlockView block={block} />
    case 'signoff':
      return <SignoffBlockView block={block} />
    case 'table':
      return <TableBlockView block={block} />
    case 'checklist':
      return <ChecklistBlockView block={block} />
    case 'slot':
      return <SlotBlockView block={block} />
    case 'swatch':
      return <SwatchBlockView block={block} fields={page.swatchFields ?? []} />
    case 'territory':
      return <TerritoryBlockView block={block} />
    case 'concept':
      return <ConceptBlockView block={block} />
    default: {
      const unknown: never = block
      return <pre className="block">unknown block {JSON.stringify(unknown)}</pre>
    }
  }
}
