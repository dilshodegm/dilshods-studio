import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  left: ReactNode
  right?: ReactNode
  footer?: ReactNode
  footerRight?: ReactNode
  children: ReactNode
  className?: string
}

/** Header / content / footer frame, same on every screen (1920×1080 Figma frame). */
export function Shell({ left, right, footer, footerRight, children, className }: Props) {
  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-header__phase">{left}</div>
        <div className="shell-header__page">{right}</div>
      </header>
      <main className={className}>{children}</main>
      <footer className="shell-footer">
        <Link to="/">brand design process</Link>
        {footer}
        <span>{footerRight}</span>
      </footer>
    </div>
  )
}
