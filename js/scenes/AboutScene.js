// About screen, reached from the main menu's "About" button. Has two tabs:
// "About" (what the game is / what it's for) and "Credits" (the team and
// project behind it). Built the same way as the in-scene modals in ui.js -
// a container of children that gets torn down and redrawn when the tab
// changes - rather than two separate Scenes, since it's just static text.
class AboutScene extends Phaser.Scene {
  constructor() {
    super('About');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x20222a);
    this.add.text(width / 2, 40, 'ABOUT', {
      fontFamily: '"Tildunk", Georgia, serif',
      fontSize: 34,
      color: '#fff8e7'
    }).setOrigin(0.5);

    // Tab buttons
    this.tabButtons = {};
    const aboutTab = this.add.rectangle(width / 2 - 90, 84, 160, 38, 0x9c3b2e, 1)
      .setStrokeStyle(2, 0xf5e2c8)
      .setInteractive({ useHandCursor: true });
    const aboutTabTxt = this.add.text(width / 2 - 90, 84, 'About', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 17, color: '#fff8e7'
    }).setOrigin(0.5);

    // 0x33363f (slate gray) is this game's "locked/disabled" color
    // elsewhere (see the Chapters list) - using it for the inactive-but-
    // still-clickable Credits tab made it look disabled, same issue as the
    // Settings option rows (see ui.js/SettingsScene.js for the identical fix).
    const creditsTab = this.add.rectangle(width / 2 + 90, 84, 160, 38, 0x6b4f30, 1)
      .setStrokeStyle(2, 0xf5e2c8)
      .setInteractive({ useHandCursor: true });
    const creditsTabTxt = this.add.text(width / 2 + 90, 84, 'Credits', {
      fontFamily: '"Tildunk", Georgia, serif', fontSize: 17, color: '#fff8e7'
    }).setOrigin(0.5);

    this.tabButtons.about = { rect: aboutTab, txt: aboutTabTxt };
    this.tabButtons.credits = { rect: creditsTab, txt: creditsTabTxt };

    aboutTab.on('pointerdown', () => { SoundManager.play(this, 'click'); this.showTab('about'); });
    creditsTab.on('pointerdown', () => { SoundManager.play(this, 'click'); this.showTab('credits'); });

    this.contentContainer = this.add.container(0, 0);
    this.showTab('about');

    createButton(this, width / 2, height - 44, 'Back', () => this.scene.start('Menu'), {
      width: 160, height: 44, fontSize: 18
    });
  }

  // Highlights the active tab button and redraws the body text below it.
  showTab(tab) {
    this.activeTab = tab;
    Object.entries(this.tabButtons).forEach(([key, { rect }]) => {
      rect.setFillStyle(key === tab ? 0x9c3b2e : 0x6b4f30);
    });

    this.contentContainer.removeAll(true);
    const { width } = this.scale;
    const bodyStyle = {
      fontFamily: '"Tildunk", sans-serif', fontSize: 14, color: '#f5e2c8',
      align: 'center', wordWrap: { width: 580 }, lineSpacing: 8
    };

    if (tab === 'about') {
      const body = this.add.text(width / 2, 132,
        'PATO Explorer is a story-driven exploration game about the history and ' +
        'culture of Pateros. Talk to NPCs based on real historical figures and ' +
        'local residents as you follow the town\u2019s journey from Barrio Aguho to ' +
        'the community it is today.\n\n' +
        'Piece together a journal, one chapter at a time, and discover the ' +
        'river, the town, and the traditions that shaped Pateros - built as a ' +
        'college capstone project, with content drawn from local elders and ' +
        'municipal records.\n\n' +
        'Macario Almeda and Valentin Tuason were real people of Pateros. ' +
        'Their scenes are dramatized: the lines are written for the game ' +
        'and keep to what the historical record says.',
        bodyStyle
      ).setOrigin(0.5, 0);
      this.contentContainer.add(body);
    } else {
      const lines = [
        'A capstone project by:',
        '',
        'Krysta Camelah Epo',
        'Edlyn Rose A. Eugenio',
        'Gabriel Van Soto',
        'Jerosa Trampe',
        '',
        'Institute of Information and Computing Technology',
        'Bachelor of Science in Information Technology',
        'May 2026',
        '',
        'Made with Phaser 3'
      ];
      const body = this.add.text(width / 2, 122, lines.join('\n'), {
        ...bodyStyle, align: 'center'
      }).setOrigin(0.5, 0);
      this.contentContainer.add(body);
    }
  }
}
