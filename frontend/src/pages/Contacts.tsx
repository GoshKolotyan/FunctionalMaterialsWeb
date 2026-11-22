import { api } from '../api/client'
import { useData } from '../api/useData'
import { ContentPage } from '../components/ContentPage'
import { Icon, type IconName } from '../components/Icon'
import { Social } from '../components/Social'

export function Contacts() {
  const site = useData(api.site)
  const info = site.status === 'ready' ? site.data : null
  const items: [IconName, string, string, string?][] = info
    ? [
        ['pin', 'Address', [info.organization, info.address].filter(Boolean).join(', ')],
        ['mail', 'Email', info.email, info.email && `mailto:${info.email}`],
        ['phone', 'Phone', info.phone, info.phone && `tel:${info.phone.replace(/\s/g, '')}`],
        ['clock', 'Office hours', info.hours],
      ]
    : []
  return (
    <ContentPage slug="contacts" eyebrow="Get in touch">
      <section className="container section">
        <div className="contact-grid">
          {items
            .filter(([, , value]) => value)
            .map(([icon, label, value, href]) => (
              <div key={label} className="card contact-card fade-up">
                <span className="stat-icon">
                  <Icon name={icon} size={22} />
                </span>
                <div>
                  <div className="contact-label">{label}</div>
                  {href ? <a href={href}>{value}</a> : <div>{value}</div>}
                </div>
              </div>
            ))}
        </div>
        {(info?.facebook || info?.linkedin) && (
          <div className="follow">
            <span className="contact-label">Follow us</span>
            <Social info={info} className="social-dark" />
          </div>
        )}
      </section>
    </ContentPage>
  )
}
