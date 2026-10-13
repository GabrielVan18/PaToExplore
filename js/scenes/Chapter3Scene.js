const C3_FRAME_W = 44;
const C3_FRAME_H = 78;

// NOTE: INTERACT_RADIUS is declared once in Chapter1Scene.js (loaded before
// this file in index.html) and reused here as-is.

// ---------------------------------------------------------------------------
// MAP DATA - exported straight from the map editor (editor.html -> "Export
// JSON" for the chapter3_historical_area map). This is a verbatim copy of
// that JSON; re-export from the editor and paste the object over this one
// any time the grounds layout changes, no other code below needs to change
// as long as new tile/object keys still follow the editor's normal
// "<prefix>_<number>" naming (see resolveChapter3TileImagePath /
// resolveChapter3ObjectImagePath). Per the story doc, the mood shifts here -
// darker, more serious than the plaza/old-town chapters - so a low-alpha
// dark overlay is still laid over the whole map in create() for tone.
// ---------------------------------------------------------------------------
const CHAPTER3_MAP_DATA = {
  "name": "chapter3_historical_area",
  "cols": 48,
  "rows": 32,
  "tileSize": 32,
  "spawn": {
    "col": 23,
    "row": 26,
    "x": 752,
    "y": 848
  },
  "tileTypes": {
    "0": {
      "name": "grass",
      "color": "#3a6b45",
      "solid": false,
      "imageKey": "fieldsTile_38"
    },
    "1": {
      "name": "tree",
      "color": "#1f3f27",
      "solid": true
    },
    "2": {
      "name": "water",
      "color": "#2e5f8a",
      "solid": true
    },
    "3": {
      "name": "path",
      "color": "#6b4f30",
      "solid": false,
      "imageKey": "fieldsTile_01"
    },
    "4": {
      "name": "sand",
      "color": "#d9c08a",
      "solid": false
    },
    "5": {
      "name": "wall",
      "color": "#7a5a42",
      "solid": true
    }
  },
  "tiles": [
    "555555555555555555555555555555555555555555555555",
    "500000005000000000000003300000000000005000000005",
    "500000005000000000000003300000000000005000000005",
    "500000005000000000000003300000000000005000000005",
    "500000005555555000000003300000000000005000000005",
    "500000000000000000000003300000000000005000000005",
    "500000000000000000000003300000000000005000000005",
    "500000000000000000000003300000000000005000000005",
    "500000005555555000000003300000000000005000000005",
    "500000005000000000000003300000000000005000000005",
    "500000005000000000000003300000000000055000000005",
    "500000005000000000000003300000000000050000000005",
    "500000005000000000000003300000000000050000000005",
    "500000005000000000000003300000000000055555000005",
    "500000005000000000000003300000000000000000000005",
    "500000005000000000000003300000000000000000000005",
    "500000005000000000000003300000000000000000000005",
    "500000005000000000000003300000000000000000000005",
    "500000005000000000000003300000000000000000000005",
    "500000005000000000000003300000000000000000000005",
    "500000005000000000000003300000000000000000000005",
    "500000005000000000000003300000000055555555500005",
    "500000005000000000000003300000000050000000500005",
    "500000005000000000000003300000000050000000500005",
    "500000005000000000000003300000000050000000500005",
    "500000005555555555555503300000000050000000500005",
    "500000005000000000000003300000000050000000500005",
    "500000005000000000000003300000000050000000500005",
    "500000005555555555555503300000000050000000000005",
    "500000000000000000000003300000000050000000000005",
    "500000000000000000000003300000000050000000000005",
    "555555555555555555555555555555555555555555555555"
  ],
  "objects": [
    {
      "key": "flag",
      "name": "Torn Flag",
      "col": 8,
      "row": 6,
      "x": 272,
      "y": 208,
      "w": 46,
      "h": 46,
      "color": "#9c3b2e",
      "collidable": false,
      "info": "Pateros had its own Katipunan chapter, the Sangguniang Balangay Magtanggol, founded in April 1896."
    },
    {
      "key": "letter",
      "name": "Hidden Letter",
      "col": 40,
      "row": 7,
      "x": 1296,
      "y": 240,
      "w": 46,
      "h": 46,
      "color": "#6b4a2f",
      "collidable": false,
      "info": "On August 22, 1896, the Pateros Katipunan received the first warning of the coming uprising from Bonifacio's council."
    },
    {
      "key": "armband",
      "name": "Katipunan Armband",
      "col": 24,
      "row": 16,
      "x": 784,
      "y": 528,
      "w": 46,
      "h": 46,
      "color": "#3b2410",
      "collidable": false,
      "info": "Katipuneros took secret names called sagisag. Macario Almeda of Pateros used the name Kidlat."
    },
    {
      "key": "supplies",
      "name": "Buried Supplies",
      "col": 12,
      "row": 24,
      "x": 400,
      "y": 784,
      "w": 46,
      "h": 46,
      "color": "#5a4a30",
      "collidable": false,
      "info": "In the last days of August 1896, foundries in Pateros hurried to forge talibong, long blades, for the uprising."
    },
    {
      "key": "marker",
      "name": "Meeting Marker",
      "col": 38,
      "row": 25,
      "x": 1232,
      "y": 816,
      "w": 46,
      "h": 46,
      "color": "#4a3624",
      "collidable": false,
      "info": "The Pateros chapter was organized in secret at a house in Barrio Santo Rosario."
    }
  ]
};

// The 5 hidden revolutionary-era objects Hiraya needs to find are placed in
// the editor like any other object, just with these specific keys so this
// scene can pick them out of CHAPTER3_MAP_DATA.objects and wire up the
// find/interact logic below. Everything else in .objects is treated as
// non-interactive scenery.
const CHAPTER3_QUEST_KEYS = ['flag', 'letter', 'armband', 'supplies', 'marker'];

// Real art for the 5 hidden-message objects above (see preload() - loaded
// separately since CHAPTER3_QUEST_KEYS is excluded from the generic
// object loader). The icon pack's names don't match these keys 1:1, so
// they're paired by what they depict: a torn flag -> hidden-flag, a
// letter -> secret-letter, buried supplies -> a bamboo tube (a common way
// to cache small items), a meeting marker -> a safehouse mark, and the
// Katipunan armband -> the anting-anting (the pack's other small worn/
// carried item). Sizes keep each icon's native aspect ratio.
const CHAPTER3_QUEST_ICONS = {
  flag: { key: 'quest_flag', w: 29, h: 55 },
  letter: { key: 'quest_letter', w: 38, h: 55 },
  supplies: { key: 'quest_supplies', w: 44, h: 44 },
  marker: { key: 'quest_marker', w: 27, h: 44 },
  armband: { key: 'quest_armband', w: 40, h: 44 }
};

// Unlike Chapter 1's always-labeled objects, these stay a mystery ("?")
// until found - closer to Chapter 2's "Empty Plot" treatment - since the
// whole point of this mini-game is that they're *hidden*. This short label
// ("REVOLUTIONARY MESSAGE" vs "HISTORICAL CLUE") isn't something the map
// editor stores, so it's kept here as flavor metadata and prefixed onto
// each object's info text pulled from CHAPTER3_MAP_DATA.
const CHAPTER3_INFO_LABELS = {
  flag: 'REVOLUTIONARY MESSAGE',
  letter: 'HISTORICAL CLUE',
  armband: 'HISTORICAL CLUE',
  supplies: 'REVOLUTIONARY MESSAGE',
  marker: 'HISTORICAL CLUE'
};

// Same procedural tile painters mapLoader.js uses for the built-in tile
// types (grass/tree/water/path/sand/wall) - reused here so a tile type
// with no `imageKey` (e.g. this map's "wall") still gets real texture
// instead of a flat color fill, exactly like the editor's own preview does.
const CHAPTER3_BUILTIN_DRAWERS = {
  grass: drawGrass, tree: drawTree, water: drawWater,
  path: drawPath, sand: drawSand, wall: drawWall
};

// ---------------------------------------------------------------------------
// Asset-path resolvers - mirror editor.html's TILE_LIBRARY / OBJECT_LIBRARY
// naming so any tile/object key coming out of the map editor resolves to
// the right file under assets/src automatically, without needing a manual
// key->path table kept in sync by hand.
// ---------------------------------------------------------------------------
const CHAPTER3_TILE_KEY_SPECS = {
  fieldsTile: { dir: 'assets/src/1 Tiles', file: 'FieldsTile' },
  groundPath: { dir: 'assets/src/11 Ground Paths', file: 'GroundPath' },
  grassPathBlend: { dir: 'assets/src/12 Grass Path Blends', file: 'GrassPathBlend' },
  pathGrassBlend2: { dir: 'assets/src/13 Path Grass Blends 2', file: 'PathGrassBlend2' },
  specialGround: { dir: 'assets/src/14 Special Ground Patterns', file: 'SpecialGround' }
};
function resolveChapter3TileImagePath(key) {
  const m = key.match(/^(.+)_(\d+)$/);
  if (!m) return null;
  const spec = CHAPTER3_TILE_KEY_SPECS[m[1]];
  if (!spec) return null;
  return `${spec.dir}/${spec.file}_${m[2]}.png`;
}

const CHAPTER3_OBJECT_FOLDER_SPECS = {
  shadow: { base: 'assets/src/2 Objects', folder: '1 Shadow' },
  stone: { base: 'assets/src/2 Objects', folder: '2 Stone' },
  decor: { base: 'assets/src/2 Objects', folder: '3 Decor' },
  box: { base: 'assets/src/2 Objects', folder: '4 Box' },
  grass: { base: 'assets/src/2 Objects', folder: '5 Grass' },
  tent: { base: 'assets/src/2 Objects', folder: '6 Tent' },
  house: { base: 'assets/src/2 Objects', folder: '7 House' },
  bench: { base: 'assets/src/2 Objects', folder: '8 Bench' },
  lamp: { base: 'assets/src/2 Objects', folder: '9 Lamp' },
  fountain: { base: 'assets/src/2 Objects', folder: '10 Fountain' },
  vegetation: { base: 'assets/src/2 Objects', folder: '11 Vegetation' },
  border: { base: 'assets/src/2 Objects', folder: '12 Border' },
  building: { base: 'assets/src/2 Objects', folder: '13 Building' },
  plant: { base: 'assets/src', folder: '4 Plants' },
  supply: { base: 'assets/src', folder: '5 Supplies' },
  road1grass: { base: 'assets/src', folder: '6 Road1 Grass' },
  road1ground: { base: 'assets/src', folder: '7 Road1 Ground' },
  road2: { base: 'assets/src', folder: '8 Road2' },
  road2grass: { base: 'assets/src', folder: '9 Road2 Grass' },
  road2ground: { base: 'assets/src', folder: '10 Road2 Ground' }
};
function resolveChapter3ObjectImagePath(key) {
  if (key === 'obj_towerspot1') return 'assets/src/2 Objects/PlaceForTower1.png';
  if (key === 'obj_towerspot2') return 'assets/src/2 Objects/PlaceForTower2.png';
  const fenceMatch = key.match(/^obj_fence_(\d+)$/);
  if (fenceMatch) return `assets/src/1.1 Tiles/Tile2_${fenceMatch[1]}.png`;
  const m = key.match(/^obj_([a-z0-9]+)_(\d+)$/);
  if (!m) return null;
  const spec = CHAPTER3_OBJECT_FOLDER_SPECS[m[1]];
  if (!spec) return null;
  return `${spec.base}/${spec.folder}/${m[2]}.png`;
}

function chapter3HexToInt(css, fallback) {
  if (!css) return fallback;
  const n = parseInt(css.replace('#', ''), 16);
  return Number.isNaN(n) ? fallback : n;
}

// Builds the tileTypes config loadMap() expects (see mapLoader.js) straight
// out of CHAPTER3_MAP_DATA.tileTypes: real art where an imageKey is given,
// the matching procedural painter otherwise.
function buildChapter3TileTypes(mapData) {
  const cfg = {};
  Object.entries(mapData.tileTypes).forEach(([id, t]) => {
    cfg[id] = {
      name: t.name,
      color: chapter3HexToInt(t.color, 0x888888),
      solid: !!t.solid,
      imageKey: t.imageKey || undefined,
      noFlipY: true, // real art tiles (and hand-painted trees) shouldn't mirror
      draw: t.imageKey ? undefined : CHAPTER3_BUILTIN_DRAWERS[t.name]
    };
  });
  return cfg;
}

// ==========================================================================
// MINI-GAME 2 - Dodge the Patrol
// A real-time sneak across the grounds, played out instead of read off a
// card: Spanish patrol guards walk fixed beats, each lit by a visible
// "notice" radius, while Hiraya moves freely (WASD/arrows) to reach every
// hidden message scattered around the field without being spotted. Same
// "some things had to stay hidden" lesson the old sorting panel taught,
// just felt as movement + risk instead of a click-through quiz - closer
// in spirit to Chapter 1's River Run than to the other chapters' second
// mini-games.
// ==========================================================================
const CHAPTER3_PATROL_START_LIVES = 3;
const CHAPTER3_PATROL_PLAYER_SPEED = 190; // px/sec, free 2D movement (not lane-locked)
const CHAPTER3_PATROL_CAUGHT_INVULN_MS = 1100; // brief breathing room right after being spotted
const CHAPTER3_PATROL_CATCH_RADIUS = 30; // how close to a message counts as "picked up"

// The messages to sneak across the field, one per pickup. Flavor text
// keeps the "some things had to stay hidden" lesson the old Coded
// Message mini-game taught, just delivered as a toast on pickup instead
// of a multiple-choice panel.
const CHAPTER3_PATROL_MESSAGES = [
  { emoji: '📜', label: 'a meeting place and time', note: 'Meeting details had to stay hidden — if the authorities learned them, it could mean capture.' },
  { emoji: '📜', label: 'a list of fellow members', note: 'Names of members were some of the most dangerous information to let slip.' },
  { emoji: '✉️', label: 'a coded supply request', note: 'A request for supplies could give the whole movement away if the wrong person read it.' },
  { emoji: '✉️', label: 'a warning for a safehouse', note: 'Warnings had to reach the right hands quickly, and quietly.' }
];

// Where each message waits, as fractions of the playfield - two just past
// the lower guard's beat, two more past all three, so reaching the far
// pair means timing multiple patrols instead of just one.
const CHAPTER3_PATROL_MESSAGE_SPOTS = [
  { x: 0.24, y: 0.54 },
  { x: 0.76, y: 0.54 },
  { x: 0.24, y: 0.14 },
  { x: 0.76, y: 0.14 }
];

// Each guard walks a fixed straight line, back and forth, forever.
// Positions are fractions of the playfield (from/to along the beat,
// fixed = the cross-axis position) so the beat scales with whatever
// resolution the game runs at - same idea as CHAPTER1_RIVER_LANE_X using
// offsets instead of hard pixel coordinates. `radius` is how close the
// player can get (in px) before being spotted.
const CHAPTER3_PATROL_GUARDS = [
  { axis: 'x', from: 0.16, to: 0.84, fixed: 0.30, speed: 95, radius: 72 },
  { axis: 'y', from: 0.22, to: 0.78, fixed: 0.52, speed: 80, radius: 68 },
  { axis: 'x', from: 0.20, to: 0.80, fixed: 0.74, speed: 115, radius: 76 }
];

class Chapter3Scene extends Phaser.Scene {
  constructor() {
    super('Chapter3');
  }

  preload() {
    // Everything the grounds need is derived straight from
    // CHAPTER3_MAP_DATA: load each tile type's image (if it has one) and
    // each placed object's image (if its key resolves to one under
    // assets/src). Quest keys (flag/letter/armband/supplies/marker) aren't
    // covered by that generic resolver, so their icons are loaded
    // explicitly below (see CHAPTER3_QUEST_ICONS).
    this.load.image('quest_flag', 'assets/icons/ch3-hidden-flag.png');
    this.load.image('quest_letter', 'assets/icons/ch3-secret-letter.png');
    this.load.image('quest_supplies', 'assets/icons/ch3-bamboo-tube.png');
    this.load.image('quest_marker', 'assets/icons/ch3-safehouse-mark.png');
    this.load.image('quest_armband', 'assets/icons/ch3-anting-anting.png');

    // Dodge the Patrol (MINI-GAME 2, below) - Spanish guard walk-cycle,
    // same 12-wide grid convention as the player sheets: 54x96 frames,
    // row0 = front/down (12), row1 = back/up (12), row2 = side-profile
    // (11, faces left by default - flipped to face right same as the
    // player sheets do). See createPatrolGuardAnims().
    this.load.spritesheet('patrol-guard-sheet', 'assets/sprites/ch3-patrol-guard.png', { frameWidth: 54, frameHeight: 96 });

    Object.values(CHAPTER3_MAP_DATA.tileTypes).forEach(t => {
      if (t.imageKey) {
        const path = resolveChapter3TileImagePath(t.imageKey);
        if (path) this.load.image(t.imageKey, path);
        else console.warn('Chapter3Scene: no path resolver for tile image key', t.imageKey);
      }
    });

    const loadedObjectKeys = new Set();
    CHAPTER3_MAP_DATA.objects.forEach(o => {
      if (CHAPTER3_QUEST_KEYS.includes(o.key)) return; // no art for these, by design
      if (loadedObjectKeys.has(o.key)) return;
      const path = resolveChapter3ObjectImagePath(o.key);
      if (path) {
        this.load.image(o.key, path);
        loadedObjectKeys.add(o.key);
      } else {
        console.warn('Chapter3Scene: no path resolver for object key', o.key);
      }
    });
  }

  create(data) {
    SoundManager.playMusic(this, 'bg-game');
    const { width, height } = this.scale;
    const character = this.registry.get('selectedCharacter') || 'hiraya';
    const textureKey = character + '-sheet';
    this.prefix = character;
    this.speed = this.registry.get('playerSpeed') || 160;
    this.locked = false; // true during dialogue / popup / quiz - movement disabled
    this.mode = 'intro'; // intro -> explore -> quiz -> done

    // --- Historical Area map (loaded from the editor's exported JSON, see
    //     CHAPTER3_MAP_DATA above) ---
    this.map = loadMap(this, CHAPTER3_MAP_DATA.tiles, {
      tileTypes: buildChapter3TileTypes(CHAPTER3_MAP_DATA)
    });

    // "the environment becomes darker and more serious" (per the story doc) -
    // a low-alpha dark overlay across the whole map, sitting just above the
    // tiles (depth -5, tiles render at -10) but below sprites/UI. Cheapest
    // way to shift the mood without needing new tile art.
    this.add.rectangle(this.map.widthPx / 2, this.map.heightPx / 2, this.map.widthPx, this.map.heightPx, 0x000000, 0.28).setDepth(-5);

// --- player ---
     this.createPlayerAnims(textureKey);
     const startX = CHAPTER3_MAP_DATA.spawn.x;
     const startY = CHAPTER3_MAP_DATA.spawn.y;
     this.player = this.physics.add.sprite(startX, startY, textureKey, 0);
     this.player.setCollideWorldBounds(true);
     this.player.setSize(C3_FRAME_W * 0.5, C3_FRAME_H * 0.35);
     this.player.setOffset(C3_FRAME_W * 0.25, C3_FRAME_H * 0.6);
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
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.locked) { this.locked = true; showPauseMenu(this); }
    });

// --- Macario Almeda --- (real sprite sheet, same 44x78 grid convention
     // as hiraya-sheet/lola-sheet/donemilio-sheet - frame 0 is his
     // down-facing idle pose).
     this.kapitanAndres = this.add.sprite(startX, startY - 64, 'kapitanandres-sheet', 0);
     // Static collision body sized to almost the whole sprite (not just the
     // feet) so the player can't walk into/overlap Macario Almeda from any
     // side - top, bottom, or left/right. NOTE: Phaser's setSize(w, h, center)
     // only takes 3 params - passing a 4th offset value here used to silently
     // do nothing, and the truthy 3rd value made it auto-center the box in
     // the middle of the sprite instead, which is why the player used to be
     // able to walk in as far as his waist/chest before colliding. setOffset()
     // must be called separately, after setSize(..., false) disables the
     // auto-centering.
     this.physics.add.existing(this.kapitanAndres, true);
     this.kapitanAndres.body.setSize(C3_FRAME_W * 0.6, C3_FRAME_H * 0.85, false);
     this.kapitanAndres.body.setOffset(C3_FRAME_W * 0.2, C3_FRAME_H * 0.08);
     this.physics.add.collider(this.player, this.kapitanAndres);
     // Ensure Macario Almeda renders below player
     this.kapitanAndres.setDepth(0);
    this.interactPrompt = this.add.text(this.kapitanAndres.x, this.kapitanAndres.y - 90, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false);
    this.returnFlag = this.add.text(this.kapitanAndres.x, this.kapitanAndres.y - 60, '❗', { fontSize: 26 })
      .setOrigin(0.5).setVisible(false);

    // --- the 5 hidden objects ---
    // Pulled from CHAPTER3_MAP_DATA.objects by key, so position/color come
    // straight from what was placed in the map editor; info text keeps its
    // "REVOLUTIONARY MESSAGE" / "HISTORICAL CLUE" flavor prefix from
    // CHAPTER3_INFO_LABELS (see top of file) since the editor has no concept
    // of that categorization.
    this.objects = CHAPTER3_MAP_DATA.objects
      .filter(o => CHAPTER3_QUEST_KEYS.includes(o.key))
      .map(o => ({
        key: o.key,
        name: o.name,
        x: o.x,
        y: o.y,
        color: chapter3HexToInt(o.color, 0x888888),
        info: `${CHAPTER3_INFO_LABELS[o.key] || 'HISTORICAL CLUE'}\n${o.info}`,
        found: false
      }));

    this.objects.forEach(o => {
      // Deliberately unlabeled ("?") until found - showing the name up front
      // would give away what's hidden there. Icon starts at low alpha to
      // match that "not yet examined" feel the translucent placeholder box
      // had; interactWithObject() below brings it to full-ish opacity once
      // found, same as it used to raise the placeholder's fill alpha.
      const icon = CHAPTER3_QUEST_ICONS[o.key];
      const hasIcon = icon && this.textures.exists(icon.key);
      o.rect = hasIcon
        ? this.add.image(o.x, o.y, icon.key).setDisplaySize(icon.w, icon.h).setAlpha(0.35).setDepth(o.y)
        : this.add.rectangle(o.x, o.y, 46, 46, o.color, 0.35).setStrokeStyle(2, 0xf5e2c8).setDepth(o.y);
      o.label = this.add.text(o.x, o.y - 34, 'Hidden', {
        fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#fff8e7', backgroundColor: '#000000aa',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5).setDepth(o.y + 1);
      o.mark = this.add.text(o.x, o.y, '?', {
        fontFamily: '"Tildunk", sans-serif', fontSize: 22, color: '#fff8e7', fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(o.y + 1);
    });

    // --- decorative scenery (whatever else the editor placed - fences,
    // plants, ruins, etc.) ---
    // Everything in CHAPTER3_MAP_DATA.objects that isn't a quest item above:
    // purely visual, except collidable ones also get a static physics body
    // so the player can't just walk through it.
    this.decorObstacles = [];
    CHAPTER3_MAP_DATA.objects
      .filter(o => !CHAPTER3_QUEST_KEYS.includes(o.key))
      .forEach(o => {
        const hasImage = this.textures.exists(o.key);
        let vis;
        if (hasImage) {
          vis = this.add.image(o.x, o.y, o.key).setDisplaySize(o.w, o.h);
        } else {
          vis = this.add.rectangle(o.x, o.y, o.w, o.h, chapter3HexToInt(o.color, 0x888888));
        }
        vis.setDepth(o.y);
        if (o.collidable) {
          this.physics.add.existing(vis, true);
          this.decorObstacles.push(vis);
        }
      });
    this.physics.add.collider(this.player, this.decorObstacles);

    // 6th task - not a findable object, just walking back to report to
    // Macario Almeda once all 5 above are found. See getTaskList().
    this.reportDone = false;

    // --- HUD --- (scrollFactor 0 so it stays pinned to the screen instead
    // of scrolling away with the map now that the camera follows the player)
    const displayName = character.charAt(0).toUpperCase() + character.slice(1);
    this.add.text(14, 12, displayName, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 18, color: '#fff8e7'
    }).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(900);

    this.add.text(width / 2, 16, 'Chapter 3: Pateros in the Revolution', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 16, color: '#f5e2c8'
    }).setOrigin(0.5, 0).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(900);

    // Wooden-Gold UI icon pack - same plank button used for Start
    // Adventure/Chapters on the Main Menu (see createWoodButton in ui.js),
    // sized down to fit the gameplay HUD.
    const taskBtn = createWoodButton(this, width - 84, 27, 'Task', () => {
      if (this.mode === 'explore' && !this.locked) {
        this.locked = true;
        this.showObjectivesModal();
      }
    }, { width: 150, height: 40, fontSize: 15 });
    this.taskBtnRect = taskBtn.image.setScrollFactor(0).setDepth(900);
    this.taskBtnTxt = taskBtn.txt.setScrollFactor(0).setDepth(901);
    this.taskBtnRect.setVisible(false);
    this.taskBtnTxt.setVisible(false);
    this.updateProgress();

    const journalBtn = createWoodButton(this, 66, height - 30, 'Journal', () => {
      if (this.mode === 'explore' && !this.locked) {
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

    this.add.text(width / 2, height - 12, 'WASD to move · E to interact · Esc for menu', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#9aa0aa'
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(900);

    // --- curtain-open reveal - opening dialogue waits for it to finish ---
    this.locked = true;
    curtainOpen(this, () => {
      showDialogue(this, 'Macario Almeda', [
        'You\'ve come far, kapatid. This ground remembers things heavier than market days and plazas.',
        'I am Macario Almeda, Kabesang Cario to my neighbors. In April 1896 we founded the Katipunan chapter of Pateros, the Sangguniang Balangay Magtanggol.',
        'Our people did not just watch history happen. By August, it is said, about 1,200 of us had joined. We hid messages, carried word in secret, risked everything.',
        'Some of those traces are still scattered around here. Find them, and you\'ll understand what our people faced.'
      ], () => {
        this.locked = false;
        this.mode = 'explore';
        // Macario Almeda's task has now actually been given - reveal the Task button.
        this.taskBtnRect.setVisible(true);
        this.taskBtnTxt.setVisible(true);
      }, ['kapitan-andres-firm', 'kapitan-andres-happy', 'kapitan-andres-happy', 'kapitan-andres-point']);
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

  // Same idea as createPlayerAnims() above, just for the patrol-guard-sheet
  // (see preload()). Guards only ever walk a straight beat - no idle pose
  // needed - so this only ever needs to run once per scene lifetime,
  // called from launchPatrol() right before the guards are built.
  createPatrolGuardAnims() {
    if (!this.anims.exists('patrol-guard-walk-down')) {
      this.anims.create({ key: 'patrol-guard-walk-down', frames: this.anims.generateFrameNumbers('patrol-guard-sheet', { start: 0, end: 11 }), frameRate: 10, repeat: -1 });
    }
    if (!this.anims.exists('patrol-guard-walk-up')) {
      this.anims.create({ key: 'patrol-guard-walk-up', frames: this.anims.generateFrameNumbers('patrol-guard-sheet', { start: 12, end: 23 }), frameRate: 10, repeat: -1 });
    }
    if (!this.anims.exists('patrol-guard-walk-side')) {
      this.anims.create({ key: 'patrol-guard-walk-side', frames: this.anims.generateFrameNumbers('patrol-guard-sheet', { start: 24, end: 34 }), frameRate: 10, repeat: -1 });
    }
  }

  // Full task list for the HUD counter / objectives modal: the 5 hidden
  // objects, plus a 6th "Report to Macario Almeda" task that only appears
  // once all 5 have been found (goes 5/5 -> 5/6, then 6/6 once you talk to him).
  getTaskList() {
    const list = this.objects.map(o => ({ name: o.name, found: o.found, info: o.info, iconKey: getObjectIconKey(this, o), type: 'item' }));
    if (this.objects.every(o => o.found)) {
      list.push({
        name: 'Report to Macario Almeda',
        found: this.reportDone,
        info: 'Walk back to Macario Almeda and press E to tell him what you found.',
        type: 'task'
      });
    }
    return list;
  }

  updateProgress() {
    const tasks = this.getTaskList();
    const found = tasks.filter(t => t.found).length;
    if (this.taskBtnTxt) this.taskBtnTxt.setText(`Task (${found}/${tasks.length})`);
  }

  // --- Objectives modal: which hidden objects are found --------
  // Hovering a found row pops up what was learned from it.
showObjectivesModal() {
     const { width, height } = this.scale;
     const tasks = this.getTaskList();
     const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45).setInteractive().setScrollFactor(0);

    const rowH = 34;
    const headerH = 96;
    const tooltipH = 74;
    const footerH = 60;
    const panelH = headerH + tasks.length * rowH + tooltipH + footerH;
    const panel = this.add.rectangle(width / 2, height / 2, 380, panelH, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    const top = height / 2 - panelH / 2;

    const title = this.add.text(width / 2, top + 26, 'Objectives', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 20, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    const allObjectsFound = this.objects.every(o => o.found);
    const subtitle = this.add.text(width / 2, top + 50,
      allObjectsFound ? 'All found — now report back to Macario Almeda:' : 'Search the grounds for what was left behind:', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#6b4a2f'
    }).setOrigin(0.5);
    const hint = this.add.text(width / 2, top + 70, 'Hover a found item to see what you learned', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 11, color: '#9aa0aa', fontStyle: 'italic'
    }).setOrigin(0.5);

    container.add([overlay, panel, title, subtitle, hint]);

    // Shared tooltip element - one instance, repositioned/retexted per hover.
    const tooltipTxt = this.add.text(width / 2, top + headerH + tasks.length * rowH + 14, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#3b2410', align: 'center',
      wordWrap: { width: 330 }
    }).setOrigin(0.5, 0).setVisible(false);
    container.add(tooltipTxt);

    tasks.forEach((t, i) => {
      const y = top + headerH + i * rowH;
      const found = t.found;
      const mark = this.add.text(width / 2 - 172, y, found ? '✓' : '—', {
        fontFamily: '"Tildunk", sans-serif', fontSize: 16, fontStyle: 'bold',
        color: found ? '#3c7a3e' : '#9aa0aa'
      }).setOrigin(0, 0.5);
      const label = this.add.text(width / 2 - 118, y, t.type === 'task' ? t.name : (found ? t.name : '???'), {
        fontFamily: '"Tildunk", sans-serif', fontSize: 15,
        color: found ? '#3c7a3e' : '#3b2410'
      }).setOrigin(0, 0.5);
      const status = this.add.text(width / 2 + 150, y, found
        ? (t.type === 'task' ? 'Done' : 'Found')
        : (t.type === 'task' ? 'Go talk to him' : 'Not found'), {
        fontFamily: '"Tildunk", sans-serif', fontSize: 11,
        color: found ? '#3c7a3e' : '#9aa0aa'
      }).setOrigin(1, 0.5);
      container.add([mark, label, status]);
      if (t.type !== 'task') addTaskRowIcon(this, container, width / 2 - 140, y, t.iconKey, found);

      if (found) {
        const hitZone = this.add.rectangle(width / 2, y, 356, rowH, 0xffffff, 0.001)
          .setInteractive({ useHandCursor: true })
          .setScrollFactor(0);
        const rowHighlight = this.add.rectangle(width / 2, y, 356, rowH, 0x3c7a3e, 0.12).setVisible(false);
        container.add([rowHighlight, hitZone]);

        hitZone.on('pointerover', () => {
          rowHighlight.setVisible(true);
          tooltipTxt.setText(t.info).setVisible(true);
        });
        hitZone.on('pointerout', () => {
          rowHighlight.setVisible(false);
          tooltipTxt.setVisible(false);
        });
      }
    });

    const { rect, txt } = createButton(this, width / 2, top + panelH - 30, 'Close', () => {
      container.destroy();
      this.locked = false;
    }, { width: 140, height: 36, fontSize: 15 });
    container.add([rect, txt]);
  }

  // --- Journal: opens Lolo's Journal (journalBook.js) on top of this scene.
  // The scene is paused while the book is open; the HUD button already set
  // this.locked = true, so hand control back when the book closes.
  showJournalModal() {
    openJournalBook(this, { onClose: () => { this.locked = false; } });
  }

  nearestInteractable() {
    const p = this.player;
    let best = null, bestDist = INTERACT_RADIUS;

    const dAndres = Phaser.Math.Distance.Between(p.x, p.y, this.kapitanAndres.x, this.kapitanAndres.y);
    if (dAndres < bestDist) { best = { type: 'andres' }; bestDist = dAndres; }

    this.objects.forEach(o => {
      if (o.found) return;
      const d = interactGapToObject(p, o.rect);
      if (d < OBJECT_INTERACT_REACH && d < bestDist) { best = { type: 'object', obj: o }; bestDist = d; }
    });

    return best;
  }

  talkToKapitanAndres() {
    const allFound = this.objects.every(o => o.found);
    if (!allFound) {
      this.locked = true;
      showDialogue(this, 'Macario Almeda', [
        `You've found ${this.objects.filter(o => o.found).length} of 5 so far.`,
        'Keep searching the grounds, there is more to uncover.'
      ], () => { this.locked = false; }, ['kapitan-andres-firm', 'kapitan-andres-point']);
      return;
    }

    this.locked = true;
    this.returnFlag.setVisible(false);
    this.reportDone = true;
    this.updateProgress();
    showDialogue(this, 'Macario Almeda', [
      'You found every message, the flag, the coded letters, the armband, the hidden supplies, the secret marker.',
      'We worked in secret because discovery meant capture, or worse, that is why everything had to stay hidden.',
      'Before you go, a patrol is making its rounds near the safehouse right now. Help me get a few more messages past them.'
    ], () => this.startPatrolTransition(), ['kapitan-andres-happy', 'kapitan-andres-firm', 'kapitan-andres-firm']);
  }

  // ==========================================================================
  // MINI-GAME 2 - Dodge the Patrol (see CHAPTER3_PATROL_* above)
  // ==========================================================================

  // Curtain-close over the grounds, build the patrol minigame behind it,
  // then curtain-open into it - same close/build/open pairing Chapter 1's
  // River Run uses, so this reads as "stepping into the patrol's path"
  // rather than a scene change.
  startPatrolTransition() {
    this.mode = 'transition';
    this.locked = true;
    curtainClose(this, () => {
      this.launchPatrol();
      curtainOpen(this, () => this.showPatrolIntro());
    });
  }

  showPatrolIntro() {
    showDialogue(this, 'Macario Almeda', [
      'Stay low and keep moving. WASD or the arrows, the lantern light is their notice, not a wall, so timing gets you past it.',
      `Get all ${CHAPTER3_PATROL_MESSAGES.length} messages across. Get spotted three times and we'll have to fall back.`
    ], () => {
      this.mode = 'patrol';
    }, ['kapitan-andres-firm', 'kapitan-andres-point']);
  }

  // Builds the full-screen patrol field: dim backdrop, faint beat guides,
  // HUD, the guards (a lantern-glow "notice" radius + emoji, walking a
  // fixed line back and forth), the scattered messages, and the player's
  // own token. Purely procedural (emoji + shapes, reusing the real
  // player sheet for the token) so this never depends on art that hasn't
  // been added to assets/ yet - same graceful-fallback idea the rest of
  // this file uses.
  launchPatrol() {
    const { width, height } = this.scale;
    this.patrolLives = CHAPTER3_PATROL_START_LIVES;
    this.patrolCollected = 0;
    this.patrolInvulnUntil = 0;
    this.patrolMessages = [];
    this.patrolGuards = [];

    this.patrolContainer = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);

    // Dim, worn backdrop instead of the daylight grass tile - this plays
    // out like the grounds after dark, a tenser beat than the explore
    // portion, so it reads as its own distinct scene.
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x1c1712, 1).setScrollFactor(0);
    this.patrolContainer.add(bg);

    // Faint guides along each guard's beat so the patrol pattern is
    // readable at a glance instead of something you have to memorize blind.
    CHAPTER3_PATROL_GUARDS.forEach(g => {
      let line;
      if (g.axis === 'x') {
        const y = g.fixed * height;
        line = this.add.rectangle(width * (g.from + g.to) / 2, y, width * (g.to - g.from), 2, 0xf5e2c8, 0.18).setScrollFactor(0);
      } else {
        const x = g.fixed * width;
        line = this.add.rectangle(x, height * (g.from + g.to) / 2, 2, height * (g.to - g.from), 0xf5e2c8, 0.18).setScrollFactor(0);
      }
      this.patrolContainer.add(line);
    });

    // --- guards: lantern-glow notice radius + an animated patrol-guard
    // sprite (see createPatrolGuardAnims/preload), placed along their beat
    // with fromPx/toPx/fixedPx cached so updatePatrol() never has to
    // re-derive them from fractions every frame ---
    this.createPatrolGuardAnims();
    CHAPTER3_PATROL_GUARDS.forEach(g => {
      const fromPx = g.axis === 'x' ? g.from * width : g.from * height;
      const toPx = g.axis === 'x' ? g.to * width : g.to * height;
      const fixedPx = g.axis === 'x' ? g.fixed * height : g.fixed * width;
      const posAlong = Phaser.Math.FloatBetween(fromPx, toPx);
      const x = g.axis === 'x' ? posAlong : fixedPx;
      const y = g.axis === 'x' ? fixedPx : posAlong;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const glow = this.add.circle(x, y, g.radius, 0xc24a38, 0.16).setScrollFactor(0);
      const body = this.add.sprite(x, y, 'patrol-guard-sheet', 0).setScrollFactor(0);
      this.patrolContainer.add([glow, body]);
      this.patrolGuards.push({ cfg: g, glow, body, fromPx, toPx, fixedPx, posAlong, dir });
    });

    // --- messages scattered across the field (see CHAPTER3_PATROL_MESSAGE_SPOTS) ---
    CHAPTER3_PATROL_MESSAGE_SPOTS.forEach((spot, i) => {
      const data = CHAPTER3_PATROL_MESSAGES[i];
      const x = spot.x * width, y = spot.y * height;
      const icon = this.add.text(x, y, data.emoji, { fontSize: 30 }).setOrigin(0.5).setScrollFactor(0);
      this.patrolContainer.add(icon);
      this.patrolMessages.push({ x, y, icon, data, collected: false });
    });

    // --- the player's own token - a fresh sprite reusing the selected
    // character's sheet/anims, independent of the tilemap-bound
    // this.player so this overlay never touches the map's physics world ---
    const startX = width * 0.5, startY = height * 0.92;
    this.patrolPlayer = this.add.sprite(startX, startY, `${this.prefix}-sheet`, 0).setScrollFactor(0);
    this.patrolPlayer.facing = 'up';
    this.patrolContainer.add(this.patrolPlayer);

    // --- HUD (added last so it always renders above guards/messages/player) ---
    this.patrolTitleTxt = this.add.text(width / 2, 18, 'Dodge the Patrol — Sneak the Messages Through', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 16, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 10, y: 4 }
    }).setOrigin(0.5, 0).setScrollFactor(0);
    this.patrolCountTxt = this.add.text(16, 16, `Messages: 0/${CHAPTER3_PATROL_MESSAGES.length}`, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
    }).setScrollFactor(0);
    this.patrolLivesTxt = this.add.text(width - 16, 16, '❤️❤️❤️', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
    }).setOrigin(1, 0).setScrollFactor(0);
    this.patrolHintTxt = this.add.text(width / 2, height - 14, "WASD / Arrows to move — stay out of the guards' lantern light", {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#c9b896'
    }).setOrigin(0.5, 1).setScrollFactor(0);
    this.patrolContainer.add([this.patrolTitleTxt, this.patrolCountTxt, this.patrolLivesTxt, this.patrolHintTxt]);

    this.updatePatrolHud();
  }

  // Per-frame driver for the 'patrol' mode - guard beats, free player
  // movement, pickup checks, and guard-detection checks, in that order.
  // Called from update() below instead of the normal explore-mode block.
  updatePatrol(time, delta) {
    const dt = delta / 1000;
    const { width, height } = this.scale;

    // --- guards: walk their beat, ping-ponging at each end ---
    this.patrolGuards.forEach(g => {
      g.posAlong += g.dir * g.cfg.speed * dt;
      if (g.posAlong >= g.toPx) { g.posAlong = g.toPx; g.dir = -1; }
      else if (g.posAlong <= g.fromPx) { g.posAlong = g.fromPx; g.dir = 1; }
      const x = g.cfg.axis === 'x' ? g.posAlong : g.fixedPx;
      const y = g.cfg.axis === 'x' ? g.fixedPx : g.posAlong;
      g.glow.setPosition(x, y);
      g.body.setPosition(x, y);

      // Face/animate the guard along whichever axis it beats on - a
      // horizontal beat plays the side walk (mirrored per direction, same
      // "faces left by default" convention the player sheets use), a
      // vertical beat plays down/up depending on which way it's headed.
      if (g.cfg.axis === 'x') {
        g.body.setFlipX(g.dir < 0);
        g.body.play('patrol-guard-walk-side', true);
      } else {
        g.body.play(g.dir > 0 ? 'patrol-guard-walk-down' : 'patrol-guard-walk-up', true);
      }
    });

    // --- player: free 2D movement, clamped to the playfield ---
    const left = this.keys.left.isDown || this.cursors.left.isDown;
    const right = this.keys.right.isDown || this.cursors.right.isDown;
    const up = this.keys.up.isDown || this.cursors.up.isDown;
    const down = this.keys.down.isDown || this.cursors.down.isDown;
    let vx = 0, vy = 0;
    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;
    const margin = 26;
    const moving = vx !== 0 || vy !== 0;
    SoundManager.setFootsteps(this, moving);
    if (moving) {
      const len = Math.hypot(vx, vy);
      this.patrolPlayer.x = Phaser.Math.Clamp(this.patrolPlayer.x + (vx / len) * CHAPTER3_PATROL_PLAYER_SPEED * dt, margin, width - margin);
      this.patrolPlayer.y = Phaser.Math.Clamp(this.patrolPlayer.y + (vy / len) * CHAPTER3_PATROL_PLAYER_SPEED * dt, margin, height - margin);
      if (vy < 0) this.patrolPlayer.facing = 'up';
      else if (vy > 0) this.patrolPlayer.facing = 'down';
      else if (vx !== 0) { this.patrolPlayer.facing = 'side'; this.patrolPlayer.flipX = vx > 0; }
      this.patrolPlayer.play(`${this.prefix}-walk-${this.patrolPlayer.facing}`, true);
    } else {
      this.patrolPlayer.anims.stop();
      const idleFrame = { down: 0, up: 12, side: 24 }[this.patrolPlayer.facing];
      this.patrolPlayer.setFrame(idleFrame);
    }

    // --- message pickups ---
    this.patrolMessages.forEach(m => {
      if (m.collected) return;
      if (Phaser.Math.Distance.Between(this.patrolPlayer.x, this.patrolPlayer.y, m.x, m.y) < CHAPTER3_PATROL_CATCH_RADIUS) {
        this.handlePatrolPickup(m);
      }
    });
    if (this.mode !== 'patrol') return; // a pickup may have just completed the run

    // --- guard detection (skipped during the post-catch invulnerability window) ---
    if (time > this.patrolInvulnUntil) {
      for (const g of this.patrolGuards) {
        if (Phaser.Math.Distance.Between(this.patrolPlayer.x, this.patrolPlayer.y, g.glow.x, g.glow.y) < g.cfg.radius) {
          this.handlePatrolCaught(g);
          break;
        }
      }
    }
  }

  // Small floating toast above the player - "+1 message" / "Spotted!"
  // feedback in real time, instead of a click-through explanation panel.
  showPatrolToast(text, colorCss) {
    const toast = this.add.text(this.patrolPlayer.x, this.patrolPlayer.y - 44, text, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, fontStyle: 'bold', color: colorCss,
      backgroundColor: '#fff8e7', padding: { x: 6, y: 3 }, align: 'center', wordWrap: { width: 220 }
    }).setOrigin(0.5).setScrollFactor(0);
    this.patrolContainer.add(toast);
    this.tweens.add({
      targets: toast, y: toast.y - 30, alpha: 0, duration: 900, ease: 'Cubic.easeOut',
      onComplete: () => toast.destroy()
    });
  }

  updatePatrolHud() {
    this.patrolCountTxt.setText(`Messages: ${this.patrolCollected}/${CHAPTER3_PATROL_MESSAGES.length}`);
    this.patrolLivesTxt.setText('❤️'.repeat(Math.max(0, this.patrolLives)));
  }

  handlePatrolPickup(m) {
    m.collected = true;
    m.icon.destroy();
    this.patrolCollected++;
    SoundManager.play(this, 'correct');
    this.showPatrolToast(m.data.note, '#3c7a3e');
    this.updatePatrolHud();
    if (this.patrolCollected >= CHAPTER3_PATROL_MESSAGES.length) this.finishPatrol(true);
  }

  handlePatrolCaught(g) {
    this.patrolLives--;
    this.patrolInvulnUntil = this.time.now + CHAPTER3_PATROL_CAUGHT_INVULN_MS;
    SoundManager.play(this, 'incorrect');
    this.cameras.main.shake(160, 0.006);
    this.showPatrolToast('Spotted! Fall back!', '#c24a38');

    // Knock the player straight back away from the guard that spotted
    // them, clamped to the playfield - the same "breathing room" idea as
    // the invulnerability window, just visible instead of just a timer.
    const { width, height } = this.scale;
    const angle = Phaser.Math.Angle.Between(g.glow.x, g.glow.y, this.patrolPlayer.x, this.patrolPlayer.y);
    const pushDist = 90;
    this.patrolPlayer.x = Phaser.Math.Clamp(this.patrolPlayer.x + Math.cos(angle) * pushDist, 26, width - 26);
    this.patrolPlayer.y = Phaser.Math.Clamp(this.patrolPlayer.y + Math.sin(angle) * pushDist, 26, height - 26);

    // Flash the player sprite so the invulnerability window is readable.
    this.tweens.add({ targets: this.patrolPlayer, alpha: 0.25, duration: 90, yoyo: true, repeat: 5 });

    this.updatePatrolHud();
    if (this.patrolLives <= 0) this.finishPatrol(false);
  }

  finishPatrol(success) {
    if (this.mode !== 'patrol') return; // guard against double-trigger (last life + last message same frame)
    this.mode = 'transition';
    this.locked = true;
    SoundManager.setFootsteps(this, false);
    SoundManager.play(this, success ? 'complete' : 'incorrect');
    curtainClose(this, () => {
      if (this.patrolContainer) { this.patrolContainer.destroy(); this.patrolContainer = null; }
      curtainOpen(this, () => {
        if (success) this.showPatrolRecap();
        else this.showPatrolFailRetry();
      });
    });
  }

  showPatrolRecap() {
    const tally = `${this.patrolCollected}/${CHAPTER3_PATROL_MESSAGES.length}`;
    this.locked = true;
    showDialogue(this, 'Macario Almeda', [
      `Every message made it through, ${tally}, and not one of you spotted for long.`,
      'That fear never really left us, every message carried that risk, every single time.',
      'Now you understand what our people faced. Let\'s see what you remember.'
    ], () => this.startQuiz(), ['kapitan-andres-happy', 'kapitan-andres-firm', 'kapitan-andres-firm']);
  }

  // Caught three times before every message made it through - Kapitan
  // Andres talks it over, then it's straight back into a fresh run instead
  // of quietly waving the miss through, so getting every message past the
  // patrol actually has to happen rather than just being flavor text.
  showPatrolFailRetry() {
    const tally = `${this.patrolCollected}/${CHAPTER3_PATROL_MESSAGES.length}`;
    this.locked = true;
    showDialogue(this, 'Macario Almeda', [
      `That patrol nearly had you, you got ${tally} through before they closed in.`,
      'Catch your breath. Let\'s try that crossing again.'
    ], () => this.retryPatrol(), ['kapitan-andres-firm', 'kapitan-andres-point']);
  }

  // Same close/build/open pairing startPatrolTransition() uses, just
  // skipping straight back into play instead of replaying the full
  // how-to-dodge instructions a second time.
  retryPatrol() {
    this.mode = 'transition';
    this.locked = true;
    curtainClose(this, () => {
      this.launchPatrol();
      curtainOpen(this, () => {
        this.mode = 'patrol';
      });
    });
  }

  interactWithObject(o) {
    this.locked = true;
    showFoundItemPopup(this, o, () => {
      o.found = true;
      // setAlpha works on both the Image (real icon) and the Rectangle
      // (fallback if an icon ever fails to load) - setFillStyle only
      // exists on the latter, so it can't be used here anymore.
      o.rect.setAlpha(0.85);
      o.label.setText(o.name);
      o.mark.setVisible(false);
      this.updateProgress();
      this.locked = false;
      if (this.objects.every(x => x.found)) {
        this.returnFlag.setVisible(true);
        showToast(this, 'Talk to Macario Almeda');
      }
    });
  }

  // --- End-of-chapter quiz -------------------------------------------------
  startQuiz() {
    this.mode = 'quiz';
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizQuestions = [
      {
        q: 'Who was Macario Almeda?',
        options: ['The commander of the Katipunan chapter in Pateros', 'A Spanish colonial official', 'A magbabalut from the duck farms', 'The parish priest of Pateros'],
        correct: 0,
        explanation: 'Macario Almeda, a 29-year-old farmer and village head, was elected commander of the Pateros Katipunan chapter in April 1896. His secret name was Kidlat.'
      },
      {
        q: 'What was the Katipunan chapter in Pateros called?',
        options: ['Sangguniang Balangay Magtanggol', 'Sangguniang Balangay Kidlat', 'Balangay ng Pateros Pato', 'Kapisanan ng Ilog Pasig'],
        correct: 0,
        explanation: 'The Pateros chapter, the Sangguniang Balangay Magtanggol, was founded in April 1896 at a house in Barrio Santo Rosario.'
      },
      {
        q: 'Why did revolutionaries often hide messages and meet in secret?',
        options: ['To avoid being discovered by the authorities', 'Because paper was scarce and expensive', 'To follow the same customs used at market meetings', 'Because they needed a permit from the local governor'],
        correct: 0,
        explanation: 'Katipuneros often organized and communicated secretly to avoid detection by the Spanish authorities.'
      }
    ];
    this.showQuizQuestion();
  }

showQuizQuestion() {
     const { width, height } = this.scale;
     const qData = shuffleQuizOptions(this.quizQuestions[this.quizIndex]);
     const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, 540, 380, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    // Kept so showQuizFeedback() can grow the panel downward if a long
    // explanation wraps to more lines than the base 380px height allows for.
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
    qData.options.forEach((opt, i) => {
      const y = height / 2 - 60 + i * 42;
      const { rect, txt } = createButton(this, width / 2, y, opt, () => {
        this.showQuizFeedback(container, optionButtons, qData, i);
      }, { width: 440, height: 36, fontSize: 15 });
      optionButtons.push({ rect, index: i });
      container.add([rect, txt]);
    });
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
    const verdict = this.add.text(width / 2, height / 2 + 96, isCorrect ? 'Correct!' : 'Not quite.', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 17, fontStyle: 'bold',
      color: isCorrect ? '#3c7a3e' : '#9c3b2e'
    }).setOrigin(0.5);
    const explanationTxt = this.add.text(width / 2, height / 2 + 118, qData.explanation || '', {
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
    const pages = this.registry.get('journalPages') || [];
    if (!pages.includes(3)) pages.push(3);
    this.registry.set('journalPages', pages);
    // Persist the page too, so it is still readable after a reload.
    ChapterProgress.addJournalPage(3);
    // Persist to localStorage so Chapter 4 shows up unlocked in the main
    // menu's Chapter list even after a page reload.
    ChapterProgress.unlockNextAfter('Chapter3');

    // A short wrap-up from Macario Almeda before the reward panel, so the
    // chapter closes out like the rest of the conversation instead of
    // cutting straight to a modal the instant the quiz ends.
    this.locked = true;
    showDialogue(this, 'Macario Almeda', [
      'You carry that page the way you should carry the memory, quietly, but never forgotten.',
      'There is a lighter story waiting for you next, I promise.'
    ], () => this.showJournalReward(), ['kapitan-andres-firm', 'kapitan-andres-happy']);
  }

  showJournalReward() {
    // Chapter 4 doesn't exist yet - if/when Chapter4Scene is added to
    // main.js's scene list, this automatically starts it instead of
    // falling back to the menu, no other change needed here.
    const chapter4Ready = !!this.scene.manager.keys['Chapter4'];

const { width, height } = this.scale;
     const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, 460, 240, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    const title = this.add.text(width / 2, height / 2 - 80, 'Journal Page #3 Unlocked!', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    const scoreTxt = this.add.text(width / 2, height / 2 - 34, `You remembered ${this.quizScore} / ${this.quizQuestions.length}.`, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#3b2410'
    }).setOrigin(0.5);
    const flavor = this.add.text(width / 2, height / 2, chapter4Ready
      ? 'Pateros in the Revolution — recorded in the journal. Chapter 4 awaits.'
      : 'Pateros in the Revolution — recorded in the journal. Chapter 4 is still being written — more adventures coming soon!', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 14, color: '#6b4a2f', align: 'center', wordWrap: { width: 380 }
    }).setOrigin(0.5, 0);

    container.add([overlay, panel, title, scoreTxt, flavor]);

    const { rect, txt } = createButton(this, width / 2 + 95, height / 2 + 88, chapter4Ready ? 'Continue' : 'Back to Menu', () => {
      curtainClose(this, () => this.scene.start(chapter4Ready ? 'Chapter4' : 'Menu'));
    }, { width: 170, height: 44, fontSize: 17, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);

    // Lets the player read the page they just collected before moving on.
    JournalBook.addReadButton(this, container, 3, width / 2 - 95, height / 2 + 88, { width: 170, height: 44, fontSize: 16 });
  }

  update(time, delta) {
    if (this.mode === 'patrol') {
      this.updatePatrol(time, delta);
      return;
    }

    // interaction prompt + key handling
    if (!this.locked && (this.mode === 'explore')) {
      const nearest = this.nearestInteractable();
      if (nearest && nearest.type === 'andres') {
        this.interactPrompt.setText('Press E to talk').setVisible(true);
      } else if (nearest && nearest.type === 'object') {
        this.interactPrompt.setText('');
      } else {
        this.interactPrompt.setVisible(false);
      }

      if (Phaser.Input.Keyboard.JustDown(this.keys.interact) && nearest) {
        if (nearest.type === 'andres') this.talkToKapitanAndres();
        else this.interactWithObject(nearest.obj);
      }
    } else {
      this.interactPrompt.setVisible(false);
    }

    if (this.locked || this.mode !== 'explore') {
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