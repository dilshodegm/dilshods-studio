import { Link, useParams } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { findPhase, pagePath, phaseLabel, template } from '../template'
import { NotFound } from './NotFound'
import { PageFlags } from './ProcessIndex'

export function PhaseCover() {
  const { phaseKey } = useParams()
  const phase = findPhase(phaseKey)
  if (!phase) return <NotFound />

  const index = template.phases.indexOf(phase)
  const prev = template.phases[index - 1]
  const next = template.phases[index + 1]
  const first = phase.pages[0]

  return (
    <Shell
      left={<Link to="/">dilshod's studio</Link>}
      right={phaseLabel(phase)}
      footer={
        <nav className="shell-footer__nav no-print">
          {prev ? <Link to={`/${prev.key}`}>← {phaseLabel(prev)}</Link> : <span />}
          {first && <Link to={pagePath({ phase, page: first })}>start →</Link>}
          {next && <Link to={`/${next.key}`}>{phaseLabel(next)} →</Link>}
        </nav>
      }
      footerRight={phase.number}
      className="cover"
    >
      <h1 className="cover__title">
        <span>{phase.number}</span>
        <b>{phase.title}</b>
      </h1>
      <div className="cover__bottom">
        <p className="h1 cover__summary">{phase.summary}</p>
        <ul className="stage-list">
          {phase.pages.map((page) => (
            <li key={page.key}>
              <span className="stage-list__code">{page.code}</span>
              <Link to={pagePath({ phase, page })}>{page.title}</Link>
              <PageFlags optional={page.optional} exportable={page.exportable} isPrivate={page.private} />
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  )
}
