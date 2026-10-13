const C5_FRAME_W = 44;
const C5_FRAME_H = 78;

// NOTE: INTERACT_RADIUS is declared once in Chapter1Scene.js (loaded before
// this file in index.html) and reused here as-is.

// ============================================================================
// Chapter 5 - "A Living Heritage"
// ----------------------------------------------------------------------------
// Per the story doc, this is the present-day chapter. Amihan/Hiraya meets
// two people instead of one - Ate Clara (keeper of the old traditions) and
// Maya (the younger generation) - and the chapter now runs: greeting
// dialogue -> a short "walk around the plaza and find it" explore beat
// (see CHAPTER5_EXPLORE_SPOTS below) -> walk back and report to Ate Clara
// and Maya (same "report back" step Chapter 1 has with Lola) -> one matching
// mini-game ("Keep the Story Alive") -> the Ask Well mini-game -> a 3-question quiz -> Journal
// Page #5 -> a short closing scene that wraps up the whole game (the doc's
// "FINAL GAME - Restore the Journal").
//
// The matching mini-game cards are still placeholder flat-color/DOM
// elements, same approach as Chapter 3/4. Ate Clara and Maya now have real
// sprites and dialogue portraits (see PreloadScene.js) - drop in real
// mini-game card art later and none of the logic here needs to change.
//
// The four traditions (Alfombra, Balut, Pandangguhan, Santa Marta) also have
// real icon art - assets/icons/ch5-<key>.png, see CHAPTER5_ICON_PATH below.
// It shows up in the "found it" popup, next to each row of the Task panel,
// on the matching-game term cards, and now as the on-map sprite for each
// explore landmark too. If a PNG is missing, every one of those places
// quietly falls back to the old text-only/tent-sprite look.
// ============================================================================

// ---------------------------------------------------------------------------
// MAP DATA - exported straight from the map editor (editor.html -> "Export
// JSON" for the chapter5_heritage_square map). This is a verbatim copy of
// that JSON; re-export from the editor and paste the object over this one
// any time the plaza layout changes, no other code below needs to change as
// long as new tile/object keys still follow the editor's normal
// "<prefix>_<number>" naming (see resolveChapter5TileImagePath /
// resolveChapter5ObjectImagePath). Same 48x32 / 32px-tile convention as
// Chapter1-4 (see mapLoader.js) - tile type 6 ("specialGround_03") is used
// for the open plaza clearing around the player's spawn point, in place of
// the plain "path" tile the earlier procedural version used.
// ---------------------------------------------------------------------------
const CHAPTER5_MAP_DATA = {
  "name": "chapter5_heritage_square",
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
    },
    "6": {
      "name": "specialGround_03",
      "color": "#888888",
      "solid": false,
      "imageKey": "specialGround_03"
    }
  },
  "tiles": [
    "222222222222222224400500000000000000000000000000",
    "444444444444444444400006600000000000004222224000",
    "600000660000000000000006600000000000004222224000",
    "600000660000000000000006600000000000004444444000",
    "600000660000000000000006600000000000000000000000",
    "600000660000000000000006600000000000000000000000",
    "600000660000000000000006600000000000000000000000",
    "600000660000000000000006600000000000000000000000",
    "600000660000000000000006600000000000000000000000",
    "600000660000000000000006600000000000000000000000",
    "600000660000000000000006600000000000000000000000",
    "600000666666666666666666600000000000000000000000",
    "600000666666666666666666600000000000006666666666",
    "600000660000000000000006600000000000006666666666",
    "600000660000000000000006600000000000006600000006",
    "600000660000000000000006600000000000006600000006",
    "600000660000000000000006600000000000006600000006",
    "600000660000000000000006600000000000006600000006",
    "600000660000000000000006600000000000006600000006",
    "600000660000000000000006600000000000006600000006",
    "600000660000000666666666666666666000006600000006",
    "600000660000000666666666666666666000006600000006",
    "600000666666666666666666666666666666666600000006",
    "600000666666666666666666666666666666666666666666",
    "600000666666666666666666666666666666666666666666",
    "666666660000000666666666666666666000036666666663",
    "666666660000000666666666666666666000036666666663",
    "000000000000000666666666666666666000036666666663",
    "000000000000000666666666666666666000036633333663",
    "000000000000000666666666666666666000036636663663",
    "000000000000000000000006600000000000036636663663",
    "000000000000000000000006600000000000033333333333"
  ],
  "objects": [
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 20,
      "row": 18,
      "x": 656,
      "y": 592,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 13,
      "row": 28,
      "x": 432,
      "y": 912,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 34,
      "row": 28,
      "x": 1104,
      "y": 912,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 31,
      "row": 18,
      "x": 1008,
      "y": 592,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_2",
      "name": "House 2",
      "col": 27,
      "row": 18,
      "x": 880,
      "y": 592,
      "w": 156,
      "h": 135,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_14",
      "name": "Plants 14",
      "col": 22,
      "row": 19,
      "x": 720,
      "y": 624,
      "w": 23,
      "h": 33,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_15",
      "name": "Plants 15",
      "col": 18,
      "row": 19,
      "x": 592,
      "y": 624,
      "w": 38,
      "h": 51,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_15",
      "name": "Plants 15",
      "col": 14,
      "row": 25,
      "x": 464,
      "y": 816,
      "w": 38,
      "h": 51,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 33,
      "row": 21,
      "x": 1072,
      "y": 688,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 33,
      "row": 25,
      "x": 1072,
      "y": 816,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 33,
      "row": 26,
      "x": 1072,
      "y": 848,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 21,
      "row": 5,
      "x": 688,
      "y": 176,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 19,
      "row": 6,
      "x": 624,
      "y": 208,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 26,
      "row": 9,
      "x": 848,
      "y": 304,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 28,
      "row": 13,
      "x": 912,
      "y": 432,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 26,
      "row": 14,
      "x": 848,
      "y": 464,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 22,
      "row": 16,
      "x": 720,
      "y": 528,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 19,
      "row": 15,
      "x": 624,
      "y": 496,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 26,
      "row": 11,
      "x": 848,
      "y": 368,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 29,
      "row": 10,
      "x": 944,
      "y": 336,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 17,
      "row": 8,
      "x": 560,
      "y": 272,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 29,
      "row": 5,
      "x": 944,
      "y": 176,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 17,
      "row": 4,
      "x": 560,
      "y": 144,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 43,
      "row": 15,
      "x": 1392,
      "y": 496,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 43,
      "row": 17,
      "x": 1392,
      "y": 560,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 43,
      "row": 20,
      "x": 1392,
      "y": 656,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 37,
      "row": 13,
      "x": 1200,
      "y": 432,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 37,
      "row": 14,
      "x": 1200,
      "y": 464,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 37,
      "row": 15,
      "x": 1200,
      "y": 496,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 37,
      "row": 16,
      "x": 1200,
      "y": 528,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 37,
      "row": 17,
      "x": 1200,
      "y": 560,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 37,
      "row": 18,
      "x": 1200,
      "y": 592,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 36,
      "row": 20,
      "x": 1168,
      "y": 656,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 37,
      "row": 19,
      "x": 1200,
      "y": 624,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 37,
      "row": 20,
      "x": 1200,
      "y": 656,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 37,
      "row": 21,
      "x": 1200,
      "y": 688,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 36,
      "row": 21,
      "x": 1168,
      "y": 688,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 36,
      "row": 18,
      "x": 1168,
      "y": 592,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 36,
      "row": 19,
      "x": 1168,
      "y": 624,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 36,
      "row": 16,
      "x": 1168,
      "y": 528,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 36,
      "row": 15,
      "x": 1168,
      "y": 496,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 36,
      "row": 14,
      "x": 1168,
      "y": 464,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 36,
      "row": 13,
      "x": 1168,
      "y": 432,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 13,
      "x": 1136,
      "y": 432,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 13,
      "x": 1136,
      "y": 432,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 15,
      "x": 1136,
      "y": 496,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 14,
      "x": 1136,
      "y": 464,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 16,
      "x": 1136,
      "y": 528,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 18,
      "x": 1136,
      "y": 592,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 17,
      "x": 1136,
      "y": 560,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 19,
      "x": 1136,
      "y": 624,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 20,
      "x": 1136,
      "y": 656,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_6",
      "name": "Plants 6",
      "col": 35,
      "row": 21,
      "x": 1136,
      "y": 688,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_18",
      "name": "Plants 18",
      "col": 9,
      "row": 4,
      "x": 304,
      "y": 144,
      "w": 52,
      "h": 130,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_18",
      "name": "Plants 18",
      "col": 9,
      "row": 15,
      "x": 304,
      "y": 496,
      "w": 52,
      "h": 130,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_18",
      "name": "Plants 18",
      "col": 9,
      "row": 19,
      "x": 304,
      "y": 624,
      "w": 52,
      "h": 130,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_house_4",
      "name": "House 4",
      "col": 3,
      "row": 4,
      "x": 112,
      "y": 144,
      "w": 154,
      "h": 149,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_4",
      "name": "House 4",
      "col": 3,
      "row": 10,
      "x": 112,
      "y": 336,
      "w": 154,
      "h": 149,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_4",
      "name": "House 4",
      "col": 3,
      "row": 16,
      "x": 112,
      "y": 528,
      "w": 154,
      "h": 149,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_4",
      "name": "House 4",
      "col": 3,
      "row": 22,
      "x": 112,
      "y": 720,
      "w": 154,
      "h": 149,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_1",
      "name": "Bench 1",
      "col": 16,
      "row": 21,
      "x": 528,
      "y": 688,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_2",
      "name": "Bench 2",
      "col": 18,
      "row": 21,
      "x": 592,
      "y": 688,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_lamp_1",
      "name": "Lamp 1",
      "col": 25,
      "row": 29,
      "x": 816,
      "y": 944,
      "w": 50,
      "h": 80,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 11,
      "row": 3,
      "x": 368,
      "y": 112,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 11,
      "row": 4,
      "x": 368,
      "y": 144,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 11,
      "row": 5,
      "x": 368,
      "y": 176,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 11,
      "row": 6,
      "x": 368,
      "y": 208,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 11,
      "row": 7,
      "x": 368,
      "y": 240,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 12,
      "row": 7,
      "x": 400,
      "y": 240,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 12,
      "row": 6,
      "x": 400,
      "y": 208,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 12,
      "row": 5,
      "x": 400,
      "y": 176,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 12,
      "row": 4,
      "x": 400,
      "y": 144,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 12,
      "row": 3,
      "x": 400,
      "y": 112,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 13,
      "row": 3,
      "x": 432,
      "y": 112,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 13,
      "row": 4,
      "x": 432,
      "y": 144,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 13,
      "row": 5,
      "x": 432,
      "y": 176,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 13,
      "row": 6,
      "x": 432,
      "y": 208,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 13,
      "row": 7,
      "x": 432,
      "y": 240,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 13,
      "row": 7,
      "x": 432,
      "y": 240,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 14,
      "row": 7,
      "x": 464,
      "y": 240,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 14,
      "row": 6,
      "x": 464,
      "y": 208,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 14,
      "row": 5,
      "x": 464,
      "y": 176,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 14,
      "row": 4,
      "x": 464,
      "y": 144,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 14,
      "row": 3,
      "x": 464,
      "y": 112,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 15,
      "row": 3,
      "x": 496,
      "y": 112,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 15,
      "row": 4,
      "x": 496,
      "y": 144,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 15,
      "row": 6,
      "x": 496,
      "y": 208,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 15,
      "row": 7,
      "x": 496,
      "y": 240,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_3",
      "name": "Plants 3",
      "col": 15,
      "row": 5,
      "x": 496,
      "y": 176,
      "w": 12,
      "h": 14,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_supply_19",
      "name": "Supplies 19",
      "col": 12,
      "row": 25,
      "x": 400,
      "y": 816,
      "w": 59,
      "h": 67,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_supply_19",
      "name": "Supplies 19",
      "col": 31,
      "row": 21,
      "x": 1008,
      "y": 688,
      "w": 59,
      "h": 67,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_supply_20",
      "name": "Supplies 20",
      "col": 46,
      "row": 19,
      "x": 1488,
      "y": 624,
      "w": 45,
      "h": 56,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_supply_21",
      "name": "Supplies 21",
      "col": 46,
      "row": 21,
      "x": 1488,
      "y": 688,
      "w": 48,
      "h": 53,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_supply_22",
      "name": "Supplies 22",
      "col": 46,
      "row": 17,
      "x": 1488,
      "y": 560,
      "w": 47,
      "h": 38,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_supply_22",
      "name": "Supplies 22",
      "col": 3,
      "row": 19,
      "x": 112,
      "y": 624,
      "w": 47,
      "h": 38,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_supply_22",
      "name": "Supplies 22",
      "col": 2,
      "row": 13,
      "x": 80,
      "y": 432,
      "w": 47,
      "h": 38,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_decor_2",
      "name": "Decor 2",
      "col": 5,
      "row": 19,
      "x": 176,
      "y": 624,
      "w": 41,
      "h": 38,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_decor_2",
      "name": "Decor 2",
      "col": 16,
      "row": 10,
      "x": 528,
      "y": 336,
      "w": 41,
      "h": 38,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_decor_2",
      "name": "Decor 2",
      "col": 17,
      "row": 10,
      "x": 560,
      "y": 336,
      "w": 41,
      "h": 38,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 37,
      "row": 28,
      "x": 1200,
      "y": 912,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 40,
      "row": 22,
      "x": 1296,
      "y": 720,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 40,
      "row": 19,
      "x": 1296,
      "y": 624,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 43,
      "row": 7,
      "x": 1392,
      "y": 240,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 41,
      "row": 8,
      "x": 1328,
      "y": 272,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 40,
      "row": 6,
      "x": 1296,
      "y": 208,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 39,
      "row": 5,
      "x": 1264,
      "y": 176,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 40,
      "row": 3,
      "x": 1296,
      "y": 112,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 42,
      "row": 3,
      "x": 1360,
      "y": 112,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 43,
      "row": 4,
      "x": 1392,
      "y": 144,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 35,
      "row": 7,
      "x": 1136,
      "y": 240,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 37,
      "row": 5,
      "x": 1200,
      "y": 176,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 36,
      "row": 3,
      "x": 1168,
      "y": 112,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_4",
      "name": "Shadow 4",
      "col": 38,
      "row": 7,
      "x": 1232,
      "y": 240,
      "w": 44,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_stone_6",
      "name": "Stone 6",
      "col": 34,
      "row": 5,
      "x": 1104,
      "y": 176,
      "w": 11,
      "h": 9,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_stone_6",
      "name": "Stone 6",
      "col": 36,
      "row": 8,
      "x": 1168,
      "y": 272,
      "w": 11,
      "h": 9,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_tent_3",
      "name": "Tent 3",
      "col": 42,
      "row": 30,
      "x": 1360,
      "y": 976,
      "w": 65,
      "h": 62,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_1",
      "name": "Tent 1",
      "col": 9,
      "row": 9,
      "x": 304,
      "y": 304,
      "w": 73,
      "h": 65,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_2",
      "name": "Tent 2",
      "col": 26,
      "row": 6,
      "x": 848,
      "y": 208,
      "w": 64,
      "h": 61,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_3",
      "name": "Tent 3",
      "col": 16,
      "row": 25,
      "x": 528,
      "y": 816,
      "w": 65,
      "h": 62,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_1",
      "name": "Box 1",
      "col": 15,
      "row": 29,
      "x": 496,
      "y": 944,
      "w": 20,
      "h": 22,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_2",
      "name": "Box 2",
      "col": 26,
      "row": 30,
      "x": 848,
      "y": 976,
      "w": 20,
      "h": 22,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_3",
      "name": "Box 3",
      "col": 15,
      "row": 21,
      "x": 496,
      "y": 688,
      "w": 16,
      "h": 21,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_3",
      "name": "Box 3",
      "col": 29,
      "row": 29,
      "x": 944,
      "y": 944,
      "w": 16,
      "h": 21,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_3",
      "name": "Box 3",
      "col": 29,
      "row": 21,
      "x": 944,
      "y": 688,
      "w": 16,
      "h": 21,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_5",
      "name": "Box 5",
      "col": 28,
      "row": 21,
      "x": 912,
      "y": 688,
      "w": 18,
      "h": 25,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_14",
      "name": "Plants 14",
      "col": 1,
      "row": 7,
      "x": 48,
      "y": 240,
      "w": 23,
      "h": 33,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_14",
      "name": "Plants 14",
      "col": 2,
      "row": 7,
      "x": 80,
      "y": 240,
      "w": 23,
      "h": 33,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_14",
      "name": "Plants 14",
      "col": 3,
      "row": 7,
      "x": 112,
      "y": 240,
      "w": 23,
      "h": 33,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_14",
      "name": "Plants 14",
      "col": 5,
      "row": 7,
      "x": 176,
      "y": 240,
      "w": 23,
      "h": 33,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_14",
      "name": "Plants 14",
      "col": 4,
      "row": 7,
      "x": 144,
      "y": 240,
      "w": 23,
      "h": 33,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_14",
      "name": "Plants 14",
      "col": 1,
      "row": 13,
      "x": 48,
      "y": 432,
      "w": 23,
      "h": 33,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 2,
      "row": 27,
      "x": 80,
      "y": 880,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 3,
      "row": 27,
      "x": 112,
      "y": 880,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 4,
      "row": 27,
      "x": 144,
      "y": 880,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 1,
      "row": 27,
      "x": 48,
      "y": 880,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 1,
      "row": 28,
      "x": 48,
      "y": 912,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 2,
      "row": 28,
      "x": 80,
      "y": 912,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 3,
      "row": 28,
      "x": 112,
      "y": 912,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 4,
      "row": 28,
      "x": 144,
      "y": 912,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 4,
      "row": 29,
      "x": 144,
      "y": 944,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 2,
      "row": 29,
      "x": 80,
      "y": 944,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 1,
      "row": 29,
      "x": 48,
      "y": 944,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_20",
      "name": "Plants 20",
      "col": 3,
      "row": 29,
      "x": 112,
      "y": 944,
      "w": 13,
      "h": 37,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_43",
      "name": "Plants 43",
      "col": 40,
      "row": 2,
      "x": 1296,
      "y": 80,
      "w": 22,
      "h": 17,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_41",
      "name": "Plants 41",
      "col": 42,
      "row": 1,
      "x": 1360,
      "y": 48,
      "w": 13,
      "h": 10,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_52",
      "name": "Plants 52",
      "col": 43,
      "row": 8,
      "x": 1392,
      "y": 272,
      "w": 48,
      "h": 59,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_52",
      "name": "Plants 52",
      "col": 45,
      "row": 1,
      "x": 1456,
      "y": 48,
      "w": 48,
      "h": 59,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_52",
      "name": "Plants 52",
      "col": 45,
      "row": 5,
      "x": 1456,
      "y": 176,
      "w": 48,
      "h": 59,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_52",
      "name": "Plants 52",
      "col": 45,
      "row": 9,
      "x": 1456,
      "y": 304,
      "w": 48,
      "h": 59,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_52",
      "name": "Plants 52",
      "col": 38,
      "row": 9,
      "x": 1232,
      "y": 304,
      "w": 48,
      "h": 59,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_decor_13",
      "name": "Decor 13",
      "col": 32,
      "row": 13,
      "x": 1040,
      "y": 432,
      "w": 43,
      "h": 54,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_decor_1",
      "name": "Decor 1",
      "col": 30,
      "row": 14,
      "x": 976,
      "y": 464,
      "w": 48,
      "h": 26,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_box_1",
      "name": "Box 1",
      "col": 32,
      "row": 15,
      "x": 1040,
      "y": 496,
      "w": 20,
      "h": 22,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_2",
      "name": "Box 2",
      "col": 30,
      "row": 12,
      "x": 976,
      "y": 400,
      "w": 20,
      "h": 22,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_decor_13",
      "name": "Decor 13",
      "col": 4,
      "row": 13,
      "x": 144,
      "y": 432,
      "w": 43,
      "h": 54,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_decor_13",
      "name": "Decor 13",
      "col": 13,
      "row": 14,
      "x": 432,
      "y": 464,
      "w": 43,
      "h": 54,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_grass_4",
      "name": "Grass 4",
      "col": 11,
      "row": 15,
      "x": 368,
      "y": 496,
      "w": 8,
      "h": 5,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 20,
      "row": 1,
      "x": 656,
      "y": 48,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_2",
      "name": "House 2",
      "col": 28,
      "row": 1,
      "x": 912,
      "y": 48,
      "w": 156,
      "h": 135,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_78",
      "name": "Plants 78",
      "col": 36,
      "row": 1,
      "x": 1168,
      "y": 48,
      "w": 50,
      "h": 69,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_78",
      "name": "Plants 78",
      "col": 45,
      "row": 3,
      "x": 1456,
      "y": 112,
      "w": 50,
      "h": 69,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_45",
      "name": "Plants 45",
      "col": 10,
      "row": 27,
      "x": 336,
      "y": 880,
      "w": 13,
      "h": 16,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_45",
      "name": "Plants 45",
      "col": 10,
      "row": 28,
      "x": 336,
      "y": 912,
      "w": 13,
      "h": 16,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_45",
      "name": "Plants 45",
      "col": 11,
      "row": 27,
      "x": 368,
      "y": 880,
      "w": 13,
      "h": 16,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_45",
      "name": "Plants 45",
      "col": 11,
      "row": 28,
      "x": 368,
      "y": 912,
      "w": 13,
      "h": 16,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_100",
      "name": "Plants 100",
      "col": 1,
      "row": 1,
      "x": 48,
      "y": 48,
      "w": 14,
      "h": 18,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_plant_68",
      "name": "Plants 68",
      "col": 3,
      "row": 0,
      "x": 112,
      "y": 16,
      "w": 15,
      "h": 12,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 16,
      "row": 18,
      "x": 528,
      "y": 592,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_2",
      "name": "House 2",
      "col": 12,
      "row": 19,
      "x": 400,
      "y": 624,
      "w": 156,
      "h": 135,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 20,
      "row": 8,
      "x": 656,
      "y": 272,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_1",
      "name": "Bench 1",
      "col": 39,
      "row": 26,
      "x": 1264,
      "y": 848,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_stone_1",
      "name": "Stone 1",
      "col": 37,
      "row": 30,
      "x": 1200,
      "y": 976,
      "w": 10,
      "h": 9,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_bench_2",
      "name": "Bench 2",
      "col": 45,
      "row": 26,
      "x": 1456,
      "y": 848,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 30,
      "row": 28,
      "x": 976,
      "y": 912,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 17,
      "row": 28,
      "x": 560,
      "y": 912,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_3",
      "name": "House 3",
      "col": 9,
      "row": 31,
      "x": 304,
      "y": 1008,
      "w": 147,
      "h": 157,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_3",
      "name": "House 3",
      "col": 15,
      "row": 31,
      "x": 496,
      "y": 1008,
      "w": 147,
      "h": 157,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_3",
      "name": "House 3",
      "col": 27,
      "row": 31,
      "x": 880,
      "y": 1008,
      "w": 147,
      "h": 157,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_3",
      "name": "House 3",
      "col": 32,
      "row": 31,
      "x": 1040,
      "y": 1008,
      "w": 147,
      "h": 157,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_3",
      "name": "House 3",
      "col": 20,
      "row": 31,
      "x": 656,
      "y": 1008,
      "w": 147,
      "h": 157,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_3",
      "name": "Bench 3",
      "col": 38,
      "row": 31,
      "x": 1232,
      "y": 1008,
      "w": 60.9,
      "h": 58.099999999999994,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_3",
      "name": "Tent 3",
      "col": 9,
      "row": 25,
      "x": 304,
      "y": 816,
      "w": 65,
      "h": 62,
      "color": "#888888",
      "collidable": true,
      "info": ""
    }
  ]
};

// Same procedural tile painters mapLoader.js uses for the built-in tile
// types (grass/tree/water/path/sand/wall) - reused here so a tile type with
// no `imageKey` (e.g. this map's "wall") still gets real texture instead
// of a flat color fill, exactly like the editor's own preview does.
const CHAPTER5_BUILTIN_DRAWERS = {
  grass: drawGrass, tree: drawTree, water: drawWater,
  path: drawPath, sand: drawSand, wall: drawWall
};

// ---------------------------------------------------------------------------
// Asset-path resolvers - mirror editor.html's TILE_LIBRARY / OBJECT_LIBRARY
// naming so any tile/object key coming out of the map editor resolves to the
// right file under assets/src automatically, without needing a manual
// key->path table kept in sync by hand.
// ---------------------------------------------------------------------------
const CHAPTER5_TILE_KEY_SPECS = {
  fieldsTile: { dir: 'assets/src/1 Tiles', file: 'FieldsTile' },
  groundPath: { dir: 'assets/src/11 Ground Paths', file: 'GroundPath' },
  grassPathBlend: { dir: 'assets/src/12 Grass Path Blends', file: 'GrassPathBlend' },
  pathGrassBlend2: { dir: 'assets/src/13 Path Grass Blends 2', file: 'PathGrassBlend2' },
  specialGround: { dir: 'assets/src/14 Special Ground Patterns', file: 'SpecialGround' }
};
function resolveChapter5TileImagePath(key) {
  const m = key.match(/^(.+)_(\d+)$/);
  if (!m) return null;
  const spec = CHAPTER5_TILE_KEY_SPECS[m[1]];
  if (!spec) return null;
  return `${spec.dir}/${spec.file}_${m[2]}.png`;
}

const CHAPTER5_OBJECT_FOLDER_SPECS = {
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
function resolveChapter5ObjectImagePath(key) {
  if (key === 'obj_towerspot1') return 'assets/src/2 Objects/PlaceForTower1.png';
  if (key === 'obj_towerspot2') return 'assets/src/2 Objects/PlaceForTower2.png';
  const fenceMatch = key.match(/^obj_fence_(\d+)$/);
  if (fenceMatch) return `assets/src/1.1 Tiles/Tile2_${fenceMatch[1]}.png`;
  const m = key.match(/^obj_([a-z0-9]+)_(\d+)$/);
  if (!m) return null;
  const spec = CHAPTER5_OBJECT_FOLDER_SPECS[m[1]];
  if (!spec) return null;
  return `${spec.base}/${spec.folder}/${m[2]}.png`;
}

function chapter5HexToInt(css, fallback) {
  if (!css) return fallback;
  const n = parseInt(css.replace('#', ''), 16);
  return Number.isNaN(n) ? fallback : n;
}

// Builds the tileTypes config loadMap() expects (see mapLoader.js) straight
// out of CHAPTER5_MAP_DATA.tileTypes: real art where an imageKey is given,
// the matching procedural painter otherwise.
function buildChapter5TileTypes(mapData) {
  const cfg = {};
  Object.entries(mapData.tileTypes).forEach(([id, t]) => {
    cfg[id] = {
      name: t.name,
      color: chapter5HexToInt(t.color, 0x888888),
      solid: !!t.solid,
      imageKey: t.imageKey || undefined,
      noFlipY: true, // real art tiles (and hand-painted trees) shouldn't mirror
      draw: t.imageKey ? undefined : CHAPTER5_BUILTIN_DRAWERS[t.name]
    };
  });
  return cfg;
}

// Trees - the editor exports these as ordinary "plant" objects with
// collidable: false, and tile type 1 ("tree") isn't painted anywhere on this
// map, so tree solidity is applied here in create() instead of in the JSON.
// That way re-exporting/pasting a fresh map over CHAPTER5_MAP_DATA never
// undoes it. Keys are the tall/canopy plants (17/18 = the tall trees along
// the left side, 78/52/16/15 = the scattered trees). The other small plants
// (14, 20, 41, 43, 45, 68, 100) stay walkable unless they're listed in
// CHAPTER5_SOLID_DECOR_KEYS below. If a plant you consider a tree isn't
// blocking yet, add its key here.
const CHAPTER5_TREE_KEYS = new Set([
  'obj_plant_15', 'obj_plant_16', 'obj_plant_17',
  'obj_plant_18', 'obj_plant_52', 'obj_plant_78'
]);

// Other non-tree props that should also block the player even though the
// editor exported them as collidable: false - the crop/flower patches
// (plants 3 and 6) and the decor pieces 2, 3 and 13. Add more keys here the
// same way.
const CHAPTER5_SOLID_DECOR_KEYS = new Set([
  'obj_plant_3', 'obj_plant_6',
  'obj_decor_2', 'obj_decor_3', 'obj_decor_13'
]);

// --- "Keep the Story Alive" matching mini-game data ------------------------
// 4 term cards, each matched against its description (drag the card onto the
// matching slot). PLACEHOLDER CONTENT NOTE: only Alfombra and Pandangguhan
// had descriptions spelled out in the story doc's own example - those two
// are used verbatim below. Balut and Santa Marta didn't have example text
// in the doc, so their descriptions here are drafted to fit the same
// "living heritage" theme and are just as much a placeholder as the NPC art
// - reword or replace any of these later without touching the game logic.
const CHAPTER5_TRADITIONS = [
  {
    key: 'alfombra',
    name: 'Alfombra',
    desc: 'Handmade slippers with a soft, carpet-like top, a shoemaking tradition of Pateros.'
  },
  {
    key: 'pandangguhan',
    name: 'Pandangguhan',
    desc: 'A February dance parade offered to Santa Marta, with pasubo, the sharing of food.'
  },
  {
    key: 'balut',
    name: 'Balut',
    desc: "Pateros' signature delicacy, carried on from generations of duck raising."
  },
  {
    key: 'santamarta',
    name: 'Santa Marta',
    desc: 'A patroness of Pateros, honored each year with a feast and processions.'
  }
];

// Icon art for the four traditions: one PNG per CHAPTER5_TRADITIONS key,
// stored as assets/icons/ch5-<key>.png (256x256, transparent background).
// Phaser code refers to it by texture key (c5icon_<key>); the DOM matching
// cards use the file path directly. This is real art (not placeholder), and
// it's also reused as the on-map sprite for the explore landmarks below -
// see the hasIconArt fallback chain in create().
const CHAPTER5_ICON_PATH = key => `assets/icons/ch5-${key}.png`;
const CHAPTER5_ICON_TEXTURE = key => `c5icon_${key}`;

// ---------------------------------------------------------------------------
// EXPLORE - "Traces of Today"
// Added ahead of the matching mini-game: a short walk-around-the-plaza beat,
// the same "find X" loop Chapters 1/3 use elsewhere, so the 4
// CHAPTER5_TRADITIONS terms have a real thing to go find in the plaza
// before Ate Clara/Maya explain them. Each spot is matched to a plaza object
// by exact x/y so it can be pulled out of the plain-decor render loop in
// create() and rendered as an interactable instead (same technique
// CHAPTER1_QUEST_KEYS uses in Chapter1Scene.js). Visually it shows the same
// real tradition icon art used in the popup/matching-game (CHAPTER5_ICON_*
// above), and only falls back to the plaza's generic tent sprite if that
// icon art is somehow missing - see the hasIconArt/hasTentImage fallback
// chain in create() below.
// If you move a landmark tent in the editor, update its x/y here to match -
// any tent NOT listed here (the one at 528,816) is just solid scenery.
// Optional per-spot `w`/`h` override the on-map sprite's display size (in
// pixels); omit them and it just matches whatever the old tent's size was.
// Set to 100x100 here (icons are square 256x256 art) so they're clearly
// readable on the map instead of the old ~60-70px tent footprint - tweak
// per spot if one needs to be bigger/smaller.
const CHAPTER5_EXPLORE_SPOTS = [
  { tradKey: 'alfombra', name: 'Alfombra Slippers', x: 304, y: 816, w: 100, h: 100 },      // Tent 3
  { tradKey: 'balut', name: 'Balut Stall', x: 848, y: 208, w: 100, h: 100 },             // Tent 2
  { tradKey: 'pandangguhan', name: 'Pandangguhan Corner', x: 304, y: 304, w: 100, h: 100 }, // Tent 1
  { tradKey: 'santamarta', name: 'Santa Marta Shrine', x: 1360, y: 976, w: 100, h: 100 } // Tent 3
];

// Cameo NPCs - Lola Nena (Ch1), Valentin Tuason (Ch2), Macario Almeda (Ch3), and
// Mang Carding (Ch4) scattered around the Heritage Square plaza during the
// explore beat, as a "you've met everyone" callback for the final chapter.
// No quest logic attached - walking up and pressing E just gets a short
// friendly line or two (see talkToNpc). Sprite sheets are already
// loaded globally by PreloadScene.js (same ones Chapters 1-4 use), and
// frame 0 of each is that character's down-facing idle pose, same static-
// frame convention as Ate Clara/Maya above. Positions were chosen to sit on
// open walkable ground, clear of every collidable object on the map.
// `lines` / `portraits` are what they say when talked to: one portrait key
// per line (same portraits their own chapters use), edit freely.
const CHAPTER5_CAMEO_NPCS = [
  {
    sheet: 'lola-sheet', name: 'Lola Nena', x: 592, y: 176, flip: false,
    lines: [
      'Ay, anak, look at you - all the way from the riverbank to today\'s plaza.',
      'Keep every page of that journal safe. Every story you gathered belongs in it.'
    ],
    portraits: ['lola-happy', 'lola-wink']
  },
  {
    sheet: 'donemilio-sheet', name: 'Valentin Tuason', x: 1392, y: 816, flip: true,
    lines: [
      'Ah, there you are! Pateros held its first town fiesta in 1828, under my term as town head.',
      'Look around - the market, the roads, the places to gather. A town is still made of its people.'
    ],
    portraits: ['don-emilio-happy', 'don-emilio-explain']
  },
  {
    sheet: 'kapitanandres-sheet', name: 'Macario Almeda', x: 176, y: 912, flip: false,
    lines: [
      'Good to see you again, kapatid. The Balangay Magtanggol was founded in April 1896, and its story is still told in Pateros.',
      'Remember what our people risked - and see what they made possible.'
    ],
    portraits: ['kapitan-andres-happy', 'kapitan-andres-firm']
  },
  {
    sheet: 'mangcarding-sheet', name: 'Mang Carding', x: 1488, y: 208, flip: true,
    lines: [
      'Ay, anak! Balut is still sold around here, and some makers keep the trade alive.',
      'Every time someone asks how it\'s done, a little more of that story gets passed down.'
    ],
    portraits: ['mang-carding-happy', 'mang-carding-wink']
  }
];

// What the two hosts say when talked to during the explore beat. Maya's
// lines are a function of the scene so she can report live progress, same
// "You've found X of N so far" idea Chapters 1-3 use.
const CHAPTER5_HOST_TALK = {
  ateClara: {
    name: 'Ate Clara',
    lines: [
      'Take your time looking around, anak. Every corner of this plaza has a little piece of Pateros in it.',
      "Once you've found all four traditions, Maya and I will be right here."
    ],
    portraits: ['ate-clara-happy', 'ate-clara-wink']
  },
  maya: {
    name: 'Maya',
    lines: scene => [
      `You've found ${scene.exploreObjects.filter(o => o.found).length} of ${scene.exploreObjects.length} so far.`,
      'Walk up to one of the spots and press E to take a closer look!'
    ],
    portraits: ['maya-happy', 'maya-wave']
  }
};

// ==========================================================================
// MINI-GAME 2 - Ask Well
// Framed around how to actually ask about a living tradition, fitting this
// chapter's oral-history theme. Unlike the other chapters' second
// mini-games (Ch1's lane-dash, Ch2's walk-into-a-zone council, Ch3's
// guard-dodge, Ch4's proximity herding), this one plays as catching a
// drifting "story spark": each round's options hover and bob out in the
// plaza in front of Ate Clara and Maya as small floating cards, and the
// player has to actually walk over and press E on the one that fits before
// a short timer runs out. Missing, catching the wrong one, or running out
// of time all still show the same explanation afterward - only how you
// pick changed, not the lesson.
// ==========================================================================
const CHAPTER5_ASKWELL_ROUND_MS = 13000; // per-round time budget before the moment "passes"
const CHAPTER5_ASKWELL_CATCH_RADIUS = 50; // how close the player needs to be to ask a spark

const CHAPTER5_ASKWELL = [
  {
    situation: 'Maya wants to understand why alfombra-making still matters to Ate Clara.',
    options: [
      { key: 'poor', label: '"Isn\'t this kind of outdated?"' },
      { key: 'good', label: '"What does alfombra-making mean to you?"' }
    ],
    correct: 'good',
    explanation: 'An open question invites someone to actually share their story, instead of putting them on the defensive.'
  },
  {
    situation: 'Maya wants to know more about Pandangguhan.',
    options: [
      { key: 'good', label: '"What does the Pandangguhan mean to those who dance it?"' },
      { key: 'poor', label: '"Isn\'t that dance just for older folks?"' }
    ],
    correct: 'good',
    explanation: 'Asking what a tradition means to the people who keep it gets a far richer answer than assuming it doesn\'t matter anymore.'
  },
  {
    situation: "Maya wants to hear about the balut trade from Ate Clara's family.",
    options: [
      { key: 'poor', label: '"That\'s just an old, smelly business, right?"' },
      { key: 'good', label: '"What was it like growing up around the balut trade?"' }
    ],
    correct: 'good',
    explanation: 'A genuine question about someone\'s experience is how oral history actually gets passed down.'
  }
];

// Duck constants (values mirror Chapter 4; prefixed C5_ so they cannot clash
// with the top-level DUCK_* consts if Chapter4Scene.js is loaded first)
const C5_DUCK_FLEE_RADIUS = 90;
const C5_DUCK_FLEE_SPEED = 95;
const C5_DUCK_WANDER_SPEED = 42;
const C5_DUCK_WANDER_MIN_MS = 900;
const C5_DUCK_WANDER_MAX_MS = 1900;
const C5_DUCK_FLIP_THRESHOLD = 5;
const C5_DUCK_ART_FACES_LEFT_BY_DEFAULT = false;
const C5_DUCK_SCALE = 0.65;
const C5_DUCK_MOVE_THRESHOLD = 4;

// Where the ducks live. The plaza's only pond is the small one in the
// top-right corner of the map (water tiles cols 39-43 x rows 1-2, i.e.
// roughly x 1248-1408 / y 32-96, ringed by sand). Ducks paddle around it and
// shuffle out onto the grass below, but never wander outside this rectangle
// (world px). It stops short of the top wall and of Mang Carding's cameo at
// x=1488. To move the flock elsewhere, change this box and C5_DUCK_START.
const C5_DUCK_AREA = { left: 1130, right: 1420, top: 58, bottom: 300 };

// Starting spots: two out on the water, three along the shore.
const C5_DUCK_START = [
  { x: 1290, y: 68 },
  { x: 1355, y: 74 },
  { x: 1235, y: 138 },
  { x: 1320, y: 150 },
  { x: 1395, y: 190 }
];

class Chapter5Scene extends Phaser.Scene {
  constructor() {
    super('Chapter5');
  }

  preload() {
    // Everything the plaza needs is derived straight from
    // CHAPTER5_MAP_DATA: load each tile type's image (if it has one) and
    // each placed object's image (if its key resolves to one under
    // assets/src). Most objects in this map are purely decorative (houses,
    // plants, benches, etc.) - the 4 tents picked out by
    // CHAPTER5_EXPLORE_SPOTS still load through this same loop (they keep
    // their normal object keys) purely as a fallback now, they just get
    // pulled out of the plain-decor render pass in create() and rendered as
    // interactables instead. See the tradition-icon loader below for the
    // real art that takes priority over that tent fallback.
    Object.values(CHAPTER5_MAP_DATA.tileTypes).forEach(t => {
      if (t.imageKey) {
        const path = resolveChapter5TileImagePath(t.imageKey);
        if (path) this.load.image(t.imageKey, path);
        else console.warn('Chapter5Scene: no path resolver for tile image key', t.imageKey);
      }
    });

    const loadedObjectKeys = new Set();
    CHAPTER5_MAP_DATA.objects.forEach(o => {
      if (loadedObjectKeys.has(o.key)) return;
      const path = resolveChapter5ObjectImagePath(o.key);
      if (path) {
        this.load.image(o.key, path);
        loadedObjectKeys.add(o.key);
      } else {
        console.warn('Chapter5Scene: no path resolver for object key', o.key);
      }
    });

    // Duck spritesheets
    this.load.spritesheet('duck_walk', 'assets/icons/duck-walk.png', { frameWidth: 64, frameHeight: 72 });
    this.load.spritesheet('duck_flap', 'assets/icons/duck-flap.png', { frameWidth: 72, frameHeight: 80 });

    // Tradition icons (see CHAPTER5_ICON_PATH). Real art, not placeholder -
    // also reused as the on-map sprite for the explore landmarks (see
    // create() below), so this one load covers both the popup and the map.
    CHAPTER5_TRADITIONS.forEach(t => {
      this.load.image(CHAPTER5_ICON_TEXTURE(t.key), CHAPTER5_ICON_PATH(t.key));
    });
  }

  create(data) {
    SoundManager.playMusic(this, 'bg-game');
    const { width, height } = this.scale;
    const character = this.registry.get('selectedCharacter') || 'hiraya';
    const textureKey = character + '-sheet';
    this.prefix = character;
    this.speed = this.registry.get('playerSpeed') || 160;
    this.locked = false; // true during dialogue / modal minigame / quiz screens - movement disabled
    // mode: intro -> explore -> matching -> between -> askwell -> quiz ->
    // chapterdone (then off to the plaza - see
    // PrologueScene.playEndingSequence() for what follows)
    this.mode = 'intro';

    // Duck animations - same keys/frames as Chapter 4. Phaser's animation
    // manager is global, so these may already exist if Chapter 4 was played
    // first in this session; the exists() guards make jumping straight into
    // Chapter 5 from the Chapters menu work too.
    if (this.textures.exists('duck_walk') && !this.anims.exists('duck-walk')) {
      this.anims.create({
        key: 'duck-walk',
        frames: this.anims.generateFrameNumbers('duck_walk', { start: 0, end: 6 }),
        frameRate: 8,
        repeat: -1
      });
    }

    // --- Heritage Square map (loaded from the editor's exported JSON, see
    //     CHAPTER5_MAP_DATA above) ---
    this.map = loadMap(this, CHAPTER5_MAP_DATA.tiles, {
      tileTypes: buildChapter5TileTypes(CHAPTER5_MAP_DATA)
    });

// --- player ---
     this.createPlayerAnims(textureKey);
     const startX = CHAPTER5_MAP_DATA.spawn.x;
     const startY = CHAPTER5_MAP_DATA.spawn.y;
     this.player = this.physics.add.sprite(startX, startY, textureKey, 0);
     this.player.setCollideWorldBounds(true);
     this.player.setSize(C5_FRAME_W * 0.5, C5_FRAME_H * 0.35);
     this.player.setOffset(C5_FRAME_W * 0.25, C5_FRAME_H * 0.6);
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
    // Only does anything during the Ask Well mini-game (see
    // handleAskKeyPress) - guarded internally rather than only being
    // listened for while that mode is active, same approach as ESC above.
    this.input.keyboard.on('keydown-E', () => this.handleAskKeyPress());
    // Same pattern for the explore beat - see handleExploreKeyPress.
    this.input.keyboard.on('keydown-E', () => this.handleExploreKeyPress());

// --- Ate Clara & Maya --- (real sprite sheets, same 44x78 grid
     // convention as hiraya-sheet/lola-sheet/donemilio-sheet/kapitanandres-sheet/
     // mangcarding-sheet - frame 0 is each of their down-facing idle poses).
     // Positioned relative to the map's own spawn point so they stay put in
     // the plaza clearing even if the exported map's spawn tile ever moves.
     this.ateClara = this.add.sprite(startX, startY - 62, 'ateclara-sheet', 0);
     this.maya = this.add.sprite(startX + 60, startY - 46, 'maya-sheet', 0).setFlipX(true);
     // Static collision bodies sized to almost the whole sprite (not just the
     // feet) so the player can't walk into/overlap Ate Clara or Maya from any
     // side - top, bottom, or left/right. NOTE: Phaser's setSize(w, h, center)
     // only takes 3 params - passing a 4th offset value here used to silently
     // do nothing, and the truthy 3rd value made it auto-center the box in
     // the middle of the sprite instead, which is why the player used to be
     // able to walk in as far as waist/chest before colliding. setOffset()
     // must be called separately, after setSize(..., false) disables the
     // auto-centering.
     this.physics.add.existing(this.ateClara, true);
     this.ateClara.body.setSize(C5_FRAME_W * 0.6, C5_FRAME_H * 0.85, false);
     this.ateClara.body.setOffset(C5_FRAME_W * 0.2, C5_FRAME_H * 0.08);
     this.physics.add.existing(this.maya, true);
     this.maya.body.setSize(C5_FRAME_W * 0.6, C5_FRAME_H * 0.85, false);
     this.maya.body.setOffset(C5_FRAME_W * 0.2, C5_FRAME_H * 0.08);
     this.physics.add.collider(this.player, [this.ateClara, this.maya]);
     // Ensure Ate Clara and Maya render below player
     this.ateClara.setDepth(0);
     this.maya.setDepth(0);

     // "Report back" step - once all 4 landmarks are found the player has to
     // walk back and press E on Ate Clara or Maya before the next dialogue
     // starts (same idea as Chapter1Scene's returnFlag / reportDone with
     // Lola). The ❗ flags sit above each host and only show while a report
     // is pending - see onAllTracesFound() / finishExploration().
     this.reportDone = false;
     this.returnFlags = [this.ateClara, this.maya].map(n =>
       this.add.text(n.x, n.y - 60, '❗', { fontSize: 26 })
         .setOrigin(0.5).setDepth(100000).setVisible(false));

    // --- cameo NPCs (see CHAPTER5_CAMEO_NPCS) - Lola/Don Emilio/Kapitan
    // Andres/Mang Carding standing around the plaza, static frame 0 only,
    // same collider treatment as Ate Clara/Maya above so the player can't
    // walk through them, but no dialogue wired up - purely a background
    // cameo for the final chapter.
    this.cameoObstacles = CHAPTER5_CAMEO_NPCS.map(n => {
      const spr = this.add.sprite(n.x, n.y, n.sheet, 0).setFlipX(!!n.flip).setDepth(n.y);
      this.physics.add.existing(spr, true);
      spr.body.setSize(C5_FRAME_W * 0.6, C5_FRAME_H * 0.85, false);
      spr.body.setOffset(C5_FRAME_W * 0.2, C5_FRAME_H * 0.08);
      return spr;
    });
    this.physics.add.collider(this.player, this.cameoObstacles);

    // --- everyone the player can talk to during the explore beat: the two
    // hosts plus the four cameos (see CHAPTER5_HOST_TALK / CHAPTER5_CAMEO_NPCS
    // for what each says).
    this.npcTalks = [
      { sprite: this.ateClara, ...CHAPTER5_HOST_TALK.ateClara },
      { sprite: this.maya, ...CHAPTER5_HOST_TALK.maya },
      ...CHAPTER5_CAMEO_NPCS.map((n, i) => ({
        sprite: this.cameoObstacles[i], name: n.name, lines: n.lines, portraits: n.portraits
      }))
    ];

    // --- 4 "Traces of Today" landmarks to find (see CHAPTER5_EXPLORE_SPOTS)
    // - pulled out of the plain decor loop below by exact x/y match so they
    // render as interactables (prompt + info popup on E) instead of static
    // scenery, same technique Chapter1Scene.js uses for CHAPTER1_QUEST_KEYS.
    const exploreCoordKey = (x, y) => `${x},${y}`;
    const exploreSpotCoords = new Set(CHAPTER5_EXPLORE_SPOTS.map(s => exploreCoordKey(s.x, s.y)));
    this.exploreObjects = CHAPTER5_EXPLORE_SPOTS.map(spot => {
      const srcObj = CHAPTER5_MAP_DATA.objects.find(o => o.x === spot.x && o.y === spot.y);
      const trad = CHAPTER5_TRADITIONS.find(t => t.key === spot.tradKey);
      // Display size: an explicit spot.w/h wins; otherwise match whatever
      // size the old tent object was, so existing spots look the same as
      // before until you tweak them.
      const w = spot.w || (srcObj ? srcObj.w : 64), h = spot.h || (srcObj ? srcObj.h : 64);
      // Use the real tradition icon art (same PNG the popup/matching-game
      // shows) as the on-map sprite too, sized to fit the spot's original
      // footprint; only fall back to the plaza's generic tent if that icon
      // somehow isn't loaded, and to a plain placeholder box after that.
      const iconTexKey = CHAPTER5_ICON_TEXTURE(spot.tradKey);
      const hasIconArt = this.textures.exists(iconTexKey);
      const hasTentImage = srcObj && this.textures.exists(srcObj.key);
      const vis = hasIconArt
        ? this.add.image(spot.x, spot.y, iconTexKey).setDisplaySize(w, h)
        : hasTentImage
          ? this.add.image(spot.x, spot.y, srcObj.key).setDisplaySize(w, h)
          : this.add.rectangle(spot.x, spot.y, w, h, 0x8a6a3a).setStrokeStyle(2, 0xf5e2c8);
      vis.setDepth(spot.y);
      this.physics.add.existing(vis, true);
      // The static body defaults to the source texture's native size (e.g.
      // 256x256 for the icon art), not the setDisplaySize() we just applied
      // - so without this it collides as a huge invisible box way bigger
      // than what's actually drawn, and the player can never get close
      // enough to trigger "Press E". This resyncs the body to match what's
      // really on screen.
      vis.body.updateFromGameObject();
      return {
        key: trad.key, name: trad.name, info: trad.desc,
        iconKey: hasIconArt ? iconTexKey : null,
        x: spot.x, y: spot.y, found: false, rect: vis,
        promptY: spot.y - h / 2 - 12
      };
    });
    this.physics.add.collider(this.player, this.exploreObjects.map(o => o.rect));

    // --- decorative scenery (houses, plants, tents, benches, boxes, etc.
    // placed in the map editor) --- purely visual, except collidable ones
    // also get a static physics body so the player can't just walk through
    // a house or a tent. The 4 tents used as explore landmarks above are
    // skipped here so they aren't rendered twice.
    this.decorObstacles = [];
    CHAPTER5_MAP_DATA.objects
      .filter(o => !exploreSpotCoords.has(exploreCoordKey(o.x, o.y)))
      .forEach(o => {
        const hasImage = this.textures.exists(o.key);
        let vis;
        if (hasImage) {
          vis = this.add.image(o.x, o.y, o.key).setDisplaySize(o.w, o.h);
        } else {
          vis = this.add.rectangle(o.x, o.y, o.w, o.h, chapter5HexToInt(o.color, 0x888888));
        }
        vis.setDepth(o.y);
        // Trees (CHAPTER5_TREE_KEYS) and the extra props in
        // CHAPTER5_SOLID_DECOR_KEYS block the player too, even though the
        // exported JSON has them as collidable: false.
        if (o.collidable || CHAPTER5_TREE_KEYS.has(o.key) || CHAPTER5_SOLID_DECOR_KEYS.has(o.key)) {
          this.physics.add.existing(vis, true);
          // Same fix as the explore landmarks above: if this object's
          // exported w/h (from the map editor) differs at all from its
          // source texture's native size, the static body defaults to the
          // texture's native size instead of what's actually drawn - giving
          // an invisible collider bigger (or offset) than the visible
          // sprite, which is exactly what blocks the player from getting
          // close enough to interact with something like a house/kiosk.
          if (hasImage) vis.body.updateFromGameObject();
          this.decorObstacles.push(vis);
        }
      });
    this.physics.add.collider(this.player, this.decorObstacles);

    // --- ambient pond ducks (see C5_DUCK_AREA) - purely scenery: they
    // wander, spook away from the player, and never block or affect the
    // story flow.
    this.createAmbientDucks();

    // Generic "near a landmark" hint for the explore beat - repositioned
    // each frame above whichever unfound landmark the player is closest to.
    // Same look/approach as Chapter1Scene's interactPrompt.
    this.interactPrompt = this.add.text(0, 0, 'Press E to look', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false).setDepth(100000);

    // --- HUD --- (scrollFactor 0 so it stays pinned to the screen instead
    // of scrolling away with the map now that the camera follows the player)
    // Depth 10200/10201: has to clear the player (10000, see setDepth above)
    // and every y-sorted world object - including the explore landmarks,
    // which can sit as deep as y=976 (Santa Marta Shrine) - or the HUD gets
    // drawn behind whatever's in front on screen at that moment. Still below
    // the 10400+ modals/popups so those keep covering the HUD as expected.
    const HUD_DEPTH = 10200, HUD_LABEL_DEPTH = 10201;
    const displayName = character.charAt(0).toUpperCase() + character.slice(1);
    this.add.text(14, 12, displayName, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 18, color: '#fff8e7'
    }).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(HUD_DEPTH);

    this.add.text(width / 2, 16, 'Chapter 5: A Living Heritage', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 16, color: '#f5e2c8'
    }).setOrigin(0.5, 0).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(HUD_DEPTH);

    // one shared progress readout, re-labeled per phase (see updateProgress)
    this.progressText = this.add.text(width / 2, 38, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#f5e2c8'
    }).setOrigin(0.5, 0).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(HUD_DEPTH);

    // Wooden-Gold UI icon pack - same plank button used for Start
    // Adventure/Chapters on the Main Menu (see createWoodButton in ui.js),
    // sized down to fit the gameplay HUD.
    const journalBtn = createWoodButton(this, 66, height - 30, 'Journal', () => {
      if (!this.locked && this.mode !== 'done') {
        this.locked = true;
        this.showJournalModal();
      }
    }, { width: 130, height: 40, fontSize: 14 });
    journalBtn.image.setScrollFactor(0).setDepth(HUD_DEPTH);
    journalBtn.txt.setScrollFactor(0).setDepth(HUD_LABEL_DEPTH);

    const menuBtn = createWoodButton(this, width - 66, height - 30, 'Menu', () => {
      if (!this.locked) { this.locked = true; showPauseMenu(this); }
    }, { width: 130, height: 40, fontSize: 14 });
    menuBtn.image.setScrollFactor(0).setDepth(HUD_DEPTH);
    menuBtn.txt.setScrollFactor(0).setDepth(HUD_LABEL_DEPTH);

    // Task button (top-right, same spot/size as Chapters 1-3) - opens the
    // objectives panel listing the 4 traces to find. Stays hidden until
    // Ate Clara and Maya have actually given the task (see
    // startExploration), and only responds during the explore beat, the one
    // phase that has a to-do list; the later phases are modal/timed and
    // announce themselves.
    const taskBtn = createWoodButton(this, width - 84, 27, 'Task', () => {
      if (this.mode === 'explore' && !this.locked) {
        this.locked = true;
        this.showObjectivesModal();
      }
    }, { width: 150, height: 40, fontSize: 15 });
    this.taskBtnRect = taskBtn.image.setScrollFactor(0).setDepth(HUD_DEPTH);
    this.taskBtnTxt = taskBtn.txt.setScrollFactor(0).setDepth(HUD_LABEL_DEPTH);
    this.taskBtnRect.setVisible(false);
    this.taskBtnTxt.setVisible(false);
    this.updateProgress();

    this.add.text(width / 2, height - 12, 'WASD to move · E to interact · Esc for menu', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#9aa0aa'
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(HUD_DEPTH);

    // The matching mini-game's card/slot divs and their drag listeners are
    // created in startMatchingGame() / buildMatchOverlayDom(). Registered
    // here so leaving the scene mid-game (ESC, Menu button) always cleans
    // up the DOM overlay instead of leaving an orphaned div behind.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanupMatchOverlay());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.cleanupMatchOverlay());

    // --- curtain-open reveal - opening dialogue waits for it to finish ---
    this.locked = true;
    curtainOpen(this, () => {
      showDialogue(this, 'Ate Clara', [
        "Oh, hello! You must be the one going around collecting Lola Nena's stories.",
        "I'm Ate Clara. Around here, I try to keep an eye on the old traditions so they don't get forgotten.",
        "Pateros isn't only its history, you know. Some of it is still alive today, you just have to know where to look."
      ], () => {
        showDialogue(this, 'Maya', [
          "Hi! I'm Maya. Ate Clara's been teaching me all this since I was little.",
          "I used to think it was kind of boring, if I'm honest. Now I get why it matters.",
          "Before anything else, go take a look around the plaza. Alfombra, Pandangguhan, balut, Santa Marta, all four are still out there today, if you know where to look.",
          "Come find them, then we'll match everything up."
        ], () => this.startExploration(), ['maya-wave', 'maya-happy', 'maya-wink', 'maya-happy']);
      }, ['ate-clara-wave', 'ate-clara-happy', 'ate-clara-wink']);
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

  // Task list for the HUD counter / objectives modal: the 4 plaza landmarks
  // from the explore beat (Maya names all four in her intro, so unlike
  // Chapter 3's hidden objects they're listed by name from the start).
  // The 4 landmarks, plus a 5th "Report to Ate Clara & Maya" task that only
  // appears once all 4 are found (goes 4/4 -> 4/5, then 5/5 once you've
  // talked to them) - same shape as Chapter 1's report-to-Lola task.
  getTaskList() {
    const list = this.exploreObjects.map(o => ({ name: o.name, found: o.found, info: o.info, iconKey: o.iconKey, type: 'item' }));
    if (this.exploreObjects.every(o => o.found)) {
      list.push({
        name: 'Report to Ate & Maya',
        found: this.reportDone,
        info: 'Walk back to Ate Clara and Maya and press E to tell them what you found.',
        type: 'task'
      });
    }
    return list;
  }

  // Shared top-center readout, re-labeled for whichever phase is active.
  updateProgress() {
    const tasks = this.getTaskList();
    const doneCount = tasks.filter(t => t.found).length;
    if (this.taskBtnTxt) this.taskBtnTxt.setText(`Task (${doneCount}/${tasks.length})`);

    if (!this.progressText) return;
    if (this.mode === 'explore') {
      // "Found x/y" readout under the title is hidden on purpose - the Task
      // button's own counter already shows the same progress.
      this.progressText.setText('');
    } else if (this.mode === 'matching') {
      this.progressText.setText(`Matched: ${this.matchedCount || 0}/${CHAPTER5_TRADITIONS.length}`);
    } else if (this.mode === 'askwell') {
      this.progressText.setText(`Asked: ${this.askIndex}/${CHAPTER5_ASKWELL.length}`);
    } else {
      this.progressText.setText('');
    }
  }

  // --- Objectives modal: which of the 4 traces are found -----------------
  // Same panel as Chapters 1-3's Task button. Hovering a found row pops up
  // what was learned from it.
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
    const allTracesFound = this.exploreObjects.every(o => o.found);
    const subtitle = this.add.text(width / 2, top + 50,
      allTracesFound ? 'All found \u2014 now report back to Ate Clara and Maya:' : 'Find the four traditions still alive in the plaza:', {
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
      const mark = this.add.text(width / 2 - 172, y, found ? '\u2713' : '\u2014', {
        fontFamily: '"Tildunk", sans-serif', fontSize: 16, fontStyle: 'bold',
        color: found ? '#3c7a3e' : '#9aa0aa'
      }).setOrigin(0, 0.5);
      const label = this.add.text(width / 2 - 118, y, (t.type === 'item' && !found) ? '???' : t.name, {
        fontFamily: '"Tildunk", sans-serif', fontSize: 15,
        color: found ? '#3c7a3e' : '#3b2410'
      }).setOrigin(0, 0.5);
      const status = this.add.text(width / 2 + 150, y, found
        ? (t.type === 'task' ? 'Done' : 'Found')
        : (t.type === 'task' ? 'Go talk to them' : 'Not found'), {
        fontFamily: '"Tildunk", sans-serif', fontSize: 11,
        color: found ? '#3c7a3e' : '#9aa0aa'
      }).setOrigin(1, 0.5);
      container.add([mark, label, status]);

      // Tradition icon: full color once found, a dark silhouette until then.
      if (t.iconKey && this.textures.exists(t.iconKey)) {
        const ic = this.add.image(width / 2 - 140, y, t.iconKey);
        ic.setScale(26 / Math.max(ic.width, ic.height));
        if (!found) ic.setTint(0x2a1a0c).setAlpha(0.4);
        container.add(ic);
      }

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

  // ==========================================================================
  // EXPLORE - "Traces of Today" (find the 4 landmarks, see
  // CHAPTER5_EXPLORE_SPOTS above). Same walk-up-and-press-E loop
  // Chapter1Scene.js uses for its 5 river-life objects, just scoped down to
  // 4 stops and run before the matching game instead of before a quiz.
  // ==========================================================================
  startExploration() {
    this.mode = 'explore';
    this.locked = false;
    // The task has now actually been given - reveal the Task button.
    this.taskBtnRect.setVisible(true);
    this.taskBtnTxt.setVisible(true);
    this.updateProgress();
  }

  nearestExploreInteractable() {
    const p = this.player;
    let best = null, bestDist = OBJECT_INTERACT_REACH;
    // Measured to the landmark's edge (not its centre) so a 100x100 sprite
    // can be interacted with equally from the top, bottom, left and right.
    this.exploreObjects.forEach(o => {
      if (o.found) return;
      const d = interactGapToObject(p, o.rect);
      if (d < bestDist) { best = o; bestDist = d; }
    });
    return best;
  }

  handleExploreKeyPress() {
    if (this.mode !== 'explore' || this.locked) return;
    // Landmarks (the actual objective) win over chatting if both are in reach.
    const nearest = this.nearestExploreInteractable();
    if (nearest) { this.interactWithExploreObject(nearest); return; }
    const npc = this.nearestTalkNpc();
    if (!npc) return;
    // All 4 found: talking to either host is the "report back" step.
    if (this.isReportTarget(npc)) { this.finishExploration(); return; }
    this.talkToNpc(npc);
  }

  // True while the 4 landmarks are all found but the player hasn't walked
  // back to report yet.
  isReportPending() {
    return this.mode === 'explore' && !this.reportDone && this.exploreObjects.every(o => o.found);
  }

  // Ate Clara and Maya are who you report to (the four cameo NPCs aren't).
  isReportTarget(npc) {
    return this.isReportPending() && (npc.sprite === this.ateClara || npc.sprite === this.maya);
  }

  // Closest NPC within INTERACT_RADIUS (the shared reach from Chapter1Scene.js
  // that the landmarks and Chapters 1-3 use too). Static bodies keep the
  // player ~25-68px from an NPC's centre depending on the side they approach
  // from, so 80 reaches from every direction.
  nearestTalkNpc() {
    if (!this.npcTalks) return null;
    const p = this.player;
    let best = null, bestDist = INTERACT_RADIUS;
    this.npcTalks.forEach(n => {
      const d = Phaser.Math.Distance.Between(p.x, p.y, n.sprite.x, n.sprite.y);
      if (d < bestDist) { best = n; bestDist = d; }
    });
    return best;
  }

  // Simple talk: freeze the player, show the NPC's lines, unfreeze. No
  // story state changes - the chapter flow is untouched.
  talkToNpc(npc) {
    this.locked = true;
    this.interactPrompt.setVisible(false);
    const lines = typeof npc.lines === 'function' ? npc.lines(this) : npc.lines;
    showDialogue(this, npc.name, lines, () => { this.locked = false; }, npc.portraits);
  }

  // "Found it" popup for a landmark. Same cream/maroon panel as the journal
  // reward modal, with the tradition's icon on top and a Continue button
  // (E / Space / Enter close it too). Falls back to the shared
  // showInfoPopup() when the icon PNG isn't there, so a missing file can
  // never block the explore beat. `onClose` runs exactly once, on dismiss.
  showTraceFoundPopup(o, onClose) {
    SoundManager.play(this, 'found');

    if (!o.iconKey || !this.textures.exists(o.iconKey)) {
      showInfoPopup(this, o.name.toUpperCase(), o.info, onClose);
      return;
    }
    const { width, height } = this.scale;
    const iconSize = Phaser.Math.Clamp(height - 300, 96, 160);
    const panelW = 500;
    const panelH = iconSize + 250;
    const top = height / 2 - panelH / 2;

    const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, panelW, panelH, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);

    const iconY = top + 32 + iconSize / 2;
    const plate = this.add.rectangle(width / 2, iconY, iconSize + 20, iconSize + 20, 0xf5e2c8, 1).setStrokeStyle(3, 0xd8b04a);
    const icon = this.add.image(width / 2, iconY, o.iconKey);
    const iconScale = iconSize / Math.max(icon.width, icon.height);
    icon.setScale(iconScale * 0.6);
    this.tweens.add({ targets: icon, scale: iconScale, duration: 260, ease: 'Back.Out' });

    const title = this.add.text(width / 2, top + iconSize + 64, o.name.toUpperCase(), {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    const info = this.add.text(width / 2, top + iconSize + 92, o.info, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#3b2410', align: 'center',
      wordWrap: { width: panelW - 60 }
    }).setOrigin(0.5, 0);

    container.add([overlay, panel, plate, icon, title, info]);

    let closed = false;
    const closeKeys = ['keydown-E', 'keydown-SPACE', 'keydown-ENTER'];
    const close = () => {
      if (closed) return;
      closed = true;
      closeKeys.forEach(k => this.input.keyboard.off(k, close));
      container.destroy();
      if (onClose) onClose();
    };

    const { rect, txt } = createButton(this, width / 2, top + panelH - 36, 'Continue', close,
      { width: 190, height: 44, fontSize: 17, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);

    // Keyboard dismiss is armed after a beat so the very E press that opened
    // the popup can't close it again in the same breath.
    this.time.delayedCall(250, () => {
      if (!closed) closeKeys.forEach(k => this.input.keyboard.on(k, close));
    });
  }

  interactWithExploreObject(o) {
    this.locked = true;
    this.showTraceFoundPopup(o, () => {
      o.found = true;
      o.rect.setAlpha(0.55);
      this.updateProgress();
      this.locked = false;
      if (this.exploreObjects.every(x => x.found)) this.onAllTracesFound();
    });
  }

  // All 4 landmarks found: don't jump straight into dialogue. Show the ❗
  // over Ate Clara and Maya and a toast, then wait for the player to walk
  // back and press E on one of them (see handleExploreKeyPress), same as
  // Chapter 1's "Talk to Lola Nena" step. Movement stays free meanwhile.
  onAllTracesFound() {
    this.returnFlags.forEach(f => f.setVisible(true));
    this.updateProgress();
    if (typeof showToast === 'function') showToast(this, 'Report to Ate Clara and Maya');
  }

  // The report itself - runs when the player talks to Ate Clara or Maya
  // after finding everything, then carries on into the matching game.
  finishExploration() {
    this.mode = 'between';
    this.locked = true;
    this.reportDone = true;
    this.returnFlags.forEach(f => f.setVisible(false));
    this.interactPrompt.setVisible(false);
    this.updateProgress();
    showDialogue(this, 'Maya', [
      "Found all four! See, it's not just old stories, it's still happening around us."
    ], () => this.startMatchingGame(), ['maya-happy']);
  }

  // ==========================================================================
  // MINI-GAME - "Keep the Story Alive" (drag-and-drop matching)
  // 4 term cards on the left, 4 (shuffled) description slots on the right.
  // Drag a card onto its matching slot; a correct drop locks the card in
  // place, a miss just bounces the card back to where it started. Per the
  // doc: "This is basically a drag-and-drop matching game. Very easy to
  // develop. But educational."
  //
  // IMPLEMENTATION NOTE: built with real HTML <div> elements layered on top
  // of the Phaser <canvas>, not Phaser GameObjects. Phaser's Container +
  // setDraggable() approach kept misbehaving here because this scene's
  // camera scrolls to follow the player while the modal itself is pinned to
  // the screen (scrollFactor(0)) - pointer-based DOM dragging sidesteps
  // that completely, since it never touches Phaser's camera/input math.
  // Everything else in the chapter (dialogue, quiz, journal modal, map,
  // player movement) is untouched and still Phaser-only.
  // ==========================================================================
  startMatchingGame() {
    this.mode = 'matching';
    this.locked = true;
    this.matchedCount = 0;
    this.updateProgress();
    this.buildMatchOverlayDom();
  }

  // Builds the DOM overlay: a fixed-position div sized/positioned to match
  // the game canvas's actual on-screen bounding rect, containing a centered
  // panel with draggable card divs and static slot divs. The panel uses a
  // fixed 820x570 layout (same numbers as the old Phaser version) and is
  // scaled down with a CSS transform if the canvas is narrower than that.
  buildMatchOverlayDom() {
    const CARD_W = 220, CARD_H = 60;
    const SLOT_W = 280, SLOT_H = 72;
    this.MATCH_CARD_W = CARD_W;
    this.MATCH_CARD_H = CARD_H;

    const overlay = document.createElement('div');
    overlay.id = 'c5-match-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      background: 'rgba(0,0,0,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10000'
    });

    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'relative',
      width: '820px',
      height: '570px',
      background: '#fff8e7',
      border: '4px solid #9c3b2e',
      borderRadius: '4px',
      boxSizing: 'border-box',
      transformOrigin: 'center center',
      flex: '0 0 auto'
    });

    const title = document.createElement('div');
    title.textContent = 'Keep the Story Alive';
    Object.assign(title.style, {
      position: 'absolute', top: '22px', left: '0', right: '0',
      textAlign: 'center', color: '#9c3b2e', fontWeight: 'bold',
      fontFamily: '"Tildunk", Georgia, serif', fontSize: '21px'
    });

    const subtitle = document.createElement('div');
    subtitle.textContent = 'Drag each card onto the tradition it belongs to.';
    Object.assign(subtitle.style, {
      position: 'absolute', top: '54px', left: '0', right: '0',
      textAlign: 'center', color: '#6b4a2f', fontFamily: '"Tildunk", sans-serif', fontSize: '13px'
    });

    // NOTE: this modal deliberately has no close/exit button. It's a locked
    // modal - the Phaser "Menu" button and the ESC pause menu are already
    // unreachable/blocked while it's open (this.locked is true for the whole
    // activity, and this DOM overlay sits above the canvas) - so the only
    // way forward is to match all four cards (see finishMatchingGame).

    panel.appendChild(title);
    panel.appendChild(subtitle);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    this.matchOverlayEl = overlay;
    this.matchPanelEl = panel;

    // --- layout (panel-relative coordinates, mirrors the old Phaser numbers) ---
    const panelW = 820;
    const leftX = panelW / 2 - 250;   // card column center-x
    const rightX = panelW / 2 + 210;  // slot column center-x
    const startY = 150;
    const gapY = 112;

    // terms (draggable cards) and slots (drop targets) are shuffled
    // independently so the layout never gives the answer away for free.
    const terms = Phaser.Utils.Array.Shuffle(CHAPTER5_TRADITIONS.slice());
    const slotsData = Phaser.Utils.Array.Shuffle(CHAPTER5_TRADITIONS.slice());

    this.matchCardEls = [];
    this.matchSlotEls = [];

    slotsData.forEach((s, i) => {
      const cy = startY + i * gapY;
      const slot = document.createElement('div');
      slot.textContent = s.desc;
      Object.assign(slot.style, {
        position: 'absolute',
        left: `${rightX - SLOT_W / 2}px`,
        top: `${cy - SLOT_H / 2}px`,
        width: `${SLOT_W}px`,
        height: `${SLOT_H}px`,
        boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '6px',
        background: 'rgba(255,255,255,0.5)',
        border: '2px solid #6b4a2f',
        color: '#3b2410', fontFamily: '"Tildunk", sans-serif', fontSize: '12px',
        transition: 'background 0.15s ease-out'
      });
      panel.appendChild(slot);
      this.matchSlotEls.push({ el: slot, key: s.key, cx: rightX, cy, filled: false });
    });

    terms.forEach((t, i) => {
      const cy = startY + i * gapY;
      const card = document.createElement('div');
      // Icon + name (the slots on the right stay text-only so the icon
      // never gives the answer away). If the PNG is missing the <img> just
      // removes itself and the card looks exactly like it used to.
      const iconImg = document.createElement('img');
      iconImg.src = CHAPTER5_ICON_PATH(t.key);
      iconImg.alt = '';
      iconImg.draggable = false;
      Object.assign(iconImg.style, {
        width: '44px', height: '44px', objectFit: 'contain', flexShrink: '0',
        marginRight: '8px', pointerEvents: 'none', userSelect: 'none'
      });
      iconImg.onerror = () => iconImg.remove();
      const nameSpan = document.createElement('span');
      nameSpan.textContent = t.name;
      card.append(iconImg, nameSpan);
      card.dataset.key = t.key;
      Object.assign(card.style, {
        position: 'absolute',
        left: `${leftX - CARD_W / 2}px`,
        top: `${cy - CARD_H / 2}px`,
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '6px',
        background: '#9c3b2e',
        border: '2px solid #f5e2c8',
        color: '#fff8e7', fontWeight: 'bold',
        fontFamily: '"Tildunk", Georgia, serif', fontSize: '15px',
        cursor: 'grab', userSelect: 'none', touchAction: 'none',
        transition: 'left 0.22s ease-out, top 0.22s ease-out, height 0.22s ease-out'
      });
      card.homeLeft = leftX - CARD_W / 2;
      card.homeTop = cy - CARD_H / 2;
      card.matched = false;
      panel.appendChild(card);
      this.matchCardEls.push(card);
      this.wireCardDrag(card);
    });

    this.positionMatchOverlay();
    this._matchResizeHandler = () => this.positionMatchOverlay();
    window.addEventListener('resize', this._matchResizeHandler);
    this.scale.on('resize', this._matchResizeHandler);
  }

  // Keeps the DOM overlay aligned with the game canvas's actual on-screen
  // position/size (accounts for CSS scaling of the canvas, e.g. Phaser
  // Scale.FIT), and shrinks the fixed-size panel via CSS transform if the
  // canvas is too small to show it at full size.
  positionMatchOverlay() {
    if (!this.matchOverlayEl) return;
    const rect = this.sys.game.canvas.getBoundingClientRect();
    Object.assign(this.matchOverlayEl.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });
    const scale = Math.min(1, (rect.width - 40) / 820, (rect.height - 40) / 570);
    this.matchScale = scale > 0 ? scale : 1;
    if (this.matchPanelEl) this.matchPanelEl.style.transform = `scale(${this.matchScale})`;
  }

  // Pointer-based drag (deliberately not the native HTML5 drag/drop API -
  // that API is unreliable on touch devices and fires far fewer
  // intermediate move events). setPointerCapture keeps move/up events
  // firing on this exact element even if the pointer moves faster than the
  // browser can hit-test each frame, or slides off the card mid-drag.
  wireCardDrag(card) {
    let startClientX = 0, startClientY = 0, startLeft = 0, startTop = 0;

    const onPointerMove = (e) => {
      const scale = this.matchScale || 1;
      const dx = (e.clientX - startClientX) / scale;
      const dy = (e.clientY - startClientY) / scale;
      card.style.left = `${startLeft + dx}px`;
      card.style.top = `${startTop + dy}px`;
    };

    const onPointerUp = (e) => {
      card.releasePointerCapture(e.pointerId);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerup', onPointerUp);
      card.style.cursor = card.matched ? 'default' : 'grab';
      card.style.transition = 'left 0.22s ease-out, top 0.22s ease-out';
      this.resolveCardDrop(card);
    };

    const onPointerDown = (e) => {
      if (card.matched) return;
      card.setPointerCapture(e.pointerId);
      startClientX = e.clientX;
      startClientY = e.clientY;
      startLeft = parseFloat(card.style.left);
      startTop = parseFloat(card.style.top);
      card.style.transition = 'none';
      card.style.zIndex = '10';
      card.style.cursor = 'grabbing';
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerup', onPointerUp);
    };

    card.addEventListener('pointerdown', onPointerDown);
    card._cleanupDrag = () => {
      card.removeEventListener('pointerdown', onPointerDown);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerup', onPointerUp);
    };
  }

  // Snaps a dropped card into whichever slot its center is closest to
  // (within range); a correct match locks it in place, anything else - a
  // miss, or no slot nearby at all - tweens the card back to its start spot
  // (via the CSS transition set on the card, re-enabled in onPointerUp).
  resolveCardDrop(card) {
    const cardW = this.MATCH_CARD_W, cardH = this.MATCH_CARD_H;
    const cx = parseFloat(card.style.left) + cardW / 2;
    const cy = parseFloat(card.style.top) + cardH / 2;
    const DROP_RADIUS = 80;

    let target = null;
    this.matchSlotEls.forEach(slot => {
      if (slot.filled) return;
      const d = Math.hypot(cx - slot.cx, cy - slot.cy);
      if (d < DROP_RADIUS) target = slot;
    });

    if (!target) {
      card.style.left = `${card.homeLeft}px`;
      card.style.top = `${card.homeTop}px`;
      return;
    }

    if (target.key === card.dataset.key) {
      card.matched = true;
      target.filled = true;
      card.style.left = `${target.cx - cardW / 2}px`;
      // Rows are only gapY (82px) apart and a slot is already 72px tall, so
      // there's only ~10px of genuinely free space between one slot and the
      // next. Docking the still-full-size card there (the old -50 offset)
      // meant it dipped ~16px into its own slot's text AND ~34px into the
      // slot above it - "blocking the [description] boxes", per the report.
      // Once matched the card no longer needs to be a full drag target, so
      // shrink it to a compact tag first, then park it just above its own
      // slot with a small deliberate overlap (like the dialogue box's name
      // tag) - and nowhere near the slot above.
      const matchedCardH = 32;
      card.style.height = `${matchedCardH}px`;
      card.style.top = `${target.cy - 62}px`;
      card.style.background = '#3c7a3e';
      card.style.pointerEvents = 'none';
      // the compact matched tag is only 32px tall - shrink the icon to fit
      const cardIcon = card.querySelector('img');
      if (cardIcon) Object.assign(cardIcon.style, { width: '16px', height: '16px', marginRight: '6px' });
      card._cleanupDrag && card._cleanupDrag();
      target.el.style.background = 'rgba(60,122,62,0.22)';
      target.el.style.border = '3px solid #3c7a3e';

      this.matchedCount++;
      this.updateProgress();
      if (this.matchedCount >= CHAPTER5_TRADITIONS.length) {
        this.time.delayedCall(500, () => this.finishMatchingGame());
      }
    } else {
      target.el.style.background = 'rgba(194,74,56,0.3)';
      this.time.delayedCall(280, () => {
        if (!target.filled) target.el.style.background = 'rgba(255,255,255,0.5)';
      });
      card.style.left = `${card.homeLeft}px`;
      card.style.top = `${card.homeTop}px`;
    }
  }

  // Tears down the DOM overlay and its listeners. Safe to call more than
  // once (normal completion via finishMatchingGame, plus the scene's
  // shutdown/destroy hooks in create()) since every step checks the element
  // still exists first, so leaving the scene never strands an orphaned
  // overlay div behind.
  cleanupMatchOverlay() {
    if (this._matchResizeHandler) {
      window.removeEventListener('resize', this._matchResizeHandler);
      this.scale.off('resize', this._matchResizeHandler);
      this._matchResizeHandler = null;
    }
    if (this.matchCardEls) {
      this.matchCardEls.forEach(card => card._cleanupDrag && card._cleanupDrag());
      this.matchCardEls = null;
    }
    this.matchSlotEls = null;
    if (this.matchOverlayEl) {
      this.matchOverlayEl.remove();
      this.matchOverlayEl = null;
      this.matchPanelEl = null;
    }
  }

  finishMatchingGame() {
    this.cleanupMatchOverlay();
    this.mode = 'between';
    this.updateProgress();
    showDialogue(this, 'Ate Clara', [
      'Perfect. Alfombra, Pandangguhan, balut, Santa Marta, all still part of life here, if you know where to look.',
      "None of it survives on its own, though. It survives because people keep choosing to pass it on."
    ], () => {
      showDialogue(this, 'Maya', [
        "That's kind of the whole point, actually, knowing how to ask, and to listen.",
        "Try this with me before Ate Clara quizzes you."
      ], () => this.startAskWell(), ['maya-happy', 'maya-wink']);
    }, ['ate-clara-wink', 'ate-clara-happy']);
  }

  // ==========================================================================
  // MINI-GAME 2 - Ask Well (see CHAPTER5_ASKWELL above)
  // ==========================================================================
  startAskWell() {
    this.mode = 'askwell';
    this.askIndex = 0;
    this.askScore = 0;
    this.locked = false; // real-time now - the player walks the plaza to catch a spark
    this.updateProgress();
    this.buildAskWellHud();
    this.startAskRound();
  }

  // One persistent pinned banner (situation text + hint + timer bar),
  // relabeled each round by startAskRound() rather than rebuilt from
  // scratch - the sparks themselves are what changes round to round.
  buildAskWellHud() {
    const { width } = this.scale;
    const bannerW = Math.min(600, width - 40);
    this.askHudContainer = this.add.container(0, 0).setDepth(9000).setScrollFactor(0);

    const bannerBg = this.add.rectangle(width / 2, 76, bannerW, 108, 0x1c1207, 0.72).setStrokeStyle(2, 0x9c3b2e);
    this.askSituationTxt = this.add.text(width / 2, 44, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', align: 'center',
      wordWrap: { width: bannerW - 40 }
    }).setOrigin(0.5, 0);
    this.askHintTxt = this.add.text(width / 2, 98, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, fontStyle: 'bold', color: '#d8b04a'
    }).setOrigin(0.5, 0);

    const barW = Math.min(360, bannerW - 80), barH = 8;
    this.askTimerBg = this.add.rectangle(width / 2, 120, barW, barH, 0x000000, 0.5).setStrokeStyle(1, 0xf5e2c8);
    this.askTimerFill = this.add.rectangle(width / 2 - barW / 2, 120, barW, barH - 2, 0xd8b04a, 1).setOrigin(0, 0.5);
    this.askTimerBarW = barW;

    this.askHudContainer.add([bannerBg, this.askSituationTxt, this.askHintTxt, this.askTimerBg, this.askTimerFill]);
  }

  startAskRound() {
    this.askRoundResolved = false;
    const round = CHAPTER5_ASKWELL[this.askIndex];
    this.updateProgress();
    this.askSituationTxt.setText(round.situation);
    this.askHintTxt.setText('Walk to the spark that fits, then press E').setColor('#d8b04a');
    this.askTimeLeft = CHAPTER5_ASKWELL_ROUND_MS;
    this.askTimerFill.width = this.askTimerBarW;
    this.askTimerFill.setFillStyle(0xd8b04a);
    this._askNearestInRange = null;
    this.spawnAskSparks(round);
  }

  // Each option becomes a small floating card near Ate Clara/Maya - a soft
  // glow behind a card with the option's line on it. updateAskWell() below
  // gives each one a gentle, independent bob so they read as "alive"
  // rather than pinned in place, without drifting so far the text becomes
  // hard to read while chasing it.
  spawnAskSparks(round) {
    const startX = CHAPTER5_MAP_DATA.spawn.x;
    const startY = CHAPTER5_MAP_DATA.spawn.y;
    const n = round.options.length;
    const spacing = 190;

    this.askSparks = round.options.map((opt, i) => {
      const anchorX = startX + (i - (n - 1) / 2) * spacing;
      const anchorY = startY - 130;
      const container = this.add.container(anchorX, anchorY).setDepth(500);
      const glow = this.add.circle(0, 0, 36, 0xd8b04a, 0.2);
      const bg = this.add.rectangle(0, 0, 176, 60, 0xfff8e7, 0.96).setStrokeStyle(3, 0x9c3b2e);
      const label = this.add.text(0, 0, opt.label, {
        fontFamily: '"Tildunk", sans-serif', fontSize: 11, color: '#3b2410', align: 'center',
        wordWrap: { width: 156 }
      }).setOrigin(0.5);
      container.add([glow, bg, label]);
      return { key: opt.key, container, glow, bg, anchorX, anchorY, t: 0, phase: i * 2.4 };
    });
  }

  cleanupAskSparks() {
    if (this.askSparks) {
      this.askSparks.forEach(s => s.container.destroy());
      this.askSparks = null;
    }
  }

  // Drives the sparks' bob motion, the round timer, and the "close enough
  // to ask" highlight - called every frame from update() while
  // mode === 'askwell'.
  updateAskWell(time, delta) {
    if (!this.askSparks || this.askRoundResolved) return;

    this.askTimeLeft -= delta;
    const frac = Phaser.Math.Clamp(this.askTimeLeft / CHAPTER5_ASKWELL_ROUND_MS, 0, 1);
    this.askTimerFill.width = this.askTimerBarW * frac;
    this.askTimerFill.setFillStyle(frac < 0.25 ? 0xc24a38 : 0xd8b04a);
    if (this.askTimeLeft <= 0) {
      this.resolveAskRound(null); // the moment passed - no pick
      return;
    }

    let nearest = null, nearestDist = Infinity;
    this.askSparks.forEach(spark => {
      spark.t += delta;
      const x = spark.anchorX + Math.sin(spark.t / 900 + spark.phase) * 16;
      const y = spark.anchorY + Math.cos(spark.t / 1300 + spark.phase * 1.6) * 12;
      spark.container.setPosition(x, y);
      spark.glow.setScale(1 + Math.sin(spark.t / 500 + spark.phase) * 0.1);

      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y);
      if (d < nearestDist) { nearestDist = d; nearest = spark; }
    });

    const inRange = !!nearest && nearestDist < CHAPTER5_ASKWELL_CATCH_RADIUS;
    this.askSparks.forEach(s => s.bg.setStrokeStyle(3, inRange && s === nearest ? 0xd8b04a : 0x9c3b2e));
    this.askHintTxt.setText(inRange ? 'Press E to ask this' : 'Walk to the spark that fits, then press E')
      .setColor(inRange ? '#3c7a3e' : '#d8b04a');
    this._askNearestInRange = inRange ? nearest : null;
  }

  // Bound to keydown-E in create() - only does anything mid-round while
  // standing close enough to a spark.
  handleAskKeyPress() {
    if (this.mode !== 'askwell' || this.locked || this.askRoundResolved || !this._askNearestInRange) return;
    this.resolveAskRound(this._askNearestInRange.key);
  }

  // selectedKey is null on a timeout. Either way: freeze the sparks in
  // their resolved colors for a beat, then bring up the same
  // verdict+explanation+Continue shape the old click version used.
  resolveAskRound(selectedKey) {
    this.askRoundResolved = true;
    const round = CHAPTER5_ASKWELL[this.askIndex];
    const isCorrect = selectedKey === round.correct;
    if (isCorrect) this.askScore++;
    SoundManager.play(this, isCorrect ? 'correct' : 'incorrect');

    this.askSparks.forEach(s => {
      if (s.key === round.correct) s.bg.setFillStyle(0x3c7a3e, 0.95);
      else if (s.key === selectedKey) s.bg.setFillStyle(0xc24a38, 0.95);
      else s.bg.setFillStyle(0x9c3b2e, 0.35);
    });

    if (this.player.body) this.player.setVelocity(0, 0);
    this.locked = true; // hold still for the explanation beat
    this.time.delayedCall(650, () => this.showAskExplanation(round, selectedKey, isCorrect));
  }

  showAskExplanation(round, selectedKey, isCorrect) {
    const { width, height } = this.scale;
    const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, 480, 240, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);

    const verdictLabel = selectedKey === null ? 'The moment passed.' : (isCorrect ? 'That opens things up.' : 'That tends to close people off.');
    const verdict = this.add.text(width / 2, height / 2 - 78, verdictLabel, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 17, fontStyle: 'bold',
      color: isCorrect ? '#3c7a3e' : '#9c3b2e'
    }).setOrigin(0.5);
    const explanationTxt = this.add.text(width / 2, height / 2 - 46, round.explanation, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#3b2410', align: 'center',
      wordWrap: { width: 420 }
    }).setOrigin(0.5, 0);
    container.add([overlay, panel, verdict, explanationTxt]);

    const { rect, txt } = createButton(this, width / 2, height / 2 + 88, 'Continue', () => {
      container.destroy();
      this.cleanupAskSparks();
      this.askIndex++;
      if (this.askIndex < CHAPTER5_ASKWELL.length) {
        this.locked = false;
        this.startAskRound();
      } else {
        this.finishAskWell();
      }
    }, { width: 150, height: 38, fontSize: 15, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);
  }

  finishAskWell() {
    this.locked = true;
    if (this.askHudContainer) { this.askHudContainer.destroy(); this.askHudContainer = null; }
    this.updateProgress();
    showDialogue(this, 'Maya', [
      "I think I get it now, it's not just about knowing the facts.",
      "Let's see how much of it stuck, three quick questions."
    ], () => this.startQuiz(), ['maya-happy', 'maya-wink']);
  }

  // --- End-of-chapter quiz -------------------------------------------------
  startQuiz() {
    this.mode = 'quiz';
    this.updateProgress();
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizQuestions = [
      {
        q: 'Who does Maya represent in this chapter?',
        options: ['The younger generation carrying traditions forward', 'A Spanish colonial official', 'A revolutionary soldier', 'A fisherman from Barrio Aguho'],
        correct: 0,
        explanation: "Maya represents the younger generation - someone learning to value traditions she once found boring."
      },
      {
        q: "What craft does Alfombra-making represent in Pateros' living heritage?",
        options: ['Traditional slipper-making', 'Duck-raising', 'Weaving', 'Boat-building'],
        correct: 0,
        explanation: 'Alfombra is a slipper-making tradition of Pateros. The name is Spanish for carpet.'
      },
      {
        q: 'What is Pandangguhan a tradition associated with?',
        options: ['Santa Marta', "Pateros' founding as a municipality", 'The Philippine Revolution', 'Alfombra slipper-making'],
        correct: 0,
        explanation: 'The Pandangguhan is a dance parade held each February in honor of Santa Marta.'
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
    const qNum = this.add.text(width / 2, height / 2 - 154, `Question ${this.quizIndex + 1} / ${this.quizQuestions.length}`, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#9c3b2e'
    }).setOrigin(0.5);
    const qText = this.add.text(width / 2, height / 2 - 128, qData.q, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 19, color: '#3b2410', align: 'center',
      wordWrap: { width: 460 }
    }).setOrigin(0.5, 0);

    container.add([overlay, panel, qNum, qText]);

    const optionButtons = [];
    qData.options.forEach((opt, i) => {
      const y = height / 2 - 50 + i * 42;
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
    const verdict = this.add.text(width / 2, height / 2 + 106, isCorrect ? 'Correct!' : 'Not quite.', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 17, fontStyle: 'bold',
      color: isCorrect ? '#3c7a3e' : '#9c3b2e'
    }).setOrigin(0.5);
    const explanationTxt = this.add.text(width / 2, height / 2 + 128, qData.explanation || '', {
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
    this.mode = 'chapterdone';
    this.updateProgress();
    const pages = this.registry.get('journalPages') || [];
    if (!pages.includes(5)) pages.push(5);
    this.registry.set('journalPages', pages);
    // Persist the page too, so it is still readable after a reload.
    ChapterProgress.addJournalPage(5);
    // No chapter comes after Chapter 5, but this keeps the pattern
    // consistent in case a future chapter is added to CHAPTER_ORDER.
    ChapterProgress.unlockNextAfter('Chapter5');

    // A short wrap-up from Ate Clara before the reward panel, so this last
    // chapter closes out like the rest of the conversation instead of
    // cutting straight to a modal the instant the quiz ends - fitting,
    // since this is the one that sends the player back to the plaza for
    // the ending sequence.
    this.locked = true;
    showDialogue(this, 'Ate Clara', [
      'You have all five pages now, the river, the town, the revolution, the ducks, and today.',
      'Go on back to the plaza. I think it is time you saw the whole journal, together.'
    ], () => this.showJournalReward(), ['ate-clara-happy', 'ate-clara-wink']);
  }

  showJournalReward() {
const { width, height } = this.scale;
     const container = this.add.container(0, 0).setDepth(10500).setScrollFactor(0);
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55).setInteractive().setScrollFactor(0);
    const panel = this.add.rectangle(width / 2, height / 2, 460, 240, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    const title = this.add.text(width / 2, height / 2 - 80, 'Journal Page #5 Unlocked!', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    const scoreTxt = this.add.text(width / 2, height / 2 - 34, `You remembered ${this.quizScore} / ${this.quizQuestions.length}.`, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#3b2410'
    }).setOrigin(0.5);
    const flavor = this.add.text(width / 2, height / 2, 'A Living Heritage - recorded in the journal. Only one page was ever missing.', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 14, color: '#6b4a2f', align: 'center', wordWrap: { width: 380 }
    }).setOrigin(0.5, 0);

    container.add([overlay, panel, title, scoreTxt, flavor]);

    const { rect, txt } = createButton(this, width / 2 + 95, height / 2 + 88, 'Continue', () => {
      // The doc's final beat happens back at the plaza, not here in the
      // Heritage Square - PrologueScene picks up the "Restore the Journal"
      // reflection + final title card when it sees this flag (see its
      // playEndingSequence()).
      container.destroy();
      this.registry.set('gameEnding', true);
      curtainClose(this, () => this.scene.start('Prologue'));
    }, { width: 170, height: 44, fontSize: 17, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    container.add([rect, txt]);

    // Lets the player read the page they just collected before moving on.
    JournalBook.addReadButton(this, container, 5, width / 2 - 95, height / 2 + 88, { width: 170, height: 44, fontSize: 16 });
  }

  // --------------------------------------------------------------------
  // Ambient pond ducks. Not a mini-game (that's Chapter 4) - just life in
  // the plaza: each duck wanders in short bursts with pauses, scoots away
  // when the player gets close, faces the way it's moving, and stays inside
  // C5_DUCK_AREA. They ignore the map's solid tiles on purpose so they can
  // paddle across the (solid-to-the-player) pond.
  // --------------------------------------------------------------------
  createAmbientDucks() {
    const hasSheet = this.textures.exists('duck_walk');
    if (!hasSheet) {
      console.warn('Chapter5Scene: duck_walk spritesheet missing (assets/icons/duck-walk.png) - falling back to emoji ducks');
    }
    this.ambientDucks = C5_DUCK_START.map(pos => {
      const sprite = hasSheet
        ? this.add.sprite(pos.x, pos.y, 'duck_walk', 0).setOrigin(0.5).setScale(C5_DUCK_SCALE)
        : this.add.text(pos.x, pos.y, '\u{1F986}', { fontSize: 26 }).setOrigin(0.5);
      sprite.setDepth(pos.y); // y-sorted with the decor; the player stays on top at 10000
      this.physics.add.existing(sprite);
      sprite.body.setCircle(12, sprite.width / 2 - 12, sprite.height / 2 - 12);
      return {
        sprite,
        // stagger first moves so the flock doesn't start in lockstep
        nextWanderAt: this.time.now + Phaser.Math.Between(0, C5_DUCK_WANDER_MAX_MS)
      };
    });
  }

  updateAmbientDucks(time) {
    if (!this.ambientDucks) return;
    const a = C5_DUCK_AREA;
    const cx = (a.left + a.right) / 2;
    const cy = (a.top + a.bottom) / 2;
    const EDGE = 28; // within this of an edge, wander picks a direction back inward

    this.ambientDucks.forEach(duck => {
      const s = duck.sprite;
      if (!s.body) return;

      const distToPlayer = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
      if (distToPlayer < C5_DUCK_FLEE_RADIUS) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, s.x, s.y);
        s.body.setVelocity(Math.cos(angle) * C5_DUCK_FLEE_SPEED, Math.sin(angle) * C5_DUCK_FLEE_SPEED);
        duck.nextWanderAt = time + Phaser.Math.Between(C5_DUCK_WANDER_MIN_MS, C5_DUCK_WANDER_MAX_MS);
      } else if (time > duck.nextWanderAt) {
        if (Math.random() < 0.3) {
          // a pause - ducks bobbing in place by the water read as natural
          s.body.setVelocity(0, 0);
        } else {
          const nearEdge = s.x < a.left + EDGE || s.x > a.right - EDGE || s.y < a.top + EDGE || s.y > a.bottom - EDGE;
          const wanderAngle = nearEdge
            ? Phaser.Math.Angle.Between(s.x, s.y, cx, cy) + Phaser.Math.FloatBetween(-0.8, 0.8)
            : Math.random() * Math.PI * 2;
          s.body.setVelocity(Math.cos(wanderAngle) * C5_DUCK_WANDER_SPEED, Math.sin(wanderAngle) * C5_DUCK_WANDER_SPEED);
        }
        duck.nextWanderAt = time + Phaser.Math.Between(C5_DUCK_WANDER_MIN_MS, C5_DUCK_WANDER_MAX_MS);
      }

      // Stay inside the duck area: cancel any velocity pointing out of it
      // (the fleeing case included, so a cornered duck slides along the edge
      // instead of leaving the pond).
      let vx = s.body.velocity.x;
      let vy = s.body.velocity.y;
      if ((s.x <= a.left && vx < 0) || (s.x >= a.right && vx > 0)) vx = 0;
      if ((s.y <= a.top && vy < 0) || (s.y >= a.bottom && vy > 0)) vy = 0;
      if (vx !== s.body.velocity.x || vy !== s.body.velocity.y) s.body.setVelocity(vx, vy);

      // Face the direction of travel (dead zone around 0 so a duck moving
      // mostly up/down doesn't flicker on tiny horizontal jitter).
      if (typeof s.setFlipX === 'function') {
        if (vx > C5_DUCK_FLIP_THRESHOLD) s.setFlipX(C5_DUCK_ART_FACES_LEFT_BY_DEFAULT);
        else if (vx < -C5_DUCK_FLIP_THRESHOLD) s.setFlipX(!C5_DUCK_ART_FACES_LEFT_BY_DEFAULT);
      }

      // Walk cycle only while actually moving; frame 0 during pauses.
      if (typeof s.play === 'function' && s.anims) {
        if (s.body.speed > C5_DUCK_MOVE_THRESHOLD) {
          s.play('duck-walk', true);
        } else if (s.anims.isPlaying) {
          s.anims.stop();
          s.setFrame(0);
        }
      }

      s.setDepth(s.y);
    });
  }

  update(time, delta) {
    // Ducks live regardless of story mode or dialogue/quiz locks - they're
    // background life, so they keep paddling even while the player is
    // reading a popup.
    this.updateAmbientDucks(time);

    // Ask Well is the one real-time phase in this chapter: the player
    // actually walks the plaza to catch a spark, so it runs alongside the
    // normal movement code below rather than freezing the player like
    // matching/quiz do.
    if (this.mode === 'askwell' && !this.locked) {
      this.updateAskWell(time, delta);
    }

    // Explore beat: show "Press E to look" above whichever unfound
    // landmark the player is nearest to, same approach as Chapter1Scene's
    // interactPrompt.
    if (this.mode === 'explore' && !this.locked) {
      const nearest = this.nearestExploreInteractable();
      const npc = nearest ? null : this.nearestTalkNpc();
      if (nearest) {
        this.interactPrompt.setText('Press E to look').setPosition(nearest.x, nearest.promptY).setVisible(true);
      } else if (npc) {
        // While a report is pending the prompt sits higher so it doesn't
        // cover the ❗ flag over the host.
        const reporting = this.isReportTarget(npc);
        this.interactPrompt.setText(reporting ? 'Press E to report' : 'Press E to talk')
          .setPosition(npc.sprite.x, npc.sprite.y - (reporting ? 92 : C5_FRAME_H / 2 + 14)).setVisible(true);
      } else {
        this.interactPrompt.setVisible(false);
      }
    } else {
      this.interactPrompt.setVisible(false);
    }

    if (this.locked || this.mode === 'matching' || this.mode === 'quiz' || this.mode === 'epilogue' || this.mode === 'done') {
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