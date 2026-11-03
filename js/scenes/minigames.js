// minigames.js
// ---------------------------------------------------------------------------
// "Mini Games" hub for the title screen.
//
//  - Adds a "Mini Games" button to the Menu (top-left).
//  - Opens a new scene (MinigamesScene) with one tab per chapter and a card
//    for every mini-game in that chapter.
//  - Picking a card starts that chapter scene in REPLAY mode: it skips the
//    walking-around and dialogue and drops the player straight into the
//    mini-game. When it ends, a result panel offers "Play Again" or
//    "Mini Games" instead of continuing the story, and NO story progress is
//    touched (no journal page, no chapter unlock, no score update).
//
// HOW TO HOOK IT UP: load this file AFTER all scene scripts and BEFORE main.js:
//
//   <script src="js/scenes/PrologueScene.js"></script>
//   <script src="js/scenes/minigames.js"></script>
//   <script src="js/main.js"></script>
//
// Nothing in the chapter scenes or MenuScene.js needs to be edited: this file
// wraps Chapter1Scene / Chapter3Scene / Chapter4Scene / MenuScene at load time.
//
// TO ADD MORE MINI-GAMES LATER (Chapter 2, Chapter 5, ...): add an entry to
// MINIGAME_LIST, a "starter" in REPLAY_STARTERS and (for the result panel) a
// wrapper at the bottom. Chapter 1 / 3 / 4 below are the examples to copy.
// ---------------------------------------------------------------------------

// 'afterChapter' = a chapter's mini-games unlock once its journal page is
//                  collected (i.e. the chapter has been finished).
// 'always'       = everything unlocked (handy for testing).
const MINIGAME_UNLOCK_RULE = 'afterChapter';

// Total number of chapters (used to unlock the Bonus game). Change this if your count is different.
const CATCH_TOTAL_CHAPTERS = 5;
const CATCH_TAB_NO = 99;

const CATCH_CONFIG = {
  lives: 3,            // number of lives
  targetScore: 15,     // good catches needed to win
  playerSpeed: 420,    // player speed (px/sec)
  startSpawnMs: 900,   // delay between item spawns at the start
  minSpawnMs: 450,     // fastest spawn rate
  startFall: 160,      // starting fall speed
  maxFall: 360,        // maximum fall speed
  badChance: 0.35      // chance that a forbidden item spawns
};
// Player image: a single character picture (catch-player.png).
// Change `path` to wherever you put the file in your project.
const CATCH_PLAYER = {
  key: 'catch-player',
  path: 'assets/catch-player.png',
  scale: 1.2
};
const CATCH_GOOD = ['🥚', '🐟', '🍚', '🥭'];
const CATCH_BAD  = ['🩴', '👟', '🧱'];

// Where the "Mini Games" button sits on the title screen.
const MINIGAME_MENU_BUTTON = { x: 100, y: 40, width: 170, height: 45, fontSize: 16 };

const MINIGAME_LIST = [
  {
    id: 'ch1-river', chapterNo: 1, chapterLabel: 'Chapter 1', scene: 'Chapter1', key: 'river',
    emoji: '🛶', title: 'River Run',
    desc: 'Steer the banca between three channels, scoop up the trade goods, and dodge the driftwood.'
  },
  {
    id: 'ch3-patrol', chapterNo: 3, chapterLabel: 'Chapter 3', scene: 'Chapter3', key: 'patrol',
    emoji: '📜', title: 'Dodge the Patrol',
    desc: 'Clear the trail and carry the secret messages while the Spanish guards walk their beats.'
  },
  {
    id: 'ch4-ducks', chapterNo: 4, chapterLabel: 'Chapter 4', scene: 'Chapter4', key: 'ducks',
    emoji: '🦆', title: 'Duck Herding',
    desc: 'Get close to a duck and it scoots away. Steer all five into the pen.'
  },
  {
    id: 'ch4-eggs', chapterNo: 4, chapterLabel: 'Chapter 4', scene: 'Chapter4', key: 'eggs',
    emoji: '🥚', title: 'Egg Sorting',
    desc: 'Keep incubating the good eggs and set the rest aside.'
  },
  {
    id: 'ch4-stall', chapterNo: 4, chapterLabel: 'Chapter 4', scene: 'Chapter4', key: 'stall',
    emoji: '🧑', title: 'Balut Stall',
    desc: 'Match each customer\u2019s request to the right item.'
  },
  {
    id: 'bonus-catch', chapterNo: 99, chapterLabel: 'Bonus', tabLabel: 'Bonus', requiresAll: true,
    scene: 'CatchGame', key: 'catch',
    emoji: '🧺', title: 'Catch It! (Catch the Goods)',
    desc: 'Catch the balut and food. Avoid the slippers and other forbidden items. You only have three lives!'
  },

  // Chapter 2 and Chapter 5 mini-games go here once added (see the note at the top).
];

// ===========================================================================
// MinigamesScene - the hub
// ===========================================================================
class MinigamesScene extends Phaser.Scene {
  constructor() {
    super('Minigames');
  }

  init(data) {
    this.startTab = data && data.tab;
  }

  create() {
    SoundManager.playMusic(this, 'bg-menu');
    const { width, height } = this.scale;
    const cx = width / 2;
    this.leaving = false;

    if (this.textures.exists('bg-village')) {
      const bg = this.add.image(cx, height / 2, 'bg-village');
      coverFitImage(bg, width, height);
    } else {
      this.add.rectangle(cx, height / 2, width, height, 0x1a1206, 1);
    }
    this.add.rectangle(cx, height / 2, width, height, 0x1a1206, 0.6);

    this.add.text(cx, 44, 'MINI GAMES', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 36, color: '#fff8e7',
      stroke: '#3b2410', strokeThickness: 6, fontStyle: 'bold'
    }).setOrigin(0.5).setShadow(2, 3, '#00000066', 5, true, true);

    this.add.text(cx, 78, 'Replay any mini-game from the story', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 14, color: '#f5e2c8'
    }).setOrigin(0.5);

    createWoodButton(this, 90, 40, 'Back', () => {
      if (this.leaving) return;
      this.leaving = true;
      curtainClose(this, () => this.scene.start('Menu'));
    }, { width: 120, height: 45, fontSize: 16 });

    // which chapters have been finished (journal page n = chapter n)
    this.pages = ChapterProgress.mergeJournalPages(this.registry.get('journalPages'));

    // one tab per chapter that has at least one mini-game
    const chapterNos = [...new Set(MINIGAME_LIST.map(m => m.chapterNo))].sort((a, b) => a - b);
    this.tabs = [];
    const tabGap = 142;
    const tabsStartX = cx - ((chapterNos.length - 1) * tabGap) / 2;
    chapterNos.forEach((no, i) => {
      const x = tabsStartX + i * tabGap;
      const y = 118;
      const rect = this.add.rectangle(x, y, 130, 34, 0x33363f, 0.95).setStrokeStyle(2, 0xd8b04a)
        .setInteractive({ useHandCursor: true });
      const entry = MINIGAME_LIST.find(m => m.chapterNo === no);
      const label = (entry && entry.tabLabel) || `Chapter ${no}`;
      const txt = this.add.text(x, y, label, {
        fontFamily: '"Tildunk", Georgia, serif', fontSize: 15, color: '#fff8e7'
      }).setOrigin(0.5);
      rect.on('pointerdown', () => this.showTab(no));
      this.tabs.push({ no, rect, txt });
    });

    const firstNo = chapterNos.includes(this.startTab) ? this.startTab : chapterNos[0];
    this.showTab(firstNo);

    const hint = MINIGAME_UNLOCK_RULE === 'always'
      ? 'All mini-games are unlocked.'
      : 'Finish a chapter to unlock its mini-games.';
    this.add.text(cx, height - 16, hint, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#c9b896'
    }).setOrigin(0.5, 1);
  }

  isUnlocked(m) {
    if (MINIGAME_UNLOCK_RULE === 'always') return true;
    if (m.requiresAll) {
      for (let n = 1; n <= CATCH_TOTAL_CHAPTERS; n++) {
        if (!this.pages.includes(n)) return false;
      }
      return true;
    }
    return this.pages.includes(m.chapterNo);
  }

  showTab(chapterNo) {
    const { width } = this.scale;
    const cx = width / 2;

    this.tabs.forEach(t => {
      t.rect.setFillStyle(t.no === chapterNo ? 0x3c7a3e : 0x33363f, 0.95);
    });
    if (this.cardsContainer) { this.cardsContainer.destroy(); this.cardsContainer = null; }
    const container = this.cardsContainer = this.add.container(0, 0);

    const list = MINIGAME_LIST.filter(m => m.chapterNo === chapterNo);
    const cardW = Math.min(700, width - 60);
    const cardH = 80;
    const gap = 12;
    const startY = 176;

    list.forEach((m, i) => {
      const y = startY + i * (cardH + gap) + cardH / 2;
      const unlocked = this.isUnlocked(m);
      const sceneExists = !!this.scene.manager.keys[m.scene];
      const playable = unlocked && sceneExists;
      const left = cx - cardW / 2;

      const rect = this.add.rectangle(cx, y, cardW, cardH, playable ? 0x20222a : 0x2a2c33, 0.94)
        .setStrokeStyle(2, playable ? 0xd8b04a : 0x555a66);
      const icon = this.add.text(left + 40, y, playable ? m.emoji : '🔒', { fontSize: 32 }).setOrigin(0.5);
      const title = this.add.text(left + 80, y - 22, m.title, {
        fontFamily: '"Tildunk", Georgia, serif', fontSize: 17, color: playable ? '#fff8e7' : '#9aa0aa'
      }).setOrigin(0, 0);
      const desc = this.add.text(left + 80, y - 2, m.desc, {
        fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: playable ? '#c9cdd6' : '#7c828e',
        wordWrap: { width: cardW - 80 - 140 }
      }).setOrigin(0, 0);
      container.add([rect, icon, title, desc]);

      if (playable) {
        const { rect: btn, txt } = createButton(this, cx + cardW / 2 - 80, y, 'Play', () => {
          if (this.leaving) return;
          this.leaving = true;
          curtainClose(this, () => this.scene.start(m.scene, { minigame: m.key, replay: true, tab: m.chapterNo }));
        }, { width: 110, height: 36, fontSize: 15, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
        container.add([btn, txt]);
      } else {
        const msg = !unlocked
          ? (m.requiresAll ? 'Finish all chapters' : `Finish Chapter ${m.chapterNo}`)
          : 'Coming soon';
        const lock = this.add.text(cx + cardW / 2 - 20, y, msg, {
          fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#9aa0aa', fontStyle: 'italic'
        }).setOrigin(1, 0.5);
        container.add(lock);
      }
    });
  }
}

// ===========================================================================
// Result panel shown when a replayed mini-game ends
// ===========================================================================
function showReplayResult(scene, opts) {
  const { width, height } = scene.scale;
  const container = scene.add.container(0, 0).setDepth(10600).setScrollFactor(0);
  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.72).setInteractive().setScrollFactor(0);
  const panel = scene.add.rectangle(width / 2, height / 2, 460, 240, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
  const title = scene.add.text(width / 2, height / 2 - 80, opts.success ? 'Well done!' : 'Try again!', {
    fontFamily: '"Tildunk", Georgia, serif', fontSize: 24, color: '#9c3b2e', fontStyle: 'bold'
  }).setOrigin(0.5);
  const name = scene.add.text(width / 2, height / 2 - 48, opts.name, {
    fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#6b4a2f', fontStyle: 'italic'
  }).setOrigin(0.5);
  const body = scene.add.text(width / 2, height / 2 - 18, opts.body, {
    fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#3b2410', align: 'center', wordWrap: { width: 380 }
  }).setOrigin(0.5, 0);
  container.add([overlay, panel, title, name, body]);

  let busy = false;
  const again = createButton(scene, width / 2 - 95, height / 2 + 88, 'Play Again', () => {
    if (busy) return; busy = true;
    curtainClose(scene, () => scene.scene.restart({ minigame: scene.replayKey, replay: true, tab: scene.replayTab }));
  }, { width: 170, height: 44, fontSize: 16, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
  const back = createButton(scene, width / 2 + 95, height / 2 + 88, 'Mini Games', () => {
    if (busy) return; busy = true;
    curtainClose(scene, () => scene.scene.start('Minigames', { tab: scene.replayTab }));
  }, { width: 170, height: 44, fontSize: 16 });
  container.add([again.rect, again.txt, back.rect, back.txt]);

  if (opts.sound) SoundManager.play(scene, opts.success ? 'complete' : 'incorrect');
}

// ===========================================================================
// Replay plumbing
// ===========================================================================

// Wraps Cls.create so that, in replay mode, the story intro is replaced by
// `starters[key]`. The scene still builds itself normally (map, player, etc.);
// only the callback that curtainOpen() runs after the reveal is swapped.
function installReplayCreate(Cls, starters) {
  const origCreate = Cls.prototype.create;
  Cls.prototype.create = function (data) {
    const key = data && data.replay ? data.minigame : null;
    const start = key && starters[key];
    if (!start) return origCreate.call(this, data);

    this.replayKey = key;
    this.replayTab = data.tab;
    this.replayScore = 0;

    const realOpen = curtainOpen;
    let patched = false;
    try {
      curtainOpen = function (scene, cb, ...rest) {
        return realOpen(scene, () => start(scene), ...rest);
      };
      patched = true;
    } catch (e) {
      console.warn('minigames.js: could not patch curtainOpen - the story intro will play before the mini-game.', e);
    }
    try {
      return origCreate.call(this, data);
    } finally {
      if (patched) curtainOpen = realOpen;
    }
  };
}

// Replaces Cls.prototype[name] with `fn` only while a replay is running.
function wrapForReplay(Cls, name, fn) {
  const orig = Cls.prototype[name];
  Cls.prototype[name] = function (...args) {
    if (this.replayKey) return fn.apply(this, args);
    return orig.apply(this, args);
  };
}

// ---------------------------------------------------------------------------
// Chapter 1 - River Run
// ---------------------------------------------------------------------------
if (typeof Chapter1Scene !== 'undefined') {
  installReplayCreate(Chapter1Scene, {
    river(scene) {
      scene.mode = 'transition';
      scene.locked = true;
      scene.launchRiverRun();
      scene.showRiverIntro();
    }
  });
  wrapForReplay(Chapter1Scene, 'showRiverRecap', function () {
    showReplayResult(this, {
      success: true, name: 'River Run',
      body: `You reached the embarcadero with ${this.riverCargo} load${this.riverCargo === 1 ? '' : 's'} of trade cargo.`
    });
  });
  wrapForReplay(Chapter1Scene, 'showRiverFailRetry', function () {
    showReplayResult(this, {
      success: false, name: 'River Run',
      body: 'The banca took on too much before reaching the embarcadero.'
    });
  });
}

// ---------------------------------------------------------------------------
// Chapter 3 - Dodge the Patrol
// ---------------------------------------------------------------------------
if (typeof Chapter3Scene !== 'undefined') {
  installReplayCreate(Chapter3Scene, {
    patrol(scene) {
      scene.mode = 'transition';
      scene.locked = true;
      scene.launchPatrol();
      scene.showPatrolIntro();
    }
  });
  wrapForReplay(Chapter3Scene, 'showPatrolRecap', function () {
    showReplayResult(this, {
      success: true, name: 'Dodge the Patrol',
      body: `Every message made it through (${this.patrolCollected}/${CHAPTER3_PATROL_MESSAGES.length}).`
    });
  });
  wrapForReplay(Chapter3Scene, 'showPatrolFailRetry', function () {
    showReplayResult(this, {
      success: false, name: 'Dodge the Patrol',
      body: `The patrol caught you with ${this.patrolCollected}/${CHAPTER3_PATROL_MESSAGES.length} messages delivered.`
    });
  });
}

// ---------------------------------------------------------------------------
// Chapter 4 - Duck Herding, Egg Sorting, Balut Stall
// ---------------------------------------------------------------------------
if (typeof Chapter4Scene !== 'undefined') {
  installReplayCreate(Chapter4Scene, {
    ducks(scene) {
      showDialogue(scene, 'Mang Carding', [
        'Get close to a duck and it will scoot away from you. Steer all five into the pen!'
      ], () => {
        scene.locked = false;
        scene.startDuckHerding();
      }, ['mang-carding-explain']);
    },
    eggs(scene) {
      scene.locked = true;
      scene.startEggSorting();
    },
    stall(scene) {
      scene.locked = true;
      scene.startBalutStall();
    }
  });

  wrapForReplay(Chapter4Scene, 'finishDuckHerding', function () {
    this.mode = 'between';
    this.locked = true;
    if (this.player) this.player.setVelocity(0, 0);
    showReplayResult(this, {
      success: true, sound: true, name: 'Duck Herding',
      body: 'All five ducks are settled in the pen.'
    });
  });
  wrapForReplay(Chapter4Scene, 'finishEggSorting', function () {
    showReplayResult(this, {
      success: true, sound: true, name: 'Egg Sorting',
      body: `You sorted ${this.replayScore} of ${CHAPTER4_EGGS.length} eggs correctly.`
    });
  });
  wrapForReplay(Chapter4Scene, 'finishBalutStall', function () {
    showReplayResult(this, {
      success: true, sound: true, name: 'Balut Stall',
      body: `You served ${this.replayScore} of ${CHAPTER4_CUSTOMERS.length} customers correctly.`
    });
  });

  // count correct answers while replaying (the story version doesn't track them)
  const origEggAnswer = Chapter4Scene.prototype.handleEggAnswer;
  Chapter4Scene.prototype.handleEggAnswer = function (container, optionButtons, egg, selectedKey, feedbackY) {
    if (this.replayKey && selectedKey === egg.correct) this.replayScore++;
    return origEggAnswer.call(this, container, optionButtons, egg, selectedKey, feedbackY);
  };
  const origCustAnswer = Chapter4Scene.prototype.handleCustomerAnswer;
  Chapter4Scene.prototype.handleCustomerAnswer = function (container, optionButtons, customer, selectedKey, feedbackY) {
    if (this.replayKey && selectedKey === customer.correct) this.replayScore++;
    return origCustAnswer.call(this, container, optionButtons, customer, selectedKey, feedbackY);
  };
}

// ===========================================================================
// Bonus mini-game - Catch It! (catch the falling goods)
// ===========================================================================
class CatchGameScene extends Phaser.Scene {
  constructor() {
    super('CatchGame');
  }

  init(data) {
    // showReplayResult() uses replayKey and replayTab
    this.replayKey = (data && data.minigame) || 'catch';
    this.replayTab = data && data.tab !== undefined ? data.tab : CATCH_TAB_NO;
  }

  preload() {
    const P = CATCH_PLAYER;
    if (!this.textures.exists(P.key)) {
      this.load.image(P.key, P.path);
    }
  }

  create() {
    const { width, height } = this.scale;
    this.W = width;
    this.H = height;
    this.items = [];
    this.score = 0;
    this.lives = CATCH_CONFIG.lives;
    this.playing = false;
    this.finished = false;
    this.leaving = false;

    // background
    if (this.textures.exists('bg-village')) {
      const bg = this.add.image(width / 2, height / 2, 'bg-village');
      coverFitImage(bg, width, height);
    } else {
      this.add.rectangle(width / 2, height / 2, width, height, 0x87c5e8, 1);
    }
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1206, 0.25);

    // ground
    this.groundY = height - 60;
    this.add.rectangle(width / 2, height - 30, width, 60, 0x6b4a2f, 1).setDepth(1);

    // player image (falls back to an emoji if the image failed to load)
    const P = CATCH_PLAYER;
    if (this.textures.exists(P.key)) {
      this.player = this.add.image(width / 2, this.groundY + 10, P.key)
        .setOrigin(0.5, 1).setScale(P.scale).setDepth(5);
    } else {
      this.player = this.add.text(width / 2, this.groundY + 10, '🧑‍🌾', { fontSize: 56 })
        .setOrigin(0.5, 1).setDepth(5);
    }

    // controls (A / D or Left / Right arrows, )
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey('A');
    this.keyD = this.input.keyboard.addKey('D');
    
    // HUD
    const hudStyle = {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, color: '#fff8e7',
      stroke: '#3b2410', strokeThickness: 5
    };
    this.scoreText = this.add.text(width / 2, 30, '', hudStyle).setOrigin(0.5).setDepth(20);
    this.livesText = this.add.text(width - 20, 30, '', hudStyle).setOrigin(1, 0.5).setDepth(20);
    this.updateHud();

    createWoodButton(this, 90, 40, 'Back', () => {
      if (this.leaving) return;
      this.leaving = true;
      curtainClose(this, () => this.scene.start('Minigames', { tab: this.replayTab }));
    }, { width: 120, height: 45, fontSize: 16 });

    this.showIntro();
  }

  updateHud() {
    const left = Math.max(0, this.lives);
    this.scoreText.setText(`Caught: ${this.score}/${CATCH_CONFIG.targetScore}`);
    this.livesText.setText('❤️'.repeat(left) + '🖤'.repeat(CATCH_CONFIG.lives - left));
  }

  showIntro() {
    const W = this.W, H = this.H;
    const c = this.add.container(0, 0).setDepth(300);
    const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7).setInteractive();
    const panel = this.add.rectangle(W / 2, H / 2, 500, 280, 0xfff8e7, 1).setStrokeStyle(4, 0x9c3b2e);
    const title = this.add.text(W / 2, H / 2 - 100, 'Catch It!', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 26, color: '#9c3b2e', fontStyle: 'bold'
    }).setOrigin(0.5);
    const body = this.add.text(W / 2, H / 2 - 62,
  `Press A / D or Left / Right arrows to move.\n\n` +
  `CATCH:  ${CATCH_GOOD.join(' ')}\n` +
  `AVOID:  ${CATCH_BAD.join(' ')}  (you'll lose a life!)\n\n` +
  `You have ${CATCH_CONFIG.lives} lives. Reach ${CATCH_CONFIG.targetScore} to win.`, {
    fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#3b2410',
    align: 'center', wordWrap: { width: 440 }
  }).setOrigin(0.5, 0);
    c.add([overlay, panel, title, body]);

    const start = createButton(this, W / 2, H / 2 + 100, 'Start', () => {
      c.destroy();
      this.startGame();
    }, { width: 170, height: 44, fontSize: 16, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
    c.add([start.rect, start.txt]);
  }

  startGame() {
    this.playing = true;
    this.scheduleSpawn();
  }

  scheduleSpawn() {
    if (!this.playing) return;
    const C = CATCH_CONFIG;
    const delay = Phaser.Math.Clamp(C.startSpawnMs - this.score * 30, C.minSpawnMs, C.startSpawnMs);
    this.spawnTimer = this.time.delayedCall(delay, () => {
      this.spawnItem();
      this.scheduleSpawn();
    });
  }

  spawnItem() {
    if (!this.playing) return;
    const C = CATCH_CONFIG;
    const bad = Math.random() < C.badChance;
    const emoji = Phaser.Utils.Array.GetRandom(bad ? CATCH_BAD : CATCH_GOOD);
    const x = Phaser.Math.Between(50, this.W - 50);
    const obj = this.add.text(x, -30, emoji, { fontSize: 40 }).setOrigin(0.5).setDepth(4);
    const speed = Phaser.Math.Clamp(C.startFall + this.score * 12, C.startFall, C.maxFall)
      + Phaser.Math.Between(-20, 30);
    this.items.push({ obj, bad, speed });
  }

  update(time, delta) {
    if (!this.playing) return;
    const dt = delta / 1000;
    const speed = CATCH_CONFIG.playerSpeed;

    // player movement
    let dir = 0;
if (this.cursors.left.isDown || this.keyA.isDown) dir -= 1;
if (this.cursors.right.isDown || this.keyD.isDown) dir += 1;
this.player.x += dir * speed * dt;
    this.player.x = Phaser.Math.Clamp(this.player.x, 40, this.W - 40);

    // falling items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.obj.y += it.speed * dt;
      it.obj.angle += (it.bad ? 90 : 30) * dt;

      const caught = Math.abs(it.obj.x - this.player.x) < 45 &&
        it.obj.y > this.groundY - 70 && it.obj.y < this.groundY + 10;

      if (caught) {
        const wasBad = it.bad;
        const x = it.obj.x, y = it.obj.y;
        it.obj.destroy();
        this.items.splice(i, 1);
        this.onCatch(wasBad, x, y);
        if (this.finished) return;
      } else if (it.obj.y > this.H + 40) {
        it.obj.destroy();
        this.items.splice(i, 1);   // missed items carry no penalty
      }
    }
  }

  onCatch(bad, x, y) {
    if (bad) {
      this.lives--;
      this.cameras.main.shake(180, 0.01);
      this.floatText(x, y, 'Ouch! -1 ❤️', '#ff6b6b');
      this.safePlay('incorrect');
    } else {
      this.score++;
      this.floatText(x, y, '+1', '#9bff9b');
    }
    this.updateHud();

    if (this.lives <= 0) this.endGame(false);
    else if (this.score >= CATCH_CONFIG.targetScore) this.endGame(true);
  }

  floatText(x, y, msg, color) {
    const t = this.add.text(x, y - 20, msg, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 20, color,
      stroke: '#3b2410', strokeThickness: 4
    }).setOrigin(0.5).setDepth(30);
    this.tweens.add({ targets: t, y: y - 80, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }

  safePlay(key) {
    try { SoundManager.play(this, key); } catch (e) { /* no sound available, that's fine */ }
  }

  endGame(success) {
    this.finished = true;
    this.playing = false;
    if (this.spawnTimer) this.spawnTimer.remove(false);
    this.items.forEach(it => it.obj.destroy());
    this.items = [];

    showReplayResult(this, {
      success, sound: true, name: 'Catch It!',
      body: success
        ? `You caught everything you needed (${this.score}/${CATCH_CONFIG.targetScore}) with ${this.lives} ${this.lives === 1 ? 'life' : 'lives'} to spare.`
        : `You ran out of lives. You caught ${this.score}/${CATCH_CONFIG.targetScore}.`
    });
  }
}

// ---------------------------------------------------------------------------
// Title screen: add the "Mini Games" button and register the hub scene
// ---------------------------------------------------------------------------
if (typeof MenuScene !== 'undefined') {
  const origMenuCreate = MenuScene.prototype.create;
  MenuScene.prototype.create = function () {
    origMenuCreate.apply(this, arguments);

    if (!this.scene.manager.keys['Minigames']) {
      this.scene.add('Minigames', MinigamesScene, false);
    }
    if (!this.scene.manager.keys['CatchGame']) {
      this.scene.add('CatchGame', CatchGameScene, false);
    }

    const b = MINIGAME_MENU_BUTTON;
    createWoodButton(this, b.x, b.y, 'Mini Games', () => {
      curtainClose(this, () => this.scene.start('Minigames'));
    }, { width: b.width, height: b.height, fontSize: b.fontSize });
  };
}