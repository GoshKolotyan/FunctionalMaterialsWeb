import type { SiteInfo } from '../types'
import { Icon } from './Icon'

/** Facebook / LinkedIn buttons; renders nothing if no links are set. */
export function Social({ info, className = '' }: { info: SiteInfo | null; className?: string }) {
  if (!info?.facebook && !info?.linkedin) return null
  return (
    <div className={`social ${className}`}>
      {info.linkedin && (
        <a href={info.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <Icon name="linkedin" size={18} />
        </a>
      )}
      {info.facebook && (
        <a href={info.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
          <Icon name="facebook" size={18} />
        </a>
      )}
    </div>
  )
}
