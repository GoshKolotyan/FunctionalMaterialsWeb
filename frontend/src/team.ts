import type { Member, MemberGroup } from './types'

export const GROUP_LABELS: Record<MemberGroup, string> = {
  pi: 'Lab head',
  staff: 'Researchers',
  postdoc: 'Postdocs',
  phd: 'PhD students',
  student: 'Students',
  assistant: 'Laboratory assistants',
  alumni: 'Alumni',
}

export const GROUP_ORDER: MemberGroup[] = ['pi', 'staff', 'postdoc', 'phd', 'student', 'assistant', 'alumni']

export function initials(name: string) {
  const words = (name.match(/\p{L}+/gu) ?? []).filter((w) => !/^(dr|prof)$/i.test(w))
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

/** Surnames of current and former members, used to highlight them in author lists. */
export function memberSurnames(team: Member[]): Set<string> {
  return new Set(team.map((m) => m.name.trim().split(/\s+/).at(-1)!.toLowerCase()))
}

/** True if an author string ("Kaviani S.", "A. Asatryan", "Asatryan A.V.") contains a team surname. */
export function isMember(author: string, surnames: Set<string>): boolean {
  return (author.match(/\p{L}{2,}/gu) ?? []).some((w) => surnames.has(w.toLowerCase()))
}
