import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell'

export function NotFound() {
  return (
    <Shell left={<Link to="/">dilshod's studio</Link>} right="404">
      <div className="process__intro">
        <h1 className="h1">not found</h1>
        <p className="muted">
          This page is not in the template. <Link to="/">Back to the process.</Link>
        </p>
      </div>
    </Shell>
  )
}
