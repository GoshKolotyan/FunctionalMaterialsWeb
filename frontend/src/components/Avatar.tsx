import { assetUrl } from '../api/client'
import { initials } from '../team'
import type { Member } from '../types'

export function Avatar({ member, size = 'md' }: { member: Member; size?: 'md' | 'lg' }) {
  const cls = `avatar avatar-${size}`
  if (member.photo) return <img className={cls} src={assetUrl(member.photo)} alt={member.name} loading="lazy" />
  return (
    <div className={`${cls} avatar-fallback`} aria-hidden>
      {initials(member.name)}
    </div>
  )
}
