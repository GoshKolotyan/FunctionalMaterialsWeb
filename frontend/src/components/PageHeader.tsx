import type { ReactNode } from 'react'
import { MoleculeField } from './MoleculeField'

/** Dark warm banner at the top of inner pages. */
export function PageHeader({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: ReactNode }) {
  return (
    <div className="page-header dark-band">
      <MoleculeField />
      <div className="container page-header-inner fade-up">
        {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
      </div>
    </div>
  )
}
