import { useState } from 'react'
import type { ChecklistBlock } from '../../template'

export function ChecklistBlockView({ block }: { block: ChecklistBlock }) {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const count = block.items.filter((i) => done[i.key]).length

  return (
    <section className="block">
      <h2 className="block__label block__label--split">
        <span>{block.label}</span>
        <span className="muted">
          {count}/{block.items.length}
        </span>
      </h2>
      <ul className="checklist">
        {block.items.map((item) => (
          <li key={item.key}>
            <label className="check">
              <input
                type="checkbox"
                checked={!!done[item.key]}
                onChange={(e) => setDone((d) => ({ ...d, [item.key]: e.target.checked }))}
              />
              <span>{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
