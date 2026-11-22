import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="container section not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>
        <Link to="/" className="btn btn-primary">
          Back to the home page
        </Link>
      </p>
    </div>
  )
}
