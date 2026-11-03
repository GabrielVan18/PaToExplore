// Pac-Man style version of "Dodge the Patrol" for Chapter3Scene.
//
// HOW TO HOOK IT UP: load this file AFTER Chapter3Scene.js in index.html:
//
//   <script src="js/scenes/Chapter3Scene.js"></script>
//   <script src="js/scenes/chapter3-patrol-pacman.js"></script>
//
// It only replaces these methods on Chapter3Scene:
//   launchPatrol(), updatePatrol(), showPatrolIntro()
// and adds a few helpers (_pac*). The rest of your code is untouched:
// startPatrolTransition(), finishPatrol(), showPatrolRecap(),
// showPatrolFailRetry(), retryPatrol(), showPatrolToast(), updatePatrolHud()
// and the quiz flow all keep working as before.
//
// Mechanics:
//  - A maze full of dots (the "trail"). Clear every dot to win.
//  - 4 power pellets = the 4 messages (CHAPTER3_PATROL_MESSAGES). When you
//    pick one up, its note pops up and the guards get confused for a few
//    seconds: they wander randomly, and if you bump into one it is sent
//    back to its start (you do not lose a life).
//  - Touching a guard that is not confused = -1 life (3 lives total).
//  - Uses the real sprites: `${character}-sheet` and
//    'patrol-guard-sheet' (both already loaded in your preload()).

// Legend: # wall | . dot | o message (power pellet) | P player | G guard | ' ' empty
const C3_PAC_MAZE = [
  '###################',
  '#........#........#',
  '#o##.###.#.###.##o#',
  '#.................#',
  '#.##.#.#####.#.##.#',
  '#....#...#...#....#',
  '####.###.#.###.####',
  '#.......G.G.......#',
  '####.###.#.###.####',
  '#....#...#...#....#',
  '#.##.#.#####.#.##.#',
  '#o.......P.......o#',
  '###################'
];
// Third guard: the maze above only has two 'G' tiles, so any missing guard
// is spawned here. Add a third 'G' to the maze (row 5, for example) if you
// would rather place it yourself.
const C3_PAC_EXTRA_GUARD_START = { c: 9, r: 3 };

const C3_PAC_CFG = {
  PLAYER_SPEED: 5.2,   // tiles per second
  GUARD_SPEED: 4.2,
  HIDDEN_SPEED: 2.6,   // guard speed while confused
  HIDDEN_TIME: 6,      // seconds the guards stay confused
  RELEASE_GAP: 2,      // seconds between each guard leaving its start
  SCATTER: 5,          // seconds guards head for their corners
  CHASE: 15,           // seconds guards go after the player
  GUARD_COUNT: 3
};

const C3_DIRS = {
  up: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
  right: { x: 1, y: 0 }
};
const C3_DIR_LIST = [C3_DIRS.up, C3_DIRS.left, C3_DIRS.down, C3_DIRS.right];

// ---------- grid helpers ----------
function c3PacIsWall(P, c, r) {
  return r < 0 || r >= P.rows || c < 0 || c >= P.cols || P.grid[r][c] === '#';
}
function c3PacCanGo(P, e, d) { return !c3PacIsWall(P, e.c + d.x, e.r + d.y); }
function c3PacAtTile(e) { return e.c === e.tc && e.r === e.tr; }
function c3PacOpp(a, b) { return (a.x !== 0 || a.y !== 0) && a.x === -b.x && a.y === -b.y; }
function c3PacMakeEnt(s) { return { c: s.c, r: s.r, tc: s.c, tr: s.r, t: 0, dir: { x: 0, y: 0 } }; }
function c3PacReverse(e) {
  if (c3PacAtTile(e)) return;
  [e.c, e.tc] = [e.tc, e.c];
  [e.r, e.tr] = [e.tr, e.r];
  e.t = 1 - e.t;
  e.dir = { x: -e.dir.x, y: -e.dir.y };
}
// Moves an entity `dist` tiles forward. choose() is called at every tile
// center to ask for a new direction. Returns true if the entity moved.
function c3PacAdvance(e, dist, choose, onArrive) {
  let moved = false;
  while (dist > 1e-6) {
    if (c3PacAtTile(e)) {
      const d = choose(e);
      if (!d) return moved;
      e.dir = d; e.tc = e.c + d.x; e.tr = e.r + d.y; e.t = 0;
    }
    moved = true;
    const need = 1 - e.t;
    if (dist >= need) {
      dist -= need;
      e.c = e.tc; e.r = e.tr; e.t = 0;
      if (onArrive) onArrive(e);
    } else {
      e.t += dist;
      dist = 0;
    }
  }
  return moved;
}

const Chapter3PacmanPatrol = {

  // Builds the whole Pac-Man field. Same name and contract as the original
  // launchPatrol() (patrolContainer, patrolLives, patrolCollected,
  // patrolPlayer, HUD texts), so the rest of the scene keeps working.
  launchPatrol() {
    const { width, height } = this.scale;
    const rows = C3_PAC_MAZE.length;
    const cols = C3_PAC_MAZE[0].length;
    const topPad = 48, bottomPad = 34;
    const tile = Math.floor(Math.min(width / cols, (height - topPad - bottomPad) / rows));
    const ox = Math.round((width - cols * tile) / 2);
    const oy = topPad + Math.round((height - topPad - bottomPad - rows * tile) / 2);

    const P = this.pac = {
      rows, cols, tile, ox, oy,
      grid: C3_PAC_MAZE.map(r => r.split('')),
      items: {}, msgObjs: [], dotsLeft: 0,
      playerStart: { c: 1, r: 1 }, ghostStarts: [],
      want: { x: 0, y: 0 },
      hiddenT: 0, modeT: 0, clock: 0,
      phase: 'ready', phaseT: 1.2, won: false
    };

    this.patrolLives = CHAPTER3_PATROL_START_LIVES;
    this.patrolCollected = 0;
    this.patrolInvulnUntil = 0;
    this.patrolMessages = [];

    this.patrolContainer = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const add = (o) => { o.setScrollFactor(0); this.patrolContainer.add(o); return o; };

    // backdrop - dark, like the grounds at night
    add(this.add.rectangle(width / 2, height / 2, width, height, 0x1c1712, 1));

    // --- parse the maze: dots, messages, player/guard start tiles ---
    const wallGfx = add(this.add.graphics());
    let msgIdx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ch = P.grid[r][c];
        const x = ox + c * tile, y = oy + r * tile;
        const cx = x + tile / 2, cy = y + tile / 2;
        if (ch === '#') {
          wallGfx.fillStyle(0x3a2a1c, 1).fillRoundedRect(x + 1, y + 1, tile - 2, tile - 2, 5);
          wallGfx.lineStyle(2, 0x9c6b3e, 0.9).strokeRoundedRect(x + 1, y + 1, tile - 2, tile - 2, 5);
        } else if (ch === '.') {
          const dot = add(this.add.circle(cx, cy, Math.max(2, tile * 0.09), 0xf5e2c8, 0.95));
          P.items[`${c},${r}`] = { obj: dot, type: 'dot' };
          P.dotsLeft++;
        } else if (ch === 'o') {
          const data = CHAPTER3_PATROL_MESSAGES[msgIdx % CHAPTER3_PATROL_MESSAGES.length];
          const icon = add(this.add.text(cx, cy, data.emoji, { fontSize: Math.round(tile * 0.8) }).setOrigin(0.5));
          P.items[`${c},${r}`] = { obj: icon, type: 'msg', data };
          P.msgObjs.push(icon);
          P.dotsLeft++;
          msgIdx++;
        } else if (ch === 'P') {
          P.playerStart = { c, r };
          P.grid[r][c] = ' ';
        } else if (ch === 'G') {
          P.ghostStarts.push({ c, r });
          P.grid[r][c] = ' ';
        }
      }
    }
    while (P.ghostStarts.length < C3_PAC_CFG.GUARD_COUNT) P.ghostStarts.push({ ...C3_PAC_EXTRA_GUARD_START });
    P.ghostStarts.length = C3_PAC_CFG.GUARD_COUNT;

    // --- guards (the real patrol-guard-sheet + its animations) ---
    this.createPatrolGuardAnims();
    P.ghosts = P.ghostStarts.map((s, i) => {
      const sprite = add(this.add.sprite(0, 0, 'patrol-guard-sheet', 0).setOrigin(0.5, 0.75));
      sprite.setScale((tile * 1.35) / 96);
      return { id: i, ent: c3PacMakeEnt(s), start: s, sprite, delay: i * C3_PAC_CFG.RELEASE_GAP, hidden: false };
    });
    this.patrolGuards = P.ghosts; // kept for compatibility with the old patrol code

    // --- player (the selected character's sheet) ---
    P.player = c3PacMakeEnt(P.playerStart);
    this.patrolPlayer = add(this.add.sprite(0, 0, `${this.prefix}-sheet`, 12).setOrigin(0.5, 0.75));
    this.patrolPlayer.setScale((tile * 1.35) / 78);
    this.patrolPlayer.facing = 'up';

    // --- HUD ---
    this.patrolTitleTxt = this.add.text(width / 2, 14, 'Dodge the Patrol — Follow the Trail, Carry the Messages', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 15, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 10, y: 4 }
    }).setOrigin(0.5, 0).setScrollFactor(0);
    this.patrolCountTxt = this.add.text(16, 14, `Messages: 0/${CHAPTER3_PATROL_MESSAGES.length}`, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
    }).setScrollFactor(0);
    this.patrolLivesTxt = this.add.text(width - 16, 14, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
    }).setOrigin(1, 0).setScrollFactor(0);
    this.patrolHintTxt = this.add.text(width / 2, height - 12, 'WASD / Arrows to move · clear the whole trail · avoid the guards', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#c9b896'
    }).setOrigin(0.5, 1).setScrollFactor(0);
    P.readyTxt = this.add.text(width / 2, oy + (P.playerStart.r - 1.5) * tile, 'READY!', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, fontStyle: 'bold', color: '#ffe08a', backgroundColor: '#000000aa', padding: { x: 10, y: 4 }
    }).setOrigin(0.5).setScrollFactor(0);
    this.patrolContainer.add([this.patrolTitleTxt, this.patrolCountTxt, this.patrolLivesTxt, this.patrolHintTxt, P.readyTxt]);

    this.updatePatrolHud();
    this._pacSync();
  },

  showPatrolIntro() {
    showDialogue(this, 'Macario Almeda', [
      'Follow the trail with WASD or the arrows. Clear every trace we left behind so the patrol cannot track it.',
      `Grab the ${CHAPTER3_PATROL_MESSAGES.length} messages in the corners too. While you carry one, the guards lose their way for a moment. But if you are caught three times, we fall back.`
    ], () => {
      this.mode = 'patrol';
    }, ['kapitan-andres-firm', 'kapitan-andres-point']);
  },

  // ---- per-frame driver (called from update() while mode === 'patrol') ----
  updatePatrol(time, delta) {
    const P = this.pac;
    if (!P) return;
    const dt = Math.min(0.05, delta / 1000);
    P.clock += dt;

    // input: the last direction pressed is the "queued" turn
    const k = this.keys, cu = this.cursors;
    if (k.left.isDown || cu.left.isDown) P.want = C3_DIRS.left;
    else if (k.right.isDown || cu.right.isDown) P.want = C3_DIRS.right;
    else if (k.up.isDown || cu.up.isDown) P.want = C3_DIRS.up;
    else if (k.down.isDown || cu.down.isDown) P.want = C3_DIRS.down;

    if (P.phase === 'ready') {
      P.phaseT -= dt;
      if (P.phaseT <= 0) { P.phase = 'play'; P.readyTxt.setVisible(false); }
      SoundManager.setFootsteps(this, false);
      this._pacSync(false);
      return;
    }
    if (P.phase === 'dead') {
      P.phaseT -= dt;
      if (P.phaseT <= 0) {
        this._pacResetPositions();
        P.phase = 'ready'; P.phaseT = 1; P.readyTxt.setVisible(true);
      }
      SoundManager.setFootsteps(this, false);
      this._pacSync(false);
      return;
    }

    // ---- play ----
    P.modeT += dt;
    if (P.hiddenT > 0) {
      P.hiddenT -= dt;
      if (P.hiddenT <= 0) P.ghosts.forEach(g => { g.hidden = false; });
    }

    // player
    const pl = P.player;
    if (c3PacOpp(P.want, pl.dir) && !c3PacAtTile(pl)) c3PacReverse(pl); // instant U-turn
    const moved = c3PacAdvance(
      pl, C3_PAC_CFG.PLAYER_SPEED * dt,
      (e) => {
        if ((P.want.x || P.want.y) && c3PacCanGo(P, e, P.want)) return P.want;
        if ((e.dir.x || e.dir.y) && c3PacCanGo(P, e, e.dir)) return e.dir;
        return null;
      },
      (e) => this._pacEat(e)
    );
    SoundManager.setFootsteps(this, moved);
    if (P.won) { this.finishPatrol(true); return; }

    // guards
    for (const g of P.ghosts) {
      if (g.delay > 0) { g.delay -= dt; continue; }
      const speed = g.hidden ? C3_PAC_CFG.HIDDEN_SPEED : C3_PAC_CFG.GUARD_SPEED;
      c3PacAdvance(g.ent, speed * dt, (e) => this._pacGuardChoose(g, e));
    }

    // collisions
    const pp = this._pacTilePos(pl);
    for (const g of P.ghosts) {
      if (g.delay > 0) continue;
      const gp = this._pacTilePos(g.ent);
      if (Math.hypot(pp.x - gp.x, pp.y - gp.y) < 0.55) {
        if (g.hidden) {
          // confused guard -> send it back to its start
          Object.assign(g.ent, c3PacMakeEnt(g.start));
          g.hidden = false;
          g.delay = 1.5;
          this.showPatrolToast('The guard lost the trail!', '#3c7a3e');
        } else {
          this.handlePatrolCaught(g);
          return;
        }
      }
    }

    this._pacSync(moved);
  },

  // ---- helpers ----
  _pacTilePos(e) {
    return { x: e.c + (e.tc - e.c) * e.t, y: e.r + (e.tr - e.r) * e.t };
  },

  _pacEat(e) {
    const P = this.pac;
    const key = `${e.c},${e.r}`;
    const item = P.items[key];
    if (!item) return;
    item.obj.destroy();
    delete P.items[key];
    P.dotsLeft--;
    if (item.type === 'msg') {
      this.patrolCollected++;
      SoundManager.play(this, 'correct');
      this.showPatrolToast(item.data.note, '#3c7a3e');
      this.updatePatrolHud();
      // the guards get confused
      P.hiddenT = C3_PAC_CFG.HIDDEN_TIME;
      P.ghosts.forEach(g => { if (!g.hidden) c3PacReverse(g.ent); g.hidden = true; });
    }
    if (P.dotsLeft <= 0) P.won = true;
  },

  _pacGuardChoose(g, e) {
    const P = this.pac;
    let opts = C3_DIR_LIST.filter(d => c3PacCanGo(P, e, d) && !c3PacOpp(d, e.dir));
    if (!opts.length) opts = C3_DIR_LIST.filter(d => c3PacCanGo(P, e, d));
    if (!opts.length) return null;
    if (g.hidden) return opts[Math.floor(Math.random() * opts.length)];

    const chasing = P.modeT % (C3_PAC_CFG.SCATTER + C3_PAC_CFG.CHASE) >= C3_PAC_CFG.SCATTER;
    const corners = [
      { c: P.cols - 2, r: 1 }, { c: 1, r: 1 }, { c: P.cols - 2, r: P.rows - 2 }, { c: 1, r: P.rows - 2 }
    ];
    const corner = corners[g.id % corners.length];
    const pl = P.player;
    let target;
    if (!chasing) target = corner;
    else if (g.id % 3 === 0) target = { c: pl.c, r: pl.r };                                 // straight at you
    else if (g.id % 3 === 1) target = { c: pl.c + pl.dir.x * 4, r: pl.r + pl.dir.y * 4 };   // 4 tiles ahead of you
    else target = Math.random() < 0.4 ? null : { c: pl.c, r: pl.r };                        // unpredictable
    if (!target) return opts[Math.floor(Math.random() * opts.length)];

    let best = opts[0], bestD = Infinity;
    for (const d of opts) {
      const dd = (e.c + d.x - target.c) ** 2 + (e.r + d.y - target.r) ** 2;
      if (dd < bestD) { bestD = dd; best = d; }
    }
    return best;
  },

  _pacResetPositions() {
    const P = this.pac;
    Object.assign(P.player, c3PacMakeEnt(P.playerStart));
    P.want = { x: 0, y: 0 };
    P.hiddenT = 0;
    P.ghosts.forEach((g, i) => {
      Object.assign(g.ent, c3PacMakeEnt(g.start));
      g.delay = i * C3_PAC_CFG.RELEASE_GAP;
      g.hidden = false;
    });
    this.patrolPlayer.setAlpha(1);
    this.patrolPlayer.facing = 'up';
  },

  // Places the sprites at the right pixel position and plays the right animations.
  _pacSync(playerMoving) {
    const P = this.pac;
    const toPx = (e) => {
      const p = this._pacTilePos(e);
      return { x: P.ox + (p.x + 0.5) * P.tile, y: P.oy + (p.y + 0.5) * P.tile };
    };

    // player
    const pp = toPx(P.player);
    this.patrolPlayer.setPosition(pp.x, pp.y);
    const d = P.player.dir;
    if (d.y < 0) this.patrolPlayer.facing = 'up';
    else if (d.y > 0) this.patrolPlayer.facing = 'down';
    else if (d.x !== 0) { this.patrolPlayer.facing = 'side'; this.patrolPlayer.flipX = d.x > 0; }
    if (playerMoving) {
      this.patrolPlayer.play(`${this.prefix}-walk-${this.patrolPlayer.facing}`, true);
    } else {
      this.patrolPlayer.anims.stop();
      this.patrolPlayer.setFrame({ down: 0, up: 12, side: 24 }[this.patrolPlayer.facing]);
    }

    // guards
    P.ghosts.forEach(g => {
      const gp = toPx(g.ent);
      const s = g.sprite;
      s.setPosition(gp.x, gp.y);
      const gd = g.ent.dir;
      if (g.delay > 0 || (gd.x === 0 && gd.y === 0)) {
        s.anims.stop(); s.setFrame(0);
      } else if (gd.x !== 0) {
        s.setFlipX(gd.x > 0); // the side sheet faces left by default (same as the player sheets)
        s.play('patrol-guard-walk-side', true);
      } else {
        s.play(gd.y > 0 ? 'patrol-guard-walk-down' : 'patrol-guard-walk-up', true);
      }
      // confused = bluish tint, blinking just before it wears off
      if (g.hidden) {
        s.setTint(0x6c8cff);
        s.setAlpha(P.hiddenT < 2 && Math.floor(P.clock * 8) % 2 === 0 ? 0.35 : 0.75);
      } else {
        s.clearTint();
        s.setAlpha(1);
      }
    });

    // pulsing message icons
    const pulse = 1 + 0.15 * Math.sin(P.clock * 6);
    P.msgObjs.forEach(o => { if (o.active) o.setScale(pulse); });
  },

  // Spotted by a guard: -1 life, a short pause, then back to the start.
  handlePatrolCaught(g) {
    const P = this.pac;
    this.patrolLives--;
    SoundManager.play(this, 'incorrect');
    this.cameras.main.shake(160, 0.006);
    this.showPatrolToast('Spotted! Fall back!', '#c24a38');
    this.tweens.add({ targets: this.patrolPlayer, alpha: 0.25, duration: 90, yoyo: true, repeat: 4 });
    this.updatePatrolHud();
    if (this.patrolLives <= 0) { this.finishPatrol(false); return; }
    P.phase = 'dead';
    P.phaseT = 1.0;
    SoundManager.setFootsteps(this, false);
  }
};

Object.assign(Chapter3Scene.prototype, Chapter3PacmanPatrol);