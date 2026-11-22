import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useData } from '../api/useData'
import { Async } from '../components/Async'
import { CountUp } from '../components/CountUp'
import { Icon, type IconName } from '../components/Icon'
import { MoleculeField } from '../components/MoleculeField'
import { NewsCard } from '../components/NewsCard'
import { PublicationItem } from '../components/PublicationItem'
import { ResearchCard } from '../components/ResearchCard'
import { memberSurnames } from '../team'

function Stat({ icon, value, label }: { icon: IconName; value: number; label: string }) {
  return (
    <div className="stat">
      <span className="stat-icon">
        <Icon name={icon} size={26} />
      </span>
      <span className="stat-value">
        <CountUp value={value} />
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export function Home() {
  const site = useData(api.site)
  const page = useData(() => api.page('home'))
  const team = useData(api.team)
  const research = useData(api.research)
  const pubs = useData(api.publications)
  const news = useData(api.news)

  const ready =
    team.status === 'ready' && research.status === 'ready' && pubs.status === 'ready'

  return (
    <>
      <section className="hero dark-band">
        <MoleculeField />
        <div className="container hero-inner">
          <Async state={page}>
            {(p) => (
              <div className="hero-text fade-up">
                {site.status === 'ready' && site.data.tagline && (
                  <p className="eyebrow eyebrow-light">{site.data.tagline}</p>
                )}
                <h1>{p.title}</h1>
                {p.lead && <p className="hero-lead">{p.lead}</p>}
                <div className="hero-actions">
                  <Link to="/about" className="btn btn-primary">
                    Our research <Icon name="arrow" size={18} />
                  </Link>
                  <Link to="/team" className="btn btn-outline-light">
                    Meet the team
                  </Link>
                </div>
              </div>
            )}
          </Async>
        </div>
      </section>

      {ready && (
        <section className="stats-band">
          <div className="container stats">
            <Stat
              icon="users"
              value={team.data.filter((m) => m.group !== 'alumni').length}
              label="Team members"
            />
            <Stat icon="book" value={pubs.data.length} label="Publications" />
            <Stat icon="flask" value={research.data.length} label="Research directions" />
          </div>
        </section>
      )}

      <section className="section section-tint">
        <div className="container">
          <div className="section-intro fade-up">
            <h2>Research directions</h2>
            <p>A closed loop: machine learning predicts, DFT verifies, the lab synthesizes — and the results retrain the models.</p>
          </div>
          <Async state={research}>
            {(items) => (
              <div className="research-grid">
                {items.map((r, i) => (
                  <ResearchCard key={r.id} r={r} index={i} />
                ))}
              </div>
            )}
          </Async>
        </div>
      </section>

      {ready && pubs.data.some((p) => p.featured) && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Featured publications</h2>
              <Link to="/publications" className="link-arrow">
                All publications <Icon name="arrow" size={16} />
              </Link>
            </div>
            <ul className="pubs">
              {pubs.data
                .filter((p) => p.featured)
                .slice(0, 3)
                .map((p) => (
                  <PublicationItem key={p.id} p={p} highlight={memberSurnames(team.data)} />
                ))}
            </ul>
          </div>
        </section>
      )}

      {news.status === 'ready' && news.data.length > 0 && (
      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <h2>Latest news</h2>
            <Link to="/news" className="link-arrow">
              All news <Icon name="arrow" size={16} />
            </Link>
          </div>
          <Async state={news}>
            {(items) => (
              <div className="news-grid">
                {items.slice(0, 3).map((n) => (
                  <NewsCard key={n.id} n={n} />
                ))}
              </div>
            )}
          </Async>
        </div>
      </section>
      )}

      <section className="cta dark-band">
        <div className="container cta-inner">
          <div>
            <h2>Interested in working with us?</h2>
            <p>We welcome collaborations, visiting researchers and motivated students.</p>
          </div>
          <Link to="/contacts" className="btn btn-primary">
            Get in touch <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
