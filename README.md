# 🕹️ Retro Arcade — PAC-MAN

A fully browser-based, zero-dependency Pac-Man built from scratch with vanilla HTML, CSS, and JavaScript.

```
 ██████╗  █████╗  ██████╗    ███╗   ███╗ █████╗ ███╗   ██╗
 ██╔══██╗██╔══██╗██╔════╝    ████╗ ████║██╔══██╗████╗  ██║
 ██████╔╝███████║██║         ██╔████╔██║███████║██╔██╗ ██║
 ██╔═══╝ ██╔══██║██║         ██║╚██╔╝██║██╔══██║██║╚██╗██║
 ██║     ██║  ██║╚██████╗    ██║ ╚═╝ ██║██║  ██║██║ ╚████║
 ╚═╝     ╚═╝  ╚═╝ ╚═════╝   ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
```

```
╔══════════════════════════════════╗
║  ····················· ·········║   🏆 LEADERBOARD
║  · ┌────┐ · ┌──────┐ · ┌────┐ ·║   ──────────────────
║  · │    │ · │      │ · │    │ ·║   🥇 OMAR      9,820
║  ··└────┘ · └──────┘ · └────┘ ·║   🥈 PLAYER2   7,440
║  ···· 👻 ·  · 👻 · · 👻 ·· ···║   🥉 GHOST     4,200
║  ·····  ╔══════════╗  ·········║
║  ·····  ║  👻 👻   ║  ·········║
║  ·····  ║    👻    ║  ·········║   SCORE   LEVEL  LIVES
║  ·····  ╚══════════╝  ·········║   9,820     3    ●●●
║  ···· C ·················· ····║
║  ····    ····· Ⓒ ·····    ····║        ← ↑ → ↓
║  ································║
╚══════════════════════════════════╝
```

---

## Features

- **Classic Pac-Man gameplay** — 28×31 tile maze, dots, power pellets, lives, and level progression
- **4 ghosts with authentic AI** — Blinky chases directly, Pinky targets 4 tiles ahead, Inky uses a vector trick off Blinky, Clyde retreats when close
- **Scatter / Chase cycles** — ghosts alternate between targeting their corner and hunting Pac-Man, just like the arcade original
- **Frightened mode** — eat a power pellet to turn ghosts blue; they flash white before the timer expires
- **Ghost eat scoring** — 200 → 400 → 800 → 1600 points per ghost chain in a single power-up
- **Persistent leaderboard** — top 10 scores saved in `localStorage`, highlighted for your current session username
- **Username prompt** — enter your name before every session; scores are tracked per player
- **Level progression** — each level clear awards a bonus and increases ghost speed
- **Light & dark mode** — toggle with the ☀️ / 🌙 button; preference is saved across sessions

---

## Getting Started

No build step, no dependencies — just open the file.

```bash
git clone https://github.com/omar-coderabbitai/retro-arcade.git
cd retro-arcade
open index.html        # macOS
# or: xdg-open index.html   (Linux)
# or: start index.html      (Windows)
```

Or serve it locally for a cleaner experience:

```bash
npx serve .
# then visit http://localhost:3000
```

---

## Controls

| Key | Action |
|-----|--------|
| `↑` `↓` `←` `→` | Move Pac-Man |
| `W` `A` `S` `D` | Move Pac-Man (alternative) |
| `P` | Pause / Resume |
| `R` | Restart |

---

## Scoring

| Event | Points |
|-------|--------|
| Dot | 10 |
| Power Pellet | 50 |
| Ghost (1st) | 200 |
| Ghost (2nd) | 400 |
| Ghost (3rd) | 800 |
| Ghost (4th) | 1,600 |
| Level Clear | 1,000 × level |

---

## Tech Stack

| Layer | Details |
|-------|---------|
| Rendering | HTML5 Canvas API |
| Styling | CSS custom properties, light/dark themes |
| State | Vanilla JS, no frameworks |
| Persistence | `localStorage` (leaderboard + theme) |
| Build | None — static files only |

---

## Project Structure

```
retro-arcade/
├── index.html        # App shell, username modal, leaderboard sidebar
├── style.css         # Full UI with CSS variables for light/dark theming
├── game.js           # Game engine: maze, movement, ghost AI, rendering
└── .coderabbit.yaml  # CodeRabbit review configuration
```

---

## Ghost Personalities

| Ghost | Colour | Nickname | Behaviour |
|-------|--------|----------|-----------|
| Blinky | 🔴 Red | Shadow | Directly chases Pac-Man at all times |
| Pinky | 🩷 Pink | Speedy | Targets 4 tiles ahead of Pac-Man |
| Inky | 🩵 Cyan | Bashful | Uses a vector based on Blinky's position |
| Clyde | 🟠 Orange | Pokey | Chases when far away, retreats when close |

---

<p align="center">Made with ❤️ — Insert Coin to Continue</p>
