const STORAGE_STATE_KEY = "tanmu_editor_state_v2";
const STORAGE_STYLES_KEY = "tanmu_editor_saved_styles_v2";
const usageStats = require("../../utils/usage-stats");

const COLORS = {
  lime: "#d4ff25",
  cyan: "#54d2ff",
  violet: "#b65dff",
  pink: "#f05db0",
  cream: "#f2eedf",
  amber: "#ffb84d"
};

const COLOR_LABELS = {
  lime: "应援绿",
  cyan: "冷光蓝",
  violet: "霓虹紫",
  pink: "热场粉",
  cream: "柔和米",
  amber: "舞台橙"
};

const FONTS = {
  standard: {
    label: "标准黑体",
    family: '"PingFang SC","Microsoft YaHei",sans-serif',
    weight: 700,
    spacing: "0.04em"
  },
  rounded: {
    label: "圆角海报",
    family: '"Arial Rounded MT Bold","Hiragino Sans GB","PingFang SC",sans-serif',
    weight: 700,
    spacing: "0.03em"
  },
  song: {
    label: "经典宋体",
    family: '"STSong","Songti SC","Noto Serif SC",serif',
    weight: 700,
    spacing: "0.02em"
  },
  mono: {
    label: "科技等宽",
    family: '"SFMono-Regular","Roboto Mono","Menlo",monospace',
    weight: 700,
    spacing: "0.08em"
  }
};

const SCENES = {
  concert: {
    label: "演唱会专业",
    description: "远距离可读，高亮应援，适合看台与内场手持灯牌场景。",
    text: "把喜欢送上舞台中央",
    size: 102,
    speed: 10,
    color: "lime",
    font: "standard",
    theme: "concert"
  },
  bar: {
    label: "酒吧专业",
    description: "霓虹层次更强，适合低照环境与近距离氛围互动。",
    text: "今晚整场情绪都要被点亮",
    size: 88,
    speed: 8,
    color: "violet",
    font: "rounded",
    theme: "bar"
  },
  esports: {
    label: "电竞现场",
    description: "冷调高对比，适合赛事观战、应援打 call 与队伍口号展示。",
    text: "让全场看到我们的支持",
    size: 94,
    speed: 7,
    color: "cyan",
    font: "mono",
    theme: "esports"
  },
  confession: {
    label: "告白灯牌",
    description: "柔光更克制，适合表白、纪念与需要情绪感的近景表达。",
    text: "今天也想认真喜欢你",
    size: 86,
    speed: 14,
    color: "pink",
    font: "song",
    theme: "confession"
  },
  festival: {
    label: "音乐节舞台",
    description: "暖色和强节奏更适合户外夜场、露出频繁的节庆环境。",
    text: "这一句应援要冲到最前排",
    size: 96,
    speed: 9,
    color: "amber",
    font: "rounded",
    theme: "festival"
  }
};

const THEMES = {
  concert: {
    pageBackground: "background:radial-gradient(circle at 18% 0%, rgba(183,255,43,0.22), transparent 24%), radial-gradient(circle at 82% 18%, rgba(0,213,255,0.14), transparent 22%), radial-gradient(circle at 54% 82%, rgba(255,255,255,0.08), transparent 24%), linear-gradient(180deg,#15161b,#0c0d11);",
    previewBackground: "background:radial-gradient(circle at 50% 20%, rgba(215,255,31,0.16), transparent 24%), radial-gradient(circle at 24% 74%, rgba(0,213,255,0.12), transparent 28%), linear-gradient(180deg,#101116,#05060a);",
    fullscreenBackground: "background:radial-gradient(circle at 50% 18%, rgba(215,255,31,0.18), transparent 24%), radial-gradient(circle at 24% 74%, rgba(0,213,255,0.12), transparent 30%), linear-gradient(180deg,#0d0f12,#040509);",
    accentCopy: "#dcff6b",
    ambientColor: "rgba(212,255,37,0.28)"
  },
  bar: {
    pageBackground: "background:radial-gradient(circle at 16% 8%, rgba(240,93,176,0.18), transparent 24%), radial-gradient(circle at 84% 16%, rgba(84,210,255,0.16), transparent 22%), radial-gradient(circle at 56% 84%, rgba(182,93,255,0.16), transparent 24%), linear-gradient(180deg,#16111b,#09080c);",
    previewBackground: "background:radial-gradient(circle at 58% 18%, rgba(182,93,255,0.18), transparent 24%), radial-gradient(circle at 22% 74%, rgba(240,93,176,0.12), transparent 28%), linear-gradient(180deg,#120d17,#05050a);",
    fullscreenBackground: "background:radial-gradient(circle at 58% 18%, rgba(182,93,255,0.22), transparent 24%), radial-gradient(circle at 22% 74%, rgba(240,93,176,0.14), transparent 30%), linear-gradient(180deg,#120d17,#05050a);",
    accentCopy: "#f7b0db",
    ambientColor: "rgba(240,93,176,0.26)"
  },
  esports: {
    pageBackground: "background:radial-gradient(circle at 18% 2%, rgba(84,210,255,0.18), transparent 24%), radial-gradient(circle at 84% 12%, rgba(182,93,255,0.12), transparent 22%), radial-gradient(circle at 56% 84%, rgba(84,210,255,0.08), transparent 24%), linear-gradient(180deg,#11151b,#090b10);",
    previewBackground: "background:radial-gradient(circle at 50% 20%, rgba(84,210,255,0.16), transparent 24%), radial-gradient(circle at 24% 74%, rgba(182,93,255,0.09), transparent 28%), linear-gradient(180deg,#091119,#03060a);",
    fullscreenBackground: "background:radial-gradient(circle at 50% 20%, rgba(84,210,255,0.18), transparent 24%), radial-gradient(circle at 24% 74%, rgba(182,93,255,0.12), transparent 30%), linear-gradient(180deg,#091119,#03060a);",
    accentCopy: "#7fe5ff",
    ambientColor: "rgba(84,210,255,0.24)"
  },
  confession: {
    pageBackground: "background:radial-gradient(circle at 18% 4%, rgba(242,238,223,0.16), transparent 24%), radial-gradient(circle at 82% 18%, rgba(240,93,176,0.12), transparent 22%), radial-gradient(circle at 56% 84%, rgba(255,255,255,0.08), transparent 24%), linear-gradient(180deg,#19161a,#0d0b10);",
    previewBackground: "background:radial-gradient(circle at 50% 20%, rgba(242,238,223,0.18), transparent 24%), radial-gradient(circle at 24% 74%, rgba(240,93,176,0.10), transparent 28%), linear-gradient(180deg,#141115,#06070a);",
    fullscreenBackground: "background:radial-gradient(circle at 50% 20%, rgba(242,238,223,0.22), transparent 24%), radial-gradient(circle at 24% 74%, rgba(240,93,176,0.12), transparent 30%), linear-gradient(180deg,#141115,#06070a);",
    accentCopy: "#f5eede",
    ambientColor: "rgba(242,238,223,0.24)"
  },
  festival: {
    pageBackground: "background:radial-gradient(circle at 18% 4%, rgba(255,184,77,0.18), transparent 24%), radial-gradient(circle at 84% 16%, rgba(240,93,176,0.12), transparent 22%), radial-gradient(circle at 56% 84%, rgba(255,255,255,0.08), transparent 24%), linear-gradient(180deg,#1a1511,#0c0a08);",
    previewBackground: "background:radial-gradient(circle at 50% 20%, rgba(255,184,77,0.18), transparent 24%), radial-gradient(circle at 24% 74%, rgba(240,93,176,0.10), transparent 28%), linear-gradient(180deg,#17110b,#080604);",
    fullscreenBackground: "background:radial-gradient(circle at 50% 20%, rgba(255,184,77,0.22), transparent 24%), radial-gradient(circle at 24% 74%, rgba(240,93,176,0.12), transparent 30%), linear-gradient(180deg,#17110b,#080604);",
    accentCopy: "#ffcb84",
    ambientColor: "rgba(255,184,77,0.26)"
  }
};

const DEFAULT_SCENE_KEY = "concert";

const SAMPLE_POOL = [
  "把喜欢送上舞台中央",
  "今晚整场情绪都要被点亮",
  "让全场看到我们的支持",
  "今天也想认真喜欢你",
  "这一句应援要冲到最前排"
];

const PRESET_LIST = [
  { key: "cheer", label: "应援模式", scene: "concert" },
  { key: "cyber", label: "赛博模式", scene: "esports" },
  { key: "confess", label: "告白模式", scene: "confession" },
  { key: "calm", label: "静夜模式", scene: "bar" }
];

const STORAGE_FIRST_FULLSCREEN_KEY = "tanmu_editor_first_fullscreen_v1";

const SCENE_BADGE_COPY = {
  concert: "LIVE 预览",
  bar: "夜场预览",
  esports: "赛博预览",
  confession: "告白预览",
  festival: "节庆预览"
};

const SAVE_DELIGHT_TOASTS = [
  "灯牌已存档，下一场接着用",
  "样式收好了，随时再度上场",
  "这套氛围已记下"
];

const LOOP_START_TOASTS = [
  "弹幕开始冲场",
  "竖屏轮播，全场可见",
  "霸屏节奏已开启"
];

function pickRandom(list) {
  if (!Array.isArray(list) || !list.length) return "";
  return list[Math.floor(Math.random() * list.length)];
}

function getColorDelightToast(colorKey) {
  const label = COLOR_LABELS[colorKey] || "配色";
  return `${label}已上身`;
}

const FULLSCREEN_BRIGHTNESS = 1;
const FULLSCREEN_CONTROLS_HIDE_MS = 3200;
const FULLSCREEN_PAGE_STYLE = "overflow:hidden;background-color:#05070b;";
const CUSTOM_SLIDER_THUMB_RPX = 44;
const FULLSCREEN_ZOOM_MIN = 0.55;
const FULLSCREEN_ZOOM_MAX = 2.2;
const CUSTOM_SLIDER_CONFIG = {
  size: { min: 52, max: 148, step: 1, field: "size" },
  speed: { min: 6, max: 24, step: 1, field: "speed" }
};

const SLIDER_TRACK_GRADIENT = {
  start: [212, 231, 59],
  end: [0, 151, 167]
};

function mixSliderGlowColor(ratio) {
  const t = clamp(Number(ratio) || 0, 0, 1);
  const [sr, sg, sb] = SLIDER_TRACK_GRADIENT.start;
  const [er, eg, eb] = SLIDER_TRACK_GRADIENT.end;

  return {
    r: Math.round(sr + (er - sr) * t),
    g: Math.round(sg + (eg - sg) * t),
    b: Math.round(sb + (eb - sb) * t)
  };
}

function buildSliderThumbStyle(x, meta, windowWidth) {
  const ratio = meta && meta.usableWidth ? clamp(x / meta.usableWidth, 0, 1) : 0;
  const { r, g, b } = mixSliderGlowColor(ratio);
  const leftRpx = pxToRpx(x, windowWidth || 375).toFixed(2);

  return [
    `left:${leftRpx}rpx`,
    `box-shadow:0 0 0 4rpx rgba(255,255,255,0.05),0 0 20rpx rgba(${r},${g},${b},0.78),0 0 36rpx rgba(${r},${g},${b},0.42)`
  ].join(";");
}

function buildAmbientText(text) {
  return `${text}\n${text}\n${text}`;
}

function buildVerticalGlyphs(text) {
  return String(text).split("").filter(Boolean);
}

function pxToRpx(pxValue, windowWidth) {
  const width = Math.max(Number(windowWidth) || 375, 320);
  return (Number(pxValue) * 750) / width;
}

function rpxToPx(rpxValue, windowWidth) {
  const width = Math.max(Number(windowWidth) || 375, 320);
  return (Number(rpxValue) * width) / 750;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function computeFullscreenFontSize(text, windowHeight, windowWidth) {
  const glyphCount = Math.max(String(text).length, 1);
  const safeHeight = Math.max(Number(windowHeight) || 720, 560) - 180;
  const safeHeightRpx = pxToRpx(safeHeight, windowWidth);
  const targetHeight = safeHeight * 0.84;
  const targetHeightRpx = safeHeightRpx * 0.84;
  const heightUnits = glyphCount * 0.9 + Math.max(glyphCount - 1, 0) * 0.2;
  const size = targetHeightRpx / heightUnits;

  return Math.max(88, Math.min(460, Math.floor(size)));
}

function computeFullscreenLoopMetrics(glyphCount, fontRpx, windowHeight, windowWidth) {
  const count = Math.max(Number(glyphCount) || 1, 1);
  const font = Math.max(Number(fontRpx) || 120, 88);
  const viewportRpx = pxToRpx(Math.max(Number(windowHeight) || 720, 560), windowWidth);
  const unitHeightRpx = count * font * 1.22;
  const columnRatio = unitHeightRpx / Math.max(viewportRpx, 1);
  const loopGapRpx = Math.round(Math.max(font * 0.28, 12));
  const loopSpacerRpx = Math.round(
    Math.max(viewportRpx * (0.14 + columnRatio * 0.1), font * 0.55, unitHeightRpx * 0.12)
  );

  return {
    loopGapRpx,
    loopSpacerRpx,
    columnRatio
  };
}

function inferScene(text, size, speed, color, font) {
  const matched = Object.entries(SCENES).find(([, scene]) => (
    scene.text === text &&
    scene.size === size &&
    scene.speed === speed &&
    scene.color === color &&
    scene.font === font
  ));

  return matched ? matched[0] : "";
}

function sanitizeEditorState(raw) {
  if (!raw || typeof raw !== "object") return null;

  const scene = SCENES[raw.scene] ? raw.scene : DEFAULT_SCENE_KEY;
  const baseScene = SCENES[scene];
  const font = FONTS[raw.font] ? raw.font : baseScene.font;
  const color = COLORS[raw.color] ? raw.color : baseScene.color;
  const theme = THEMES[raw.theme] ? raw.theme : baseScene.theme;
  const text = typeof raw.text === "string" && raw.text.trim()
    ? raw.text.trim().slice(0, 20)
    : baseScene.text;
  const size = Number.isFinite(Number(raw.size))
    ? Math.max(52, Math.min(148, Number(raw.size)))
    : baseScene.size;
  const speed = Number.isFinite(Number(raw.speed))
    ? Math.max(6, Math.min(24, Number(raw.speed)))
    : baseScene.speed;

  return {
    text,
    size,
    speed,
    color,
    font,
    theme,
    scene,
    isFullscreen: false,
    isFullscreenLooping: false,
    isFullscreenEntering: false,
    previewPulsing: false,
    isKeepScreenOn: Boolean(raw.isKeepScreenOn),
    fullscreenZoom: 1
  };
}

function sanitizeSavedStyles(rawList) {
  if (!Array.isArray(rawList)) return [];

  return rawList
    .map((item, index) => {
      const state = sanitizeEditorState(item);
      if (!state) return null;

      const fallbackName = `${SCENES[state.scene].label} · ${state.text.slice(0, 8)}`;

      return {
        ...state,
        id: typeof item.id === "string" && item.id ? item.id : `saved-${index}-${state.text.slice(0, 4)}`,
        name: typeof item.name === "string" && item.name.trim() ? item.name.trim() : fallbackName
      };
    })
    .filter(Boolean)
    .slice(0, 6);
}

function buildTrackStyles(nextState) {
  const colorValue = COLORS[nextState.color];
  const font = FONTS[nextState.font];
  const theme = THEMES[nextState.theme];
  const speed = Number(nextState.speed);
  const heroGlow = nextState.color === "cream"
    ? "rgba(242,238,223,0.62)"
    : nextState.color === "amber"
      ? "rgba(255,184,77,0.58)"
      : `${colorValue}bb`;

  return {
    pageStyle: theme.pageBackground,
    accentCopyStyle: `color:${theme.accentCopy}`,
    previewCardStyle: theme.previewBackground,
    fullscreenShellStyle: theme.fullscreenBackground,
    ambientTrackText: buildAmbientText(nextState.text),
    heroTrackStyle: [
      `font-size:${nextState.size}rpx`,
      `color:${colorValue}`,
      `font-family:${font.family}`,
      `font-weight:${font.weight}`,
      `letter-spacing:${font.spacing}`,
      `text-shadow:0 0 24rpx ${heroGlow},0 0 58rpx ${heroGlow},0 2rpx 0 rgba(0,0,0,0.35)`,
      `animation-duration:${nextState.speed}s`,
      `animation-delay:${(-nextState.speed * 0.32).toFixed(2)}s`
    ].join(";"),
    fullHeroTrackStyle: [
      `font-size:${Math.max(nextState.size + 26, 118)}rpx`,
      `color:${colorValue}`,
      `font-family:${font.family}`,
      `font-weight:${font.weight}`,
      `letter-spacing:${font.spacing}`,
      `text-shadow:0 0 18rpx ${heroGlow},0 0 40rpx ${heroGlow}`,
      `animation-duration:${speed}s`,
      `animation-delay:${(-speed * 0.32).toFixed(2)}s`
    ].join(";"),
    fullHeroTrackStyleAlt: [
      `font-size:${Math.max(nextState.size + 26, 118)}rpx`,
      `color:${colorValue}`,
      `font-family:${font.family}`,
      `font-weight:${font.weight}`,
      `letter-spacing:${font.spacing}`,
      `text-shadow:0 0 18rpx ${heroGlow},0 0 40rpx ${heroGlow}`,
      `animation-duration:${speed}s`,
      `animation-delay:${(-speed * 0.82).toFixed(2)}s`
    ].join(";"),
    ambientLeftStyle: [
      `color:${theme.ambientColor}`,
      `font-family:${font.family}`,
      `animation-duration:${(nextState.speed * 1.45).toFixed(2)}s`,
      `animation-delay:${(-nextState.speed * 0.58).toFixed(2)}s`
    ].join(";"),
    ambientRightStyle: [
      `color:${theme.ambientColor}`,
      `font-family:${font.family}`,
      `animation-duration:${(nextState.speed * 1.72).toFixed(2)}s`,
      `animation-delay:${(-nextState.speed * 0.86).toFixed(2)}s`
    ].join(";")
  };
}

function buildSavedStyleCards(savedStyles) {
  return savedStyles.map((item) => ({
    id: item.id,
    name: item.name,
    sceneLabel: SCENES[item.scene].label,
    fontLabel: FONTS[item.font].label,
    colorValue: COLORS[item.color],
    text: item.text
  }));
}

function getLayoutMetrics() {
  const windowInfo = typeof wx.getWindowInfo === "function"
    ? wx.getWindowInfo()
    : wx.getSystemInfoSync();
  const menuButton = wx.getMenuButtonBoundingClientRect();
  const windowWidth = windowInfo.windowWidth || 375;
  const statusBarHeight = windowInfo.statusBarHeight || 20;
  const capsuleGap = Math.max(windowInfo.windowWidth - menuButton.left + 10, 16);
  const navBarHeight = (menuButton.top - statusBarHeight) * 2 + menuButton.height;

  return {
    windowHeight: windowInfo.windowHeight || 720,
    windowWidth,
    navLayoutStyle: [
      `padding-top:${pxToRpx(statusBarHeight, windowWidth).toFixed(2)}rpx`,
      `padding-right:${pxToRpx(capsuleGap, windowWidth).toFixed(2)}rpx`,
      `padding-left:24rpx`
    ].join(";"),
    topbarStyle: `min-height:${pxToRpx(navBarHeight, windowWidth).toFixed(2)}rpx`
  };
}

function buildViewData(nextState) {
  const colorValue = COLORS[nextState.color];
  const font = FONTS[nextState.font];
  const fullScreenFontRpx = computeFullscreenFontSize(nextState.text, nextState.windowHeight, nextState.windowWidth);
  const fullscreenZoom = clamp(Number(nextState.fullscreenZoom) || 1, FULLSCREEN_ZOOM_MIN, FULLSCREEN_ZOOM_MAX);
  const scaledFullscreenFontRpx = Math.floor(fullScreenFontRpx * fullscreenZoom);
  const speed = Number(nextState.speed);
  const loopMetrics = computeFullscreenLoopMetrics(
    nextState.text.length,
    scaledFullscreenFontRpx,
    nextState.windowHeight,
    nextState.windowWidth
  );

  return {
    ...nextState,
    fullGlyphs: buildVerticalGlyphs(nextState.text),
    fullscreenLoopGapRpx: loopMetrics.loopGapRpx,
    fullscreenLoopSpacerRpx: loopMetrics.loopSpacerRpx,
    fullTextWrapStyle: [
      `left:50%`,
      `top:50%`,
      `transform:translate(-50%,-50%)`,
      `font-size:${scaledFullscreenFontRpx}rpx`,
      `color:${colorValue}`,
      `font-family:${font.family}`,
      `font-weight:${font.weight}`
    ].join(";"),
    fullLoopTrackStyle: [
      `font-size:${scaledFullscreenFontRpx}rpx`,
      `animation-duration:${speed}s`,
      `color:${colorValue}`,
      `font-family:${font.family}`,
      `font-weight:${font.weight}`
    ].join(";"),
    fullGlyphStyle: [
      `font-size:${scaledFullscreenFontRpx}rpx`,
      `line-height:1`,
      `text-shadow:0 0 24rpx ${colorValue}cc,0 0 58rpx ${colorValue}99,0 0 96rpx ${colorValue}44`
    ].join(";"),
    textLength: nextState.text.length,
    fullscreenLoopLabel: nextState.isFullscreenLooping ? "停止轮播" : "开启轮播",
    previewBadgeCopy: SCENE_BADGE_COPY[nextState.scene] || "舞台预览",
    fontLabel: FONTS[nextState.font].label,
    colorLabel: COLOR_LABELS[nextState.color],
    sceneLabel: SCENES[nextState.scene].label,
    sceneDescription: SCENES[nextState.scene].description,
    keepScreenLabel: nextState.isKeepScreenOn ? "常亮已开" : "常亮关闭",
    fontList: Object.entries(FONTS).map(([key, font]) => ({
      key,
      label: font.label
    })),
    sceneList: Object.entries(SCENES).map(([key, scene]) => ({
      key,
      label: scene.label
    })),
    presetList: PRESET_LIST.map((item) => ({
      key: item.key,
      label: item.label,
      scene: item.scene
    })),
    palette: Object.entries(COLORS).map(([key, value]) => ({
      key,
      value
    })),
    savedStyleCards: buildSavedStyleCards(nextState.savedStyles),
    ...buildTrackStyles(nextState)
  };
}

function createSavedStyleFromState(state) {
  return {
    ...sanitizeEditorState(state),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: `${SCENES[state.scene].label} · ${state.text.slice(0, 8)}`
  };
}

Page({
  data: {
    ...buildViewData({
      ...sanitizeEditorState(SCENES[DEFAULT_SCENE_KEY]),
      savedStyles: []
    }),
    sizeSliderThumbStyle: "left:0rpx;",
    speedSliderThumbStyle: "left:0rpx;",
    showPinchGuide: false,
    pinchGuideVisible: false,
    usageText: "",
    usageLoading: true,
    usageReady: false,
    usageError: false,
    usagePulse: false,
    fullscreenControlsVisible: false,
    fullscreenPageStyle: "",
    ...getLayoutMetrics()
  },

  onLoad() {
    const storedState = sanitizeEditorState(wx.getStorageSync(STORAGE_STATE_KEY));
    const savedStyles = sanitizeSavedStyles(wx.getStorageSync(STORAGE_STYLES_KEY));

    const next = {
      ...(storedState || sanitizeEditorState(SCENES[DEFAULT_SCENE_KEY])),
      savedStyles
    };

    this.setData({
      ...buildViewData(next),
      ...getLayoutMetrics()
    }, () => {
      this.initCustomSliderMetrics();
    });

    if (next.isKeepScreenOn) {
      wx.setKeepScreenOn({ keepScreenOn: true });
    }

    this.bootstrapUsageBanner();
    this.startUsageRealtime();
  },

  onShow() {
    if (this.data.isFullscreen) {
      this.scheduleHideCapsuleChrome();
    }

    this.startUsageRealtime();

    if (this._usageShowTimer) {
      clearTimeout(this._usageShowTimer);
    }

    this._usageShowTimer = setTimeout(() => {
      this._usageShowTimer = null;
      this.reportUsage();
    }, 200);
  },

  onReady() {
    this.initCustomSliderMetrics();
  },

  onResize() {
    this.initCustomSliderMetrics();
  },

  onHide() {
    usageStats.stopUsageWatch();
    this.flushPersist();
    if (this.data.isFullscreen) {
      this.restoreScreenBrightness();
    }
  },

  onUnload() {
    usageStats.stopUsageWatch();

    if (this._usageShowTimer) {
      clearTimeout(this._usageShowTimer);
      this._usageShowTimer = null;
    }

    if (this._usagePulseTimer) {
      clearTimeout(this._usagePulseTimer);
      this._usagePulseTimer = null;
    }

    this.clearFullscreenControlsTimer();
    this.clearHideCapsuleTimers();

    if (this._fullscreenEnterTimer) {
      clearTimeout(this._fullscreenEnterTimer);
      this._fullscreenEnterTimer = null;
    }

    this.clearPinchGuideTimers();

    if (this._previewPulseTimer) {
      clearTimeout(this._previewPulseTimer);
      this._previewPulseTimer = null;
    }

    this.flushPersist();
    this.restoreScreenBrightness();
    if (this.data.isKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: false
      });
    }
  },

  onShareAppMessage() {
    return {
      title: `${this.data.sceneLabel} · ${this.data.text}`,
      path: "/pages/tanmu-editor/index"
    };
  },

  bootstrapUsageBanner() {
    const cachedCount = usageStats.readCachedCount();
    const cachedText = usageStats.formatUsageCount(cachedCount);

    if (cachedText) {
      this.setData({
        usageText: cachedText,
        usageLoading: true,
        usageReady: false,
        usageError: false
      });
    }
  },

  startUsageRealtime() {
    usageStats.startUsageWatch((count, text) => {
      if (!text || text === this.data.usageText) return;

      this.setData({
        usageText: text,
        usagePulse: true,
        usageLoading: false,
        usageReady: true,
        usageError: false
      });

      if (this._usagePulseTimer) {
        clearTimeout(this._usagePulseTimer);
      }

      this._usagePulseTimer = setTimeout(() => {
        this._usagePulseTimer = null;
        this.setData({ usagePulse: false });
      }, 520);
    });
  },

  applyUsageCount(count) {
    const text = usageStats.formatUsageCount(count);
    if (!text) return;

    this.setData({
      usageText: text,
      usageLoading: false,
      usageReady: true,
      usageError: false,
      usagePulse: false
    });
  },

  applyUsageFailure(error) {
    const cachedCount = usageStats.readCachedCount();
    const cachedText = usageStats.formatUsageCount(cachedCount);
    console.error("[usageCounter] 上报使用次数失败", error);

    if (cachedText) {
      this.setData({
        usageText: cachedText,
        usageLoading: false,
        usageReady: true,
        usageError: false
      });
      return;
    }

    this.setData({
      usageText: "",
      usageLoading: false,
      usageReady: false,
      usageError: true
    });
  },

  handleUsageBannerTap() {
    if (this.data.usageError || this.data.usageLoading || !this.data.usageText) {
      this.reportUsage({ force: true });
    }
  },

  reportUsage(options = {}) {
    if (this._usageReporting && !options.force) return;

    this._usageReporting = true;
    this.setData({
      usageLoading: true,
      usageError: false
    });

    usageStats
      .hitUsage()
      .then((count) => {
        this.applyUsageCount(count);
      })
      .catch((error) => {
        this.applyUsageFailure(error);
      })
      .finally(() => {
        this._usageReporting = false;
      });
  },

  persistState() {
    const payload = {
      text: this.data.text,
      size: this.data.size,
      speed: this.data.speed,
      color: this.data.color,
      font: this.data.font,
      theme: this.data.theme,
      scene: this.data.scene,
      isKeepScreenOn: this.data.isKeepScreenOn
    };

    try {
      wx.setStorageSync(STORAGE_STATE_KEY, payload);
      wx.setStorageSync(STORAGE_STYLES_KEY, this.data.savedStyles || []);
    } catch (error) {
      wx.showToast({
        title: "本地保存失败，请清理缓存后重试",
        icon: "none"
      });
    }
  },

  schedulePersist() {
    if (this._persistTimer) {
      clearTimeout(this._persistTimer);
    }

    this._persistTimer = setTimeout(() => {
      this._persistTimer = null;
      this.persistState();
    }, 400);
  },

  flushPersist() {
    if (this._persistTimer) {
      clearTimeout(this._persistTimer);
      this._persistTimer = null;
    }

    this.persistState();
  },

  setEditorState(partial, toastMessage, options = {}) {
    const next = {
      text: this.data.text,
      size: this.data.size,
      speed: this.data.speed,
      color: this.data.color,
      font: this.data.font,
      theme: this.data.theme,
      scene: this.data.scene,
      isFullscreen: this.data.isFullscreen,
      isFullscreenLooping: this.data.isFullscreenLooping,
      isFullscreenEntering: this.data.isFullscreenEntering,
      previewPulsing: this.data.previewPulsing,
      isKeepScreenOn: this.data.isKeepScreenOn,
      fullscreenZoom: this.data.fullscreenZoom,
      windowHeight: this.data.windowHeight,
      windowWidth: this.data.windowWidth,
      savedStyles: this.data.savedStyles || [],
      ...partial
    };

    if (!("scene" in partial)) {
      next.scene = inferScene(next.text, next.size, next.speed, next.color, next.font) || next.scene;
    }

    const shouldPulsePreview = Boolean(
      options.previewPulse ||
      "text" in partial ||
      "color" in partial ||
      "scene" in partial ||
      "size" in partial ||
      "theme" in partial
    );

    this.setData(buildViewData(next), () => {
      if (options.syncSliders !== false) {
        this.syncCustomSliderThumbs();
      }
      if (options.persist !== false) {
        this.schedulePersist();
      }
      if (shouldPulsePreview) {
        this.triggerPreviewPulse();
      }
    });

    if (toastMessage) {
      wx.showToast({
        title: toastMessage,
        icon: "none",
        duration: 1400
      });
    }
  },

  triggerPreviewPulse() {
    if (this._previewPulseTimer) {
      clearTimeout(this._previewPulseTimer);
    }

    this.setData({ previewPulsing: true });
    this._previewPulseTimer = setTimeout(() => {
      this._previewPulseTimer = null;
      this.setData({ previewPulsing: false });
    }, 480);
  },

  initCustomSliderMetrics() {
    wx.nextTick(() => {
      const query = wx.createSelectorQuery().in(this);
      query.select(".size-slider-track").boundingClientRect();
      query.select(".speed-slider-track").boundingClientRect();
      query.exec((res) => {
        if (!Array.isArray(res) || !res[0] || !res[1]) return;

        this._sliderMeta = {
          size: {
            left: res[0].left,
            width: res[0].width,
            usableWidth: Math.max(res[0].width, 1)
          },
          speed: {
            left: res[1].left,
            width: res[1].width,
            usableWidth: Math.max(res[1].width, 1)
          }
        };

        this.syncCustomSliderThumbs();
      });
    });
  },

  valueToSliderX(type, value) {
    const config = CUSTOM_SLIDER_CONFIG[type];
    const meta = this._sliderMeta?.[type];
    if (!config || !meta) return 0;

    const ratio = (value - config.min) / (config.max - config.min);
    return clamp(Math.round(meta.usableWidth * ratio), 0, meta.usableWidth);
  },

  sliderXToValue(type, x) {
    const config = CUSTOM_SLIDER_CONFIG[type];
    const meta = this._sliderMeta?.[type];
    if (!config || !meta) return this.data[config?.field] || 0;

    const ratio = clamp(x / meta.usableWidth, 0, 1);
    const raw = config.min + ratio * (config.max - config.min);
    const stepped = Math.round(raw / config.step) * config.step;
    return clamp(stepped, config.min, config.max);
  },

  syncCustomSliderThumbs() {
    if (!this._sliderMeta) return;

    const windowWidth = this.data.windowWidth || 375;
    const sizeX = this.valueToSliderX("size", Number(this.data.size));
    const speedX = this.valueToSliderX("speed", Number(this.data.speed));

    this.setData({
      sizeSliderThumbStyle: buildSliderThumbStyle(sizeX, this._sliderMeta.size, windowWidth),
      speedSliderThumbStyle: buildSliderThumbStyle(speedX, this._sliderMeta.speed, windowWidth)
    });
  },

  applySliderValue(type, value, persist) {
    const config = CUSTOM_SLIDER_CONFIG[type];
    if (!config) return;

    this.setEditorState({ [config.field]: value }, null, { persist });
  },

  handleSliderTap(event) {
    const type = event.currentTarget.dataset.type;
    const meta = this._sliderMeta?.[type];
    if (!meta) return;

    const tapX = typeof event.detail.x === "number" ? event.detail.x : meta.left;
    const nextX = clamp(tapX - meta.left, 0, meta.usableWidth);
    const nextValue = this.sliderXToValue(type, nextX);
    this.applySliderValue(type, nextValue, true);
  },

  handleSliderTouchStart(event) {
    const type = event.currentTarget.dataset.type;
    const touch = event.touches && event.touches[0];
    const meta = this._sliderMeta?.[type];
    if (!touch || !meta) return;
    this._activeSliderType = type;

    const nextX = clamp(touch.clientX - meta.left, 0, meta.usableWidth);
    const nextValue = this.sliderXToValue(type, nextX);
    this.applySliderValue(type, nextValue, false);
  },

  handleSliderTouchMove(event) {
    const type = event.currentTarget.dataset.type || this._activeSliderType;
    const touch = event.touches && event.touches[0];
    const meta = this._sliderMeta?.[type];
    if (!touch || !meta) return;

    const nextX = clamp(touch.clientX - meta.left, 0, meta.usableWidth);
    const nextValue = this.sliderXToValue(type, nextX);
    this.applySliderValue(type, nextValue, false);
  },

  handleSliderTouchEnd(event) {
    const type = event.currentTarget.dataset.type || this._activeSliderType;
    const config = CUSTOM_SLIDER_CONFIG[type];
    if (!config) return;
    this._activeSliderType = null;
    this.applySliderValue(type, Number(this.data[config.field]), true);
  },

  getPinchDistance(touches) {
    if (!touches || touches.length < 2) return 0;
    const [first, second] = touches;
    const dx = Number(second.clientX) - Number(first.clientX);
    const dy = Number(second.clientY) - Number(first.clientY);
    return Math.hypot(dx, dy);
  },

  handleFullscreenTouchStart(event) {
    if (!this.data.isFullscreen || !event.touches) return;

    if (this.data.showPinchGuide) {
      this.dismissPinchGuide();
    }

    if (event.touches.length < 2) return;

    this._pinchStartDistance = this.getPinchDistance(event.touches);
    this._pinchStartZoom = Number(this.data.fullscreenZoom) || 1;
  },

  handleFullscreenTouchMove(event) {
    if (!this.data.isFullscreen || !event.touches || event.touches.length < 2) return;
    if (!this._pinchStartDistance) return;

    const currentDistance = this.getPinchDistance(event.touches);
    if (!currentDistance) return;

    const ratio = currentDistance / this._pinchStartDistance;
    const nextZoom = clamp(this._pinchStartZoom * ratio, FULLSCREEN_ZOOM_MIN, FULLSCREEN_ZOOM_MAX);

    if (Math.abs(nextZoom - (Number(this.data.fullscreenZoom) || 1)) < 0.01) return;

    this.setEditorState(
      { fullscreenZoom: Number(nextZoom.toFixed(3)) },
      null,
      { persist: false, syncSliders: false }
    );
  },

  handleFullscreenTouchEnd(event) {
    if (event.touches && event.touches.length >= 2) {
      this._pinchStartDistance = this.getPinchDistance(event.touches);
      this._pinchStartZoom = Number(this.data.fullscreenZoom) || 1;
      return;
    }

    this._pinchStartDistance = 0;
    this._pinchStartZoom = Number(this.data.fullscreenZoom) || 1;
    this.schedulePersist();
  },

  handleTextInput(event) {
    const value = (event.detail.value || "").trim() || SCENES[DEFAULT_SCENE_KEY].text;
    this.setEditorState({ text: value });
  },

  handleSizeChanging(event) {
    this.setEditorState({ size: Number(event.detail.value) }, null, { persist: false });
  },

  handleSizeChange(event) {
    this.setEditorState({ size: Number(event.detail.value) });
  },

  handleSpeedChanging(event) {
    this.setEditorState({ speed: Number(event.detail.value) }, null, { persist: false });
  },

  handleSpeedChange(event) {
    this.setEditorState({ speed: Number(event.detail.value) });
  },

  handleColorChange(event) {
    const color = event.currentTarget.dataset.color;
    this.setEditorState({ color }, getColorDelightToast(color));
  },

  handleFontChange(event) {
    const font = event.currentTarget.dataset.font;
    this.setEditorState({ font }, `已切换为${FONTS[font].label}`);
  },

  handleSceneChange(event) {
    const key = event.currentTarget.dataset.scene;
    const scene = SCENES[key];

    if (!scene) return;

    this.setEditorState({
      text: scene.text,
      size: scene.size,
      speed: scene.speed,
      color: scene.color,
      font: scene.font,
      theme: scene.theme,
      scene: key
    });
  },

  handleRandomText() {
    const text = SAMPLE_POOL[Math.floor(Math.random() * SAMPLE_POOL.length)];
    this.setEditorState({ text }, "已随机切换文案");
  },

  handleKeepScreenToggle() {
    const nextValue = !this.data.isKeepScreenOn;
    wx.setKeepScreenOn({
      keepScreenOn: nextValue,
      success: () => {
        this.setEditorState({ isKeepScreenOn: nextValue }, nextValue ? "已开启屏幕常亮" : "已关闭屏幕常亮");
      },
      fail: () => {
        wx.showToast({
          title: "常亮模式切换失败",
          icon: "none"
        });
      }
    });
  },

  handleSaveStyle() {
    const nextSavedStyles = [createSavedStyleFromState(this.data)]
      .concat((this.data.savedStyles || []).slice(0, 5));

    this.setEditorState({ savedStyles: nextSavedStyles }, pickRandom(SAVE_DELIGHT_TOASTS));
  },

  handleUseSavedStyle(event) {
    const index = Number(event.currentTarget.dataset.index);
    const target = (this.data.savedStyles || [])[index];

    if (!target) return;

    this.setEditorState({
      text: target.text,
      size: target.size,
      speed: target.speed,
      color: target.color,
      font: target.font,
      theme: target.theme,
      scene: target.scene
    }, `已载入${target.name}`);
  },

  handleDeleteSavedStyle(event) {
    const index = Number(event.currentTarget.dataset.index);
    const target = (this.data.savedStyles || [])[index];

    if (!target) return;

    wx.showModal({
      title: "删除样式",
      content: `确定删除「${target.name}」吗？`,
      confirmColor: "#d4ff25",
      success: (res) => {
        if (!res.confirm) return;

        const nextSavedStyles = (this.data.savedStyles || []).filter((_, current) => current !== index);
        this.setEditorState({ savedStyles: nextSavedStyles }, "已删除样式");
      }
    });
  },

  handleResetCurrent() {
    const base = sanitizeEditorState(SCENES[DEFAULT_SCENE_KEY]);
    this.setEditorState(base, "已恢复为默认场景");
  },

  handleOpenGuide() {
    wx.navigateTo({
      url: "/pages/guide/index"
    });
  },

  handleOpenPrivacy() {
    wx.navigateTo({
      url: "/pages/privacy/index"
    });
  },

  applyFullscreenBrightness() {
    if (typeof wx.getScreenBrightness !== "function" || typeof wx.setScreenBrightness !== "function") {
      return;
    }

    wx.getScreenBrightness({
      success: ({ value }) => {
        this._brightnessBackup = typeof value === "number" ? value : 0.8;
        this._hasBrightnessBackup = true;
        wx.setScreenBrightness({ value: FULLSCREEN_BRIGHTNESS });
      }
    });
  },

  restoreScreenBrightness() {
    if (!this._hasBrightnessBackup || typeof wx.setScreenBrightness !== "function") return;

    wx.setScreenBrightness({
      value: this._brightnessBackup,
      complete: () => {
        this._hasBrightnessBackup = false;
      }
    });
  },

  clearFullscreenControlsTimer() {
    if (this._fullscreenControlsTimer) {
      clearTimeout(this._fullscreenControlsTimer);
      this._fullscreenControlsTimer = null;
    }
  },

  showFullscreenControls(autoHide) {
    this.clearFullscreenControlsTimer();
    this.setData({ fullscreenControlsVisible: true });

    if (autoHide !== false) {
      this._fullscreenControlsTimer = setTimeout(() => {
        this._fullscreenControlsTimer = null;
        this.hideFullscreenControls();
      }, FULLSCREEN_CONTROLS_HIDE_MS);
    }
  },

  hideFullscreenControls() {
    this.clearFullscreenControlsTimer();
    if (!this.data.fullscreenControlsVisible) return;
    this.setData({ fullscreenControlsVisible: false });
  },

  handleFullscreenStageTap() {
    if (!this.data.isFullscreen || this.data.showPinchGuide) return;
    if (this._pinchStartDistance > 0) return;

    if (this.data.fullscreenControlsVisible) {
      this.hideFullscreenControls();
      return;
    }

    this.showFullscreenControls();
  },

  handleFullscreenBackdropTap() {
    if (!this.data.isFullscreen) return;

    if (this.data.showPinchGuide) {
      this.dismissPinchGuide();
      return;
    }

    this.handleFullscreenStageTap();
  },

  hideCapsuleChrome() {
    if (typeof wx.hideHomeButton === "function") {
      wx.hideHomeButton();
    }
  },

  scheduleHideCapsuleChrome() {
    this.hideCapsuleChrome();

    if (this._hideCapsuleTimers) {
      this._hideCapsuleTimers.forEach(clearTimeout);
    }

    this._hideCapsuleTimers = [120, 320, 680].map((delay) =>
      setTimeout(() => {
        if (this.data.isFullscreen) {
          this.hideCapsuleChrome();
        }
      }, delay)
    );
  },

  clearHideCapsuleTimers() {
    if (!this._hideCapsuleTimers) return;
    this._hideCapsuleTimers.forEach(clearTimeout);
    this._hideCapsuleTimers = null;
  },

  applyFullscreenChrome() {
    this.setData({
      fullscreenPageStyle: FULLSCREEN_PAGE_STYLE,
      fullscreenControlsVisible: false
    });

    if (typeof wx.setNavigationBarColor === "function") {
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#05070b",
        animation: {
          duration: 0,
          timingFunc: "easeIn"
        }
      });
    }

    this.scheduleHideCapsuleChrome();
  },

  restoreFullscreenChrome() {
    this.clearHideCapsuleTimers();
    this.hideFullscreenControls();
    this.setData({ fullscreenPageStyle: "" });

    if (typeof wx.showHomeButton === "function") {
      wx.showHomeButton();
    }

    if (typeof wx.setNavigationBarColor === "function") {
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#15161b",
        animation: {
          duration: 0,
          timingFunc: "easeIn"
        }
      });
    }
  },

  openFullscreen() {
    if (this._fullscreenEnterTimer) {
      clearTimeout(this._fullscreenEnterTimer);
      this._fullscreenEnterTimer = null;
    }

    this.setEditorState(
      {
        isFullscreen: true,
        isFullscreenLooping: false,
        isFullscreenEntering: true,
        fullscreenZoom: 1
      },
      null,
      { persist: false }
    );

    this.applyFullscreenChrome();

    this._fullscreenEnterTimer = setTimeout(() => {
      this._fullscreenEnterTimer = null;
      if (this.data.isFullscreen) {
        this.setData({ isFullscreenEntering: false });
      }
    }, 380);

    this.applyFullscreenBrightness();

    if (!this.data.isKeepScreenOn) {
      wx.setKeepScreenOn({ keepScreenOn: true });
    }

    if (!wx.getStorageSync(STORAGE_FIRST_FULLSCREEN_KEY)) {
      this.schedulePinchGuide();
    }
  },

  schedulePinchGuide() {
    if (this._pinchGuideShowTimer) {
      clearTimeout(this._pinchGuideShowTimer);
    }

    this._pinchGuideShowTimer = setTimeout(() => {
      this._pinchGuideShowTimer = null;
      if (!this.data.isFullscreen || wx.getStorageSync(STORAGE_FIRST_FULLSCREEN_KEY)) return;

      this.setData({ showPinchGuide: true, pinchGuideVisible: false }, () => {
        wx.nextTick(() => {
          if (this.data.showPinchGuide) {
            this.setData({ pinchGuideVisible: true });
          }
        });
      });

      if (this._pinchGuideAutoDismissTimer) {
        clearTimeout(this._pinchGuideAutoDismissTimer);
      }

      this._pinchGuideAutoDismissTimer = setTimeout(() => {
        this._pinchGuideAutoDismissTimer = null;
        this.dismissPinchGuide();
      }, 4500);
    }, 420);
  },

  clearPinchGuideTimers() {
    if (this._pinchGuideShowTimer) {
      clearTimeout(this._pinchGuideShowTimer);
      this._pinchGuideShowTimer = null;
    }

    if (this._pinchGuideAutoDismissTimer) {
      clearTimeout(this._pinchGuideAutoDismissTimer);
      this._pinchGuideAutoDismissTimer = null;
    }

    if (this._pinchGuideHideTimer) {
      clearTimeout(this._pinchGuideHideTimer);
      this._pinchGuideHideTimer = null;
    }
  },

  dismissPinchGuide() {
    if (!this.data.showPinchGuide) return;

    this.clearPinchGuideTimers();

    this.setData({ pinchGuideVisible: false });

    if (this._pinchGuideHideTimer) {
      clearTimeout(this._pinchGuideHideTimer);
    }

    this._pinchGuideHideTimer = setTimeout(() => {
      this._pinchGuideHideTimer = null;
      this.setData({ showPinchGuide: false });

      if (!wx.getStorageSync(STORAGE_FIRST_FULLSCREEN_KEY)) {
        wx.setStorageSync(STORAGE_FIRST_FULLSCREEN_KEY, true);
      }
    }, 280);
  },

  closeFullscreen() {
    if (this._fullscreenEnterTimer) {
      clearTimeout(this._fullscreenEnterTimer);
      this._fullscreenEnterTimer = null;
    }

    this.clearPinchGuideTimers();
    this.restoreFullscreenChrome();
    this.setData({
      isFullscreen: false,
      isFullscreenEntering: false,
      showPinchGuide: false,
      pinchGuideVisible: false
    });
    this._pinchStartDistance = 0;
    this._pinchStartZoom = 1;
    this.restoreScreenBrightness();

    if (!this.data.isKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: false
      });
    }
  },

  handleToggleFullscreenLoop() {
    const nextLooping = !this.data.isFullscreenLooping;
    this.setEditorState(
      { isFullscreenLooping: nextLooping },
      nextLooping ? pickRandom(LOOP_START_TOASTS) : null,
      { persist: false, syncSliders: false }
    );
    this.showFullscreenControls();
  },

  noop() { }
});
