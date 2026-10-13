/**
 * ============================================================================
 * SOUND MANAGER — Pato Explorer
 * ============================================================================
 * One shared place for every sound the game plays. Scenes call the helper
 * methods below (SoundManager.playMusic / SoundManager.play) instead of
 * dealing with Phaser's sound API directly.
 *
 * ---------------------------------------------------------------------------
 * >>> YOUR TASK <<<
 * Drop your audio files into  assets/audio/  and RENAME each one to match
 * the filenames on the left below EXACTLY (same spelling, same case,
 * same .mp3 extension). Nothing else needs to change — PreloadScene already
 * points at these exact names, so as soon as a file with the right name
 * shows up, it just starts working.
 * ---------------------------------------------------------------------------
 *
 *   assets/audio/bg-menu.mp3        Looping music for the MAIN MENU screen.
 *                                   Something calm/inviting — this is the
 *                                   first thing the player hears.
 *
 *   assets/audio/bg-game.mp3        Looping music for ALL gameplay — the
 *                                   Prologue and every Chapter (1–5) share
 *                                   this one track so the mood stays
 *                                   consistent while exploring/talking/
 *                                   building. Loop it seamlessly if you can.
 *
 *   assets/audio/sfx-click.mp3      Short "tap"/"tick" sound (under half a
 *                                   second). Plays on EVERY button press in
 *                                   the game — menu, settings, quiz answers,
 *                                   popups — and every time dialogue
 *                                   advances. This is the one you'll hear
 *                                   most, so keep it short and unobtrusive.
 *
 *   assets/audio/sfx-correct.mp3    Short positive "ding"/chime — plays when
 *                                   the player picks the right quiz answer.
 *
 *   assets/audio/sfx-incorrect.mp3  Short negative "buzz"/soft thud — plays
 *                                   when the player picks the wrong answer.
 *                                   (Keep it gentle, not punishing — this is
 *                                   an educational game, wrong answers just
 *                                   show the explanation and move on.)
 *
 *   assets/audio/sfx-complete.mp3   A little triumphant jingle (1–3 sec) —
 *                                   plays when a chapter is finished and the
 *                                   "Journal Page Unlocked!" panel appears.
 *
 *   assets/audio/sfx-found.mp3      Short "found it" chime — plays the
 *                                   instant Hiraya interacts with a
 *                                   findable object and its popup/modal
 *                                   appears (Prologue and every Chapter
 *                                   that has findable objects).
 *
 *   assets/audio/sfx-curtain-close.mp3  A cloth "swish"/whoosh — plays the
 *                                   instant the theater-curtain panels start
 *                                   sliding IN to cover the screen (leaving
 *                                   a scene, e.g. Menu -> Prologue/Chapter).
 *
 *   assets/audio/sfx-curtain-open.mp3   Same idea, reversed — plays as the
 *                                   panels slide back OUT to reveal a scene
 *                                   that's just starting. Totally fine to
 *                                   use the same recording for both (just
 *                                   copy it twice under the two names) if
 *                                   you don't have distinct open/close foley.
 *
 *   assets/audio/sfx-type-blip.mp3  The DIALOGUE sound. It plays ONCE at the
 *                                   start of every dialogue line (not once
 *                                   per letter), so it can be a short
 *                                   "voice" sound / blip / chirp - up to
 *                                   about a second is fine.
 *
 *   assets/audio/sfx-footsteps.mp3  A soft, seamlessly-loopable footstep
 *                                   pattern (a couple of steps long is
 *                                   plenty). Starts the instant the player
 *                                   starts walking in the Prologue/any
 *                                   Chapter/the Sandbox, and loops for as
 *                                   long as they keep moving - stops the
 *                                   moment they let go of the keys (or
 *                                   dialogue/a cutscene takes over).
 *
 * That's 11 files total: 3 loops + 8 short one-shot effects.
 *
 * SAFE-BY-DEFAULT: if a file above is missing/not renamed yet, Phaser just
 * fails to load THAT one file quietly — the rest of the game keeps running
 * normally, it just plays silence for that spot. So you can add these one at
 * a time and test as you go; nothing will crash or block your build.
 *
 * Using a different format (.ogg / .wav)? Just change the extension in the
 * `path` values in SOUND_FILES below to match what you actually add.
 * ============================================================================
 */

const SOUND_FILES = {
  // key             file path                              loops?
  'bg-menu':      { path: 'assets/audio/bg-menu.mp3',          loop: true  },
  'bg-game':      { path: 'assets/audio/bg-game.mp3',          loop: true  },
  'click':        { path: 'assets/audio/sfx-click.mp3',        loop: false },
  'correct':      { path: 'assets/audio/sfx-correct.mp3',      loop: false },
  'incorrect':    { path: 'assets/audio/sfx-incorrect.mp3',    loop: false },
  'complete':     { path: 'assets/audio/sfx-complete.mp3',     loop: false },
  'found':        { path: 'assets/audio/sfx-found.mp3',        loop: false },
  'curtain-close':{ path: 'assets/audio/sfx-curtain-close.mp3', loop: false },
  'curtain-open': { path: 'assets/audio/sfx-curtain-open.mp3',  loop: false },
  'type-blip':    { path: 'assets/audio/sfx-type-blip.mp3',     loop: false },
  'footsteps':    { path: 'assets/audio/sfx-footsteps.mp3',     loop: true  }
};

const SoundManager = {
  _music: null,
  _musicKey: null,

  /** Call once, inside PreloadScene.preload(). Queues every file above. */
  preload(scene) {
    Object.entries(SOUND_FILES).forEach(([key, cfg]) => {
      scene.load.audio(key, cfg.path);
    });
  },

  /**
   * Starts looping background music. Safe to call at the top of every
   * scene's create() (Menu, Prologue, every Chapter) — if that same track
   * is already playing it's left alone, so moving from one Chapter to the
   * next doesn't cut the music out and restart it. Switching to a
   * DIFFERENT key (e.g. menu -> game) stops the old one first.
   * If the matching file hasn't been added to assets/ yet, this just does
   * nothing (no error) — the game plays silently until you add it.
   */
  playMusic(scene, key) {
    if (this._musicKey === key && this._music && this._music.isPlaying) return;
    if (this._music) { this._music.stop(); this._music.destroy(); this._music = null; }
    if (!scene.cache.audio.exists(key)) { this._musicKey = null; return; }

    const vol = scene.registry.get('musicVolume');
    this._music = scene.sound.add(key, { loop: true, volume: vol === undefined ? 0.5 : vol });
    this._music.play();
    this._musicKey = key;
  },

  /** Stops whatever background music is currently playing, if any. */
  stopMusic() {
    if (this._music) { this._music.stop(); this._music.destroy(); this._music = null; this._musicKey = null; }
  },

  /**
   * Plays a short one-shot sound effect: 'click' | 'correct' | 'incorrect' | 'complete'.
   * Does nothing if that file hasn't been added yet (see note above).
   */
  play(scene, key) {
    if (!scene.cache.audio.exists(key)) return;
    const vol = scene.registry.get('sfxVolume');
    scene.sound.play(key, { volume: vol === undefined ? 0.7 : vol });
  },

  _typeSound: null,

  /**
   * Plays the dialogue sound ONCE. Called from ui.js's showDialogue at the
   * start of every dialogue line (previously it fired once per letter, which
   * sounded like gibberish). Reuses a single Sound instance, so if the player
   * clicks through lines quickly the sound restarts instead of stacking.
   * Does nothing if the file hasn't been added yet (see note above).
   */
  playTypeBlip(scene) {
    if (!scene.cache.audio.exists('type-blip')) return;
    const vol = scene.registry.get('sfxVolume');
    const volume = vol === undefined ? 0.7 : vol;
    if (!this._typeSound) this._typeSound = scene.sound.add('type-blip');
    this._typeSound.play({ volume });
  },

  /**
   * Cuts the dialogue sound off immediately. Called when the player skips a
   * line (space/click while it's typing) and when the dialogue closes.
   */
  stopTypeBlip() {
    if (this._typeSound && this._typeSound.isPlaying) this._typeSound.stop();
  },

  _footsteps: null,
  _footstepsPlaying: false,

  /**
   * Call every frame from a scene's update() with whether the player is
   * currently moving (its existing `moving` boolean). Starts a looping
   * footstep sound the instant movement begins and stops it the instant
   * movement stops (walking into a wall, letting go of the keys, dialogue
   * or a cutscene locking input, etc.) - safe to call every single frame,
   * since it only actually starts/stops the underlying Sound object on a
   * true -> false or false -> true change, not on every call.
   */
  setFootsteps(scene, isMoving) {
    if (isMoving) {
      if (this._footstepsPlaying) return;
      if (!scene.cache.audio.exists('footsteps')) return;
      const vol = scene.registry.get('sfxVolume');
      if (!this._footsteps) this._footsteps = scene.sound.add('footsteps', { loop: true });
      this._footsteps.setVolume(vol === undefined ? 0.7 : vol);
      this._footsteps.play();
      this._footstepsPlaying = true;
    } else if (this._footstepsPlaying) {
      if (this._footsteps) this._footsteps.stop();
      this._footstepsPlaying = false;
    }
  },

  /** Wired to the Settings screen's Music option row. */
  setMusicVolume(scene, vol) {
    scene.registry.set('musicVolume', vol);
    if (this._music) this._music.setVolume(vol);
  },

  /** Wired to the Settings screen's Sound Effects option row. */
  setSfxVolume(scene, vol) {
    scene.registry.set('sfxVolume', vol);
  }
};
