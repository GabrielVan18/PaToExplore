class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelect');
  }

  create() {
    const { width, height } = this.scale;
    const CARD_SCALE = 0.34;
    const CARD_W = 477 * CARD_SCALE;
    const CARD_H = 752 * CARD_SCALE;

    const bg = this.add.image(width / 2, height / 2, 'bg-village');
    coverFitImage(bg, width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1206, 0.5);

    this.add.text(width / 2, 44, 'Choose Your Explorer', {
      fontFamily: '"Tildunk", Georgia, serif',
      fontSize: 32,
      color: '#fff8e7'
    }).setOrigin(0.5).setShadow(2, 3, '#00000066', 4, true, true);

    const leftX = width / 2 - 170;
    const rightX = width / 2 + 170;
    const cardY = height / 2 + 6;

    this.cards = {
      hiraya: this.add.image(leftX, cardY, 'card-hiraya').setScale(CARD_SCALE).setInteractive({ useHandCursor: true }),
      liwayway: this.add.image(rightX, cardY, 'card-liwayway').setScale(CARD_SCALE).setInteractive({ useHandCursor: true })
    };

    this.highlight = this.add.rectangle(leftX, cardY, CARD_W + 16, CARD_H + 16)
      .setStrokeStyle(5, 0xffd25c);
    this.highlight.setFillStyle(0x000000, 0);

    Object.entries(this.cards).forEach(([key, img]) => {
      img.on('pointerover', () => { if (this.selected !== key) img.setScale(CARD_SCALE * 1.03); });
      img.on('pointerout', () => { if (this.selected !== key) img.setScale(CARD_SCALE); });
      img.on('pointerdown', () => this.selectCharacter(key));
    });

    this.selectCharacter(this.registry.get('selectedCharacter') || 'hiraya');

    createButton(this, 110, height - 40, 'Back', () => this.scene.start('Menu'), {
      width: 150, height: 46, fontSize: 18
    });

    createButton(this, width - 110, height - 40, 'Play', () => {
      this.registry.set('selectedCharacter', this.selected);
      this.scene.start('Chapter1');
    }, { width: 170, height: 50, fontSize: 22, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
  }

  selectCharacter(key) {
    this.selected = key;
    const img = this.cards[key];
    this.highlight.x = img.x;
    this.highlight.y = img.y;

    Object.entries(this.cards).forEach(([k, image]) => {
      image.setScale(k === key ? 0.34 * 1.05 : 0.34);
    });
  }
}
