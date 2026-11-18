import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { allPages, pagePath, phaseLabel, phasePath, template } from '../template'

export function ProcessIndex() {
  return (
    <Shell left="dilshod's studio" right={`template v${template.version}`} footerRight={`${allPages.length} pages`}>
      <div className="process">
        <div className="process__intro">
          <h1 className="h1">brand design process</h1>
          <p className="muted">
            Four phases from the first call to handover. Projects with saved answers arrive in step 3; for now this
            is the template itself.
          </p>
        </div>
        <div className="process__phases">
          {template.phases.map((phase) => (
            <section key={phase.key} className="process__phase">
              <Link className="process__phase-title" to={phasePath(phase)}>
                {phaseLabel(phase)}
              </Link>
              <p className="muted">{phase.summary}</p>
              <ul className="stage-list">
                {phase.pages.map((page) => (
                  <li key={page.key}>
                    <span className="stage-list__code">{page.code}</span>
                    <Link to={pagePath({ phase, page })}>{page.title}</Link>
                    <PageFlags optional={page.optional} exportable={page.exportable} isPrivate={page.private} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Shell>
  )
}

export function PageFlags(props: { optional?: boolean; exportable?: boolean; isPrivate?: boolean }) {
  const flags = [props.optional && 'optional', props.exportable && 'sign', props.isPrivate && 'private'].filter(
    Boolean,
  )
  if (!flags.length) return null
  return <span className="stage-list__flags">{flags.join(' · ')}</span>
}
