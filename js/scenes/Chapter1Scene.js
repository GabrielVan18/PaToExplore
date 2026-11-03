console.log("CHAPTER1 NEW VERSION LOADED");
const C1_FRAME_W = 44;
const C1_FRAME_H = 78;
const INTERACT_RADIUS = 80;

// The journal itself (its pages, and which are unlocked) lives in
// journalBook.js / journalData.js; scenes just call openJournalBook(this).
// ---------------------------------------------------------------------------
// MAP DATA - exported straight from the map editor (editor.html -> "Export
// JSON" for the chapter1_river_remembers map). Re-export from the editor and
// paste the object over this one any time the riverside layout changes. No
// other code below needs to change as long as new tile/object keys follow the
// editor's normal "<prefix>_<number>" naming (see resolveChapter1TileImagePath
// / resolveChapter1ObjectImagePath).
// ---------------------------------------------------------------------------
const CHAPTER1_MAP_DATA = {
  "name": "chapter1_river_remembers",
  "cols": 48,
  "rows": 32,
  "tileSize": 32,
  // NOTE: spawn moved from col 22 / x 720 to col 17 / x 560 - the old spot is
  // now covered by the collidable fountain (obj_fountain_1), which would
  // have trapped the player on start.
  "spawn": {
    "col": 17,
    "row": 18,
    "x": 560,
    "y": 592
  },
  "tileTypes": {
    "0": { "name": "grass", "color": "#3a6b45", "solid": false, "imageKey": "fieldsTile_38" },
    "1": { "name": "tree", "color": "#1f3f27", "solid": true },
    "2": { "name": "water", "color": "#2e5f8a", "solid": true },
    "3": { "name": "path", "color": "#6b4f30", "solid": false, "imageKey": "fieldsTile_01" },
    "4": { "name": "sand", "color": "#d9c08a", "solid": false },
    "5": { "name": "wall", "color": "#7a5a42", "solid": true }
  },
  "tiles": [
    "111111111111111111111111111111111111111111111111",
    "122222222222222222222222222222222222222222222221",
    "122222222222222222222222222222222222222222222221",
    "122222222222222222222222222222222222222222222221",
    "144444444444444444444443344444444444444444444441",
    "100000000000000000000003300000000000000000000001",
    "100000000000000000000003300000000000000000000001",
    "100000110000000000000003300000000000000000000001",
    "100000100000000000000003300000000011000000000001",
    "100000000000000000000003300000000010000000000001",
    "100000000000000000000003300000000000000000000001",
    "100000000000000000000003300000000000000000000001",
    "100000000000000000000003300000000000000010000001",
    "100000000011000000000003300000000000000011000001",
    "100000000010000000000003300000000000000000000001",
    "100000000000000000000003300000000000000000000001",
    "100000000000000000000003300000000000000000000001",
    "133333333333333333333333333333333333333333333331",
    "133333333333333333333333333333333333333333333331",
    "100000000000000000000003300000000000001100000001",
    "100000110000000000000003300000000000001000000001",
    "100000100000000000000003300000000000000000000001",
    "100000000000000000000003300000000000000000000001",
    "100000000000000000000003300000110000000000000001",
    "100000000000000000000003300000100000000000000001",
    "100000000000000000000003300000000000000000000001",
    "100000000000001100000003300000000000000000000001",
    "100000000000001000000003300000000000000000000001",
    "100000000000000000000003300000000000000000000001",
    "100000000000000000000003300000000000000000000001",
    "100000000000000000000003300000000000000000000001",
    "111111111111111111111111111111111111111111111111"
  ],
  "objects": [
    { "key": "boat", "name": "Boat", "col": 37, "row": 5, "x": 1200, "y": 176, "w": 46, "h": 46, "color": "#6b4a2f", "collidable": false, "info": "Boats like this banca carried people and goods along the river." },
    { "key": "goods", "name": "Goods", "col": 8, "row": 11, "x": 285, "y": 375, "w": 46, "h": 46, "color": "#b5893b", "collidable": false, "info": "Rice, fish, and woven goods were common items traded along the river." },
    { "key": "agoho", "name": "Agoho Tree", "col": 28, "row": 7, "x": 915, "y": 255, "w": 46, "h": 46, "color": "#3c7a3e", "collidable": false, "info": "Agoho trees were associated with the historical name \"Aguho.\"" },
    { "key": "house", "name": "House", "col": 34, "row": 24, "x": 1104, "y": 784, "w": 46, "h": 46, "color": "#8a5a3a", "collidable": false, "info": "Riverside houses were built close to the water for easy trade and travel." },
    { "key": "stall", "name": "Trading Stall", "col": 11, "row": 22, "x": 375, "y": 705, "w": 46, "h": 46, "color": "#c24a38", "collidable": false, "info": "The embarcadero was a landing point where boats loaded and unloaded goods." },
    { "key": "obj_tent_1", "name": "Tent 1", "col": 5, "row": 4, "x": 176, "y": 144, "w": 50, "h": 55, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_tent_1", "name": "Tent 1", "col": 1, "row": 4, "x": 48, "y": 144, "w": 50, "h": 55, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_tent_1", "name": "Tent 1", "col": 15, "row": 4, "x": 496, "y": 144, "w": 59, "h": 55, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_box_1", "name": "Box 1", "col": 2, "row": 5, "x": 80, "y": 176, "w": 20, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_box_1", "name": "Box 1", "col": 7, "row": 4, "x": 240, "y": 144, "w": 20, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_box_1", "name": "Box 1", "col": 11, "row": 4, "x": 368, "y": 144, "w": 20, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_box_3", "name": "Box 3", "col": 12, "row": 4, "x": 400, "y": 144, "w": 16, "h": 21, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_tent_4", "name": "Tent 4", "col": 45, "row": 12, "x": 1456, "y": 400, "w": 64, "h": 71, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_tent_2", "name": "Tent 2", "col": 45, "row": 8, "x": 1456, "y": 272, "w": 64, "h": 61, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_tent_3", "name": "Tent 3", "col": 45, "row": 5, "x": 1456, "y": 176, "w": 65, "h": 62, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_14", "name": "Supplies 14", "col": 46, "row": 10, "x": 1488, "y": 336, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_11", "name": "Supplies 11", "col": 45, "row": 10, "x": 1456, "y": 336, "w": 19, "h": 26, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_14", "name": "Supplies 14", "col": 46, "row": 14, "x": 1488, "y": 464, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_15", "name": "Supplies 15", "col": 45, "row": 14, "x": 1456, "y": 464, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_16", "name": "Supplies 16", "col": 46, "row": 15, "x": 1488, "y": 496, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_16", "name": "Supplies 16", "col": 44, "row": 6, "x": 1424, "y": 208, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_16", "name": "Supplies 16", "col": 46, "row": 6, "x": 1488, "y": 208, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_16", "name": "Supplies 16", "col": 8, "row": 4, "x": 272, "y": 144, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_16", "name": "Supplies 16", "col": 7, "row": 5, "x": 240, "y": 176, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_16", "name": "Supplies 16", "col": 3, "row": 5, "x": 112, "y": 176, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_16", "name": "Supplies 16", "col": 12, "row": 5, "x": 400, "y": 176, "w": 16, "h": 22, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_house_4", "name": "House 4", "col": 1, "row": 9, "x": 48, "y": 304, "w": 154, "h": 149, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_1", "name": "Supplies 1", "col": 4, "row": 12, "x": 144, "y": 400, "w": 26, "h": 35, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_2", "name": "Supplies 2", "col": 4, "row": 13, "x": 144, "y": 432, "w": 25, "h": 41, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_supply_3", "name": "Supplies 3", "col": 3, "row": 13, "x": 112, "y": 432, "w": 25, "h": 34, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_house_3", "name": "House 3", "col": 1, "row": 21, "x": 48, "y": 688, "w": 147, "h": 157, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_house_3", "name": "House 3", "col": 1, "row": 27, "x": 48, "y": 880, "w": 147, "h": 157, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_decor_3", "name": "Decor 3", "col": 1, "row": 24, "x": 48, "y": 784, "w": 19, "h": 21, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_decor_3", "name": "Decor 3", "col": 2, "row": 24, "x": 80, "y": 784, "w": 19, "h": 21, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_decor_4", "name": "Decor 4", "col": 2, "row": 24, "x": 80, "y": 784, "w": 15, "h": 13, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_decor_3", "name": "Decor 3", "col": 2, "row": 30, "x": 80, "y": 976, "w": 19, "h": 21, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_decor_1", "name": "Decor 1", "col": 8, "row": 21, "x": 272, "y": 688, "w": 48, "h": 26, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_vegetation_3", "name": "Vegetation 3", "col": 4, "row": 21, "x": 144, "y": 688, "w": 27.299999999999997, "h": 33.599999999999994, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_decor_1", "name": "Decor 1", "col": 3, "row": 30, "x": 112, "y": 976, "w": 48, "h": 26, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_plant_11", "name": "Plants 11", "col": 4, "row": 23, "x": 144, "y": 752, "w": 50, "h": 45, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_plant_11", "name": "Plants 11", "col": 4, "row": 28, "x": 144, "y": 912, "w": 50, "h": 45, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_plant_79", "name": "Plants 79", "col": 15, "row": 30, "x": 496, "y": 976, "w": 50, "h": 69, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_plant_79", "name": "Plants 79", "col": 19, "row": 30, "x": 624, "y": 976, "w": 50, "h": 69, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_plant_79", "name": "Plants 79", "col": 21, "row": 30, "x": 688, "y": 976, "w": 50, "h": 69, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_plant_79", "name": "Plants 79", "col": 17, "row": 30, "x": 560, "y": 976, "w": 50, "h": 69, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_plant_112", "name": "Plants 112", "col": 33, "row": 29, "x": 1072, "y": 944, "w": 60, "h": 70, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_bench_2", "name": "Bench 2", "col": 32, "row": 7, "x": 1040, "y": 240, "w": 60.199999999999996, "h": 66.5, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_plant_87", "name": "Plants 87", "col": 32, "row": 5, "x": 1040, "y": 176, "w": 60, "h": 75, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_building_2", "name": "Building 2", "col": 21, "row": 7, "x": 688, "y": 240, "w": 93.1, "h": 100.8, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_fountain_1", "name": "Fountain 1", "col": 24, "row": 17, "x": 784, "y": 560, "w": 147, "h": 129.5, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_house_1", "name": "House 1", "col": 45, "row": 20, "x": 1456, "y": 656, "w": 116, "h": 112, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_house_1", "name": "House 1", "col": 45, "row": 29, "x": 1456, "y": 944, "w": 116, "h": 112, "color": "#888888", "collidable": true, "info": "" },
    { "key": "obj_plant_33", "name": "Plants 33", "col": 45, "row": 23, "x": 1456, "y": 752, "w": 38, "h": 51, "color": "#888888", "collidable": false, "info": "" },
    { "key": "obj_plant_33", "name": "Plants 33", "col": 45, "row": 25, "x": 1456, "y": 816, "w": 38, "h": 51, "color": "#888888", "collidable": false, "info": "" }
  ]
};

// The 5 "river life" objects Hiraya needs to find are placed in the editor
// like any other object, just with these specific keys so this scene can
// pick them out of CHAPTER1_MAP_DATA.objects and wire up the find/interact
// logic below. Everything else in .objects is treated as non-interactive
// scenery (tents, houses, plants, boxes, etc).
const CHAPTER1_QUEST_KEYS = ['boat', 'goods', 'agoho', 'house', 'stall'];

// Real art for the 5 river-life objects above (see preload() - loaded
// separately since CHAPTER1_QUEST_KEYS is excluded from the generic
// object loader).
const CHAPTER1_QUEST_ICONS = {
  boat: { key: 'quest_boat', w: 108, h: 112 },
  goods: { key: 'quest_goods', w: 98, h: 112 },
  agoho: { key: 'quest_agoho', w: 106, h: 112 },
  house: { key: 'quest_house', w: 100, h: 112 },
  stall: { key: 'quest_trading_stall', w: 100, h: 112 }
};

// Same procedural tile painters mapLoader.js uses for the built-in tile
// types (grass/tree/water/path/sand/wall) - reused here so a tile type
// with no `imageKey` (e.g. tree, water, sand, wall) still gets real texture
// instead of a flat color fill.
const CHAPTER1_BUILTIN_DRAWERS = {
  grass: drawGrass, tree: drawTree, water: drawWater,
  path: drawPath, sand: drawSand, wall: drawWall
};

// ---------------------------------------------------------------------------
// Asset-path resolvers - mirror editor.html's TILE_LIBRARY / OBJECT_LIBRARY
// naming so any tile/object key coming out of the map editor resolves to
// the right file under assets/src automatically.
// Trimmed to only the categories the current map uses. If you later place
// something from another category in the editor (shadows, stones, fences,
// ground paths, etc.), add its entry back here.
// ---------------------------------------------------------------------------
const CHAPTER1_TILE_KEY_SPECS = {
  fieldsTile: { dir: 'assets/src/1 Tiles', file: 'FieldsTile' }
};
function resolveChapter1TileImagePath(key) {
  const m = key.match(/^(.+)_(\d+)$/);
  if (!m) return null;
  const spec = CHAPTER1_TILE_KEY_SPECS[m[1]];
  if (!spec) return null;
  return `${spec.dir}/${spec.file}_${m[2]}.png`;
}

const CHAPTER1_OBJECT_FOLDER_SPECS = {
  decor: { base: 'assets/src/2 Objects', folder: '3 Decor' },
  box: { base: 'assets/src/2 Objects', folder: '4 Box' },
  tent: { base: 'assets/src/2 Objects', folder: '6 Tent' },
  house: { base: 'assets/src/2 Objects', folder: '7 House' },
  bench: { base: 'assets/src/2 Objects', folder: '8 Bench' },
  fountain: { base: 'assets/src/2 Objects', folder: '10 Fountain' },
  vegetation: { base: 'assets/src/2 Objects', folder: '11 Vegetation' },
  building: { base: 'assets/src/2 Objects', folder: '13 Building' },
  plant: { base: 'assets/src', folder: '4 Plants' },
  supply: { base: 'assets/src', folder: '5 Supplies' }
};
function resolveChapter1ObjectImagePath(key) {
  const m = key.match(/^obj_([a-z0-9]+)_(\d+)$/);
  if (!m) return null;
  const spec = CHAPTER1_OBJECT_FOLDER_SPECS[m[1]];
  if (!spec) return null;
  return `${spec.base}/${spec.folder}/${m[2]}.png`;
}

function chapter1HexToInt(css, fallback) {
  if (!css) return fallback;
  const n = parseInt(css.replace('#', ''), 16);
  return Number.isNaN(n) ? fallback : n;
}

// Builds the tileTypes config loadMap() expects (see mapLoader.js) straight
// out of CHAPTER1_MAP_DATA.tileTypes: real art where an imageKey is given,
// the matching procedural painter otherwise.
function buildChapter1TileTypes(mapData) {
  const cfg = {};
  Object.entries(mapData.tileTypes).forEach(([id, t]) => {
    cfg[id] = {
      name: t.name,
      color: chapter1HexToInt(t.color, 0x888888),
      solid: !!t.solid,
      imageKey: t.imageKey || undefined,
      noFlipY: true, // real art tiles (and hand-painted trees) shouldn't mirror
      draw: t.imageKey ? undefined : CHAPTER1_BUILTIN_DRAWERS[t.name]
    };
  });
  return cfg;
}

// ==========================================================================
// MINI-GAME 2 - Sagwan sa Ilog (River Run)
// A lane-dash down the Aguho river to the embarcadero: steer the banca
// between 3 channels to scoop up the goods that really left by boat,
// leave household things alone, and dodge the driftwood/branches the
// river throws in the way.
// ==========================================================================
const CHAPTER1_RIVER_LANE_X = [-96, 0, 96]; // boat x-offsets from screen center: left / mid / right channel
const CHAPTER1_RIVER_GOAL_DISTANCE = 2200; // "distance" travelled before the embarcadero comes into view (~24s)
const CHAPTER1_RIVER_SCROLL_SPEED = 90; // px/sec the current carries the boat forward (drives distance + bg scroll)
const CHAPTER1_RIVER_ITEM_SPEED = 175; // px/sec items drift down toward the boat
const CHAPTER1_RIVER_START_LIVES = 3;
const CHAPTER1_RIVER_SPAWN_MS = 700; // roughly how often a new item enters

// Correct catches - genuine embarcadero trade goods - add to the cargo tally.
// Each has an `icon` texture key (loaded in preload()) plus a `size` to
// display it at; spawnRiverItem() falls back to the emoji if the icon key
// isn't loaded for some reason.
const CHAPTER1_RIVER_GOOD_ITEMS = [
  { emoji: '🌾', label: 'rice for trade', icon: 'river_rice', size: [40, 50] },
  { emoji: '🐟', label: 'dried fish', icon: 'river_fish', size: [36, 48] },
  { emoji: '🧺', label: 'woven goods', icon: 'river_woven', size: [40, 42] }
];
// Wrong catches - household things that never left Aguho - cost a life.
const CHAPTER1_RIVER_BAD_ITEMS = [
  { emoji: '🐃', label: "the neighbor's carabao", icon: 'river_carabao', size: [46, 48] },
  { emoji: '🍲', label: 'a family cooking pot', icon: 'river_pot', size: [38, 38] }
];
// Pure hazards - nothing to learn from these, just something to steer around.
const CHAPTER1_RIVER_HAZARDS = [
  { emoji: '🪵', label: 'driftwood', icon: 'river_driftwood', size: [34, 52] },
  { emoji: '🦆', label: 'a startled duck', icon: 'river_duck', size: [30, 38] }
];

// A brighter, daylight variant of mapLoader.js's drawWater, used only for
// the river-run mini-game so the shared drawWater (used by the explore map)
// stays untouched.
function drawRiverRunWater(g, rand) {
  g.fillStyle(0x4a90c4, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  g.fillStyle(0x3f7fb0, 0.45).fillRect(0, TILE_SIZE * 0.55, TILE_SIZE, TILE_SIZE * 0.45);
  g.lineStyle(2, 0xb9e6fa, 0.65);
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

class Chapter1Scene extends Phaser.Scene {
  constructor() {
    super('Chapter1');
  }

  preload() {
    // Everything the riverside needs is derived straight from
    // CHAPTER1_MAP_DATA: load each tile type's image (if it has one) and
    // each placed object's image (if its key resolves to one under
    // assets/src). Quest keys (boat/goods/agoho/house/stall) aren't
    // covered by that generic resolver, so their icons are loaded
    // explicitly below (see CHAPTER1_QUEST_ICONS).
    this.load.image('quest_boat', 'assets/icons/ch1-boat.png');
    this.load.image('quest_goods', 'assets/icons/ch1-goods.png');
    this.load.image('quest_agoho', 'assets/icons/ch1-agoho-tree.png');
    this.load.image('quest_house', 'assets/icons/ch1-house.png');
    this.load.image('quest_trading_stall', 'assets/icons/ch1-trading-stall.png');

    // River-run boat: Hiraya paddling, viewed from above - 6-frame rowing loop.
    this.load.spritesheet('hiraya_row', 'assets/icons/hiraya-row.png', { frameWidth: 152, frameHeight: 130 });

    // River good/bad/hazard items - top-down to match hiraya_row's camera angle.
    this.load.image('river_rice', 'assets/icons/ch1-rice.png');
    this.load.image('river_fish', 'assets/icons/ch1-dried-fish.png');
    this.load.image('river_woven', 'assets/icons/ch1-woven-craft.png');
    this.load.image('river_driftwood', 'assets/icons/ch1-driftwood.png');
    this.load.image('river_duck', 'assets/icons/ch1-duck.png');
    this.load.image('river_carabao', 'assets/icons/ch1-carabao.png');
    this.load.image('river_pot', 'assets/icons/ch1-pot.png');

    Object.values(CHAPTER1_MAP_DATA.tileTypes).forEach(t => {
      if (t.imageKey) {
        const path = resolveChapter1TileImagePath(t.imageKey);
        if (path) this.load.image(t.imageKey, path);
        else console.warn('Chapter1Scene: no path resolver for tile image key', t.imageKey);
      }
    });

    const loadedObjectKeys = new Set();
    CHAPTER1_MAP_DATA.objects.forEach(o => {
      if (CHAPTER1_QUEST_KEYS.includes(o.key)) return; // loaded above via CHAPTER1_QUEST_ICONS
      if (loadedObjectKeys.has(o.key)) return;
      const path = resolveChapter1ObjectImagePath(o.key);
      if (path) {
        this.load.image(o.key, path);
        loadedObjectKeys.add(o.key);
      } else {
        console.warn('Chapter1Scene: no path resolver for object key', o.key);
      }
    });
  }

  create(data) {
    SoundManager.playMusic(this, 'bg-game');
    const { width, height } = this.scale;
    const character = 'hiraya';
    const textureKey = character + '-sheet';
    this.prefix = character;
    this.speed = this.registry.get('playerSpeed') || 160;
    this.locked = false; // true during dialogue / popup / quiz - movement disabled
    this.mode = 'intro'; // intro -> explore -> transition -> riverrun -> transition -> quiz -> done

    // --- riverside map (loaded from the editor's exported JSON, see
    //     CHAPTER1_MAP_DATA above) ---
    this.map = loadMap(this, CHAPTER1_MAP_DATA.tiles, {
      tileTypes: buildChapter1TileTypes(CHAPTER1_MAP_DATA)
    });

    // --- player ---
    this.createPlayerAnims(textureKey);
    const startX = CHAPTER1_MAP_DATA.spawn.x;
    const startY = CHAPTER1_MAP_DATA.spawn.y;
    this.player = this.physics.add.sprite(startX, startY, textureKey, 0);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(C1_FRAME_W * 0.5, C1_FRAME_H * 0.35);
    this.player.setOffset(C1_FRAME_W * 0.25, C1_FRAME_H * 0.6);
    this.player.facing = 'down';
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

    // --- Lola Nena --- (frame 0 of lola-sheet = down-facing idle)
    this.lola = this.add.sprite(startX - 60, startY, 'lola-sheet', 0);
    // Static collision body sized to almost the whole sprite so the player
    // can't walk into/overlap Lola from any side. setSize(w, h, false)
    // disables auto-centering so setOffset() takes effect.
    this.physics.add.existing(this.lola, true);
    this.lola.body.setSize(C1_FRAME_W * 0.6, C1_FRAME_H * 0.85, false);
    this.lola.body.setOffset(C1_FRAME_W * 0.2, C1_FRAME_H * 0.08);
    this.physics.add.collider(this.player, this.lola);
    // Ensure Lola renders below player
    this.lola.setDepth(0);
    this.lolaPrompt = this.add.text(this.lola.x, this.lola.y - 90, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false);
    // Generic "near a river-life object" hint - repositioned each frame
    // above whichever quest object the player is closest to.
    this.interactPrompt = this.add.text(0, 0, 'Press E to interact', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false).setDepth(100000);
    this.returnFlag = this.add.text(this.lola.x, this.lola.y - 60, '❗', { fontSize: 26 })
      .setOrigin(0.5).setVisible(false);
```javascript
// --- Lola Nena automatic movement ---
this.lolaStartX = this.lola.x;
this.lolaLeftX = this.lolaStartX - 80;
this.lolaRightX = this.lolaStartX + 80;

this.lolaMovingRight = true;

this.lolaPatrolTween = this.tweens.add({
    targets: this.lola,
    x: this.lolaRightX,
    duration: 3000,
    ease: 'Linear',
    yoyo: true,
    repeat: -1,
    onYoyo: () => {
        this.lolaMovingRight = false;
        this.lola.setFlipX(true);
    },
    onRepeat: () => {
        this.lolaMovingRight = true;
        this.lola.setFlipX(false);
    }
});
```
    // --- 5 river-life interactables to find ---
    // Pulled from CHAPTER1_MAP_DATA.objects by key, so position/color/info
    // all come straight from what was placed in the map editor.
    this.objects = CHAPTER1_MAP_DATA.objects
      .filter(o => CHAPTER1_QUEST_KEYS.includes(o.key))
      .map(o => ({
        key: o.key,
        name: o.name,
        x: o.x,
        y: o.y,
        color: chapter1HexToInt(o.color, 0x888888),
        info: o.info
      }));

    // These 5 river-life objects are solid (like a fence or a crate), so each
    // gets a static physics body - same technique as the decorObstacles below.
    // A "Press E to interact" prompt (this.interactPrompt / update()) is shown
    // only while the player is near.
    this.questObstacles = [];
    this.objectSprites = this.objects.map(o => {
      const icon = CHAPTER1_QUEST_ICONS[o.key];
      const hasIcon = icon && this.textures.exists(icon.key);
      const rect = hasIcon
        ? this.add.image(o.x, o.y, icon.key).setDisplaySize(icon.w, icon.h).setDepth(o.y)
        : this.add.rectangle(o.x, o.y, 46, 46, o.color).setStrokeStyle(2, 0xf5e2c8).setDepth(o.y);
      this.physics.add.existing(rect, true);
      // Static bodies default to the texture's native size, not the
      // setDisplaySize() applied above - resync so the collision box
      // matches what's actually drawn.
      if (rect.body && rect.body.updateFromGameObject) rect.body.updateFromGameObject();
      this.questObstacles.push(rect);
      o.found = false;
      o.rect = rect;
      o.promptY = o.y - (icon ? icon.h / 2 : 23) - 12; // just above the icon's top edge
      return { rect };
    });
    this.physics.add.collider(this.player, this.questObstacles);

    // --- decorative scenery (tents, houses, plants, boxes, etc.) ---
    // Everything in CHAPTER1_MAP_DATA.objects that isn't a quest item above:
    // purely visual, except collidable ones also get a static physics body
    // so the player can't just walk through a house or a crate.
    this.decorObstacles = [];
    CHAPTER1_MAP_DATA.objects
      .filter(o => !CHAPTER1_QUEST_KEYS.includes(o.key))
      .forEach(o => {
        const hasImage = this.textures.exists(o.key);
        let vis;
        if (hasImage) {
          vis = this.add.image(o.x, o.y, o.key).setDisplaySize(o.w, o.h);
        } else {
          vis = this.add.rectangle(o.x, o.y, o.w, o.h, chapter1HexToInt(o.color, 0x888888));
        }
        vis.setDepth(o.y);
        if (o.collidable) {
          this.physics.add.existing(vis, true);
          this.decorObstacles.push(vis);
        }
      });
    this.physics.add.collider(this.player, this.decorObstacles);

    // 6th task - not a findable object, just walking back to report to Lola
    // once the 5 above are all found. See getTaskList().
    this.reportDone = false;

    // --- HUD --- (scrollFactor 0 so it stays pinned to the screen instead
    // of scrolling away with the map now that the camera follows the player)
    const displayName = character.charAt(0).toUpperCase() + character.slice(1);
    this.add.text(14, 12, displayName, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 18, color: '#fff8e7'
    }).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(900);

    this.add.text(width / 2, 16, 'Chapter 1: Aguho — The River Remembers', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 16, color: '#f5e2c8'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(900);

    // Wooden-Gold UI plank button (see createWoodButton in ui.js).
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
      showDialogue(this, 'Lola Nena', [
        'Long before the Pateros you know today, this place was called Aguho.',
        'The river was part of everyday life.',
        'People came here to trade, travel, and exchange goods.',
        'Go on, walk around and find what remains of that old river life. Come back when you have.'
      ], () => {
        this.locked = false;
        this.mode = 'explore';
        // Lola's task has now actually been given - reveal the Task button.
        this.taskBtnRect.setVisible(true);
        this.taskBtnTxt.setVisible(true);
      }, ['lola-wave', 'lola-happy', 'lola-happy', 'lola-wink']);
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

  // Full task list for the HUD counter / objectives modal: the 5 findable
  // objects, plus a 6th "Report to Lola Nena" task that only appears once
  // all 5 have been found (goes 5/5 -> 5/6, then 6/6 once you talk to her).
  getTaskList() {
    const list = this.objects.map(o => ({ name: o.name, found: o.found, info: o.info, iconKey: getObjectIconKey(this, o), type: 'item' }));
    if (this.objects.every(o => o.found)) {
      list.push({
        name: 'Report to Lola Nena',
        found: this.reportDone,
        info: 'Walk back to Lola Nena and press E to tell her what you found.',
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

  // --- Objectives modal: what to find, highlighted once found ----
  // Hovering a row that's already found pops up the info line learned from it.
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
      allObjectsFound ? 'All found — now report back to Lola:' : 'Find these around the riverside:', {
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

    tasks.forEach((o, i) => {
      const y = top + headerH + i * rowH;
      const found = o.found;
      const mark = this.add.text(width / 2 - 172, y, found ? '✓' : '—', {
        fontFamily: '"Tildunk", sans-serif', fontSize: 16, fontStyle: 'bold',
        color: found ? '#3c7a3e' : '#9aa0aa'
      }).setOrigin(0, 0.5);
      const label = this.add.text(width / 2 - 118, y, o.type === 'task' ? o.name : (found ? o.name : '???'), {
        fontFamily: '"Tildunk", sans-serif', fontSize: 15,
        color: found ? '#3c7a3e' : '#3b2410'
      }).setOrigin(0, 0.5);
      const status = this.add.text(width / 2 + 150, y, found
        ? (o.type === 'task' ? 'Done' : 'Found')
        : (o.type === 'task' ? 'Go talk to her' : 'Not found'), {
        fontFamily: '"Tildunk", sans-serif', fontSize: 11,
        color: found ? '#3c7a3e' : '#9aa0aa'
      }).setOrigin(1, 0.5);
      container.add([mark, label, status]);
      if (o.type !== 'task') addTaskRowIcon(this, container, width / 2 - 140, y, o.iconKey, found);

      if (found) {
        const hitZone = this.add.rectangle(width / 2, y, 356, rowH, 0xffffff, 0.001)
          .setInteractive({ useHandCursor: true })
          .setScrollFactor(0);
        const rowHighlight = this.add.rectangle(width / 2, y, 356, rowH, 0x3c7a3e, 0.12).setVisible(false);
        container.add([rowHighlight, hitZone]);

        hitZone.on('pointerover', () => {
          rowHighlight.setVisible(true);
          tooltipTxt.setText(o.info).setVisible(true);
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

    const dLola = Phaser.Math.Distance.Between(p.x, p.y, this.lola.x, this.lola.y);
    if (dLola < bestDist) { best = { type: 'lola' }; bestDist = dLola; }

    this.objects.forEach(o => {
      if (o.found) return;
      const d = interactGapToObject(p, o.rect);
      if (d < OBJECT_INTERACT_REACH && d < bestDist) { best = { type: 'object', obj: o }; bestDist = d; }
    });

    return best;
  }

  talkToLola() {
    const allFound = this.objects.every(o => o.found);
    if (!allFound) {
      this.locked = true;
      showDialogue(this, 'Lola Nena', [
        `You've found ${this.objects.filter(o => o.found).length} of 5 so far.`,
        'Keep looking around the riverside.'
      ], () => { this.locked = false; }, ['lola-happy', 'lola-wave']);
      return;
    }

    this.locked = true;
    this.returnFlag.setVisible(false);
    this.reportDone = true;
    this.updateProgress();
    showDialogue(this, 'Lola Nena', [
      'You found them all! the boat, the goods, the agoho tree, the house, and the trading stall by the embarcadero.',
      'This place used to be called Aguho, named after those very agoho trees along the riverbank.',
      'Boats loaded and unloaded goods right there at the embarcadero, that was everyday life for the people here.',
      'One more thing before we\'re done, the boat\'s about to leave, and I could use another pair of hands rowing. Climb in with me.'
    ], () => this.startRiverTransition(), ['lola-happy', 'lola-happy', 'lola-happy', 'lola-wink']);
  }

  // ==========================================================================
  // MINI-GAME 2 - Sagwan sa Ilog (River Run) - see CHAPTER1_RIVER_* above
  // ==========================================================================

  // Curtain-close over the riverside, build the river minigame behind it,
  // then curtain-open into it.
  startRiverTransition() {
    this.mode = 'transition';
    this.locked = true;
    curtainClose(this, () => {
      this.launchRiverRun();
      curtainOpen(this, () => this.showRiverIntro());
    });
  }

  showRiverIntro() {
    showDialogue(this, 'Lola Nena', [
      'Left and right to steer, three channels to choose from.',
      'Rice, dried fish, woven goods, scoop those up, they\'re bound for trade. Leave anything from a household alone, and mind the driftwood.'
    ], () => {
      this.mode = 'riverrun';
      this.startRiverSpawning();
    }, ['lola-wink', 'lola-happy']);
  }

  // Builds the full-screen river: scrolling water, bank treeline, HUD, and
  // the boat itself.
  launchRiverRun() {
    const { width, height } = this.scale;
    this.riverLaneIndex = 1;
    this.riverCargo = 0;
    this.riverLives = CHAPTER1_RIVER_START_LIVES;
    this.riverDistance = 0;
    this.riverItems = [];

    this.riverContainer = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);

    if (!this.textures.exists('riverrun_water_tile_bright')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      drawRiverRunWater(g, Math.random);
      g.generateTexture('riverrun_water_tile_bright', 32, 32);
      g.destroy();
    }
    this.riverWaterBg = this.add.tileSprite(width / 2, height / 2, width, height, 'riverrun_water_tile_bright').setScrollFactor(0);
    this.riverContainer.add(this.riverWaterBg);

    // Riverbank ground - tiled with the same grass art the main explore map
    // uses (fieldsTile_38, loaded in preload() for that map's grass tiles).
    // Scrolls with the current in updateRiverRun().
    const bankW = Math.max(60, (width - 340) / 2);
    const leftBank = this.add.tileSprite(bankW / 2, height / 2, bankW, height, 'fieldsTile_38').setScrollFactor(0);
    const rightBank = this.add.tileSprite(width - bankW / 2, height / 2, bankW, height, 'fieldsTile_38').setScrollFactor(0);
    this.riverBankGrass = [leftBank, rightBank];
    this.riverContainer.add([leftBank, rightBank]);

    this.riverTrees = [];
    const treeMargin = 34; // keep trees off the bank's outer/inner edges
    const treeXRange = Math.max(10, bankW - treeMargin * 2);
    const randomTreeX = (side) => {
      const centerX = side === 'left' ? bankW / 2 : width - bankW / 2;
      return centerX - treeXRange / 2 + Math.random() * treeXRange;
    };
    const spawnTree = (side, y) => {
      // Real agoho art if loaded (quest_agoho), a tree emoji otherwise.
      const x = randomTreeX(side);
      const t = this.textures.exists('quest_agoho')
        ? this.add.image(x, y, 'quest_agoho').setDisplaySize(68, 72).setScrollFactor(0)
        : this.add.text(x, y, '\ud83c\udf33', { fontSize: 52 }).setOrigin(0.5).setScrollFactor(0);
      this.riverContainer.add(t);
      this.riverTrees.push({ obj: t, side });
    };
    // Seed both banks top-to-bottom (plus a bit above the top edge) with
    // randomly-spaced trees so it doesn't read as an obvious repeating tile.
    ['left', 'right'].forEach((side) => {
      let y = -60;
      while (y < height + 60) {
        spawnTree(side, y);
        y += Phaser.Math.Between(100, 160);
      }
    });

    // Faint lane-divider guides between the 3 channels.
    for (let i = 1; i < CHAPTER1_RIVER_LANE_X.length; i++) {
      const lineX = width / 2 + (CHAPTER1_RIVER_LANE_X[i] + CHAPTER1_RIVER_LANE_X[i - 1]) / 2;
      const line = this.add.rectangle(lineX, height / 2, 2, height, 0xffffff, 0.18).setScrollFactor(0);
      this.riverContainer.add(line);
    }

    // --- HUD ---
    this.riverTitleTxt = this.add.text(width / 2, 18, 'Sagwan sa Ilog — Paddle to the Embarcadero', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 16, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 10, y: 4 }
    }).setOrigin(0.5, 0).setScrollFactor(0);

    const barW = 300, barH = 12, barY = 50;
    this.riverProgressBg = this.add.rectangle(width / 2, barY, barW, barH, 0x000000, 0.5).setStrokeStyle(2, 0xf5e2c8).setScrollFactor(0);
    this.riverProgressFill = this.add.rectangle(width / 2 - barW / 2, barY, 2, barH - 4, 0x3c7a3e, 1).setOrigin(0, 0.5).setScrollFactor(0);
    this.riverBarW = barW;

    this.riverCargoTxt = this.add.text(16, 16, 'Cargo: 0', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
    }).setScrollFactor(0);
    this.riverLivesTxt = this.add.text(width - 16, 16, '❤️❤️❤️', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
    }).setOrigin(1, 0).setScrollFactor(0);

    this.riverContainer.add([
      this.riverProgressBg, this.riverProgressFill, this.riverTitleTxt, this.riverCargoTxt, this.riverLivesTxt
    ]);

    // The boat - Hiraya's rowing sheet if loaded, quest_boat art if just
    // that is, a canoe emoji if neither is available.
    const boatX = width / 2 + CHAPTER1_RIVER_LANE_X[this.riverLaneIndex];
    const boatY = height - 110;
    if (this.textures.exists('hiraya_row')) {
      if (!this.anims.exists('hiraya-row')) {
        this.anims.create({
          key: 'hiraya-row',
          frames: this.anims.generateFrameNumbers('hiraya_row', { start: 0, end: 5 }),
          frameRate: 8,
          repeat: -1
        });
      }
      this.riverBoat = this.add.sprite(boatX, boatY, 'hiraya_row', 0).setDisplaySize(90, 77).setScrollFactor(0);
      this.riverBoat.play('hiraya-row');
    } else if (this.textures.exists('quest_boat')) {
      this.riverBoat = this.add.image(boatX, boatY, 'quest_boat').setDisplaySize(72, 76).setScrollFactor(0);
    } else {
      this.riverBoat = this.add.text(boatX, boatY, '🛶', { fontSize: 46 }).setOrigin(0.5).setScrollFactor(0);
    }
    this.riverContainer.add(this.riverBoat);
  }

  startRiverSpawning() {
    this.riverSpawnTimer = this.time.addEvent({
      delay: CHAPTER1_RIVER_SPAWN_MS,
      callback: this.spawnRiverItem,
      callbackScope: this,
      loop: true
    });
    this.spawnRiverItem(); // seed one right away so the river doesn't feel empty
  }

  spawnRiverItem() {
    if (this.mode !== 'riverrun') return;
    const { width } = this.scale;
    const roll = Math.random();
    let pool, type;
    if (roll < 0.5) { pool = CHAPTER1_RIVER_GOOD_ITEMS; type = 'good'; }
    else if (roll < 0.74) { pool = CHAPTER1_RIVER_BAD_ITEMS; type = 'bad'; }
    else { pool = CHAPTER1_RIVER_HAZARDS; type = 'hazard'; }
    const data = Phaser.Utils.Array.GetRandom(pool);
    const lane = Phaser.Math.Between(0, CHAPTER1_RIVER_LANE_X.length - 1);
    const x = width / 2 + CHAPTER1_RIVER_LANE_X[lane];
    let obj;
    if (data.icon && this.textures.exists(data.icon)) {
      const [w, h] = data.size || [36, 36];
      obj = this.add.image(x, -30, data.icon).setDisplaySize(w, h).setScrollFactor(0);
    } else {
      obj = this.add.text(x, -30, data.emoji, { fontSize: 32 }).setOrigin(0.5).setScrollFactor(0);
    }
    this.riverContainer.add(obj);
    this.riverItems.push({ obj, lane, type, data, caught: false });
  }

  shiftRiverLane(delta) {
    const next = Phaser.Math.Clamp(this.riverLaneIndex + delta, 0, CHAPTER1_RIVER_LANE_X.length - 1);
    if (next === this.riverLaneIndex) return;
    this.riverLaneIndex = next;
    const targetX = this.scale.width / 2 + CHAPTER1_RIVER_LANE_X[next];
    this.tweens.add({ targets: this.riverBoat, x: targetX, duration: 130, ease: 'Sine.easeOut' });
  }

  // Small floating toast above the boat - "+1 rice for trade" / "not cargo"
  // feedback in real time.
  showRiverToast(text, colorCss) {
    const toast = this.add.text(this.riverBoat.x, this.riverBoat.y - 44, text, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, fontStyle: 'bold', color: colorCss,
      backgroundColor: '#fff8e7', padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setScrollFactor(0);
    this.riverContainer.add(toast);
    this.tweens.add({
      targets: toast, y: toast.y - 26, alpha: 0, duration: 650, ease: 'Cubic.easeOut',
      onComplete: () => toast.destroy()
    });
  }

  updateRiverHud() {
    this.riverCargoTxt.setText(`Cargo: ${this.riverCargo}`);
    this.riverLivesTxt.setText('❤️'.repeat(Math.max(0, this.riverLives)));
    const pct = Phaser.Math.Clamp(this.riverDistance / CHAPTER1_RIVER_GOAL_DISTANCE, 0, 1);
    this.riverProgressFill.width = Math.max(2, this.riverBarW * pct);
  }

  handleRiverCatch(item) {
    if (item.type === 'good') {
      this.riverCargo++;
      SoundManager.play(this, 'correct');
      this.showRiverToast(`+1 ${item.data.label}`, '#3c7a3e');
    } else {
      this.riverLives--;
      SoundManager.play(this, 'incorrect');
      const msg = item.type === 'bad' ? `Not cargo — ${item.data.label}` : `Watch out — ${item.data.label}!`;
      this.showRiverToast(msg, '#9c3b2e');
      this.cameras.main.shake(120, 0.004);
    }
    this.updateRiverHud();
    if (this.riverLives <= 0) this.finishRiverRun();
  }

  updateRiverRun(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.keys.left) || Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.shiftRiverLane(-1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.right) || Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.shiftRiverLane(1);
    }

    this.riverWaterBg.tilePositionY -= CHAPTER1_RIVER_SCROLL_SPEED * (delta / 1000);
    this.riverBankGrass.forEach(b => { b.tilePositionY -= CHAPTER1_RIVER_SCROLL_SPEED * (delta / 1000); });
    this.riverDistance += CHAPTER1_RIVER_SCROLL_SPEED * (delta / 1000);
    this.updateRiverHud();

    // Scroll the treeline down at the same speed as the water/current so
    // the banks read as passing by. Once a tree drifts off the bottom,
    // recycle it back above the topmost tree on its own side.
    const treeScroll = CHAPTER1_RIVER_SCROLL_SPEED * (delta / 1000);
    ['left', 'right'].forEach((side) => {
      const sideTrees = this.riverTrees.filter(t => t.side === side);
      let minY = Infinity;
      sideTrees.forEach(t => {
        t.obj.y += treeScroll;
        if (t.obj.y < minY) minY = t.obj.y;
      });
      sideTrees.forEach(t => {
        if (t.obj.y > this.scale.height + 60) {
          minY -= Phaser.Math.Between(100, 160);
          t.obj.y = minY;
          const bankW = Math.max(60, (this.scale.width - 340) / 2);
          const treeMargin = 34;
          const treeXRange = Math.max(10, bankW - treeMargin * 2);
          const centerX = side === 'left' ? bankW / 2 : this.scale.width - bankW / 2;
          t.obj.x = centerX - treeXRange / 2 + Math.random() * treeXRange;
        }
      });
    });

    const boatY = this.riverBoat.y;
    const catchWindow = 34;
    for (let i = this.riverItems.length - 1; i >= 0; i--) {
      const item = this.riverItems[i];
      item.obj.y += CHAPTER1_RIVER_ITEM_SPEED * (delta / 1000);
      if (!item.caught && item.lane === this.riverLaneIndex && Math.abs(item.obj.y - boatY) < catchWindow) {
        item.caught = true;
        item.obj.destroy();
        this.riverItems.splice(i, 1);
        this.handleRiverCatch(item);
        if (this.mode !== 'riverrun') return; // handleRiverCatch may have just ended the run
        continue;
      }
      if (item.obj.y > this.scale.height + 40) {
        item.obj.destroy();
        this.riverItems.splice(i, 1);
      }
    }

    if (this.riverDistance >= CHAPTER1_RIVER_GOAL_DISTANCE) this.finishRiverRun();
  }

  finishRiverRun() {
    if (this.mode !== 'riverrun') return; // guard against double-triggering (last life + goal reached same frame)
    const reachedGoal = this.riverDistance >= CHAPTER1_RIVER_GOAL_DISTANCE;
    this.mode = 'transition';
    this.locked = true;
    if (this.riverSpawnTimer) { this.riverSpawnTimer.remove(); this.riverSpawnTimer = null; }
    this.riverItems.forEach(it => it.obj.destroy());
    this.riverItems = [];
    SoundManager.play(this, reachedGoal ? 'complete' : 'incorrect');
    curtainClose(this, () => {
      if (this.riverContainer) { this.riverContainer.destroy(); this.riverContainer = null; }
      this.riverTrees = [];
      curtainOpen(this, () => {
        if (reachedGoal) this.showRiverRecap();
        else this.showRiverFailRetry();
      });
    });
  }

  showRiverRecap() {
    const loads = `${this.riverCargo} load${this.riverCargo === 1 ? '' : 's'}`;
    this.locked = true;
    showDialogue(this, 'Lola Nena', [
      `We made it to the embarcadero, and you brought in ${loads} of good trade cargo along the way.`,
      'That\'s the embarcadero for you, boats coming and going with everyday goods.',
      'Let\'s see what you remember.'
    ], () => this.startQuiz(), ['lola-happy', 'lola-happy', 'lola-wink']);
  }

  // The banca capsized (3 bad catches/hazards) before reaching the
  // embarcadero - Lola Nena talks it over, then it's straight back into a
  // fresh run.
  showRiverFailRetry() {
    this.locked = true;
    showDialogue(this, 'Lola Nena', [
      'Easy now,the banca took on too much before we ever reached the embarcadero.',
      'No harm done. Climb back in, we\'ll paddle that stretch again.'
    ], () => this.retryRiverRun(), ['lola-wave', 'lola-wink']);
  }

  // Same close/build/open pairing startRiverTransition() uses, just
  // skipping the instructions on the second try.
  retryRiverRun() {
    this.mode = 'transition';
    this.locked = true;
    curtainClose(this, () => {
      this.launchRiverRun();
      curtainOpen(this, () => {
        this.mode = 'riverrun';
        this.startRiverSpawning();
      });
    });
  }

  interactWithObject(o) {
    this.locked = true;
    showFoundItemPopup(this, o, () => {
      o.found = true;
      // setAlpha works on both the Image (real icon) and the Rectangle
      // (fallback if an icon ever fails to load).
      o.rect.setAlpha(0.45);
      this.updateProgress();
      this.locked = false;
      if (this.objects.every(x => x.found)) {
        this.returnFlag.setVisible(true);
        showToast(this, 'Talk to Lola Nena');
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
        q: 'What was Pateros historically called?',
        options: ['Aguho', 'Poblacion', 'Santa Ana', 'Tabacalera'],
        correct: 0,
        explanation: 'Pateros was historically known as "Aguho," named after the agoho trees that once lined the riverside. Poblacion, Santa Ana, and Tabacalera are barangays within present-day Pateros, not the old name of the town itself.'
      },
      {
        q: 'Agoho trees were associated with what?',
        options: ['The old name "Aguho"', 'A type of trading boat', 'The town\'s patron saint', 'A Spanish colonial title'],
        correct: 0,
        explanation: 'The agoho trees growing along the river gave the area its old name, "Aguho."'
      },
      {
        q: 'What happened at the embarcadero?',
        options: ['Boats loaded and unloaded goods', 'Ducks were herded to market', 'The town council held session', 'Balut vendors set up their stalls'],
        correct: 0,
        explanation: 'The embarcadero was the riverside landing point where boats loaded and unloaded goods for trade.'
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

    // Continue sits below wherever the explanation text actually ends.
    const continueY = explanationTxt.y + explanationTxt.height + 24;

    // If that pushes the button past the panel's original bottom edge,
    // grow the panel downward (top edge stays put) so the button and the
    // last line of explanation text stay inside the cream box.
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
    if (!pages.includes(1)) pages.push(1);
    this.registry.set('journalPages', pages);
    // Persist the page too, so it is still readable after a reload.
    ChapterProgress.addJournalPage(1);
    // Persist to localStorage so Chapter 2 shows up unlocked in the main
    // menu's Chapter list even after a page reload.
    ChapterProgress.unlockNextAfter('Chapter1');

    // A short wrap-up from Lola Nena before the reward panel.
    this.locked = true;
    showDialogue(this, 'Lola Nena', [
      'You really do understand Aguho now, the river, the trade, the community that grew up around it.',
      'Keep this page safe. There is more of the journal waiting for you.'
    ], () => this.showJournalReward(), ['lola-happy', 'lola-wink']);
  }

  showJournalReward() {
    const { width, height } = this.scale;
    const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, 460, 240, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    const title = this.add.text(width / 2, height / 2 - 80, 'Journal Page #1 Unlocked!', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    const scoreTxt = this.add.text(width / 2, height / 2 - 34, `You remembered ${this.quizScore} / ${this.quizQuestions.length}.`, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#3b2410'
    }).setOrigin(0.5);
    const flavor = this.add.text(width / 2, height / 2, 'Aguho: The River Remembers — recorded in the journal.', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 14, color: '#6b4a2f', align: 'center', wordWrap: { width: 380 }
    }).setOrigin(0.5, 0);

    container.add([overlay, panel, title, scoreTxt, flavor]);

    const { rect, txt } = createButton(this, width / 2 + 95, height / 2 + 88, 'Continue', () => {
      // Curtain-close (with its whoosh) pairs with Chapter2Scene's own
      // curtain-open on create(), so this reads as one continuous transition.
      curtainClose(this, () => this.scene.start('Chapter2'));
    }, { width: 170, height: 44, fontSize: 17, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);

    // Lets the player read the page they just collected before moving on.
    JournalBook.addReadButton(this, container, 1, width / 2 - 95, height / 2 + 88, { width: 170, height: 44, fontSize: 16 });
  }

  update(time, delta) {
    if (this.mode === 'riverrun') {
      this.updateRiverRun(time, delta);
      return;
    }

    // interaction prompt + key handling
    if (!this.locked && (this.mode === 'explore')) {
      const nearest = this.nearestInteractable();
      if (nearest && nearest.type === 'lola') {
        this.lolaPrompt.setText('Press E to talk').setVisible(true);
        this.interactPrompt.setVisible(false);
      } else if (nearest && nearest.type === 'object') {
        this.lolaPrompt.setVisible(false);
        this.interactPrompt.setPosition(nearest.obj.x, nearest.obj.promptY).setVisible(true);
      } else {
        this.lolaPrompt.setVisible(false);
        this.interactPrompt.setVisible(false);
      }

      if (Phaser.Input.Keyboard.JustDown(this.keys.interact) && nearest) {
        if (nearest.type === 'lola') this.talkToLola();
        else this.interactWithObject(nearest.obj);
      }
    } else {
      this.lolaPrompt.setVisible(false);
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