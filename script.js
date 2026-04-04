import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

(function () {
  window.__penguinReady = true;

  const STORAGE_KEY = "flying-micchi-bests-v1";
  const SETTINGS_KEY = "flying-micchi-settings-v1";
  const PLAYER_Z = 8.4;
  const TRACK_HALF_WIDTH = 6;
  const TRACK_TOP = 4.2;
  const TRACK_BOTTOM = -3.4;
  const GATE_SPACING = 22;
  const GATE_COUNT = 9;
  const GATE_MARGIN = 0.55;
  const PENGUIN_SCALE = 0.5;

  const THEMES = {
    sky: {
      key: "sky",
      label: "空",
      bodyStage: "sky",
      sceneColor: 0x0b4ea8,
      fogNear: 22,
      fogFar: 132,
      ambientIntensity: 1.22,
      hemiSky: 0x5cb8ff,
      hemiGround: 0x082b62,
      pointColor: 0x7fd9ff,
      gateColor: 0xf7ffff,
      gateEmissive: 0x8ce8ff,
      accentColor: 0x5bd3ff,
      lineColor: 0xa6e6ff,
      railColor: 0xe7fbff,
      burstColor: 0x9ceaff,
      runwayColor: 0x7fd7ff,
      trailColor: 0xf7fdff,
      bonusColor: 0xfff2a8,
      metaColor: "#0f5bc2"
    },
    sea: {
      key: "sea",
      label: "海",
      bodyStage: "sea",
      sceneColor: 0x083861,
      fogNear: 20,
      fogFar: 122,
      ambientIntensity: 1.12,
      hemiSky: 0x49d8ff,
      hemiGround: 0x041727,
      pointColor: 0x38f0ff,
      gateColor: 0x7af8ff,
      gateEmissive: 0x10c4de,
      accentColor: 0x74f6ff,
      lineColor: 0x54d9ff,
      railColor: 0xaefcff,
      burstColor: 0x59eeff,
      runwayColor: 0x0fa6d2,
      trailColor: 0xb6ffff,
      bonusColor: 0xfff4bf,
      metaColor: "#0f7dc9"
    },
    space: {
      key: "space",
      label: "宇宙",
      bodyStage: "space",
      sceneColor: 0x040814,
      fogNear: 18,
      fogFar: 120,
      ambientIntensity: 1.04,
      hemiSky: 0xa67dff,
      hemiGround: 0x050811,
      pointColor: 0xc17dff,
      gateColor: 0x8fdfff,
      gateEmissive: 0xa347ff,
      accentColor: 0xffffff,
      lineColor: 0x7ae1ff,
      railColor: 0xc89cff,
      burstColor: 0xca83ff,
      runwayColor: 0x21053d,
      trailColor: 0xecc8ff,
      bonusColor: 0xfff4bf,
      metaColor: "#121830"
    },
    city: {
      key: "city",
      label: "街",
      bodyStage: "city",
      sceneColor: 0x070b15,
      fogNear: 20,
      fogFar: 126,
      ambientIntensity: 1.08,
      hemiSky: 0xff9258,
      hemiGround: 0x04050a,
      pointColor: 0xffba74,
      gateColor: 0xffd768,
      gateEmissive: 0xff9051,
      accentColor: 0xfff0aa,
      lineColor: 0xff8e63,
      railColor: 0xffc56a,
      burstColor: 0xffae68,
      runwayColor: 0x2a1620,
      trailColor: 0xffd9a6,
      bonusColor: 0xfff4bf,
      metaColor: "#251532"
    }
  };

  const SOUNDTRACKS = {
    sky: { key: "sky", label: "空", src: "./assets/rebirth-8bit-remix.mp3" },
    sea: { key: "sea", label: "海", src: "./assets/rebirth-8bit-remix.mp3" },
    space: { key: "space", label: "宇宙", src: "./assets/rebirth-8bit-remix.mp3" }
  };
  const DEFAULT_CITY_TRACK_KEY = "city";
  SOUNDTRACKS.sea.src = "./assets/ramune-8bit.mp3";
  SOUNDTRACKS.space.src = "./assets/shooting-star-8bit.mp3";
  SOUNDTRACKS.city = { key: "city", label: "\u8857", src: "./assets/take-the-stage-8bit.mp3" };
  const MUSIC_TRACK_META = {
    sky: { order: "01", title: "空 BGM", subtitle: "Rebirth (8bit Remix)" },
    sea: { order: "02", title: "海 BGM", subtitle: "ラムネ (8bit Remix)" },
    space: { order: "03", title: "宇宙 BGM", subtitle: "Shooting Star (8bit Remix)", locked: true, status: "COMING SOON" },
    city: { order: "04", title: "街 BGM", subtitle: "Take the stage (8bit Remix)", locked: true, status: "COMING SOON" },
    clear: { order: "05", title: "クリア BGM", subtitle: "game clear (8bit)" },
    failed: { order: "06", title: "失敗 BGM", subtitle: "game failed (8bit)" }
  };

  MUSIC_TRACK_META.sky.title = "\u7a7a BGM";
  MUSIC_TRACK_META.sea.title = "\u6d77 BGM";
  MUSIC_TRACK_META.sea.subtitle = "\u30e9\u30e0\u30cd (8bit Remix)";
  MUSIC_TRACK_META.space.title = "\u5b87\u5b99 BGM";
  MUSIC_TRACK_META.space.subtitle = "Shooting Star (8bit Remix)";
  MUSIC_TRACK_META.city.title = "\u8857 BGM";
  delete MUSIC_TRACK_META.space.locked;
  delete MUSIC_TRACK_META.space.status;
  delete MUSIC_TRACK_META.city.locked;
  delete MUSIC_TRACK_META.city.status;
  MUSIC_TRACK_META.clear.title = "\u30af\u30ea\u30a2 BGM";
  MUSIC_TRACK_META.failed.title = "\u30b2\u30fc\u30e0\u30aa\u30fc\u30d0\u30fc BGM";

  const MODES = {
    sky: {
      key: "sky",
      label: "空",
      difficulty: "初級",
      theme: "sky",
      targetRings: 100,
      speedStart: 14,
      speedStep: 0,
      maxSpeed: 25,
      gapStartScale: 2.2,
      gapStep: 0.1,
      gapStepEvery: 10,
      gapMinScale: 1.8,
      summary: "速度固定 / 100リング"
    },
    sea: {
      key: "sea",
      label: "海",
      difficulty: "中級",
      theme: "sea",
      targetRings: 150,
      speedStart: 14,
      speedStep: 0.1,
      maxSpeed: 30,
      gapStartScale: 2,
      gapStep: 0.15,
      gapStepEvery: 10,
      gapMinScale: 1.4,
      summary: "0.1ずつ加速 / 100リング"
    },
    space: {
      key: "space",
      label: "宇宙",
      difficulty: "上級",
      theme: "space",
      targetRings: 200,
      speedStart: 14,
      speedStep: 0.1,
      maxSpeed: 40,
      gapStartScale: 2,
      gapStep: 0.175,
      gapStepEvery: 10,
      gapMinScale: 1.4,
      summary: "0.1ずつ加速 / 200リング"
    },
    city: {
      key: "city",
      label: "街",
      difficulty: "Score Attack",
      theme: "city",
      targetRings: Number.POSITIVE_INFINITY,
      speedStart: 14,
      speedStep: 0.1,
      maxSpeed: 50,
      gapStartScale: 2,
      gapStep: 0.1,
      gapStepEvery: 10,
      gapMinScale: 1.3,
      summary: "星ボーナスあり / エンドレス",
      bonusEvery: 20,
      bonusValue: 10
    }
  };

  const MAX_FINITE_GATES = Object.values(MODES).reduce((max, mode) => (
    Number.isFinite(mode.targetRings) ? Math.max(max, mode.targetRings) : max
  ), GATE_COUNT);

  const sceneRoot = document.querySelector("#sceneRoot");
  const introScreen = document.querySelector("#introScreen");
  const musicScreen = document.querySelector("#musicScreen");
  const selectScreen = document.querySelector("#selectScreen");
  const resultScreen = document.querySelector("#resultScreen");
  const scoreHud = document.querySelector("#scoreHud");
  const scoreValue = document.querySelector("#scoreValue");
  const lifeHud = document.querySelector("#lifeHud");
  const lifeTokens = [...document.querySelectorAll("[data-life-index]")];
  const soundButton = document.querySelector("#soundButton");
  const gameModeButton = document.querySelector("#gameModeButton");
  const musicModeButton = document.querySelector("#musicModeButton");
  const musicStopButton = document.querySelector("#musicStopButton");
  const musicRandomButton = document.querySelector("#musicRandomButton");
  const musicPrevButton = document.querySelector("#musicPrevButton");
  const musicNextButton = document.querySelector("#musicNextButton");
  const musicBackButton = document.querySelector("#musicBackButton");
  const titleButton = document.querySelector("#titleButton");
  const retryButton = document.querySelector("#retryButton");
  const selectButton = document.querySelector("#selectButton");
  const homeButton = document.querySelector("#homeButton");
  const cityTrackButtons = [...document.querySelectorAll("[data-city-track]")];
  const musicTrackGrid = document.querySelector(".music-track-grid");
  if (musicTrackGrid && !musicTrackGrid.querySelector('[data-preview-track="city"]')) {
    const cityButton = document.createElement("button");
    cityButton.className = "music-track-button is-locked";
    cityButton.type = "button";
    cityButton.dataset.previewTrack = "city";
    cityButton.innerHTML = `
      <span class="music-track-order">04</span>
      <span class="music-track-meta">
        <strong>\u8857 BGM</strong>
        <em>Take the stage (8bit Remix)</em>
      </span>
      <span class="music-track-status">COMING SOON</span>
    `;
    const clearButton = musicTrackGrid.querySelector('[data-preview-track="clear"]');
    if (clearButton) {
      musicTrackGrid.insertBefore(cityButton, clearButton);
    } else {
      musicTrackGrid.append(cityButton);
    }
  }
  if (musicTrackGrid && !musicTrackGrid.querySelector('[data-preview-track="failed"]')) {
    const failedButton = document.createElement("button");
    failedButton.className = "music-track-button";
    failedButton.type = "button";
    failedButton.dataset.previewTrack = "failed";
    failedButton.innerHTML = `
      <span class="music-track-order">06</span>
      <span class="music-track-meta">
        <strong>失敗 BGM</strong>
        <em>game failed (8bit)</em>
      </span>
    `;
    musicTrackGrid.append(failedButton);
  }
  const musicTrackButtons = [...document.querySelectorAll("[data-preview-track]")];
  const resultBadge = document.querySelector("#resultBadge");
  const resultTitle = document.querySelector("#resultTitle");
  const resultLead = document.querySelector("#resultLead");
  const resultScore = document.querySelector("#resultScore");
  const resultBest = document.querySelector("#resultBest");
  const messageBar = document.querySelector("#messageBar");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const modeButtons = [...document.querySelectorAll("[data-mode]")];
  const bestNodes = {
    sky: document.querySelector("#best-sky"),
    sea: document.querySelector("#best-sea"),
    space: document.querySelector("#best-space"),
    city: document.querySelector("#best-city")
  };

  const pointer = { x: 0, y: 0 };
  const keyboard = new Set();
  const gates = [];
  const stageGroups = {};
  const burstPool = [];
  const lineMaterials = [];
  const railMaterials = [];
  const bgm = new Audio();
  const clearBgm = new Audio("./assets/game-clear-8bit.mp3");
  const failedBgm = new Audio("./assets/game-failed-8bit.mp3");
  let activeBgmTrackKey = "";

  let renderer;
  let scene;
  let camera;
  let ambientLight;
  let hemiLight;
  let pointLight;
  let sceneGroup;
  let runway;
  let player;
  let penguinSprite;
  let penguinAura;
  let playerShadow;
  let trailMesh;
  let trailMaterial;
  let tunnelLines;
  let starField;
  let gateMaterial;
  let gateAccentMaterial;
  let bonusSlotMaterial;
  let bonusStarMaterial;
  let burstMaterial;
  let initialized = false;
  let penguinTexturePromise;
  let cloudTexturesPromise;
  let mountainTexturesPromise;
  let saturnRingTexture;
  let audioContext;

  const settings = loadSettings();
  const state = {
    bests: loadBests(),
    deviceMode: detectDeviceMode(),
    screen: "intro",
    running: false,
    modeKey: "sky",
    previewModeKey: "sky",
    score: 0,
    ringsCleared: 0,
    hitsRemaining: 2,
    nextRingNumber: 1,
    speed: 14,
    targetX: 0,
    targetY: 0.1,
    playerVelocityX: 0,
    playerVelocityY: 0,
    hitFlashTime: 0,
    shake: 0,
    time: 0,
    lastFrame: performance.now(),
    soundEnabled: settings.soundEnabled,
    cityTrackKey: settings.cityTrackKey,
    musicTrackKey: "sky",
    musicPreviewPlaying: false,
    musicRandomMode: false,
    musicHistory: [],
    musicHistoryIndex: -1,
    resultOutcome: "failed",
    resultTitle: "",
    resultLead: ""
  };

  bgm.preload = "auto";
  bgm.loop = true;
  bgm.volume = 0.46;
  clearBgm.loop = true;
  clearBgm.preload = "auto";
  clearBgm.volume = 0.5;
  failedBgm.loop = true;
  failedBgm.preload = "auto";
  failedBgm.volume = 0.5;

  scoreValue.textContent = "0";
  syncUi();

  function detectDeviceMode() {
    const coarse = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
    if (coarse) {
      return {
        key: "touch",
        badge: "AUTO: MOBILE TOUCH",
        intro: "ボタンをタップ",
        controls: "操作: 画面をなぞって移動。遊びたいコースをタップするとすぐ開始します。"
      };
    }

    return {
      key: "desktop",
      badge: "AUTO: DESKTOP",
      intro: "ボタンをクリック",
      controls: "操作: マウス移動 / 矢印キー / WASD。遊びたいコースをクリックするとすぐ開始します。"
    };
  }

  function loadBests() {
    const fallback = { sky: 0, sea: 0, space: 0, city: 0 };

    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        sky: Number(raw.sky) || 0,
        sea: Number(raw.sea) || 0,
        space: Number(raw.space) || 0,
        city: Number(raw.city) || 0
      };
    } catch {
      return fallback;
    }
  }

  function saveBests() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bests));
    } catch {
      return;
    }
  }

  function loadSettings() {
    try {
      const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      return {
        soundEnabled: raw.soundEnabled !== false,
        cityTrackKey: SOUNDTRACKS[raw.cityTrackKey] ? raw.cityTrackKey : DEFAULT_CITY_TRACK_KEY
      };
    } catch {
      return {
        soundEnabled: true,
        cityTrackKey: DEFAULT_CITY_TRACK_KEY
      };
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        soundEnabled: state.soundEnabled,
        cityTrackKey: state.cityTrackKey
      }));
    } catch {
      return;
    }
  }

  function currentMode() {
    return MODES[state.modeKey];
  }

  function previewMode() {
    return MODES[state.previewModeKey];
  }

  function resolveTrackKeyForMode(modeKey = state.modeKey) {
    return modeKey === "city" ? state.cityTrackKey : modeKey;
  }

  function ensureMainBgmTrack(modeKey = state.modeKey) {
    const trackKey = resolveTrackKeyForMode(modeKey);
    const soundtrack = SOUNDTRACKS[trackKey] || SOUNDTRACKS[DEFAULT_CITY_TRACK_KEY];

    if (activeBgmTrackKey !== soundtrack.key || bgm.src !== new URL(soundtrack.src, window.location.href).href) {
      activeBgmTrackKey = soundtrack.key;
      bgm.src = soundtrack.src;
    }

    return soundtrack.key;
  }

  function activeThemeKey() {
    return state.running ? currentMode().theme : previewMode().theme;
  }

  function previewModeKeyForMusicTrack(trackKey = state.musicTrackKey) {
    if (trackKey === "sea") {
      return "sea";
    }
    if (trackKey === "city") {
      return "city";
    }
    if (trackKey === "failed") {
      return "city";
    }
    if (trackKey === "clear") {
      return "space";
    }
    return "sky";
  }

  function getPlayableMusicTrackKeys() {
    return Object.entries(MUSIC_TRACK_META)
      .filter(([, meta]) => !meta.locked)
      .map(([key]) => key);
  }

  function pickRandomMusicTrackKey(excludeKey = "") {
    const playableTrackKeys = getPlayableMusicTrackKeys();
    const filteredTrackKeys = playableTrackKeys.filter((key) => key !== excludeKey);
    const pool = filteredTrackKeys.length ? filteredTrackKeys : playableTrackKeys;
    if (!pool.length) {
      return state.musicTrackKey;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function pushMusicHistory(trackKey) {
    if (state.musicHistory[state.musicHistoryIndex] === trackKey) {
      return;
    }

    state.musicHistory = state.musicHistory.slice(0, state.musicHistoryIndex + 1);
    state.musicHistory.push(trackKey);
    state.musicHistoryIndex = state.musicHistory.length - 1;
  }

  function canPlayPreviousMusicTrack() {
    return state.musicHistoryIndex > 0;
  }

  function canPlayNextMusicTrack() {
    return state.musicRandomMode || state.musicHistoryIndex < state.musicHistory.length - 1;
  }

  function setMessage(text = "") {
    messageBar.textContent = text;
  }

  function setSoundButtonState() {
    soundButton.textContent = state.soundEnabled ? "SOUND ON" : "SOUND OFF";
    soundButton.classList.toggle("is-muted", !state.soundEnabled);
  }

  function stopBgmTracks(reset = false) {
    [bgm, clearBgm, failedBgm].forEach((track) => {
      track.pause();
      if (reset) {
        track.currentTime = 0;
      }
    });
  }

  function updateLifeHud(lostIndex = null) {
    if (lifeHud) {
      lifeHud.hidden = state.screen !== "running";
    }

    lifeTokens.forEach((token, index) => {
      if (token._lifeTimeout) {
        window.clearTimeout(token._lifeTimeout);
        token._lifeTimeout = null;
      }

      if (lostIndex === index) {
        token.classList.remove("is-spent");
        token.classList.add("is-lost");
        token._lifeTimeout = window.setTimeout(() => {
          token.classList.remove("is-lost");
          token.classList.add("is-spent");
          token._lifeTimeout = null;
        }, 420);
        return;
      }

      token.classList.remove("is-lost");
      token.classList.toggle("is-spent", index >= state.hitsRemaining);
    });
  }

  function absorbHit() {
    const lostIndex = state.hitsRemaining - 1;
    state.hitsRemaining = Math.max(0, state.hitsRemaining - 1);
    state.hitFlashTime = 1;
    state.shake = 0.45;
    updateLifeHud(lostIndex);
  }

  function refreshBestLabels() {
    Object.entries(bestNodes).forEach(([key, node]) => {
      if (node) {
        node.textContent = `Best ${state.bests[key]}`;
      }
    });
  }

  function applyBodyTheme(themeKey) {
    document.body.dataset.stage = THEMES[themeKey].bodyStage;
    if (themeMeta) {
      themeMeta.setAttribute("content", THEMES[themeKey].metaColor);
    }
  }

  function syncUi() {
    document.body.dataset.screen = state.screen;
    applyBodyTheme(activeThemeKey());

    introScreen.hidden = state.screen !== "intro";
    musicScreen.hidden = state.screen !== "music";
    selectScreen.hidden = state.screen !== "select";
    resultScreen.hidden = state.screen !== "result";
    resultScreen.dataset.outcome = state.resultOutcome;
    scoreHud.hidden = state.screen !== "running";
    if (lifeHud) {
      lifeHud.hidden = state.screen !== "running";
    }

    const deviceBadge = document.querySelector("#deviceBadge");
    const tapCopy = document.querySelector(".tap-copy");
    const controlHint = document.querySelector("#controlHint");
    const musicTitle = document.querySelector(".music-title");
    if (deviceBadge) {
      deviceBadge.textContent = state.deviceMode.badge;
    }
    if (tapCopy) {
      tapCopy.textContent = state.deviceMode.intro;
    }
    if (controlHint) {
      controlHint.textContent = state.deviceMode.controls;
    }
    if (musicTitle) {
      musicTitle.textContent = "Sound Select";
    }
    if (musicRandomButton) {
      musicRandomButton.classList.toggle("is-selected", state.musicRandomMode);
      musicRandomButton.disabled = !state.soundEnabled;
      musicRandomButton.textContent = state.musicRandomMode ? "RANDOM ON" : "RANDOM";
    }
    if (musicPrevButton) {
      musicPrevButton.disabled = !state.soundEnabled || !canPlayPreviousMusicTrack();
    }
    if (musicNextButton) {
      musicNextButton.disabled = !state.soundEnabled || !canPlayNextMusicTrack();
    }

    modeButtons.forEach((button) => {
      button.classList.toggle("is-preview", button.dataset.mode === state.previewModeKey);
      const mode = MODES[button.dataset.mode];
      const metaSummary = button.querySelector(".stage-meta em");
      if (mode && metaSummary) {
        metaSummary.textContent = getModeSummary(mode);
      }
    });

    cityTrackButtons.forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.cityTrack === state.cityTrackKey);
    });

    musicTrackButtons.forEach((button) => {
      const trackMeta = MUSIC_TRACK_META[button.dataset.previewTrack];
      const orderNode = button.querySelector(".music-track-order");
      const titleNode = button.querySelector(".music-track-meta strong");
      const subtitleNode = button.querySelector(".music-track-meta em");
      let statusNode = button.querySelector(".music-track-status");
      if (trackMeta) {
        if (orderNode) {
          orderNode.textContent = trackMeta.order;
        }
        if (titleNode) {
          titleNode.textContent = trackMeta.title;
        }
        if (subtitleNode) {
          subtitleNode.textContent = trackMeta.subtitle;
        }
        button.classList.toggle("is-locked", !!trackMeta.locked);
        if (trackMeta.status) {
          if (!statusNode) {
            statusNode = document.createElement("span");
            statusNode.className = "music-track-status";
            button.append(statusNode);
          }
          statusNode.textContent = trackMeta.status;
        } else if (statusNode) {
          statusNode.remove();
        }
      }

      const isSelected = button.dataset.previewTrack === state.musicTrackKey;
      button.classList.toggle("is-selected", isSelected);
      button.classList.toggle("is-playing", isSelected && state.musicPreviewPlaying && state.soundEnabled);
    });

    if (musicStopButton) {
      musicStopButton.disabled = !state.musicPreviewPlaying;
    }

    resultTitle.textContent = state.resultTitle;
    resultLead.textContent = state.resultLead;
    if (resultBadge) {
      resultBadge.textContent = state.resultOutcome === "clear" ? "STAGE CLEAR" : "GAME OVER";
    }
    resultScore.textContent = String(state.score);
    resultBest.textContent = String(state.bests[state.modeKey] || 0);

    refreshBestLabels();
    setSoundButtonState();
    updateLifeHud();
  }

  function getModeSummary(mode) {
    if (!Number.isFinite(mode.targetRings)) {
      return mode.summary;
    }

    if (mode.speedStep <= 0) {
      return `速度固定 / ${mode.targetRings}リング`;
    }

    return `${mode.speedStep.toFixed(1)}ずつ加速 / ${mode.targetRings}リング`;
  }

  function getGapScale(ringsCleared, mode) {
    if (mode.gapStep <= 0) {
      return mode.gapStartScale;
    }

    const steps = Math.floor(ringsCleared / mode.gapStepEvery);
    return Math.max(mode.gapMinScale, mode.gapStartScale - steps * mode.gapStep);
  }

  function calculateSpeed(mode, ringsCleared) {
    const rawSpeed = mode.speedStart + ringsCleared * mode.speedStep;
    if (!Number.isFinite(mode.maxSpeed)) {
      return rawSpeed;
    }
    return Math.min(mode.maxSpeed, rawSpeed);
  }

  function pointInRect(x, y, rect, insetX, insetY) {
    if (!rect) {
      return false;
    }

    return (
      x >= rect.left + insetX
      && x <= rect.right - insetX
      && y >= rect.bottom + insetY
      && y <= rect.top - insetY
    );
  }

  function createRunway() {
    const geometry = new THREE.PlaneGeometry(10.5, 220, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: THEMES.sky.runwayColor,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.42,
      roughness: 0.6
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.position.set(0, TRACK_BOTTOM - 0.55, -72);
    return mesh;
  }

  function createTunnel() {
    const group = new THREE.Group();

    for (let row = 0; row < 22; row += 1) {
      const z = -row * 10;
      const points = [
        new THREE.Vector3(-TRACK_HALF_WIDTH, TRACK_BOTTOM, z),
        new THREE.Vector3(TRACK_HALF_WIDTH, TRACK_BOTTOM, z),
        new THREE.Vector3(TRACK_HALF_WIDTH, TRACK_TOP, z),
        new THREE.Vector3(-TRACK_HALF_WIDTH, TRACK_TOP, z),
        new THREE.Vector3(-TRACK_HALF_WIDTH, TRACK_BOTTOM, z)
      ];
      const material = new THREE.LineBasicMaterial({
        color: THEMES.sky.lineColor,
        transparent: true,
        opacity: 0.42
      });
      lineMaterials.push(material);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      line.userData.baseZ = z;
      group.add(line);
    }

    [
      [-TRACK_HALF_WIDTH, TRACK_BOTTOM],
      [TRACK_HALF_WIDTH, TRACK_BOTTOM],
      [-TRACK_HALF_WIDTH, TRACK_TOP],
      [TRACK_HALF_WIDTH, TRACK_TOP]
    ].forEach(([x, y]) => {
      const material = new THREE.LineBasicMaterial({
        color: THEMES.sky.railColor,
        transparent: true,
        opacity: 0.22
      });
      railMaterials.push(material);
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, y, 28),
        new THREE.Vector3(x, y, -190)
      ]);
      group.add(new THREE.Line(geometry, material));
    });

    return group;
  }

  function createStarField() {
    const starCount = 460;
    const positions = new Float32Array(starCount * 3);

    for (let index = 0; index < starCount; index += 1) {
      positions[index * 3] = THREE.MathUtils.randFloatSpread(90);
      positions[index * 3 + 1] = THREE.MathUtils.randFloatSpread(44);
      positions[index * 3 + 2] = THREE.MathUtils.randFloat(-200, 35);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.24,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7
    });
    return new THREE.Points(geometry, material);
  }

  function createTrail() {
    const geometry = new THREE.PlaneGeometry(1.8, 5.8, 1, 1);
    trailMaterial = new THREE.MeshBasicMaterial({
      color: THEMES.sky.trailColor,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, trailMaterial);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.position.set(0, TRACK_BOTTOM - 0.18, PLAYER_Z - 2.9);
    return mesh;
  }

  function processPenguinTexture(image) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let index = 0; index < data.length; index += 4) {
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
      if (brightness > 243) {
        data[index + 3] = 0;
      }
    }

    context.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  function loadPenguinTexture() {
    penguinTexturePromise ??= new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(processPenguinTexture(image));
      image.onerror = () => reject(new Error("Failed to load character image"));
      image.src = "./assets/penguin.png";
    });
    return penguinTexturePromise;
  }

  function loadCloudTextures() {
    cloudTexturesPromise ??= Promise.all([
      "./assets/cloud-01.png",
      "./assets/cloud-02.png"
    ].map((src) => new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        src,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          resolve(texture);
        },
        undefined,
        () => reject(new Error(`Failed to load cloud texture: ${src}`))
      );
    })));

    return cloudTexturesPromise;
  }

  function loadMountainTextures() {
    mountainTexturesPromise ??= Promise.all([
      "./assets/mountain-01.png",
      "./assets/mountain-02.png"
    ].map((src) => new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        src,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          resolve(texture);
        },
        undefined,
        () => reject(new Error(`Failed to load mountain texture: ${src}`))
      );
    })));

    return mountainTexturesPromise;
  }

  function createPenguin(texture) {
    const group = new THREE.Group();
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    sprite.scale.set(3.55 * PENGUIN_SCALE, 4.2 * PENGUIN_SCALE, 1);
    sprite.center.set(0.5, 0.07);
    group.add(sprite);

    const aura = new THREE.Mesh(
      new THREE.RingGeometry(0.52 * PENGUIN_SCALE, 0.88 * PENGUIN_SCALE, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
    );
    aura.rotation.x = -Math.PI * 0.5;
    aura.position.set(0, -0.55 * PENGUIN_SCALE, 0.18);
    group.add(aura);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.72 * PENGUIN_SCALE, 24),
      new THREE.MeshBasicMaterial({ color: 0x10182a, transparent: true, opacity: 0.18 })
    );
    shadow.rotation.x = -Math.PI * 0.5;
    shadow.position.set(0, TRACK_BOTTOM - 0.18, 0.2);
    group.add(shadow);

    penguinSprite = sprite;
    penguinAura = aura;
    playerShadow = shadow;
    return group;
  }

  function createStarGeometry() {
    const shape = new THREE.Shape();

    for (let index = 0; index < 10; index += 1) {
      const radius = index % 2 === 0 ? 0.44 : 0.2;
      const angle = (index / 10) * Math.PI * 2 - Math.PI * 0.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (index === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }

    shape.closePath();
    const geometry = new THREE.ShapeGeometry(shape);
    geometry.center();
    return geometry;
  }

  function createFishGeometry() {
    const shape = new THREE.Shape();
    shape.moveTo(-0.8, 0);
    shape.quadraticCurveTo(-0.52, 0.42, 0.04, 0.46);
    shape.quadraticCurveTo(0.56, 0.42, 0.84, 0);
    shape.quadraticCurveTo(0.56, -0.42, 0.04, -0.46);
    shape.quadraticCurveTo(-0.52, -0.42, -0.8, 0);
    shape.lineTo(-1.18, 0.34);
    shape.lineTo(-0.98, 0);
    shape.lineTo(-1.18, -0.34);
    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape);
    geometry.center();
    return geometry;
  }

  function getSaturnRingTexture() {
    if (saturnRingTexture) {
      return saturnRingTexture;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 48;
    const context = canvas.getContext("2d");

    if (!context) {
      saturnRingTexture = new THREE.Texture();
      return saturnRingTexture;
    }

    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#f8d978");
    gradient.addColorStop(0.24, "#ffe9a7");
    gradient.addColorStop(0.48, "#f6c658");
    gradient.addColorStop(0.74, "#ffefbb");
    gradient.addColorStop(1, "#d99b36");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(124, 78, 12, 0.18)";
    for (let x = 16; x < canvas.width; x += 28) {
      context.fillRect(x, 0, 8, canvas.height);
    }

    saturnRingTexture = new THREE.CanvasTexture(canvas);
    saturnRingTexture.colorSpace = THREE.SRGBColorSpace;
    saturnRingTexture.wrapS = THREE.RepeatWrapping;
    saturnRingTexture.wrapT = THREE.ClampToEdgeWrapping;
    saturnRingTexture.needsUpdate = true;
    return saturnRingTexture;
  }

  function createSaturnGroup() {
    const group = new THREE.Group();

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 20, 20),
      gateAccentMaterial
    );
    group.add(planet);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.07, 12, 48),
      new THREE.MeshStandardMaterial({
        map: getSaturnRingTexture(),
        color: 0xffffff,
        emissive: 0xffcf5a,
        emissiveIntensity: 0.42,
        roughness: 0.34,
        metalness: 0.08
      })
    );
    ring.rotation.set(Math.PI * 0.42, 0, Math.PI * 0.16);
    ring.scale.set(1.08, 0.68, 1);
    group.add(ring);

    group.userData.planet = planet;
    group.userData.ring = ring;
    return group;
  }

  function createGate(seed) {
    const group = new THREE.Group();
    const shell = [];
    const depth = 0.7;

    const segments = Array.from(
      { length: 8 },
      () => new THREE.Mesh(new THREE.BoxGeometry(1, 1, depth), gateMaterial)
    );

    segments.forEach((segment) => {
      shell.push(segment);
      group.add(segment);
    });

    const accent = new THREE.Group();
    accent.position.z = 0.45;

    const accentRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.08, 12, 42),
      gateAccentMaterial
    );
    accentRing.rotation.y = Math.PI * 0.5;
    accent.add(accentRing);

    const accentFish = new THREE.Mesh(createFishGeometry(), gateAccentMaterial);
    accentFish.visible = false;
    accent.add(accentFish);

    const accentSaturn = createSaturnGroup();
    accentSaturn.visible = false;
    accent.add(accentSaturn);

    group.add(accent);

    const bonusSlot = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), bonusSlotMaterial);
    bonusSlot.position.z = 0.36;
    bonusSlot.visible = false;
    group.add(bonusSlot);

    const bonusStar = new THREE.Mesh(createStarGeometry(), bonusStarMaterial);
    bonusStar.position.z = 0.7;
    bonusStar.visible = false;
    group.add(bonusStar);

    group.userData = {
      seed,
      shell,
      accent,
      accentRing,
      accentFish,
      accentSaturn,
      accentTheme: "sky",
      bonusSlot,
      bonusStar,
      outerWidth: 14,
      outerHeight: 9.4,
      gapX: 0,
      gapY: 0,
      gapWidth: 0,
      gapHeight: 0,
      safeRect: null,
      bonusRect: null,
      bonusSide: null,
      bonusActive: false,
      bonusCollected: false,
      ringNumber: seed,
      cleared: false
    };

    return { group };
  }

  function placeSegment(mesh, minX, maxX, minY, maxY) {
    const width = maxX - minX;
    const height = maxY - minY;

    if (width <= 0.04 || height <= 0.04) {
      mesh.visible = false;
      return;
    }

    mesh.visible = true;
    mesh.position.set((minX + maxX) * 0.5, (minY + maxY) * 0.5, 0);
    mesh.scale.set(width, height, 1);
  }

  function layoutGateShell(data, left, right, top, bottom) {
    const outerLeft = -data.outerWidth * 0.5;
    const outerRight = data.outerWidth * 0.5;
    const outerTop = data.outerHeight * 0.5;
    const outerBottom = -data.outerHeight * 0.5;

    data.shell.forEach((segment) => {
      segment.visible = false;
    });

    placeSegment(data.shell[2], left, right, top, outerTop);
    placeSegment(data.shell[3], left, right, outerBottom, bottom);

    if (!data.bonusActive || !data.bonusRect) {
      placeSegment(data.shell[0], outerLeft, left, bottom, top);
      placeSegment(data.shell[1], right, outerRight, bottom, top);
      return;
    }

    const pocket = data.bonusRect;

    if (data.bonusSide === "left") {
      placeSegment(data.shell[0], outerLeft, left, pocket.top, top);
      placeSegment(data.shell[1], right, outerRight, bottom, top);
      placeSegment(data.shell[4], outerLeft, left, bottom, pocket.bottom);
      placeSegment(data.shell[5], outerLeft, pocket.left, pocket.bottom, pocket.top);
      placeSegment(data.shell[6], pocket.right, left, pocket.bottom, pocket.top);
      return;
    }

    placeSegment(data.shell[0], outerLeft, left, bottom, top);
    placeSegment(data.shell[1], right, outerRight, pocket.top, top);
    placeSegment(data.shell[4], right, outerRight, bottom, pocket.bottom);
    placeSegment(data.shell[5], right, pocket.left, pocket.bottom, pocket.top);
    placeSegment(data.shell[6], pocket.right, outerRight, pocket.bottom, pocket.top);
  }

  function activateBonusPocket(data, mode, left, right) {
    data.bonusActive = false;
    data.bonusCollected = false;
    data.bonusRect = null;
    data.bonusSide = null;
    data.bonusSlot.visible = false;
    data.bonusStar.visible = false;

    if (!mode.bonusEvery || data.ringNumber % mode.bonusEvery !== 0) {
      return;
    }

    const outerLeft = -data.outerWidth * 0.5;
    const outerRight = data.outerWidth * 0.5;
    const pocketWidth = data.gapWidth;
    const pocketHeight = data.gapHeight;
    const outerMargin = 0.52;
    const gapMargin = 0.24;
    const leftPocketMinX = outerLeft + outerMargin + pocketWidth + gapMargin;
    const rightPocketMaxX = outerRight - outerMargin - pocketWidth - gapMargin;
    const canUseLeft = left >= leftPocketMinX;
    const canUseRight = right <= rightPocketMaxX;
    const preferredSide = data.ringNumber % 2 === 0 ? "left" : "right";
    const side = preferredSide === "left"
      ? (canUseLeft ? "left" : (canUseRight ? "right" : null))
      : (canUseRight ? "right" : (canUseLeft ? "left" : null));

    if (!side) {
      return;
    }

    const centerY = THREE.MathUtils.clamp(
      data.gapY + Math.sin(data.ringNumber * 0.9) * 0.7,
      -data.outerHeight * 0.5 + pocketHeight * 0.5 + 0.38,
      data.outerHeight * 0.5 - pocketHeight * 0.5 - 0.38
    );

    let pocketLeft;
    let pocketRight;
    if (side === "left") {
      pocketRight = left - gapMargin;
      pocketLeft = pocketRight - pocketWidth;
    } else {
      pocketLeft = right + gapMargin;
      pocketRight = pocketLeft + pocketWidth;
    }

    data.bonusRect = {
      left: pocketLeft,
      right: pocketRight,
      bottom: centerY - pocketHeight * 0.5,
      top: centerY + pocketHeight * 0.5
    };
    data.bonusSide = side;
    data.bonusActive = true;

    data.bonusSlot.visible = true;
    data.bonusSlot.scale.set(pocketRight - pocketLeft, pocketHeight, 1);
    data.bonusSlot.position.set((pocketLeft + pocketRight) * 0.5, centerY, 0.36);

    data.bonusStar.visible = true;
    data.bonusStar.position.set((pocketLeft + pocketRight) * 0.5, centerY, 0.7);
    data.bonusStar.rotation.z = data.ringNumber * 0.2;
  }

  function randomizeGate(gate, ringNumber, mode) {
    const data = gate.group.userData;
    const t = performance.now() * 0.001 + ringNumber * 0.38 + Math.random();
    const gapScale = getGapScale(Math.max(0, ringNumber - 1), mode);

    data.ringNumber = ringNumber;
    data.gapWidth = THREE.MathUtils.randFloat(2.4 * gapScale, 4.1 * gapScale);
    data.gapHeight = THREE.MathUtils.randFloat(2.2 * gapScale, 3.6 * gapScale);

    const maxGapX = Math.max(0, data.outerWidth * 0.5 - data.gapWidth * 0.5 - GATE_MARGIN);
    const maxGapY = Math.max(0, data.outerHeight * 0.5 - data.gapHeight * 0.5 - GATE_MARGIN);

    data.gapX = Math.sin(t * 1.6) * maxGapX;
    data.gapY = Math.cos(t * 1.2) * maxGapY * 0.88 + Math.min(0.28, maxGapY);
    data.gapY = THREE.MathUtils.clamp(data.gapY, -maxGapY, maxGapY);
    data.cleared = false;
    gate.group.visible = true;
    gate.group.scale.set(1, 1, 1);

    const left = data.gapX - data.gapWidth * 0.5;
    const right = data.gapX + data.gapWidth * 0.5;
    const top = data.gapY + data.gapHeight * 0.5;
    const bottom = data.gapY - data.gapHeight * 0.5;

    data.accentTheme = mode.theme;
    data.accent.scale.set(1, 1, 1);
    data.accent.position.set(data.gapX, data.gapY, 0.45);
    data.accentRing.scale.set(data.gapHeight * 0.46, data.gapWidth * 0.38, 1);
    data.accentRing.visible = mode.theme !== "sea" && mode.theme !== "space";
    const fishScale = Math.min(data.gapWidth * 0.34, data.gapHeight * 0.34);
    data.accentFish.scale.set(fishScale, fishScale, 1);
    data.accentFish.visible = mode.theme === "sea";
    const saturnScale = Math.min(data.gapWidth, data.gapHeight) * 0.34;
    data.accentSaturn.scale.setScalar(saturnScale);
    data.accentSaturn.visible = mode.theme === "space";
    data.accent.visible = true;
    data.safeRect = { left, right, top, bottom };

    activateBonusPocket(data, mode, left, right);
    layoutGateShell(data, left, right, top, bottom);
  }

  function createSkyDecorations(cloudTextures = [], mountainTextures = []) {
    const group = new THREE.Group();
    group.userData.key = "sky";
    const mountainGlowTexture = createMountainGlowTexture();

    mountainTextures.forEach((texture) => {
      for (let index = 0; index < 4; index += 1) {
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            color: 0xdcefff,
            transparent: true,
            opacity: 0.96,
            depthWrite: false,
            depthTest: true,
            fog: false
          })
        );
        const glow = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: mountainGlowTexture,
            color: 0x8bc5ff,
            transparent: true,
            opacity: 0.34,
            depthWrite: false,
            depthTest: true,
            fog: false
          })
        );
        const aspect = texture.image ? texture.image.height / texture.image.width : THREE.MathUtils.randFloat(0.32, 0.52);
        const width = THREE.MathUtils.randFloat(15, 24);
        sprite.scale.set(width, width * aspect, 1);
        sprite.center.set(0.5, 0);
        sprite.renderOrder = -8;
        glow.center.set(0.5, 0);
        glow.scale.set(1.48, 0.9, 1);
        glow.position.z = -0.2;
        glow.renderOrder = -9;
        sprite.add(glow);
        sprite.userData.kind = "mountain";
        sprite.userData.speedFactor = THREE.MathUtils.randFloat(0.34, 0.62);
        sprite.userData.reset = (initial = false) => {
          const travelLimit = 18 + sprite.scale.x * 0.72;
          const respawnBand = Math.max(2.4, travelLimit * 0.22);
          let nextX;

          if (initial || !sprite.userData.originSide) {
            nextX = THREE.MathUtils.randFloat(-travelLimit, travelLimit);
            sprite.userData.originSide = nextX < 0 ? -1 : 1;
          } else {
            nextX = THREE.MathUtils.randFloat(respawnBand, travelLimit * 0.4) * sprite.userData.originSide;
          }

          sprite.userData.baseZ = THREE.MathUtils.randFloat(-132, -92);
          sprite.userData.driftDirection = sprite.userData.originSide;
          sprite.position.set(
            nextX,
            getSkyMountainFloorY(sprite),
            sprite.userData.baseZ
          );
        };
        sprite.userData.reset(true);
        group.add(sprite);
      }
    });

    cloudTextures.forEach((texture, textureIndex) => {
      for (let index = 0; index < 4; index += 1) {
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.5
          })
        );
        const width = THREE.MathUtils.randFloat(4.4, 7.4);
        sprite.scale.set(width, width * THREE.MathUtils.randFloat(0.42, 0.58), 1);
        sprite.material.rotation = THREE.MathUtils.randFloatSpread(0.08);
        sprite.userData.kind = "cloud";
        sprite.userData.speedFactor = THREE.MathUtils.randFloat(0.18, 0.3);
        sprite.userData.reset = (initial = false) => {
          sprite.position.set(
            THREE.MathUtils.randFloatSpread(20),
            THREE.MathUtils.randFloat(1.6, 7.2),
            initial ? THREE.MathUtils.randFloat(-210, -34) : -210 - Math.random() * 34
          );
        };
        sprite.userData.reset(true);
        sprite.userData.textureIndex = textureIndex;
        group.add(sprite);
      }
    });

    return group;
  }

  function createMountainGlowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext("2d");

    if (!context) {
      return new THREE.Texture();
    }

    const gradient = context.createRadialGradient(128, 118, 18, 128, 114, 120);
    gradient.addColorStop(0, "rgba(177, 225, 255, 0.95)");
    gradient.addColorStop(0.35, "rgba(118, 184, 255, 0.42)");
    gradient.addColorStop(0.68, "rgba(76, 132, 232, 0.12)");
    gradient.addColorStop(1, "rgba(76, 132, 232, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  function getSkyMountainFloorY(sprite) {
    if (!camera) {
      return TRACK_BOTTOM - 3.8;
    }

    const distance = Math.max(0.1, Math.abs(camera.position.z - sprite.position.z));
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * distance;
    const viewportBottom = camera.position.y - visibleHeight * 0.5;
    return viewportBottom + 0.18;
  }

  function pinSkyMountainsToViewportFloor() {
    const skyGroup = stageGroups.sky;
    if (!skyGroup) {
      return;
    }

    skyGroup.children.forEach((item) => {
      if (item.userData.kind === "mountain") {
        item.position.y = getSkyMountainFloorY(item);
      }
    });
  }

  function createSeaDecorations() {
    const group = new THREE.Group();
    group.userData.key = "sea";

    for (let index = 0; index < 14; index += 1) {
      const column = new THREE.Group();
      for (let bubble = 0; bubble < 4; bubble += 1) {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(THREE.MathUtils.randFloat(0.14, 0.34), 12, 12),
          new THREE.MeshBasicMaterial({
            color: 0xb8ffff,
            transparent: true,
            opacity: 0.18 + bubble * 0.04
          })
        );
        sphere.position.set(
          THREE.MathUtils.randFloatSpread(0.5),
          bubble * THREE.MathUtils.randFloat(0.5, 0.9),
          THREE.MathUtils.randFloatSpread(0.2)
        );
        column.add(sphere);
      }

      column.userData.speedFactor = THREE.MathUtils.randFloat(0.42, 0.7);
      column.userData.reset = (initial = false) => {
        column.position.set(
          THREE.MathUtils.randFloatSpread(16),
          THREE.MathUtils.randFloat(-2.2, 4.8),
          initial ? THREE.MathUtils.randFloat(-190, -30) : -190 - Math.random() * 24
        );
      };
      column.userData.reset(true);
      group.add(column);
    }

    return group;
  }

  function createSpaceDecorations() {
    const group = new THREE.Group();
    group.userData.key = "space";

    for (let index = 0; index < 18; index += 1) {
      const crystal = new THREE.Mesh(
        new THREE.IcosahedronGeometry(THREE.MathUtils.randFloat(0.25, 1.1), 0),
        new THREE.MeshStandardMaterial({
          color: 0x9186ff,
          emissive: 0x4d2b77,
          emissiveIntensity: 0.9,
          roughness: 0.3,
          metalness: 0.28
        })
      );

      crystal.userData.spin = THREE.MathUtils.randFloatSpread(1.2);
      crystal.userData.speedFactor = THREE.MathUtils.randFloat(0.46, 0.86);
      crystal.userData.reset = (initial = false) => {
        crystal.position.set(
          THREE.MathUtils.randFloatSpread(22),
          THREE.MathUtils.randFloatSpread(10),
          initial ? THREE.MathUtils.randFloat(-210, -30) : -210 - Math.random() * 30
        );
        crystal.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
      };
      crystal.userData.reset(true);
      group.add(crystal);
    }

    return group;
  }

  function createCityDecorations() {
    const group = new THREE.Group();
    group.userData.key = "city";

    for (let index = 0; index < 18; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const building = new THREE.Group();
      const width = THREE.MathUtils.randFloat(1.2, 3.2);
      const height = THREE.MathUtils.randFloat(4.4, 10.8);
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, THREE.MathUtils.randFloat(1.2, 2.2)),
        new THREE.MeshStandardMaterial({
          color: 0x130f1c,
          emissive: 0x2a102c,
          emissiveIntensity: 0.85,
          roughness: 0.75
        })
      );
      body.position.y = height * 0.5;
      building.add(body);

      const strip = new THREE.Mesh(
        new THREE.PlaneGeometry(width * 0.72, height * 0.86),
        new THREE.MeshBasicMaterial({
          color: 0xffb66a,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide
        })
      );
      strip.position.set(0, height * 0.5, 1.12);
      building.add(strip);

      building.userData.side = side;
      building.userData.speedFactor = THREE.MathUtils.randFloat(0.88, 1.12);
      building.userData.reset = (initial = false) => {
        building.position.set(
          side * THREE.MathUtils.randFloat(8.2, 13.2),
          TRACK_BOTTOM - 0.55,
          initial ? THREE.MathUtils.randFloat(-210, -38) : -210 - Math.random() * 28
        );
      };
      building.userData.reset(true);
      group.add(building);
    }

    return group;
  }

  function createStageGroups(cloudTextures = [], mountainTextures = []) {
    stageGroups.sky = createSkyDecorations(cloudTextures, mountainTextures);
    stageGroups.sea = createSeaDecorations();
    stageGroups.space = createSpaceDecorations();
    stageGroups.city = createCityDecorations();

    Object.values(stageGroups).forEach((group) => {
      group.visible = false;
      sceneGroup.add(group);
    });
  }

  function applyTheme(themeKey) {
    const theme = THEMES[themeKey];
    applyBodyTheme(themeKey);

    if (scene) {
      scene.fog = new THREE.Fog(theme.sceneColor, theme.fogNear, theme.fogFar);
      scene.background = theme.key === "sky" ? null : new THREE.Color(theme.sceneColor);
    }
    if (ambientLight) {
      ambientLight.intensity = theme.ambientIntensity;
    }
    if (hemiLight) {
      hemiLight.color.setHex(theme.hemiSky);
      hemiLight.groundColor.setHex(theme.hemiGround);
    }
    if (pointLight) {
      pointLight.color.setHex(theme.pointColor);
    }
    if (gateMaterial) {
      gateMaterial.color.setHex(theme.gateColor);
      gateMaterial.emissive.setHex(theme.gateEmissive);
    }
    if (gateAccentMaterial) {
      gateAccentMaterial.color.setHex(theme.accentColor);
      gateAccentMaterial.emissive.setHex(theme.accentColor);
    }
    if (bonusSlotMaterial) {
      bonusSlotMaterial.color.setHex(theme.accentColor);
    }
    if (bonusStarMaterial) {
      bonusStarMaterial.color.setHex(theme.bonusColor);
    }
    if (runway) {
      runway.material.emissive.setHex(theme.runwayColor);
    }
    if (trailMaterial) {
      trailMaterial.color.setHex(theme.trailColor);
    }

    lineMaterials.forEach((material) => material.color.setHex(theme.lineColor));
    railMaterials.forEach((material) => material.color.setHex(theme.railColor));

    if (starField?.material) {
      starField.material.color.setHex(theme.key === "city" ? 0xffb46b : 0xffffff);
      starField.material.opacity = theme.key === "sky" ? 0.52 : 0.7;
    }

    Object.entries(stageGroups).forEach(([key, group]) => {
      group.visible = key === themeKey;
    });
  }

  function usesStaticFiniteGateLayout(mode) {
    return state.running && Number.isFinite(mode.targetRings);
  }

  function layoutGates(mode) {
    gates.forEach((gate, index) => {
      if (usesStaticFiniteGateLayout(mode)) {
        const ringNumber = index + 1;
        if (ringNumber <= mode.targetRings) {
          gate.group.position.z = -46 - index * GATE_SPACING;
          randomizeGate(gate, ringNumber, mode);
        } else {
          hideGate(gate);
        }
        return;
      }

      if (index < GATE_COUNT) {
        gate.group.position.z = -46 - index * GATE_SPACING;
        const ringNumber = index + 1;
        if (shouldRenderGate(ringNumber, mode)) {
          randomizeGate(gate, ringNumber, mode);
        } else {
          hideGate(gate);
        }
      } else {
        hideGate(gate);
      }
    });
  }

  function shouldRenderGate(ringNumber, mode) {
    return !Number.isFinite(mode.targetRings) || ringNumber <= mode.targetRings;
  }

  function hideGate(gate) {
    const data = gate.group.userData;
    gate.group.visible = false;
    gate.group.position.z = -999;
    data.cleared = true;
    data.safeRect = null;
    data.bonusRect = null;
    data.bonusActive = false;
    data.bonusCollected = false;
    data.accent.visible = false;
    data.bonusSlot.visible = false;
    data.bonusStar.visible = false;
  }

  function nextGateRingNumber(currentRingNumber, mode) {
    if (!Number.isFinite(mode.targetRings)) {
      return currentRingNumber + GATE_COUNT;
    }

    return ((currentRingNumber + GATE_COUNT - 1) % mode.targetRings) + 1;
  }

  function placeGateAtQueueTail(gate) {
    const otherVisibleGates = gates
      .filter((candidate) => candidate !== gate && candidate.group.visible)
      .map((candidate) => candidate.group.position.z);
    gate.group.position.z = (otherVisibleGates.length ? Math.min(...otherVisibleGates) : -24) - GATE_SPACING;
  }

  function resetBursts() {
    burstPool.splice(0).forEach((particle) => {
      sceneGroup.remove(particle);
      particle.geometry.dispose();
      particle.material.dispose();
    });
  }

  function resetPlayerPose() {
    if (!player) {
      return;
    }

    player.position.set(0, 0.1, PLAYER_Z);
    player.rotation.set(0, 0, 0);
    camera.position.set(0, 2.7, 18);
    camera.lookAt(0, 0.1, -18);
  }

  function resetPreviewScene(modeKey) {
    state.previewModeKey = modeKey;
    applyTheme(MODES[modeKey].theme);
    if (initialized) {
      layoutGates(MODES[modeKey]);
      resetPlayerPose();
    }
    syncUi();
  }

  function openIntro() {
    state.running = false;
    state.screen = "intro";
    state.musicPreviewPlaying = false;
    state.musicRandomMode = false;
    stopBgmTracks(true);
    setMessage("");
    resetPreviewScene("sky");
  }

  function openMusicMode(trackKey = state.musicTrackKey) {
    state.running = false;
    state.screen = "music";
    state.musicTrackKey = trackKey;
    state.musicPreviewPlaying = false;
    state.musicRandomMode = false;
    state.musicHistory = [];
    state.musicHistoryIndex = -1;
    stopBgmTracks(true);
    setMessage("");
    resetPreviewScene(previewModeKeyForMusicTrack(trackKey));
  }

  function openSelect(modeKey = state.previewModeKey) {
    state.running = false;
    state.screen = "select";
    state.musicPreviewPlaying = false;
    state.musicRandomMode = false;
    stopBgmTracks(true);
    resetPreviewScene(modeKey);
  }

  function showResultScreen(modeKey, outcome = state.resultOutcome) {
    state.screen = "result";
    resultScore.textContent = String(state.score);
    resultBest.textContent = String(state.bests[modeKey] || 0);
    setMessage("");
    resetPreviewScene(modeKey);
    if (outcome === "clear") {
      void syncStageBgm(true, "clear", modeKey);
    } else if (outcome === "failed") {
      void syncStageBgm(true, "failed", modeKey);
    }
  }

  function finishRun(clear) {
    const mode = currentMode();

    state.running = false;
    state.musicPreviewPlaying = false;
    stopBgmTracks(false);
    state.bests[mode.key] = Math.max(state.bests[mode.key], state.score);
    saveBests();

    if (clear) {
      state.resultOutcome = "clear";
      state.resultTitle = `${mode.label} Clear`;
      if (mode.key === "city") {
        state.resultLead = `Score ${state.score}。街ルートのスコアアタックを走り切りました。`;
      } else {
        state.resultLead = `${mode.targetRings}リング到達。${mode.difficulty}ルートを飛び切りました。`;
      }
      playSfx("stage");
    } else {
      state.resultOutcome = "failed";
      state.resultTitle = `${mode.label} Failed`;
      state.resultLead = mode.key === "city"
        ? `Score ${state.score}。20リングごとの星で +${mode.bonusValue} を狙えます。`
        : `Score ${state.score} / ${mode.targetRings}。もう一度同じルートへ挑めます。`;
      playSfx("hit");
    }

    showResultScreen(mode.key, state.resultOutcome);
  }

  function spawnBurst(color, position, amount, scale = 0.08) {
    if (!sceneGroup) {
      return;
    }

    for (let index = 0; index < amount; index += 1) {
      const particle = new THREE.Mesh(
        new THREE.OctahedronGeometry(scale, 0),
        burstMaterial.clone()
      );
      particle.material.color = new THREE.Color(color);
      particle.material.opacity = 1;
      particle.position.copy(position);
      particle.userData.velocity = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(5.6),
        THREE.MathUtils.randFloatSpread(3.8),
        THREE.MathUtils.randFloatSpread(4.8)
      );
      particle.userData.life = THREE.MathUtils.randFloat(0.3, 0.9);
      particle.userData.maxLife = particle.userData.life;
      burstPool.push(particle);
      sceneGroup.add(particle);
    }
  }

  function spawnRingBurst(gate) {
    const data = gate.group.userData;
    const theme = THEMES[currentMode().theme];
    const ringCenter = new THREE.Vector3(data.gapX, data.gapY, PLAYER_Z - 0.4);

    for (let index = 0; index < 18; index += 1) {
      const theta = (index / 18) * Math.PI * 2;
      const fragment = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.12, 0.12),
        burstMaterial.clone()
      );
      fragment.material.color = new THREE.Color(theme.burstColor);
      fragment.material.opacity = 1;

      const ringX = Math.cos(theta) * data.gapWidth * 0.28;
      const ringY = Math.sin(theta) * data.gapHeight * 0.34;
      fragment.position.set(ringCenter.x + ringX, ringCenter.y + ringY, ringCenter.z);
      fragment.userData.velocity = new THREE.Vector3(
        ringX * 2.2 + THREE.MathUtils.randFloatSpread(1.4),
        ringY * 2.2 + THREE.MathUtils.randFloatSpread(1.2),
        THREE.MathUtils.randFloatSpread(2.4)
      );
      fragment.userData.life = THREE.MathUtils.randFloat(0.22, 0.42);
      fragment.userData.maxLife = fragment.userData.life;
      burstPool.push(fragment);
      sceneGroup.add(fragment);
    }
  }

  function ensureAudioContext() {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") {
      return audioContext.resume().then(() => audioContext);
    }
    return Promise.resolve(audioContext);
  }

  function playSfx(type) {
    if (!state.soundEnabled || (!window.AudioContext && !window.webkitAudioContext)) {
      return;
    }

    ensureAudioContext().then((ctx) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const config = {
        clear: { frequency: 520, endFrequency: 760, duration: 0.12, type: "triangle" },
        hit: { frequency: 180, endFrequency: 80, duration: 0.2, type: "sawtooth" },
        stage: { frequency: 340, endFrequency: 520, duration: 0.18, type: "triangle" },
        bonus: { frequency: 640, endFrequency: 980, duration: 0.16, type: "square" }
      }[type];

      if (!config) {
        return;
      }

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(config.endFrequency, ctx.currentTime + config.duration);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + config.duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + config.duration);
    }).catch(() => {
      return;
    });
  }

  async function syncBgmPlayback(reset = false, trackType = "main") {
    const activeTrack = trackType === "clear" ? clearBgm : bgm;
    if (trackType === "main") {
      ensureMainBgmTrack(state.modeKey);
    }
    if (reset) {
      activeTrack.currentTime = 0;
    }
    if (!state.soundEnabled) {
      stopBgmTracks(false);
      return;
    }

    if (trackType === "clear") {
      bgm.pause();
    } else {
      clearBgm.pause();
    }

    try {
      await activeTrack.play();
    } catch {
      setMessage("BGM は SOUND ボタンで再開できます。");
    }
  }

  async function syncStageBgm(reset = false, trackType = "main", modeKey = state.modeKey) {
    const activeTrack = trackType === "clear"
      ? clearBgm
      : trackType === "failed"
        ? failedBgm
        : bgm;

    bgm.loop = true;
    clearBgm.loop = true;
    failedBgm.loop = true;

    if (trackType === "main") {
      ensureMainBgmTrack(modeKey);
    }

    if (reset) {
      activeTrack.currentTime = 0;
    }

    if (!state.soundEnabled) {
      stopBgmTracks(false);
      return;
    }

    bgm.pause();
    clearBgm.pause();
    failedBgm.pause();

    try {
      await activeTrack.play();
    } catch {
      setMessage("BGM は SOUND ボタンで再開できます。");
    }
  }

  async function playMusicPreview(trackKey = state.musicTrackKey, options = {}) {
    const { skipHistory = false } = options;
    state.musicTrackKey = trackKey;
    state.musicPreviewPlaying = true;
    if (!skipHistory) {
      pushMusicHistory(trackKey);
    }
    resetPreviewScene(previewModeKeyForMusicTrack(trackKey));
    syncUi();

    if (MUSIC_TRACK_META[trackKey]?.locked) {
      state.musicPreviewPlaying = false;
      syncUi();
      setMessage("宇宙 BGM は準備中です。音源を追加したらここで再生できます。");
      return;
    }

    if (!state.soundEnabled) {
      setMessage("SOUND ON でミュージックを再生できます。");
      return;
    }

    stopBgmTracks(true);

    try {
      if (trackKey === "clear") {
        clearBgm.loop = !state.musicRandomMode;
        await clearBgm.play();
      } else if (trackKey === "failed") {
        failedBgm.loop = !state.musicRandomMode;
        await failedBgm.play();
      } else {
        ensureMainBgmTrack(trackKey);
        bgm.loop = !state.musicRandomMode;
        await bgm.play();
      }
      setMessage("");
    } catch {
      state.musicPreviewPlaying = false;
      syncUi();
      setMessage("BGM の再生に失敗しました。");
    }
  }

  async function playRandomMusicPreview(initial = false) {
    state.musicRandomMode = true;
    const nextTrackKey = pickRandomMusicTrackKey(initial ? "" : state.musicTrackKey);
    await playMusicPreview(nextTrackKey);
  }

  async function playPreviousMusicPreview() {
    if (!canPlayPreviousMusicTrack()) {
      return;
    }

    state.musicRandomMode = false;
    state.musicHistoryIndex -= 1;
    await playMusicPreview(state.musicHistory[state.musicHistoryIndex], { skipHistory: true });
  }

  async function playNextMusicPreview() {
    if (state.musicRandomMode) {
      await playRandomMusicPreview();
      return;
    }

    if (!canPlayNextMusicTrack()) {
      return;
    }

    state.musicHistoryIndex += 1;
    await playMusicPreview(state.musicHistory[state.musicHistoryIndex], { skipHistory: true });
  }

  function stopMusicPreview(reset = true) {
    state.musicPreviewPlaying = false;
    state.musicRandomMode = false;
    stopBgmTracks(reset);
    syncUi();
  }

  function updateTunnel() {
    tunnelLines.children.forEach((line) => {
      if (line.userData.baseZ === undefined) {
        return;
      }
      const loopDistance = 220;
      const moved = ((state.time * (state.running ? state.speed : 8) * 0.82) + Math.abs(line.userData.baseZ)) % loopDistance;
      line.position.z = 28 - moved;
    });
  }

  function updateStars(delta) {
    const positions = starField.geometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      let z = positions.getZ(index) + delta * ((state.running ? state.speed : 7) * 1.5 + index * 0.003);
      if (z > 36) {
        z = -200;
      }
      positions.setZ(index, z);
    }
    positions.needsUpdate = true;
  }

  function updateDecorations(delta) {
    Object.entries(stageGroups).forEach(([key, group]) => {
      if (!group.visible) {
        return;
      }

      group.children.forEach((item) => {
        if (key === "sky" && item.userData.kind === "mountain") {
          item.position.x += delta * (state.running ? state.speed : 7.5) * 0.14 * item.userData.speedFactor * item.userData.driftDirection;
          item.position.z = item.userData.baseZ;
          item.position.y = getSkyMountainFloorY(item);

          const travelLimit = 18 + item.scale.x * 0.72;
          if (
            (item.userData.driftDirection > 0 && item.position.x > travelLimit)
            || (item.userData.driftDirection < 0 && item.position.x < -travelLimit)
          ) {
            item.userData.reset();
          }
          return;
        }

        item.position.z += delta * (state.running ? state.speed : 7.5) * item.userData.speedFactor;
        if (item.position.z > 28) {
          item.userData.reset();
        }

        if (key === "sky") {
          item.position.y += Math.sin(state.time * 0.8 + item.position.z * 0.02) * delta * 0.26;
        } else if (key === "sea") {
          item.position.x += Math.sin(state.time * 1.2 + item.position.z * 0.04) * delta * 0.18;
        } else if (key === "space") {
          item.rotation.x += delta * item.userData.spin * 0.6;
          item.rotation.y += delta * item.userData.spin * 0.9;
        } else if (key === "city") {
          item.rotation.y = Math.sin(state.time * 0.4 + item.position.z * 0.02) * 0.06;
        }
      });
    });
  }

  function updateTrail() {
    trailMesh.position.x = player.position.x;
    trailMesh.scale.x = THREE.MathUtils.lerp(trailMesh.scale.x, 0.72 + Math.abs(state.playerVelocityX) * 0.012, 0.14);
    trailMesh.material.opacity = 0.18 + Math.min(0.18, state.speed * 0.004);
  }

  function updateBursts(delta) {
    for (let index = burstPool.length - 1; index >= 0; index -= 1) {
      const particle = burstPool[index];
      particle.userData.life -= delta;
      particle.position.addScaledVector(particle.userData.velocity, delta);
      particle.material.opacity = particle.userData.life / particle.userData.maxLife;
      particle.scale.setScalar(1 + (1 - particle.material.opacity) * 1.8);

      if (particle.userData.life <= 0) {
        sceneGroup.remove(particle);
        particle.geometry.dispose();
        particle.material.dispose();
        burstPool.splice(index, 1);
      }
    }
  }

  function updateKeyboard(delta) {
    const horizontal = (keyboard.has("arrowright") || keyboard.has("d") ? 1 : 0)
      - (keyboard.has("arrowleft") || keyboard.has("a") ? 1 : 0);
    const vertical = (keyboard.has("arrowup") || keyboard.has("w") ? 1 : 0)
      - (keyboard.has("arrowdown") || keyboard.has("s") ? 1 : 0);

    if (!horizontal && !vertical) {
      return;
    }

    state.targetX = THREE.MathUtils.clamp(
      state.targetX + horizontal * delta * 8.5,
      -TRACK_HALF_WIDTH + 0.42,
      TRACK_HALF_WIDTH - 0.42
    );
    state.targetY = THREE.MathUtils.clamp(
      state.targetY + vertical * delta * 7.2,
      TRACK_BOTTOM + 0.38,
      TRACK_TOP - 0.3
    );
  }

  function updatePlayer(delta) {
    updateKeyboard(delta);

    const previousX = player.position.x;
    const previousY = player.position.y;
    player.position.x = THREE.MathUtils.lerp(player.position.x, state.targetX, 1 - Math.exp(-delta * 10));
    player.position.y = THREE.MathUtils.lerp(player.position.y, state.targetY, 1 - Math.exp(-delta * 10));
    player.position.z = PLAYER_Z;

    state.playerVelocityX = (player.position.x - previousX) / Math.max(delta, 0.001);
    state.playerVelocityY = (player.position.y - previousY) / Math.max(delta, 0.001);

    player.rotation.z = THREE.MathUtils.clamp(-state.playerVelocityX * 0.03, -0.12, 0.12);
    penguinSprite.material.rotation = THREE.MathUtils.clamp(-state.playerVelocityX * 0.01, -0.08, 0.08);
    penguinSprite.position.y = Math.sin(state.time * 11) * 0.06 + 0.18;
    penguinSprite.scale.set(
      (3.55 + Math.sin(state.time * 9) * 0.05) * PENGUIN_SCALE,
      (4.2 + Math.cos(state.time * 9) * 0.06) * PENGUIN_SCALE,
      1
    );
    penguinAura.scale.setScalar(1 + Math.sin(state.time * 6) * 0.05);
    playerShadow.scale.setScalar(0.9 - Math.abs(Math.sin(state.time * 11)) * 0.08);
    playerShadow.position.x = player.position.x * 0.08;

    if (state.hitFlashTime > 0) {
      state.hitFlashTime = Math.max(0, state.hitFlashTime - delta);
      const blinkVisible = Math.floor(state.hitFlashTime * 16) % 2 === 0;
      penguinSprite.visible = blinkVisible;
      penguinAura.visible = blinkVisible;
      playerShadow.visible = blinkVisible;
    } else {
      penguinSprite.visible = true;
      penguinAura.visible = true;
      playerShadow.visible = true;
    }

    pointLight.position.x = player.position.x * 0.2;
    pointLight.position.y = 3 + player.position.y * 0.2;
    pointLight.intensity = 13 + Math.sin(state.time * 5.4) * 0.8;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, player.position.x * 0.34, 1 - Math.exp(-delta * 4));
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.7 + player.position.y * 0.24, 1 - Math.exp(-delta * 4));
    camera.position.z = 18 + state.shake;
    camera.lookAt(player.position.x * 0.14, player.position.y * 0.1, -18);
    updateTrail();
  }

  function updateGateVisuals(gate, delta) {
    const data = gate.group.userData;
    if (!gate.group.visible) {
      return;
    }

    if (data.accentTheme === "sea") {
      data.accent.rotation.z = Math.sin(state.time * 3.4 + data.ringNumber * 0.35) * 0.16;
      data.accentFish.position.x = Math.sin(state.time * 5 + data.ringNumber) * 0.12;
      data.accentSaturn.rotation.y = 0;
    } else if (data.accentTheme === "space") {
      data.accent.rotation.z += delta * 0.42;
      data.accentSaturn.rotation.y = 0;
      data.accentSaturn.rotation.z = 0;
      data.accentFish.position.x = 0;
    } else {
      data.accent.rotation.z += delta * 1.6;
      data.accentFish.position.x = 0;
      data.accentSaturn.rotation.y = 0;
    }

    if (data.bonusStar.visible) {
      data.bonusStar.rotation.z += delta * 4;
      const pulse = 0.9 + Math.sin(state.time * 10 + data.ringNumber) * 0.12;
      data.bonusStar.scale.setScalar(pulse);
      data.bonusSlot.material.opacity = 0.32 + Math.sin(state.time * 7 + data.ringNumber) * 0.1;
    }
  }

  function checkGate(gate) {
    if (!gate.group.visible) {
      return;
    }

    const data = gate.group.userData;
    const mode = currentMode();
    const theme = THEMES[mode.theme];

    if (!data.cleared && gate.group.position.z >= PLAYER_Z) {
      data.cleared = true;
      const insideMain = pointInRect(player.position.x, player.position.y, data.safeRect, 0.34, 0.26);
      const insideBonus = data.bonusActive && pointInRect(player.position.x, player.position.y, data.bonusRect, 0.16, 0.12);

      if (insideMain || insideBonus) {
        state.ringsCleared += 1;
        state.score += 1;
        state.speed = calculateSpeed(mode, state.ringsCleared);

        spawnBurst(theme.burstColor, new THREE.Vector3(data.gapX, data.gapY, PLAYER_Z - 0.8), 12);
        spawnRingBurst(gate);
        playSfx("clear");
        data.accent.visible = false;

        if (data.bonusActive && !data.bonusCollected) {
          const bonusDistance = Math.hypot(
            player.position.x - data.bonusStar.position.x,
            player.position.y - data.bonusStar.position.y
          );

          if (insideBonus || bonusDistance <= 0.7) {
            data.bonusCollected = true;
            data.bonusStar.visible = false;
            state.score += mode.bonusValue || 0;
            spawnBurst(theme.bonusColor, data.bonusStar.position.clone().setZ(PLAYER_Z - 0.55), 22, 0.1);
            playSfx("bonus");
          }
        }

        scoreValue.textContent = String(state.score);

        if (Number.isFinite(mode.targetRings) && state.ringsCleared >= mode.targetRings) {
          finishRun(true);
          return;
        }
      } else {
        spawnBurst(0xff769e, player.position.clone(), 24, 0.1);
        if (state.hitsRemaining > 0) {
          absorbHit();
          playSfx("hit");
        } else {
          finishRun(false);
        }
        return;
      }
    }

    if (gate.group.position.z > 25) {
      if (Number.isFinite(mode.targetRings)) {
        hideGate(gate);
      } else {
        const nextRingNumber = gate.group.userData.ringNumber + GATE_COUNT;
        if (shouldRenderGate(nextRingNumber, mode)) {
          gate.group.position.z -= GATE_COUNT * GATE_SPACING;
          randomizeGate(gate, nextRingNumber, mode);
        } else {
          hideGate(gate);
        }
      }
    }
  }

  function animateIdle(delta) {
    penguinSprite.visible = true;
    penguinAura.visible = true;
    playerShadow.visible = true;
    player.position.y = THREE.MathUtils.lerp(player.position.y, 0.2 + Math.sin(state.time * 1.9) * 0.12, 1 - Math.exp(-delta * 4));
    player.position.x = THREE.MathUtils.lerp(player.position.x, Math.sin(state.time * 1.3) * 0.26, 1 - Math.exp(-delta * 4));
    penguinSprite.position.y = Math.sin(state.time * 8) * 0.08 + 0.16;
    penguinSprite.scale.set(3.55 * PENGUIN_SCALE, 4.2 * PENGUIN_SCALE, 1);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, player.position.x * 0.18, 1 - Math.exp(-delta * 4));
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.8 + player.position.y * 0.18, 1 - Math.exp(-delta * 4));
    camera.position.z = 18;
    camera.lookAt(player.position.x * 0.12, player.position.y * 0.1, -18);
    updateTrail();
  }

  function updateIdleGates(delta) {
    const mode = previewMode();
    gates.forEach((gate) => {
      if (!gate.group.visible) {
        return;
      }

      gate.group.position.z += delta * 7.5;
      updateGateVisuals(gate, delta);

      if (gate.group.position.z > 25) {
        gate.group.position.z -= GATE_COUNT * GATE_SPACING;
        randomizeGate(gate, nextGateRingNumber(gate.group.userData.ringNumber, mode), mode);
      }
    });
  }

  function tick(now) {
    const delta = Math.min(0.05, (now - state.lastFrame) / 1000 || 0.016);
    state.lastFrame = now;
    state.time += delta;
    state.shake = THREE.MathUtils.lerp(state.shake, 0, 1 - Math.exp(-delta * 12));

    updateTunnel();
    updateStars(delta * (state.running ? 1 : 0.5));
    updateDecorations(delta);
    updateBursts(delta);

    if (state.running) {
      updatePlayer(delta);
      gates.forEach((gate) => {
        gate.group.position.z += delta * state.speed;
        gate.group.rotation.z = Math.sin(state.time * 1.2 + gate.group.userData.ringNumber) * 0.02;
        updateGateVisuals(gate, delta);
        checkGate(gate);
      });
    } else {
      animateIdle(delta);
      updateIdleGates(delta);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  async function ensureScene() {
    if (initialized) {
      return true;
    }

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      sceneRoot.append(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 320);
      camera.position.set(0, 2.7, 18);

      ambientLight = new THREE.AmbientLight(0xffffff, THEMES.sky.ambientIntensity);
      hemiLight = new THREE.HemisphereLight(THEMES.sky.hemiSky, THEMES.sky.hemiGround, 1.1);
      pointLight = new THREE.PointLight(THEMES.sky.pointColor, 13, 80, 2);
      pointLight.position.set(0, 3, 10);

      scene.add(ambientLight);
      scene.add(hemiLight);
      scene.add(pointLight);

      sceneGroup = new THREE.Group();
      scene.add(sceneGroup);

      gateMaterial = new THREE.MeshStandardMaterial({
        color: THEMES.sky.gateColor,
        emissive: THEMES.sky.gateEmissive,
        emissiveIntensity: 0.9,
        roughness: 0.28,
        metalness: 0.16
      });
      gateAccentMaterial = new THREE.MeshStandardMaterial({
        color: THEMES.sky.accentColor,
        emissive: THEMES.sky.accentColor,
        emissiveIntensity: 1,
        roughness: 0.2,
        metalness: 0.08
      });
      bonusSlotMaterial = new THREE.MeshBasicMaterial({
        color: THEMES.sky.accentColor,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide
      });
      bonusStarMaterial = new THREE.MeshBasicMaterial({
        color: THEMES.sky.bonusColor,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
      });
      burstMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1
      });

      runway = createRunway();
      tunnelLines = createTunnel();
      trailMesh = createTrail();
      starField = createStarField();

      sceneGroup.add(runway);
      sceneGroup.add(tunnelLines);
      sceneGroup.add(trailMesh);
      scene.add(starField);

      const [texture, cloudTextures, mountainTextures] = await Promise.all([
        loadPenguinTexture(),
        loadCloudTextures(),
        loadMountainTextures()
      ]);
      player = createPenguin(texture);
      sceneGroup.add(player);

      createStageGroups(cloudTextures, mountainTextures);
      pinSkyMountainsToViewportFloor();

      for (let index = 0; index < MAX_FINITE_GATES; index += 1) {
        const gate = createGate(index + 1);
        gates.push(gate);
        sceneGroup.add(gate.group);
      }

      resetPlayerPose();
      layoutGates(previewMode());
      applyTheme(activeThemeKey());

      initialized = true;
      state.lastFrame = performance.now();
      requestAnimationFrame(tick);
      return true;
    } catch (error) {
      console.error(error);
      setMessage("画像または three.js の読み込みに失敗しました。ファイル配置とネットワークを確認してください。");
      return false;
    }
  }

  async function startMode(modeKey) {
    const ready = await ensureScene();
    if (!ready) {
      return;
    }

    const mode = MODES[modeKey];
    state.modeKey = modeKey;
    state.previewModeKey = modeKey;
    state.screen = "running";
    state.running = true;
    state.score = 0;
    state.ringsCleared = 0;
    state.hitsRemaining = 2;
    state.musicRandomMode = false;
    state.nextRingNumber = Number.isFinite(mode.targetRings)
      ? Math.min(mode.targetRings, GATE_COUNT) + 1
      : GATE_COUNT + 1;
    state.speed = mode.speedStart;
    state.targetX = 0;
    state.targetY = 0.1;
    state.playerVelocityX = 0;
    state.playerVelocityY = 0;
    state.hitFlashTime = 0;
    state.shake = 0;
    state.lastFrame = performance.now();

    scoreValue.textContent = "0";
    setMessage("");
    syncUi();
    applyTheme(mode.theme);
    resetPlayerPose();
    layoutGates(mode);
    resetBursts();

    await syncStageBgm(true, "main", modeKey);
    playSfx("stage");
  }

  function handlePointer(clientX, clientY) {
    if (!state.running) {
      return;
    }

    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;
    pointer.x = THREE.MathUtils.lerp(-TRACK_HALF_WIDTH + 0.45, TRACK_HALF_WIDTH - 0.45, x);
    pointer.y = THREE.MathUtils.lerp(TRACK_TOP - 0.35, TRACK_BOTTOM + 0.35, y);
    state.targetX = pointer.x;
    state.targetY = pointer.y;
  }

  function shouldHandleScreenTouch(target) {
    return state.running && !!target && !target.closest("button");
  }

  gameModeButton.addEventListener("click", () => {
    openSelect("sky");
  });

  musicModeButton.addEventListener("click", () => {
    openMusicMode();
  });

  modeButtons.forEach((button) => {
    button.addEventListener("pointerenter", () => {
      resetPreviewScene(button.dataset.mode);
    });
    button.addEventListener("focus", () => {
      resetPreviewScene(button.dataset.mode);
    });
    button.addEventListener("click", () => {
      void startMode(button.dataset.mode);
    });
  });

  cityTrackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTrackKey = button.dataset.cityTrack;
      if (!SOUNDTRACKS[nextTrackKey]) {
        return;
      }

      state.cityTrackKey = nextTrackKey;
      saveSettings();
      syncUi();
    });
  });

  musicTrackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.musicRandomMode = false;
      void playMusicPreview(button.dataset.previewTrack);
    });
  });

  if (musicRandomButton) {
    musicRandomButton.addEventListener("click", () => {
      void playRandomMusicPreview(true);
    });
  }

  if (musicPrevButton) {
    musicPrevButton.addEventListener("click", () => {
      void playPreviousMusicPreview();
    });
  }

  if (musicNextButton) {
    musicNextButton.addEventListener("click", () => {
      void playNextMusicPreview();
    });
  }

  musicStopButton.addEventListener("click", () => {
    stopMusicPreview(true);
  });

  musicBackButton.addEventListener("click", () => {
    openIntro();
  });

  [bgm, clearBgm, failedBgm].forEach((track) => {
    track.addEventListener("ended", () => {
      if (
        state.screen === "music"
        && state.musicPreviewPlaying
        && state.musicRandomMode
        && state.soundEnabled
      ) {
        void playRandomMusicPreview();
      }
    });
  });

  titleButton.addEventListener("click", () => {
    openIntro();
  });

  retryButton.addEventListener("click", () => {
    void startMode(state.modeKey);
  });

  selectButton.addEventListener("click", () => {
    openSelect(state.modeKey);
  });

  homeButton.addEventListener("click", () => {
    openIntro();
  });

  soundButton.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    saveSettings();
    syncUi();

    if (state.soundEnabled) {
      const trackType = state.screen === "result"
        ? (state.resultOutcome === "clear" ? "clear" : "failed")
        : "main";
      if (state.screen === "music" && state.musicPreviewPlaying) {
        void playMusicPreview(state.musicTrackKey);
      } else if (state.running || state.screen === "result") {
        void syncStageBgm(false, trackType, state.modeKey);
      }
      playSfx("stage");
    } else {
      stopBgmTracks(false);
    }
  });

  window.addEventListener("pointermove", (event) => {
    if (!state.running) {
      return;
    }

    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      handlePointer(event.clientX, event.clientY);
    }
  });

  window.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") {
      return;
    }

    if (!shouldHandleScreenTouch(event.target)) {
      return;
    }

    handlePointer(event.clientX, event.clientY);
  });

  window.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    if (!touch || !shouldHandleScreenTouch(event.target)) {
      return;
    }

    handlePointer(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (event) => {
    if (!state.running) {
      return;
    }

    const touch = event.touches[0];
    if (touch) {
      handlePointer(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (state.screen === "intro" && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openSelect("sky");
      return;
    }

    if (state.screen === "music" && event.key === "Escape") {
      stopMusicPreview(false);
      openIntro();
      return;
    }

    if (state.screen === "select" && event.key === "Escape") {
      openIntro();
      return;
    }

    if (state.screen === "result" && event.key === "Enter") {
      event.preventDefault();
      void startMode(state.modeKey);
      return;
    }

    keyboard.add(event.key.toLowerCase());
  });

  window.addEventListener("keyup", (event) => {
    keyboard.delete(event.key.toLowerCase());
  });

  window.addEventListener("resize", () => {
    state.deviceMode = detectDeviceMode();
    syncUi();

    if (!initialized) {
      return;
    }

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    pinSkyMountainsToViewportFloor();
  });

  openIntro();
  void ensureScene();
})();
