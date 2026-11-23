import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { api } from '../api/client'
import { useData } from '../api/useData'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { Social } from './Social'

const NAV = [
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
  { to: '/publications', label: 'Publications' },
  { to: '/products', label: 'Products' },
  { to: '/news', label: 'News' },
  { to: '/contacts', label: 'Contacts' },
]

export function Layout() {
  const site = useData(api.site)
  const info = site.status === 'ready' ? site.data : null
  const name = info?.name ?? 'Functional Materials'
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="shell">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <Logo />
            <span>{name}</span>
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
          <nav className={`nav ${open ? 'nav-open' : ''}`} aria-label="Main">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className={`container footer-grid ${info?.hours ? '' : 'footer-grid-3'}`}>
          <div>
            <div className="brand brand-footer">
              <Logo size={26} />
              <span>{name}</span>
            </div>
            {info?.description && <p className="footer-text">{info.description}</p>}
            <Social info={info} />
          </div>
          <div>
            <h4>Quick links</h4>
            <ul>
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              {info?.organization && <li>{info.organization}</li>}
              {info?.address && <li>{info.address}</li>}
              {info?.email && (
                <li>
                  <a href={`mailto:${info.email}`}>{info.email}</a>
                </li>
              )}
              {info?.phone && <li>{info.phone}</li>}
            </ul>
          </div>
          {info?.hours && (
            <div>
              <h4>Office hours</h4>
              <p className="footer-text">{info.hours}</p>
            </div>
          )}
        </div>
        <div className="container footer-copy">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
