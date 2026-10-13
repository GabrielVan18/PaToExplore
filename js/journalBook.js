// ---------------------------------------------------------------------------
// JOURNAL BOOK - a reusable, data-driven book that shows Lolo's Journal.
//
// Usage (from ANY scene - the main menu, a chapter, a modal):
//
//     openJournalBook(this);                                   // open at the contents
//     openJournalBook(this, { chapter: 3 });                   // open at chapter 3
//     openJournalBook(this, { chapter: 0 });                   // open at the Prologue
//     openJournalBook(this, { onClose: () => { this.locked = false; } });
//
// It pauses the calling scene, launches the 'Journal' scene on top, and resumes
// the caller when the book is closed (Esc, the X, or the J key).
//
// Which chapters are readable comes from ChapterProgress (progress.js): a
// chapter's pages are collected when the player finishes that chapter, and stay
// collected across page reloads. Anything not collected yet is shown as a
// sealed (locked) page. What each page SAYS lives in journalData.js.
// ---------------------------------------------------------------------------

const JOURNAL_LAYOUT = {
  cover: { x: 38, y: 26, w: 884, h: 488 },
  pageW: 418,
  pageTop: 42,
  pageH: 456,
  leftX: 60,
  rightX: 482,
  spineX: 480,
  contentBottom: 462,
  navY: 481
};

const JOURNAL_STYLE = {
  ink: '#3b2410',
  red: '#9c3b2e',
  soft: '#6b4a2f',
  faint: '#9a8461',
  heading: '"Tildunk", Georgia, serif',
  body: '"Tildunk", sans-serif'
};

const JournalBook = {
  // Load every drawing the journal shows. Safe to call more than once (and
  // from more than one scene): keys that are already loaded are skipped.
  preload(scene) {
    Object.entries(JOURNAL_ICON_FILES).forEach(([name, file]) => {
      const key = 'jr-' + name;
      if (!scene.textures.exists(key)) scene.load.image(key, 'assets/icons/' + file);
    });
    const d = JOURNAL_DUCK_SHEET;
    if (!scene.textures.exists('jr-' + d.key)) {
      scene.load.spritesheet('jr-' + d.key, 'assets/icons/' + d.file, {
        frameWidth: d.frameWidth, frameHeight: d.frameHeight
      });
    }
  },

  // Pages collected so far: what's saved on disk plus anything still only in
  // this session's registry (folded into storage first so nothing is lost).
  unlockedPages(registry) {
    if (registry) ChapterProgress.mergeJournalPages(registry.get('journalPages'));
    return ChapterProgress.getJournalPages();
  },

  open(scene, opts = {}) {
    const sp = scene.scene;
    if (sp.isActive('Journal') || sp.isPaused('Journal')) return;
    const callerKey = sp.key;
    ChapterProgress.mergeJournalPages(scene.registry.get('journalPages'));
    sp.pause();
    sp.launch('Journal', {
      callerKey,
      chapter: opts.chapter != null ? opts.chapter : null,
      onClose: opts.onClose || null
    });
  },

  // A "Read this page" button for the "Journal Page #N Unlocked!" panels.
  addReadButton(scene, container, chapterId, x, y, opts = {}) {
    const { rect, txt } = createButton(scene, x, y, opts.label || 'Read Page', () => {
      JournalBook.open(scene, { chapter: chapterId });
    }, { width: opts.width ?? 150, height: opts.height ?? 44, fontSize: opts.fontSize ?? 16, color: 0x9c3b2e, hoverColor: 0xc24a38 });
    container.add([rect, txt]);
    return { rect, txt };
  }
};

function openJournalBook(scene, opts) {
  JournalBook.open(scene, opts);
}

// Soft paper "swish" for turning a page. Synthesized (no audio file needed),
// respects the Settings sfx volume, and silently does nothing if audio isn't
// available or hasn't been unlocked yet.
function journalPageTurnSound(scene) {
  try {
    const ctx = scene.sound && scene.sound.context;
    if (!ctx || ctx.state !== 'running') return;
    const vol = scene.registry.get('sfxVolume');
    const v = vol === undefined ? 0.7 : vol;
    if (v <= 0) return;
    const dur = 0.22;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      const attack = t < 0.08 ? t / 0.08 : 1;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * attack;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(1400, ctx.currentTime);
    bp.frequency.linearRampToValueAtTime(3600, ctx.currentTime + dur);
    const gain = ctx.createGain();
    gain.gain.value = 0.35 * v;
    src.connect(bp);
    bp.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (e) { /* audio is a nicety, never a requirement */ }
}

class JournalScene extends Phaser.Scene {
  constructor() {
    super('Journal');
  }

  init(data) {
    this.callerKey = (data && data.callerKey) || null;
    this.onCloseCb = (data && data.onClose) || null;
    // 0 is a real chapter id (the Prologue), so test for null, not falsiness.
    this.startChapter = data && data.chapter != null ? data.chapter : null;
    this.spreadIndex = 0;
    this.turning = false;
    this.closing = false;
  }

  preload() {
    // No-ops for anything PreloadScene already loaded; makes the book work
    // even if it is opened before/without that.
    JournalBook.preload(this);
  }

  create() {
    const { width, height } = this.scale;
    this.pages = JournalBook.unlockedPages(this.registry);
    this.buildSpreadList();

    // Smooth (not nearest-neighbour) scaling for the drawings - the game runs
    // with pixelArt on, which makes shrunk drawings look jagged.
    Object.keys(JOURNAL_ICON_FILES).concat([JOURNAL_DUCK_SHEET.key]).forEach((name) => {
      const tex = this.textures.exists('jr-' + name) ? this.textures.get('jr-' + name) : null;
      if (tex) tex.setFilter(Phaser.Textures.FilterMode.LINEAR);
    });

    // Dim backdrop. Interactive so it soaks up clicks meant for nothing.
    this.add.rectangle(width / 2, height / 2, width, height, 0x0d0904, 0.86).setInteractive();

    this.book = this.add.container(0, 0);
    this.drawBook();
    this.tabLayer = this.add.container(0, 0);
    this.pageLayer = this.add.container(0, 0);
    this.navLayer = this.add.container(0, 0);
    this.book.add([this.tabLayer, this.pageLayer, this.navLayer]);
    this.drawCloseButton();
    this.bindKeys();

    const first = this.startChapter != null && this.chapterFirst[this.startChapter] !== undefined
      ? this.chapterFirst[this.startChapter] : 0;
    this.goTo(first, { animate: false });

    // little "opening the book" entrance
    this.book.setAlpha(0);
    this.book.y = 16;
    this.tweens.add({ targets: this.book, alpha: 1, y: 0, duration: 220, ease: 'Sine.easeOut' });
  }

  // ------------------------------------------------------------------ data --
  buildSpreadList() {
    const spreads = [{ type: 'contents' }];
    this.chapterFirst = {};
    JOURNAL_BOOK_DATA.chapters.forEach((ch) => {
      this.chapterFirst[ch.id] = spreads.length;
      if (this.pages.includes(ch.id)) {
        ch.spreads.forEach((sp, i) => spreads.push({ type: 'chapter', ch, sp, index: i, total: ch.spreads.length }));
      } else {
        spreads.push({ type: 'locked', ch });
      }
    });
    this.aboutIndex = spreads.length;
    spreads.push({ type: 'about' });
    this.spreads = spreads;
  }

  currentChapterId() {
    const s = this.spreads[this.spreadIndex];
    return s && s.ch ? s.ch.id : null;
  }

  hex(n) {
    return '#' + n.toString(16).padStart(6, '0');
  }

  // ---------------------------------------------------------- static book --
  drawBook() {
    const L = JOURNAL_LAYOUT;
    const g = this.add.graphics();
    this.book.add(g);

    // cover
    g.fillStyle(0x000000, 0.35);
    g.fillRoundedRect(L.cover.x + 4, L.cover.y + 6, L.cover.w, L.cover.h, 16);
    g.fillStyle(0x4a2a12, 1);
    g.fillRoundedRect(L.cover.x, L.cover.y, L.cover.w, L.cover.h, 16);
    g.lineStyle(3, 0xd8b04a, 1);
    g.strokeRoundedRect(L.cover.x + 1.5, L.cover.y + 1.5, L.cover.w - 3, L.cover.h - 3, 16);
    g.lineStyle(1, 0x7a5230, 1);
    g.strokeRoundedRect(L.cover.x + 8, L.cover.y + 8, L.cover.w - 16, L.cover.h - 16, 12);

    // page stacks (edges peeking out under each page)
    [[8, 0xd9c592], [4, 0xe8d8ab]].forEach(([off, col]) => {
      g.fillStyle(col, 1);
      g.fillRect(L.leftX - 2, L.pageTop + off, L.pageW, L.pageH);
      g.fillRect(L.rightX + 2, L.pageTop + off, L.pageW, L.pageH);
    });

    // the two pages
    g.fillStyle(0xf6ead0, 1);
    g.fillRect(L.leftX, L.pageTop, L.pageW, L.pageH);
    g.fillStyle(0xfff8e7, 1);
    g.fillRect(L.rightX, L.pageTop, L.pageW, L.pageH);

    // spine shading (stacked translucent strips - no gradient needed)
    for (let i = 0; i < 14; i++) {
      const a = 0.11 * (1 - i / 14);
      g.fillStyle(0x3b2410, a);
      g.fillRect(L.spineX - 2 - i * 2.2, L.pageTop, 2.2, L.pageH);
      g.fillRect(L.spineX + 2 + i * 2.2 - 2.2 + 2.2, L.pageTop, 2.2, L.pageH);
    }
    g.fillStyle(0x3b2410, 0.5);
    g.fillRect(L.spineX - 1, L.pageTop, 2, L.pageH);

    this.add.text(L.spineX, L.cover.y + L.cover.h - 8, 'Esc to close', {
      fontFamily: JOURNAL_STYLE.body, fontSize: 10, color: '#c9b48a'
    }).setOrigin(0.5, 1);
  }

  drawCloseButton() {
    const L = JOURNAL_LAYOUT;
    const cx = L.cover.x + L.cover.w + 2;
    const cy = L.cover.y + 4;
    const g = this.add.graphics();
    g.fillStyle(0x9c3b2e, 1);
    g.fillCircle(cx, cy, 15);
    g.lineStyle(2, 0xf5e2c8, 1);
    g.strokeCircle(cx, cy, 15);
    g.lineStyle(3, 0xfff8e7, 1);
    g.lineBetween(cx - 5, cy - 5, cx + 5, cy + 5);
    g.lineBetween(cx + 5, cy - 5, cx - 5, cy + 5);
    const zone = this.add.zone(cx, cy, 34, 34).setInteractive({ useHandCursor: true });
    zone.on('pointerup', () => { SoundManager.play(this, 'click'); this.close(); });
  }

  bindKeys() {
    const kb = this.input.keyboard;
    if (!kb) return;
    kb.on('keydown-LEFT', () => this.turn(-1));
    kb.on('keydown-A', () => this.turn(-1));
    kb.on('keydown-RIGHT', () => this.turn(1));
    kb.on('keydown-D', () => this.turn(1));
    kb.on('keydown-ESC', () => this.close());
    kb.on('keydown-J', () => this.close());
  }

  // ----------------------------------------------------------- navigation --
  turn(dir) {
    if (this.turning || this.closing) return;
    const next = this.spreadIndex + dir;
    if (next < 0 || next >= this.spreads.length) return;
    this.goTo(next, { animate: true, dir });
  }

  goTo(index, opts = {}) {
    if (this.closing) return;
    index = Phaser.Math.Clamp(index, 0, this.spreads.length - 1);
    const animate = opts.animate !== false && index !== this.spreadIndex;
    const dir = opts.dir || (index > this.spreadIndex ? 1 : -1);

    const draw = () => {
      this.spreadIndex = index;
      this.renderSpread();
      this.renderTabs();
      this.renderNav();
    };

    if (!animate) { draw(); return; }
    if (this.turning) return;
    this.turning = true;
    journalPageTurnSound(this);
    this.tweens.add({
      targets: this.pageLayer, alpha: 0, x: -16 * dir, duration: 90,
      onComplete: () => {
        draw();
        this.pageLayer.x = 16 * dir;
        this.tweens.add({
          targets: this.pageLayer, alpha: 1, x: 0, duration: 140,
          onComplete: () => { this.turning = false; }
        });
      }
    });
  }

  close() {
    if (this.closing) return;
    this.closing = true;
    this.tweens.add({
      targets: this.book, alpha: 0, y: 10, duration: 140,
      onComplete: () => {
        const key = this.callerKey;
        const cb = this.onCloseCb;
        const caller = key ? this.scene.get(key) : null;
        // A key released while the caller was paused never reached it, which
        // would leave e.g. a movement key "stuck" down. Clear that state.
        if (caller && caller.input && caller.input.keyboard && caller.input.keyboard.resetKeys) {
          caller.input.keyboard.resetKeys();
        }
        const sp = this.scene;
        if (key) sp.resume(key);
        sp.stop();
        if (cb) cb();
      }
    });
  }

  // ------------------------------------------------------ tabs & nav bars --
  renderTabs() {
    const L = JOURNAL_LAYOUT;
    this.tabLayer.removeAll(true);
    const g = this.add.graphics();
    this.tabLayer.add(g);
    const activeCh = this.currentChapterId();
    const cur = this.spreads[this.spreadIndex].type;

    // chapter tabs on the right edge
    JOURNAL_BOOK_DATA.chapters.forEach((ch, i) => {
      const locked = !this.pages.includes(ch.id);
      const active = activeCh === ch.id;
      const x = L.cover.x + L.cover.w - 2 + (active ? 9 : 0);
      const y = 84 + i * 56;
      this.drawTab(g, x, y, locked ? 0x6d7079 : ch.color, active, false);
      if (locked) {
        this.drawLock(g, x + 17, y + 24, 14, 0xe3dcc8);
      } else {
        this.tabLayer.add(this.add.text(x + 17, y + 23, ch.tab, {
          fontFamily: JOURNAL_STYLE.heading, fontSize: 17, color: '#fff8e7', fontStyle: 'bold'
        }).setOrigin(0.5));
      }
      this.tabLayer.add(this.makeZone(x + 17, y + 23, 36, 46, () => this.goTo(this.chapterFirst[ch.id])));
    });

    // Contents / About tabs on the left edge
    const leftTabs = [
      { y: 84, index: 0, on: cur === 'contents', glyph: 'lines' },
      { y: 140, index: this.aboutIndex, on: cur === 'about', glyph: 'i' }
    ];
    leftTabs.forEach((t) => {
      const x = L.cover.x + 2 - 34 - (t.on ? 9 : 0);
      this.drawTab(g, x, t.y, 0x7a5a36, t.on, true);
      if (t.glyph === 'lines') {
        g.lineStyle(2.5, 0xfff8e7, 1);
        [-7, 0, 7].forEach((dy) => g.lineBetween(x + 9, t.y + 23 + dy, x + 25, t.y + 23 + dy));
      } else {
        this.tabLayer.add(this.add.text(x + 17, t.y + 23, 'i', {
          fontFamily: JOURNAL_STYLE.heading, fontSize: 19, color: '#fff8e7', fontStyle: 'bold'
        }).setOrigin(0.5));
      }
      this.tabLayer.add(this.makeZone(x + 17, t.y + 23, 36, 46, () => this.goTo(t.index)));
    });
  }

  drawTab(g, x, y, color, active, leftSide) {
    const w = 34;
    const h = 46;
    const r = leftSide ? { tl: 9, bl: 9, tr: 0, br: 0 } : { tl: 0, bl: 0, tr: 9, br: 9 };
    g.fillStyle(0x000000, 0.28);
    g.fillRoundedRect(x + 2, y + 3, w, h, r);
    g.fillStyle(color, 1);
    g.fillRoundedRect(x, y, w, h, r);
    g.lineStyle(2, 0xf5e2c8, active ? 1 : 0.55);
    g.strokeRoundedRect(x, y, w, h, r);
  }

  makeZone(x, y, w, h, onClick) {
    const z = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    z.on('pointerup', () => {
      if (this.turning || this.closing) return;
      SoundManager.play(this, 'click');
      onClick();
    });
    return z;
  }

  renderNav() {
    const L = JOURNAL_LAYOUT;
    this.navLayer.removeAll(true);
    const g = this.add.graphics();
    this.navLayer.add(g);
    const last = this.spreads.length - 1;
    const i = this.spreadIndex;

    const num = (x, n) => this.navLayer.add(this.add.text(x, L.navY, String(n), {
      fontFamily: JOURNAL_STYLE.body, fontSize: 11, color: JOURNAL_STYLE.faint
    }).setOrigin(0.5));
    num(L.leftX + L.pageW / 2, i * 2 + 1);
    num(L.rightX + L.pageW / 2, i * 2 + 2);

    if (i > 0) {
      const x = L.leftX + 34;
      g.fillStyle(0x9c3b2e, 1);
      g.fillTriangle(x - 8, L.navY, x + 4, L.navY - 8, x + 4, L.navY + 8);
      this.navLayer.add(this.add.text(x + 10, L.navY, 'Prev', {
        fontFamily: JOURNAL_STYLE.body, fontSize: 12, color: JOURNAL_STYLE.red
      }).setOrigin(0, 0.5));
      this.navLayer.add(this.makeZone(x + 10, L.navY, 80, 30, () => this.turn(-1)));
    }
    if (i < last) {
      const x = L.rightX + L.pageW - 34;
      g.fillStyle(0x9c3b2e, 1);
      g.fillTriangle(x + 8, L.navY, x - 4, L.navY - 8, x - 4, L.navY + 8);
      this.navLayer.add(this.add.text(x - 10, L.navY, 'Next', {
        fontFamily: JOURNAL_STYLE.body, fontSize: 12, color: JOURNAL_STYLE.red
      }).setOrigin(1, 0.5));
      this.navLayer.add(this.makeZone(x - 10, L.navY, 80, 30, () => this.turn(1)));
    }
  }

  // ------------------------------------------------------------- drawing --
  drawLock(g, cx, cy, s, color) {
    g.lineStyle(Math.max(2, s * 0.16), color, 1);
    g.beginPath();
    g.arc(cx, cy - s * 0.12, s * 0.32, Math.PI, 0, false);
    g.strokePath();
    g.lineBetween(cx - s * 0.32, cy - s * 0.12, cx - s * 0.32, cy + s * 0.02);
    g.lineBetween(cx + s * 0.32, cy - s * 0.12, cx + s * 0.32, cy + s * 0.02);
    g.fillStyle(color, 1);
    g.fillRoundedRect(cx - s * 0.46, cy - s * 0.02, s * 0.92, s * 0.66, s * 0.1);
    g.fillStyle(0x3a3d46, 1);
    g.fillCircle(cx, cy + s * 0.25, s * 0.09);
    g.fillRect(cx - s * 0.03, cy + s * 0.25, s * 0.06, s * 0.2);
  }

  drawCheck(g, cx, cy, s, color) {
    g.lineStyle(Math.max(2, s * 0.2), color, 1);
    g.beginPath();
    g.moveTo(cx - s * 0.4, cy);
    g.lineTo(cx - s * 0.1, cy + s * 0.32);
    g.lineTo(cx + s * 0.42, cy - s * 0.32);
    g.strokePath();
  }

  // A text object that shrinks until it fits maxH (and never below minSize).
  fitText(x, y, str, style, maxW, maxH, minSize, origin) {
    let size = style.fontSize;
    const t = this.add.text(x, y, str, Object.assign({}, style, { fontSize: size, wordWrap: { width: maxW } }));
    if (origin) t.setOrigin(origin[0], origin[1]);
    while (t.height > maxH && size > minSize) {
      size -= 1;
      t.setFontSize(size);
    }
    this.pageLayer.add(t);
    return t;
  }

  // Centered page heading with a small gold divider. Returns the y just below.
  heading(cx, y, str, color, maxW = 350) {
    const t = this.fitText(cx, y, str, {
      fontFamily: JOURNAL_STYLE.heading, fontSize: 22, color: JOURNAL_STYLE.red, fontStyle: 'bold', align: 'center'
    }, maxW, 54, 15, [0.5, 0]);
    const yb = y + t.height + 7;
    const g = this.add.graphics();
    g.lineStyle(2, 0xd8b04a, 1);
    g.lineBetween(cx - 96, yb, cx - 9, yb);
    g.lineBetween(cx + 9, yb, cx + 96, yb);
    g.fillStyle(color, 1);
    g.fillTriangle(cx, yb - 5, cx + 5, yb, cx, yb + 5);
    g.fillTriangle(cx, yb - 5, cx - 5, yb, cx, yb + 5);
    this.pageLayer.add(g);
    return yb + 14;
  }

  // ------------------------------------------------------------- spreads --
  renderSpread() {
    this.pageLayer.removeAll(true);
    const s = this.spreads[this.spreadIndex];
    if (s.type === 'contents') this.buildContents();
    else if (s.type === 'chapter') this.buildChapter(s);
    else if (s.type === 'locked') this.buildLocked(s);
    else this.buildAbout();
  }

  // ---- contents ----
  buildContents() {
    const L = JOURNAL_LAYOUT;
    const D = JOURNAL_BOOK_DATA;
    const lx = L.leftX + L.pageW / 2;
    const rx = L.rightX + L.pageW / 2;

    // LEFT: cover-style page
    if (this.textures.exists('wood-banner-hex')) {
      this.pageLayer.add(this.add.image(lx, 118, 'wood-banner-hex').setDisplaySize(340, 122));
    }
    this.pageLayer.add(this.add.text(lx, 116, D.title, {
      fontFamily: JOURNAL_STYLE.heading, fontSize: 27, color: '#fff8e7', fontStyle: 'bold',
      stroke: '#3b2410', strokeThickness: 6
    }).setOrigin(0.5).setShadow(2, 3, '#00000066', 4, true, true));
    this.pageLayer.add(this.add.text(lx, 196, D.subtitle, {
      fontFamily: JOURNAL_STYLE.heading, fontSize: 18, color: JOURNAL_STYLE.red
    }).setOrigin(0.5));

    if (this.textures.exists('hiraya-journal')) {
      const img = this.add.image(lx, 305, 'hiraya-journal');
      img.setScale(Math.min(190 / img.width, 165 / img.height));
      this.pageLayer.add(img);
    }

    // The "N / 5 pages" tally counts the numbered chapters only: the game's
    // journal is five pages long, and the Prologue is the opening entry.
    const numbered = D.chapters.filter((c) => c.id > 0);
    const total = numbered.length;
    const got = numbered.filter((c) => this.pages.includes(c.id)).length;
    const complete = got === total;
    this.pageLayer.add(this.add.text(lx, 405, complete ? 'Journal complete!' : `${got} / ${total} pages collected`, {
      fontFamily: JOURNAL_STYLE.heading, fontSize: 16, color: complete ? '#3c7a3e' : JOURNAL_STYLE.ink, fontStyle: 'bold'
    }).setOrigin(0.5));
    const g = this.add.graphics();
    numbered.forEach((c, i) => {
      const x = lx + (i - (total - 1) / 2) * 34;
      if (this.pages.includes(c.id)) {
        g.fillStyle(c.color, 1);
        g.fillCircle(x, 436, 12);
        g.lineStyle(2, 0xfff8e7, 1);
        g.strokeCircle(x, 436, 12);
        this.drawCheck(g, x, 436, 12, 0xfff8e7);
      } else {
        g.lineStyle(2, 0xb9a57a, 1);
        g.strokeCircle(x, 436, 12);
        this.drawLock(g, x, 436, 11, 0xb9a57a);
      }
    });
    this.pageLayer.add(g);

    // RIGHT: table of contents
    const yb = this.heading(rx, 66, 'Contents', 0x9c3b2e);
    const rowH = D.chapters.length > 5 ? 50 : 56;
    let y = yb + 4;
    D.chapters.forEach((ch) => {
      const unlocked = this.pages.includes(ch.id);
      const bg = this.add.rectangle(rx, y + rowH / 2 - 3, 370, rowH - 6, 0xf1e1bb, unlocked ? 0.55 : 0.28)
        .setStrokeStyle(1, unlocked ? 0xd8b04a : 0xcdbb91)
        .setInteractive({ useHandCursor: true });
      bg.on('pointerover', () => bg.setFillStyle(0xf1e1bb, 0.95));
      bg.on('pointerout', () => bg.setFillStyle(0xf1e1bb, unlocked ? 0.55 : 0.28));
      bg.on('pointerup', () => {
        if (this.turning || this.closing) return;
        SoundManager.play(this, 'click');
        this.goTo(this.chapterFirst[ch.id]);
      });
      this.pageLayer.add(bg);

      const gg = this.add.graphics();
      gg.fillStyle(unlocked ? ch.color : 0x9a9ea6, 1);
      gg.fillCircle(L.rightX + 44, y + rowH / 2 - 3, 15);
      gg.lineStyle(2, 0xfff8e7, 1);
      gg.strokeCircle(L.rightX + 44, y + rowH / 2 - 3, 15);
      this.pageLayer.add(gg);
      this.pageLayer.add(this.add.text(L.rightX + 44, y + rowH / 2 - 3, ch.tab, {
        fontFamily: JOURNAL_STYLE.heading, fontSize: 16, color: '#fff8e7', fontStyle: 'bold'
      }).setOrigin(0.5));

      this.fitText(L.rightX + 70, y + 5, ch.title, {
        fontFamily: JOURNAL_STYLE.heading, fontSize: 16, color: unlocked ? JOURNAL_STYLE.ink : JOURNAL_STYLE.faint, fontStyle: 'bold'
      }, 250, 22, 12, [0, 0]);
      this.fitText(L.rightX + 70, y + 25, unlocked ? ch.tagline : `Locked. Finish ${ch.finish} to collect this page.`, {
        fontFamily: JOURNAL_STYLE.body, fontSize: 12, color: unlocked ? JOURNAL_STYLE.soft : JOURNAL_STYLE.faint
      }, 250, 18, 9, [0, 0]);

      const sg = this.add.graphics();
      if (unlocked) this.drawCheck(sg, L.rightX + L.pageW - 44, y + rowH / 2 - 3, 16, 0x3c7a3e);
      else this.drawLock(sg, L.rightX + L.pageW - 44, y + rowH / 2 - 8, 16, 0x9a9ea6);
      this.pageLayer.add(sg);
      y += rowH;
    });

    this.fitText(rx, y + 6, D.contentsHint, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 11, color: JOURNAL_STYLE.faint, align: 'center'
    }, 350, 30, 9, [0.5, 0]);
  }

  // ---- a collected chapter spread ----
  buildChapter({ ch, sp, index, total }) {
    const L = JOURNAL_LAYOUT;
    const lx = L.leftX + L.pageW / 2;
    const rx = L.rightX + L.pageW / 2;
    const left = sp.left;
    const right = sp.right;

    // ----- left page -----
    this.pageLayer.add(this.add.text(lx, 56, ch.kicker, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 11, color: this.hex(ch.color), fontStyle: 'bold'
    }).setOrigin(0.5));
    const top = this.heading(lx, 72, left.title, ch.color);
    const bottom = 392;
    if (left.sketches) this.layoutSketches(left.sketches, lx, top, bottom);
    else if (left.timeline) this.layoutTimeline(left.timeline, ch.color, L.leftX, top, bottom);
    else if (left.eggs) this.layoutEggs(left.eggs, lx, top, bottom, ch.color);
    if (left.note) this.marginNote(left.note, L.leftX, 402, L.contentBottom);

    // ----- right page -----
    this.pageLayer.add(this.add.text(rx, 56, `${ch.title.toUpperCase()}  \u00B7  ${index + 1} OF ${total}`, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 10, color: this.hex(ch.color), fontStyle: 'bold'
    }).setOrigin(0.5));
    const rTop = this.heading(rx, 72, right.title, ch.color);
    this.layoutBody(right, rx, rTop, ch.color);
  }

  // Body paragraphs + a boxed fact at the bottom; shrinks the body text (down
  // to 11px) so the two always fit on the page.
  layoutBody(right, cx, top, color) {
    const L = JOURNAL_LAYOUT;
    const w = 358;
    const x0 = cx - w / 2;
    const bottom = L.contentBottom;

    let factBox = null;
    let boxH = 0;
    if (right.fact) {
      const label = this.add.text(x0 + 16, 0, right.fact.label, {
        fontFamily: JOURNAL_STYLE.body, fontSize: 11, color: JOURNAL_STYLE.red, fontStyle: 'bold'
      });
      const body = this.add.text(x0 + 16, 0, right.fact.text, {
        fontFamily: JOURNAL_STYLE.body, fontSize: 12, color: JOURNAL_STYLE.ink, wordWrap: { width: w - 32 }
      });
      boxH = 14 + label.height + 4 + body.height + 14;
      factBox = { label, body };
    }

    const bodyStr = right.body.join('\n\n');
    const availBody = bottom - top - (factBox ? boxH + 14 : 0);
    const t = this.fitText(x0, top, bodyStr, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 14, color: JOURNAL_STYLE.ink, lineSpacing: 3
    }, w, availBody, 11, [0, 0]);

    if (factBox) {
      const by = bottom - boxH;
      const g = this.add.graphics();
      g.fillStyle(0xf6e6bd, 1);
      g.fillRoundedRect(x0, by, w, boxH, 8);
      g.lineStyle(2, 0xd8b04a, 1);
      g.strokeRoundedRect(x0, by, w, boxH, 8);
      g.fillStyle(color, 1);
      g.fillRoundedRect(x0, by + 8, 5, boxH - 16, 2);
      this.pageLayer.add(g);
      factBox.label.setPosition(x0 + 16, by + 12);
      factBox.body.setPosition(x0 + 16, by + 12 + factBox.label.height + 4);
      this.pageLayer.add([factBox.label, factBox.body]);
    }
    return t;
  }

  marginNote(str, pageX, top, bottom) {
    const L = JOURNAL_LAYOUT;
    const x = pageX + 34;
    const g = this.add.graphics();
    g.lineStyle(2, 0xd8b04a, 1);
    g.lineBetween(x - 10, top + 2, x - 10, bottom - 2);
    this.pageLayer.add(g);
    this.pageLayer.add(this.add.text(x, top, "LOLA NENA'S NOTE", {
      fontFamily: JOURNAL_STYLE.body, fontSize: 10, color: JOURNAL_STYLE.red, fontStyle: 'bold'
    }));
    this.fitText(x, top + 15, str, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 13, color: JOURNAL_STYLE.soft, fontStyle: 'italic'
    }, L.pageW - 70, bottom - top - 15, 10, [0, 0]);
  }

  // ---- drawings pinned to the page ----
  layoutSketches(list, cx, top, bottom) {
    const zoneH = bottom - top;
    const n = Math.min(list.length, 4);
    let cards;
    if (n === 1) {
      const h = Math.min(250, zoneH - 8);
      cards = [{ x: cx, y: top + zoneH / 2, w: 220, h }];
    } else if (n === 2) {
      const h = Math.min(220, zoneH - 8);
      cards = [-1, 1].map((k) => ({ x: cx + k * 94, y: top + zoneH / 2, w: 172, h }));
    } else {
      const h = Math.min(126, (zoneH - 10) / 2);
      const pitch = h + 10;
      const y1 = top + h / 2 + 2;
      const y2 = y1 + pitch;
      if (n === 3) {
        cards = [
          { x: cx - 86, y: y1, w: 152, h }, { x: cx + 86, y: y1, w: 152, h },
          { x: cx, y: y2, w: 152, h }
        ];
      } else {
        cards = [
          { x: cx - 86, y: y1, w: 152, h }, { x: cx + 86, y: y1, w: 152, h },
          { x: cx - 86, y: y2, w: 152, h }, { x: cx + 86, y: y2, w: 152, h }
        ];
      }
    }
    const tilt = [-3, 2.5, 3, -2.5];
    list.slice(0, n).forEach((spec, i) => this.pinnedCard(cards[i], spec, tilt[i % tilt.length]));
  }

  pinnedCard(c, spec, angle) {
    const box = this.add.container(c.x, c.y);
    box.setAngle(angle);
    const shadow = this.add.rectangle(3, 4, c.w, c.h, 0x2b170a, 0.22);
    const paper = this.add.rectangle(0, 0, c.w, c.h, 0xfffdf4).setStrokeStyle(2, 0xdcc99a);
    box.add([shadow, paper]);

    const boxW = c.w - 24;
    const boxH = c.h - 46;
    const key = 'jr-' + spec.icon;
    const cy = -c.h / 2 + 12 + boxH / 2;
    if (this.textures.exists(key)) {
      const img = spec.icon === JOURNAL_DUCK_SHEET.key
        ? this.add.image(0, cy, key, 0)
        : this.add.image(0, cy, key);
      img.setScale(Math.min(boxW / img.width, boxH / img.height));
      box.add(img);
    } else {
      // Drawing file missing - keep the page readable with a simple stand-in.
      const g = this.add.graphics();
      g.lineStyle(2, 0xb9a57a, 1);
      g.strokeRoundedRect(-boxW / 2, cy - boxH / 2, boxW, boxH, 8);
      box.add(g);
      box.add(this.add.text(0, cy, '?', { fontFamily: JOURNAL_STYLE.heading, fontSize: 30, color: '#b9a57a' }).setOrigin(0.5));
    }

    const cap = this.add.text(0, c.h / 2 - 21, spec.caption, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 12, color: JOURNAL_STYLE.soft, align: 'center', wordWrap: { width: c.w - 12 }
    }).setOrigin(0.5);
    let size = 12;
    while (cap.height > 30 && size > 9) { size -= 1; cap.setFontSize(size); }
    box.add(cap);

    const tape = this.add.rectangle(0, -c.h / 2 + 1, 46, 15, 0xf2d98a, 0.85).setAngle(-6).setStrokeStyle(1, 0xd9bd6a, 0.6);
    box.add(tape);
    this.pageLayer.add(box);
  }

  // ---- dated list ----
  layoutTimeline(entries, color, pageX, top, bottom) {
    const L = JOURNAL_LAYOUT;
    const lineX = pageX + 112;
    const dateW = 88;
    const textX = lineX + 18;
    const textW = pageX + L.pageW - 30 - textX;
    const avail = bottom - top;

    let size = 13;
    let built;
    for (;;) {
      built = entries.map((e) => ({
        d: this.add.text(lineX - 16, 0, e.date, {
          fontFamily: JOURNAL_STYLE.heading, fontSize: size, color: this.hex(color), fontStyle: 'bold', align: 'right', wordWrap: { width: dateW }
        }).setOrigin(1, 0),
        t: this.add.text(textX, 0, e.text, {
          fontFamily: JOURNAL_STYLE.body, fontSize: size, color: JOURNAL_STYLE.ink, wordWrap: { width: textW }, lineSpacing: 2
        })
      }));
      const gap = 16;
      const total = built.reduce((s, b) => s + Math.max(b.d.height, b.t.height), 0) + gap * (built.length - 1);
      if (total <= avail || size <= 10) break;
      built.forEach((b) => { b.d.destroy(); b.t.destroy(); });
      size -= 1;
    }

    const g = this.add.graphics();
    this.pageLayer.add(g);
    let y = top + 6;
    const ys = [];
    built.forEach((b) => {
      b.d.setPosition(lineX - 16, y);
      b.t.setPosition(textX, y);
      this.pageLayer.add([b.d, b.t]);
      ys.push(y + 7);
      y += Math.max(b.d.height, b.t.height) + 16;
    });
    g.lineStyle(3, 0xd8b04a, 1);
    g.lineBetween(lineX, ys[0], lineX, ys[ys.length - 1]);
    ys.forEach((yy) => {
      g.fillStyle(color, 1);
      g.fillCircle(lineX, yy, 6);
      g.lineStyle(2, 0xfff8e7, 1);
      g.strokeCircle(lineX, yy, 6);
    });
  }

  // ---- names written inside eggs (one per barangay) ----
  layoutEggs(names, cx, top, bottom, color) {
    const cols = 2;
    const rows = Math.ceil(names.length / cols);
    const eggW = 172;
    const pitch = Math.min(56, (bottom - top) / rows);
    const eggH = Math.min(48, pitch - 6);
    names.forEach((name, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = cx + (col === 0 ? -90 : 90);
      const y = top + pitch * row + pitch / 2;
      const egg = this.add.ellipse(x, y, eggW, eggH, 0xfff3d1).setStrokeStyle(2, 0xd8b04a);
      const tint = this.add.ellipse(x, y, eggW - 10, eggH - 8, color, 0.09);
      this.pageLayer.add([egg, tint]);
      this.fitText(x, y, name, {
        fontFamily: JOURNAL_STYLE.heading, fontSize: 13, color: JOURNAL_STYLE.ink, align: 'center', fontStyle: 'bold'
      }, eggW - 40, eggH - 8, 9, [0.5, 0.5]);
    });
  }

  // ---- a chapter that hasn't been collected yet ----
  buildLocked({ ch }) {
    const L = JOURNAL_LAYOUT;
    const lx = L.leftX + L.pageW / 2;
    const rx = L.rightX + L.pageW / 2;

    // left: a big padlock over a sealed page
    const g = this.add.graphics();
    g.fillStyle(0xe9dcb8, 1);
    g.fillRoundedRect(lx - 120, 110, 240, 250, 12);
    g.lineStyle(2, 0xcdbb91, 1);
    g.strokeRoundedRect(lx - 120, 110, 240, 250, 12);
    this.drawLock(g, lx, 214, 96, 0x9a9ea6);
    this.pageLayer.add(g);
    this.pageLayer.add(this.add.text(lx, 60, ch.id === 0 ? 'OPENING PAGE' : `PAGE ${ch.id}`, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 11, color: JOURNAL_STYLE.faint, fontStyle: 'bold'
    }).setOrigin(0.5));
    this.pageLayer.add(this.add.text(lx, 388, 'This page is still sealed', {
      fontFamily: JOURNAL_STYLE.heading, fontSize: 19, color: JOURNAL_STYLE.faint, fontStyle: 'bold'
    }).setOrigin(0.5));
    this.fitText(lx, 416, ch.teaser, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 13, color: JOURNAL_STYLE.faint, fontStyle: 'italic', align: 'center'
    }, 330, 44, 10, [0.5, 0]);

    // right: chapter title + how to unlock, with "redacted" lines below
    this.pageLayer.add(this.add.text(rx, 56, `${ch.kicker}  \u00B7  LOCKED`, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 11, color: JOURNAL_STYLE.faint, fontStyle: 'bold'
    }).setOrigin(0.5));
    const top = this.heading(rx, 72, ch.title, 0x9a9ea6);
    this.fitText(rx - 179, top + 4, `Finish ${ch.finish} to collect this page and read what Lolo wrote about it.\n\nPlay it from the main menu (Start Adventure or Chapters), then come back. The page will be waiting here.`, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 14, color: JOURNAL_STYLE.soft, lineSpacing: 3
    }, 358, 130, 11, [0, 0]);

    const bars = this.add.graphics();
    bars.fillStyle(0xe3d5ad, 1);
    const widths = [340, 358, 312, 350, 220, 0, 358, 300, 336];
    let y = top + 170;
    widths.forEach((bw) => {
      if (bw > 0) bars.fillRoundedRect(rx - 179, y, bw, 10, 5);
      y += 20;
    });
    this.pageLayer.add(bars);
  }

  // ---- about / sources ----
  buildAbout() {
    const L = JOURNAL_LAYOUT;
    const A = JOURNAL_BOOK_DATA.about;
    const lx = L.leftX + L.pageW / 2;
    const rx = L.rightX + L.pageW / 2;

    const top = this.heading(lx, 72, A.leftTitle, 0x7a5a36);
    const list = A.sources.map((s, i) => `${i + 1}.  ${s}`).join('\n');
    this.fitText(L.leftX + 30, top, list, {
      fontFamily: JOURNAL_STYLE.body, fontSize: 12, color: JOURNAL_STYLE.ink, lineSpacing: 5
    }, 358, L.contentBottom - top, 9, [0, 0]);

    const rTop = this.heading(rx, 72, A.rightTitle, 0x7a5a36);
    this.layoutBody({ body: A.body, fact: A.fact }, rx, rTop, 0x7a5a36);
  }
}
