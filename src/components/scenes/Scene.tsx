import type { ReactNode } from 'react'
import { getSceneArt, largest, srcset } from './sceneArt'
import { cn } from '../../lib/cn'

interface SceneProps {
  name: string
  /** Rendered when no artwork exists for this scene. */
  fallback?: ReactNode
  alt?: string
  sizes: string
  className?: string
  imgClassName?: string
  priority?: boolean
  width?: number
  height?: number
}

/**
 * Swappable scene artwork slot: <picture> with AVIF/WebP srcsets from
 * src/assets/scenes/<name>/, or the SVG fallback when no files exist.
 */
export function Scene({
  name,
  fallback = null,
  alt = '',
  sizes,
  className,
  imgClassName,
  priority,
  width,
  height,
}: SceneProps) {
  const art = getSceneArt(name)
  if (!art) return <>{fallback}</>
  const big = largest(art)
  return (
    <picture className={cn('block', className)}>
      {art.avif.length > 0 && <source type="image/avif" srcSet={srcset(art.avif)} sizes={sizes} />}
      {art.webp.length > 0 && <source type="image/webp" srcSet={srcset(art.webp)} sizes={sizes} />}
      <img
        src={big.url}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        className={cn('block h-full w-full', imgClassName)}
      />
    </picture>
  )
}
