# Nature Sounds: optional recorded loops

The garden's soundscape is synthesized live with the Web Audio API, so **all five channels work with no files at all**. Add recordings here only if you want richer, real-world sound.

## How to add a loop

1. Put the file in this folder (MP3 or OGG, seamless loop, 30–90 s, mono or stereo, ~96–128 kbps).
2. List it in `manifest.json`:

```json
{
  "files": {
    "birds": "birds.mp3",
    "wind": "wind.mp3",
    "water": "water-stream.mp3",
    "fountain": "fountain.mp3",
    "night": "night-ambience.mp3"
  }
}
```

Only listed channels switch to the recording; the rest stay synthesized. Howler is downloaded only when at least one file is listed. Nothing ever autoplays: sound starts when a visitor turns it on.

## Expected channels

| Key | Slider label | Suggested search terms |
|---|---|---|
| `birds` | Birds | "morning birdsong loop", "garden birds ambience" |
| `wind` | Wind | "gentle wind leaves loop" |
| `water` | Water Stream | "small creek stream loop" |
| `fountain` | Fountain | "garden fountain loop" |
| `night` | Night Ambience | "crickets night ambience loop" |

## Good royalty-free sources

- **Pixabay Sound Effects:** free for commercial use, no attribution required.
- **Freesound.org:** filter by the CC0 license to avoid attribution requirements.
- **Mixkit:** free sound effects under the Mixkit license.
- **BBC Sound Effects (RemArc licence):** personal/educational use only; check before using on a public portfolio.

Always check each file's license before publishing.
