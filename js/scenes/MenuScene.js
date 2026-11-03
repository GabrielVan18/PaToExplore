class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    SoundManager.playMusic(this, 'bg-menu');
    const { width, height } = this.scale;
    const cx = width / 2;

    const bg = this.add.image(cx, height / 2, 'bg-village');
    coverFitImage(bg, width, height);
    this.add.rectangle(cx, height / 2, width, height, 0x1a1206, 0.32);

    // --- Title, on a Wooden-Gold hexagon banner ---
    const bannerY = 96;
    this.add.image(cx, bannerY, 'wood-banner-hex').setDisplaySize(460, 166);

    this.add.text(cx, bannerY - 2, 'PATO EXPLORER', {
      fontFamily: '"Tildunk", Georgia, serif',
      fontSize: 46,
      color: '#fff8e7',
      stroke: '#3b2410',
      strokeThickness: 7,
      fontStyle: 'bold'
    }).setOrigin(0.5).setShadow(2, 4, '#00000066', 6, true, true);

    this.add.text(cx, bannerY + 96, 'Where the river remembers', {
      fontFamily: '"Tildunk", Georgia, serif',
      fontSize: 18,
      color: '#f5e2c8'
    }).setOrigin(0.5).setShadow(1, 2, '#00000066', 3, true, true);
// --- Logout Button (Top-Right) ---
const logoutBtn = createWoodButton(this, width - 90, 40, 'Log Out', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}, { width: 120, height: 45, fontSize: 16 });
    // --- Primary actions: two Wooden-Gold plank buttons, Start bigger than Chapters ---
    const startBtn = createWoodButton(this, cx, 300, 'Start Adventure', () => {
      startBtn.image.disableInteractive();
      chapterBtn.image.disableInteractive();
      journalBtn.image.disableInteractive();
      this.registry.set('selectedCharacter', 'hiraya');
      curtainClose(this, () => this.scene.start('Prologue'));
    }, { width: 340, height: 100, fontSize: 30 });

    // Chapters and Journal share the row under Start (together about as wide as Start).
    const chapterBtn = createWoodButton(this, cx - 86, 406, 'Chapters', () => {
      this.showChapterSelect();
    }, { width: 168, height: 70, fontSize: 22 });

    // Opens Lolo's Journal (journalBook.js). Pages the player has collected are
    // readable; the rest show as sealed. The Menu is paused while it is open.
    const journalBtn = createWoodButton(this, cx + 86, 406, 'Journal', () => {
      openJournalBook(this);
    }, { width: 168, height: 70, fontSize: 22 });

    // --- Secondary actions: round Wooden-Gold icon buttons (Settings / Sound / About) ---
    const iconY = 486;

    createIconButton(this, cx - 110, iconY, 'wood-icon-settings', () => {
      this.scene.start('Settings');
    }, { size: 60, caption: 'Settings' });

    // Sound toggle - mutes/restores the menu music via the same registry
    // value (musicVolume) the Settings screen's Music row already drives,
    // so the two stay in sync no matter which one the player uses.
    const isMuted = () => (this.registry.get('musicVolume') ?? 0.5) <= 0;
    const soundBtn = createIconButton(
      this, cx, iconY, isMuted() ? 'wood-icon-sound-off' : 'wood-icon-sound-on',
      () => {
        if (isMuted()) {
          const restore = this.registry.get('_musicVolumeBeforeMute');
          SoundManager.setMusicVolume(this, restore > 0 ? restore : 0.5);
        } else {
          this.registry.set('_musicVolumeBeforeMute', this.registry.get('musicVolume'));
          SoundManager.setMusicVolume(this, 0);
        }
        soundBtn.image.setTexture(isMuted() ? 'wood-icon-sound-off' : 'wood-icon-sound-on');
      },
      { size: 60, caption: 'Sound' }
    );

    createIconButton(this, cx + 110, iconY, 'wood-icon-info', () => {
      this.scene.start('About');
    }, { size: 60, caption: 'About' });
  }

  // Chapter-select modal: lists every chapter, in story order, from the
  // shared ChapterProgress list. Only chapters the player has actually
  // reached are playable here - the rest show up locked - and that unlock
  // state is read straight from localStorage (via ChapterProgress), so it
  // survives page reloads instead of resetting like the in-memory registry.
  showChapterSelect() {
  const { width, height } = this.scale;

  const candidates = ChapterProgress.CHAPTER_ORDER.filter(
    (c) => !!this.scene.manager.keys[c.key]
  );

  // Chapter 6: ipinapakita lang, naka-lock palagi
  const rows = candidates.concat([{ label: 'Chapter 6', comingSoon: true }]);

  const container = this.add.container(0, 0).setDepth(2000);
  const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55)
    .setInteractive();

  const rowH = 44;
  const panelH = 96 + rows.length * rowH;
  const panel = this.add.rectangle(width / 2, height / 2, 320, panelH, 0x20222a, 1)
    .setStrokeStyle(3, 0xd8b04a);
  const top = height / 2 - panelH / 2;

  const title = this.add.text(width / 2, top + 30, 'Chapters', {
    fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, color: '#fff8e7'
  }).setOrigin(0.5);
  const sub = this.add.text(width / 2, top + 54, 'Jump back into any chapter you\u2019ve reached', {
    fontFamily: '"Tildunk", sans-serif', fontSize: 11, color: '#c9cdd6', fontStyle: 'italic'
  }).setOrigin(0.5);

  container.add([overlay, panel, title, sub]);

  rows.forEach((c, i) => {
    const y = top + 84 + i * rowH;
    const unlocked = !c.comingSoon && ChapterProgress.isUnlocked(c.key);

    if (unlocked) {
      const { rect, txt } = createButton(this, width / 2, y, `\u2713 ${c.label}`, () => {
        container.destroy();
        curtainClose(this, () => this.scene.start(c.key));
      }, { width: 260, height: 34, fontSize: 14 });
      container.add([rect, txt]);
    } else {
      const rect = this.add.rectangle(width / 2, y, 260, 34, 0x33363f, 0.7)
        .setStrokeStyle(2, 0x555a66);
      const label = c.comingSoon ? `\u{1F512} ${c.label} (Coming soon)` : `\u{1F512} ${c.label}`;
      const txt = this.add.text(width / 2, y, label, {
        fontFamily: '"Tildunk", Georgia, serif', fontSize: 14, color: '#9aa0aa'
      }).setOrigin(0.5);
      container.add([rect, txt]);
    }
  });

  const { rect: closeRect, txt: closeTxt } = createButton(this, width / 2, top + panelH - 28, 'Close', () => {
    container.destroy();
  }, { width: 120, height: 32, fontSize: 13, color: 0x555a66, hoverColor: 0x6b7180 });
  container.add([closeRect, closeTxt]);
}
}