import type { TerritoryBlock } from '../../template'
import { SubField } from './FieldBlockView'

// Placeholder tile heights so the empty board already reads as a masonry grid.
const PLACEHOLDER_TILES = [220, 140, 300, 180, 160, 260]

export function TerritoryBlockView({ block }: { block: TerritoryBlock }) {
  return (
    <section className="block block--wide territory">
      <div className="territory__fields">
        {block.fields.map((f) => (
          <SubField key={f.key} label={f.label} hint={f.hint} />
        ))}
      </div>
      <div className="moodboard" aria-label={`${block.label} moodboard`}>
        {PLACEHOLDER_TILES.map((h, i) => (
          <div key={i} className="moodboard__tile moodboard__tile--empty" style={{ height: h }}>
            {i === 0 && <span className="muted">{block.moodboard.hint ?? 'moodboard'}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}
