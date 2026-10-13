class SettingsScene extends Phaser.Scene {
  constructor() {
    super('Settings');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x20222a);
    this.add.text(width / 2, 40, 'SETTINGS', {
      fontFamily: '"Tildunk", Georgia, serif',
      fontSize: 34,
      color: '#fff8e7'
    }).setOrigin(0.5);

    const labelStyle = { fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#c9cdd6' };

    this.add.text(width / 2, 100, 'Movement Speed', labelStyle).setOrigin(0.5);
    this.makeOptionRow(
      [['Slow', 110], ['Normal', 160], ['Fast', 220]],
      width / 2, 136, 'playerSpeed'
    );

    this.add.text(width / 2, 184, 'Music', labelStyle).setOrigin(0.5);
    this.makeOptionRow(
      [['Off', 0], ['Low', 0.3], ['Normal', 0.5]],
      width / 2, 220, 'musicVolume',
      (val) => SoundManager.setMusicVolume(this, val)
    );

    this.add.text(width / 2, 268, 'Sound Effects', labelStyle).setOrigin(0.5);
    this.makeOptionRow(
      [['Off', 0], ['Low', 0.4], ['Normal', 0.7]],
      width / 2, 304, 'sfxVolume',
      (val) => SoundManager.setSfxVolume(this, val)
    );

    createButton(this, width / 2, height - 50, 'Back', () => this.scene.start('Menu'), {
      width: 160, height: 48, fontSize: 20
    });
  }

  // Renders a row of selectable option-buttons bound to a registry key.
  // `onSelect(val)` is optional - called right after the registry is updated,
  // so callers can trigger side effects (e.g. SoundManager volume changes)
  // without this generic helper needing to know about them.
  makeOptionRow(options, centerX, y, regKey, onSelect) {
    const spacing = 160;
    const startX = centerX - ((options.length - 1) * spacing) / 2;
    const stored = this.registry.get(regKey);
    // Highlight the option closest to the stored value, so a value that
    // doesn't exactly match one of the buttons (e.g. an older default) still
    // shows a selection instead of leaving every button unhighlighted.
    const current = stored === undefined
      ? options[0][1]
      : options.reduce((best, [, v]) => Math.abs(v - stored) < Math.abs(best - stored) ? v : best, options[0][1]);
    const buttons = [];

    options.forEach(([label, val], i) => {
      const x = startX + i * spacing;
      // 0x33363f (slate gray) is also this game's "locked/disabled" color
      // elsewhere (see the Chapters list), so using it for an unselected-
      // but-still-clickable option here made every non-active choice read
      // as disabled. A warm brown keeps it clearly part of the wood/parchment
      // UI instead of borrowing the "can't click this" color.
      const rect = this.add.rectangle(x, y, 130, 40, val === current ? 0x9c3b2e : 0x6b4f30, 1)
        .setStrokeStyle(2, 0xf5e2c8)
        .setInteractive({ useHandCursor: true });
      this.add.text(x, y, String(label), {
        fontFamily: '"Tildunk", sans-serif', fontSize: 17, color: '#fff8e7'
      }).setOrigin(0.5);

      rect.on('pointerdown', () => {
        SoundManager.play(this, 'click');
        this.registry.set(regKey, val);
        buttons.forEach(b => b.rect.setFillStyle(b.val === val ? 0x9c3b2e : 0x6b4f30));
        if (onSelect) onSelect(val);
      });

      buttons.push({ rect, val });
    });

    return buttons;
  }
}