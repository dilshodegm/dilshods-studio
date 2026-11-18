import { useId, useState } from 'react'
import type { SwatchBlock } from '../../template'

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

function normalizeHex(value: string): string | null {
  const v = value.trim()
  if (!HEX.test(v)) return null
  return v.startsWith('#') ? v : `#${v}`
}

export function SwatchBlockView({ block, fields }: { block: SwatchBlock; fields: string[] }) {
  const id = useId()
  const [values, setValues] = useState<Record<string, string>>({})
  const hex = normalizeHex(values.hex ?? '')

  return (
    <section className="block swatch">
      <h2 className="block__label">{block.label}</h2>
      <div
        className={hex ? 'swatch__chip' : 'swatch__chip swatch__chip--empty'}
        style={hex ? { background: hex } : undefined}
        aria-hidden
      />
      <dl className="swatch__fields">
        {fields.map((f) => (
          <div key={f} className="swatch__field">
            <dt>
              <label className="small-label" htmlFor={`${id}-${f}`}>
                {f}
              </label>
            </dt>
            <dd>
              <input
                id={`${id}-${f}`}
                className="input"
                value={values[f] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
                placeholder="—"
                spellCheck={false}
              />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
