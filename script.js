const IMG = "assets/images/";
const SAVE_KEY = "penrose-castle-v1";

/* ================= 像素 sprite 引擎 ================= */

const PAL = {
  K: "#17100c", k: "#2b2018",           // 黑/暗棕
  M: "#b8b2a4", m: "#7d786c",           // 金屬亮/暗
  O: "#e07a2e", Y: "#f2c14e", F: "#ffe08a", // 火焰
  R: "#7a1f24", r: "#a03c30",           // 旗幟紅
  E: "#d8a84e", e: "#a97c2e",           // 金
  B: "#44597a", b: "#2c3a54",           // 騎士藍
  W: "#f4ead0", w: "#cdbd96",           // 紙
  G: "#8a8378", g: "#5c574e", s: "#3f3b34", // 石頭
  L: "rgba(238,232,214,0.78)",          // 蛛絲
  H: "rgba(255,200,110,0.27)",          // 火光暈
  P: "#d9a066",                          // 皮膚
};

function spriteCanvas(map) {
  const rows = map.length, cols = map[0].length;
  const c = document.createElement("canvas");
  c.width = cols; c.height = rows;
  const ctx = c.getContext("2d");
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const ch = map[y][x];
      if (ch === "." || !PAL[ch]) continue;
      ctx.fillStyle = PAL[ch];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

// 放一個 sprite 到場景(x,y 為底部中心,% 座標;w 為寬度 %)
function placeSprite(map, x, y, w, cls) {
  const wrap = document.createElement("div");
  wrap.className = "sprite" + (cls ? " " + cls : "");
  wrap.style.left = x + "%";
  wrap.style.top = y + "%";
  wrap.style.width = w + "%";
  wrap.appendChild(spriteCanvas(map));
  stage.appendChild(wrap);
  return wrap;
}

/* ---------- sprite 圖庫 ---------- */

const SP = {
  rubble: [
    "......GG........",
    "...GGGGGGg......",
    "..GGgGGGGGG.GG..",
    ".GGGGGgGGgGGGGg.",
    "GgGGsGGGGGGgGGGG",
    "GGgGGGgsGGGGgGGs",
    "sGGgGGGGGgsGGGgs",
  ],
  note: [
    ".WWWWW.",
    "WWWWWw.",
    "WWwWWW.",
    "WWWWWW.",
    "wWWWWW.",
    "WWWWWw.",
    ".wwwww.",
  ],
};

/* ================= 場景配置(% 座標,對齊 1376×768 原圖) ================= */

const stage = document.getElementById("stage");

// 可數元素(答案來源):蜘蛛4(四種姿態)、火把2、旗幟1(金劍)
// 蜘蛛/火把/旗幟使用去背後的像素圖(assets/images/*.png)
const DECOR_IMG = [
  { src: "spider-web.png",   x: 9,    y: 24, w: 4.6 },  // 左上窗框(結網)
  { src: "spider-hang.png",  x: 28,   y: 24, w: 2.0 },  // 垂絲吊在天空缺口前
  { src: "spider-plain.png", x: 52,   y: 60, w: 2.6 },  // 中央階梯亮面
  { src: "spider-crawl.png", x: 38,   y: 81, w: 3.0 },  // 前景亮石板爬行
  { src: "banner.png",       x: 94.5, y: 34, w: 4.4 },  // 右緣掛旗(金劍)
];
const DECOR = [
  { map: SP.rubble, x: 91.5, y: 86, w: 6 },  // 蓋掉右下浮水印
];

// 火把:右側三扇門,最上與最下的門口各插一支,中間的門沒有(第三題答案)
const TORCHES = [
  { x: 65.5, y: 20, w: 3.2 },
  { x: 89.5, y: 50, w: 3.2 },
];

// 階梯四個站點(小人腳底座標),繞一圈回到 st0
// (座標依使用者校正:以騎士身寬 2.4%、身高 6% 為單位微調)
const STATIONS = [
  { x: 30.6, y: 40 },
  { x: 59.1, y: 25.6 },
  { x: 69.0, y: 38.2 },
  { x: 57.5, y: 52 },
];

// 四張紙條藏點(依序出現)
const NOTE_SPOTS = [
  { x: 7.5,  y: 85, w: 1.9, rot: -12 },
  { x: 44,   y: 86, w: 1.8, rot: 8 },
  { x: 86.5, y: 54, w: 1.8, rot: -6 },
  { x: 54,   y: 64, w: 1.8, rot: 4 },
];

/* ================= 題庫(已審稿) ================= */

const QUIZ = [
  {
    label: "第一張紙條",
    q: "你踏進這座古塔時，大約是什麼時辰？",
    options: ["清晨", "正午", "黃昏", "深夜"],
    answer: 2,
  },
  {
    label: "第二張紙條",
    q: "這座塔裡，總共住著幾隻蜘蛛？",
    options: ["2 隻", "3 隻", "4 隻", "5 隻"],
    answer: 2,
  },
  {
    label: "第三張紙條",
    q: "右邊牆上的三扇門，哪一扇的門口沒有插火把？",
    options: ["最上面的門", "中間的門", "最下面的門", "三扇門都有火把"],
    answer: 1,
  },
  {
    label: "第四張紙條",
    q: "牆上的旗幟，繡著什麼圖案？",
    options: ["金色的劍", "銀色的盾", "黑色的鷹", "白色的月"],
    answer: 0,
  },
];

/* ================= 四卷卷軸(章節內容) ================= */

const CHAPTERS = [
  {
    title: "關於我",
    kicker: "卷軸一",
    html: () => `
      <p class="traits-line">自信 ・ 組織 ・ 紀律 ・ 開朗大方</p>
      <figure class="px-photo" id="profilePhoto" title="點擊放大">
        <img src="${IMG}profile.jpg" alt="蔡秉斈近照">
        <figcaption>塔主人近照。（點擊放大後，左右滑動可見幼時舊影）</figcaption>
      </figure>
      <p>我叫蔡秉斈，台中人，十八歲。今年剛從台中二中畢業，即將進入長庚大學人工智慧學系。做事習慣有條理、講紀律，跟人相處起來也自在，算是開朗大方的類型。</p>
      <p>老實說，如果要挑一個我最擅長的技能，大概就是——和 AI 協作。我習慣把 AI 當成一起做事的夥伴，從整理想法到動手做出東西。你腳下這座古塔、這些紙條與卷軸，都是這樣一步一步討論、一起刻出來的。</p>
      <p>對我來說這不是偷懶，而是一種新的做事方式：知道怎麼跟 AI 溝通、怎麼把模糊的想法拆成可執行的步驟，本身就是這個時代很實際的能力。</p>
      <figure class="px-photo">
        <img src="${IMG}travel-seagull.jpg" alt="在日本雪地被海鷗停在頭上" loading="lazy">
        <figcaption>日本雪地旅行。一隻海鷗決定把我的頭當停機坪。</figcaption>
      </figure>
      <figure class="px-photo">
        <img src="${IMG}travel-matsu.jpg" alt="在馬祖與迷彩牆合影" loading="lazy">
        <figcaption>馬祖交流行程，與「發揚馬祖精神」的迷彩牆合影。</figcaption>
      </figure>
    `
  },
  {
    title: "經歷與成就",
    kicker: "卷軸二",
    html: () => `
      <ul class="chrono">
        <li><span class="c-date">2026 —</span><span><span class="c-title">長庚大學 人工智慧學系</span><span class="c-sub">大一新生</span></span></li>
        <li><span class="c-date">　— 2026</span><span><span class="c-title">市立臺中第二高級中等學校</span><span class="c-sub">普通科，畢業</span></span></li>
        <li><span class="c-date">2026.05 —</span><span><span class="c-title">Gold Class 影廳服務生</span><span class="c-sub">老虎城威秀影院——帶位、點餐、備料、洗碗、回應服務鈴的十八般武藝</span></span></li>
      </ul>
      <div class="award-grid">
        ${[
          ["award-debate-champion.jpg", "龍吟辯論社 新生盃冠軍", "2023.10"],
          ["award-drama.jpg", "英語話劇比賽 團體優勝", "2024.12"],
          ["award-volunteer-service.jpg", "優學臺中博覽會 志工", "2025.04"],
          ["award-matsu-exchange.jpg", "馬祖跨校交流計畫", "2025"],
          ["award-apec.jpg", "青年未來 APEC 創新營", "2025.08"],
          ["award-medical-hackathon.jpg", "未來醫療設計思考營", "2026.02"],
          ["award-iii-genai.jpg", "資策會 生成式AI能力認證", "2026.04"],
        ].map(([img, t, d]) => `
          <div class="award-cell">
            <img src="${IMG}${img}" alt="${t}" loading="lazy">
            <p class="a-title">${t}</p>
            <p class="a-date">${d}</p>
          </div>`).join("")}
      </div>
    `
  },
  {
    title: "作品集",
    kicker: "卷軸三",
    html: () => `
      <div class="book-section">
        <h3>一、潘洛斯古塔（本站）<span class="status-note">〔已完成〕</span></h3>
        <p>把自我介紹做成一座像素風古塔解謎：潘洛斯階梯、觀察題、卷軸與 8-bit 音效，皆以原生 HTML、CSS、JavaScript 手工完成，像素小人與蜘蛛烏鴉都是程式逐格畫的。</p>
      </div>
      <div class="book-section">
        <h3>二、AI 小工具網站<span class="status-note">〔建置中〕</span></h3>
        <p>串接大型語言模型 API 的小工具，如文字摘要與翻譯，展示前後端串接與 AI 應用整合的能力。</p>
      </div>
      <div class="book-section">
        <h3>三、形象網站範本<span class="status-note">〔建置中〕</span></h3>
        <p>模擬店家與工作室的形象網站，含首頁、服務介紹與聯絡表單，對應網站建置最常見的實務案型。</p>
      </div>
      <p class="link-line"><a href="https://github.com/ping970602-netizen" target="_blank" rel="noopener">GitHub：ping970602-netizen</a></p>
    `
  },
  {
    title: "聯絡我",
    kicker: "卷軸四",
    html: () => `
      <p>走完這一圈，如果想聊聊——不管是工作機會、這座塔怎麼蓋的，還是想知道蜘蛛藏在哪——歡迎飛鴿傳書。</p>
      <div class="contact-slab">
        <p>✉ <a href="mailto:ping970602@gmail.com">ping970602@gmail.com</a></p>
        <p>◫ <a href="https://instagram.com/hsueh_0602" target="_blank" rel="noopener">Instagram @hsueh_0602</a></p>
        <p>⌂ <a href="https://github.com/ping970602-netizen" target="_blank" rel="noopener">GitHub ping970602-netizen</a></p>
        <p class="contact-edition">蔡秉斈 ・ 二〇二六年七月 ・ 於黃昏之塔</p>
      </div>
    `
  },
];

/* ================= 8-bit 音效 ================= */

let actx = null;
function audio() {
  if (!state.sound) return null;
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === "suspended") actx.resume();
  return actx;
}
function tone(freq, dur, delay = 0, type = "square", vol = 0.12) {
  const ctx = audio();
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t = ctx.currentTime + delay;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}
const sfx = {
  paper() { tone(740, 0.05); tone(1180, 0.05, 0.05); },
  correct() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.1, i * 0.09)); },
  wrong() { tone(196, 0.18, 0, "sawtooth"); tone(147, 0.25, 0.12, "sawtooth"); },
  walk() { for (let i = 0; i < 5; i++) tone(180 + (i % 2) * 40, 0.04, i * 0.28, "triangle", 0.08); },
  scroll() { [330, 392, 494].forEach((f, i) => tone(f, 0.08, i * 0.06, "triangle")); },
  finish() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.12, i * 0.11)); },
};

/* ================= 遊戲狀態 ================= */

let state = { step: 0, sound: true, introSeen: false };
try {
  const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
  if (saved && typeof saved.step === "number") state = Object.assign(state, saved);
} catch (e) { /* 壞檔就重新開始 */ }

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

/* ================= 場景建立 ================= */

let knightEl = null;
let knightImg = null;
let activeNoteEl = null;

// 圖片型 sprite(去背 PNG)
function placeImgSprite(src, x, y, w, cls) {
  const wrap = document.createElement("div");
  wrap.className = "sprite img-sprite" + (cls ? " " + cls : "");
  wrap.style.left = x + "%";
  wrap.style.top = y + "%";
  wrap.style.width = w + "%";
  const img = document.createElement("img");
  img.src = IMG + src;
  img.alt = "";
  wrap.appendChild(img);
  stage.appendChild(wrap);
  return wrap;
}

function buildScene() {
  DECOR.forEach(d => placeSprite(d.map, d.x, d.y, d.w));
  DECOR_IMG.forEach(d => placeImgSprite(d.src, d.x, d.y, d.w));

  TORCHES.forEach(t => {
    // 呼吸光暈墊底 + 火把本體緩慢搖曳
    const glow = document.createElement("div");
    glow.className = "torch-glow";
    glow.style.left = t.x + "%";
    glow.style.top = (t.y - t.w * 1.2) + "%";
    glow.style.width = (t.w * 2.6) + "%";
    stage.appendChild(glow);
    placeImgSprite("torch.png", t.x, t.y, t.w, "torch-sway");
  });

  knightEl = document.createElement("div");
  knightEl.className = "knight";
  knightImg = document.createElement("img");
  knightImg.alt = "像素騎士";
  knightEl.appendChild(knightImg);
  stage.appendChild(knightEl);
  const st = STATIONS[state.step % 4];
  knightEl.style.left = st.x + "%";
  knightEl.style.top = st.y + "%";
  setPose(state.step >= 4 ? "done" : "idle");

  spawnNote();
  updateHud();
}

// 騎士三態:idle=看地圖 / walk=奔跑 / done=席地喝茶
function setPose(pose, flip) {
  knightImg.src = `${IMG}knight-${pose}.png`;
  knightImg.classList.toggle("flip", !!flip);
}

function spawnNote() {
  if (activeNoteEl) { activeNoteEl.remove(); activeNoteEl = null; }
  if (state.step >= 4) return;
  const spot = NOTE_SPOTS[state.step];
  const btn = document.createElement("button");
  btn.className = "note-sprite";
  btn.style.left = spot.x + "%";
  btn.style.top = spot.y + "%";
  btn.style.width = spot.w + "%";
  btn.style.transform = `rotate(${spot.rot}deg)`;
  btn.setAttribute("aria-label", "一張露出一角的紙條");
  btn.appendChild(spriteCanvas(SP.note));
  btn.addEventListener("click", () => openQuiz(state.step));
  stage.appendChild(btn);
  activeNoteEl = btn;
}

/* ================= HUD ================= */

const hudProgress = document.getElementById("hudProgress");
const soundBtn = document.getElementById("soundBtn");
const NUMS = ["０", "１", "２", "３", "４"];

function updateHud() {
  hudProgress.textContent = `卷軸 ${NUMS[state.step]}／４`;
  soundBtn.textContent = state.sound ? "♪" : "✕";
  soundBtn.title = state.sound ? "音效:開" : "音效:關";
}

soundBtn.addEventListener("click", () => {
  state.sound = !state.sound;
  save();
  updateHud();
  if (state.sound) sfx.paper();
});

/* ================= 答題流程 ================= */

const quizModal = document.getElementById("quizModal");
const quizNote = quizModal.querySelector(".quiz-note");
const quizLabel = document.getElementById("quizLabel");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");

function openQuiz(idx) {
  const q = QUIZ[idx];
  quizLabel.textContent = q.label;
  quizQuestion.textContent = q.q;
  quizFeedback.textContent = "";
  quizOptions.innerHTML = "";
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "quiz-option";
    b.textContent = opt;
    b.addEventListener("click", () => answer(idx, i));
    quizOptions.appendChild(b);
  });
  quizModal.hidden = false;
  sfx.paper();
}

function answer(idx, choice) {
  if (choice === QUIZ[idx].answer) {
    sfx.correct();
    quizModal.hidden = true;
    state.step = idx + 1;
    save();
    updateHud();
    advanceKnight(() => {
      openScroll(idx, true);
      spawnNote();
      if (state.step >= 4) celebrate();
    });
  } else {
    sfx.wrong();
    quizFeedback.textContent = "……好像不對。再仔細看看這座塔。";
    quizNote.classList.remove("shake");
    void quizNote.offsetWidth;
    quizNote.classList.add("shake");
  }
}

function advanceKnight(done) {
  const st = STATIONS[state.step % 4];
  const movingLeft = st.x < parseFloat(knightEl.style.left);
  setPose("walk", movingLeft);
  knightEl.classList.add("walking");
  sfx.walk();
  knightEl.style.left = st.x + "%";
  knightEl.style.top = st.y + "%";
  setTimeout(() => {
    knightEl.classList.remove("walking");
    setPose(state.step >= 4 ? "done" : "idle");
    done && done();
  }, 1700);
}

function celebrate() {
  sfx.finish();
  const b = document.createElement("div");
  b.className = "finish-banner";
  b.textContent = "你繞行了一整圈——歡迎再訪這座塔。";
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 5000);
}

/* ================= 卷軸 ================= */

const scrollModal = document.getElementById("scrollModal");
const scrollContent = document.getElementById("scrollContent");

function openScroll(idx, withSfx) {
  const ch = CHAPTERS[idx];
  scrollContent.innerHTML = `
    <p class="scroll-kicker">${ch.kicker}</p>
    <h2 class="scroll-title">${ch.title}</h2>
    ${ch.html()}
  `;
  scrollModal.hidden = false;
  document.getElementById("scrollBody").scrollTop = 0;
  if (withSfx) sfx.scroll();
}

/* ================= 照片全圖檢視(支援多張滑動切換) ================= */

const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCap = document.getElementById("lightboxCap");

let lbImages = [];
let lbCaps = [];
let lbIdx = 0;

function openLightbox(images, caps, idx = 0) {
  lbImages = images;
  lbCaps = caps || [];
  lbIdx = idx;
  renderLightbox();
  lightboxModal.hidden = false;
  sfx.paper();
}

function renderLightbox() {
  lightboxImg.src = lbImages[lbIdx];
  const hint = lbImages.length > 1 ? "　（◀ 滑動切換 ▶）" : "";
  const cap = (lbCaps[lbIdx] || "") + hint;
  lightboxCap.textContent = cap;
  lightboxCap.hidden = !cap;
}

function lightboxStep(dir) {
  if (lbImages.length < 2) return;
  lbIdx = (lbIdx + dir + lbImages.length) % lbImages.length;
  renderLightbox();
  sfx.paper();
}

// 卷軸內照片點擊看全圖;大頭照放大後可左右滑動看小時候
document.getElementById("scrollContent").addEventListener("click", (e) => {
  const img = e.target.closest("img");
  if (!img) return;
  if (img.closest("#profilePhoto")) {
    openLightbox(
      [`${IMG}profile.jpg`, `${IMG}childhood.jpg`],
      ["塔主人近照", "小時候的塔主人"]
    );
  } else {
    openLightbox([img.src], [img.alt || ""]);
  }
});

// 滑動(滑鼠拖曳或觸控)切換
let lbPointerX = null;
lightboxImg.addEventListener("pointerdown", (e) => { lbPointerX = e.clientX; });
document.addEventListener("pointerup", (e) => {
  if (lbPointerX === null || lightboxModal.hidden) { lbPointerX = null; return; }
  const dx = e.clientX - lbPointerX;
  lbPointerX = null;
  if (Math.abs(dx) > 40) lightboxStep(dx < 0 ? 1 : -1);
});

function closeLightbox() {
  lightboxModal.hidden = true;
  lightboxImg.src = "";
  lbImages = [];
}
document.querySelectorAll("[data-close-lightbox]").forEach(el =>
  el.addEventListener("click", closeLightbox));

/* ================= 訪客名冊(後門) ================= */

const guestbookModal = document.getElementById("guestbookModal");
const guestbookList = document.getElementById("guestbookList");

function renderGuestbook() {
  guestbookList.innerHTML = "";
  CHAPTERS.forEach((ch, i) => {
    const b = document.createElement("button");
    b.className = "guestbook-item";
    const unlocked = i < state.step;
    b.innerHTML = `<span>${ch.kicker}　${ch.title}</span><span class="gb-state">${unlocked ? "已解鎖" : "直接翻閱"}</span>`;
    b.addEventListener("click", () => {
      guestbookModal.hidden = true;
      openScroll(i, true);
    });
    guestbookList.appendChild(b);
  });
}

document.getElementById("guestbookBtn").addEventListener("click", () => {
  renderGuestbook();
  guestbookModal.hidden = false;
  sfx.paper();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
});

/* ================= 開場 ================= */

const introModal = document.getElementById("introModal");
if (!state.introSeen) introModal.hidden = false;

document.getElementById("introStart").addEventListener("click", () => {
  introModal.hidden = true;
  state.introSeen = true;
  save();
  sfx.paper();
});
document.getElementById("introSkip").addEventListener("click", () => {
  introModal.hidden = true;
  state.introSeen = true;
  save();
  renderGuestbook();
  guestbookModal.hidden = false;
});

/* ================= 關閉行為 ================= */

document.querySelectorAll("[data-close-quiz]").forEach(el =>
  el.addEventListener("click", () => { quizModal.hidden = true; }));
document.querySelectorAll("[data-close-scroll]").forEach(el =>
  el.addEventListener("click", () => { scrollModal.hidden = true; }));
document.querySelectorAll("[data-close-guestbook]").forEach(el =>
  el.addEventListener("click", () => { guestbookModal.hidden = true; }));

document.addEventListener("keydown", (e) => {
  if (!lightboxModal.hidden) {
    if (e.key === "ArrowRight") { lightboxStep(1); return; }
    if (e.key === "ArrowLeft") { lightboxStep(-1); return; }
  }
  if (e.key !== "Escape") return;
  if (!lightboxModal.hidden) closeLightbox();
  else if (!quizModal.hidden) quizModal.hidden = true;
  else if (!scrollModal.hidden) scrollModal.hidden = true;
  else if (!guestbookModal.hidden) guestbookModal.hidden = true;
});

buildScene();
