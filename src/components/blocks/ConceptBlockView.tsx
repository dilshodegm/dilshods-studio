import type { ConceptBlock } from '../../template'
import { SubField } from './FieldBlockView'
import { SlotArea } from './SlotBlockView'

export function ConceptBlockView({ block }: { block: ConceptBlock }) {
  return (
    <section className="block block--wide concept">
      <h2 className="block__label">{block.label}</h2>
      <div className="concept__body">
        <SlotArea hint={block.slot.hint} />
        <div className="concept__fields">
          {block.fields.map((f) => (
            <SubField key={f.key} label={f.label} hint={f.hint} />
          ))}
        </div>
      </div>
    </section>
  )
}
