import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BlockView } from '../components/blocks/BlockView'
import { Shell } from '../components/Shell'
import { findPage, pagePath, phaseLabel, phasePath, type PageRef } from '../template'
import { NotFound } from './NotFound'

export function PageScreen() {
  const { phaseKey, pageKey } = useParams()
  const found = findPage(phaseKey, pageKey)
  if (!found) return <NotFound />
  // key resets local (unsaved) state when moving between pages
  return <PageContent key={found.current.id} {...found} />
}

function PageContent({ current, prev, next }: { current: PageRef; prev?: PageRef; next?: PageRef }) {
  const { phase, page } = current
  const [skipped, setSkipped] = useState(false)

  useEffect(() => {
    document.title = `${page.code} ${page.title} · dilshod's studio`
    window.scrollTo(0, 0)
  }, [page])

  return (
    <Shell
      left={<Link to={phasePath(phase)}>{phaseLabel(phase)}</Link>}
      right={
        <>
          {page.private && <span className="tag">private</span>}
          <span>
            {page.code} {page.title}
          </span>
        </>
      }
      footer={
        <nav className="shell-footer__nav no-print">
          <NavLink target={prev} dir="prev" />
          <NavLink target={next} dir="next" />
        </nav>
      }
      footerRight={String(current.number).padStart(2, '0')}
    >
      <div className={skipped ? 'page-body page-body--skipped' : 'page-body'}>
        <aside className="page-aside">
          <h1 className="h1 page-aside__title">{page.title}</h1>
          <p className="page-aside__description">{page.description}</p>
          {(page.optional || page.exportable) && (
            <div className="page-aside__actions no-print">
              {page.optional && (
                <button
                  type="button"
                  className="button"
                  aria-pressed={skipped}
                  onClick={() => setSkipped((s) => !s)}
                >
                  {skipped ? 'skipped' : 'skip'}
                </button>
              )}
              {page.exportable && (
                <button type="button" className="button" onClick={() => window.print()}>
                  print / pdf
                </button>
              )}
            </div>
          )}
          {page.tip && (
            <div className="tip">
              <p className="tip__title">{page.tip.title}</p>
              <p>{page.tip.text}</p>
            </div>
          )}
        </aside>
        <div className="blocks">
          {page.blocks.map((block) => (
            <BlockView key={block.key} block={block} page={page} />
          ))}
        </div>
      </div>
    </Shell>
  )
}

function NavLink({ target, dir }: { target?: PageRef; dir: 'prev' | 'next' }) {
  if (!target) return <span />
  const label = `${target.page.code} ${target.page.title}`
  return <Link to={pagePath(target)}>{dir === 'prev' ? `← ${label}` : `${label} →`}</Link>
}
