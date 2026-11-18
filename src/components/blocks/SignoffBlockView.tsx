import { useId, useState } from 'react'
import type { SignoffBlock } from '../../template'

export function SignoffBlockView({ block }: { block: SignoffBlock }) {
  const id = useId()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [approved, setApproved] = useState(false)

  return (
    <section className="block block--wide signoff">
      <h2 className="block__label">{block.label}</h2>
      {block.hint && <p className="muted">{block.hint}</p>}
      <div className="signoff__row">
        <label className="signoff__cell" htmlFor={`${id}-name`}>
          <span className="small-label">client name</span>
          <input
            id={`${id}-name`}
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name, role"
          />
        </label>
        <label className="signoff__cell" htmlFor={`${id}-date`}>
          <span className="small-label">date</span>
          <input
            id={`${id}-date`}
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="check signoff__cell">
          <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} />
          <span>approved</span>
        </label>
      </div>
    </section>
  )
}
