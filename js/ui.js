// Small shared helpers so Menu / Settings / Chapter1 scenes
// don't each re-implement the same button/background code.

/**
 * Creates a clickable rectangle+label button with hover/press feedback.
 * Returns { rect, txt } in case the caller wants to reposition/restyle it later.
 */
function createButton(scene, x, y, label, onClick, opts = {}) {
  const w = opts.width ?? 220;
  const h = opts.height ?? 56;
  const fontSize = opts.fontSize ?? 26;
  const color = opts.color ?? 0x9c3b2e;
  const hoverColor = opts.hoverColor ?? 0xc24a38;
  const alpha = opts.alpha ?? 0.92;

  const rect = scene.add.rectangle(x, y, w, h, color, alpha)
    .setStrokeStyle(3, 0xf5e2c8)
    .setInteractive({ useHandCursor: true })
    .setScrollFactor(0);

  const txt = scene.add.text(x, y, label, {
    fontFamily: '"Tildunk", Georgia, serif',
    fontSize,
    color: '#fff8e7',
    align: 'center',
    // Buttons here always had a fixed pixel width, but some callers (quiz
    // answer options especially) can hand this a label much longer than
    // that width at this fontSize - without a wrap constraint the text just
    // renders past the rectangle on both sides instead of onto a second
    // line, spilling over whatever sits next to the button.
    wordWrap: { width: w - 24 }
  }).setOrigin(0.5).setScrollFactor(0);

  rect.on('pointerover', () => rect.setFillStyle(hoverColor, alpha));
  rect.on('pointerout', () => rect.setFillStyle(color, alpha));
  rect.on('pointerdown', () => { rect.setScale(0.96); txt.setScale(0.96); });
  rect.on('pointerup', () => { rect.setScale(1); txt.setScale(1); SoundManager.play(scene, 'click'); onClick(); });

  return { rect, txt };
}

/**
 * Wooden-Gold UI icon pack - image-based button for the Main Menu.
 * Stretches the 'wood-btn-long' plank texture to (width, height) and lays
 * the label on top, with a slight scale-up on hover and scale-down on press
 * (image buttons don't have a flat fill color to swap like createButton's
 * rectangles, so the "feedback" is motion instead of color).
 * Returns { image, txt } so the caller can reposition/restyle later.
 */
function createWoodButton(scene, x, y, label, onClick, opts = {}) {
  const w = opts.width ?? 260;
  const h = opts.height ?? 84;
  const fontSize = opts.fontSize ?? 28;
  const textureKey = opts.textureKey ?? 'wood-btn-long';

  const image = scene.add.image(x, y, textureKey)
    .setDisplaySize(w, h)
    .setInteractive({ useHandCursor: true })
    .setScrollFactor(0);

  const txt = scene.add.text(x, y - 2, label, {
    fontFamily: '"Tildunk", Georgia, serif',
    fontSize,
    color: '#4a2a12',
    fontStyle: 'bold'
  }).setOrigin(0.5).setScrollFactor(0);

  const baseScale = { x: image.scaleX, y: image.scaleY };
  const setScaleMul = (m) => {
    image.setScale(baseScale.x * m, baseScale.y * m);
    txt.setScale(m);
  };

  image.on('pointerover', () => setScaleMul(1.045));
  image.on('pointerout', () => setScaleMul(1));
  image.on('pointerdown', () => setScaleMul(0.94));
  image.on('pointerup', () => { setScaleMul(1.045); SoundManager.play(scene, 'click'); onClick(); });

  return { image, txt };
}

/**
 * Wooden-Gold UI icon pack - small round icon-only button (Settings, About,
 * Sound toggle, ...) for the Main Menu. `textureKey` is one of the
 * 'wood-icon-*' keys loaded in PreloadScene. Optional `caption` prints a
 * short label underneath, since icon-only buttons can be ambiguous on their
 * own. Same hover/press motion feedback as createWoodButton.
 * Returns { image, caption? } - caption is only present if opts.caption was given.
 */
function createIconButton(scene, x, y, textureKey, onClick, opts = {}) {
  const size = opts.size ?? 64;

  const image = scene.add.image(x, y, textureKey)
    .setDisplaySize(size, size)
    .setInteractive({ useHandCursor: true })
    .setScrollFactor(0);

  const baseScale = { x: image.scaleX, y: image.scaleY };
  const setScaleMul = (m) => image.setScale(baseScale.x * m, baseScale.y * m);

  image.on('pointerover', () => setScaleMul(1.08));
  image.on('pointerout', () => setScaleMul(1));
  image.on('pointerdown', () => setScaleMul(0.92));
  image.on('pointerup', () => { setScaleMul(1.08); SoundManager.play(scene, 'click'); onClick(); });

  let captionTxt = null;
  if (opts.caption) {
    captionTxt = scene.add.text(x, y + size / 2 + 14, opts.caption, {
      fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#f5e2c8'
    }).setOrigin(0.5).setScrollFactor(0).setShadow(1, 1, '#00000088', 2, true, true);
  }

  return { image, caption: captionTxt };
}

/**
 * Returns a shuffled COPY of a quiz question object: `options` in a random
 * order and `correct` remapped to that answer's new index. Doesn't touch the
 * original qData, so re-running a chapter reshuffles fresh each time instead
 * of drifting further with every replay.
 */
function shuffleQuizOptions(qData) {
  const order = qData.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...qData,
    options: order.map((originalIndex) => qData.options[originalIndex]),
    correct: order.indexOf(qData.correct)
  };
}

/** Scales an image up just enough to cover a width x height area (like CSS background-size: cover). */
function coverFitImage(image, width, height) {
  const scale = Math.max(width / image.width, height / image.height);
  image.setScale(scale);
  return image;
}

/**
 * Bottom-of-screen dialogue box that advances line-by-line, like a classic RPG.
 * `lines` is an array of strings (short lines, per the story doc's "don't make the
 * player read a wall of text" guidance). Advance by clicking the box or pressing SPACE.
 * Calls onComplete() once the last line has been dismissed.
 *
 * `portraits` (optional) shows a speaker bust in the top-right corner, overlapping
 * the panel like a classic VN portrait. Pass a single texture key to keep it fixed,
 * or an array (one entry per line) to swap the pose as the dialogue progresses -
 * e.g. a wave on the greeting line, a talking pose on story lines, a wink on a
 * playful/task-giving line. Missing/undefined entries repeat the last valid pose.
 */
function showDialogue(scene, speaker, lines, onComplete, portraits) {
   const { width, height } = scene.scale;
   const panelH = 128;
   const panelY = height - panelH / 2 - 10;
   const panelTop = panelY - panelH / 2;
   // scrollFactor 0 so the dialogue box stays pinned to the screen even in
   // scenes where the camera is following the player around a scrolling map
   const container = scene.add.container(0, 0).setDepth(10500).setScrollFactor(0);

  const panel = scene.add.rectangle(width / 2, panelY, width - 40, panelH, 0x2c2f37, 0.96)
    .setStrokeStyle(3, 0xf5e2c8);
  // The name tag used to sit exactly on panelTop (the panel's top border),
  // which put half its height above the panel - overlapping the world
  // scene rendered behind/above the dialogue box instead of reading as
  // part of the box. Nudged down so it's still a "tab" poking up slightly,
  // but sits mostly inside the panel instead of mostly outside it.
  const nameTagY = panelTop + 14;
  const nameTag = scene.add.rectangle(90, nameTagY, 140, 32, 0x9c3b2e, 0.96)
    .setStrokeStyle(2, 0xf5e2c8);
  const nameTxt = scene.add.text(90, nameTagY, speaker, {
    fontFamily: '"Tildunk", Georgia, serif', fontSize: 16, color: '#fff8e7'
  }).setOrigin(0.5);

  // --- optional speaker portrait, top-right, overlapping the panel's top edge ---
  // Fixed card size/position (never changes between poses) - each portrait image
  // is contain-fit inside it (scaled to fill the box without cropping, centered),
  // so swapping poses mid-dialogue never makes the box grow/shrink/shift.
  // Geometry computed up front (before bodyTxt) so the text's word-wrap width
  // can stop short of the portrait's left edge instead of running underneath
  // it - previously the wrap width used the full panel width regardless of
  // whether a portrait was showing, so a long first line would render
  // partly hidden behind the picture (see setPortrait below for the image itself).
  const PORTRAIT_BOX_W = 120;
  const PORTRAIT_BOX_H = 176;
  const FRAME_PAD = 16;
  const frameCenterX = (width - 34) - PORTRAIT_BOX_W / 2;
  const frameCenterY = (panelTop + 24) - PORTRAIT_BOX_H / 2;
  const frameLeftEdge = frameCenterX - (PORTRAIT_BOX_W + FRAME_PAD) / 2;

  const bodyTextX = 40 + 20;
  const bodyWrapWidth = portraits
    ? Math.max(160, frameLeftEdge - bodyTextX - 16)
    : width - 100;
  // Text used to start right at panelTop + 18, almost flush with the name
  // tag above it (which itself used to overlap the panel's border - see
  // nameTagY). Now that the tag sits lower/more enclosed, give the body
  // text a bit more clearance below it too.
  const bodyTxt = scene.add.text(bodyTextX, panelTop + 40, '', {
    fontFamily: '"Tildunk", sans-serif', fontSize: 17, color: '#f5e2c8',
    wordWrap: { width: bodyWrapWidth }
  }).setOrigin(0, 0);
  const hint = scene.add.text(width - 60, panelY + panelH / 2 - 14, '▶ space / click', {
    fontFamily: '"Tildunk", sans-serif', fontSize: 12, color: '#9aa0aa'
  }).setOrigin(1, 1);

  container.add([panel, nameTag, nameTxt, bodyTxt, hint]);
  panel.setInteractive().setScrollFactor(0);

  let portrait = null;
  let portraitFrame = null;

  const setPortrait = (key) => {
    if (!key) return;
    if (!portrait) {
      portraitFrame = scene.add.rectangle(
        frameCenterX, frameCenterY,
        PORTRAIT_BOX_W + FRAME_PAD, PORTRAIT_BOX_H + FRAME_PAD,
        0x2c2f37, 0.9
      ).setStrokeStyle(3, 0xf5e2c8);
      portrait = scene.add.image(frameCenterX, frameCenterY, key);
      container.add([portraitFrame, portrait]);
    } else {
      portrait.setTexture(key);
    }
    // contain-fit: scale by whichever axis is tighter so the art always sits
    // fully inside the fixed box, centered, with no cropping either way.
    const scale = Math.min(PORTRAIT_BOX_W / portrait.width, PORTRAIT_BOX_H / portrait.height);
    portrait.setScale(scale);
    portrait.setPosition(frameCenterX, frameCenterY);
  };

  // --- typewriter effect: reveals the line a character at a time, like a
  // classic RPG/VN textbox. Pressing space or clicking while it's still
  // typing instantly fills in the rest of the line (Pokemon-style "hold A
  // to skip the crawl"); pressing again once it's fully shown advances to
  // the next line.
  const TYPE_MS_PER_CHAR = 22;
  let i = 0;
  let typing = false;
  let typeTimer = null;
  let currentLine = '';
  let charIndex = 0;

  // `cutSound` = true cuts the dialogue sound off immediately. That's used when
  // the player skips the line or the dialogue closes. When a line simply
  // finishes typing on its own we let the sound play out instead, so a
  // slightly longer sound isn't chopped off mid-way.
  const stopTyping = (cutSound = false) => {
    if (typeTimer) { typeTimer.remove(false); typeTimer = null; }
    typing = false;
    if (cutSound) SoundManager.stopTypeBlip();
  };

  const completeLine = () => {
    stopTyping(true);
    bodyTxt.setText(currentLine);
  };

  const typeNextChar = () => {
    charIndex++;
    bodyTxt.setText(currentLine.slice(0, charIndex));
    // NOTE: no sound per letter anymore - the dialogue sound now plays just
    // ONCE per line (see showLine), because a blip on every letter sounded
    // like gibberish.
    if (charIndex >= currentLine.length) stopTyping();
  };

  const showLine = () => {
    currentLine = lines[i];
    charIndex = 0;
    bodyTxt.setText('');
    if (portraits) {
      const key = Array.isArray(portraits) ? (portraits[i] ?? portraits[portraits.length - 1]) : portraits;
      setPortrait(key);
    }
    typing = true;
    typeTimer = scene.time.addEvent({ delay: TYPE_MS_PER_CHAR, callback: typeNextChar, loop: true });
    // One dialogue sound per line (script), played as the line starts.
    SoundManager.playTypeBlip(scene);
  };
  showLine();

  const advance = () => {
    SoundManager.play(scene, 'click');
    // First press while typing: skip straight to the full line.
    if (typing) {
      completeLine();
      return;
    }
    // Line's already fully shown - move on to the next one.
    i++;
    if (i >= lines.length) {
      stopTyping(true);
      panel.off('pointerdown', advance);
      scene.input.keyboard.off('keydown-SPACE', advance);
      container.destroy();
      onComplete && onComplete();
    } else {
      showLine();
    }
  };

  panel.on('pointerdown', advance);
  scene.input.keyboard.on('keydown-SPACE', advance);
}

/**
 * Reusable Movement Speed / Music / SFX picker row, bound to a
 * registry key - same widget SettingsScene uses, factored out so the
 * in-gameplay pause menu's Settings modal (see showSettingsModal below) can
 * render identical rows without duplicating the button/highlight logic.
 * `onSelect(val)` is optional - called right after the registry is updated.
 */
function makeSettingsOptionRow(scene, options, centerX, y, regKey, onSelect) {
  const spacing = 160;
  const startX = centerX - ((options.length - 1) * spacing) / 2;
  const stored = scene.registry.get(regKey);
  // Highlight the option closest to the stored value, so a value that
  // doesn't exactly match one of the buttons still shows a selection.
  const current = stored === undefined
    ? options[0][1]
    : options.reduce((best, [, v]) => Math.abs(v - stored) < Math.abs(best - stored) ? v : best, options[0][1]);
  const buttons = [];
  const objects = [];

  options.forEach(([label, val], i) => {
    const x = startX + i * spacing;
    // Same reasoning as SettingsScene's identical row: 0x33363f doubles as
    // this game's "locked/disabled" color (see the Chapters list), so an
    // unselected-but-clickable option shouldn't borrow it - use the warm
    // brown instead, or every non-active choice reads as disabled.
    const rect = scene.add.rectangle(x, y, 130, 40, val === current ? 0x9c3b2e : 0x6b4f30, 1)
      .setStrokeStyle(2, 0xf5e2c8)
      .setInteractive({ useHandCursor: true })
      .setScrollFactor(0);
    const txt = scene.add.text(x, y, String(label), {
      fontFamily: '"Tildunk", sans-serif', fontSize: 17, color: '#fff8e7'
    }).setOrigin(0.5).setScrollFactor(0);
    objects.push(rect, txt);

    rect.on('pointerdown', () => {
      SoundManager.play(scene, 'click');
      scene.registry.set(regKey, val);
      buttons.forEach(b => b.rect.setFillStyle(b.val === val ? 0x9c3b2e : 0x6b4f30));
      if (onSelect) onSelect(val);
    });

    buttons.push({ rect, val });
  });

  return objects;
}

/**
 * In-gameplay Settings modal - opened from the pause menu (see
 * showPauseMenu). Deliberately mirrors SettingsScene's look/options exactly
 * (same rows, same registry keys) but as a modal drawn straight into the
 * *current* scene instead of switching to a separate Scene, so there's no
 * scene-manager hand-off to get wrong and the paused chapter underneath
 * keeps all its state untouched. "Back" just closes the modal and resumes,
 * same as Continue on the pause menu.
 */
function showSettingsModal(scene) {
  const { width, height } = scene.scale;
  const container = scene.add.container(0, 0).setDepth(10500).setScrollFactor(0);

  // Solid (not translucent) backdrop, same color as SettingsScene, so this
  // reads as "the settings screen" rather than a see-through overlay.
  const bg = scene.add.rectangle(width / 2, height / 2, width, height, 0x20222a, 1)
    .setInteractive()
    .setScrollFactor(0);
  const title = scene.add.text(width / 2, 40, 'SETTINGS', {
    fontFamily: '"Tildunk", Georgia, serif', fontSize: 34, color: '#fff8e7'
  }).setOrigin(0.5);
  container.add([bg, title]);

  const labelStyle = { fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#c9cdd6' };
  const addLabel = (y, text) => container.add(
    scene.add.text(width / 2, y, text, labelStyle).setOrigin(0.5).setScrollFactor(0)
  );

  addLabel(100, 'Movement Speed');
  container.add(makeSettingsOptionRow(scene,
    [['Slow', 110], ['Normal', 160], ['Fast', 220]], width / 2, 136, 'playerSpeed',
    // Chapter scenes cache the speed on `scene.speed` once in create() and
    // read it into player velocity every frame from there (not from the
    // registry directly) - so without this, picking a new speed here
    // updated the saved setting but had no visible effect until the player
    // left and re-entered the chapter. Setting it live on the scene fixes
    // that, same as the onSelect callbacks already used for music/sfx above.
    (val) => { if (typeof scene.speed === 'number') scene.speed = val; }));

  addLabel(184, 'Music');
  container.add(makeSettingsOptionRow(scene,
    [['Off', 0], ['Low', 0.3], ['Normal', 0.5]], width / 2, 220, 'musicVolume',
    (val) => SoundManager.setMusicVolume(scene, val)));

  addLabel(268, 'Sound Effects');
  container.add(makeSettingsOptionRow(scene,
    [['Off', 0], ['Low', 0.4], ['Normal', 0.7]], width / 2, 304, 'sfxVolume',
    (val) => SoundManager.setSfxVolume(scene, val)));

  const { rect, txt } = createButton(scene, width / 2, height - 50, 'Back', () => {
    container.destroy();
    scene.locked = false;
  }, { width: 160, height: 48, fontSize: 20 });
  container.add([rect, txt]);
}

/**
 * In-gameplay pause modal shown when the player opens the Menu (ESC key or
 * the on-screen Menu button) mid-chapter. Offers Continue / Settings / Exit
 * to Main Menu - unlike the old behavior, opening the menu no longer drops
 * the player straight back to the title screen; only "Exit" does that.
 *
 * Caller contract (same convention as the Task/Journal modals elsewhere):
 * set `scene.locked = true` right before calling this, guarded by
 * `!scene.locked` so it can't be opened on top of another modal/dialogue.
 * Continue restores `scene.locked = false` itself.
 */
function showPauseMenu(scene) {
  const { width, height } = scene.scale;
  const container = scene.add.container(0, 0).setDepth(10500).setScrollFactor(0);
  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55)
    .setInteractive()
    .setScrollFactor(0);
  const panelH = 250;
  const panel = scene.add.rectangle(width / 2, height / 2, 300, panelH, 0xfff8e7, 1)
    .setStrokeStyle(4, 0x9c3b2e);
  const top = height / 2 - panelH / 2;

  const title = scene.add.text(width / 2, top + 34, 'Paused', {
    fontFamily: '"Tildunk", Georgia, serif', fontSize: 24, color: '#9c3b2e', fontStyle: 'bold'
  }).setOrigin(0.5);

  container.add([overlay, panel, title]);

  const { rect: cRect, txt: cTxt } = createButton(scene, width / 2, top + 92, 'Continue', () => {
    container.destroy();
    scene.locked = false;
  }, { width: 200, height: 44, fontSize: 17 });

  const { rect: sRect, txt: sTxt } = createButton(scene, width / 2, top + 146, 'Settings', () => {
    container.destroy();
    showSettingsModal(scene);
  }, { width: 200, height: 44, fontSize: 17 });

  const { rect: eRect, txt: eTxt } = createButton(scene, width / 2, top + 200, 'Exit to Main Menu', () => {
    container.destroy();
    curtainClose(scene, () => scene.scene.start('Menu'));
  }, { width: 200, height: 44, fontSize: 15, color: 0x555a66, hoverColor: 0x6b7180 });

  container.add([cRect, cTxt, sRect, sTxt, eRect, eTxt]);
}

/**
 * Theater-curtain scene transition. Two panels (each a Container so its dark
 * fabric + gold trim move together as one) slide in from off-screen to meet
 * at center (curtainClose) or slide back out to reveal the scene
 * (curtainOpen). Depth 11000 keeps them above everything else, including
 * other modals, so a close→switch-scene→open pairing always reads as one
 * continuous transition rather than a hard cut.
 */
function makeCurtainSide(scene, panelW, height, startX, trimOnRight) {
   const container = scene.add.container(startX, height / 2).setScrollFactor(0).setDepth(11000);
   const fabric = scene.add.image(0, 0, 'curtain-fabric');
   coverFitImage(fabric, panelW, height);
   // Mirror the right-hand panel so the folds read as one continuous
   // curtain meeting in the middle, rather than the same crop repeated twice.
   if (!trimOnRight) fabric.setFlipX(true);
   const trimX = trimOnRight ? panelW / 2 : -panelW / 2;
   const trim = scene.add.rectangle(trimX, 0, 5, height, 0xf5e2c8);
   container.add([fabric, trim]);
   return container;
}

/**
 * Slides two curtain panels together to fully cover the screen, then calls
 * onComplete. Destroys its own panels right after onComplete runs - every
 * existing caller immediately does scene.start(...) inside onComplete
 * anyway (which would tear these down as a side effect of killing the
 * whole scene), but a caller that stays on the SAME scene and pairs this
 * with curtainOpen() right after (rather than switching scenes) needs
 * these gone explicitly, or curtainOpen's own panels finish sliding away
 * to reveal... this original pair still sitting there, stuck fully closed.
 */
function curtainClose(scene, onComplete) {
  const { width, height } = scene.scale;
  const panelW = width / 2 + 6;
  const left = makeCurtainSide(scene, panelW, height, -width / 2, true);
  const right = makeCurtainSide(scene, panelW, height, width * 1.5, false);

  SoundManager.play(scene, 'curtain-close');
  scene.tweens.add({ targets: left, x: width / 4, duration: 550, ease: 'Cubic.easeIn' });
  scene.tweens.add({
    targets: right, x: width * 3 / 4, duration: 550, ease: 'Cubic.easeIn',
    onComplete: () => {
      onComplete && onComplete();
      left.destroy();
      right.destroy();
    }
  });
}

/**
 * Starts with the screen fully covered, then slides the curtain panels
 * apart to reveal it. onComplete (optional) fires once both panels have
 * fully cleared the screen - scenes use this to hold their opening
 * dialogue until the curtain has actually finished opening, rather than
 * having the NPC start talking (and the typewriter/blip sound start)
 * while still hidden behind the still-sliding fabric.
 */
function curtainOpen(scene, onComplete) {
  const { width, height } = scene.scale;
  const panelW = width / 2 + 6;
  const left = makeCurtainSide(scene, panelW, height, width / 4, true);
  const right = makeCurtainSide(scene, panelW, height, width * 3 / 4, false);

  // Delayed to match the tweens' own 150ms delay below, so the whoosh lands
  // right as the panels actually start sliding apart, not before.
  scene.time.delayedCall(150, () => SoundManager.play(scene, 'curtain-open'));
  scene.tweens.add({
    targets: left, x: -width / 2, duration: 650, delay: 150, ease: 'Cubic.easeOut',
    onComplete: () => left.destroy()
  });
  scene.tweens.add({
    targets: right, x: width * 1.5, duration: 650, delay: 150, ease: 'Cubic.easeOut',
    onComplete: () => { right.destroy(); onComplete && onComplete(); }
  });
}

/**
 * Small non-blocking banner that slides in from the top, sits for a moment,
 * then fades itself out - for nudges like "go talk to so-and-so now" where a
 * full showInfoPopup (dead-center, click-to-dismiss, locks input) would be
 * more interruption than the moment needs. Doesn't touch scene.locked, so
 * the player can keep walking while it's up.
 */
function showToast(scene, text, duration = 2600) {
  const { width } = scene.scale;
  const y = 64;
  const container = scene.add.container(width / 2, y - 30).setDepth(10400).setScrollFactor(0).setAlpha(0);

  const txt = scene.add.text(0, 0, text, {
    fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#fff8e7', fontStyle: 'bold'
  }).setOrigin(0.5);
  const panel = scene.add.rectangle(0, 0, txt.width + 44, 44, 0x9c3b2e, 0.95)
    .setStrokeStyle(2, 0xf5e2c8);

  container.add([panel, txt]);

  scene.tweens.add({
    targets: container, y, alpha: 1, duration: 260, ease: 'Cubic.easeOut',
    onComplete: () => {
      scene.time.delayedCall(duration, () => {
        scene.tweens.add({
          targets: container, alpha: 0, y: y - 16, duration: 320, ease: 'Cubic.easeIn',
          onComplete: () => container.destroy()
        });
      });
    }
  });

  return container;
}

/**
 * Small centered info popup for object interactions - a title + a couple sentences
 * of "you don't feel like you're studying" educational content, with an OK button.
 */
function showInfoPopup(scene, title, body, onClose) {
   const { width, height } = scene.scale;
   // scrollFactor 0 so the popup stays pinned to the screen even in scenes
   // where the camera is following the player around a scrolling map
   const container = scene.add.container(0, 0).setDepth(10500).setScrollFactor(0);

  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.35)
    .setInteractive()
    .setScrollFactor(0);
  const panel = scene.add.rectangle(width / 2, height / 2, 460, 200, 0xfff8e7, 1)
    .setStrokeStyle(4, 0x9c3b2e);
  const titleTxt = scene.add.text(width / 2, height / 2 - 62, title, {
    fontFamily: '"Tildunk", Georgia, serif', fontSize: 20, color: '#9c3b2e', fontStyle: 'bold'
  }).setOrigin(0.5);
  const bodyTxt = scene.add.text(width / 2, height / 2 - 20, body, {
    fontFamily: '"Tildunk", sans-serif', fontSize: 16, color: '#3b2410', align: 'center',
    wordWrap: { width: 400 }
  }).setOrigin(0.5, 0);

  container.add([overlay, panel, titleTxt, bodyTxt]);

  const { rect, txt } = createButton(scene, width / 2, height / 2 + 76, 'OK', () => {
    container.destroy();
    onClose && onClose();
  }, { width: 120, height: 40, fontSize: 16 });
  container.add([rect, txt]);
}

/**
 * "Found it" popup with the item's icon on top - same cream/maroon panel
 * Chapter 5 uses for its traditions, now shared so Prologue / Chapters 1-3
 * can show it too. `o` is the interactable object: it needs `name` and
 * `info`, and the icon comes from `o.iconKey` if set, otherwise from the
 * texture of `o.rect` (the on-map sprite). If there's no icon texture at
 * all (e.g. the object fell back to a plain rectangle), it quietly falls
 * back to the old text-only showInfoPopup(), so a missing PNG can never
 * block the interaction. `onClose` runs exactly once, on dismiss
 * (Continue button, or E / Space / Enter).
 */
function showFoundItemPopup(scene, o, onClose) {
  SoundManager.play(scene, 'found');

  const texKey = o.iconKey || (o.rect && o.rect.texture && o.rect.texture.key);
  if (!texKey || texKey === '__DEFAULT' || texKey === '__MISSING' || !scene.textures.exists(texKey)) {
    showInfoPopup(scene, o.name.toUpperCase(), o.info, onClose);
    return;
  }

  const { width, height } = scene.scale;
  const iconSize = Phaser.Math.Clamp(height - 300, 96, 160);
  const panelW = 500;

  // Build the text first so the panel can grow to fit longer descriptions.
  const info = scene.add.text(0, 0, o.info || '', {
    fontFamily: '"Tildunk", sans-serif', fontSize: 15, color: '#3b2410', align: 'center',
    wordWrap: { width: panelW - 60 }
  }).setOrigin(0.5, 0).setScrollFactor(0);
  const panelH = iconSize + 190 + info.height;
  const top = height / 2 - panelH / 2;

  const container = scene.add.container(0, 0).setDepth(10500).setScrollFactor(0);
  const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55)
    .setInteractive().setScrollFactor(0);
  const panel = scene.add.rectangle(width / 2, height / 2, panelW, panelH, 0xfff8e7, 1)
    .setStrokeStyle(4, 0x9c3b2e).setScrollFactor(0);

  const iconY = top + 32 + iconSize / 2;
  const plate = scene.add.rectangle(width / 2, iconY, iconSize + 20, iconSize + 20, 0xf5e2c8, 1)
    .setStrokeStyle(3, 0xd8b04a).setScrollFactor(0);
  const icon = scene.add.image(width / 2, iconY, texKey).setScrollFactor(0);
  const iconScale = iconSize / Math.max(icon.width, icon.height);
  icon.setScale(iconScale * 0.6);
  scene.tweens.add({ targets: icon, scale: iconScale, duration: 260, ease: 'Back.Out' });

  const title = scene.add.text(width / 2, top + iconSize + 64, o.name.toUpperCase(), {
    fontFamily: '"Tildunk", Georgia, serif', fontSize: 22, color: '#9c3b2e', fontStyle: 'bold'
  }).setOrigin(0.5).setScrollFactor(0);
  info.setPosition(width / 2, top + iconSize + 92);

  container.add([overlay, panel, plate, icon, title, info]);

  let closed = false;
  const closeKeys = ['keydown-E', 'keydown-SPACE', 'keydown-ENTER'];
  const close = () => {
    if (closed) return;
    closed = true;
    closeKeys.forEach(k => scene.input.keyboard.off(k, close));
    container.destroy();
    if (onClose) onClose();
  };

  const { rect, txt } = createButton(scene, width / 2, top + panelH - 36, 'Continue', close,
    { width: 190, height: 44, fontSize: 17, color: 0x3c7a3e, hoverColor: 0x4c9a4e });
  container.add([rect, txt]);

  // Keyboard dismiss is armed after a beat so the very E press that opened
  // the popup can't close it again in the same breath.
  scene.time.delayedCall(250, () => {
    if (!closed) closeKeys.forEach(k => scene.input.keyboard.on(k, close));
  });
}

/**
 * How close (in px) the player has to be to an object's *edge* to interact
 * with it. Measured from the player's collision body (her feet/legs) to the
 * nearest point of the object's on-screen rectangle, so it works the same
 * from the top, bottom, left and right no matter how big the object is.
 * (The old check was centre-to-centre with a flat 80px radius, which is
 * too short from above tall objects: the body can't get any closer than
 * half the object's height + the gap between her body and sprite centre.)
 */
const OBJECT_INTERACT_REACH = 40;

function interactGapToObject(player, target) {
  const b = target.getBounds();
  const c = player.body ? player.body.center : player;
  const dx = Math.max(b.left - c.x, 0, c.x - b.right);
  const dy = Math.max(b.top - c.y, 0, c.y - b.bottom);
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Texture key of an interactable's on-map icon (o.iconKey if set, else the
 * texture of o.rect), or null if it has no real icon art (plain rectangle
 * fallback). Used by the Task/Objectives modals to draw each item's icon.
 */
function getObjectIconKey(scene, o) {
  const k = o.iconKey || (o.rect && o.rect.texture && o.rect.texture.key);
  if (!k || k === '__DEFAULT' || k === '__MISSING' || !scene.textures.exists(k)) return null;
  return k;
}

/**
 * One row's icon in the Task modal: full color once found, a dark
 * silhouette until then (same look as Chapter 5's Objectives panel).
 */
function addTaskRowIcon(scene, container, x, y, iconKey, found) {
  if (!iconKey || !scene.textures.exists(iconKey)) return;
  const ic = scene.add.image(x, y, iconKey).setScrollFactor(0);
  ic.setScale(26 / Math.max(ic.width, ic.height));
  if (!found) ic.setTint(0x2a1a0c).setAlpha(0.4);
  container.add(ic);
}