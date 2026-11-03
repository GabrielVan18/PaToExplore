// chapter3-macario-roam.js
// ---------------------------------------------------------------------------
// Makes Macario Almeda wander around the Chapter 3 grounds.
//
//  - While the scene is in normal exploring mode he walks non-stop, in
//    long random legs (up / down / left / right), usually continuing the
//    way he was heading and turning at walls or obstacles.
//  - The moment the player talks to him (E) he stops and turns to face the
//    player. While any dialogue / popup / menu is open (scene.locked) he
//    stays put.
//  - When the conversation ends he waits a beat, then starts roaming again.
//  - He never walks through solid tiles (walls, trees, water) or collidable
//    decor, and he waits instead of bumping into the player.
//
// HOW TO HOOK IT UP: load this file AFTER Chapter3Scene.js in index.html:
//
//   <script src="js/scenes/Chapter3Scene.js"></script>
//   <script src="js/scenes/chapter3-macario-roam.js"></script>
//
// It wraps Chapter3Scene.create(), update() and talkToKapitanAndres(), so
// Chapter3Scene.js itself does not need to be edited.
// ---------------------------------------------------------------------------
(function () {
  const ROAM = {
    RADIUS: 520,      // how far (px) he may wander from where he started
    SPEED: 85,        // walking speed, px per second (the player walks at ~160)
    SIDE_FACES_RIGHT: true,  // true = his side-walk frames face RIGHT by default.
                             // If he moonwalks left/right, flip this to false.
    SWAP_VERTICAL: false,    // if he shows his back while walking DOWN (or his
                             // face while walking UP), set this to true.
    STEP_MIN: 160,    // shortest walk leg, px
    STEP_MAX: 360,    // longest walk leg, px
    WAIT_MIN: 0,      // pause between legs, ms (0 = keep walking non-stop)
    WAIT_MAX: 0,
    TALK_PAUSE: 300,  // short beat after a conversation ends, ms
    PLAYER_GAP: 44    // he will not step closer to the player than this, px
  };

  const proto = Chapter3Scene.prototype;
  if (proto._macarioRoamInstalled) return; // guard against double-loading
  proto._macarioRoamInstalled = true;

  const IDLE_FRAME = { down: 0, up: 12, side: 24 };

  // Maps the direction he is really moving to the animation row to use
  // (only differs from the input when SWAP_VERTICAL is on).
  const animRow = (f) => (ROAM.SWAP_VERTICAL && f !== 'side') ? (f === 'up' ? 'down' : 'up') : f;

  // Whether the side sprite must be mirrored to face the given horizontal direction.
  const flipFor = (dx) => ROAM.SIDE_FACES_RIGHT ? dx < 0 : dx > 0;

  // ---------- wrap create(): set up roaming after the scene is built ----------
  const origCreate = proto.create;
  proto.create = function (data) {
    origCreate.call(this, data);
    this._macarioRoamInit();
  };

  // ---------- wrap update(): run the roam logic after the normal update ----------
  const origUpdate = proto.update;
  proto.update = function (time, delta) {
    origUpdate.call(this, time, delta);
    this._macarioRoamUpdate(delta);
  };

  // ---------- wrap talkToKapitanAndres(): stop and face the player first ----------
  const origTalk = proto.talkToKapitanAndres;
  proto.talkToKapitanAndres = function () {
    this._macarioFacePlayer();
    origTalk.call(this);
  };

  // ---------- setup ----------
  proto._macarioRoamInit = function () {
    const s = this.kapitanAndres;
    if (!s) return;

    // Only use walk animations if his sheet actually has those frames
    // (same layout as the player sheets: 0-11 down, 12-19 up, 24-34 side).
    const tex = this.textures.get('kapitanandres-sheet');
    const hasWalk = tex.has(34);
    if (hasWalk) {
      if (!this.anims.exists('kapitanandres-walk-down')) {
        this.anims.create({ key: 'kapitanandres-walk-down', frames: this.anims.generateFrameNumbers('kapitanandres-sheet', { start: 0, end: 11 }), frameRate: 10, repeat: -1 });
      }
      if (!this.anims.exists('kapitanandres-walk-up')) {
        this.anims.create({ key: 'kapitanandres-walk-up', frames: this.anims.generateFrameNumbers('kapitanandres-sheet', { start: 12, end: 19 }), frameRate: 10, repeat: -1 });
      }
      if (!this.anims.exists('kapitanandres-walk-side')) {
        this.anims.create({ key: 'kapitanandres-walk-side', frames: this.anims.generateFrameNumbers('kapitanandres-sheet', { start: 24, end: 34 }), frameRate: 10, repeat: -1 });
      }
    }

    this.macarioRoam = {
      home: { x: s.x, y: s.y },
      state: 'wait',          // 'wait' | 'walk'
      wait: Phaser.Math.Between(ROAM.WAIT_MIN, ROAM.WAIT_MAX),
      target: null,
      facing: 'down',
      flip: false,
      hasWalk
    };
  };

  // ---------- per-frame ----------
  proto._macarioRoamUpdate = function (delta) {
    const R = this.macarioRoam;
    const s = this.kapitanAndres;
    if (!R || !s) return;

    // keep his "Press E" prompt and the "!" flag attached to him as he moves
    if (this.interactPrompt) this.interactPrompt.setPosition(s.x, s.y - 90);
    if (this.returnFlag) this.returnFlag.setPosition(s.x, s.y - 60);

    // Only roam while the player is freely exploring. Dialogue, popups, the
    // task list, menus and the mini-games all set locked / change mode.
    const free = this.mode === 'explore' && !this.locked;
    if (!free) {
      this._macarioIdle();
      return;
    }

    if (R.state === 'wait') {
      this._macarioIdle();
      R.wait -= delta;
      if (R.wait <= 0) this._macarioPickTarget();
      return;
    }

    // ---- walking toward R.target ----
    const dx = R.target.x - s.x;
    const dy = R.target.y - s.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 2) {
      // reached the end of this leg: immediately head off on the next one
      this._macarioPickTarget();
      return;
    }

    const step = Math.min(dist, ROAM.SPEED * (delta / 1000));
    const nx = s.x + (dx / dist) * step;
    const ny = s.y + (dy / dist) * step;

    // do not walk into the player: wait a moment instead
    const p = this.player;
    if (p) {
      const now = Phaser.Math.Distance.Between(s.x, s.y, p.x, p.y);
      const next = Phaser.Math.Distance.Between(nx, ny, p.x, p.y);
      if (next < ROAM.PLAYER_GAP && next < now) {
        R.state = 'wait';
        R.wait = 250;
        return;
      }
    }

    if (this._macarioBlocked(nx, ny)) {
      R.state = 'wait';
      R.wait = 120;
      return;
    }

    s.setPosition(nx, ny);
    this._macarioSyncBody();

    // face the way he is walking (dominant axis) and play the walk animation
    if (Math.abs(dx) > Math.abs(dy)) {
      R.facing = 'side';
      R.flip = flipFor(dx);
    } else {
      R.facing = dy < 0 ? 'up' : 'down';
    }
    if (R.hasWalk) {
      s.setFlipX(R.facing === 'side' ? R.flip : false);
      s.play(`kapitanandres-walk-${animRow(R.facing)}`, true);
    }
  };

  // ---------- choosing where to walk next ----------
  proto._macarioPickTarget = function () {
    const R = this.macarioRoam;
    const s = this.kapitanAndres;
    const dirs = Phaser.Utils.Array.Shuffle([
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }
    ]);

    // Prefer to keep going the way he was heading (most of the time), and
    // only turn around as a last resort, so the walk looks purposeful.
    const h = R.heading;
    if (h) {
      const keepGoing = Math.random() < 0.6;
      const rank = (d) => {
        if (d.x === h.x && d.y === h.y) return keepGoing ? 0 : 1;
        if (d.x === -h.x && d.y === -h.y) return 2;
        return 1;
      };
      dirs.sort((a, b) => rank(a) - rank(b));
    }

    for (const d of dirs) {
      const len = Phaser.Math.Between(ROAM.STEP_MIN, ROAM.STEP_MAX);
      const tx = s.x + d.x * len;
      const ty = s.y + d.y * len;
      if (Phaser.Math.Distance.Between(tx, ty, R.home.x, R.home.y) > ROAM.RADIUS) continue;
      if (this._macarioPathBlocked(s.x, s.y, tx, ty)) continue;
      R.target = { x: tx, y: ty };
      R.heading = d;
      R.state = 'walk';
      return;
    }
    // boxed in this time - try again in a moment
    R.state = 'wait';
    R.wait = 150;
  };

  proto._macarioPathBlocked = function (x0, y0, x1, y1) {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(len / 12));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      if (this._macarioBlocked(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t)) return true;
    }
    return false;
  };

  // True if his feet at (x, y) would overlap a solid tile or collidable decor.
  proto._macarioBlocked = function (x, y) {
    const ts = CHAPTER3_MAP_DATA.tileSize;
    const rows = CHAPTER3_MAP_DATA.tiles;
    const types = CHAPTER3_MAP_DATA.tileTypes;
    const hw = 14, top = y + 8, bottom = y + 34;

    const pts = [[x - hw, top], [x + hw, top], [x - hw, bottom], [x + hw, bottom]];
    for (const [px, py] of pts) {
      const c = Math.floor(px / ts);
      const r = Math.floor(py / ts);
      if (r < 0 || r >= rows.length || c < 0 || c >= rows[0].length) return true;
      const t = types[rows[r][c]];
      if (t && t.solid) return true;
    }

    for (const o of this.decorObstacles || []) {
      const b = o.body;
      if (!b) continue;
      if (x + hw > b.left && x - hw < b.right && bottom > b.top && top < b.bottom) return true;
    }
    return false;
  };

  // ---------- idle / facing ----------
  proto._macarioIdle = function () {
    const R = this.macarioRoam;
    const s = this.kapitanAndres;
    if (!R || !s) return;
    s.anims.stop();
    if (R.hasWalk) {
      s.setFlipX(R.facing === 'side' ? R.flip : false);
      s.setFrame(IDLE_FRAME[animRow(R.facing)]);
    } else {
      s.setFrame(0);
    }
  };

  // Called right before the conversation starts: stop and turn to the player.
  proto._macarioFacePlayer = function () {
    const R = this.macarioRoam;
    const s = this.kapitanAndres;
    const p = this.player;
    if (!R || !s || !p) return;
    const dx = p.x - s.x;
    const dy = p.y - s.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      R.facing = 'side';
      R.flip = flipFor(dx);
    } else {
      R.facing = dy < 0 ? 'up' : 'down';
    }
    R.state = 'wait';
    R.target = null;
    R.wait = ROAM.TALK_PAUSE; // after the chat ends he pauses briefly, then roams again
    this._macarioIdle();
  };

  // His collision body is static, so it has to be moved by hand whenever he
  // moves. Mirrors how Phaser positions a static body (sprite top-left + offset).
  proto._macarioSyncBody = function () {
    const s = this.kapitanAndres;
    const b = s && s.body;
    if (!b) return;
    try {
      const tree = b.world.staticTree;
      tree.remove(b);
      b.position.set(s.x - s.displayOriginX + b.offset.x, s.y - s.displayOriginY + b.offset.y);
      b.updateCenter();
      tree.insert(b);
    } catch (e) {
      b.updateFromGameObject(); // fallback: keeps the body attached even if it resets the custom size
    }
  };
})();