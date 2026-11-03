const C2_FRAME_W = 44;
const C2_FRAME_H = 78;

// NOTE: INTERACT_RADIUS is declared once in Chapter1Scene.js (loaded before
// this file in index.html) and reused here as-is.

// --- Chapter 2 map layout ---------------------------------------------
// "Old Town" map for the "Build the Town" mini-game. A grass field is cut
// by a camino real - a two-tile-wide north-south road crossed by an
// east-west street - with a sandy town-center plaza around the crossing.
// Five empty plots (see CHAPTER2_PLOT_DATA below) sit around the map,
// waiting for the player to work out what belongs where.
// Same 48x32 / 32px-tile convention as Chapter1Scene (see mapLoader.js).
//   0 = grass (walkable)   3 = road (walkable)   4 = plaza sand (walkable)   5 = wall (blocked)
const CHAPTER2_COLS = 48;
const CHAPTER2_ROWS = 32;
const CHAPTER2_ROAD_COLS = [23, 24];
const CHAPTER2_ROAD_ROWS = [15, 16];

// --- MAP SOURCES ------------------------------------------------------------
// 1) EMBEDDED EDITOR EXPORT (CHAPTER2_OLD_TOWN_SPAWN / _MAP / _OBJECTS, pasted
//    a bit further down): the newest map (tiles + decor objects: houses,
//    huts, tents, lamps, benches, fountain, plants...). To update it, re-export
//    from the map editor and paste the three consts over the old ones.
// 2) OPTIONAL JSON FILE (chapter2_old_town.json, loaded in preload()): the
//    objects already in it are KEPT and drawn too - the embedded export is
//    added on top of them (same object at the same tile is drawn only once,
//    with the JSON's own size).
// - CHAPTER2_MAP_JSON_PATH: where the JSON file is saved in your project.
// - Object images come from the asset pack in assets/src/ ("2 Objects",
//   "4 Plants", "7 Road1 Ground", ...). The key (e.g. obj_house_3) is
//   mapped to its file by CHAPTER2_OBJECT_FOLDERS below
//   (-> assets/src/2 Objects/7 House/3.png). If one image lives somewhere
//   unexpected, add it to CHAPTER2_OBJECT_PATH_OVERRIDES (key -> exact path).
// The editor export has no w/h, so objects that only exist in it are drawn at
// their image's native size (add `w`/`h` to an entry to resize it).
const CHAPTER2_MAP_JSON_KEY = 'chapter2_map_json';
const CHAPTER2_MAP_JSON_PATH = 'assets/maps/chapter2_old_town.json';
const CHAPTER2_SRC_DIR = 'assets/src/';
const CHAPTER2_OBJECT_PATH_OVERRIDES = {
  // 'obj_house_3': 'assets/src/2 Objects/7 House/3.png',
  hut: 'assets/src/2 Objects/7 House/4.png' // the "hut" markers in the map are drawn as House 4
};
// Width (px) a hut is drawn at - height follows House 4's own proportions.
// (Huts are 2 tiles = 64px apart, so keep this a bit under 64.)
const CHAPTER2_HUT_WIDTH = 60;

// Where each kind of decor object lives in the asset pack. The key
// "obj_<type>_<number>" maps to assets/src/<folder>/<number>.png, e.g.
// obj_house_3 -> assets/src/2 Objects/7 House/3.png
const CHAPTER2_OBJECT_FOLDERS = {
  house: '2 Objects/7 House',
  box: '2 Objects/4 Box',
  decor: '2 Objects/3 Decor',
  tent: '2 Objects/6 Tent',
  lamp: '2 Objects/9 Lamp',
  bench: '2 Objects/8 Bench',
  fountain: '2 Objects/10 Fountain',
  plant: '4 Plants',
  road1ground: '7 Road1 Ground'
};

function chapter2ImageCandidates(key, name) {
  if (CHAPTER2_OBJECT_PATH_OVERRIDES[key]) return [CHAPTER2_OBJECT_PATH_OVERRIDES[key]];
  const m = key.match(/^obj_([a-z0-9]+)_(\d+)$/);
  if (!m || !CHAPTER2_OBJECT_FOLDERS[m[1]]) return [];
  return [CHAPTER2_SRC_DIR + CHAPTER2_OBJECT_FOLDERS[m[1]] + '/' + m[2] + '.png'];
}
// These keys are only placeholders for the 5 buildable plots - the plots
// themselves are drawn by the scene (empty-plot icon -> building icon), so
// they are NOT drawn as decor. Their positions are used for the plots.
const CHAPTER2_PLOT_KEYS = ['market', 'municipal', 'community', 'houses', 'road'];

function buildChapter2Map() {
  const grid = [];
  for (let r = 0; r < CHAPTER2_ROWS; r++) {
    const row = [];
    for (let c = 0; c < CHAPTER2_COLS; c++) {
      const isBorder = r === 0 || r === CHAPTER2_ROWS - 1 || c === 0 || c === CHAPTER2_COLS - 1;
      row.push(isBorder ? '5' : '0');
    }
    grid.push(row);
  }

  // the camino real - every build clue in this chapter is stated relative
  // to this road, so it needs to actually run through the whole map.
  for (let r = 1; r < CHAPTER2_ROWS - 1; r++) {
    CHAPTER2_ROAD_COLS.forEach(c => { grid[r][c] = '3'; });
  }
  for (let c = 1; c < CHAPTER2_COLS - 1; c++) {
    CHAPTER2_ROAD_ROWS.forEach(r => { grid[r][c] = '3'; });
  }

  // sandy plaza patch around the crossing - "the center of the community"
  // the municipal building and community area plots sit inside.
  for (let r = 11; r <= 20; r++) {
    for (let c = 16; c <= 31; c++) {
      if (grid[r][c] === '0') grid[r][c] = '4';
    }
  }

  return grid.map(row => row.join(''));
}

const CHAPTER2_MAP = buildChapter2Map();
const CHAPTER2_TILE_SIZE = 32; // must match TILE_SIZE in mapLoader.js

// ---------------------------------------------------------------------------
// EMBEDDED EDITOR EXPORT - pasted verbatim from the map editor
// (chapter2_old_town). Don't also load the standalone chapter2_old_town.js in
// index.html - its contents live here now and it would be declared twice.
// ---------------------------------------------------------------------------
// Generated by the Pato Explorer map editor — paste straight into a scene file.
// Tile legend matches js/mapLoader.js's TILE_TYPES (same ids, same names).
const CHAPTER2_OLD_TOWN_SPAWN = { x: 720, y: 752 };

const CHAPTER2_OLD_TOWN_MAP = [
  '555555555555555555555555555555555555555555555555',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000044444443344444440000000000000005',
  '500000000000000044444443344444440000000000000005',
  '500000000000000044444443344444440000000000000005',
  '500000000000000044444443344444440000000000000005',
  '533333333333333333333333333333333333333333333335',
  '533333333333333333333333333333333333333333333335',
  '500000000000000044444443344444440000000000000005',
  '500000000000000044444443344444440000000000000005',
  '500000000000000044444443344444440000000000000005',
  '500000000000000044444443344444440000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '500000000000000000000003300000000000000000000005',
  '555555555555555555555555555555555555555555555555'
];

// key/name/x/y/color/info match the same shape Chapter1Scene.js already
// uses for its `objects` array; `collidable` is new — for anything true,
// add a static physics body (physics.add.existing(sprite, true)) and
// include it alongside map.obstacles in your physics.add.collider(...) call.
const CHAPTER2_OLD_TOWN_OBJECTS = [
  { key: 'market', name: 'Market (plot)', x: 1072, y: 240, color: 0xc24a38, collidable: false, info: 'This spot sits right along the road leading into town.' },
  { key: 'municipal', name: 'Municipal Building (plot)', x: 368, y: 144, color: 0x9c3b2e, collidable: false, info: 'This spot sits near the very center of the community.' },
  { key: 'community', name: 'Community Area (plot)', x: 1424, y: 752, color: 0x3c7a3e, collidable: false, info: 'This open spot near the center is where neighbors gather.' },
  { key: 'houses', name: 'Houses (plot)', x: 272, y: 816, color: 0x8a5a3a, collidable: false, info: 'This quiet spot sits away from the busy center.' },
  { key: 'road', name: 'Road (plot)', x: 848, y: 592, color: 0x6b4f30, collidable: false, info: 'This spot needs a path connecting it to the rest of town.' },
  { key: 'obj_house_3', name: 'House 3', x: 80, y: 592, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_plant_13', name: 'Plants 13', x: 112, y: 720, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_3', name: 'Plants 3', x: 48, y: 688, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_3', name: 'Plants 3', x: 48, y: 720, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_3', name: 'Plants 3', x: 48, y: 752, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_3', name: 'Plants 3', x: 80, y: 688, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_3', name: 'Plants 3', x: 80, y: 720, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_3', name: 'Plants 3', x: 80, y: 752, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_house_3', name: 'House 3', x: 80, y: 816, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_plant_123', name: 'Plants 123', x: 48, y: 880, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_123', name: 'Plants 123', x: 48, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_123', name: 'Plants 123', x: 48, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_123', name: 'Plants 123', x: 80, y: 880, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_123', name: 'Plants 123', x: 80, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_123', name: 'Plants 123', x: 80, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_122', name: 'Plants 122', x: 48, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_122', name: 'Plants 122', x: 80, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_122', name: 'Plants 122', x: 112, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'hut', name: 'hut', x: 208, y: 976, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 272, y: 976, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 336, y: 976, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 400, y: 976, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 464, y: 976, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 528, y: 976, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 176, y: 592, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 240, y: 592, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 304, y: 592, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 368, y: 592, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 176, y: 688, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 240, y: 688, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 304, y: 688, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'hut', name: 'hut', x: 368, y: 688, color: 0x8a5a3a, collidable: true, info: '' },
  { key: 'obj_box_1', name: 'Box 1', x: 400, y: 592, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_box_4', name: 'Box 4', x: 432, y: 592, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_box_4', name: 'Box 4', x: 400, y: 688, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_box_1', name: 'Box 1', x: 432, y: 688, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_decor_5', name: 'Decor 5', x: 176, y: 624, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_decor_5', name: 'Decor 5', x: 208, y: 624, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_decor_5', name: 'Decor 5', x: 272, y: 720, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_decor_5', name: 'Decor 5', x: 240, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_decor_5', name: 'Decor 5', x: 208, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_decor_3', name: 'Decor 3', x: 592, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_decor_3', name: 'Decor 3', x: 592, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_decor_3', name: 'Decor 3', x: 560, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_decor_3', name: 'Decor 3', x: 560, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_decor_1', name: 'Decor 1', x: 560, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_tent_1', name: 'Tent 1', x: 848, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_1', name: 'Tent 1', x: 1296, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_1', name: 'Tent 1', x: 1456, y: 176, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_1', name: 'Tent 1', x: 1456, y: 400, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_2', name: 'Tent 2', x: 976, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_2', name: 'Tent 2', x: 1456, y: 272, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_3', name: 'Tent 3', x: 1104, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_4', name: 'Tent 4', x: 1200, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_4', name: 'Tent 4', x: 1392, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_lamp_1', name: 'Lamp 1', x: 272, y: 304, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_lamp_1', name: 'Lamp 1', x: 432, y: 304, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_road1ground_11', name: 'Road1 Ground 11', x: 368, y: 336, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_11', name: 'Road1 Ground 11', x: 368, y: 400, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_11', name: 'Road1 Ground 11', x: 368, y: 432, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_15', name: 'Road1 Ground 15', x: 464, y: 240, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_15', name: 'Road1 Ground 15', x: 560, y: 240, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_15', name: 'Road1 Ground 15', x: 624, y: 240, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_15', name: 'Road1 Ground 15', x: 688, y: 240, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_15', name: 'Road1 Ground 15', x: 272, y: 240, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_15', name: 'Road1 Ground 15', x: 208, y: 240, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_15', name: 'Road1 Ground 15', x: 144, y: 240, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_15', name: 'Road1 Ground 15', x: 80, y: 240, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 496, y: 176, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 496, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 240, y: 176, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 240, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 304, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 336, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 368, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 400, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 432, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 272, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 464, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_132', name: 'Plants 132', x: 496, y: 80, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_132', name: 'Plants 132', x: 496, y: 112, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_132', name: 'Plants 132', x: 240, y: 80, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_132', name: 'Plants 132', x: 240, y: 112, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_132', name: 'Plants 132', x: 240, y: 144, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_132', name: 'Plants 132', x: 496, y: 144, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 48, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 48, y: 112, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 48, y: 176, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 720, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 720, y: 176, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_126', name: 'Plants 126', x: 720, y: 112, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 48, y: 80, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 48, y: 144, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 80, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 112, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 144, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 176, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 208, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 528, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 560, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 592, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 624, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 656, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 688, y: 48, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 720, y: 80, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_144', name: 'Plants 144', x: 720, y: 144, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_road1ground_8', name: 'Road1 Ground 8', x: 368, y: 240, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_bench_2', name: 'Bench 2', x: 208, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_1', name: 'Bench 1', x: 80, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_3', name: 'Bench 3', x: 80, y: 176, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_4', name: 'Bench 4', x: 208, y: 176, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_4', name: 'Bench 4', x: 688, y: 176, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_1', name: 'Bench 1', x: 528, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_2', name: 'Bench 2', x: 688, y: 80, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_3', name: 'Bench 3', x: 528, y: 176, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_lamp_1', name: 'Lamp 1', x: 144, y: 112, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_lamp_1', name: 'Lamp 1', x: 624, y: 112, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_fountain_1', name: 'Fountain 1', x: 1168, y: 752, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_1', name: 'Bench 1', x: 976, y: 816, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_2', name: 'Bench 2', x: 848, y: 816, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_3', name: 'Bench 3', x: 976, y: 752, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_bench_4', name: 'Bench 4', x: 848, y: 752, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_lamp_1', name: 'Lamp 1', x: 1104, y: 656, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_lamp_1', name: 'Lamp 1', x: 1264, y: 656, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_lamp_1', name: 'Lamp 1', x: 1104, y: 816, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_lamp_1', name: 'Lamp 1', x: 1232, y: 816, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_plant_51', name: 'Plants 51', x: 912, y: 752, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 816, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 848, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 880, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 912, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 816, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 848, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 880, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 912, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 816, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 848, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 880, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 912, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1040, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1040, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1040, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1072, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1072, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1072, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1104, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1104, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1104, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1136, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1136, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1136, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1168, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1168, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1168, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1200, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1200, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1200, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1232, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1232, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_75', name: 'Plants 75', x: 1232, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1488, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1456, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1424, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1392, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1360, y: 912, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1360, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1360, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1392, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1392, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1424, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1424, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1456, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1456, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1488, y: 944, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_54', name: 'Plants 54', x: 1488, y: 976, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1072, y: 560, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1072, y: 592, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1104, y: 560, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1104, y: 592, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1136, y: 560, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1136, y: 592, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1168, y: 560, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1168, y: 592, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1200, y: 560, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1200, y: 592, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1232, y: 560, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1232, y: 592, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1264, y: 560, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1264, y: 592, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1296, y: 560, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_plant_133', name: 'Plants 133', x: 1296, y: 592, color: 0x888888, collidable: false, info: '' },
  { key: 'obj_tent_1', name: 'Tent 1', x: 848, y: 240, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_1', name: 'Tent 1', x: 848, y: 400, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_2', name: 'Tent 2', x: 1264, y: 240, color: 0x888888, collidable: true, info: '' },
  { key: 'obj_tent_2', name: 'Tent 2', x: 1264, y: 400, color: 0x888888, collidable: true, info: '' }
];

// The export has no col/row, but the scene (plots + de-duplication against the
// JSON's objects) works in tiles - derive them from the pixel position.
const CHAPTER2_EMBEDDED_OBJECTS = CHAPTER2_OLD_TOWN_OBJECTS.map(o => ({
  ...o,
  col: Math.floor(o.x / CHAPTER2_TILE_SIZE),
  row: Math.floor(o.y / CHAPTER2_TILE_SIZE)
}));

// --- the 5 buildable plots -------------------------------------------------
// This is the static template only (positions/colors/clues/info) - create()
// makes a fresh `this.plots` copy of it every time the scene starts, so
// `built` state never leaks between playthroughs. Each plot has exactly one
// correct building type; the player chooses from whichever types haven't
// been placed yet (see showBuildMenu), so later plots get easier to guess
// by elimination - no fail state, just a nudge to think again.
// NOTE: col/row below are only defaults. The position of the matching plot
// object in the embedded export (or, failing that, in the JSON) is used
// instead, so moving a plot in your map editor is enough.
// Real art for the empty-plot state and each of the 5 building types once
// built (see preload()/create() below). Sizes keep each icon's native
// aspect ratio, scaled down from their source canvas to roughly the
// footprint the old placeholder box used.
const CHAPTER2_EMPTY_ICON = { key: 'plot_empty', w: 96, h: 110 };
const CHAPTER2_BUILT_ICONS = {
  market: { key: 'plot_market', w: 152, h: 160 },
  municipal: { key: 'plot_municipal', w: 148, h: 160 },
  community: { key: 'plot_community', w: 156, h: 160 },
  houses: { key: 'plot_houses', w: 150, h: 160 },
  road: { key: 'plot_road', w: 150, h: 160 }
};

const CHAPTER2_PLOT_DATA = [
  {
    id: 'market', name: 'Market', color: 0xc24a38,
    col: 33, row: 7,
    clue: 'This spot sits right along the road leading into town.',
    info: 'A market close to the road lets goods be brought in and traded easily.'
  },
  {
    id: 'municipal', name: 'Municipal Building', color: 0x9c3b2e,
    col: 11, row: 4,
    clue: 'This spot sits near the very center of the community.',
    info: 'Once Pateros became a municipality of its own in 1799, it needed a hall to govern from. Near the center, it serves everyone.'
  },
  {
    id: 'community', name: 'Community Area', color: 0x3c7a3e,
    col: 44, row: 23,
    clue: 'This open spot near the center is where neighbors gather.',
    info: 'A shared community area gives residents a place to gather for events, worship, and everyday life.'
  },
  {
    id: 'houses', name: 'Houses', color: 0x8a5a3a,
    col: 8, row: 25,
    clue: 'This quiet spot sits away from the busy center.',
    info: 'Houses spread outward from the center, letting the growing community stretch beyond the plaza.'
  },
  {
    id: 'road', name: 'Road', color: 0x6b4f30,
    col: 26, row: 18,
    clue: 'This spot needs a path connecting it to the rest of town.',
    info: 'As the town grew, roads were extended outward to connect new areas back to the center.'
  }
];

// ==========================================================================
// Valentin Tuason roaming - he now strolls around the plaza instead of
// standing still. Tuned here in one place.
// ==========================================================================
const CHAPTER2_DON_SPEED = 55;                 // px/sec while strolling
const CHAPTER2_DON_ROAM_AREA = { minX: 540, maxX: 990, minY: 380, maxY: 700 }; // the plaza (px)
const CHAPTER2_DON_IDLE_MS = [1500, 3500];     // how long he stands before picking a new spot
const CHAPTER2_DON_WALK_TIMEOUT_MS = 6000;     // give up on a target after this long
const CHAPTER2_DON_START = { x: 640, y: 560 }; // away from the player's spawn so he starts walking right away
const CHAPTER2_DON_STOP_DIST = 64;             // he only freezes when the player is basically touching him

// Shows a small yellow status line on screen (how many objects drawn? which
// images are missing?) so a wrong path is obvious. Set to false once
// everything works.
const CHAPTER2_DEBUG = true;

// ==========================================================================
// MINI-GAME 2 - Town Council
// Same "read a short scenario, pick one of two options" shape as the
// dilemmas in this chapter's own quiz, just played out as council
// decisions instead of after-the-fact questions.
// ==========================================================================
const CHAPTER2_COUNCIL = [
  {
    situation: 'Families are settling farther from the plaza as the town grows. Where should new roads go first?',
    options: [
      { key: 'wise', label: 'Connect outlying households to the center' },
      { key: 'unwise', label: 'Only pave roads right around the hall' }
    ],
    correct: 'wise',
    explanation: 'As Pateros grew from a small community into a municipality, reaching outlying households mattered as much as the center itself.'
  },
  {
    situation: 'A newcomer wants to set up a stall in the middle of the road, since it gets the most foot traffic.',
    options: [
      { key: 'wise', label: 'Direct them to the market near the road instead' },
      { key: 'unwise', label: 'Allow it and let the road get blocked' }
    ],
    correct: 'wise',
    explanation: 'A market near the road gives trade a proper place — letting stalls block the road serves no one for long.'
  },
  {
    situation: 'Two families both believe they were promised the same plot near the plaza.',
    options: [
      { key: 'wise', label: "Have the council record land agreements formally" },
      { key: 'unwise', label: 'Let whoever built first keep it, no record kept' }
    ],
    correct: 'wise',
    explanation: 'Formal records help a growing municipality settle disputes fairly as more families arrive.'
  }
];

// "Take Your Stand" tuning - see startTownCouncil() and friends below. Kept
// as named constants (same convention as CHAPTER1_RIVER_* / CHAPTER4_DUCK_*)
// so the feel of the round can be tuned in one place.
const CHAPTER2_COUNCIL_ROUND_MS = 9000;   // time to reach a zone before it counts as a timeout
const CHAPTER2_COUNCIL_TOKEN_SPEED = 240; // px/sec the player's stand-in runs at
const CHAPTER2_COUNCIL_ZONE_RADIUS = 78;  // how close counts as "standing in" a zone

class Chapter2Scene extends Phaser.Scene {
  constructor() {
    super('Chapter2');
  }

  preload() {
    // Empty-plot icon (shown on all 5 plots before they're built) plus one
    // icon per building type (swapped in once that plot is built - see
    // buildPlot() below).
    this.load.image(CHAPTER2_EMPTY_ICON.key, 'assets/icons/ch2-empty-plot.png');
    this.load.image(CHAPTER2_BUILT_ICONS.market.key, 'assets/icons/ch2-market.png');
    this.load.image(CHAPTER2_BUILT_ICONS.municipal.key, 'assets/icons/ch2-municipal-building.png');
    this.load.image(CHAPTER2_BUILT_ICONS.community.key, 'assets/icons/ch2-community-area.png');
    this.load.image(CHAPTER2_BUILT_ICONS.houses.key, 'assets/icons/ch2-house.png');
    this.load.image(CHAPTER2_BUILT_ICONS.road.key, 'assets/icons/ch2-road.png');

    this.load.on('loaderror', (file) => {
      // wrong guesses for object images are expected (see below) - stay quiet about those
      if (file.key.indexOf('__try') !== -1) return;
      console.warn('[Chapter2] FAILED TO LOAD: ' + file.key + ' -> ' + file.url);
    });

    // Images for every object in the embedded editor export - queued right
    // away. `queued` stops the JSON's objects (below) from queuing the same
    // key a second time.
    const queued = new Set();
    this.queueChapter2ObjectImages(CHAPTER2_EMBEDDED_OBJECTS, queued);

    // Optional JSON map. Once it finishes loading, queue the image of every
    // decor object it uses that isn't already queued (the loader keeps going
    // until the queue is empty, so adding files from this callback is fine).
    // Keys that some other scene already loaded are skipped automatically.
    this.load.json(CHAPTER2_MAP_JSON_KEY, CHAPTER2_MAP_JSON_PATH);
    this.load.once('filecomplete-json-' + CHAPTER2_MAP_JSON_KEY, () => {
      const data = this.cache.json.get(CHAPTER2_MAP_JSON_KEY);
      if (!data || !Array.isArray(data.objects)) return;
      this.queueChapter2ObjectImages(data.objects, queued);
    });
  }

  // One entry per distinct object key. For each, queue every likely file path
  // under a temporary key; the first one that actually loads is renamed to
  // the real key, the rest (wrong guesses = 404) are simply ignored.
  queueChapter2ObjectImages(objects, queued) {
    const names = {};
    objects.forEach(o => {
      if (!CHAPTER2_PLOT_KEYS.includes(o.key) && !names[o.key]) names[o.key] = o.name;
    });
    Object.keys(names).forEach(key => {
      if (queued.has(key) || this.textures.exists(key)) return;
      queued.add(key);
      chapter2ImageCandidates(key, names[key]).forEach((path, i) => {
        const tmp = key + '__try' + i;
        this.load.once('filecomplete-image-' + tmp, () => {
          if (!this.textures.exists(key)) this.textures.renameTexture(tmp, key);
          else this.textures.remove(tmp);
        });
        this.load.image(tmp, path);
      });
    });
  }

  // Draw-order helper: things lower on the map draw in front of things
  // higher up (so you can walk behind lamps/houses). Kept well under the HUD
  // depth (900) so the player can never draw over the buttons/text.
  depthForY(y) {
    return 10 + y / 10;
  }

  create(data) {
    SoundManager.playMusic(this, 'bg-game');
    const { width, height } = this.scale;
    const character = this.registry.get('selectedCharacter') || 'hiraya';
    const textureKey = character + '-sheet';
    this.prefix = character;
    this.speed = this.registry.get('playerSpeed') || 160;
    this.locked = false; // true during dialogue / popup / build menu / quiz - movement disabled
    this.mode = 'intro'; // intro -> explore -> quiz -> done

    // --- Old Town map (48x32 tiles) ---
    // Tiles come from the embedded editor export. The JSON file is optional:
    // when it loaded, its objects are kept and the export's are added on top.
    this.mapData = this.cache.json.exists(CHAPTER2_MAP_JSON_KEY)
      ? this.cache.json.get(CHAPTER2_MAP_JSON_KEY)
      : null;
    if (!this.mapData) console.info('[Chapter2] ' + CHAPTER2_MAP_JSON_PATH + ' not found - using only the embedded map export.');
    const jsonObjects = (this.mapData && Array.isArray(this.mapData.objects)) ? this.mapData.objects : [];
    // JSON first (its objects have their own w/h and win when the same object
    // is in both), then the embedded export's.
    const allObjects = [...jsonObjects, ...CHAPTER2_EMBEDDED_OBJECTS];
    const mapTiles = CHAPTER2_OLD_TOWN_MAP;
    this.map = loadMap(this, mapTiles);

    // --- decor (houses, huts, tents, lamps, benches...) ---
    this.buildMapObjects(allObjects);
    if (CHAPTER2_DEBUG) {
      const st = this.decorStats;
      const msg = 'Map OK (' + st.total + ' objects, ' + st.drawn + ' drawn'
        + (this.mapData ? ', + JSON' : ', JSON not found') + ')'
        + (st.missingKeys.length ? ' | missing images: ' + st.missingKeys.length + ' (see console)' : '');
      this.add.text(14, 40, msg, {
        fontFamily: 'monospace', fontSize: 12, color: '#ffe45c', backgroundColor: '#000000aa', padding: { x: 4, y: 2 }
      }).setScrollFactor(0).setDepth(950);
    }

    // --- player ---
    const spawn = CHAPTER2_OLD_TOWN_SPAWN;
    this.createPlayerAnims(textureKey);
    this.player = this.physics.add.sprite(spawn.x, spawn.y, textureKey, 0);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(C2_FRAME_W * 0.5, C2_FRAME_H * 0.35);
    this.player.setOffset(C2_FRAME_W * 0.25, C2_FRAME_H * 0.6);
    this.player.facing = 'up';
    // Depth follows the player's y every frame (see update()).
    this.player.setDepth(this.depthForY(this.player.y + C2_FRAME_H / 2));
    this.physics.add.collider(this.player, this.map.obstacles);
    if (this.decorObstacles.length) this.physics.add.collider(this.player, this.decorObstacles);

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

    // --- Valentin Tuason --- (real sprite sheet, same 44x78 grid convention as
    // hiraya-sheet/lola-sheet - frame 0 is his down-facing idle pose).
    // He is now a MOVING NPC: a dynamic (but immovable) physics sprite that
    // wanders around the plaza - see updateDonRoaming() below. Immovable
    // means the player can't push him, and he still blocks the player.
    this.donEmilio = this.physics.add.sprite(CHAPTER2_DON_START.x, CHAPTER2_DON_START.y, 'donemilio-sheet', 0);
    this.donEmilio.setSize(C2_FRAME_W * 0.5, C2_FRAME_H * 0.35);
    this.donEmilio.setOffset(C2_FRAME_W * 0.25, C2_FRAME_H * 0.6);
    this.donEmilio.setImmovable(true);
    this.donEmilio.setCollideWorldBounds(true);
    this.donEmilio.facing = 'down';
    this.donEmilio.setDepth(this.depthForY(this.donEmilio.y + C2_FRAME_H / 2));
    this.physics.add.collider(this.player, this.donEmilio);
    this.physics.add.collider(this.donEmilio, this.map.obstacles);
    if (this.decorObstacles.length) this.physics.add.collider(this.donEmilio, this.decorObstacles);
    this.createDonAnims();
    this.donRoam = {
      state: 'idle', nextChange: 0, target: null,
      walkUntil: 0, checkAt: 0, checkX: this.donEmilio.x, checkY: this.donEmilio.y
    };

    this.interactPrompt = this.add.text(this.donEmilio.x, this.donEmilio.y - 90, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false).setDepth(5000);
    // Generic "near a plot" hint - repositioned each frame above whichever
    // plot the player is closest to (see this.plots below / update()).
    this.plotPrompt = this.add.text(0, 0, 'Press E to interact', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false).setDepth(100000);
    this.returnFlag = this.add.text(this.donEmilio.x, this.donEmilio.y - 60, '❗', { fontSize: 26 })
      .setOrigin(0.5).setVisible(false).setDepth(5000);

    // --- the 5 buildable plots (fresh copy of CHAPTER2_PLOT_DATA so
    // `built` resets every time this scene starts). Their col/row come from
    // the matching plot object in the embedded export (newest), then the
    // JSON, then the defaults above. ---
    this.plots = CHAPTER2_PLOT_DATA.map(p => {
      const jp = CHAPTER2_EMBEDDED_OBJECTS.find(o => o.key === p.id) || jsonObjects.find(o => o.key === p.id);
      return { ...p, col: jp ? jp.col : p.col, row: jp ? jp.row : p.row, built: false };
    });
    // Each plot (empty or built) is solid - like a house or market stall -
    // rather than walk-over-able ground, so it gets a static physics body,
    // same technique used for decor obstacles elsewhere. Its name/"Empty
    // Plot" label has been removed in favor of the "Press E to interact"
    // hint above (this.plotPrompt), shown only while the player is near.
    this.plotObstacles = [];
    this.plots.forEach(p => {
      p.x = p.col * CHAPTER2_TILE_SIZE + CHAPTER2_TILE_SIZE / 2;
      p.y = p.row * CHAPTER2_TILE_SIZE + CHAPTER2_TILE_SIZE / 2;

      // Deliberately unlabeled until built - showing the building name (or
      // using its final color) up front would just hand over the answer.
      // Every plot starts on the same "empty plot" icon regardless of what
      // it'll become, so it gives no hint toward the answer either.
      const hasEmptyIcon = this.textures.exists(CHAPTER2_EMPTY_ICON.key);
      p.rect = hasEmptyIcon
        ? this.add.image(p.x, p.y, CHAPTER2_EMPTY_ICON.key).setDisplaySize(CHAPTER2_EMPTY_ICON.w, CHAPTER2_EMPTY_ICON.h)
        : this.add.rectangle(p.x, p.y, 46, 46, 0x6b4f30, 0.35).setStrokeStyle(2, 0xf5e2c8);
      p.iconH = hasEmptyIcon ? CHAPTER2_EMPTY_ICON.h : 46;
      this.physics.add.existing(p.rect, true);
      this.plotObstacles.push(p.rect);
      p.mark = this.add.text(p.x, p.y, '?', {
        fontFamily: '"Tildunk", sans-serif', fontSize: 22, color: '#fff8e7', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.applyPlotDepth(p);
    });
    this.physics.add.collider(this.player, this.plotObstacles);
    this.physics.add.collider(this.donEmilio, this.plotObstacles);

    // 6th task - not a buildable plot, just walking back to report to Don
    // Emilio once all 5 plots are built. See getTaskList().
    this.reportDone = false;

    // --- HUD --- (scrollFactor 0 so it stays pinned to the screen instead
    // of scrolling away with the map now that the camera follows the player)
    const displayName = character.charAt(0).toUpperCase() + character.slice(1);
    this.add.text(14, 12, displayName, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 18, color: '#fff8e7'
    }).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(900);

    this.add.text(width / 2, 16, 'Chapter 2: The Birth of a Municipality', {
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
      showDialogue(this, 'Valentin Tuason', [
        'Ah, a new face, I am Valentin Tuason, gobernadorcillo, the town head. Welcome to Pateros, back when it was still finding its shape.',
        'For a long time Pateros was only a barrio of Pasig, a river port called Aguho. Then, in 1799, a Spanish decree made it a town of its own.',
        'A real town needs more than a name. It needs a market, a road, a place to gather, homes for its people.',
        'Come, help me picture where each one belongs. Walk around and place them where they make sense.'
      ], () => {
        this.locked = false;
        this.mode = 'explore';
        // Valentin Tuason's task has now actually been given - reveal the Task button.
        this.taskBtnRect.setVisible(true);
        this.taskBtnTxt.setVisible(true);
      }, ['don-emilio-happy', 'don-emilio-explain', 'don-emilio-explain', 'don-emilio-point']);
    });
  }

  // --- Decor (JSON objects + embedded editor export) -------------------------
  // Every object is placed at its (x, y) CENTER. Size is its w x h when it
  // has one; otherwise (editor export entries) the image's native size.
  // Objects with collidable:true get an invisible static collider
  // covering the lower part of the sprite (so you can walk "behind" the top
  // of a lamp or house, but not through its base). Plot placeholders are
  // skipped (the scene draws the plots itself). If an object's image is
  // missing, collidable ones show as a colored box and the rest are skipped,
  // and one warning lists the missing keys in the console.
  buildMapObjects(objects) {
    this.decorObstacles = [];
    this.decorStats = { total: objects.length, drawn: 0, missingKeys: [] };
    const missing = new Set();
    const seen = new Set();

    objects.forEach(o => {
      if (CHAPTER2_PLOT_KEYS.includes(o.key)) return;
      // The same object can be in both the JSON and the embedded export (and
      // the JSON has a few exact duplicates) - draw each key+tile only once.
      // The first one wins, and the JSON's objects are listed first.
      const dupKey = o.key + '@' + o.col + ',' + o.row;
      if (seen.has(dupKey)) return;
      seen.add(dupKey);

      const isGround = o.key.indexOf('ground') !== -1; // road/ground patches: always under everything
      let visual = null;
      const hasTexNow = this.textures.exists(o.key);
      let w, h;
      if (hasTexNow) {
        visual = this.add.image(o.x, o.y, o.key);
        if (o.key === 'hut') {
          visual.setScale(CHAPTER2_HUT_WIDTH / visual.width); // keep House 4's proportions
        } else if (o.w && o.h) {
          visual.setDisplaySize(o.w, o.h);
        } // else: native image size (editor export has no w/h)
        w = visual.displayWidth; h = visual.displayHeight;
      } else {
        missing.add(o.key);
        w = o.w || 46; h = o.h || 46;
        if (o.collidable) {
          const colorVal = typeof o.color === 'number'
            ? o.color
            : Phaser.Display.Color.HexStringToColor(o.color || '#888888').color;
          visual = this.add.rectangle(o.x, o.y, w, h, colorVal, 0.9);
        }
      }
      if (visual) { visual.setDepth(isGround ? 1 : this.depthForY(o.y + h / 2)); if (hasTexNow) this.decorStats.drawn++; }

      if (o.collidable) {
        const body = this.add.rectangle(o.x, o.y + h * 0.2, w * 0.8, h * 0.55, 0x000000, 0);
        this.physics.add.existing(body, true);
        this.decorObstacles.push(body);
      }
    });

    this.decorStats.missingKeys = Array.from(missing);
    if (missing.size) {
      console.warn('[Chapter2] no image found for: ' + Array.from(missing).join(', ') + '  -> add them to CHAPTER2_OBJECT_PATH_OVERRIDES');
    }
  }

  // Plots sort with the rest of the scene by their bottom edge.
  applyPlotDepth(plot) {
    const d = this.depthForY(plot.y + plot.iconH / 2);
    plot.rect.setDepth(d);
    plot.mark.setDepth(d + 0.01);
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

  // Valentin's walk cycles - assumes his sheet uses the same frame layout as
  // the player sheets (down 0-11, up 12-19, side 24-34). If his sheet has
  // fewer frames than that he still moves, just without the walk animation.
  createDonAnims() {
    const tex = this.textures.get('donemilio-sheet');
    this.donHasAnims = !!tex && tex.frameTotal > 35;
    if (!this.donHasAnims) return;
    if (!this.anims.exists('don-walk-down')) {
      this.anims.create({ key: 'don-walk-down', frames: this.anims.generateFrameNumbers('donemilio-sheet', { start: 0, end: 11 }), frameRate: 10, repeat: -1 });
    }
    if (!this.anims.exists('don-walk-up')) {
      this.anims.create({ key: 'don-walk-up', frames: this.anims.generateFrameNumbers('donemilio-sheet', { start: 12, end: 19 }), frameRate: 8, repeat: -1 });
    }
    if (!this.anims.exists('don-walk-side')) {
      this.anims.create({ key: 'don-walk-side', frames: this.anims.generateFrameNumbers('donemilio-sheet', { start: 24, end: 34 }), frameRate: 10, repeat: -1 });
    }
  }

  // --- Valentin Tuason roaming ---------------------------------------------
  // Stand a bit -> pick a random spot in the plaza -> walk there -> repeat.
  // He freezes (and turns toward the player) when the player is close enough
  // to talk, and whenever the game is locked (dialogue / menu / popup) or not
  // in explore mode, so he never walks away mid-conversation.
  stopDon() {
    const don = this.donEmilio;
    don.setVelocity(0, 0);
    if (this.donHasAnims) {
      don.anims.stop();
      don.setFrame({ down: 0, up: 12, side: 24 }[don.facing]);
    }
  }

  faceDon(dx, dy) {
    const don = this.donEmilio;
    if (Math.abs(dx) > Math.abs(dy)) { don.facing = 'side'; don.flipX = dx > 0; }
    else don.facing = dy < 0 ? 'up' : 'down';
  }

  pickDonTarget() {
    const a = CHAPTER2_DON_ROAM_AREA;
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(a.minX, a.maxX);
      const y = Phaser.Math.Between(a.minY, a.maxY);
      // stay clear of the plots (they're solid and can be big)
      const blocked = this.plots.some(pl => {
        const reach = Math.max(pl.rect.displayWidth || 0, pl.rect.displayHeight || 0) / 2 + 40;
        return Phaser.Math.Distance.Between(x, y, pl.x, pl.y) < reach;
      });
      if (!blocked) return { x, y };
    }
    return null;
  }

  updateDonRoaming(time) {
    const don = this.donEmilio;
    const r = this.donRoam;
    const p = this.player;
    const dPlayer = Phaser.Math.Distance.Between(p.x, p.y, don.x, don.y);
    const nearPlayer = dPlayer <= CHAPTER2_DON_STOP_DIST;

    if (this.locked || this.mode !== 'explore' || nearPlayer) {
      this.stopDon();
      if (nearPlayer) this.faceDon(p.x - don.x, p.y - don.y);
      if (this.donHasAnims) don.setFrame({ down: 0, up: 12, side: 24 }[don.facing]);
      r.checkAt = 0; // reset stuck-check when he resumes
      return;
    }

    if (r.state === 'idle') {
      if (time >= r.nextChange) {
        const t = this.pickDonTarget();
        if (t) {
          r.target = t;
          r.state = 'walk';
          r.walkUntil = time + CHAPTER2_DON_WALK_TIMEOUT_MS;
          r.checkAt = time + 500;
          r.checkX = don.x; r.checkY = don.y;
        } else {
          r.nextChange = time + 1000;
        }
      } else {
        this.stopDon();
      }
      return;
    }

    // walking
    const dx = r.target.x - don.x;
    const dy = r.target.y - don.y;
    const dist = Math.hypot(dx, dy);

    // arrived, took too long, or got stuck on something -> rest, then pick again
    let giveUp = dist < 6 || time > r.walkUntil;
    if (!giveUp) {
      if (!r.checkAt) { r.checkAt = time + 500; r.checkX = don.x; r.checkY = don.y; }
      if (time >= r.checkAt) {
        if (Phaser.Math.Distance.Between(don.x, don.y, r.checkX, r.checkY) < 8) giveUp = true;
        r.checkAt = time + 500; r.checkX = don.x; r.checkY = don.y;
      }
    }
    if (giveUp) {
      r.state = 'idle';
      r.nextChange = time + Phaser.Math.Between(CHAPTER2_DON_IDLE_MS[0], CHAPTER2_DON_IDLE_MS[1]);
      this.stopDon();
      return;
    }

    don.setVelocity((dx / dist) * CHAPTER2_DON_SPEED, (dy / dist) * CHAPTER2_DON_SPEED);
    this.faceDon(dx, dy);
    if (this.donHasAnims) don.play(`don-walk-${don.facing}`, true);
  }

  // Full task list for the HUD counter / objectives modal: the 5 building
  // types, plus a 6th "Report to Valentin Tuason" task that only appears once
  // all 5 have been placed (goes 5/5 -> 5/6, then 6/6 once you talk to him).
  getTaskList() {
    const list = this.plots.map(p => ({ name: p.name, found: p.built, info: p.info, type: 'item' }));
    if (this.plots.every(p => p.built)) {
      list.push({
        name: 'Report to Valentin Tuason',
        found: this.reportDone,
        info: 'Walk back to Valentin Tuason and press E to show him the finished town.',
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

  // --- Objectives modal: which building types are placed, highlighted once
  // built. Hovering a built row pops up what was learned from it. ---------
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
    const allPlotsBuilt = this.plots.every(p => p.built);
    const subtitle = this.add.text(width / 2, top + 50,
      allPlotsBuilt ? 'All built — now report back to Valentin Tuason:' : 'Figure out where each of these belongs:', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#6b4a2f'
    }).setOrigin(0.5);
    const hint = this.add.text(width / 2, top + 70, 'Hover a built item to see what you learned', {
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
      const mark = this.add.text(width / 2 - 150, y, found ? '✓' : '—', {
        fontFamily: '"Tildunk", sans-serif', fontSize: 16, fontStyle: 'bold',
        color: found ? '#3c7a3e' : '#9aa0aa'
      }).setOrigin(0, 0.5);
      const label = this.add.text(width / 2 - 122, y, t.type === 'task' ? t.name : (found ? `${t.name} x1` : '??? x1'), {
        fontFamily: '"Tildunk", sans-serif', fontSize: 15,
        color: found ? '#3c7a3e' : '#3b2410'
      }).setOrigin(0, 0.5);
      const status = this.add.text(width / 2 + 150, y, found
        ? (t.type === 'task' ? 'Done' : 'Built')
        : (t.type === 'task' ? 'Go talk to him' : 'Not placed'), {
        fontFamily: '"Tildunk", sans-serif', fontSize: 11,
        color: found ? '#3c7a3e' : '#9aa0aa'
      }).setOrigin(1, 0.5);
      container.add([mark, label, status]);

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
    let best = null, bestDist = Infinity;

    const dDon = Phaser.Math.Distance.Between(p.x, p.y, this.donEmilio.x, this.donEmilio.y);
    if (dDon <= INTERACT_RADIUS && dDon < bestDist) { best = { type: 'don' }; bestDist = dDon; }

    this.plots.forEach(plot => {
      // Plot icons run as large as 152x160 (built) - much bigger than the
      // 46x46 objects INTERACT_RADIUS (80) was tuned for. The player's solid
      // collider stops well outside that fixed radius, especially
      // approaching diagonally, so a flat 80px cutoff meant the "Press E"
      // prompt never appeared and the plot just read as an unexplained wall
      // blocking the way. Scale the reach out by the plot's own footprint
      // so getting close enough to touch it is always close enough to
      // interact with it.
      const reach = INTERACT_RADIUS + Math.max(plot.rect.displayWidth || 0, plot.rect.displayHeight || 0) / 2;
      const d = Phaser.Math.Distance.Between(p.x, p.y, plot.x, plot.y);
      if (d <= reach && d < bestDist) { best = { type: 'plot', plot }; bestDist = d; }
    });

    return best;
  }

  talkToDonEmilio() {
    // he stops roaming while locked (see updateDonRoaming)
    const allBuilt = this.plots.every(p => p.built);
    if (!allBuilt) {
      this.locked = true;
      showDialogue(this, 'Valentin Tuason', [
        `You've placed ${this.plots.filter(p => p.built).length} of 5 so far.`,
        'Keep walking the town and thinking about where each piece belongs.'
      ], () => { this.locked = false; }, ['don-emilio-explain', 'don-emilio-happy']);
      return;
    }

    this.locked = true;
    this.returnFlag.setVisible(false);
    this.reportDone = true;
    this.updateProgress();
    showDialogue(this, 'Valentin Tuason', [
      'Look at that, a market by the road, a municipal hall at the center, houses spreading outward.',
      'Remember: in 1799, a Spanish decree made Pateros a municipality, separate from Pasig. This is how a real town took shape after that, piece by piece, always around its people.',
      'Placing the buildings was only half of it, though. Sit with me a moment, a council has decisions to make too.'
    ], () => this.startTownCouncil(), ['don-emilio-happy', 'don-emilio-explain', 'don-emilio-point']);
  }

  // ==========================================================================
  // MINI-GAME 2 - Town Council: "Take Your Stand" (see CHAPTER2_COUNCIL above
  // for the situations/options/explanations - only *how* you answer changed).
  // Instead of clicking a button, each round opens an assembly floor with two
  // glowing zones (one per option) and a shrinking timer. The real player is
  // hidden and a free-moving "stand-in" token takes their place on the floor -
  // WASD/arrows to run, same keys already set up in create(). Stepping into a
  // zone casts that vote immediately; running out of time counts as no vote.
  // Entirely a screen-pinned overlay (scrollFactor 0 throughout), the same
  // technique CHAPTER1_RIVER_* uses for the river-run minigame, so it doesn't
  // need to touch the real tile map or the player's physics body at all.
  // ==========================================================================
  startTownCouncil() {
    this.mode = 'towncouncil';
    this.councilIndex = 0;
    this.councilScore = 0;
    this.locked = true;
    this.player.setVisible(false); // the token stands in for them on the floor
    showDialogue(this, 'Valentin Tuason', [
      "One more thing before we're done, a council doesn't just build, it decides.",
      "I'll lay out a situation. Two ways to answer will open up on the floor, run to the one you believe is wiser before the moment passes."
    ], () => this.buildCouncilFloor(), ['don-emilio-explain', 'don-emilio-point']);
  }

  // Builds the persistent overlay (floor, audience, HUD) once per council
  // session; only the situation banner and the two zones get rebuilt each
  // round (see beginCouncilRound()).
  buildCouncilFloor() {
    const { width, height } = this.scale;
    this.councilContainer = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);

    // .setInteractive() on the floor itself - same trick the other modals use
    // - so clicks can't fall through to the (visually hidden) Task/Journal/
    // Menu buttons sitting underneath at their normal depth.
    const floor = this.add.rectangle(width / 2, height / 2, width, height, 0x2a1c10, 0.94).setInteractive().setScrollFactor(0);
    const rug = this.add.rectangle(width / 2, height / 2 + 30, Math.min(680, width - 80), height - 220, 0x6b4f30, 0.5)
      .setStrokeStyle(3, 0x9c3b2e).setScrollFactor(0);
    this.councilContainer.add([floor, rug]);

    // A row of onlookers along the back wall - atmosphere only. Simple
    // head+shoulders silhouettes instead of emoji, so they read as a crowd
    // in shadow rather than a row of icons.
    for (let x = 60; x < width - 40; x += 70) {
      const shoulders = this.add.ellipse(x, 54, 16, 18, 0xf5e2c8, 0.2).setScrollFactor(0);
      const head = this.add.circle(x, 41, 5, 0xf5e2c8, 0.26).setScrollFactor(0);
      this.councilContainer.add([shoulders, head]);
    }

    this.councilTitleTxt = this.add.text(width / 2, 72, 'Town Council — Take Your Stand', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 17, color: '#f5e2c8', fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);

    this.councilRoundTxt = this.add.text(width / 2, 96, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#d8b04a'
    }).setOrigin(0.5).setScrollFactor(0);

    this.councilTrustTxt = this.add.text(width - 16, 72, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
    }).setOrigin(1, 0.5).setScrollFactor(0);

    const barW = 260, barH = 10;
    this.councilTimerBg = this.add.rectangle(width / 2, 118, barW, barH, 0x000000, 0.5).setStrokeStyle(2, 0xf5e2c8).setScrollFactor(0);
    this.councilTimerFill = this.add.rectangle(width / 2 - barW / 2, 118, barW, barH - 4, 0xd8b04a, 1).setOrigin(0, 0.5).setScrollFactor(0);
    this.councilTimerW = barW;

    this.councilSituationTxt = this.add.text(width / 2, 142, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 14, color: '#fff8e7', align: 'center',
      wordWrap: { width: Math.min(560, width - 80) }
    }).setOrigin(0.5, 0).setScrollFactor(0);

    // The player's stand-in on the floor - reuses their own walk anims
    // (created earlier in createPlayerAnims for the same textureKey), so it
    // actually walks in place of just sliding around on a static frame.
    const character = this.registry.get('selectedCharacter') || 'hiraya';
    this.councilToken = this.add.sprite(width / 2, height - 110, character + '-sheet', 0).setScrollFactor(0).setScale(0.9);
    this.councilToken.facing = 'down';

    const hint = this.add.text(width / 2, height - 18, 'WASD / arrows to move — step into the zone that matches your answer', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 11, color: '#9aa0aa'
    }).setOrigin(0.5).setScrollFactor(0);

    this.councilContainer.add([
      this.councilTitleTxt, this.councilRoundTxt, this.councilTrustTxt,
      this.councilTimerBg, this.councilTimerFill, this.councilSituationTxt, this.councilToken, hint
    ]);

    this.councilZones = [];
    this.locked = false;
    this.beginCouncilRound();
  }

  updateCouncilTrustText() {
    this.councilTrustTxt.setText(`Sound decisions: ${this.councilScore}/${CHAPTER2_COUNCIL.length}`);
  }

  // Sizes a label down (in 1px steps) until it comfortably sits inside a
  // circle of the given radius, rather than wordWrap alone - which sets
  // line-width but not line-count, so long options used to spill past the
  // circle's edge vertically. Stops at a sensible floor so text never goes
  // unreadably small.
  fitTextToCircle(x, y, text, radius) {
    const maxWidth = radius * 1.5;
    const maxHeight = radius * 1.35;
    let fontSize = 15;
    let label;
    while (true) {
      if (label) label.destroy();
      label = this.add.text(x, y, text, {
        fontFamily: '"Tildunk", sans-serif', fontSize, color: '#fff8e7', align: 'center',
        wordWrap: { width: maxWidth, useAdvancedWrap: true }, lineSpacing: 2
      }).setOrigin(0.5).setScrollFactor(0);
      if (label.height <= maxHeight || fontSize <= 9) break;
      fontSize -= 1;
    }
    return label;
  }

  // Builds one polished, circular "vote here" zone: a slow-breathing outer
  // glow, the main filled ring, a soft gloss highlight for depth, and the
  // option's text fitted to sit fully inside the circle.
  buildCouncilZone(x, y, radius, labelText, key) {
    const glow = this.add.circle(x, y, radius + 16, 0xd8b04a, 0.14).setScrollFactor(0);
    this.tweens.add({
      targets: glow, alpha: { from: 0.08, to: 0.24 }, duration: 1400,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    const circle = this.add.circle(x, y, radius, 0x3c2f1d, 0.55)
      .setStrokeStyle(3, 0xd8b04a, 0.9).setScrollFactor(0);

    const highlight = this.add.ellipse(x - radius * 0.3, y - radius * 0.4, radius * 0.9, radius * 0.5, 0xffffff, 0.08)
      .setAngle(-20).setScrollFactor(0);

    const label = this.fitTextToCircle(x, y, labelText, radius);

    this.councilContainer.add([glow, circle, highlight, label]);
    return { key, x, y, circle, glow, highlight, label };
  }

  beginCouncilRound() {
    const { width, height } = this.scale;
    const round = CHAPTER2_COUNCIL[this.councilIndex];
    this.councilResolved = false;
    this.councilRoundTxt.setText(`Decision ${this.councilIndex + 1}/${CHAPTER2_COUNCIL.length}`);
    this.councilSituationTxt.setText(round.situation);
    this.updateCouncilTrustText();

    // reset the token to the starting mark and the timer to full
    this.councilToken.setPosition(width / 2, height - 110);
    this.councilTimeLeft = CHAPTER2_COUNCIL_ROUND_MS;
    this.councilTimerFill.width = this.councilTimerW;
    this.councilTimerFill.setFillStyle(0xd8b04a);

    // randomize which side each option lands on so it's never just muscle
    // memory from the previous round.
    const options = Phaser.Utils.Array.Shuffle([...round.options]);
    const zoneY = height / 2 - 10;
    const positions = [width / 2 - 190, width / 2 + 190];
    this.councilZones = options.map((opt, i) =>
      this.buildCouncilZone(positions[i], zoneY, CHAPTER2_COUNCIL_ZONE_RADIUS, opt.label, opt.key)
    );
  }

  // Drives the free-floating token while mode === 'towncouncil' - called
  // from update() below, the same dispatch pattern Chapter1Scene uses for
  // its riverrun mode.
  updateTownCouncil(time, delta) {
    if (this.locked || this.councilResolved) return;

    let vx = 0, vy = 0;
    if (this.keys.left.isDown || this.cursors.left.isDown) vx -= 1;
    if (this.keys.right.isDown || this.cursors.right.isDown) vx += 1;
    if (this.keys.up.isDown || this.cursors.up.isDown) vy -= 1;
    if (this.keys.down.isDown || this.cursors.down.isDown) vy += 1;

    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy);
      const { width, height } = this.scale;
      const nx = this.councilToken.x + (vx / len) * CHAPTER2_COUNCIL_TOKEN_SPEED * (delta / 1000);
      const ny = this.councilToken.y + (vy / len) * CHAPTER2_COUNCIL_TOKEN_SPEED * (delta / 1000);
      this.councilToken.x = Phaser.Math.Clamp(nx, 60, width - 60);
      this.councilToken.y = Phaser.Math.Clamp(ny, 170, height - 60);

      // Same facing/anim precedence as the main update() loop below -
      // vertical movement wins over horizontal - so the token actually
      // walks instead of gliding around on its idle frame.
      if (vy < 0) this.councilToken.facing = 'up';
      else if (vy > 0) this.councilToken.facing = 'down';
      else if (vx !== 0) { this.councilToken.facing = 'side'; this.councilToken.setFlipX(vx > 0); }

      this.councilToken.play(`${this.prefix}-walk-${this.councilToken.facing}`, true);
    } else {
      this.councilToken.anims.stop();
      const idleFrame = { down: 0, up: 12, side: 24 }[this.councilToken.facing];
      this.councilToken.setFrame(idleFrame);
    }

    this.councilTimeLeft -= delta;
    const pct = Phaser.Math.Clamp(this.councilTimeLeft / CHAPTER2_COUNCIL_ROUND_MS, 0, 1);
    this.councilTimerFill.width = Math.max(0, this.councilTimerW * pct);
    if (pct < 0.3) this.councilTimerFill.setFillStyle(0xc24a38);

    for (const zone of this.councilZones) {
      if (Phaser.Math.Distance.Between(this.councilToken.x, this.councilToken.y, zone.x, zone.y) < CHAPTER2_COUNCIL_ZONE_RADIUS) {
        this.resolveCouncilRound(zone.key);
        return;
      }
    }

    if (this.councilTimeLeft <= 0) this.resolveCouncilRound(null);
  }

  // selectedKey is null on a timeout (no zone reached in time).
  resolveCouncilRound(selectedKey) {
    this.councilResolved = true;
    const round = CHAPTER2_COUNCIL[this.councilIndex];
    const isCorrect = selectedKey === round.correct;
    if (isCorrect) this.councilScore++;
    SoundManager.play(this, isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) this.cameras.main.shake(120, 0.004);
    this.updateCouncilTrustText();

    this.councilZones.forEach(zone => {
      this.tweens.killTweensOf(zone.glow);
      if (zone.key === round.correct) {
        zone.circle.setFillStyle(0x3c7a3e, 0.65).setStrokeStyle(3, 0x6fae55);
        zone.glow.setFillStyle(0x6fae55, 0.22);
      } else if (zone.key === selectedKey) {
        zone.circle.setFillStyle(0xc24a38, 0.65).setStrokeStyle(3, 0xe0705f);
        zone.glow.setFillStyle(0xe0705f, 0.22);
      } else {
        zone.circle.setAlpha(0.3);
        zone.glow.setAlpha(0.05);
        zone.highlight.setAlpha(0.03);
      }
    });

    const { width, height } = this.scale;
    const verdictLabel = selectedKey === null ? "Time's up!" : (isCorrect ? 'Sound decision.' : 'A harder road, that one.');
    const verdict = this.add.text(width / 2, height - 190, verdictLabel, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 16, fontStyle: 'bold',
      color: isCorrect ? '#3c7a3e' : '#c24a38', backgroundColor: '#000000aa', padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);
    const explanation = this.add.text(width / 2, height - 160, round.explanation, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#fff8e7', align: 'center', backgroundColor: '#000000aa',
      padding: { x: 10, y: 6 }, wordWrap: { width: Math.min(520, width - 100) }
    }).setOrigin(0.5, 0).setScrollFactor(0);
    this.councilContainer.add([verdict, explanation]);

    this.locked = true;
    this.time.delayedCall(1800, () => {
      verdict.destroy();
      explanation.destroy();
      this.councilZones.forEach(z => {
        this.tweens.killTweensOf(z.glow);
        z.glow.destroy(); z.highlight.destroy(); z.circle.destroy(); z.label.destroy();
      });
      this.councilZones = [];
      this.councilIndex++;
      this.locked = false;
      if (this.councilIndex < CHAPTER2_COUNCIL.length) {
        this.beginCouncilRound();
      } else {
        this.finishTownCouncil();
      }
    });
  }

  finishTownCouncil() {
    this.locked = true;
    if (this.councilContainer) { this.councilContainer.destroy(); this.councilContainer = null; }
    this.player.setVisible(true);
    showDialogue(this, 'Valentin Tuason', [
      'These situations are imagined, but they are the kind of small, practical choices a young municipality had to make, one at a time.',
      'Let\'s see what you remember.'
    ], () => this.startQuiz(), ['don-emilio-explain', 'don-emilio-point']);
  }

  interactWithPlot(plot) {
    this.locked = true;
    if (plot.built) {
      // Free to revisit anything already built - no risk, just a refresher.
      showFoundItemPopup(this, plot, () => { this.locked = false; });
      return;
    }
    this.showBuildMenu(plot);
  }

  // --- "What should be built here?" menu -----------------------------------
  // Lists whichever building types haven't been placed anywhere yet, so the
  // choices narrow down (and the puzzle gets easier) as the player goes.
  // A wrong pick just shows a nudge and lets them try again - no penalty.
  showBuildMenu(plot) {
    const { width, height } = this.scale;
    const options = this.plots.filter(p => !p.built);
    const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45).setInteractive().setScrollFactor(0);

    const panelH = 220 + options.length * 46;
    const panel = this.add.rectangle(width / 2, height / 2, 460, panelH, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    const top = height / 2 - panelH / 2;

    const title = this.add.text(width / 2, top + 26, 'Empty Plot', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 20, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    const clueTxt = this.add.text(width / 2, top + 52, plot.clue, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#6b4a2f', align: 'center',
      wordWrap: { width: 400 }
    }).setOrigin(0.5, 0);
    const prompt = this.add.text(width / 2, top + 96, 'What should be built here?', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#3b2410', fontStyle: 'italic'
    }).setOrigin(0.5);

    container.add([overlay, panel, title, clueTxt, prompt]);

    const feedback = this.add.text(width / 2, top + panelH - 100, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#9c3b2e', align: 'center',
      wordWrap: { width: 400 }
    }).setOrigin(0.5, 0);
    container.add(feedback);

    options.forEach((opt, i) => {
      const y = top + 124 + i * 46;
      const { rect, txt } = createButton(this, width / 2, y, opt.name, () => {
        if (opt.id === plot.id) {
          container.destroy();
          this.buildPlot(plot);
        } else {
          feedback.setText("Hmm, that doesn't quite fit here. Think about the clue again.");
        }
      }, { width: 380, height: 36, fontSize: 14 });
      container.add([rect, txt]);
    });

    const { rect, txt } = createButton(this, width / 2, top + panelH - 28, 'Cancel', () => {
      container.destroy();
      this.locked = false;
    }, { width: 140, height: 32, fontSize: 13, color: 0x6b4a2f, hoverColor: 0x8a6b45 });
    container.add([rect, txt]);
  }

  buildPlot(plot) {
    plot.built = true;
    // Swap the empty-plot icon for this building's real icon if it loaded;
    // setTexture/setDisplaySize both work whether plot.rect ended up as an
    // Image (normal case) or the Rectangle fallback happens to still be
    // showing (setFillStyle would only work on the latter, so this covers
    // the Image case that replaced it).
    const builtIcon = CHAPTER2_BUILT_ICONS[plot.id];
    if (builtIcon && this.textures.exists(builtIcon.key) && plot.rect.setTexture) {
      plot.rect.setTexture(builtIcon.key).setDisplaySize(builtIcon.w, builtIcon.h);
      plot.iconH = builtIcon.h;
      // The plot's static collision body was sized from the empty-plot
      // icon at create() time - refresh it now that the display size has
      // changed to the (larger) built icon, or the collider would keep
      // using the old, smaller footprint.
      if (plot.rect.body && plot.rect.body.updateFromGameObject) {
        plot.rect.body.updateFromGameObject();
      }
    } else if (plot.rect.setFillStyle) {
      plot.rect.setFillStyle(plot.color, 0.85);
    }
    plot.mark.setVisible(false);
    this.applyPlotDepth(plot);
    this.updateProgress();

    showFoundItemPopup(this, plot, () => {
      this.locked = false;
      if (this.plots.every(p => p.built)) {
        this.returnFlag.setVisible(true);
        showToast(this, 'Talk to Valentin Tuason');
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
        q: 'Before Pateros became a municipality of its own, it was a barrio of which town?',
        options: ['Pasig', 'Manila', 'Makati', 'Marikina'],
        correct: 0,
        explanation: 'Pateros began as Aguho, a barrio of Pasig. A Spanish decree in 1799 made it a separate municipality (older sources give 1700 or 1770).'
      },
      {
        q: 'According to most current sources, in what year did a Spanish decree make Pateros an independent municipality?',
        options: ['1799', '1815', '1898', '1950'],
        correct: 0,
        explanation: 'A decree of the Spanish Governor-General in 1799 separated Pateros from Pasig. Its own parish, San Roque, came later, in 1815. (Older sources give 1700 or 1770.)'
      },
      {
        q: 'Who was Valentin Tuason?',
        options: ['The gobernadorcillo, or town head, when the first town fiesta was held in 1828', 'The commander of the Katipunan chapter in Pateros', 'The Spanish Governor-General who created the town', 'A balut maker from the duck farms'],
        correct: 0,
        explanation: 'Valentin Tuason was gobernadorcillo of Pateros when the first town fiesta was held, on August 16, 1828.'
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
    if (!pages.includes(2)) pages.push(2);
    this.registry.set('journalPages', pages);
    // Persist the page too, so it is still readable after a reload.
    ChapterProgress.addJournalPage(2);
    // Persist to localStorage so Chapter 3 shows up unlocked in the main
    // menu's Chapter list even after a page reload.
    ChapterProgress.unlockNextAfter('Chapter2');

    // A short wrap-up from Valentin Tuason before the reward panel, so the
    // chapter closes out like the rest of the conversation instead of
    // cutting straight to a modal the instant the quiz ends.
    this.locked = true;
    showDialogue(this, 'Valentin Tuason', [
      'You have a good eye for how a town comes together, and I think 1799 will stick with you now.',
      'Keep this page safe. The next one is not as calm as this.'
    ], () => this.showJournalReward(), ['don-emilio-happy', 'don-emilio-point']);
  }

  showJournalReward() {
    // Chapter3Scene is now registered in main.js's scene list, so this
    // picks it up automatically and starts it instead of falling back
    // to the menu - no other change needed here.
    const chapter3Ready = !!this.scene.manager.keys['Chapter3'];

    const { width, height } = this.scale;
    const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, 460, 240, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    const title = this.add.text(width / 2, height / 2 - 80, 'Journal Page #2 Unlocked!', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    const scoreTxt = this.add.text(width / 2, height / 2 - 34, `You remembered ${this.quizScore} / ${this.quizQuestions.length}.`, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#3b2410'
    }).setOrigin(0.5);
    const flavor = this.add.text(width / 2, height / 2, chapter3Ready
      ? 'The Birth of a Municipality — recorded in the journal. Chapter 3 awaits.'
      : 'The Birth of a Municipality — recorded in the journal. Chapter 3 is still being written — more adventures coming soon!', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 14, color: '#6b4a2f', align: 'center', wordWrap: { width: 380 }
    }).setOrigin(0.5, 0);

    container.add([overlay, panel, title, scoreTxt, flavor]);

    const { rect, txt } = createButton(this, width / 2 + 95, height / 2 + 88, chapter3Ready ? 'Continue' : 'Back to Menu', () => {
      curtainClose(this, () => this.scene.start(chapter3Ready ? 'Chapter3' : 'Menu'));
    }, { width: 170, height: 44, fontSize: 17, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);

    // Lets the player read the page they just collected before moving on.
    JournalBook.addReadButton(this, container, 2, width / 2 - 95, height / 2 + 88, { width: 170, height: 44, fontSize: 16 });
  }

  update(time, delta) {
    if (this.mode === 'towncouncil') {
      this.updateTownCouncil(time, delta);
      return;
    }

    // Valentin wanders around the plaza (frozen while locked / near player).
    this.updateDonRoaming(time);

    // Keep draw order and Valentin's floating prompts in sync with movement.
    this.player.setDepth(this.depthForY(this.player.y + C2_FRAME_H / 2));
    this.donEmilio.setDepth(this.depthForY(this.donEmilio.y + C2_FRAME_H / 2));
    this.interactPrompt.setPosition(this.donEmilio.x, this.donEmilio.y - 90);
    this.returnFlag.setPosition(this.donEmilio.x, this.donEmilio.y - 60);

    // interaction prompt + key handling
    if (!this.locked && (this.mode === 'explore')) {
      const nearest = this.nearestInteractable();
      if (nearest && nearest.type === 'don') {
        this.interactPrompt.setText('Press E to talk').setVisible(true);
        this.plotPrompt.setVisible(false);
      } else if (nearest && nearest.type === 'plot') {
        this.interactPrompt.setVisible(false);
        this.plotPrompt.setPosition(nearest.plot.x, nearest.plot.y - nearest.plot.iconH / 2 - 12).setVisible(true);
      } else {
        this.interactPrompt.setVisible(false);
        this.plotPrompt.setVisible(false);
      }

      if (Phaser.Input.Keyboard.JustDown(this.keys.interact) && nearest) {
        if (nearest.type === 'don') this.talkToDonEmilio();
        else this.interactWithPlot(nearest.plot);
      }
    } else {
      this.interactPrompt.setVisible(false);
      this.plotPrompt.setVisible(false);
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