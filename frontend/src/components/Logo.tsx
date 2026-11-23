import { assetUrl } from '../api/client'

/** Official lab mark (perovskite structure, from ichph.am) with the FMG tag. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="logo" aria-hidden>
      <img src={assetUrl('logo.png')} width={size} height={size} alt="" />
      <span className="logo-tag">FMG</span>
    </span>
  )
}
