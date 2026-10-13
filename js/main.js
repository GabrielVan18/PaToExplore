const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  pixelArt: true,
  // FIT keeps the 960x540 game resolution but scales the canvas to fill
  // #game-container (see css/style.css), which is what makes fullscreen work.
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [PreloadScene, MenuScene, AboutScene, SettingsScene, PrologueScene, GameScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, JournalScene]
};

// Fullscreen button under the canvas. The whole page (<html>) goes
// fullscreen rather than just the canvas, so DOM overlays appended to
// document.body (e.g. the Chapter 5 matching activity) stay visible.
// Exiting is done with the Esc key (browser built-in).
function setupFullscreen(game) {
  const root = document.documentElement;
  const controls = document.getElementById('fs-controls');
  const btn = document.getElementById('fs-btn');
  const toast = document.getElementById('fs-toast');

  const requestFs = root.requestFullscreen || root.webkitRequestFullscreen;
  const fsAllowed = document.fullscreenEnabled || document.webkitFullscreenEnabled;

  // e.g. iPhone Safari doesn't support fullscreen for normal pages
  if (!requestFs || !fsAllowed) {
    controls.style.display = 'none';
    return;
  }

  const getFsElement = () => document.fullscreenElement || document.webkitFullscreenElement;

  let toastTimer = null;
  function showToast() {
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  btn.addEventListener('click', () => {
    if (!getFsElement()) {
      const result = requestFs.call(root);
      if (result && result.catch) {
        result.catch((err) => console.warn('Fullscreen request failed.', err));
      }
    }
    // Drop focus so Space/Enter in the game never re-triggers this button.
    btn.blur();
  });

  function onFullscreenChange() {
    const active = !!getFsElement();
    root.classList.toggle('is-fullscreen', active);
    btn.blur();

    // Re-fit the canvas to the new container size. A second pass shortly
    // after covers browsers that finish resizing the window a bit late; the
    // resize event also lets DOM overlays (Chapter 5) re-align themselves.
    game.scale.refresh();
    setTimeout(() => {
      game.scale.refresh();
      window.dispatchEvent(new Event('resize'));
    }, 150);

    if (active) showToast();
    else toast.classList.remove('show');
  }

  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
}

function startGame() {
  const game = new Phaser.Game(config);
  setupFullscreen(game);
}

// Canvas text (which is how every Phaser text object gets drawn) doesn't
// wait for @font-face the way DOM text does - if the game starts before the
// font has actually downloaded, the very first frame of text (PreloadScene's
// "Loading..." label) draws in the fallback font and never redraws once
// Tildunk arrives. So we explicitly load it first and only boot Phaser
// once it's ready, falling back to booting anyway if the font fails to load
// for some reason (e.g. blocked request) so the game never gets stuck.
const tildunkFont = new FontFace(
  'Tildunk',
  "url('assets/fonts/tildunk.otf')"
);

tildunkFont.load()
  .then((loadedFace) => {
    document.fonts.add(loadedFace);
    startGame();
  })
  .catch((err) => {
    console.warn('Tildunk font failed to load, starting with fallback fonts.', err);
    startGame();
  });
const PAGE_LOAD_TIME = Date.now();

function updatePlayerScore(newScore, chapterKey) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        currentUser.score = newScore;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        let users = JSON.parse(localStorage.getItem('users')) || [];
        let index = users.findIndex(u => u.username === currentUser.username);
        if (index !== -1) {
            users[index].score = newScore;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
    saveProgressToServer(newScore, chapterKey);
}

function saveProgressToServer(score, chapterKey) {
    fetch('api/save_score.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            score: score,
            level: Math.max(1, Math.round(score / 100)),
            chapter: chapterKey || null,
            seconds: Math.round((Date.now() - PAGE_LOAD_TIME) / 1000)
        })
    })
    .then(res => {
        if (res.status === 401) {
            alert('Your login session expired. Please log in again so your progress is saved.');
            window.location.href = 'login.html';
            return null;
        }
        return res.json();
    })
    .then(data => {
        if (data && !data.success) console.warn('Progress was not saved:', data);
    })
    .catch(err => console.warn('Could not reach the server to save progress:', err));
}
  