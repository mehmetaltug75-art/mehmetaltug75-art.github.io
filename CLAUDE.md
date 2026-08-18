# Portfolio site — Mehmet Altuğ Altınışık

Static architecture portfolio. Plain HTML/CSS/JS, no build step, no dependencies.

## Live site

**https://mehmetaltug75-art.github.io** — GitHub Pages, repo `mehmetaltug75-art/mehmetaltug75-art.github.io`
(user site: serves from the `main` branch root, no Actions workflow). Account `mehmetaltug75-art`, already authenticated.

## Deploying a change

```bash
git add -A && git commit -m "..." && GIT_TERMINAL_PROMPT=0 git push
```

Pages rebuilds in about a minute. Confirm it actually shipped by fetching the live file and
grepping for the new value — don't assume:

```bash
curl -s https://mehmetaltug75-art.github.io/css/style.css | grep '<new value>'
```

Portable GitHub CLI (installed without admin) lives at
`C:\Users\Padcashh\Desktop\cloude\.claude\tools\gh\bin\gh.exe`.

## Local preview

Launch config `portfolio` in `C:\Users\Padcashh\Desktop\cloude\.claude\launch.json` runs
`.claude\serve-portfolio.ps1` on port 8322. The script implements HTTP Range requests, which the
videos need in order to stream and seek.

**The running server holds file locks — stop the preview server before editing site files**, or
edits fail with `EPERM`.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Scroll-driven video curtain intro, then the hero with the two nav buttons |
| `about.html` | Bio, education, experience, skills, CV download — content mirrors his 2026 CV |
| `projects.html` | Four project cards; "View Project" links to the booklet PDF (no detail pages yet) |
| `css/style.css` | Everything; mobile rules live in the `max-width: 768px` media query |
| `js/main.js` | Index only — curtain scrub, music toggle |
| `js/pages.js` | Inner pages — scroll reveal, mobile nav, smooth scroll |

## Design

Color scheme "Ink and turquoise":

| Token | Value |
| --- | --- |
| background | `#FBFCFC` |
| alt background | `#F0F4F4` |
| text | `#22262B` |
| accent | `#12A090` |
| accent hover | `#0E8378` (darker) |
| muted | `#71797A` |

Legacy variable names (`--color-orange`, `--color-turquoise`, `--color-purple`) all point at
scheme colors now — the names lie, read the values.

Elements sitting on top of the hero video (music button, curtain scroll hint) are white.

**Mobile hero buttons:** below 768px the hover orb rings are hidden and replaced by stationary
turquoise frosted pill buttons ("About Me" / "Projects") positioned over the character's hands,
via the `left`/`top` percentages on `.hero__orb--left` and `.hero__orb--right`. Mehmet tunes these
by sending marked-up phone screenshots — translate his request into a percentage nudge, remembering
that `top` percentages are relative to `.hero__character` (80% of viewport height on mobile), and
the pill is centered on its coordinates by `translate(-50%, -50%)`.

Desktop keeps the hover rings over the statues in the video.

The `apple-design` skill is installed at `C:\Users\Padcashh\Desktop\cloude\.claude\skills\` and its
principles are applied here: spring easing curves, `:active` press feedback, `prefers-reduced-motion`
and `prefers-reduced-transparency` support, translucent nav material.

## Assets

The hero video was compressed from 72 MB to 1.1 MB with ffmpeg (installed via winget; exe under
`%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_...\bin`). Originals plus duplicate and
unused files are parked in `..\unused-assets\` — nothing there is referenced by the site.

## Environment notes

- Browser-pane **screenshots time out** in this environment. Verify with `read_page`,
  `javascript_tool`, and the console instead.
- PowerShell 5.1 mangles stderr from native executables — use the Bash tool when parsing output
  from ffmpeg, pdftotext, and similar.

## Known / possible next steps

- The statues clip at the screen edges on mobile because the phone shows a vertical slice of a
  16:9 video. A real fix means re-exporting a 9:16 hero video from Blender.
- No per-project detail pages yet; the cards all point at the booklet PDF.
- A custom domain could be pointed at the Pages site if he ever buys one.
