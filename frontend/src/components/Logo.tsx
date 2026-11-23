import { assetUrl } from '../api/client'

/** Official lab mark (perovskite structure), from ichph.am. */
export function Logo({ size = 32 }: { size?: number }) {
  return <img src={assetUrl('logo.png')} width={size} height={size} alt="" className="logo" />
}
