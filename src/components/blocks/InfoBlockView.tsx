import type { InfoBlock } from '../../template'

export function InfoBlockView({ block }: { block: InfoBlock }) {
  return (
    <section className="block">
      <h2 className="block__label">{block.label}</h2>
      <p className="block__text">{block.text}</p>
    </section>
  )
}
