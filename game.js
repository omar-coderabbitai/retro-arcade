'use strict';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const CELL  = 20;   // px per tile
const COLS  = 28;
const ROWS  = 31;
const W     = COLS * CELL;  // 560
const H     = ROWS * CELL;  // 620

const DIRS = {
  ArrowUp:    { x: 0, y: -1 }, w: { x: 0, y: -1 },
  ArrowDown:  { x: 0,  y: 1 }, s: { x: 0,  y: 1 },
  ArrowLeft:  { x: -1, y: 0 }, a: { x: -1, y: 0 },
  ArrowRight: { x: 1,  y: 0 }, d: { x: 1,  y: 0 },
};

// Tile types
const T = { WALL: 0, DOT: 1, POWER: 2, EMPTY: 3, GHOST_HOUSE: 4, TUNNEL: 5 };

// Ghost colors
const GHOST_COLORS = ['#FF0000','#FFB8FF','#00FFFF','#FFB852'];
const GHOST_NAMES  = ['Blinky','Pinky','Inky','Clyde'];

// Classic-ish 28×31 Pac-Man map
// 0=wall 1=dot 2=power 3=empty 4=ghost-house 5=tunnel-space
const BASE_MAP = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,0,0,0,4,4,0,0,0,3,0,0,1,0,0,0,0,0,0],
  [5,5,5,5,5,5,1,3,3,3,0,4,4,4,4,4,4,0,3,3,3,1,5,5,5,5,5,5],
  [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,2,1,1,0,0,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,0,0,1,1,2,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,3,3,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,3,3,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,3,3,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,1,3,3,1,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,1,3,3,1,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
];

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
const LB_KEY = 'pacman_leaderboard_v1';

function loadLeaderboard() {
  try { return JSON.parse(localStorage.getItem(LB_KEY)) || []; }
  catch { return []; }
}

function saveLeaderboard(entries) {
  localStorage.setItem(LB_KEY, JSON.stringify(entries));
}

function addScore(name, score) {
  const entries = loadLeaderboard();
  const existing = entries.find(e => e.name === name);
  if (existing) {
    if (score > existing.score) existing.score = score;
  } else {
    entries.push({ name, score });
  }
  entries.sort((a, b) => b.score - a.score);
  const top = entries.slice(0, 10);
  saveLeaderboard(top);
  return top;
}

function renderLeaderboard(currentPlayer) {
  const entries = loadLeaderboard();
  const tbody   = document.getElementById('leaderboard-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (entries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;opacity:.5;padding:12px">No scores yet</td></tr>';
    return;
  }

  entries.forEach((e, i) => {
    const tr = document.createElement('tr');
    if (e.name === currentPlayer) tr.classList.add('current-player');
    tr.classList.add(`rank-${i + 1}`);

    const rankLabel = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
    tr.innerHTML = `
      <td class="rank-num"><span class="rank-badge">${rankLabel}</span></td>
      <td>${escHtml(e.name)}</td>
      <td class="score-td">${e.score.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

function escHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ─── GAME STATE ──────────────────────────────────────────────────────────────
class PacManGame {
  constructor(canvas, playerName) {
    this.canvas      = canvas;
    this.ctx         = canvas.getContext('2d');
    this.playerName  = playerName;

    canvas.width  = W;
    canvas.height = H;

    this.reset(1);
    this.bindInput();
    this.lastTime = 0;
    this.running  = false;
    this.paused   = false;
  }

  // ── map helpers ──────────────────────────────────────────────────────────
  buildMap() {
    return BASE_MAP.map(row => [...row]);
  }

  countDots(map) {
    let n = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (map[r][c] === T.DOT || map[r][c] === T.POWER) n++;
    return n;
  }

  // ── reset ────────────────────────────────────────────────────────────────
  reset(level) {
    this.level    = level || 1;
    this.score    = 0;
    this.lives    = 3;
    this.map      = this.buildMap();
    this.totalDots = this.countDots(this.map);
    this.dotsLeft  = this.totalDots;

    this.pacman = {
      // Row 26 col 13 is a true 4-way junction — all 4 arrow keys work immediately
      x: 13 * CELL, y: 26 * CELL,
      dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 },
      // Speed 4 = divisor of CELL(20), halves max junction-wait vs speed 2
      speed: 4,
      mouthAngle: 0.25, mouthDir: 1,
      dead: false, deathFrame: 0,
    };

    this.ghostEatMultiplier = 1;
    this.frightenTimer = 0;
    this.frightenDuration = Math.max(5000 - (level - 1) * 500, 2000);

    this.ghosts = this._buildGhosts(level);
    this.initGhostRelease();

    this.animFrame = null;
    this.gameOver  = false;
    this.won       = false;
  }

  _buildGhosts(level) {
    const spd = level >= 4 ? 4 : 2;
    return [
      // Blinky – starts outside, chases directly
      { x: 14*CELL, y: 11*CELL, dir:{x:0,y:-1}, color: GHOST_COLORS[0], name: GHOST_NAMES[0], mode:'scatter', modeTimer:7000, scatterTarget:{col:25,row:0}, homeX:13, homeY:11, inHouse:false, speed:spd, frightened:false, eaten:false, releaseDelay:0 },
      // Pinky – starts in house
      { x: 14*CELL, y: 13*CELL, dir:{x:0,y:-1}, color: GHOST_COLORS[1], name: GHOST_NAMES[1], mode:'scatter', modeTimer:7000, scatterTarget:{col:2,row:0},  homeX:11, homeY:13, inHouse:true,  speed:spd, frightened:false, eaten:false, releaseDelay:3000 },
      // Inky – starts in house
      { x: 13*CELL, y: 13*CELL, dir:{x:0,y: 1}, color: GHOST_COLORS[2], name: GHOST_NAMES[2], mode:'scatter', modeTimer:7000, scatterTarget:{col:27,row:30}, homeX:13, homeY:13, inHouse:true,  speed:spd, frightened:false, eaten:false, releaseDelay:6000 },
      // Clyde – starts in house
      { x: 15*CELL, y: 13*CELL, dir:{x:0,y: 1}, color: GHOST_COLORS[3], name: GHOST_NAMES[3], mode:'scatter', modeTimer:7000, scatterTarget:{col:0,row:30},  homeX:15, homeY:13, inHouse:true,  speed:spd, frightened:false, eaten:false, releaseDelay:9000 },
    ];
  }

  initGhostRelease() {
    this.ghosts.forEach(g => {
      if (g.inHouse) {
        setTimeout(() => { g.inHouse = false; }, g.releaseDelay);
      }
    });
  }

  // ── input ────────────────────────────────────────────────────────────────
  bindInput() {
    const keyMap = {
      ArrowUp:'ArrowUp', ArrowDown:'ArrowDown', ArrowLeft:'ArrowLeft', ArrowRight:'ArrowRight',
      w:'ArrowUp', s:'ArrowDown', a:'ArrowLeft', d:'ArrowRight',
      W:'ArrowUp', S:'ArrowDown', A:'ArrowLeft', D:'ArrowRight',
    };
    this._keyHandler = (e) => {
      const mapped = keyMap[e.key];
      if (mapped) {
        e.preventDefault();
        const dirs = {
          ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1},
          ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0}
        };
        this.pacman.nextDir = dirs[mapped];
      }
      if (e.key === 'p' || e.key === 'P') this.togglePause();
      if (e.key === 'r' || e.key === 'R') this.restartGame();
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  destroy() {
    window.removeEventListener('keydown', this._keyHandler);
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.deathTimeout) {
      clearTimeout(this.deathTimeout);
      this.deathTimeout = null;
    }
    if (this.winTimeout) {
      clearTimeout(this.winTimeout);
      this.winTimeout = null;
    }
  }

  // ── tile helpers ─────────────────────────────────────────────────────────
  tileAt(px, py) {
    const col = Math.floor(px / CELL);
    const row = Math.floor(py / CELL);
    if (row < 0 || row >= ROWS) return T.TUNNEL;
    const c = ((col % COLS) + COLS) % COLS;
    return this.map[row][c];
  }

  setTile(px, py, val) {
    const col = ((Math.floor(px / CELL) % COLS) + COLS) % COLS;
    const row = Math.floor(py / CELL);
    if (row >= 0 && row < ROWS) this.map[row][col] = val;
  }

  isWall(col, row) {
    if (row < 0 || row >= ROWS) return false;
    const c = ((col % COLS) + COLS) % COLS;
    return this.map[row][c] === T.WALL;
  }

  // px/py must be on-grid (multiples of CELL) when called
  canMoveTo(px, py, dir) {
    const col = (px / CELL) + dir.x;
    const row = (py / CELL) + dir.y;
    // Hard borders — no tunnels, edges are solid walls
    if (col < 0 || col >= COLS) return false;
    if (row < 0 || row >= ROWS) return false;
    const tile = this.map[row]?.[col];
    return tile !== T.WALL && tile !== undefined;
  }

  onGrid(px, py) {
    return px % CELL === 0 && py % CELL === 0;
  }

  // ── pacman movement ──────────────────────────────────────────────────────
  // Called once per fixed 60fps tick — no dt needed
  movePacman() {
    const p    = this.pacman;
    const step = p.speed; // always a divisor of CELL=20, so % CELL stays exact

    // At an intersection: try the queued turn, then keep current direction
    if (this.onGrid(p.x, p.y)) {
      if ((p.nextDir.x !== 0 || p.nextDir.y !== 0) && this.canMoveTo(p.x, p.y, p.nextDir)) {
        p.dir = { ...p.nextDir };
      }
    }

    if (p.dir.x === 0 && p.dir.y === 0) return;

    // Blocked by wall at current cell — stop
    if (this.onGrid(p.x, p.y) && !this.canMoveTo(p.x, p.y, p.dir)) return;

    p.x += p.dir.x * step;
    p.y += p.dir.y * step;

    // eat dot
    const tile = this.tileAt(p.x + CELL / 2, p.y + CELL / 2);
    if (tile === T.DOT) {
      this.setTile(p.x + CELL / 2, p.y + CELL / 2, T.EMPTY);
      this.score += 10;
      this.dotsLeft--;
      this.updateHUD();
      if (this.dotsLeft <= 0) this.levelComplete();
    } else if (tile === T.POWER) {
      this.setTile(p.x + CELL / 2, p.y + CELL / 2, T.EMPTY);
      this.score += 50;
      this.dotsLeft--;
      this.updateHUD();
      this.activateFrighten();
      if (this.dotsLeft <= 0) this.levelComplete();
    }

    // mouth animation
    p.mouthAngle += p.mouthDir * 0.06;
    if (p.mouthAngle > 0.25) { p.mouthAngle = 0.25; p.mouthDir = -1; }
    if (p.mouthAngle < 0.01) { p.mouthAngle = 0.01; p.mouthDir =  1; }
  }

  // ── ghost movement ───────────────────────────────────────────────────────
  activateFrighten() {
    this.frightenTimer = this.frightenDuration;
    this.ghostEatMultiplier = 1;
    this.ghosts.forEach(g => {
      if (!g.eaten) {
        g.frightened = true;
        // reverse direction
        g.dir = { x: -g.dir.x, y: -g.dir.y };
      }
    });
  }

  ghostTarget(g) {
    const p = this.pacman;
    if (g.frightened || g.eaten) return null;
    if (g.mode === 'scatter') return g.scatterTarget;

    // Chase targets (simplified)
    const pc = { col: Math.floor((p.x + CELL/2) / CELL), row: Math.floor((p.y + CELL/2) / CELL) };
    switch (g.name) {
      case 'Blinky': return pc;
      case 'Pinky':  return { col: pc.col + p.dir.x*4, row: pc.row + p.dir.y*4 };
      case 'Inky': {
        const ahead = { col: pc.col + p.dir.x*2, row: pc.row + p.dir.y*2 };
        const blinky = this.ghosts[0];
        const bc = Math.floor((blinky.x + CELL/2) / CELL);
        const br = Math.floor((blinky.y + CELL/2) / CELL);
        return { col: ahead.col + (ahead.col - bc), row: ahead.row + (ahead.row - br) };
      }
      case 'Clyde': {
        const dist = Math.hypot(Math.floor((g.x+CELL/2)/CELL) - pc.col, Math.floor((g.y+CELL/2)/CELL) - pc.row);
        return dist > 8 ? pc : g.scatterTarget;
      }
      default: return pc;
    }
  }

  moveGhost(g) {
    if (g.inHouse) return;

    // Speeds must be divisors of CELL=20: 1, 2, 4
    const step = g.eaten ? 4 : g.frightened ? 2 : g.speed;

    if (!this.onGrid(g.x, g.y)) {
      g.x += g.dir.x * step;
      g.y += g.dir.y * step;
      return;
    }

    const col = g.x / CELL;
    const row = g.y / CELL;

    // If eaten and reached home, revive
    if (g.eaten && col === Math.round(g.homeX) && row === Math.round(g.homeY)) {
      g.eaten = false; g.frightened = false;
      g.mode = 'scatter'; g.modeTimer = 7000;
      return;
    }

    const target = g.eaten
      ? { col: Math.round(g.homeX), row: Math.round(g.homeY) }
      : (g.frightened ? null : this.ghostTarget(g));

    const possible = [];
    const candidates = [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];
    for (const d of candidates) {
      // can't reverse (unless frightened)
      if (!g.frightened && d.x === -g.dir.x && d.y === -g.dir.y) continue;
      const nc = col + d.x, nr = row + d.y;
      if (this.isWall(nc, nr)) continue;
      // ghosts can't enter ghost house unless eaten
      if (this.map[nr]?.[nc] === T.GHOST_HOUSE && !g.eaten) continue;
      possible.push(d);
    }

    if (possible.length === 0) {
      // reverse
      g.dir = { x: -g.dir.x, y: -g.dir.y };
    } else if (g.frightened) {
      g.dir = possible[Math.floor(Math.random() * possible.length)];
    } else if (target) {
      // pick direction closest to target
      let best = null, bestDist = Infinity;
      for (const d of possible) {
        const nc = col + d.x, nr = row + d.y;
        const dist = Math.hypot(nc - target.col, nr - target.row);
        if (dist < bestDist) { bestDist = dist; best = d; }
      }
      g.dir = best || possible[0];
    } else {
      g.dir = possible[Math.floor(Math.random() * possible.length)];
    }

    g.x += g.dir.x * step;
    g.y += g.dir.y * step;
  }

  updateGhostModes(dt) {
    if (this.frightenTimer > 0) {
      this.frightenTimer -= dt;
      if (this.frightenTimer <= 0) {
        this.frightenTimer = 0;
        this.ghosts.forEach(g => { if (!g.eaten) g.frightened = false; });
      }
    }

    this.ghosts.forEach(g => {
      if (g.frightened || g.eaten || g.inHouse) return;
      g.modeTimer -= dt;
      if (g.modeTimer <= 0) {
        g.mode = g.mode === 'scatter' ? 'chase' : 'scatter';
        g.modeTimer = g.mode === 'scatter' ? 7000 : 20000;
        g.dir = { x: -g.dir.x, y: -g.dir.y };
      }
    });
  }

  checkGhostCollision() {
    const p   = this.pacman;
    const pr  = CELL * 0.45;
    const pcx = p.x + CELL / 2;
    const pcy = p.y + CELL / 2;

    for (const g of this.ghosts) {
      if (g.inHouse) continue;
      const gcx = g.x + CELL / 2;
      const gcy = g.y + CELL / 2;
      const dist = Math.hypot(pcx - gcx, pcy - gcy);

      if (dist < pr + CELL * 0.4) {
        if (g.frightened) {
          g.frightened = false;
          g.eaten = true;
          const pts = 200 * this.ghostEatMultiplier;
          this.ghostEatMultiplier *= 2;
          this.score += pts;
          this.showFloatingScore(gcx, gcy, pts);
          this.updateHUD();
        } else if (!g.eaten) {
          this.pacmanDeath();
          return;
        }
      }
    }
  }

  // ── score float ──────────────────────────────────────────────────────────
  floatingScores = [];

  showFloatingScore(x, y, pts) {
    this.floatingScores.push({ x, y, pts, life: 60 });
  }

  updateFloatingScores(dt) {
    this.floatingScores = this.floatingScores.filter(f => f.life > 0);
    this.floatingScores.forEach(f => { f.y -= 1; f.life -= 1; });
  }

  // ── death / game over ────────────────────────────────────────────────────
  pacmanDeath() {
    if (this.pacman.dead) return;
    this.pacman.dead = true;
    this.running = false;
    this.lives--;
    this.updateHUD();

    if (this.deathTimeout) clearTimeout(this.deathTimeout);
    this.deathTimeout = setTimeout(() => {
      this.deathTimeout = null;
      if (this.lives <= 0) {
        this.triggerGameOver();
      } else {
        this.respawn();
      }
    }, 1200);
  }

  respawn() {
    this.pacman.x   = 13 * CELL;
    this.pacman.y   = 26 * CELL;
    this.pacman.dir = { x: 0, y: 0 };
    this.pacman.nextDir = { x: 0, y: 0 };
    this.pacman.dead = false;
    this.ghosts = this._buildGhosts(this.level);
    this.initGhostRelease();
    this.frightenTimer = 0;
    this.ghostEatMultiplier = 1;
    this.running     = true;
    this.lastTime    = performance.now();
    this.accumulator = 0;
    requestAnimationFrame(ts => this.loop(ts));
  }

  triggerGameOver() {
    this.gameOver = true;
    addScore(this.playerName, this.score);
    renderLeaderboard(this.playerName);
    updateHighScore();
    showOverlay('gameover', this.score, this.level);
  }

  levelComplete() {
    this.won = true;
    this.running = false;
    this.score += 1000 * this.level;
    this.updateHUD();
    addScore(this.playerName, this.score);
    renderLeaderboard(this.playerName);
    updateHighScore();
    if (this.winTimeout) clearTimeout(this.winTimeout);
    this.winTimeout = setTimeout(() => {
      this.winTimeout = null;
      showOverlay('win', this.score, this.level);
    }, 800);
  }

  // ── HUD ──────────────────────────────────────────────────────────────────
  updateHUD() {
    document.getElementById('score-display').textContent = this.score.toLocaleString();
    document.getElementById('level-display').textContent = this.level;
    renderLives(this.lives);
  }

  // ── MAIN LOOP ────────────────────────────────────────────────────────────
  start() {
    this.running     = true;
    this.lastTime    = performance.now();
    this.accumulator = 0;
    this.animFrame   = requestAnimationFrame(ts => this.loop(ts));
    this.updateHUD();
  }

  togglePause() {
    if (this.gameOver || this.won) return;
    this.paused = !this.paused;
    if (!this.paused) {
      this.lastTime    = performance.now();
      this.accumulator = 0;
      this.animFrame   = requestAnimationFrame(ts => this.loop(ts));
    }
    const overlay = document.getElementById('game-overlay');
    if (this.paused) {
      document.getElementById('overlay-content').innerHTML = `
        <div class="overlay-title" style="color:#FFD700">PAUSED</div>
        <div class="overlay-score">Press P to resume</div>
      `;
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  }

  restartGame() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.deathTimeout) {
      clearTimeout(this.deathTimeout);
      this.deathTimeout = null;
    }
    if (this.winTimeout) {
      clearTimeout(this.winTimeout);
      this.winTimeout = null;
    }
    hideOverlay();
    this.paused = false;
    this.reset(1);
    this.start();
  }

  loop(timestamp) {
    if (!this.running || this.paused) return;

    const TICK = 1000 / 60; // fixed 16.67ms tick for movement
    const raw  = Math.min(timestamp - this.lastTime, 100);
    this.lastTime     = timestamp;
    this.accumulator += raw;

    // Run as many fixed ticks as have elapsed (keeps movement speed constant at any framerate)
    while (this.accumulator >= TICK) {
      this.update(TICK);
      this.accumulator -= TICK;
    }

    this.draw();

    if (this.running && !this.paused)
      this.animFrame = requestAnimationFrame(ts => this.loop(ts));
  }

  update(dt) {
    this.updateGhostModes(dt);
    this.movePacman();
    this.ghosts.forEach(g => this.moveGhost(g));
    this.checkGhostCollision();
    this.updateFloatingScores(dt);
  }

  // ── DRAW ─────────────────────────────────────────────────────────────────
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    this.drawMaze(ctx);
    this.drawDots(ctx);
    this.drawGhosts(ctx);
    this.drawPacman(ctx);
    this.drawFloatingScores(ctx);
  }

  drawMaze(ctx) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const wallColor = isDark ? '#1a1aff' : '#0000cc';
    const wallGlow  = isDark ? 'rgba(26,26,255,0.5)' : 'rgba(0,0,180,0.3)';

    ctx.shadowColor = wallGlow;
    ctx.shadowBlur  = 6;
    ctx.fillStyle   = wallColor;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.map[r][c] === T.WALL) {
          this.drawWallCell(ctx, c, r, wallColor);
        }
      }
    }
    ctx.shadowBlur = 0;
  }

  drawWallCell(ctx, c, r, color) {
    const x = c * CELL, y = r * CELL;
    const r2 = 4;
    ctx.beginPath();
    ctx.roundRect(x + 1, y + 1, CELL - 2, CELL - 2, r2);
    ctx.fill();
  }

  drawDots(ctx) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = this.map[r][c];
        const cx   = c * CELL + CELL / 2;
        const cy   = r * CELL + CELL / 2;

        if (tile === T.DOT) {
          ctx.fillStyle = '#FFB8AE';
          ctx.shadowColor = 'rgba(255,184,174,0.6)';
          ctx.shadowBlur  = 4;
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (tile === T.POWER) {
          const t   = Date.now() / 400;
          const rad = 5 + Math.sin(t) * 2;
          ctx.fillStyle = '#FFD700';
          ctx.shadowColor = 'rgba(255,215,0,0.8)';
          ctx.shadowBlur  = 14;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }
  }

  drawPacman(ctx) {
    const p   = this.pacman;
    const cx  = p.x + CELL / 2;
    const cy  = p.y + CELL / 2;
    const rad = CELL / 2 - 1;

    if (p.dead) {
      p.deathFrame++;
      const angle = Math.min(p.deathFrame / 30 * Math.PI, Math.PI);
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = 'rgba(255,215,0,0.6)';
      ctx.shadowBlur  = 10;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rad, angle, Math.PI * 2 - angle);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      return;
    }

    // rotation based on direction
    let rotation = 0;
    if (p.dir.x === 1)  rotation = 0;
    if (p.dir.x === -1) rotation = Math.PI;
    if (p.dir.y === -1) rotation = -Math.PI / 2;
    if (p.dir.y === 1)  rotation = Math.PI / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    const mouth = p.dir.x === 0 && p.dir.y === 0 ? 0.25 : p.mouthAngle;
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = 'rgba(255,215,0,0.7)';
    ctx.shadowBlur  = 12;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, rad, mouth * Math.PI, (2 - mouth) * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(rad * 0.3, -rad * 0.45, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawGhosts(ctx) {
    this.ghosts.forEach(g => this.drawGhost(ctx, g));
  }

  drawGhost(ctx, g) {
    if (g.inHouse) return;
    const cx  = g.x + CELL / 2;
    const cy  = g.y + CELL / 2;
    const rad = CELL / 2 - 1;

    const flash = g.frightened && this.frightenTimer < 2000 && Math.floor(Date.now() / 200) % 2 === 0;
    let bodyColor;
    if (g.eaten) {
      bodyColor = 'transparent';
    } else if (flash) {
      bodyColor = '#ffffff';
    } else if (g.frightened) {
      bodyColor = '#2020ff';
    } else {
      bodyColor = g.color;
    }

    if (!g.eaten) {
      ctx.shadowColor = bodyColor;
      ctx.shadowBlur  = 10;

      // body
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.arc(cx, cy - 2, rad, Math.PI, 0);
      ctx.lineTo(cx + rad, cy + rad);

      // wavy bottom
      const waves = 3;
      const waveW = (rad * 2) / waves;
      for (let i = waves - 1; i >= 0; i--) {
        const wx = cx - rad + i * waveW;
        ctx.quadraticCurveTo(wx + waveW * 0.5, cy + rad * (i % 2 === 0 ? 0.4 : 1.2), wx, cy + rad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Eyes
    if (!g.frightened && !g.eaten) {
      // whites
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx - 4, cy - 2, 4, 5, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 4, cy - 2, 4, 5, 0, 0, Math.PI*2); ctx.fill();
      // pupils (look toward movement dir)
      ctx.fillStyle = '#00f';
      ctx.beginPath(); ctx.arc(cx - 4 + g.dir.x * 2, cy - 2 + g.dir.y * 2, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 4 + g.dir.x * 2, cy - 2 + g.dir.y * 2, 2.5, 0, Math.PI*2); ctx.fill();
    } else if (g.eaten) {
      // just eyes when eaten
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx - 4, cy, 4, 5, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 4, cy, 4, 5, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#00f';
      ctx.beginPath(); ctx.arc(cx - 4 + g.dir.x*2, cy + g.dir.y*2, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 4 + g.dir.x*2, cy + g.dir.y*2, 2.5, 0, Math.PI*2); ctx.fill();
    } else {
      // frightened face
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx - 5, cy - 3, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 5, cy - 3, 3, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 3);
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(cx - 6 + i * 4 + 2, cy + (i % 2 === 0 ? 5 : 1));
      }
      ctx.stroke();
    }
  }

  drawFloatingScores(ctx) {
    ctx.font = 'bold 13px Courier New';
    ctx.textAlign = 'center';
    this.floatingScores.forEach(f => {
      ctx.globalAlpha = f.life / 60;
      ctx.fillStyle   = '#FFD700';
      ctx.shadowColor = 'rgba(255,215,0,0.8)';
      ctx.shadowBlur  = 8;
      ctx.fillText(f.pts, f.x, f.y);
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
    ctx.textAlign   = 'left';
  }
}

// ─── UI HELPERS ───────────────────────────────────────────────────────────────
function renderLives(n) {
  const el = document.getElementById('lives-display');
  if (!el) return;
  el.innerHTML = '';
  for (let i = 0; i < Math.max(0, n); i++) {
    const d = document.createElement('div');
    d.className = 'life-icon';
    el.appendChild(d);
  }
}

function updateHighScore() {
  const entries = loadLeaderboard();
  const best    = entries.length ? entries[0].score : 0;
  document.getElementById('high-score-display').textContent = best.toLocaleString();
}

function showOverlay(type, score, level) {
  const overlay = document.getElementById('game-overlay');
  const content = document.getElementById('overlay-content');
  overlay.classList.remove('hidden');

  if (type === 'gameover') {
    content.innerHTML = `
      <div class="overlay-title" style="color:#FF0000">GAME OVER</div>
      <div class="overlay-score">Score: ${score.toLocaleString()} &nbsp;|&nbsp; Level: ${level}</div>
      <div style="margin-top:8px">
        <button class="overlay-btn" onclick="game.restartGame()">PLAY AGAIN</button>
        <button class="overlay-btn secondary" onclick="newSession()">CHANGE NAME</button>
      </div>
    `;
  } else if (type === 'win') {
    content.innerHTML = `
      <div class="overlay-title" style="color:#FFD700">LEVEL ${level} CLEAR!</div>
      <div class="overlay-score">Score: ${score.toLocaleString()}</div>
      <div style="margin-top:8px">
        <button class="overlay-btn" onclick="nextLevel()">NEXT LEVEL</button>
      </div>
    `;
  }
}

function hideOverlay() {
  document.getElementById('game-overlay').classList.add('hidden');
}

function nextLevel() {
  hideOverlay();
  const lvl = game.level + 1;
  const name = game.playerName;
  const score = game.score;
  const lives = game.lives;
  game.destroy();
  game = new PacManGame(document.getElementById('game-canvas'), name);
  game.reset(lvl);
  game.score = score;
  game.lives = lives;
  game.start();
  game.updateHUD();
}

function newSession() {
  if (game) game.destroy();
  game = null;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('username-modal').style.display = 'flex';
  document.getElementById('username-input').value = '';
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────
let game = null;

function startSession(name) {
  document.getElementById('username-modal').style.display = 'none';
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('current-player').textContent = name.toUpperCase();

  updateHighScore();
  renderLeaderboard(name);

  const canvas = document.getElementById('game-canvas');
  if (game) game.destroy();
  game = new PacManGame(canvas, name);
  game.start();
}

// Username form
document.getElementById('username-submit').addEventListener('click', () => {
  const name = document.getElementById('username-input').value.trim();
  if (!name) {
    document.getElementById('username-input').focus();
    document.getElementById('username-input').style.borderColor = '#ff4444';
    setTimeout(() => document.getElementById('username-input').style.borderColor = '', 800);
    return;
  }
  startSession(name);
});

document.getElementById('username-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('username-submit').click();
});

// Theme toggle
const themeBtn  = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeBtn.addEventListener('click', () => {
  const html  = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeIcon.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('pacman_theme', isDark ? 'light' : 'dark');
});

// Restore saved theme
const savedTheme = localStorage.getItem('pacman_theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}
