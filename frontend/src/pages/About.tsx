import { api } from '../api/client'
import { useData } from '../api/useData'
import { Async } from '../components/Async'
import { ContentPage } from '../components/ContentPage'
import { ResearchCard } from '../components/ResearchCard'

export function About() {
  const research = useData(api.research)
  return (
    <ContentPage slug="about" eyebrow="The project">
      <section className="section section-tint">
        <div className="container">
          <h2 className="rule-heading">Research directions</h2>
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
    </ContentPage>
  )
}
