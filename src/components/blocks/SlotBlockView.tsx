import type { SlotBlock } from '../../template'

/** Image placeholder. Uploads to R2 arrive in step 4. */
export function SlotArea({ hint }: { hint?: string }) {
  return (
    <div className="slot" role="img" aria-label={hint ?? 'image slot'}>
      <span className="muted">{hint ?? 'image'}</span>
    </div>
  )
}

export function SlotBlockView({ block }: { block: SlotBlock }) {
  return (
    <section className="block">
      <h2 className="block__label">{block.label}</h2>
      <SlotArea hint={block.hint} />
    </section>
  )
}
