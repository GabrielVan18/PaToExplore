const FRAME_W = 44;
const FRAME_H = 78;

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    SoundManager.playMusic(this, 'bg-game');
    const { width, height } = this.scale;
    const character = 'hiraya';
    const textureKey = character + '-sheet';
    const showGrid = this.registry.get('showGrid');
    this.speed = this.registry.get('playerSpeed') || 160;
    this.prefix = character;

    // ground
    const g = this.add.graphics();
    g.fillStyle(0x2e3138, 1).fillRect(0, 0, width, height);
    if (showGrid) {
      g.lineStyle(1, 0x3a3d46, 1);
      for (let x = 0; x <= width; x += 32) g.lineBetween(x, 0, x, height);
      for (let y = 0; y <= height; y += 32) g.lineBetween(0, y, width, y);
    }

    this.createAnimsIfNeeded(textureKey);

    this.player = this.physics.add.sprite(width / 2, height / 2, textureKey, 0);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(FRAME_W * 0.5, FRAME_H * 0.35);
    this.player.setOffset(FRAME_W * 0.25, FRAME_H * 0.6);
    this.player.facing = 'down';

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.locked = false; // true while the pause menu is open - movement disabled
    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.locked) { this.locked = true; showPauseMenu(this); }
    });

    // HUD
    const displayName = character.charAt(0).toUpperCase() + character.slice(1);
    this.add.text(14, 12, displayName, {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 18, color: '#fff8e7'
    }).setShadow(1, 1, '#000000aa', 2, true, true);

    // Wooden-Gold UI icon pack - same plank button used for Start
    // Adventure/Chapters on the Main Menu (see createWoodButton in ui.js).
    createWoodButton(this, width - 66, 30, 'Menu', () => {
      if (!this.locked) { this.locked = true; showPauseMenu(this); }
    }, { width: 130, height: 42, fontSize: 15 });

    this.add.text(width / 2, height - 16, 'WASD or Arrow Keys to move · Esc for menu', {
      fontFamily: '"Tildunk", sans-serif', fontSize: 13, color: '#9aa0aa'
    }).setOrigin(0.5, 1);
  }

  // Anim keys are namespaced per-character (e.g. "hiraya-walk-down") since each
  // Phaser animation is baked from one specific texture. exists() guards against
  // re-creating them if the player leaves and re-enters this scene.
  createAnimsIfNeeded(textureKey) {
    const p = this.prefix;
    if (!this.anims.exists(`${p}-walk-down`)) {
      this.anims.create({
        key: `${p}-walk-down`,
        frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 11 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!this.anims.exists(`${p}-walk-up`)) {
      this.anims.create({
        key: `${p}-walk-up`,
        frames: this.anims.generateFrameNumbers(textureKey, { start: 12, end: 19 }),
        frameRate: 10,
        repeat: -1
      });
    }
    if (!this.anims.exists(`${p}-walk-side`)) {
      this.anims.create({
        key: `${p}-walk-side`,
        frames: this.anims.generateFrameNumbers(textureKey, { start: 24, end: 34 }),
        frameRate: 12,
        repeat: -1
      });
    }
  }

  update() {
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

      if (vy < 0) {
        this.player.facing = 'up';
      } else if (vy > 0) {
        this.player.facing = 'down';
      } else if (vx !== 0) {
        this.player.facing = 'side';
        this.player.flipX = vx > 0; // side frames face left by default -> flip for right
      }

      // `true` = ignoreIfPlaying: skips restart if already playing this anim,
      // but still resumes it if it had been stopped (fixes the "sliding" bug).
      this.player.play(`${this.prefix}-walk-${this.player.facing}`, true);
    } else {
      this.player.setVelocity(0, 0);
      this.player.anims.stop();
      const idleFrame = { down: 0, up: 12, side: 24 }[this.player.facing];
      this.player.setFrame(idleFrame);
    }
  }
}
