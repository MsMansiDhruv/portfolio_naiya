import { NaiyaDhruvLogo } from './NaiyaDhruvLogo'

export type LogoGoldProps = {
  size?: number
  className?: string
}

/**
 * LogoGold - Official 100% Vector Gold Monogram for Naiya Dhruv.
 * Interlocking 'ND' ribbon mark with molten gold gradient and ambient glow.
 */
export function LogoGold({ size = 44, className = '' }: LogoGoldProps) {
  return <NaiyaDhruvLogo size={size} className={className} />
}

export default LogoGold
