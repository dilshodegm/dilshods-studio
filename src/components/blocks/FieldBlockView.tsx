import { useId, useState } from 'react'
import type { FieldBlock } from '../../template'
import { TextArea } from '../TextArea'

export function FieldBlockView({ block }: { block: FieldBlock }) {
  const id = useId()
  const [value, setValue] = useState('')
  return (
    <section className={block.wide ? 'block block--wide' : 'block'}>
      <label className="block__label" htmlFor={id}>
        {block.label}
      </label>
      <TextArea id={id} value={value} onChange={setValue} placeholder={block.hint} />
    </section>
  )
}

/** Labelled text area used inside territory and concept blocks. */
export function SubField({ label, hint }: { label: string; hint?: string }) {
  const id = useId()
  const [value, setValue] = useState('')
  return (
    <div className="subfield">
      <label className="block__label" htmlFor={id}>
        {label}
      </label>
      <TextArea id={id} value={value} onChange={setValue} placeholder={hint} />
    </div>
  )
}
