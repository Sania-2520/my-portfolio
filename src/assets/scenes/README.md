# Scene artwork

Each folder is one scene along the walk. The site picks up whatever images it finds at build time. When a folder has no images, that scene falls back to its SVG illustration, so nothing breaks.

## File naming

```
src/assets/scenes/<scene>/art-<width>.avif
src/assets/scenes/<scene>/art-<width>.webp
```

- `<width>` is the image's pixel width (e.g. `art-1280.avif`). Add several widths and the browser picks the best one for the screen.
- Ship AVIF **and** WebP for each width. (PNG/JPG also work as a last resort.)
- Keep the same aspect ratio across widths of one scene.

## Scenes and recommended sizes

| Folder | Used in | Aspect ratio (current) | Recommended widths |
|---|---|---|---|
| `gate` | Hero background (landscape) | 1672 × 941 (≈16:9) | 828, 1280, 1672, 2400 |
| `gate-portrait` | Hero background (phones / portrait) | 1040 × 941 | 720, 1040, 1560 |
| `map` | Garden Map dialog | 944 × 652 | 944, 1400 |
| `grove` | Curious Grove vignette | 400 × 556 | 400, 800 |
| `cottage` | Gardener's Cottage vignette | 592 × 468 | 592, 1184 |
| `desk` | Cottage Desk banner | 520 × 192 | 520, 1040 |
| `pavilion` | Pavilion vignette | 412 × 468 | 412, 824 |
| `moonlit` | Moonlit Garden vignette | 362 × 464 | 362, 724 |

If you change a scene's aspect ratio, update the matching `width`/`height` props where it's used (search for `name="<scene>"`). For the hero, also update the lantern glow positions (`LANTERNS` in `Hero.tsx`) and `--ar` in `src/index.css` (`.hero-stage`).

## Tips

- Keep the hero's right third (landscape) calm: the title sits there.
- Watercolour art compresses well: AVIF quality 40–55 is usually plenty.
- Quick export with ImageMagick: `magick in.png -resize 1280x art-1280.webp`, plus `avifenc` or Squoosh for AVIF.
