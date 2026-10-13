// Prologue Scene - Introduction to the story and first task
const PROLOGUE_FRAME_W = 44;
const PROLOGUE_FRAME_H = 78;

// ---------------------------------------------------------------------------
// MAP DATA - exported straight from the map editor (editor.html -> "Export
// JSON" for the prologue_town_plaza map). This is a verbatim copy of that
// JSON; re-export from the editor and paste the object over this one any
// time the plaza layout changes, no other code below needs to change as
// long as new tile/object keys still follow the editor's normal
// "<prefix>_<number>" naming (see resolveTileImagePath / resolveObjectImagePath).
// ---------------------------------------------------------------------------
const PROLOGUE_MAP_DATA = {
  "name": "prologue_town_plaza",
  "cols": 40,
  "rows": 25,
  "tileSize": 32,
  "spawn": {
    "col": 20,
    "row": 23,
    "x": 656,
    "y": 752
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
      "name": "groundPath_09",
      "color": "#888888",
      "solid": false,
      "imageKey": "groundPath_09"
    },
    "7": {
      "name": "specialGround_01",
      "color": "#888888",
      "solid": false,
      "imageKey": "specialGround_01"
    }
  },
  "tiles": [
    "5555555555555555555555555555555555555555",
    "5000000000000000000000000000000000000005",
    "5033333333333333333333333333333333333305",
    "5030000000000000000000000000000000000305",
    "5030066666666666666666666666666666600305",
    "5030066777777777776666777777777776600305",
    "5030066700000000076666700000000076600305",
    "5030066703333333076666703333333076600305",
    "5030066703000003076666703000003076600305",
    "5030066703000003076666703000003076600305",
    "5030066703000003076666703000003076600305",
    "5030066703333333076666703333333076600305",
    "5030066700000000076666700000000076600305",
    "5030066777777777776666777777777776600305",
    "5030066666666666666666666666666666600305",
    "5030066666666666666666666666666666600305",
    "5030066777777777776666777777777776600305",
    "5030066700000000076666700000000076600305",
    "5030066700000000076666700000000076600305",
    "5030066777777777776666777777777776600305",
    "5030066666666666666666666666666666600305",
    "5030066666666666666666666666666666600305",
    "5033333333333333336666333333333333333305",
    "5000000000000000006666000000000000000005",
    "5555555555555555556666555555555555555555"
  ],
  "objects": [
    {
      "key": "well",
      "name": "Well",
      "col": 12,
      "row": 10,
      "x": 400,
      "y": 336,
      "w": 46,
      "h": 46,
      "color": "#8b4513",
      "collidable": true,
      "info": "Wells like this once served whole neighborhoods in Philippine towns, before piped water reached every home."
    },
    {
      "key": "stall",
      "name": "Market Stall",
      "col": 28,
      "row": 8,
      "x": 896,
      "y": 280,
      "w": 46,
      "h": 46,
      "color": "#cd853f",
      "collidable": false,
      "info": "Pateros grew up as a river trading port, so market stalls have long been part of its story."
    },
    {
      "key": "statue",
      "name": "Statue",
      "col": 20,
      "row": 15,
      "x": 640,
      "y": 480,
      "w": 46,
      "h": 46,
      "color": "#a0522d",
      "collidable": true,
      "info": "Monuments in Pateros remember its heroes, like the 1922 monument to the Martires del '96."
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 1,
      "row": 24,
      "x": 48,
      "y": 784,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_2",
      "name": "House 2",
      "col": 0,
      "row": 18,
      "x": 16,
      "y": 592,
      "w": 156,
      "h": 135,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_4",
      "name": "House 4",
      "col": 0,
      "row": 11,
      "x": 16,
      "y": 368,
      "w": 154,
      "h": 149,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 1,
      "row": 4,
      "x": 48,
      "y": 144,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 2,
      "row": 14,
      "x": 80,
      "y": 464,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 2,
      "row": 15,
      "x": 80,
      "y": 496,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 2,
      "row": 20,
      "x": 80,
      "y": 656,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 2,
      "row": 21,
      "x": 80,
      "y": 688,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 2,
      "row": 7,
      "x": 80,
      "y": 240,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 2,
      "row": 8,
      "x": 80,
      "y": 272,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_16",
      "name": "Plants 16",
      "col": 2,
      "row": 1,
      "x": 80,
      "y": 48,
      "w": 35,
      "h": 47,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_decor_9",
      "name": "Decor 9",
      "col": 3,
      "row": 24,
      "x": 112,
      "y": 784,
      "w": 16,
      "h": 40,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_decor_9",
      "name": "Decor 9",
      "col": 1,
      "row": 21,
      "x": 48,
      "y": 688,
      "w": 16,
      "h": 40,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_decor_9",
      "name": "Decor 9",
      "col": 1,
      "row": 14,
      "x": 48,
      "y": 464,
      "w": 16,
      "h": 40,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_decor_9",
      "name": "Decor 9",
      "col": 1,
      "row": 7,
      "x": 48,
      "y": 240,
      "w": 16,
      "h": 40,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 0,
      "row": 21,
      "x": 16,
      "y": 688,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 0,
      "row": 15,
      "x": 16,
      "y": 496,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 0,
      "row": 14,
      "x": 16,
      "y": 464,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 0,
      "row": 8,
      "x": 16,
      "y": 272,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 0,
      "row": 7,
      "x": 16,
      "y": 240,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_lamp_1",
      "name": "Lamp 1",
      "col": 17,
      "row": 22,
      "x": 560,
      "y": 720,
      "w": 30,
      "h": 80,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_lamp_1",
      "name": "Lamp 1",
      "col": 22,
      "row": 22,
      "x": 720,
      "y": 720,
      "w": 30,
      "h": 80,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_lamp_1",
      "name": "Lamp 1",
      "col": 5,
      "row": 22,
      "x": 176,
      "y": 720,
      "w": 30,
      "h": 80,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_lamp_1",
      "name": "Lamp 1",
      "col": 5,
      "row": 13,
      "x": 176,
      "y": 432,
      "w": 30,
      "h": 80,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_lamp_1",
      "name": "Lamp 1",
      "col": 5,
      "row": 4,
      "x": 176,
      "y": 144,
      "w": 30,
      "h": 80,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_lamp_1",
      "name": "Lamp 1",
      "col": 34,
      "row": 4,
      "x": 1104,
      "y": 144,
      "w": 30,
      "h": 80,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_lamp_1",
      "name": "Lamp 1",
      "col": 34,
      "row": 13,
      "x": 1104,
      "y": 432,
      "w": 30,
      "h": 80,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_lamp_1",
      "name": "Lamp 1",
      "col": 34,
      "row": 22,
      "x": 1104,
      "y": 720,
      "w": 30,
      "h": 80,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 39,
      "row": 23,
      "x": 1264,
      "y": 752,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_2",
      "name": "House 2",
      "col": 39,
      "row": 17,
      "x": 1264,
      "y": 560,
      "w": 156,
      "h": 135,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_3",
      "name": "House 3",
      "col": 39,
      "row": 10,
      "x": 1264,
      "y": 336,
      "w": 147,
      "h": 157,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_house_1",
      "name": "House 1",
      "col": 39,
      "row": 4,
      "x": 1264,
      "y": 144,
      "w": 116,
      "h": 112,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_11",
      "name": "Plants 11",
      "col": 37,
      "row": 13,
      "x": 1200,
      "y": 432,
      "w": 17,
      "h": 20,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_13",
      "name": "Plants 13",
      "col": 37,
      "row": 14,
      "x": 1200,
      "y": 464,
      "w": 27,
      "h": 36,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_85",
      "name": "Plants 85",
      "col": 37,
      "row": 20,
      "x": 1200,
      "y": 656,
      "w": 29,
      "h": 30,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_85",
      "name": "Plants 85",
      "col": 37,
      "row": 21,
      "x": 1200,
      "y": 688,
      "w": 29,
      "h": 30,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_85",
      "name": "Plants 85",
      "col": 37,
      "row": 7,
      "x": 1200,
      "y": 240,
      "w": 29,
      "h": 30,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_85",
      "name": "Plants 85",
      "col": 37,
      "row": 2,
      "x": 1200,
      "y": 80,
      "w": 29,
      "h": 30,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_141",
      "name": "Plants 141",
      "col": 39,
      "row": 14,
      "x": 1264,
      "y": 464,
      "w": 31,
      "h": 14,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_141",
      "name": "Plants 141",
      "col": 39,
      "row": 13,
      "x": 1264,
      "y": 432,
      "w": 31,
      "h": 14,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_144",
      "name": "Plants 144",
      "col": 38,
      "row": 6,
      "x": 1232,
      "y": 208,
      "w": 25,
      "h": 34,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_144",
      "name": "Plants 144",
      "col": 38,
      "row": 7,
      "x": 1232,
      "y": 240,
      "w": 25,
      "h": 34,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_145",
      "name": "Plants 145",
      "col": 39,
      "row": 20,
      "x": 1264,
      "y": 656,
      "w": 9,
      "h": 6,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_145",
      "name": "Plants 145",
      "col": 38,
      "row": 20,
      "x": 1232,
      "y": 656,
      "w": 9,
      "h": 6,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_145",
      "name": "Plants 145",
      "col": 39,
      "row": 20,
      "x": 1264,
      "y": 656,
      "w": 9,
      "h": 6,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_145",
      "name": "Plants 145",
      "col": 38,
      "row": 20,
      "x": 1232,
      "y": 656,
      "w": 9,
      "h": 6,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_145",
      "name": "Plants 145",
      "col": 39,
      "row": 20,
      "x": 1264,
      "y": 656,
      "w": 9,
      "h": 6,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_146",
      "name": "Plants 146",
      "col": 37,
      "row": 4,
      "x": 1200,
      "y": 144,
      "w": 6,
      "h": 9,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_151",
      "name": "Plants 151",
      "col": 39,
      "row": 1,
      "x": 1264,
      "y": 48,
      "w": 9,
      "h": 9,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_plant_151",
      "name": "Plants 151",
      "col": 39,
      "row": 1,
      "x": 1264,
      "y": 48,
      "w": 9,
      "h": 9,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 0,
      "row": 0,
      "x": 16,
      "y": 16,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 0,
      "row": 1,
      "x": 16,
      "y": 48,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 0,
      "row": 2,
      "x": 16,
      "y": 80,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 39,
      "row": 7,
      "x": 1264,
      "y": 240,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 39,
      "row": 6,
      "x": 1264,
      "y": 208,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 39,
      "row": 1,
      "x": 1264,
      "y": 48,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 38,
      "row": 14,
      "x": 1232,
      "y": 464,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 38,
      "row": 21,
      "x": 1232,
      "y": 688,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_shadow_5",
      "name": "Shadow 5",
      "col": 39,
      "row": 21,
      "x": 1264,
      "y": 688,
      "w": 55,
      "h": 44,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_bench_1",
      "name": "Bench 1",
      "col": 7,
      "row": 16,
      "x": 240,
      "y": 528,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_2",
      "name": "Bench 2",
      "col": 11,
      "row": 16,
      "x": 368,
      "y": 528,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_3",
      "name": "Bench 3",
      "col": 7,
      "row": 19,
      "x": 240,
      "y": 624,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_4",
      "name": "Bench 4",
      "col": 11,
      "row": 19,
      "x": 368,
      "y": 624,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_1",
      "name": "Bench 1",
      "col": 28,
      "row": 16,
      "x": 912,
      "y": 528,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_2",
      "name": "Bench 2",
      "col": 32,
      "row": 16,
      "x": 1040,
      "y": 528,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_3",
      "name": "Bench 3",
      "col": 28,
      "row": 19,
      "x": 912,
      "y": 624,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_4",
      "name": "Bench 4",
      "col": 32,
      "row": 19,
      "x": 1040,
      "y": 624,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_2",
      "name": "Tent 2",
      "col": 7,
      "row": 24,
      "x": 240,
      "y": 784,
      "w": 64,
      "h": 61,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_3",
      "name": "Tent 3",
      "col": 11,
      "row": 24,
      "x": 368,
      "y": 784,
      "w": 65,
      "h": 62,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_1",
      "name": "Tent 1",
      "col": 15,
      "row": 24,
      "x": 496,
      "y": 784,
      "w": 73,
      "h": 65,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_1",
      "name": "Tent 1",
      "col": 24,
      "row": 24,
      "x": 784,
      "y": 784,
      "w": 73,
      "h": 65,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_2",
      "name": "Tent 2",
      "col": 28,
      "row": 24,
      "x": 912,
      "y": 784,
      "w": 64,
      "h": 61,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_3",
      "name": "Tent 3",
      "col": 32,
      "row": 24,
      "x": 1040,
      "y": 784,
      "w": 65,
      "h": 62,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_1",
      "name": "Tent 1",
      "col": 5,
      "row": 1,
      "x": 176,
      "y": 48,
      "w": 73,
      "h": 65,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_2",
      "name": "Tent 2",
      "col": 9,
      "row": 1,
      "x": 304,
      "y": 48,
      "w": 64,
      "h": 61,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_3",
      "name": "Tent 3",
      "col": 13,
      "row": 1,
      "x": 432,
      "y": 48,
      "w": 65,
      "h": 62,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_4",
      "name": "Tent 4",
      "col": 19,
      "row": 1,
      "x": 624,
      "y": 48,
      "w": 64,
      "h": 71,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_1",
      "name": "Tent 1",
      "col": 24,
      "row": 1,
      "x": 784,
      "y": 48,
      "w": 73,
      "h": 65,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_tent_2",
      "name": "Tent 2",
      "col": 29,
      "row": 1,
      "x": 944,
      "y": 48,
      "w": 64,
      "h": 61,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_road1grass_12",
      "name": "Road1 Grass 12",
      "col": 9,
      "row": 18,
      "x": 304,
      "y": 592,
      "w": 64,
      "h": 48,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_road1grass_12",
      "name": "Road1 Grass 12",
      "col": 30,
      "row": 18,
      "x": 976,
      "y": 592,
      "w": 64,
      "h": 48,
      "color": "#888888",
      "collidable": false,
      "info": ""
    },
    {
      "key": "obj_bench_1",
      "name": "Bench 1",
      "col": 7,
      "row": 5,
      "x": 240,
      "y": 176,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_3",
      "name": "Bench 3",
      "col": 7,
      "row": 13,
      "x": 240,
      "y": 432,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_2",
      "name": "Bench 2",
      "col": 16,
      "row": 5,
      "x": 528,
      "y": 176,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_4",
      "name": "Bench 4",
      "col": 16,
      "row": 13,
      "x": 528,
      "y": 432,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_4",
      "name": "Bench 4",
      "col": 32,
      "row": 13,
      "x": 1040,
      "y": 432,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_2",
      "name": "Bench 2",
      "col": 32,
      "row": 5,
      "x": 1040,
      "y": 176,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_3",
      "name": "Bench 3",
      "col": 23,
      "row": 13,
      "x": 752,
      "y": 432,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_bench_1",
      "name": "Bench 1",
      "col": 23,
      "row": 5,
      "x": 752,
      "y": 176,
      "w": 50,
      "h": 50,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_vegetation_1",
      "name": "Vegetation 1",
      "col": 6,
      "row": 7,
      "x": 208,
      "y": 240,
      "w": 30,
      "h": 30,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_vegetation_1",
      "name": "Vegetation 1",
      "col": 6,
      "row": 10,
      "x": 208,
      "y": 336,
      "w": 30,
      "h": 30,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_vegetation_1",
      "name": "Vegetation 1",
      "col": 34,
      "row": 7,
      "x": 1104,
      "y": 240,
      "w": 30,
      "h": 30,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_vegetation_1",
      "name": "Vegetation 1",
      "col": 34,
      "row": 10,
      "x": 1104,
      "y": 336,
      "w": 30,
      "h": 30,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_3",
      "name": "Box 3",
      "col": 31,
      "row": 2,
      "x": 1008,
      "y": 80,
      "w": 16,
      "h": 21,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_3",
      "name": "Box 3",
      "col": 31,
      "row": 1,
      "x": 1008,
      "y": 48,
      "w": 16,
      "h": 21,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_3",
      "name": "Box 3",
      "col": 15,
      "row": 1,
      "x": 496,
      "y": 48,
      "w": 16,
      "h": 21,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_3",
      "name": "Box 3",
      "col": 21,
      "row": 1,
      "x": 688,
      "y": 48,
      "w": 16,
      "h": 21,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_3",
      "name": "Box 3",
      "col": 11,
      "row": 2,
      "x": 368,
      "y": 80,
      "w": 16,
      "h": 21,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_3",
      "name": "Box 3",
      "col": 38,
      "row": 1,
      "x": 1232,
      "y": 48,
      "w": 16,
      "h": 21,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_2",
      "name": "Box 2",
      "col": 7,
      "row": 1,
      "x": 240,
      "y": 48,
      "w": 20,
      "h": 22,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_2",
      "name": "Box 2",
      "col": 16,
      "row": 1,
      "x": 528,
      "y": 48,
      "w": 20,
      "h": 22,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_2",
      "name": "Box 2",
      "col": 9,
      "row": 24,
      "x": 304,
      "y": 784,
      "w": 20,
      "h": 22,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_4",
      "name": "Box 4",
      "col": 26,
      "row": 24,
      "x": 848,
      "y": 784,
      "w": 16,
      "h": 22,
      "color": "#888888",
      "collidable": true,
      "info": ""
    },
    {
      "key": "obj_box_5",
      "name": "Box 5",
      "col": 30,
      "row": 24,
      "x": 976,
      "y": 784,
      "w": 18,
      "h": 25,
      "color": "#888888",
      "collidable": true,
      "info": ""
    }
  ]
};

// The 3 "landmark" objects Hiraya needs to find are placed in the editor
// like any other object, just with these specific keys so this scene can
// pick them out of PROLOGUE_MAP_DATA.objects and wire up the find/interact
// logic below. Everything else in .objects is treated as non-interactive
// scenery (houses, plants, benches, lamps, etc).
const PROLOGUE_QUEST_KEYS = ['well', 'stall', 'statue'];

// Real art for the 3 landmarks above (see preload() - loaded separately
// since PROLOGUE_QUEST_KEYS is excluded from the generic object loader).
// Sizes keep each icon's native aspect ratio, scaled down from their
// source canvas to roughly the footprint the old placeholder box used.
const PROLOGUE_QUEST_ICONS = {
  well: { key: 'quest_well', w: 90, h: 112 },
  stall: { key: 'quest_market_stall', w: 100, h: 112 },
  statue: { key: 'quest_statue', w: 100, h: 120 }
};

// Same procedural tile painters mapLoader.js uses for the built-in tile
// types (grass/tree/water/path/sand/wall) - reused here so a tile type
// with no `imageKey` (e.g. this map's "wall") still gets real texture
// instead of a flat color fill, exactly like the editor's own preview does.
const PROLOGUE_BUILTIN_DRAWERS = {
  grass: drawGrass, tree: drawTree, water: drawWater,
  path: drawPath, sand: drawSand, wall: drawWall
};

// ---------------------------------------------------------------------------
// Asset-path resolvers - mirror editor.html's TILE_LIBRARY / OBJECT_LIBRARY
// naming so any tile/object key coming out of the map editor resolves to
// the right file under assets/src automatically, without needing a manual
// key->path table kept in sync by hand.
// ---------------------------------------------------------------------------
const PROLOGUE_TILE_KEY_SPECS = {
  fieldsTile: { dir: 'assets/src/1 Tiles', file: 'FieldsTile' },
  groundPath: { dir: 'assets/src/11 Ground Paths', file: 'GroundPath' },
  grassPathBlend: { dir: 'assets/src/12 Grass Path Blends', file: 'GrassPathBlend' },
  pathGrassBlend2: { dir: 'assets/src/13 Path Grass Blends 2', file: 'PathGrassBlend2' },
  specialGround: { dir: 'assets/src/14 Special Ground Patterns', file: 'SpecialGround' }
};
function resolveTileImagePath(key) {
  const m = key.match(/^(.+)_(\d+)$/);
  if (!m) return null;
  const spec = PROLOGUE_TILE_KEY_SPECS[m[1]];
  if (!spec) return null;
  return `${spec.dir}/${spec.file}_${m[2]}.png`;
}

const PROLOGUE_OBJECT_FOLDER_SPECS = {
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
function resolveObjectImagePath(key) {
  if (key === 'obj_towerspot1') return 'assets/src/2 Objects/PlaceForTower1.png';
  if (key === 'obj_towerspot2') return 'assets/src/2 Objects/PlaceForTower2.png';
  const fenceMatch = key.match(/^obj_fence_(\d+)$/);
  if (fenceMatch) return `assets/src/1.1 Tiles/Tile2_${fenceMatch[1]}.png`;
  const m = key.match(/^obj_([a-z0-9]+)_(\d+)$/);
  if (!m) return null;
  const spec = PROLOGUE_OBJECT_FOLDER_SPECS[m[1]];
  if (!spec) return null;
  return `${spec.base}/${spec.folder}/${m[2]}.png`;
}

function hexToInt(css, fallback) {
  if (!css) return fallback;
  const n = parseInt(css.replace('#', ''), 16);
  return Number.isNaN(n) ? fallback : n;
}

// Builds the tileTypes config loadMap() expects (see mapLoader.js) straight
// out of PROLOGUE_MAP_DATA.tileTypes: real art where an imageKey is given,
// the matching procedural painter otherwise.
function buildPrologueTileTypes(mapData) {
  const cfg = {};
  Object.entries(mapData.tileTypes).forEach(([id, t]) => {
    cfg[id] = {
      name: t.name,
      color: hexToInt(t.color, 0x888888),
      solid: !!t.solid,
      imageKey: t.imageKey || undefined,
      noFlipY: true, // real art tiles (and hand-painted trees) shouldn't mirror
      draw: t.imageKey ? undefined : PROLOGUE_BUILTIN_DRAWERS[t.name]
    };
  });
  return cfg;
}

class PrologueScene extends Phaser.Scene {
  constructor() {
    super('Prologue');
  }

  preload() {
    // Everything the plaza needs is derived straight from PROLOGUE_MAP_DATA:
    // load each tile type's image (if it has one) and each placed object's
    // image (if its key resolves to one under assets/src). Landmark keys
    // (well/stall/statue) aren't covered by that generic resolver, so their
    // icons are loaded explicitly below (see PROLOGUE_QUEST_ICONS).
    this.load.image('quest_well', 'assets/icons/obj-old-well.png');
    this.load.image('quest_market_stall', 'assets/icons/obj-market-stall.png');
    this.load.image('quest_statue', 'assets/icons/obj-statue.png');

    Object.values(PROLOGUE_MAP_DATA.tileTypes).forEach(t => {
      if (t.imageKey) {
        const path = resolveTileImagePath(t.imageKey);
        if (path) this.load.image(t.imageKey, path);
        else console.warn('PrologueScene: no path resolver for tile image key', t.imageKey);
      }
    });

    const loadedObjectKeys = new Set();
    PROLOGUE_MAP_DATA.objects.forEach(o => {
      if (PROLOGUE_QUEST_KEYS.includes(o.key)) return; // no art for these, by design
      if (loadedObjectKeys.has(o.key)) return;
      const path = resolveObjectImagePath(o.key);
      if (path) {
        this.load.image(o.key, path);
        loadedObjectKeys.add(o.key);
      } else {
        console.warn('PrologueScene: no path resolver for object key', o.key);
      }
    });
  }

  create() {
    SoundManager.playMusic(this, 'bg-game');
    const { width, height } = this.scale;
    const character = this.registry.get('selectedCharacter') || 'hiraya';
    const textureKey = character + '-sheet';
    this.prefix = character;
    this.speed = this.registry.get('playerSpeed') || 160;
    this.locked = false; // true during dialogue/popup
    this.objectsFound = 0;
    this.interactRadius = 80;

    // "Restore the Journal" doc beat: Chapter5Scene sets this flag and sends
    // the player back here instead of ending the game in the Heritage
    // Square. Consumed immediately so a later normal visit to the plaza
    // never gets stuck replaying the ending.
    const isEnding = this.registry.get('gameEnding') === true;
    this.isEnding = isEnding;
    if (isEnding) this.registry.set('gameEnding', false);

    // --- map (loaded from the editor's exported JSON, see PROLOGUE_MAP_DATA above) ---
    this.map = loadMap(this, PROLOGUE_MAP_DATA.tiles, {
      tileTypes: buildPrologueTileTypes(PROLOGUE_MAP_DATA)
    });

    // --- player ---
    this.createPlayerAnims(textureKey);
    // Start at the spawn point placed in the editor
    const startX = PROLOGUE_MAP_DATA.spawn.x;
    const startY = PROLOGUE_MAP_DATA.spawn.y;
    this.player = this.physics.add.sprite(startX, startY, textureKey, 0);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(PROLOGUE_FRAME_W * 0.5, PROLOGUE_FRAME_H * 0.35);
    this.player.setOffset(PROLOGUE_FRAME_W * 0.25, PROLOGUE_FRAME_H * 0.6);
    this.player.facing = 'down';
    // Ensure player renders above NPCs and objects
    this.player.setDepth(10000);
    this.physics.add.collider(this.player, this.map.obstacles);

    // Pokemon-style camera
    centerCameraOnPlayer(this, this.map, this.player);

    // --- input ---
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

    // --- Lola Nena ---
    // Place Lola near the center of the plaza
    this.lola = this.add.sprite(this.map.widthPx / 2, this.map.heightPx / 2 - 40, 'lola-sheet', 0);
    // Make Lola non-walkable by adding physics collision body (same as chapters 1-5)
    this.physics.add.existing(this.lola, true);
    this.lola.body.setSize(PROLOGUE_FRAME_W * 0.6, PROLOGUE_FRAME_H * 0.85, false);
    this.lola.body.setOffset(PROLOGUE_FRAME_W * 0.2, PROLOGUE_FRAME_H * 0.08);
    this.physics.add.collider(this.player, this.lola);
    // Ensure Lola renders below player
    this.lola.setDepth(0);
    this.lolaPrompt = this.add.text(this.lola.x, this.lola.y - 90, '', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false);
    // Generic "near a landmark" hint - repositioned each frame above
    // whichever quest object (well/stall/statue) the player is closest to.
    this.interactPrompt = this.add.text(0, 0, 'Press E to interact', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#fff8e7', backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false).setDepth(100000);
    this.returnFlag = this.add.text(this.lola.x, this.lola.y - 60, '❗', { fontSize: 26 })
      .setOrigin(0.5).setVisible(false);
    if (isEnding) this.lola.setVisible(false); // a quiet moment alone with the journal

    // --- Three landmark objects to find (well / stall / statue) ---
    // Pulled from PROLOGUE_MAP_DATA.objects by key, so position/color/info
    // all come straight from what was placed in the map editor.
    this.objects = PROLOGUE_MAP_DATA.objects
      .filter(o => PROLOGUE_QUEST_KEYS.includes(o.key))
      .map(o => ({
        key: o.key,
        name: o.name,
        x: o.x,
        y: o.y,
        color: hexToInt(o.color, 0x888888),
        info: o.info
      }));
    this.totalObjects = this.objects.length;

    // These 3 landmarks are solid (like a house or a bench) rather than
    // walk-over-able map decoration, so each gets a static physics body -
    // same technique as the decorObstacles below. Their name labels have
    // been removed in favor of a "Press E to interact" prompt (see
    // this.interactPrompt / update()) shown only while the player is near.
    this.questObstacles = [];
    this.objectSprites = this.objects.map(o => {
      const icon = PROLOGUE_QUEST_ICONS[o.key];
      const hasIcon = icon && this.textures.exists(icon.key);
      const rect = hasIcon
        ? this.add.image(o.x, o.y, icon.key).setDisplaySize(icon.w, icon.h).setDepth(o.y)
        : this.add.rectangle(o.x, o.y, 46, 46, o.color).setStrokeStyle(2, 0xf5e2c8).setDepth(o.y);
      this.physics.add.existing(rect, true);
      // Static bodies default to the texture's native size, not the
      // setDisplaySize() applied above - resync so the collision box
      // matches what's actually drawn (important for tightly-cropped art).
      if (rect.body && rect.body.updateFromGameObject) rect.body.updateFromGameObject();
      this.questObstacles.push(rect);
      o.found = false;
      o.rect = rect;
      o.promptY = o.y - (icon ? icon.h / 2 : 23) - 12; // just above the icon's top edge
      return { rect };
    });
    this.physics.add.collider(this.player, this.questObstacles);

    // --- decorative scenery (houses, plants, benches, lamps, etc.) ---
    // Everything in PROLOGUE_MAP_DATA.objects that isn't a landmark above:
    // purely visual, except collidable ones also get a static physics body
    // so the player can't just walk through a house or a bench.
    // Streetlights (obj_lamp_1) are handled separately below - a lamp post
    // is tall and thin, so it needs its own base-only collider and a
    // Y-sorted depth instead of the generic whole-sprite treatment here.
    this.decorObstacles = [];
    PROLOGUE_MAP_DATA.objects
      .filter(o => !PROLOGUE_QUEST_KEYS.includes(o.key) && o.key !== 'obj_lamp_1')
      .forEach(o => {
        const hasImage = this.textures.exists(o.key);
        let vis;
        if (hasImage) {
          vis = this.add.image(o.x, o.y, o.key).setDisplaySize(o.w, o.h);
        } else {
          vis = this.add.rectangle(o.x, o.y, o.w, o.h, hexToInt(o.color, 0x888888));
        }
        vis.setDepth(o.y);
        if (o.collidable) {
          this.physics.add.existing(vis, true);
          this.decorObstacles.push(vis);
        }
      });

    // --- streetlights ---
    // The pole is thin and the lamp fixture up top overhangs empty space,
    // so only the foot planted in the ground blocks movement - the player
    // can walk right up next to (and visually behind/in front of) the pole
    // itself. this.lampSprites feeds the per-frame Y-sort in update(): when
    // Hiraya is above the lamp's base she's tucked behind the post (lamp
    // drawn over her), and once she's stepped past its base she's drawn
    // over it, same as walking past any other tall object.
    this.lampSprites = [];
    PROLOGUE_MAP_DATA.objects
      .filter(o => o.key === 'obj_lamp_1')
      .forEach(o => {
        const hasImage = this.textures.exists(o.key);
        const vis = hasImage
          ? this.add.image(o.x, o.y, o.key).setDisplaySize(o.w, o.h)
          : this.add.rectangle(o.x, o.y, o.w, o.h, hexToInt(o.color, 0x888888));
        const baseY = o.y + o.h / 2; // ground level - where the post's foot sits
        vis.setDepth(baseY);
        this.lampSprites.push({ vis, baseY });

        // Small invisible collider just for the foot of the post - roughly
        // a third of the sprite's width, tall enough to stop the player
        // walking straight through the base without blocking the open
        // ground under the overhanging lamp fixture above it.
        const base = this.add.rectangle(o.x, baseY - 7, o.w * 0.4, 14, 0x000000, 0).setVisible(false);
        this.physics.add.existing(base, true);
        this.decorObstacles.push(base);
      });

    this.physics.add.collider(this.player, this.decorObstacles);

    // 4th task - not a findable object, just walking back to report to Lola
    // once the 3 above are all found. See getTaskList().
    this.reportDone = false;

    // --- HUD ---
    const displayName = character.charAt(0).toUpperCase() + character.slice(1);
    this.displayName = displayName;
    this.add.text(14, 12, displayName, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 18, color: '#fff8e7'
    }).setShadow(1, 1, '#000000aa', 2, true, true).setScrollFactor(0).setDepth(900);

    this.add.text(width / 2, 16, isEnding ? 'Pateros Plaza — The Journal, Restored' : 'Prologue: Discover Pateros Plaza', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 16, color: '#f5e2c8'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(900);

    // Wooden-Gold UI icon pack - same plank button used for Start
    // Adventure/Chapters on the Main Menu (see createWoodButton in ui.js),
    // sized down to fit the gameplay HUD.
    const taskBtn = createWoodButton(this, width - 84, 27, 'Task', () => {
      if (!this.locked) {
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
      if (!this.locked) {
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
    curtainOpen(this, () => {
      if (isEnding) {
        this.playEndingSequence();
        return;
      }

      // --- opening dialogue (auto-plays once the curtain has cleared) ---
      this.dialogueSegments = [
        {
          speaker: "Narrator",
          lines: [
            "This is Hiraya, a young explorer returning to her hometown of Pateros.",
            "She has received her grandfather's unfinished journal.",
            "The journal contains several incomplete stories about Pateros, but some pages are missing.",
            "Determined to uncover the truth, she travels to Pateros.",
            "She arrives at the town plaza, ready to begin her search."
          ],
          // hiraya-thinking for the establishing/intent lines, hiraya-journal
          // for the two lines that are literally about the journal itself.
          portraits: [
            'hiraya-thinking', 'hiraya-journal', 'hiraya-journal', 'hiraya-thinking', 'hiraya-thinking'
          ]
        },
        {
          speaker: "Lola Nena",
          lines: [
            "\"If you want to understand the stories in that journal, you have to see Pateros for yourself.\""
          ],
          portraits: [
            'lola-happy'
          ]
        },
        {
          speaker: "Lola Nena",
          lines: [
            "First, familiarize yourself with the plaza. Find the three landmarks I'll mention.",
            "Return to me when you have found them all."
          ],
          portraits: [
            'lola-wink', 'lola-wave'
          ]
        }
      ];

      this.currentDialogueIndex = 0;
      this.showDialogueSegment();
    });
  }

  // Full task list for the HUD counter / objectives modal: the 3 findable
  // objects, plus a 4th "Report to Lola Nena" task that only appears once
  // all 3 have been found (goes 3/3 -> 3/4, then 4/4 once you talk to her).
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

  showDialogueSegment() {
    if (this.currentDialogueIndex >= this.dialogueSegments.length) {
      // All dialogue segments completed
      this.locked = false;
      // Reveal task button after dialogue
      this.taskBtnRect.setVisible(true);
      this.taskBtnTxt.setVisible(true);
      return;
    }

    const segment = this.dialogueSegments[this.currentDialogueIndex];
    this.locked = true;
    showDialogue(this, segment.speaker, segment.lines, () => {
      this.currentDialogueIndex++;
      this.showDialogueSegment();
    }, segment.portraits);
  }

  update() {
    // Y-sort each streetlight against the player every frame: above the
    // post's base, Hiraya is drawn under the lamp (walking "behind" it);
    // once she's past its base, she's drawn over it, same as passing any
    // other tall object. See the lampSprites setup in create() above.
    this.lampSprites.forEach(l => {
      l.vis.setDepth(this.player.y < l.baseY ? this.player.depth + 1 : l.baseY);
    });

    // interaction prompt + key handling
    if (!this.locked) {
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
        if (nearest.type === 'lola') {
          this.talkToLola();
        } else {
          this.interactWithObject(nearest.obj);
        }
      }
    } else {
      this.lolaPrompt.setVisible(false);
      this.interactPrompt.setVisible(false);
    }

    // movement
    if (this.locked) {
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

  nearestInteractable() {
    const p = this.player;
    let best = null, bestDist = this.interactRadius;

    const dLola = Phaser.Math.Distance.Between(p.x, p.y, this.lola.x, this.lola.y);
    if (dLola < bestDist) { best = { type: 'lola' }; bestDist = dLola; }

    this.objects.forEach(o => {
      if (o.found) return;
      const d = interactGapToObject(p, o.rect);
      if (d < OBJECT_INTERACT_REACH && d < bestDist) { best = { type: 'object', obj: o }; bestDist = d; }
    });

    return best;
  }

  interactWithObject(o) {
    this.locked = true;
    showFoundItemPopup(this, o, () => {
      o.found = true;
      // setAlpha works on both the Image (real icon) and the Rectangle
      // (fallback if an icon ever fails to load) - setFillStyle only
      // exists on the latter, so it can't be used here anymore.
      o.rect.setAlpha(0.45);
      this.updateProgress();
      this.locked = false;
      if (this.objects.every(x => x.found)) {
        this.returnFlag.setVisible(true);
        showToast(this, 'Talk to Lola Nena');
      }
    });
  }

  talkToLola() {
    if (this.objects.every(o => !o.found)) {
      // If no objects found yet, give encouragement
      this.locked = true;
      showDialogue(this, 'Lola Nena', [
        `You haven't found any landmarks yet.`,
        'Keep exploring the plaza to find them all.'
      ], () => { this.locked = false; }, ['lola-happy', 'lola-wave']);
      return;
    }

    if (!this.objects.every(o => o.found)) {
      // Some but not all objects found
      const foundCount = this.objects.filter(o => o.found).length;
      this.locked = true;
      showDialogue(this, 'Lola Nena', [
        `You've found ${foundCount} of ${this.objects.length} landmarks.`,
        'Keep exploring the plaza to find them all.'
      ], () => { this.locked = false; }, ['lola-happy', 'lola-wave']);
      return;
    }

    // All objects found
    this.locked = true;
    this.returnFlag.setVisible(false);
    this.reportDone = true;
    this.updateProgress();
    showDialogue(this, 'Lola Nena', [
      'Excellent! You have found the well, the market stall, and the statue.',
      'These landmarks remind us of Pateros\'s enduring community spirit.',
      'I have added the opening page to your grandfather\'s journal. You can read it any time with the Journal button.',
      'Now proceed to the riverside to begin Chapter 1.'
    ], () => {
      this.startChapter1();
    }, ['lola-happy', 'lola-happy', 'lola-wink']);
  }

  // ==========================================================================
  // "Restore the Journal" - the doc's final beat: Hiraya/Amihan returns to
  // the plaza where her journey began, alone with the now-complete journal,
  // before a final title card ends the game. Chapter5Scene sends the player
  // here (via the `gameEnding` registry flag) rather than closing things out
  // in the Heritage Square.
  // ==========================================================================
  playEndingSequence() {
    this.locked = true;
    if (this.player.body) this.player.setVelocity(0, 0);

    showDialogue(this, this.displayName, [
      'Five pages. The journal does not feel unfinished anymore.',
      "Grandpa wasn't trying to make me remember dates.",
      'He wanted me to remember the people.',
      'The river. The streets. The traditions. The people I met along the way.',
      '"If we stop telling these stories, they disappear."'
    ], () => this.showFinalScreen(), [
      'hiraya-journal', 'hiraya-thinking', 'hiraya-thinking', 'hiraya-thinking', 'hiraya-journal'
    ]);
  }

  showFinalScreen() {
    const { width, height } = this.scale;
    // The title card has to sit above everything in the plaza. Hiraya is at
    // depth 10000 and each streetlight is bumped to player.depth + 1 while
    // she's above its base (see update()), so the old depth of 2000 let her
    // and the two lamps beside her draw straight over the card. 20000 clears
    // them (and the 11000 curtain / 10500 modals).
    const FINAL_DEPTH = 20000;
    const container = this.add.container(0, 0).setDepth(FINAL_DEPTH).setScrollFactor(0).setAlpha(0);
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x1d1f24, 1);
    const title = this.add.text(width / 2, height / 2 - 40,
      'History survives when stories\nare remembered and passed on.', {
        fontFamily: '"Tildunk", Georgia, serif', fontSize: 23, color: '#f5e2c8', align: 'center',
        wordWrap: { width: 620 }
      }).setOrigin(0.5);
    const sub = this.add.text(width / 2, height / 2 + 44, 'Journal complete - 5 / 5 pages restored.', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 14, color: '#9aa0aa'
    }).setOrigin(0.5);

    container.add([bg, title, sub]);
    this.tweens.add({ targets: container, alpha: 1, duration: 900, ease: 'Sine.easeIn' });

    this.time.delayedCall(1400, () => {
      const { rect, txt } = createButton(this, width / 2, height / 2 + 120, 'Back to Menu', () => {
        this.scene.start('Menu');
      }, { width: 220, height: 46, fontSize: 16, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
      rect.setScrollFactor(0).setDepth(FINAL_DEPTH + 1).setAlpha(0);
      txt.setScrollFactor(0).setDepth(FINAL_DEPTH + 2).setAlpha(0);
      this.tweens.add({ targets: [rect, txt], alpha: 1, duration: 400 });
    });
  }

  startChapter1() {
    // Update registry to show Chapter 1 is available? Actually Chapter1Scene will check journalPages.
    // For simplicity, we just start Chapter1Scene; it will treat journalPages as empty and
    // after completing chapter it will mark page 1 as unlocked.
    // Optionally we could set a flag that prologue is done.
    this.registry.set('prologueCompleted', true);
    // Collect the Prologue's opening page of Lolo's Journal (page id 0), both
    // for this session and in storage so it survives a reload.
    const journalPages = this.registry.get('journalPages') || [];
    if (!journalPages.includes(0)) journalPages.push(0);
    this.registry.set('journalPages', journalPages);
    ChapterProgress.addJournalPage(0);
    // Persist to localStorage (not just the in-memory registry) so Chapter 1
    // still shows up unlocked in the main menu's Chapter list even after a
    // page reload.
    ChapterProgress.unlockNextAfter('Prologue');
    // Curtain-close here (with its whoosh) pairs with Chapter1Scene's own
    // curtain-open on create(), so leaving the Prologue sounds/looks the
    // same as any other scene change instead of going silent.
    curtainClose(this, () => this.scene.start('Chapter1'));
  }

  updateProgress() {
    const tasks = this.getTaskList();
    const found = tasks.filter(t => t.found).length;
    if (this.taskBtnTxt) this.taskBtnTxt.setText(`Task (${found}/${tasks.length})`);
  }

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
      allObjectsFound ? 'All found — now report back to Lola:' : 'Find these around the plaza:', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#6b4a2f'
    }).setOrigin(0.5);
    const hint = this.add.text(width / 2, top + 70, 'Hover a found item to see what you learned', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 11, color: '#9aa0aa', fontStyle: 'italic'
    }).setOrigin(0.5);

    container.add([overlay, panel, title, subtitle, hint]);

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
}