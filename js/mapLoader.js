// Shared tile-map loader, same idea as the classic GBA Pokemon games:
// a map is just rows of digits, one digit per tile, so you can literally
// see the layout in the source code. Every scene can define its own map
// and drop it into loadMap() - obstacles, water, paths, whatever you add
// to TILE_TYPES all "just work" the same way everywhere.
//
// Example map (8 wide x 5 tall):
//
//   const MY_MAP = [
//     '11111111',
//     '10000001',
//     '10022001',   // 2 = water in the middle
//     '10000001',
//     '11111111',
//   ];
//
// Each character is one tile, read left-to-right / top-to-bottom - exactly
// like the '01001012002...' style grids from old RPGs. Rows don't need to
// be the same length as each other, but every row SHOULD be the same
// length for a rectangular map (loadMap will warn in the console if not).
//
// No external art required: every tile is painted at runtime with Phaser's
// Graphics API (a few flat colors + speckles/blades/waves) and baked into a
// small reusable texture, the same trick pixel-art RPGs use to get texture
// out of a handful of hand-placed pixels. Swap any of it for a real tileset
// image later without touching the scenes that call loadMap().

const TILE_SIZE = 32; // px per tile - 960x540 canvas = 30 cols x 16 rows exactly (if 32px tiles)
const TILE_VARIANTS = 3; // baked look-alike-but-not-identical versions per tile type

// --- deterministic "randomness" -------------------------------------------
// Two tiny hashes: one seeds each baked texture variant (so the art looks
// the same every time you reload), the other seeds *which* variant + flip
// gets used per grid cell (so neighboring tiles of the same type don't look
// like an obviously repeating wallpaper).

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashInt(...vals) {
  let h = 2166136261;
  for (const v of vals) {
    h ^= v;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  return h >>> 0;
}

// --- per-tile-type painters -------------------------------------------------
// Each painter fills a TILE_SIZE x TILE_SIZE Graphics with a base color plus
// a little hand-crafted texture. `rand()` is seeded per baked variant.

function drawGrass(g, rand) {
  g.fillStyle(0x3a6b45, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  for (let i = 0; i < 4; i++) {
    g.fillStyle(rand() > 0.5 ? 0x4c8a55 : 0x2f5838, 0.5);
    const w = 6 + rand() * 9, h = 5 + rand() * 7;
    g.fillRect(rand() * (TILE_SIZE - w), rand() * (TILE_SIZE - h), w, h);
  }
  g.lineStyle(1, 0x1f3a28, 0.85);
  for (let i = 0; i < 6; i++) {
    const x = 2 + rand() * (TILE_SIZE - 4);
    const y = 8 + rand() * (TILE_SIZE - 12);
    g.beginPath();
    g.moveTo(x, y + 6);
    g.lineTo(x + (rand() - 0.5) * 5, y);
    g.strokePath();
  }
}

function drawWater(g, rand) {
  g.fillStyle(0x2e5f8a, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  g.fillStyle(0x234a6e, 0.5);
  g.fillRect(0, TILE_SIZE * 0.55, TILE_SIZE, TILE_SIZE * 0.45);
  g.lineStyle(2, 0x6fb0dd, 0.5);
  for (let i = 0; i < 2; i++) {
    const y = 6 + rand() * (TILE_SIZE - 12);
    g.beginPath();
    g.moveTo(2, y);
    g.lineTo(TILE_SIZE * 0.35, y + 3);
    g.lineTo(TILE_SIZE * 0.65, y - 3);
    g.lineTo(TILE_SIZE - 2, y);
    g.strokePath();
  }
}

function drawSand(g, rand) {
  g.fillStyle(0xd9c08a, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  for (let i = 0; i < 10; i++) {
    g.fillStyle(rand() > 0.5 ? 0xe8d9a8 : 0xc2a869, 0.6);
    g.fillCircle(rand() * TILE_SIZE, rand() * TILE_SIZE, 1 + rand());
  }
}

function drawPath(g, rand) {
  g.fillStyle(0x6b4f30, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  for (let i = 0; i < 4; i++) {
    g.fillStyle(rand() > 0.5 ? 0x8a6b45 : 0x543c22, 0.5);
    const w = 6 + rand() * 8, h = 5 + rand() * 7;
    g.fillRect(rand() * (TILE_SIZE - w), rand() * (TILE_SIZE - h), w, h);
  }
  g.fillStyle(0x3f2c18, 0.6);
  for (let i = 0; i < 3; i++) g.fillCircle(rand() * TILE_SIZE, rand() * TILE_SIZE, 1 + rand());
}

function drawTree(g, rand) {
  // grass base peeking out from under the canopy, so trees don't read as a
  // flat block dropped onto the field
  g.fillStyle(0x3a6b45, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  const cx = TILE_SIZE / 2 + (rand() - 0.5) * 2;
  g.fillStyle(0x000000, 0.18);
  g.fillEllipse(cx, TILE_SIZE - 5, TILE_SIZE * 0.5, 6);
  g.fillStyle(0x4a3420, 1);
  g.fillRect(cx - 2.5, TILE_SIZE - 12, 5, 9);
  g.fillStyle(0x1f3f27, 1);
  g.fillCircle(cx, TILE_SIZE * 0.42, TILE_SIZE * 0.42);
  g.fillStyle(0x2f6a38, 1);
  g.fillCircle(cx - 3, TILE_SIZE * 0.36, TILE_SIZE * 0.32);
  g.fillStyle(0x48934f, 1);
  g.fillCircle(cx + 4, TILE_SIZE * 0.3, TILE_SIZE * 0.2);
}

function drawWall(g, rand) {
  g.fillStyle(0x7a5a42, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  g.lineStyle(1, 0x4a3624, 0.8);
  const rowH = TILE_SIZE / 3;
  for (let row = 0; row <= 3; row++) g.lineBetween(0, row * rowH, TILE_SIZE, row * rowH);
  for (let row = 0; row < 3; row++) {
    const offset = row % 2 === 0 ? 0 : TILE_SIZE / 2;
    g.lineBetween(offset, row * rowH, offset, (row + 1) * rowH);
    g.lineBetween(offset + TILE_SIZE, row * rowH, offset + TILE_SIZE, (row + 1) * rowH);
  }
  g.fillStyle(0x8f6c50, 0.4);
  for (let i = 0; i < 3; i++) g.fillRect(rand() * TILE_SIZE, rand() * TILE_SIZE, 4, 2);
}

function drawFlat(g, rand, type) {
  g.fillStyle(type.color, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
}

// The shared tile legend. Add new digits here and every scene's map can
// use them immediately. `solid: true` tiles automatically get a static
// physics body, so player.setCollideWorldBounds-style movement just works
// once you add the collider (see loadMap's return value below). `draw`
// paints the tile's texture; leave it off to fall back to a flat fill.
const TILE_TYPES = {
  0: { name: 'grass', color: 0x3a6b45, solid: false, draw: drawGrass },
  1: { name: 'tree', color: 0x1f3f27, solid: true, draw: drawTree, noFlipY: true },
  2: { name: 'water', color: 0x2e5f8a, solid: true, draw: drawWater },
  3: { name: 'path', color: 0x6b4f30, solid: false, draw: drawPath },
  4: { name: 'sand', color: 0xd9c08a, solid: false, draw: drawSand },
  5: { name: 'wall', color: 0x7a5a42, solid: true, draw: drawWall }
};

// Bakes (and caches on the scene's texture manager) TILE_VARIANTS look-alike
// textures per tile type the first time they're needed.
function ensureTileTexture(scene, type, variant) {
  if (type.imageKey) {
    // Use the provided image key directly
    return type.imageKey;
  }
  const key = `tile_${type.name}_${variant}`;
  if (!scene.textures.exists(key)) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    const rand = mulberry32(hashString(type.name) + variant * 97 + 13);
    (type.draw || drawFlat)(g, rand, type);
    g.generateTexture(key, TILE_SIZE, TILE_SIZE);
    g.destroy();
  }
  return key;
}

// Thin translucent "foam" line along any edge where a water tile touches a
// non-water tile - the little shoreline detail that sells "riverbank"
// instead of "blue rectangle next to green rectangle".
function drawShoreline(scene, grid, tileTypes, originX, originY, depth) {
  const isWater = (r, c) => {
    const row = grid[r];
    if (!row || row[c] === undefined) return false;
    const t = tileTypes[row[c]];
    return !!t && t.name === 'water';
  };

  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      const type = tileTypes[cell] ?? tileTypes[0];
      if (type.name !== 'water') return;
      const x0 = originX + c * TILE_SIZE, y0 = originY + r * TILE_SIZE;
      const edges = [
        { dr: -1, dc: 0, x1: x0, y1: y0, x2: x0 + TILE_SIZE, y2: y0 },
        { dr: 1, dc: 0, x1: x0, y1: y0 + TILE_SIZE, x2: x0 + TILE_SIZE, y2: y0 + TILE_SIZE },
        { dr: 0, dc: -1, x1: x0, y1: y0, x2: x0, y2: y0 + TILE_SIZE },
        { dr: 0, dc: 1, x1: x0 + TILE_SIZE, y1: y0, x2: x0 + TILE_SIZE, y2: y0 + TILE_SIZE }
      ];
      edges.forEach(e => {
        if (isWater(r + e.dr, c + e.dc)) return;
        const fg = scene.add.graphics().setDepth(depth);
        fg.lineStyle(3, 0xdff3ff, 0.5);
        fg.lineBetween(e.x1, e.y1, e.x2, e.y2);
        const rand = mulberry32(hashInt(r, c, e.dr * 3 + e.dc * 7 + 99));
        for (let i = 0; i < 3; i++) {
          const t = rand();
          fg.fillStyle(0xffffff, 0.35);
          fg.fillCircle(e.x1 + (e.x2 - e.x1) * t, e.y1 + (e.y2 - e.y1) * t, 1.2 + rand() * 1.4);
        }
      });
    });
  });
}

/**
 * Draws `rows` (an array of equal-length digit strings, or an array of
 * number arrays) as a grid of TILE_SIZE-px tiles starting at
 * (originX, originY), and returns everything the calling scene needs to
 * hook it up:
 *
 *   const map = loadMap(this, CHAPTER1_MAP);
 *   this.physics.add.collider(this.player, map.obstacles);
 *
 * Options:
 *   originX, originY  - top-left pixel of the map (default 0, 0)
 *   tileTypes         - override the shared TILE_TYPES legend for this map
 *   showGrid          - draw a faint 1px outline per tile (default true)
 *   depth             - render depth for the tiles (default -10, so it
 *                       sits behind sprites/UI drawn without an explicit depth)
 *
 * Returns:
 *   { obstacles, widthPx, heightPx, cols, rows, tileAt(col, row) }
 *   - obstacles is a plain array of the solid tile GameObjects, ready to
 *     pass straight into this.physics.add.collider(player, obstacles).
 */
function loadMap(scene, rows, opts = {}) {
  const originX = opts.originX ?? 0;
  const originY = opts.originY ?? 0;
  const tileTypes = opts.tileTypes ?? TILE_TYPES;
  const showGrid = opts.showGrid ?? false;
  const depth = opts.depth ?? -10;

  const grid = rows.map(row => (typeof row === 'string' ? row.split('').map(Number) : row));

  const width = grid[0] ? grid[0].length : 0;
  if (grid.some(row => row.length !== width)) {
    console.warn('loadMap: rows are not all the same length - map will look ragged.');
  }

  const obstacles = [];

  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      const type = tileTypes[cell] ?? tileTypes[0];
      const x = originX + c * TILE_SIZE + TILE_SIZE / 2;
      const y = originY + r * TILE_SIZE + TILE_SIZE / 2;

      const variant = hashInt(r, c, hashString(type.name)) % TILE_VARIANTS;
      const texKey = ensureTileTexture(scene, type, variant);
      const img = scene.add.image(x, y, texKey).setDepth(depth);
      // Real tile art (imageKey tiles, as opposed to the baked/procedural
      // ones above which are already generated at exactly TILE_SIZE) comes
      // in inconsistent native resolutions - e.g. the Ground Paths / Special
      // Ground Patterns sets are auto-cropped per-cell from reference sheets
      // anywhere from ~78px to ~144px square. Without forcing every tile
      // image to exactly TILE_SIZE x TILE_SIZE here, a bigger-than-32px tile
      // spills out over its neighbors instead of filling just its own grid
      // cell - the "tiles look expanded" bug. Matches editor.html's own
      // paintCell(), which does the same thing for the same reason.
      img.setDisplaySize(TILE_SIZE, TILE_SIZE);
      // cheap extra variety on top of the baked variants, without doubling
      // texture count - skip on tiles (like trees) that read wrong flipped
      if (!type.noFlipY && (hashInt(r, c, 555) & 1) === 1) img.setFlipX(true);

      if (showGrid) scene.add.rectangle(x, y, TILE_SIZE, TILE_SIZE)
        .setStrokeStyle(1, 0x000000, 0.1).setDepth(depth + 0.5);

      if (type.solid) {
        scene.physics.add.existing(img, true); // true = static body
        obstacles.push(img);
      }
    });
  });

  drawShoreline(scene, grid, tileTypes, originX, originY, depth + 1);

  return {
    obstacles,
    widthPx: width * TILE_SIZE,
    heightPx: grid.length * TILE_SIZE,
    cols: width,
    rows: grid.length,
    tileAt: (col, row) => {
      const r = grid[row];
      if (!r || r[col] === undefined) return null;
      return tileTypes[r[col]] ?? tileTypes[0];
    }
  };
}

/**
 * Classic top-down "camera glued to the player" setup, just like the GBA
 * Pokemon games: the player sprite stays visually centered on screen while
 * the map/world scrolls underneath as they move. Call this once, right
 * after creating both the map (loadMap) and the player sprite:
 *
 *   this.map = loadMap(this, CHAPTER1_MAP);
 *   this.player = this.physics.add.sprite(...);
 *   centerCameraOnPlayer(this, this.map, this.player);
 *
 * If the map is smaller than the screen in a direction, or the player is
 * near a map edge, Phaser's bounds clamping keeps the camera from showing
 * empty space past the map edge - the player will simply sit off-center
 * near that edge, exactly like the GBA games do at the border of a route.
 *
 * IMPORTANT for any UI you add on top of this (HUD text, buttons, dialogue
 * boxes, modals): call .setScrollFactor(0) on it (or put it in a Container
 * and call .setScrollFactor(0) on the container), or it will scroll off
 * with the world instead of staying pinned to the screen.
 */
function centerCameraOnPlayer(scene, map, target, opts = {}) {
  const originX = opts.originX ?? 0;
  const originY = opts.originY ?? 0;

  scene.physics.world.setBounds(originX, originY, map.widthPx, map.heightPx);

  const cam = scene.cameras.main;
  cam.setBounds(originX, originY, map.widthPx, map.heightPx);
  cam.startFollow(target, true, opts.lerpX ?? 1, opts.lerpY ?? 1);
  cam.setRoundPixels(true); // keeps pixel art crisp while the world scrolls
  return cam;
}