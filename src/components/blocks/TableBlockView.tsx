import { useState } from 'react'
import type { TableBlock } from '../../template'
import { TextArea } from '../TextArea'

interface Row {
  key: string
  label: string
  added?: boolean
}

export function TableBlockView({ block }: { block: TableBlock }) {
  const [rows, setRows] = useState<Row[]>(block.rows)
  const [cells, setCells] = useState<Record<string, string>>({})

  const setCell = (rowKey: string, colKey: string, value: string) =>
    setCells((c) => ({ ...c, [`${rowKey}.${colKey}`]: value }))

  const addRow = () =>
    setRows((r) => [...r, { key: `added_${crypto.randomUUID().slice(0, 8)}`, label: '', added: true }])

  const renameRow = (key: string, label: string) =>
    setRows((r) => r.map((row) => (row.key === key ? { ...row, label } : row)))

  const removeRow = (key: string) => setRows((r) => r.filter((row) => row.key !== key))

  return (
    <section className="block block--wide">
      <h2 className="block__label">{block.label}</h2>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" />
              {block.columns.map((col) => (
                <th key={col.key} scope="col">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row">
                  {row.added ? (
                    <div className="table__added">
                      <TextArea
                        value={row.label}
                        onChange={(v) => renameRow(row.key, v)}
                        placeholder="name"
                        aria-label="row name"
                      />
                      <button
                        type="button"
                        className="table__remove muted"
                        onClick={() => removeRow(row.key)}
                        aria-label="remove row"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    row.label
                  )}
                </th>
                {block.columns.map((col) => (
                  <td key={col.key}>
                    <TextArea
                      value={cells[`${row.key}.${col.key}`] ?? ''}
                      onChange={(v) => setCell(row.key, col.key, v)}
                      aria-label={`${row.label || 'row'} ${col.label}`}
                      placeholder="—"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.allowAddRows && (
        <div>
          <button type="button" className="button no-print" onClick={addRow}>
            + add row
          </button>
        </div>
      )}
    </section>
  )
}
