/**
 * Lightweight Fast Asset Pipeline for Naiya Dhruv Portfolio
 */

// In-memory registry of preloaded asset URLs
const blobUrlMap = new Map<string, string>()
const listeners = new Set<() => void>()

export function getPreloadedAssetUrl(url: string): string {
  return blobUrlMap.get(url) || url
}

export function subscribeToAssetCache(callback: () => void): () => void {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

// Critical videos
export const CRITICAL_VIDEOS = [
  '/scene_1_maya_v2.mp4',
  '/scene_2_maya_v2.mp4',
  '/scene_3_maya_upscale.mp4',
  '/scene_4_maya_v2.mp4',
]

// Audio assets for spatial soundscape
export const CRITICAL_AUDIO = [
  '/ambient_audio.mp3',
  '/scene_1_dialogue.mp3',
  '/scene_2_dialogue.mp3',
  '/scene_3_dialogue.mp3',
  '/scene_4_dialogue.mp3',
]

// Project cover images & brand assets
export const CRITICAL_IMAGES = [
  '/logo_mark_transparent.png',
  '/logo_full_transparent.png',
  '/logo_black.png',
  '/work/ankpal/meta ads/social-visibility.jpg',
  '/work/ankpal/phone-mockup.png',
  '/work/vadiyar/mustard.jpg',
  '/work/pitch/speedair-pitch-deck.jpg',
  '/work/flyers/ankpal-fmcg-flyer-01.jpg',
]

export interface PreloadProgress {
  percent: number
  stage: string
  currentAsset?: string
  isComplete: boolean
}

/**
 * Non-blocking instant preloader helper
 */
export async function runPortfolioPreloader(
  onUpdate?: (state: PreloadProgress) => void
): Promise<void> {
  onUpdate?.({
    percent: 100,
    stage: 'ATELIER READY',
    isComplete: true,
  })
}
