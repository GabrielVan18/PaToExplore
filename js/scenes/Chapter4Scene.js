const C4_FRAME_W = 44;
const C4_FRAME_H = 78;

// NOTE: INTERACT_RADIUS is declared once in Chapter1Scene.js (loaded before
// this file in index.html) and reused here as-is.

// ============================================================================
// Chapter 4 - "The Balut Capital"
// ----------------------------------------------------------------------------
// Per the story doc this chapter is meant to be the most fun one, built from
// THREE small back-to-back mini-games rather than one exploration loop:
//   1. Duck Herding  - guide free-roaming ducks into a pen
//   2. Egg Sorting   - sort eggs into "Keep Incubating" vs "Set Aside"
//   3. Balut Stall   - match customer requests to the right item
// The duck-yard/egg/stall mini-game props here are still PLACEHOLDERS -
// flat-color rectangles / emoji-as-sprite, the same approach already used
// throughout mapLoader.js and Chapter1-3. Mang Carding himself now has real
// art (see PreloadScene.js) - drop in real mini-game tiles/props later and
// none of the game-logic below needs to change.
// ============================================================================

// --- Chapter 4 map layout ---------------------------------------------
// "Duck Yard" - bright and open, no dark overlay like Chapter 3, since this
// is meant to be the fun chapter. Same 48x32 / 32px-tile convention as
// Chapter1/2/3 (see mapLoader.js).
//   0 = grass (walkable)   2 = water (blocked, decorative pond)
//   3 = path (walkable)    5 = wall (blocked, border)
const CHAPTER4_COLS = 48;
const CHAPTER4_ROWS = 32;
const CHAPTER4_TRAIL_COLS = [23, 24];
// small decorative pond, off to one side so it never blocks the trail, the
// pen, or the ducks' starting spots
const CHAPTER4_POND_ROWS = [5, 6, 7, 8, 9];
const CHAPTER4_POND_COLS = [30, 31, 32, 33, 34, 35, 36];

function buildChapter4Map() {
  const grid = [];
  for (let r = 0; r < CHAPTER4_ROWS; r++) {
    const row = [];
    for (let c = 0; c < CHAPTER4_COLS; c++) {
      const isBorder = r === 0 || r === CHAPTER4_ROWS - 1 || c === 0 || c === CHAPTER4_COLS - 1;
      row.push(isBorder ? '5' : '0');
    }
    grid.push(row);
  }

  // a single worn trail running the length of the yard - the player's
  // spawn point sits right on it, same as Chapter 3.
  for (let r = 1; r < CHAPTER4_ROWS - 1; r++) {
    CHAPTER4_TRAIL_COLS.forEach(c => { grid[r][c] = '3'; });
  }

  // decorative pond - just an obstacle the ducks/player wander around.
  CHAPTER4_POND_ROWS.forEach(r => {
    CHAPTER4_POND_COLS.forEach(c => { grid[r][c] = '2'; });
  });

  return grid.map(row => row.join(''));
}

const CHAPTER4_MAP = buildChapter4Map();
const CHAPTER4_TILE_SIZE = 32; // must match TILE_SIZE in mapLoader.js

// --- Duck Herding mini-game data --------------------------------------------
// The pen is just a marked-off patch of grass (no physical fence tiles) -
// ducks and the player can walk straight through its outline. Reaching it is
// all that matters for this placeholder version.
const CHAPTER4_PEN_TILES = { colStart: 10, colEnd: 17, rowStart: 5, rowEnd: 10 };
const CHAPTER4_PEN_RECT = new Phaser.Geom.Rectangle(
  CHAPTER4_PEN_TILES.colStart * CHAPTER4_TILE_SIZE,
  CHAPTER4_PEN_TILES.rowStart * CHAPTER4_TILE_SIZE,
  (CHAPTER4_PEN_TILES.colEnd - CHAPTER4_PEN_TILES.colStart) * CHAPTER4_TILE_SIZE,
  (CHAPTER4_PEN_TILES.rowEnd - CHAPTER4_PEN_TILES.rowStart) * CHAPTER4_TILE_SIZE
);

const CHAPTER4_DUCK_COUNT = 5;
// starting spots, all outside both the pen and the pond so nothing starts
// "already home" or stuck in the water on spawn
const CHAPTER4_DUCK_START = [
  { x: 700, y: 700 },
  { x: 900, y: 460 },
  { x: 1100, y: 760 },
  { x: 520, y: 860 },
  { x: 820, y: 300 }
];

// Fixed "resting spots" clustered around the pen's center. A duck that
// wanders into the pen is walked to one of these (see Chapter4Scene#settleDuck)
// instead of just freezing at whatever point it first crossed the pen's
// boundary - previously that made ducks look like they'd gotten stuck
// against the fence line instead of actually settling inside.
const CHAPTER4_PEN_CENTER_X = CHAPTER4_PEN_RECT.x + CHAPTER4_PEN_RECT.width / 2;
const CHAPTER4_PEN_CENTER_Y = CHAPTER4_PEN_RECT.y + CHAPTER4_PEN_RECT.height / 2;
const CHAPTER4_PEN_SLOTS = [
  { x: CHAPTER4_PEN_CENTER_X, y: CHAPTER4_PEN_CENTER_Y },
  { x: CHAPTER4_PEN_CENTER_X - 38, y: CHAPTER4_PEN_CENTER_Y - 22 },
  { x: CHAPTER4_PEN_CENTER_X + 38, y: CHAPTER4_PEN_CENTER_Y - 22 },
  { x: CHAPTER4_PEN_CENTER_X - 38, y: CHAPTER4_PEN_CENTER_Y + 22 },
  { x: CHAPTER4_PEN_CENTER_X + 38, y: CHAPTER4_PEN_CENTER_Y + 22 }
];

const CHAPTER4_DUCK_FLEE_RADIUS = 90;   // player proximity that spooks a duck
const CHAPTER4_DUCK_FLEE_SPEED = 95;
const CHAPTER4_DUCK_WANDER_SPEED = 42;
const CHAPTER4_DUCK_WANDER_MIN_MS = 900;
const CHAPTER4_DUCK_WANDER_MAX_MS = 1900;
// Horizontal speed a duck needs before it's considered to be moving "left"
// or "right" for facing purposes - keeps a duck that's moving mostly up/down
// from flickering its flip back and forth on tiny left/right jitter.
const CHAPTER4_DUCK_FLIP_THRESHOLD = 5;
// duck-walk.png / duck-flap.png are drawn facing right by default - flip
// them to face left instead of using separate left-facing assets. If your
// art is drawn facing left by default, just flip this to true.
const CHAPTER4_DUCK_ART_FACES_LEFT_BY_DEFAULT = false;
// Sheets are exported bigger than the duck's intended on-screen footprint
// (see PreloadScene-style sizing notes) so the walk-cycle detail doesn't
// get muddy - scale everything down uniformly instead.
const CHAPTER4_DUCK_SCALE = 0.65;
// Below this speed a duck is considered "not really walking" - keeps the
// walk-cycle from playing while a duck is momentarily stopped between
// wander bursts (it just holds on the frame it was already showing).
const CHAPTER4_DUCK_MOVE_THRESHOLD = 4;

// --- Egg Sorting mini-game data ----------------------------------------
// Facts drawn straight from the story doc's Chapter 4 section.
const CHAPTER4_EGGS = [
  {
    desc: 'Egg A - 11 days into incubation. Held to the candling lamp, it shows a dark spot with spider-like veins.',
    correct: 'incubation',
    explanation: 'That web of veins means the egg is fertile and developing, so it stays in the incubator.'
  },
  {
    desc: 'Egg B - 11 days into incubation. Held to the candling lamp, it looks clear, like a plain yolk.',
    correct: 'not_ready',
    explanation: 'A clear egg is infertile. It will not become balut, so it is taken out and sold as penoy.'
  },
  {
    desc: 'Egg C - 16 days in the incubator, close to the 18-day balut stage.',
    correct: 'incubation',
    explanation: 'A classic balut is incubated about 18 days, so this egg keeps incubating.'
  },
  {
    desc: 'Egg D - the shell is cracked and spoiled.',
    correct: 'not_ready',
    explanation: 'Makers tap eggs to catch cracked or thin shells. A damaged egg cannot survive incubation, so it is set aside.'
  }
];

// --- Balut Stall mini-game data ------------------------------------------
const CHAPTER4_CUSTOMERS = [
  { line: '"One balut, please!"', correct: 'balut' },
  { line: '"Can I get some fresh eggs?"', correct: 'eggs' },
  { line: '"Just something to drink, please."', correct: 'drink' },
  { line: '"Balut for the whole family - four, please!"', correct: 'balut' }
];

class Chapter4Scene extends Phaser.Scene {
  constructor() {
    super('Chapter4');
  }

  preload() {
    // Duck-herding sprites - two small animation sheets rather than one
    // static icon: a 7-frame walk cycle for wandering ducks, and a
    // 4-frame wing-flap loop for ducks that have settled in the pen.
    // Both drawn facing right by default (see CHAPTER4_DUCK_ART_FACES_LEFT_BY_DEFAULT
    // above) and flipped for leftward movement, same approach the old
    // static icon used. startDuckHerding() reads sprite.width/height
    // (the native, unscaled frame size) to center the arcade physics
    // circle body, same as it did against the old single-image sprite.
    this.load.spritesheet('duck_walk', 'assets/icons/duck-walk.png', { frameWidth: 64, frameHeight: 72 });
    this.load.spritesheet('duck_flap', 'assets/icons/duck-flap.png', { frameWidth: 72, frameHeight: 80 });
    // Egg-sorting icon shown in the sort-this-egg popup.
    this.load.image('icon_egg', 'assets/icons/ch4-egg-plain.png');
  }

  create(data) {
    SoundManager.playMusic(this, 'bg-game');
    const { width, height } = this.scale;
    const character = this.registry.get('selectedCharacter') || 'hiraya';
    const textureKey = character + '-sheet';
    this.prefix = character;
    this.speed = this.registry.get('playerSpeed') || 160;
    this.locked = false; // true during dialogue / modal minigame screens - movement disabled
    // mode: intro -> herding -> eggsorting -> balutstall -> quiz -> done
    this.mode = 'intro';

    // Duck animations - defined once against the cache keys rather than
    // per-scene-instance, so re-entering Chapter 4 (or Phaser recreating
    // the scene) doesn't throw on a duplicate anim key.
    if (this.textures.exists('duck_walk') && !this.anims.exists('duck-walk')) {
      this.anims.create({
        key: 'duck-walk',
        frames: this.anims.generateFrameNumbers('duck_walk', { start: 0, end: 6 }),
        frameRate: 8,
        repeat: -1
      });
    }
    if (this.textures.exists('duck_flap') && !this.anims.exists('duck-idle')) {
      this.anims.create({
        key: 'duck-idle',
        // rest -> wings half-up -> wings full-up -> half-up -> rest, so the
        // flap reads as one flourish rather than a mechanical back-and-forth
        frames: [0, 1, 2, 1].map(f => ({ key: 'duck_flap', frame: f })),
        frameRate: 6,
        repeat: -1
      });
    }

    // --- Duck Yard map (48x32 tiles - see CHAPTER4_MAP up top to edit) ---
    this.map = loadMap(this, CHAPTER4_MAP);

// --- player ---
     this.createPlayerAnims(textureKey);
     this.player = this.physics.add.sprite(752, 850, textureKey, 0);
     this.player.setCollideWorldBounds(true);
     this.player.setSize(C4_FRAME_W * 0.5, C4_FRAME_H * 0.35);
     this.player.setOffset(C4_FRAME_W * 0.25, C4_FRAME_H * 0.6);
     this.player.facing = 'up';
     // Ensure player renders above NPCs and objects
     this.player.setDepth(10000);
     this.physics.add.collider(this.player, this.map.obstacles);

    // Pokemon-style camera: player stays pinned to the center of the
    // screen, the map scrolls underneath them. See mapLoader.js.
    centerCameraOnPlayer(this, this.map, this.player);

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.locked) { this.locked = true; showPauseMenu(this); }
    });

// --- Mang Carding --- (real sprite sheet, same 44x78 grid convention as
     // hiraya-sheet/lola-sheet/donemilio-sheet/kapitanandres-sheet - frame 0
     // is his down-facing idle pose).
     this.mangCarding = this.add.sprite(752, 786, 'mangcarding-sheet', 0);
     // Static collision body sized to almost the whole sprite (not just the
     // feet) so the player can't walk into/overlap Mang Carding from any side
     // - top, bottom, or left/right. NOTE: Phaser's setSize(w, h, center) only
     // takes 3 params - passing a 4th offset value here used to silently do
     // nothing, and the truthy 3rd value made it auto-center the box in the
     // middle of the sprite instead, which is why the player used to be able
     // to walk in as far as his waist/chest before colliding. setOffset()
     // must be called separately, after setSize(..., false) disables the
     // auto-centering.
     this.physics.add.existing(this.mangCarding, true);
     this.mangCarding.body.setSize(C4_FRAME_W * 0.6, C4_FRAME_H * 0.85, false);
     this.mangCarding.body.setOffset(C4_FRAME_W * 0.2, C4_FRAME_H * 0.08);
     this.physics.add.collider(this.player, this.mangCarding);
     // Ensure Mang Carding renders below player
     this.mangCarding.setDepth(0);

    // --- HUD --- (scrollFactor 0 so it stays pinned to the screen instead
    // of scrolling away with the map now that the camera follows the player)
    const displayName = character.charAt(0).toUpperCase() + character.slice(1);
    this.add.text(14, 12, displayName, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 18, color: '#fff8e7'
    }).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(900);

    this.add.text(width / 2, 16, 'Chapter 4: The Balut Capital', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 16, color: '#f5e2c8'
    }).setOrigin(0.5, 0).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(900);

    // one shared progress readout, re-labeled per mini-game (see updateProgress)
    this.progressText = this.add.text(width / 2, 38, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#f5e2c8'
    }).setOrigin(0.5, 0).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(900);

    // Wooden-Gold UI icon pack - same plank button used for Start
    // Adventure/Chapters on the Main Menu (see createWoodButton in ui.js),
    // sized down to fit the gameplay HUD.
    const journalBtn = createWoodButton(this, 66, height - 30, 'Journal', () => {
      if (this.mode === 'herding' && !this.locked) {
        this.locked = true;
        this.showJournalModal();
      }
    }, { width: 130, height: 40, fontSize: 14 });
    journalBtn.image.setScrollFactor(0).setDepth(900);
    journalBtn.txt.setScrollFactor(0).setDepth(901);

    const menuBtn = createWoodButton(this, width - 66, height - 30, 'Menu', () => {
      if (!this.locked) { this.locked = true; showPauseMenu(this); }
    }, { width: 130, height: 40, fontSize: 14 });
    menuBtn.image.setScrollFactor(0).setDepth(900);
    menuBtn.txt.setScrollFactor(0).setDepth(901);

    this.add.text(width / 2, height - 12, 'WASD to move · Esc for menu', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#9aa0aa'
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(900);

    // --- curtain-open reveal - opening dialogue waits for it to finish ---
    this.locked = true;
    curtainOpen(this, () => {
      showDialogue(this, 'Mang Carding', [
        'Ay, here you are! Before these streets were crowded with buildings, you could see ducks almost everywhere around here.',
        "I'm Mang Carding, a magbabalut. Done this work most of my life, like a lot of families in Pateros did.",
        "Come on, anak, I need some help today, let's start with the ducks.",
        "See that fenced-off patch over there? Get close to a duck and it'll scoot away from you, use that to steer it toward the pen."
      ], () => {
        this.locked = false;
        this.startDuckHerding();
      }, ['mang-carding-happy', 'mang-carding-explain', 'mang-carding-explain', 'mang-carding-wink']);
    });
  }

  createPlayerAnims(textureKey) {
    const p = this.prefix;
    if (!this.anims.exists(`${p}-walk-down`)) {
      this.anims.create({ key: `${p}-walk-down`, frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 11 }), frameRate: 12, repeat: -1 });
    }
    if (!this.anims.exists(`${p}-walk-up`)) {
      this.anims.create({ key: `${p}-walk-up`, frames: this.anims.generateFrameNumbers(textureKey, { start: 12, end: 19 }), frameRate: 10, repeat: -1 });
    }
    if (!this.anims.exists(`${p}-walk-side`)) {
      this.anims.create({ key: `${p}-walk-side`, frames: this.anims.generateFrameNumbers(textureKey, { start: 24, end: 34 }), frameRate: 12, repeat: -1 });
    }
  }

  // Shared top-center readout, re-labeled for whichever mini-game is active.
  updateProgress() {
    if (!this.progressText) return;
    if (this.mode === 'herding') {
      this.progressText.setText(`Ducks in the pen: ${this.herdedCount || 0}/${CHAPTER4_DUCK_COUNT}`);
    } else if (this.mode === 'eggsorting') {
      this.progressText.setText(`Egg ${this.eggIndex + 1}/${CHAPTER4_EGGS.length}`);
    } else if (this.mode === 'balutstall') {
      this.progressText.setText(`Customer ${this.custIndex + 1}/${CHAPTER4_CUSTOMERS.length}`);
    } else {
      this.progressText.setText('');
    }
  }

  // --- Journal: opens Lolo's Journal (journalBook.js) on top of this scene.
  // The scene is paused while the book is open; the HUD button already set
  // this.locked = true, so hand control back when the book closes.
  showJournalModal() {
    openJournalBook(this, { onClose: () => { this.locked = false; } });
  }

  // ==========================================================================
  // MINI-GAME 1 - Duck Herding
  // Ducks wander at random; getting close spooks one away from the player,
  // which is the only "guidance" tool the player has (per the doc: "no
  // complicated AI"). A duck that ends up inside the pen rectangle settles
  // there for good. Once all 5 are in, the mini-game ends.
  // ==========================================================================
  startDuckHerding() {
    this.mode = 'herding';
    this.herdedCount = 0;

    // pen zone - just a marked rectangle, not a physical fence
    const penCenterX = CHAPTER4_PEN_RECT.x + CHAPTER4_PEN_RECT.width / 2;
    const penCenterY = CHAPTER4_PEN_RECT.y + CHAPTER4_PEN_RECT.height / 2;
    this.add.rectangle(penCenterX, penCenterY, CHAPTER4_PEN_RECT.width, CHAPTER4_PEN_RECT.height, 0xd8b04a, 0.15)
      .setStrokeStyle(3, 0x6b4f30);
    this.add.text(penCenterX, CHAPTER4_PEN_RECT.y - 16, 'Duck Pen', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5, 1);

    // ducks - animated walk-cycle sprite (assets/icons/duck-walk.png),
    // each with its own arcade body
    const hasDuckSheet = this.textures.exists('duck_walk');
    this.ducks = CHAPTER4_DUCK_START.map((pos, i) => {
      const sprite = hasDuckSheet
        ? this.add.sprite(pos.x, pos.y, 'duck_walk', 0).setOrigin(0.5).setScale(CHAPTER4_DUCK_SCALE)
        : this.add.text(pos.x, pos.y, '🦆', { fontSize: 26 }).setOrigin(0.5);
      this.physics.add.existing(sprite);
      sprite.body.setCollideWorldBounds(true);
      sprite.body.setCircle(12, sprite.width / 2 - 12, sprite.height / 2 - 12);
      this.physics.add.collider(sprite, this.map.obstacles);
      return {
        sprite,
        settled: false,
        nextWanderAt: this.time.now + Phaser.Math.Between(CHAPTER4_DUCK_WANDER_MIN_MS, CHAPTER4_DUCK_WANDER_MAX_MS)
      };
    });

    this.updateProgress();
  }

  updateDucks(time) {
    this.ducks.forEach(duck => {
      if (duck.settled) return;
      const s = duck.sprite;

      const distToPlayer = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
      if (distToPlayer < CHAPTER4_DUCK_FLEE_RADIUS) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, s.x, s.y);
        s.body.setVelocity(Math.cos(angle) * CHAPTER4_DUCK_FLEE_SPEED, Math.sin(angle) * CHAPTER4_DUCK_FLEE_SPEED);
        duck.nextWanderAt = time + Phaser.Math.Between(CHAPTER4_DUCK_WANDER_MIN_MS, CHAPTER4_DUCK_WANDER_MAX_MS);
      } else if (time > duck.nextWanderAt) {
        const wanderAngle = Math.random() * Math.PI * 2;
        s.body.setVelocity(Math.cos(wanderAngle) * CHAPTER4_DUCK_WANDER_SPEED, Math.sin(wanderAngle) * CHAPTER4_DUCK_WANDER_SPEED);
        duck.nextWanderAt = time + Phaser.Math.Between(CHAPTER4_DUCK_WANDER_MIN_MS, CHAPTER4_DUCK_WANDER_MAX_MS);
      }

      // Face the direction of travel - only the emoji fallback ('🦆' as a
      // Text object) can't be flipped, real sprites can. A small dead zone
      // around 0 keeps a duck moving mostly up/down from flickering its
      // facing back and forth on tiny horizontal jitter.
      if (typeof s.setFlipX === 'function' && s.body) {
        const vx = s.body.velocity.x;
        if (vx > CHAPTER4_DUCK_FLIP_THRESHOLD) {
          s.setFlipX(CHAPTER4_DUCK_ART_FACES_LEFT_BY_DEFAULT);
        } else if (vx < -CHAPTER4_DUCK_FLIP_THRESHOLD) {
          s.setFlipX(!CHAPTER4_DUCK_ART_FACES_LEFT_BY_DEFAULT);
        }
      }

      // Play the walk cycle while actually moving; hold still (frame 0)
      // during the brief pauses between wander bursts. ignoreIfPlaying
      // (the `true` 2nd arg) keeps this from restarting the anim - and
      // re-flickering its timing - every single frame.
      if (typeof s.play === 'function' && s.body) {
        const moving = s.body.speed > CHAPTER4_DUCK_MOVE_THRESHOLD;
        if (moving) {
          s.play('duck-walk', true);
        } else if (s.anims && s.anims.isPlaying) {
          s.anims.stop();
          s.setFrame(0);
        }
      }

      if (Phaser.Geom.Rectangle.Contains(CHAPTER4_PEN_RECT, s.x, s.y)) {
        this.settleDuck(duck);
      }
    });
  }

  // A duck that crosses into the pen settles there for good. Rather than
  // just freezing on the spot (which usually meant right at the edge it
  // wandered in from), it's walked to one of the open slots near the
  // pen's center, then given a small idle waddle so the pen still feels
  // alive once it's full instead of a pile of frozen sprites.
  settleDuck(duck) {
    const s = duck.sprite;
    duck.settled = true;
    s.body.setVelocity(0, 0);
    this.physics.world.disable(s); // fully hand off from physics to a plain tween

    const slot = CHAPTER4_PEN_SLOTS[this.herdedCount] || CHAPTER4_PEN_SLOTS[0];

    // Face the slot before walking to it - once physics is disabled above,
    // updateDucks() (which normally handles facing) skips this duck for
    // good (it returns early on duck.settled), so without this the sprite
    // just keeps whatever facing it happened to have when it wandered into
    // the pen and glides into its slot however that faces - backwards half
    // the time, which reads as the duck moonwalking into the pen.
    if (typeof s.setFlipX === 'function') {
      const dx = slot.x - s.x;
      if (dx > CHAPTER4_DUCK_FLIP_THRESHOLD) {
        s.setFlipX(CHAPTER4_DUCK_ART_FACES_LEFT_BY_DEFAULT);
      } else if (dx < -CHAPTER4_DUCK_FLIP_THRESHOLD) {
        s.setFlipX(!CHAPTER4_DUCK_ART_FACES_LEFT_BY_DEFAULT);
      }
    }
    if (typeof s.play === 'function') {
      s.play('duck-walk', true);
    }

    this.tweens.add({
      targets: s,
      x: slot.x,
      y: slot.y,
      duration: 380,
      ease: 'Sine.easeOut',
      onComplete: () => {
        // Swap from the walk-cycle sheet to the wing-flap loop now that
        // the duck has somewhere to be smug about - the settle-in-place
        // wobble tween below still moves the sprite around, so it reads
        // as a duck happily flapping and shuffling in place, not frozen.
        if (typeof s.play === 'function') {
          s.play('duck-idle', true);
        }
        this.tweens.add({
          targets: s,
          x: slot.x + Phaser.Math.Between(-6, 6),
          y: slot.y + Phaser.Math.Between(-4, 4),
          duration: Phaser.Math.Between(900, 1400),
          delay: Phaser.Math.Between(0, 400),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });

    this.herdedCount++;
    this.updateProgress();
    if (this.herdedCount >= CHAPTER4_DUCK_COUNT) this.finishDuckHerding();
  }

  finishDuckHerding() {
    this.mode = 'between';
    this.locked = true;
    this.player.setVelocity(0, 0);
    showDialogue(this, 'Mang Carding', [
      "Good! They're all settled in the pen.",
      "Now come with me, let's check on the eggs."
    ], () => this.startEggSorting(), ['mang-carding-happy', 'mang-carding-explain']);
  }

  // ==========================================================================
  // MINI-GAME 2 - Egg Sorting
  // Simple two-choice sort, one egg at a time, with a short fact after each
  // pick - same "answer -> feedback -> continue" shape as the end-chapter quiz.
  // ==========================================================================
  startEggSorting() {
    this.mode = 'eggsorting';
    this.eggIndex = 0;
    this.locked = true;
    this.updateProgress();
    this.showEggQuestion();
  }

  // Panel content is laid out top-down from a running `cursor` instead of
  // fixed offsets from the center, and each step advances the cursor by the
  // PREVIOUS element's *actual* rendered height (descTxt.height etc, not a
  // guess) - so wrapped text of any length is accounted for and nothing
  // after it can ever get pushed past the bottom of the panel.
  showEggQuestion() {
    const { width, height } = this.scale;
    const egg = CHAPTER4_EGGS[this.eggIndex];
    this.updateProgress();
    const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);

    const panelW = 520;
    const panelH = 410;
    const panelTop = height / 2 - panelH / 2;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, panelW, panelH, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);

    let cursor = panelTop + 26;
    const title = this.add.text(width / 2, cursor, 'Egg Sorting', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 19, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    cursor += 26;

    const subtitle = this.add.text(width / 2, cursor, 'Sort each egg - keep incubating it, or set it aside?', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#6b4a2f'
    }).setOrigin(0.5);
    cursor += 32;

    const eggIcon = this.textures.exists('icon_egg')
      ? this.add.image(width / 2, cursor, 'icon_egg').setDisplaySize(41, 44).setOrigin(0.5)
      : this.add.text(width / 2, cursor, '🥚', { fontSize: 30 }).setOrigin(0.5);
    cursor += eggIcon.displayHeight + 6; // was a fixed 36 tuned for the old emoji glyph

    const descTxt = this.add.text(width / 2, cursor, egg.desc, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#3b2410', align: 'center',
      wordWrap: { width: 460 }
    }).setOrigin(0.5, 0);
    cursor += descTxt.height + 26;

    container.add([overlay, panel, title, subtitle, eggIcon, descTxt]);

    const options = [
      { key: 'incubation', label: 'Keep Incubating' },
      { key: 'not_ready', label: 'Set Aside' }
    ];
    const optionGap = 46;
    const optionsStartY = cursor;
    const feedbackY = optionsStartY + options.length * optionGap;
    const optionButtons = [];
    options.forEach((opt, i) => {
      const y = optionsStartY + i * optionGap;
      const { rect, txt } = createButton(this, width / 2, y, opt.label, () => {
        this.handleEggAnswer(container, optionButtons, egg, opt.key, feedbackY);
      }, { width: 300, height: 38, fontSize: 15 });
      optionButtons.push({ rect, key: opt.key });
      container.add([rect, txt]);
    });
  }

  handleEggAnswer(container, optionButtons, egg, selectedKey, feedbackY) {
    const isCorrect = selectedKey === egg.correct;
    optionButtons.forEach(({ rect, key }) => {
      rect.disableInteractive();
      if (key === egg.correct) rect.setFillStyle(0x3c7a3e, 0.92);
      else if (key === selectedKey) rect.setFillStyle(0xc24a38, 0.92);
      else rect.setFillStyle(0x9c3b2e, 0.35);
    });

    const { width } = this.scale;
    let cursor = feedbackY;
    const verdict = this.add.text(width / 2, cursor, isCorrect ? 'Correct!' : 'Not quite.', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 15, fontStyle: 'bold',
      color: isCorrect ? '#3c7a3e' : '#9c3b2e'
    }).setOrigin(0.5);
    cursor += 24;

    const explanationTxt = this.add.text(width / 2, cursor, egg.explanation, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#3b2410', align: 'center',
      wordWrap: { width: 460 }
    }).setOrigin(0.5, 0);
    cursor += explanationTxt.height + 22;
    container.add([verdict, explanationTxt]);

    const { rect, txt } = createButton(this, width / 2, cursor, 'Continue', () => {
      container.destroy();
      this.eggIndex++;
      if (this.eggIndex < CHAPTER4_EGGS.length) {
        this.showEggQuestion();
      } else {
        this.finishEggSorting();
      }
    }, { width: 150, height: 38, fontSize: 15, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);
  }

  finishEggSorting() {
    showDialogue(this, 'Mang Carding', [
      "Careful hands, anak, that's how it's done.",
      "The good ones go on to become balut. Come, one more thing before we're through."
    ], () => this.startBalutStall(), ['mang-carding-happy', 'mang-carding-explain']);
  }

  // ==========================================================================
  // MINI-GAME 3 - Balut Stall
  // Customer asks for one of three items, player taps the matching button.
  // No real economy, just request -> choice -> correct/incorrect, per the doc.
  // ==========================================================================
  startBalutStall() {
    this.mode = 'balutstall';
    this.custIndex = 0;
    this.updateProgress();
    this.showCustomerRequest();
  }

  showCustomerRequest() {
    const { width, height } = this.scale;
    const customer = CHAPTER4_CUSTOMERS[this.custIndex];
    this.updateProgress();
    const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);

    const panelW = 520;
    const panelH = 410;
    const panelTop = height / 2 - panelH / 2;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, panelW, panelH, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);

    let cursor = panelTop + 30;
    const title = this.add.text(width / 2, cursor, 'Balut Stall', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 19, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    cursor += 40;

    const custIcon = this.add.text(width / 2, cursor, '🧑', { fontSize: 30 }).setOrigin(0.5);
    cursor += 40;

    const lineTxt = this.add.text(width / 2, cursor, customer.line, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#3b2410', align: 'center', fontStyle: 'italic',
      wordWrap: { width: 460 }
    }).setOrigin(0.5, 0);
    cursor += lineTxt.height + 26;

    container.add([overlay, panel, title, custIcon, lineTxt]);

    const options = [
      { key: 'balut', label: 'Balut 🥚' },
      { key: 'eggs', label: 'Eggs 🍳' },
      { key: 'drink', label: 'Drink 🥤' }
    ];
    const optionGap = 46;
    const optionsStartY = cursor;
    const feedbackY = optionsStartY + options.length * optionGap;
    const optionButtons = [];
    options.forEach((opt, i) => {
      const y = optionsStartY + i * optionGap;
      const { rect, txt } = createButton(this, width / 2, y, opt.label, () => {
        this.handleCustomerAnswer(container, optionButtons, customer, opt.key, feedbackY);
      }, { width: 300, height: 38, fontSize: 15 });
      optionButtons.push({ rect, key: opt.key });
      container.add([rect, txt]);
    });
  }

  handleCustomerAnswer(container, optionButtons, customer, selectedKey, feedbackY) {
    const isCorrect = selectedKey === customer.correct;
    optionButtons.forEach(({ rect, key }) => {
      rect.disableInteractive();
      if (key === customer.correct) rect.setFillStyle(0x3c7a3e, 0.92);
      else if (key === selectedKey) rect.setFillStyle(0xc24a38, 0.92);
      else rect.setFillStyle(0x9c3b2e, 0.35);
    });

    const { width } = this.scale;
    const verdict = this.add.text(width / 2, feedbackY, isCorrect ? 'The customer is happy!' : "That's not what they asked for.", {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 14, fontStyle: 'bold',
      color: isCorrect ? '#3c7a3e' : '#9c3b2e'
    }).setOrigin(0.5);
    container.add(verdict);

    const { rect, txt } = createButton(this, width / 2, feedbackY + 40, 'Continue', () => {
      container.destroy();
      this.custIndex++;
      if (this.custIndex < CHAPTER4_CUSTOMERS.length) {
        this.showCustomerRequest();
      } else {
        this.finishBalutStall();
      }
    }, { width: 150, height: 38, fontSize: 15, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);
  }

  finishBalutStall() {
    showDialogue(this, 'Mang Carding', [
      'Pateros became famous for balut, back in the 1950s, historical accounts say this town had around 400,000 ducks.',
      "But by the 1970s, growing crowds and a polluted river made it hard to keep that many ducks.",
      "Still, some of us keep the tradition going. Now, let's see what you remember."
    ], () => this.startQuiz(), ['mang-carding-explain', 'mang-carding-happy', 'mang-carding-wink']);
  }

  // --- End-of-chapter quiz -------------------------------------------------
  startQuiz() {
    this.mode = 'quiz';
    this.updateProgress();
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizQuestions = [
      {
        q: 'Who is Mang Carding meant to represent?',
        options: ['An elderly magbabalut representing Pateros\' duck-raising heritage', 'A Spanish colonial official', 'A modern-day fisherman', 'A revolutionary soldier'],
        correct: 0,
        explanation: 'Mang Carding is a fictionalized magbabalut (balut maker) character representing the duck-raising families who shaped Pateros\' identity.'
      },
      {
        q: 'What is Pateros historically famous for producing?',
        options: ['Balut (fertilized duck eggs)', 'Bagoong (fermented fish paste)', 'Patis (fish sauce)', 'Woven mats (banig)'],
        correct: 0,
        explanation: 'Duck raising and balut production became closely tied to Pateros\' identity over generations.'
      },
      {
        q: 'About how many ducks did historical accounts estimate Pateros had during the 1950s?',
        options: ['Around 400,000', 'About 40,000', 'Around 150,000', 'Nearly 1 million'],
        correct: 0,
        explanation: 'Historical accounts estimate Pateros had around 400,000 ducks during the 1950s, before urbanization and a polluted river drove the ducks away in the 1970s.'
      }
    ];
    this.showQuizQuestion();
  }

showQuizQuestion() {
     const { width, height } = this.scale;
     const qData = shuffleQuizOptions(this.quizQuestions[this.quizIndex]);
     const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, 540, 420, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    // Kept so showQuizFeedback() can grow the panel downward if a long
    // explanation wraps to more lines than the base 420px height allows for.
    this.quizPanel = panel;
    this.quizPanelTop = panel.y - panel.height / 2;
    const qNum = this.add.text(width / 2, height / 2 - 164, `Question ${this.quizIndex + 1} / ${this.quizQuestions.length}`, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#9c3b2e'
    }).setOrigin(0.5);
    const qText = this.add.text(width / 2, height / 2 - 138, qData.q, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 19, color: '#3b2410', align: 'center',
      wordWrap: { width: 460 }
    }).setOrigin(0.5, 0);

    container.add([overlay, panel, qNum, qText]);

    const optionButtons = [];
    // A fixed 42px pitch between options assumed every answer fit on one
    // line - true for short options, but Chapter 4 has some noticeably
    // longer answer text (e.g. full role descriptions) that wraps to two
    // lines at this width/font size and needs a taller button, or it
    // overlaps the option below it. Measure each option's actual wrapped
    // height first, then lay them out back-to-back with a fixed gap instead
    // of assuming a uniform single-line height.
    const optionFontSize = 15;
    const optionWidth = 440;
    const minOptionH = 36;
    const optionGap = 10;
    let cursorY = height / 2 - 60;
    qData.options.forEach((opt, i) => {
      const measure = this.add.text(0, 0, opt, {
        fontFamily: '"Tildunk", Georgia, serif', fontSize: optionFontSize, align: 'center',
        wordWrap: { width: optionWidth - 24 }
      }).setVisible(false);
      const btnH = Math.max(minOptionH, measure.height + 14);
      measure.destroy();

      const y = cursorY + btnH / 2;
      const { rect, txt } = createButton(this, width / 2, y, opt, () => {
        this.showQuizFeedback(container, optionButtons, qData, i);
      }, { width: optionWidth, height: btnH, fontSize: optionFontSize });
      optionButtons.push({ rect, index: i });
      container.add([rect, txt]);
      cursorY += btnH + optionGap;
    });
    // Where showQuizFeedback should start stacking the verdict/explanation/
    // Continue button - below the last option regardless of how tall the
    // options ended up being.
    this.quizOptionsBottom = cursorY - optionGap;
  }

  // Locks the options, highlights the correct one (and the wrong pick, if any),
  // then shows a short explanation + Continue button before moving on.
  showQuizFeedback(container, optionButtons, qData, selectedIndex) {
    const isCorrect = selectedIndex === qData.correct;
    SoundManager.play(this, isCorrect ? 'correct' : 'incorrect');

    optionButtons.forEach(({ rect, index }) => {
      rect.disableInteractive();
      if (index === qData.correct) {
        rect.setFillStyle(0x3c7a3e, 0.92); // correct answer -> green
      } else if (index === selectedIndex) {
        rect.setFillStyle(0xc24a38, 0.92); // wrong pick -> red
      } else {
        rect.setFillStyle(0x9c3b2e, 0.35); // the rest -> dimmed
      }
    });

    const { width, height } = this.scale;
    // Anchor to whichever is lower: the original fixed spot, or just below
    // the last option button (which may have grown taller than the default
    // single-line height - see showQuizQuestion).
    const verdictY = Math.max(height / 2 + 96, (this.quizOptionsBottom ?? (height / 2 - 60)) + 20);
    const verdict = this.add.text(width / 2, verdictY, isCorrect ? 'Correct!' : 'Not quite.', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 17, fontStyle: 'bold',
      color: isCorrect ? '#3c7a3e' : '#9c3b2e'
    }).setOrigin(0.5);
    const explanationTxt = this.add.text(width / 2, verdictY + 22, qData.explanation || '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#3b2410', align: 'center',
      wordWrap: { width: 460 }
    }).setOrigin(0.5, 0);

    container.add([verdict, explanationTxt]);

    // Continue sits below wherever the explanation text actually ends -
    // longer explanations (or a wider font) can wrap to 3 lines instead of
    // 2, and a fixed offset here let the button overlap the last line.
    const continueY = explanationTxt.y + explanationTxt.height + 24;

    // If that pushes the button past the panel's original bottom edge,
    // grow the panel downward (top edge stays put) so the button - and the
    // last line of explanation text - stay inside the cream box instead of
    // spilling past its border.
    const requiredBottom = continueY + 20 + 16;
    if (this.quizPanel && requiredBottom > this.quizPanel.y + this.quizPanel.height / 2) {
      const newHeight = requiredBottom - this.quizPanelTop;
      this.quizPanel.setSize(540, newHeight);
      this.quizPanel.y = this.quizPanelTop + newHeight / 2;
    }

    const { rect, txt } = createButton(this, width / 2, continueY, 'Continue', () => {
      container.destroy();
      this.answerQuiz(isCorrect);
    }, { width: 160, height: 40, fontSize: 16, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);
  }

  answerQuiz(correct) {
    if (correct) this.quizScore++;
    this.quizIndex++;
    if (this.quizIndex < this.quizQuestions.length) {
      this.showQuizQuestion();
    } else {
      this.finishChapter();
    }
  }

  finishChapter() {
    SoundManager.play(this, 'complete');
    this.mode = 'done';
    this.updateProgress();
    const pages = this.registry.get('journalPages') || [];
    if (!pages.includes(4)) pages.push(4);
    this.registry.set('journalPages', pages);
    // Persist the page too, so it is still readable after a reload.
    ChapterProgress.addJournalPage(4);
    // Persist to localStorage so Chapter 5 shows up unlocked in the main
    // menu's Chapter list even after a page reload.
    ChapterProgress.unlockNextAfter('Chapter4');

    // A short wrap-up from Mang Carding before the reward panel, so the
    // chapter closes out like the rest of the conversation instead of
    // cutting straight to a modal the instant the quiz ends.
    this.locked = true;
    showDialogue(this, 'Mang Carding', [
      'You\'d have made a fine magbabalut, anak.',
      'Hold onto that page, one more stop before this journal is complete.'
    ], () => this.showJournalReward(), ['mang-carding-happy', 'mang-carding-wink']);
  }

  showJournalReward() {
    // Chapter 5 doesn't exist yet - if/when Chapter5Scene is added to
    // main.js's scene list, this automatically starts it instead of
    // falling back to the menu, no other change needed here.
    const chapter5Ready = !!this.scene.manager.keys['Chapter5'];

const { width, height } = this.scale;
     const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, 460, 240, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    const title = this.add.text(width / 2, height / 2 - 80, 'Journal Page #4 Unlocked!', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    const scoreTxt = this.add.text(width / 2, height / 2 - 34, `You remembered ${this.quizScore} / ${this.quizQuestions.length}.`, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#3b2410'
    }).setOrigin(0.5);
    const flavor = this.add.text(width / 2, height / 2, chapter5Ready
      ? 'The Balut Capital — recorded in the journal. Chapter 5 awaits.'
      : 'The Balut Capital — recorded in the journal. Chapter 5 is still being written — more adventures coming soon!', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 14, color: '#6b4a2f', align: 'center', wordWrap: { width: 380 }
    }).setOrigin(0.5, 0);

    container.add([overlay, panel, title, scoreTxt, flavor]);

    const { rect, txt } = createButton(this, width / 2 + 95, height / 2 + 88, chapter5Ready ? 'Continue' : 'Back to Menu', () => {
      curtainClose(this, () => this.scene.start(chapter5Ready ? 'Chapter5' : 'Menu'));
    }, { width: 170, height: 44, fontSize: 17, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);

    // Lets the player read the page they just collected before moving on.
    JournalBook.addReadButton(this, container, 4, width / 2 - 95, height / 2 + 88, { width: 170, height: 44, fontSize: 16 });
  }

  update(time) {
    if (this.mode === 'herding' && !this.locked) {
      this.updateDucks(time);
    }

    if (this.locked || this.mode !== 'herding') {
      if (this.player.body) this.player.setVelocity(0, 0);
      SoundManager.setFootsteps(this, false);
      return;
    }

    const left = this.keys.left.isDown || this.cursors.left.isDown;
    const right = this.keys.right.isDown || this.cursors.right.isDown;
    const up = this.keys.up.isDown || this.cursors.up.isDown;
    const down = this.keys.down.isDown || this.cursors.down.isDown;

    let vx = 0, vy = 0;
    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    const moving = vx !== 0 || vy !== 0;
    SoundManager.setFootsteps(this, moving);

    if (moving) {
      const len = Math.hypot(vx, vy);
      this.player.setVelocity((vx / len) * this.speed, (vy / len) * this.speed);

      if (vy < 0) this.player.facing = 'up';
      else if (vy > 0) this.player.facing = 'down';
      else if (vx !== 0) { this.player.facing = 'side'; this.player.flipX = vx > 0; }

      this.player.play(`${this.prefix}-walk-${this.player.facing}`, true);
    } else {
      this.player.setVelocity(0, 0);
      this.player.anims.stop();
      const idleFrame = { down: 0, up: 12, side: 24 }[this.player.facing];
      this.player.setFrame(idleFrame);
    }
  }
}