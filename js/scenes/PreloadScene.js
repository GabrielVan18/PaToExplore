class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1d1f24);
    const barBg = this.add.rectangle(width / 2, height / 2, 320, 22, 0x2c2f37).setStrokeStyle(2, 0x4a4e59);
    const bar = this.add.rectangle(width / 2 - 156, height / 2, 4, 14, 0xe0673f).setOrigin(0, 0.5);
    // Kept as an instance property so create() can swap the message once
    // loading is actually done (see showTapToBegin()).
    this.loadingText = this.add.text(width / 2, height / 2 - 34, 'Loading Pato Explorer...', {
      fontFamily: '"Tildunk", Georgia, serif',
      fontSize: 18,
      color: '#eee'
    }).setOrigin(0.5);

    this.load.on('progress', (v) => { bar.width = 312 * v; });

    // audio - filenames/placement guide lives in js/soundManager.js
    SoundManager.preload(this);

    // images
    this.load.image('bg-village', 'assets/images/bg.png');

    // Wooden-Gold UI icon pack - used to skin the Main Menu screen (see
    // MenuScene.js) and the in-gameplay HUD buttons (Task/Journal/Menu -
    // see PrologueScene/Chapter1-5Scene/GameScene). Long glossy plank =
    // text buttons (Start, Chapters, Task, Journal, Menu); hexagon banner =
    // title backdrop; round wood medallions = icon-only buttons (Settings,
    // About, Sound toggle). See createWoodButton()/createIconButton() in
    // ui.js.
    this.load.image('wood-btn-long', 'assets/images/ui/wood/long_button.png');
    this.load.image('wood-banner-hex', 'assets/images/ui/wood/banner_hexagon.png');
    this.load.image('wood-icon-settings', 'assets/images/ui/wood/round_settings.png');
    this.load.image('wood-icon-info', 'assets/images/ui/wood/round_info.png');
    this.load.image('wood-icon-sound-on', 'assets/images/ui/wood/round_sound_on.png');
    this.load.image('wood-icon-sound-off', 'assets/images/ui/wood/round_sound_off.png');

    // Theater-curtain fabric (see curtainClose/curtainOpen in ui.js) - one
    // portrait-ish crop, stretched across each panel and mirrored on the
    // right side so the folds read as one continuous curtain.
    this.load.image('curtain-fabric', 'assets/images/curtain-fabric.jpg');
    // character spritesheet - 44x78 grid layout:
    //   frames 0-11  -> walk/idle facing down
    //   frames 12-19 -> walk/idle facing up
    //   frames 24-34 -> walk/idle facing side (flip X for left/right)
    this.load.spritesheet('hiraya-sheet', 'assets/sprites/hiraya-sheet.png', { frameWidth: 44, frameHeight: 78 });

    // Lola Nena - same grid convention as hiraya: one sheet, 44x78 frames,
    // frames 0-11 down, 12-19 up, 24-34 side (flip X for right). Chroma-keyed to
    // transparent from the user-supplied character sheet.
    this.load.spritesheet('lola-sheet', 'assets/sprites/lola-sheet.png', { frameWidth: 44, frameHeight: 78 });

    // Lola Nena dialogue portraits (cut from the user-supplied 3-pose reference art,
    // background removed) - shown top-right of the dialogue box, swapped per line
    // to match the tone of what she's saying. See showDialogue() in ui.js.
    this.load.image('lola-wave', 'assets/images/lola-wave.png');
    this.load.image('lola-happy', 'assets/images/lola-happy.png');
    this.load.image('lola-wink', 'assets/images/lola-wink.png');
    
    // Hiraya dialogue portrait
    this.load.image('hiraya-card', 'assets/images/hiraya-card.png');

    // Hiraya's other two dialogue poses (cut from a user-supplied 3-pose
    // reference sheet, background removed) - used for the Narrator's
    // opening lines and her own reflective lines in the Prologue's ending
    // sequence. See showDialogueSegment()/playEndingSequence() in
    // PrologueScene.js for which line shows which pose.
    this.load.image('hiraya-journal', 'assets/images/hiraya-journal.png');
    this.load.image('hiraya-thinking', 'assets/images/hiraya-thinking.png');

    // Every drawing Lolo's Journal shows (journalBook.js / journalData.js).
    // Loading them here means the book opens instantly from any scene.
    JournalBook.preload(this);

    // Don Emilio - same grid convention as hiraya/lola: one sheet, 44x78 frames,
    // frames 0-11 down, 12-19 up, 24-34 side (flip X for right). Chroma-keyed to
    // transparent from the user-supplied character sheet.
    this.load.spritesheet('donemilio-sheet', 'assets/sprites/donemilio-sheet.png', { frameWidth: 44, frameHeight: 78 });

    // Don Emilio dialogue portraits (cut from the user-supplied 3-pose reference art,
    // background removed) - shown top-right of the dialogue box, swapped per line
    // to match the tone of what he's saying. See showDialogue() in ui.js.
    this.load.image('don-emilio-happy', 'assets/images/don-emilio-happy.png');
    this.load.image('don-emilio-explain', 'assets/images/don-emilio-explain.png');
    this.load.image('don-emilio-point', 'assets/images/don-emilio-point.png');

    // Kapitan Andres (Chapter 3) - same 44x78 grid convention as
    // hiraya/lola/donemilio (frames 0-11 down, 12-19 up, 24-34 side). Built
    // from the user-supplied pixel-art character sheet, background removed
    // and re-sliced to the 44x78 frame grid (down row only had 11 source
    // poses so the 12th is a repeat of the last; up row only had 9 so
    // frames 20-23 repeat the last walking pose - neither is used by any
    // animation, both just keep the grid fully populated).
    this.load.spritesheet('kapitanandres-sheet', 'assets/sprites/kapitanandres-sheet.png', { frameWidth: 44, frameHeight: 78 });

    // Kapitan Andres dialogue portraits (cut from the user-supplied 3-pose
    // reference art, background removed) - shown top-right of the dialogue
    // box, swapped per line to match the tone of what he's saying. See
    // showDialogue() in ui.js.
    this.load.image('kapitan-andres-firm', 'assets/images/kapitan-andres-firm.png');
    this.load.image('kapitan-andres-happy', 'assets/images/kapitan-andres-happy.png');
    this.load.image('kapitan-andres-point', 'assets/images/kapitan-andres-point.png');

    // Mang Carding (Chapter 4) - same 44x78 grid convention as
    // hiraya/lola/donemilio/kapitanandres (frames 0-11 down, 12-19 up, 24-34
    // side). Built from the user-supplied character sheet, background
    // removed and re-sliced to the 44x78 frame grid.
    this.load.spritesheet('mangcarding-sheet', 'assets/sprites/mangcarding-sheet.png', { frameWidth: 44, frameHeight: 78 });

    // Mang Carding dialogue portraits (cut from the user-supplied 3-pose
    // reference art, background removed) - shown top-right of the dialogue
    // box, swapped per line to match the tone of what he's saying. See
    // showDialogue() in ui.js.
    this.load.image('mang-carding-happy', 'assets/images/mang-carding-happy.png');
    this.load.image('mang-carding-explain', 'assets/images/mang-carding-explain.png');
    this.load.image('mang-carding-wink', 'assets/images/mang-carding-wink.png');

    // Ate Clara & Maya (Chapter 5) - same 44x78 grid convention as
    // hiraya/lola/donemilio/kapitanandres/mangcarding (frames 0-11 down,
    // 12-19 up, 24-34 side). Built from the user-supplied character sheets,
    // background removed and re-sliced to the 44x78 frame grid.
    this.load.spritesheet('ateclara-sheet', 'assets/sprites/ateclara-sheet.png', { frameWidth: 44, frameHeight: 78 });
    this.load.spritesheet('maya-sheet', 'assets/sprites/maya-sheet.png', { frameWidth: 44, frameHeight: 78 });

    // Ate Clara dialogue portraits (cut from the user-supplied 3-pose
    // reference art, background removed) - same swap-per-line convention as
    // Lola/Don Emilio/Mang Carding above.
    this.load.image('ate-clara-happy', 'assets/images/ate-clara-happy.png');
    this.load.image('ate-clara-wave', 'assets/images/ate-clara-wave.png');
    this.load.image('ate-clara-wink', 'assets/images/ate-clara-wink.png');

    // Maya dialogue portraits (cut from the user-supplied 3-pose reference
    // art, background removed) - same swap-per-line convention as above.
    this.load.image('maya-happy', 'assets/images/maya-happy.png');
    this.load.image('maya-wave', 'assets/images/maya-wave.png');
    this.load.image('maya-wink', 'assets/images/maya-wink.png');
  }

  create() {
    // sensible defaults, only set once (hiraya is the only playable character)
    if (this.registry.get('selectedCharacter') === undefined) this.registry.set('selectedCharacter', 'hiraya');
    if (this.registry.get('playerSpeed') === undefined) this.registry.set('playerSpeed', 160);
    if (this.registry.get('showGrid') === undefined) this.registry.set('showGrid', true);
    if (this.registry.get('musicVolume') === undefined) this.registry.set('musicVolume', 0.5);
    if (this.registry.get('sfxVolume') === undefined) this.registry.set('sfxVolume', 0.7);

    this.showTapToBegin();
  }

  // Browsers won't let audio start until the page has received a real,
  // trusted user gesture (a synthetic/programmatic click doesn't count -
  // only an actual click/tap/keypress does). Rather than jumping straight
  // into Menu (whose bg-menu music would then silently fail to start), we
  // wait right here for that first genuine input. By the time Menu's
  // create() runs and calls SoundManager.playMusic(), the audio context is
  // already unlocked, so the music actually plays - instead of only
  // "unlocking" on whatever the player clicks next, which is often the
  // Start button, and that switches scenes immediately so nothing is heard.
  showTapToBegin() {
    const { width, height } = this.scale;
    this.loadingText.setText('Ready!');

    const prompt = this.add.text(width / 2, height / 2 + 46, 'Press Any Key to Begin', {
      fontFamily: '"Tildunk", Georgia, serif',
      fontSize: 20,
      color: '#eee'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.35,
      duration: 700,
      yoyo: true,
      repeat: -1
    });

    const begin = () => this.scene.start('Menu');
    // Listen for pointerUP (release), not pointerdown (press). If we
    // switched scenes on the press, Menu's buttons would already exist and
    // be interactive by the time the release fires a few frames later - and
    // since createButton fires its click on pointerup, that leftover
    // release would land on whatever Menu button happens to be under the
    // cursor, triggering it as an unintended side effect of this same tap.
    this.input.once('pointerup', begin);
    this.input.keyboard.once('keydown', begin);
  }
}
