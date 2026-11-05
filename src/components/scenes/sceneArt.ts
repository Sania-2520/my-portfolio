/**
 * Scene artwork registry.
 *
 * Drop images into src/assets/scenes/<scene>/art-<width>.avif|webp and they are
 * picked up automatically (see src/assets/scenes/README.md). Scenes without
 * images fall back to their SVG illustration.
 */
const files = import.meta.glob('../../assets/scenes/*/art-*.{avif,webp,png,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export interface SceneSource {
  avif: { url: string; w: number }[]
  webp: { url: string; w: number }[]
  fallback: { url: string; w: number }[]
}

const registry: Record<string, SceneSource> = {}
for (const [path, url] of Object.entries(files)) {
  const m = /scenes\/([\w-]+)\/art-(\d+)\.(avif|webp|png|jpe?g)$/.exec(path)
  if (!m) continue
  const [, scene, w, ext] = m
  const entry = (registry[scene] ??= { avif: [], webp: [], fallback: [] })
  const bucket = ext === 'avif' ? entry.avif : ext === 'webp' ? entry.webp : entry.fallback
  bucket.push({ url, w: Number(w) })
}
for (const e of Object.values(registry)) {
  e.avif.sort((a, b) => a.w - b.w)
  e.webp.sort((a, b) => a.w - b.w)
  e.fallback.sort((a, b) => a.w - b.w)
}

export function getSceneArt(scene: string): SceneSource | null {
  const e = registry[scene]
  return e && (e.avif.length || e.webp.length || e.fallback.length) ? e : null
}

export const srcset = (list: { url: string; w: number }[]) => list.map((x) => `${x.url} ${x.w}w`).join(', ')
export const largest = (e: SceneSource) => (e.webp.at(-1) ?? e.fallback.at(-1) ?? e.avif.at(-1))!
