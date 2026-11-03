// Tracks which chapters the player has unlocked so far, persisted to
// localStorage (unlike the Phaser registry, which is only in-memory and
// resets every time the page reloads). This is what powers the "Chapter"
// menu on the title screen: a chapter only shows up as playable there once
// it's actually been reached, and that stays true across reloads/sessions.
//
// Progress is saved PER ACCOUNT: every localStorage key below gets the
// logged-in player's id appended (set by login.html in 'currentUser'), so a
// newly registered account always starts at the Prologue instead of
// inheriting whatever the previous player on this browser finished.
const ChapterProgress = (() => {
  const BASE_STORAGE_KEY = 'patoExplorer.unlockedChapters';
  const BASE_JOURNAL_KEY = 'patoExplorer.journalPages';

  // '.u<id>' for a logged-in player, '.guest' when nobody is logged in.
  function userSuffix() {
    try {
      const u = JSON.parse(localStorage.getItem('currentUser'));
      if (u && u.id !== undefined && u.id !== null) return '.u' + u.id;
    } catch (e) {
      // unreadable currentUser - treat as guest
    }
    return '.guest';
  }

  function storageKey() { return BASE_STORAGE_KEY + userSuffix(); }
  function journalKey() { return BASE_JOURNAL_KEY + userSuffix(); }

  // Order matters: finishing chapter N unlocks chapter N+1. Prologue is
  // always unlocked - it's what "Start" plays from the very beginning.
  const CHAPTER_ORDER = [
    { key: 'Prologue', label: 'Prologue' },
    { key: 'Chapter1', label: 'Chapter 1' },
    { key: 'Chapter2', label: 'Chapter 2' },
    { key: 'Chapter3', label: 'Chapter 3' },
    { key: 'Chapter4', label: 'Chapter 4' },
    { key: 'Chapter5', label: 'Chapter 5' }
  ];

  function load() {
    try {
      const raw = localStorage.getItem(storageKey());
      if (!raw) return ['Prologue'];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return ['Prologue'];
      // Guard against corrupted/edited storage missing the first chapter.
      return parsed.includes('Prologue') ? parsed : ['Prologue', ...parsed];
    } catch (e) {
      // Storage unavailable/corrupt (private browsing, quota, bad JSON) -
      // fall back to "just the beginning", same as a first-ever visit.
      return ['Prologue'];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(list));
    } catch (e) {
      // Fails silently - progress just won't persist across reloads
      // this session (e.g. private browsing with storage disabled).
    }
  }

  function isUnlocked(key) {
    return load().includes(key);
  }

  function unlock(key) {
    const list = load();
    if (!list.includes(key)) {
      list.push(key);
      save(list);
    }
  }

  // Call this right when a chapter is completed - unlocks whichever
  // chapter comes next in CHAPTER_ORDER, if any.
  function unlockNextAfter(key) {
    const idx = CHAPTER_ORDER.findIndex((c) => c.key === key);
    if (idx === -1) return;

    // Unlock the next chapter, if there is one (Chapter 5 is the last).
    if (idx + 1 < CHAPTER_ORDER.length) {
      unlock(CHAPTER_ORDER[idx + 1].key);
    }

    // Score for the admin panel and database: finishing the chapter at
    // position N gives (N+1) * 100. Prologue = 100, Chapter 1 = 200, etc.
    const currentProgressScore = (idx + 1) * 100;
    if (typeof updatePlayerScore === 'function') {
      updatePlayerScore(currentProgressScore, key);
    }
  }

  // ---- Journal pages ------------------------------------------------------
  // Which journal pages the player has collected: 0 = Prologue, 1-5 = the
  // chapters. Saved separately from the unlocked chapters so a finished
  // chapter's page is still readable after a reload. The Journal book
  // (journalBook.js) reads these; the chapter scenes add to them when a
  // chapter is finished.
  const MAX_JOURNAL_PAGE = CHAPTER_ORDER.length - 1;

  function cleanPages(list) {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    list.forEach((n) => {
      if (Number.isInteger(n) && n >= 0 && n <= MAX_JOURNAL_PAGE) seen.add(n);
    });
    return Array.from(seen).sort((a, b) => a - b);
  }

  function getJournalPages() {
    try {
      const raw = localStorage.getItem(journalKey());
      return raw ? cleanPages(JSON.parse(raw)) : [];
    } catch (e) {
      return [];
    }
  }

  function saveJournalPages(list) {
    try {
      localStorage.setItem(journalKey(), JSON.stringify(list));
    } catch (e) {
      // Same as save(): fails silently, pages just won't persist this session.
    }
  }

  function addJournalPage(n) {
    const list = getJournalPages();
    if (Number.isInteger(n) && !list.includes(n)) {
      saveJournalPages(cleanPages(list.concat(n)));
    }
    return getJournalPages();
  }

  // Fold pages that only exist in this session's registry into storage.
  function mergeJournalPages(extra) {
    const stored = getJournalPages();
    const merged = cleanPages(stored.concat(Array.isArray(extra) ? extra : []));
    if (merged.length !== stored.length) saveJournalPages(merged);
    return merged;
  }

  return {
    CHAPTER_ORDER, isUnlocked, unlock, unlockNextAfter,
    getJournalPages, addJournalPage, mergeJournalPages
  };
})();