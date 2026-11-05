import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BASE = process.env.VITE_BASE ?? '/'
// Public URL used for canonical / Open Graph tags. Override with VITE_SITE_URL.
process.env.VITE_SITE_URL ??= 'https://sania-kotharkar.vercel.app'

/**
 * Injects <link rel="preload"> for the hero (Garden Gate) artwork so the
 * largest image starts downloading before the JS bundle executes.
 */
function preloadHeroArt(): Plugin {
  return {
    name: 'preload-hero-art',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const files = Object.keys(ctx.bundle)
        const set = (scene: string, ext = 'avif') =>
          files
            .map((f) => ({ f, m: new RegExp(`scenes/${scene}-(\\d+)-[\\w-]+\\.${ext}$`).exec(f) }))
            .filter((x) => x.m)
            .map((x) => ({ f: x.f, w: Number(x.m![1]) }))
            .sort((a, b) => a.w - b.w)
            .map((x) => `${BASE}${x.f} ${x.w}w`)
            .join(', ')
        const wide = set('gate')
        const tall = set('gate-portrait')
        if (!wide) return html
        const tags = [
          `<link rel="preload" as="image" type="image/avif" fetchpriority="high" media="(min-aspect-ratio: 1.0001)" imagesrcset="${wide}" imagesizes="(max-aspect-ratio: 16/9) 178vh, 100vw" />`,
          tall &&
            `<link rel="preload" as="image" type="image/avif" fetchpriority="high" media="(max-aspect-ratio: 1)" imagesrcset="${tall}" imagesizes="max(111vh, 100vw)" />`,
        ].filter(Boolean)
        // Static copy of the hero art behind the boot loader, so the largest paint
        // doesn't wait for JavaScript. Removed once React's hero is in place.
        const boot = `<picture id="boot-hero" aria-hidden="true">
      ${tall ? `<source media="(max-aspect-ratio: 1)" type="image/avif" srcset="${tall}" sizes="max(111vh, 100vw)" />` : ''}
      <source type="image/avif" srcset="${wide}" sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" />
      <img src="${set('gate', 'webp').split(', ').at(-2)?.split(' ')[0] ?? ''}" alt="" width="1672" height="941" fetchpriority="high" />
    </picture>`
        return (
          html
            // Load the main stylesheet without blocking first paint; main.tsx waits for it before rendering.
            .replace(
              /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/,
              '<link rel="preload" as="style" crossorigin href="$1" onload="this.onload=null;this.rel=\'stylesheet\'" data-main-css>\n    <noscript><link rel="stylesheet" href="$1"></noscript>',
            )
            .replace('</title>', `</title>\n    ${tags.join('\n    ')}`)
            .replace('<div id="boot-loader"', `${boot}\n    <div id="boot-loader"`)
        )
      },
    },
  }
}

// Set VITE_BASE=/repo-name/ when deploying to a GitHub Pages project site.
export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), preloadHeroArt()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        assetFileNames: (info) => {
          const orig = info.originalFileNames?.[0] ?? ''
          const m = /scenes\/([\w-]+)\/art-(\d+)\.(avif|webp|png|jpe?g)$/.exec(orig)
          if (m) return `assets/scenes/${m[1]}-${m[2]}-[hash][extname]`
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
