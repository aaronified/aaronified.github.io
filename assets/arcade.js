// The strip above the copyright — a small pixel figure who works for a living, and eventually
// runs the place.
//
// WHY THIS IS ITS OWN FILE. Everything else here is either data (data/*.js) or page behaviour
// (index.html). This is neither: a self-contained toy with its own render loop, its own
// coordinate space, and no coupling to the résumé except its owner's name and face.
//
// WHAT IT COSTS WHEN NOBODY IS PLAYING. Nothing. It is hidden outright on every tab except FAQ
// and Recommendations, the loop runs only while the strip is actually on screen and the tab is
// visible, and a system asking for reduced motion gets no strip at all.
//
// WHY IT IS QUIET. It sits under a résumé. The landscape is slate and stone with nothing
// saturated in it; only the two things a player has to tell apart — money and bombs — carry any
// colour, and even those are held well back. Anything falling from higher up is drawn on a
// 40%-scale canvas BEHIND the cards, so it reads as soft movement back there rather than as
// something demanding to be looked at.
//
// THE ECONOMY. A package is worth ₹1,000–3,000, doubled by every promotion and compounded by
// 1.05 at every increment. Nirvana is ₹100 crore. The ladder below was not chosen by feel: the
// thresholds come out of a simulation of a casual clicker — about one press every 1.5 seconds —
// which reaches nirvana in roughly 26 minutes; 37 at a slow pace, 17 at a brisk one.

(function () {
  'use strict';

  // ---------------------------------------------------------------- the world

  var LOGICAL_H = 116;          // stage height in CSS px, pointer devices
  var LOGICAL_H_SM = 92;        // …and on a phone
  var GROUND_INSET = 16;        // ground line, measured up from the bottom of the stage
  var METER_W = 22;             // the profit meter's column on the right
  var PX = 2;                   // one sprite pixel, in CSS px
  var ITEM = 10;                // package / bomb, in CSS px
  var FALL = 190;               // px per second, constant — the dodge maths stays exact
  var CATCH = 13;               // how close a worker's centre must be when it lands
  var SKY_SCALE = 0.4;          // backing-store scale of the canvas behind the cards
  var DROP_MAX = 820;           // furthest above the stage anything is allowed to start
  var ACTIVE_SECTIONS = { faq: 1, recommendations: 1 };

  var BASE_SPEED = 112;         // CSS px per second — what a promotion buys
  var SPEED_CAP = 268;
  var PIP_PENALTY = 0.78;

  var VALUE_LO = 1000, VALUE_HI = 3000;
  var INCREMENT = 1.05;         // what a pay rise is worth
  var BONUS_MULT = 5;           // the occasional windfall
  var BONUS_CHANCE = 0.10;      // …and the chance of one, from Manager onward
  var INSTAFIRE_CHANCE = 0.10;  // …and of a bomb that ends it outright
  var NIRVANA = 1e9;            // ₹100 crore
  // What each rank costs to take on, what they destroy when they sabotage, and how many
  // packages that destruction is worth. The flat figures are a FLOOR: income doubles with every
  // rung and compounds 5% with every increment, so a flat ₹1 lakh is one package by Senior
  // Manager and a rounding error after it. The multiples are what keep a sabotage meaning
  // something at the top of the ladder.
  var RANKS = {
    intern:   { hire: 2500,    floor: 5000,  packets: 3 },
    manager:  { hire: 10000,   floor: 1e5,   packets: 25 },
    director: { hire: 1000000, floor: 1e8,   packets: 400 }
  };
  var SABOTAGE_LO = 0.10, SABOTAGE_HI = 0.30;   // per catch, across the ladder
  var DIRECTOR_COOLDOWN = 20;                   // drops before another director destroy can land
  var INTERN_LOSS = 5000;
  var INTERN_SAVED = 0.80;      // how often the boss pulls an intern clear
  var AUTO_DROP = 4.5;          // seconds between unprompted drops, from Manager onward

  // The ladder. Each rung doubles what a package is worth, and the gaps grow faster than that,
  // so the later ones still take longer even as the money gets bigger.
  var LADDER = [
    { at: 0,      title: 'Intern',             interns: 0, managers: 0, directors: 0 },
    { at: 6e4,    title: 'Analyst',            interns: 0, managers: 0, directors: 0 },
    { at: 2.8e5,  title: 'Senior Analyst',     interns: 0, managers: 0, directors: 0 },
    { at: 1.3e6,  title: 'Manager',            interns: 4, managers: 0, directors: 0 },
    { at: 6.5e6,  title: 'Senior Manager',     interns: 4, managers: 0, directors: 0 },
    { at: 3.4e7,  title: 'Associate Director', interns: 4, managers: 2, directors: 0 },
    { at: 1.5e8,  title: 'Director',           interns: 4, managers: 4, directors: 0 },
    { at: 4.0e8,  title: 'CIO',                interns: 4, managers: 8, directors: 2 }
  ];
  var MANAGER_RUNG = 3;         // where the unprompted drops, the windfalls and the crew start

  // Interns are named, because "an intern" is a headcount and a name is a person.
  var INTERN_NAMES = ['Ishani', 'Rohit', 'Meera', 'Arjun', 'Tara', 'Dev', 'Nandini', 'Kabir',
                      'Priya', 'Aditya', 'Sneha', 'Vikram'];

  var NIRVANA_LINES = [
    'Nirvana. The company needs nothing further.',
    'Nirvana. Everything after this is a hobby.',
    'Nirvana. There is nothing left to optimise.',
    'Nirvana. The quarterly review is cancelled forever.',
    'Nirvana. Someone else can hold the roadmap.'
  ];

  // ---------------------------------------------------------------- the sprite
  //
  // Ten pixels wide, fourteen tall, as strings. The legs swap between the two walking frames
  // and that is the entire cycle — at this size anything more is invisible.
  //   K cap/hair · S skin · E eye · M moustache · B shirt · T trousers · O shoe · N stool
  var FRAMES = [
    ['...KKKK...', '..KKKKKK..', '.KKKKKKKK.', '.KSSSSSSK.', '.SSESSESS.', '.SSSSSSSS.', '..SMMMMS..',
     '..SSSSSS..', '.SBBBBBBS.', 'SSBBBBBBSS', '.SBBBBBBS.', '..TTTTTT..', '..TT..TT..', '.OO....OO.'],
    ['...KKKK...', '..KKKKKK..', '.KKKKKKKK.', '.KSSSSSSK.', '.SSESSESS.', '.SSSSSSSS.', '..SMMMMS..',
     '..SSSSSS..', '.SBBBBBBS.', 'SSBBBBBBSS', '.SBBBBBBS.', '..TTTTTT..', '.TT....TT.', 'OO......OO']
  ];
  // One arm up with a fist on the end of it, for the top of a promotion jump.
  var CHEER = [
    '...KKKK.S.', '..KKKKKKS.', '.KKKKKKKS.', '.KSSSSSSS.', '.SSESSESS.', '.SSSSSSSS.', '..SMMMMS..',
    '..SSSSSS..', '.SBBBBBBS.', 'SSBBBBBBS.', '.SBBBBBBS.', '..TTTTTT..', '..TT..TT..', '.OO....OO.'
  ];
  // Sat on a stool facing right: thighs forward, shins down, stool underneath, arm out.
  var SEATED = [
    '...KKKK...', '..KKKKKK..', '.KKKKKKKK.', '.KSSSSSSK.', '.SSESSESS.', '.SSSSSSSS.', '..SMMMMS..',
    '..SSSSSS..', '..BBBBBB..', '..BBBBBBSS', '..BBBBBB..', '..TTTTTTTT', '..NNNN..TT', '..N..N..OO'
  ];
  var SPRITE_W = 10, SPRITE_H = 14;
  var HEAD_ROWS = 8;            // rows 0–7 are the head — what the owner's photo replaces

  // ---------------------------------------------------------------- palettes
  //
  // Slate and stone. The only colour in the whole strip is on the two things a player has to
  // tell apart in a glance, and even those are held well back from a pure red and green.
  var SKINS = {
    light: {
      far: '#e2e8f0', near: '#cbd5e1', ground: '#94a3b8', grass: '#cbd5e1',
      N: '#94a3b8', K: '#475569', S: '#c4b5a5', E: '#1e293b', M: '#475569',
      B: '#7c8ba1', T: '#475569', O: '#334155',
      crewB: '#a9b4c2', crewK: '#7c8ba1',
      cash: '#3f7d55', cashTape: '#a9d3b7', bomb: '#a24b46', fuse: '#c98a86', spark: '#c2b4a3',
      meter: '#e2e8f0', meterFill: '#94a3b8', notch: '#cbd5e1',
      text: '#64748b', good: '#4d7a5c', pip: '#9a7b46', bad: '#9c5f5f', screen: '#cbd5e1'
    },
    dark: {
      far: '#1e293b', near: '#334155', ground: '#64748b', grass: '#334155',
      N: '#475569', K: '#94a3b8', S: '#8d7b68', E: '#e2e8f0', M: '#94a3b8',
      B: '#64748b', T: '#475569', O: '#334155',
      crewB: '#475569', crewK: '#64748b',
      cash: '#5d8f6e', cashTape: '#24402f', bomb: '#a35b57', fuse: '#8a5f5c', spark: '#a8a29e',
      meter: '#1e293b', meterFill: '#64748b', notch: '#475569',
      text: '#94a3b8', good: '#7fa387', pip: '#bb9a5f', bad: '#c08181', screen: '#334155'
    }
  };

  // ---------------------------------------------------------------- state

  var el = {};
  var cv, ctx, sky, sctx, shell;
  var dpr = 1, W = 0, H = LOGICAL_H;
  var skyH = 0, skyTop = 0, skyBand = 0, stageLeft = 0;
  var running = false, rafId = 0, lastT = 0;
  var onScreen = false, active = false, reduced = false, touch = false;
  var spawnTimer = 0, toastTimer = 0;
  var owner = { name: 'the owner', image: '' };

  var g = null;
  var head = null, headTried = false;

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  function makeWorker(kind, x) {
    return { kind: kind, x: x, facing: 1, walk: 0, walkT: 0, boss: null, slot: 0, jump: 0, cheer: 0 };
  }

  function freshGame() {
    return {
      // crew[0] is whoever the player is watching: the owner once hired, an intern before that.
      crew: [makeWorker('lead', 0.5)],
      internName: pick(INTERN_NAMES),
      parked: null,             // the one who was displaced, fishing at the right-hand end
      items: [], puffs: [],
      money: 0, rung: 0, strikes: 0, caught: 0, increments: 0,
      status: 'ok',             // 'ok' | 'pip' | 'fired' | 'nirvana'
      settled: false, dirCool: 0, sabotages: 0,
      hired: false, entering: 0, leaving: 0
    };
  }

  function playW() { return Math.max(40, W - METER_W - 6); }
  function groundY() { return H - GROUND_INSET; }
  function groundAbs() { return skyH + groundY(); }
  function lead() { return g.crew[0]; }
  function rung() { return LADDER[Math.min(g.rung, LADDER.length - 1)]; }
  function speed() {
    var s = BASE_SPEED + g.rung * 20;
    if (g.status === 'pip') s *= PIP_PENALTY;
    return Math.min(SPEED_CAP, s);
  }
  // What the next package is worth: the base band, doubled once per rung, compounded by every
  // increment along the way.
  function valueScale() { return Math.pow(2, g.rung) * Math.pow(INCREMENT, g.increments); }
  function packetValue() {
    return (VALUE_LO + Math.random() * (VALUE_HI - VALUE_LO)) * valueScale();
  }
  // Nobody sabotages a place the owner is running. That is most of what hiring him buys, and
  // why nirvana without him is possible but a much longer afternoon.
  function sabotageChance() {
    if (g.hired || g.rung < MANAGER_RUNG) return 0;
    var k = Math.max(0, Math.min(1, (g.rung - MANAGER_RUNG) / (LADDER.length - 1 - MANAGER_RUNG)));
    return SABOTAGE_LO + k * (SABOTAGE_HI - SABOTAGE_LO);
  }
  function destroys(kind) {
    var r = RANKS[kind];
    return Math.max(r.floor, r.packets * ((VALUE_LO + VALUE_HI) / 2) * valueScale());
  }
  function live() { return active && onScreen && !document.hidden && !reduced; }
  function over() { return g.status === 'fired' || g.status === 'nirvana'; }

  // ₹ in Indian units, because ₹1,00,00,00,000 is a number nobody reads.
  function money(n) {
    n = Math.round(n);
    if (n >= 1e7) return '₹' + (n / 1e7).toFixed(n >= 1e8 ? 0 : 1) + ' Cr';
    if (n >= 1e5) return '₹' + (n / 1e5).toFixed(n >= 1e6 ? 0 : 1) + ' L';
    return '₹' + n.toLocaleString('en-IN');
  }

  // ---------------------------------------------------------------- geometry

  function resize() {
    if (!cv || !shell) return;
    // A hidden strip measures as a zero rect, and a zero rect once made skyH the scroll offset:
    // the canvas overflowed the shell, the document got taller, the shell's top moved up, and
    // skyH grew again. Never measure something that is not being rendered.
    if (!cv.getClientRects().length) return;
    var host = cv.parentNode.getBoundingClientRect();
    H = host.width < 420 ? LOGICAL_H_SM : LOGICAL_H;
    W = Math.max(160, Math.round(host.width));
    dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.style.height = H + 'px';
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    var sr = shell.getBoundingClientRect(), cr = cv.getBoundingClientRect();
    stageLeft = cr.left - sr.left;
    skyH = Math.max(0, Math.round(cr.top - sr.top));
    // The band only has to cover the highest anything is allowed to start from, so it is
    // anchored just above the stage rather than stretched over the whole page.
    skyBand = Math.max(0, Math.min(skyH, DROP_MAX + 60));
    skyTop = skyH - skyBand;
    sky.style.left = stageLeft + 'px';
    sky.style.top = skyTop + 'px';
    sky.style.width = W + 'px';
    sky.style.height = skyBand + 'px';
    sky.width = Math.max(1, Math.round(W * SKY_SCALE));
    sky.height = Math.max(1, Math.round(skyBand * SKY_SCALE));
    sctx.setTransform(SKY_SCALE, 0, 0, SKY_SCALE, 0, 0);
    draw();
  }

  // ---------------------------------------------------------------- input

  var cursor = null;
  var keyDir = 0;
  var dragId = null;

  function fracFromClientX(x) {
    var cr = cv.getBoundingClientRect();
    return Math.max(0.02, Math.min(0.98, (x - cr.left) / Math.max(1, playW())));
  }

  function dropY(clientY) {
    var inShell = clientY - shell.getBoundingClientRect().top;
    var lo = Math.max(-ITEM, skyH - DROP_MAX);
    return Math.min(groundAbs() - ITEM - 8, Math.max(lo, inShell));
  }

  function spawn(frac, y, bomb) {
    if (!g || over() || !live()) return;
    var mgr = g.rung >= MANAGER_RUNG;
    var isBomb = bomb == null ? Math.random() < 0.5 : bomb;
    var big = !isBomb && mgr && Math.random() < BONUS_CHANCE;
    g.items.push({
      x: Math.max(0.02, Math.min(0.98, frac)),
      y: y,
      bomb: isBomb,
      big: big,
      fatal: isBomb && mgr && Math.random() < INSTAFIRE_CHANCE,
      value: isBomb ? 0 : packetValue() * (big ? BONUS_MULT : 1),
      taken: null
    });
    if (g.items.length > 26) g.items.shift();
    if (g.dirCool > 0) g.dirCool--;
    start();
  }

  function onPointerMove(e) {
    if (touch || e.clientX == null) return;
    cursor = fracFromClientX(e.clientX);
    if (live()) start();
  }

  function onDocClick(e) {
    if (!live() || !g) return;
    if (e.target && e.target.closest && e.target.closest('#arcade-controls')) return;
    if (touch && !g.hired) return;
    if (touch && e.target && e.target.closest && e.target.closest('#arcade-stage')) return;
    spawn(fracFromClientX(e.clientX == null ? 0 : e.clientX), dropY(e.clientY == null ? 0 : e.clientY));
  }

  function onStagePointerDown(e) {
    if (!touch || !g || g.hired || !live()) return;
    dragId = e.pointerId;
    if (cv.setPointerCapture) { try { cv.setPointerCapture(e.pointerId); } catch (x) {} }
    cursor = fracFromClientX(e.clientX);
    start();
  }
  function onStagePointerMove(e) {
    if (dragId == null || e.pointerId !== dragId) return;
    cursor = fracFromClientX(e.clientX);
    start();
  }
  function onStagePointerUp(e) { if (dragId != null && e.pointerId === dragId) dragId = null; }

  function onStageKey(e) {
    if (!g || !live()) return;
    if (e.key === 'ArrowLeft') { keyDir = -1; cursor = null; }
    else if (e.key === 'ArrowRight') { keyDir = 1; cursor = null; }
    else if (e.key === ' ' || e.key === 'Enter') { spawn(lead().x, Math.max(-ITEM, skyH - 320)); }
    else return;
    e.preventDefault();
    start();
  }
  function onStageKeyUp(e) {
    if ((e.key === 'ArrowLeft' && keyDir < 0) || (e.key === 'ArrowRight' && keyDir > 0)) keyDir = 0;
  }

  // Work arrives on its own once there is a team to do it — and on a phone from the start,
  // since before the owner is hired a tap is how you steer rather than how you drop.
  function scheduleDrop() {
    clearTimeout(spawnTimer);
    if (!g || !live() || over()) return;
    var phone = touch && !g.hired;
    if (!phone && g.rung < MANAGER_RUNG) return;
    var gap = phone ? 900 + Math.random() * 1500 : AUTO_DROP * 1000 * (0.6 + Math.random() * 0.8);
    spawnTimer = setTimeout(function () {
      spawn(0.06 + Math.random() * 0.88, Math.max(-ITEM, skyH - (260 + Math.random() * 380)));
      scheduleDrop();
    }, gap);
  }

  // ---------------------------------------------------------------- the crew
  //
  // Who exists is a property of the rung, so it is derived rather than tracked. Interns line up
  // beside whoever hired them, two a side; managers and directors walk about on their own.
  function syncCrew() {
    var r = rung();
    var counts = { intern: 0, manager: 0, director: 0 };
    g.crew.forEach(function (w) { if (counts[w.kind] != null) counts[w.kind]++; });
    var want = { director: r.directors, manager: r.managers, intern: r.interns };
    ['director', 'manager', 'intern'].forEach(function (kind) {
      while (counts[kind] < want[kind]) {
        var w = makeWorker(kind, Math.max(0.03, Math.min(0.97, lead().x + (counts[kind] % 2 ? 0.06 : -0.06))));
        w.slot = counts[kind];
        g.crew.push(w);
        g.money = Math.max(0, g.money - RANKS[kind].hire);
        counts[kind]++;
      }
    });
    // Interns are shared out over the lead and every manager, so the formations spread rather
    // than piling four deep on one person.
    var bosses = g.crew.filter(function (w) { return w.kind === 'lead' || w.kind === 'manager'; });
    var n = 0;
    g.crew.forEach(function (w) {
      if (w.kind !== 'intern') return;
      w.boss = bosses[n % bosses.length];
      w.slot = Math.floor(n / bosses.length) * 2 + (n % 2);
      n++;
    });
  }

  function anchorFor(w) {
    if (w.kind !== 'intern' || !w.boss) return null;
    var side = (w.slot % 2) ? 1 : -1;
    var step = (Math.floor(w.slot / 2) + 1) * (16 / playW());
    return Math.max(0.02, Math.min(0.98, w.boss.x + side * step));
  }

  // ---------------------------------------------------------------- the brain
  //
  // Unhired, the lead is a puppet: it goes where the cursor goes and nowhere else, so every
  // package caught and every bomb worn is the person at the keyboard. Hired, the owner runs
  // himself and is never hit. Managers and directors work to the owner's rules; interns take
  // the smallest thing left and are pulled clear of a bomb only four times in five.
  function threatFor(w, radius) {
    var pw = playW(), gy = groundAbs(), worst = null, worstT = 1e9;
    for (var i = 0; i < g.items.length; i++) {
      var it = g.items[i];
      if (!it.bomb) continue;
      var t = (gy - ITEM - it.y) / FALL;
      if (t < 0 || t > 2) continue;
      if (Math.abs(it.x - w.x) * pw > radius) continue;
      if (t < worstT) { worstT = t; worst = it; }
    }
    return worst;
  }

  function claim(w, smallest) {
    var pw = playW(), gy = groundAbs(), reach = speed() / pw;
    var best = null, bestKey = smallest ? Infinity : -Infinity, fallback = null, fallbackT = 1e9;
    for (var i = 0; i < g.items.length; i++) {
      var p = g.items[i];
      if (p.bomb || (p.taken && p.taken !== w)) continue;
      var tt = (gy - ITEM - p.y) / FALL;
      if (tt <= 0) continue;
      if (tt < fallbackT) { fallbackT = tt; fallback = p; }
      if (Math.abs(p.x - w.x) / Math.max(1e-6, reach) > tt * 0.95) continue;
      if (smallest ? p.value < bestKey : p.value > bestKey) { bestKey = p.value; best = p; }
    }
    var go = best || fallback;
    if (go) go.taken = w;
    return go;
  }

  function desire(w) {
    var pw = playW();
    if (w === g.crew[0] && !g.hired) {
      var want = cursor != null ? cursor : w.x;
      if (keyDir) want = w.x + keyDir * 0.06;
      return { x: Math.max(0.02, Math.min(0.98, want)), urgent: false };
    }

    var bomb = threatFor(w, CATCH + 34);
    if (bomb) {
      var away = bomb.x <= w.x ? 1 : -1;
      var to = w.x + away * ((CATCH + 30) / pw);
      if (to < 0.03 || to > 0.97) to = w.x - away * ((CATCH + 30) / pw);
      return { x: Math.max(0.02, Math.min(0.98, to)), urgent: true };
    }

    if (w.kind === 'intern') {
      var mine = claim(w, true);
      var home = anchorFor(w);
      if (mine && Math.abs(mine.x - w.x) * pw < 90) return { x: mine.x, urgent: false };
      return { x: home == null ? w.x : home, urgent: false };
    }
    var take = claim(w, false);
    return { x: take ? take.x : w.x, urgent: false };
  }

  // ---------------------------------------------------------------- simulation

  function toast(text, tone) {
    if (!el.toast) return;
    el.toast.textContent = text;
    el.toast.dataset.tone = tone || 'text';
    el.toast.classList.remove('hidden');
    if (el.live) el.live.textContent = text;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.classList.add('hidden'); }, 2600);
  }

  function cheer(w) { w.jump = 0.62; w.cheer = 0.95; }

  function promoteIfDue() {
    while (g.rung + 1 < LADDER.length && g.money >= LADDER[g.rung + 1].at) {
      g.rung++;
      cheer(lead());
      toast('Promoted — ' + LADDER[g.rung].title, 'good');
      syncCrew();
      scheduleDrop();
      syncPanel();
    }
    if (g.money >= NIRVANA && g.status !== 'nirvana') {
      g.status = 'nirvana';
      g.settled = false;
      clearTimeout(spawnTimer);
      toast(pick(NIRVANA_LINES), 'good');
      syncPanel();
    }
  }

  function land(it) {
    var pw = playW(), hitBy = null;
    for (var i = 0; i < g.crew.length; i++) {
      if (Math.abs(it.x - g.crew[i].x) * pw <= CATCH) { hitBy = g.crew[i]; break; }
    }
    if (!hitBy) { g.puffs.push({ x: it.x, y: groundY() - 10, t: 0, text: '' }); return; }

    if (!it.bomb) {
      // A helper who was going to bring this in may take it the other way instead.
      if (hitBy.kind !== 'lead' && Math.random() < sabotageChance()) {
        var kind = hitBy.kind;
        if (kind === 'director' && g.dirCool > 0) kind = 'manager';   // still on its cooldown
        if (kind === 'director') g.dirCool = DIRECTOR_COOLDOWN;
        var cost = destroys(kind);
        g.money = Math.max(0, g.money - cost);
        g.sabotages++;
        g.puffs.push({ x: it.x, y: groundY() - SPRITE_H * PX - 4, t: 0, text: '-' + money(cost), tone: 'bad' });
        toast(kind === 'director' ? 'A director has destroyed \u20b9' + money(cost).slice(1)
                                  : 'Sabotage on the ' + kind + ' desk', 'bad');
        syncPanel();
        return;
      }
      g.money += it.value;
      g.caught++;
      g.puffs.push({ x: it.x, y: groundY() - SPRITE_H * PX - 4, t: 0,
                     text: (it.big ? '★ ' : '') + money(it.value), tone: 'good' });
      // A rise comes up at random, about half the times another five have come in.
      if (g.caught % 5 === 0 && Math.random() < 0.5) {
        g.increments++;
        toast(Math.random() < 0.5 ? 'Increment' : 'Bonus', 'good');
      }
      promoteIfDue();
      syncPanel();
      return;
    }

    // A bomb. An intern is somebody the boss tries to pull clear, and mostly does.
    if (hitBy.kind === 'intern') {
      if (Math.random() < INTERN_SAVED) {
        g.puffs.push({ x: it.x, y: groundY() - SPRITE_H * PX - 4, t: 0, text: 'saved', tone: 'text' });
        return;
      }
      g.money = Math.max(0, g.money - INTERN_LOSS);
      g.puffs.push({ x: it.x, y: groundY() - SPRITE_H * PX - 4, t: 0, text: '-' + money(INTERN_LOSS), tone: 'bad' });
      toast('An intern took one for the team', 'pip');
      syncPanel();
      return;
    }
    if (hitBy !== g.crew[0]) return;    // managers and directors look after themselves
    if (g.hired) return;                // the owner is not hit; that is what hiring him buys

    if (it.fatal) {
      g.status = 'fired'; g.settled = false;
      clearTimeout(spawnTimer);
      toast('Gross misconduct. Out today.', 'bad');
      syncPanel();
      return;
    }
    g.strikes++;
    if (g.strikes === 1) { g.status = 'pip'; toast('Performance improvement plan', 'pip'); }
    else {
      g.status = 'fired'; g.settled = false;
      clearTimeout(spawnTimer);
      toast('Let go', 'bad');
    }
    syncPanel();
  }

  var RETIRE_X = 0.90;          // where a displaced or let-go worker goes to fish
  var CINEMA_X = 0.07;          // …and where a retired one goes to watch films

  function walkTo(w, target, dt, sp) {
    var pw = playW(), mv = ((sp || BASE_SPEED) / pw) * dt, d = target - w.x;
    if (Math.abs(d) <= mv) { w.x = target; return true; }
    w.facing = d > 0 ? 1 : -1;
    w.x += w.facing * mv;
    w.walkT += mv * pw;
    if (w.walkT > 7) { w.walkT = 0; w.walk ^= 1; }
    return false;
  }

  function step(dt) {
    var i;
    for (i = g.puffs.length - 1; i >= 0; i--) if ((g.puffs[i].t += dt) > 1.4) g.puffs.splice(i, 1);
    g.crew.forEach(function (w) {
      if (w.jump > 0) w.jump = Math.max(0, w.jump - dt);
      if (w.cheer > 0) w.cheer = Math.max(0, w.cheer - dt);
    });

    // Two endings. Both walk somewhere and then stop asking for frames — a permanent idle
    // animation under someone's résumé is exactly the attention this is not supposed to draw.
    if (over()) {
      var there = walkTo(lead(), g.status === 'nirvana' ? CINEMA_X : RETIRE_X, dt, BASE_SPEED);
      if (there) g.settled = true;
      return !there || g.puffs.length > 0;
    }

    // Somebody is walking on or off the strip; nothing else happens until they arrive.
    if (g.leaving) {
      if (walkTo(lead(), -0.12, dt, BASE_SPEED * 1.7)) { g.leaving = 0; g.entering = 1; lead().x = -0.12; }
      return true;
    }
    if (g.entering) {
      if (walkTo(lead(), 0.5, dt, BASE_SPEED * 1.7)) g.entering = 0;
      return true;
    }

    g.items.forEach(function (it) { it.taken = null; });
    var busy = false;
    g.crew.forEach(function (w) {
      var d = desire(w);
      var sp = speed() * (d.urgent ? 1.35 : 1) * (w.kind === 'intern' ? 0.9 : 1);
      if (!walkTo(w, d.x, dt, sp)) busy = true;
    });

    var gy = groundAbs();
    for (i = g.items.length - 1; i >= 0; i--) {
      var it = g.items[i];
      it.y += FALL * dt;
      if (it.y >= gy - ITEM) { it.y = gy - ITEM; land(it); g.items.splice(i, 1); }
      else busy = true;
    }
    // `|| over()` matters: the bomb that ends it is spliced out in this same pass, so without it
    // the loop would report "nothing left to animate" on the very frame it happens.
    return busy || g.puffs.length > 0 || over() ||
           g.crew.some(function (w) { return w.jump > 0 || w.cheer > 0; });
  }

  // ---------------------------------------------------------------- drawing

  function skinOf() {
    return document.documentElement.classList.contains('dark') ? SKINS.dark : SKINS.light;
  }
  function px(c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

  function drawWorld(s) {
    var gy = groundY(), pw = playW(), off = g ? lead().x * pw : 0, i, x;
    ctx.clearRect(0, 0, W, H);
    for (i = -2; i < 24; i++) {
      x = ((i * 46) - off * 0.18) % (24 * 46);
      if (x < -60) x += 24 * 46;
      var fh = 10 + ((i * 7) % 5) * 4;
      px(s.far, x, gy - fh, 26, fh);
      px(s.far, x + 30, gy - (fh - 4), 10, fh - 4);
    }
    for (i = -2; i < 16; i++) {
      x = ((i * 97) - off * 0.42) % (16 * 97);
      if (x < -70) x += 16 * 97;
      var nh = 18 + ((i * 13) % 4) * 7;
      px(s.near, x, gy - nh, 20, nh);
      for (var wy = gy - nh + 4; wy < gy - 4; wy += 7) { px(s.far, x + 4, wy, 4, 3); px(s.far, x + 12, wy, 4, 3); }
    }
    px(s.ground, 0, gy, W, 2);
    for (i = 0; i < W; i += 8) px(s.grass, i + ((Math.floor(-off * 0.9) % 8) + 8) % 8, gy + 4, 4, 2);
  }

  function drawFigure(s, w, opts) {
    var pw = playW(), ww = SPRITE_W * PX, hh = SPRITE_H * PX;
    opts = opts || {};
    var f = opts.seated ? SEATED : (w.cheer > 0 ? CHEER : FRAMES[w.walk]);
    var left = Math.round(w.x * pw - ww / 2);
    // A promotion is a jump: a half-second arc, with the fist up at the top of it.
    var lift = w.jump > 0 ? Math.sin((1 - w.jump / 0.62) * Math.PI) * 13 : 0;
    var top = Math.round(groundY() - hh - lift);
    var from = 0;

    if (opts.photo && head) {
      from = HEAD_ROWS;
      var hd = HEAD_ROWS * PX + 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(left + ww / 2, top + hd / 2, hd / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.imageSmoothingEnabled = true;               // a photograph, not pixel art
      ctx.drawImage(head, left + ww / 2 - hd / 2, top, hd, hd);
      ctx.restore();
      ctx.imageSmoothingEnabled = false;
    }

    ctx.save();
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    for (var r = from; r < SPRITE_H; r++) {
      var row = f[r];
      for (var c = 0; c < SPRITE_W; c++) {
        var ch = row.charAt(w.facing < 0 ? SPRITE_W - 1 - c : c);
        if (ch === '.') continue;
        // The crew are the same drawing in quieter colours, so the eye knows who the subject is.
        var col = s[ch] || s.K;
        if (opts.quiet) { if (ch === 'B') col = s.crewB; else if (ch === 'K' || ch === 'M') col = s.crewK; }
        px(col, left + c * PX, top + r * PX, PX, PX);
      }
    }
    ctx.restore();

    if (opts.seated) {
      var hx = left + ww, hy = top + 9 * PX;
      for (var i = 0; i < 9; i++) px(s.K, hx + i * PX, hy - i * PX, PX, PX);
      var tipX = hx + 9 * PX, tipY = hy - 9 * PX;
      px(s.near, tipX, tipY, 1, groundY() - 3 - tipY);
      px(s.cash, tipX - 2, groundY() - 6, 4, 3);
    }
    if (opts.cinema) {
      var sx = left - 34, sy = groundY() - 32;
      px(s.screen, sx, sy, 26, 17);
      px(s.near, sx + 2, sy + 2, 22, 13);
      px(s.screen, sx + 11, sy + 17, 4, 7);
      px(s.near, sx + 7, sy + 24, 12, 2);
    }
  }

  function itemShape(c, s, x, y, it) {
    if (it.bomb) {
      c.fillStyle = s.bomb; c.fillRect(x + 1, y + 2, ITEM - 2, ITEM - 2); c.fillRect(x, y + 4, ITEM, ITEM - 5);
      c.fillStyle = s.fuse; c.fillRect(x + ITEM - 3, y - 1, 2, 3);
      c.fillStyle = s.spark; c.fillRect(x + ITEM - 3, y - 3, 2, 2);
      if (it.fatal) { c.fillStyle = s.spark; c.fillRect(x + 3, y + 5, ITEM - 6, 2); }
    } else {
      c.fillStyle = s.cash; c.fillRect(x, y, ITEM, ITEM);
      c.fillStyle = s.cashTape; c.fillRect(x + 2, y + 3, ITEM - 4, 1); c.fillRect(x + 2, y + 6, ITEM - 4, 1);
      if (it.big) { c.fillStyle = s.cashTape; c.fillRect(x - 1, y - 1, 2, 2); c.fillRect(x + ITEM - 1, y - 1, 2, 2); }
    }
  }

  function drawSky(s) {
    if (!sctx || !skyBand) return;
    sctx.clearRect(0, 0, W, skyBand);
    if (!g) return;
    var pw = playW();
    for (var i = 0; i < g.items.length; i++) {
      var it = g.items[i], y = it.y - skyTop;
      if (y < -ITEM || y > skyBand + ITEM) continue;
      sctx.globalAlpha = 0.14 + 0.26 * Math.max(0, Math.min(1, y / Math.max(1, skyBand)));
      itemShape(sctx, s, Math.round(it.x * pw - ITEM / 2), Math.round(y), it);
    }
    sctx.globalAlpha = 1;
  }

  // The profit line. Logarithmic, because ₹100 crore against ₹2,000 on a linear bar is a bar
  // that does not move for twenty minutes.
  function meterFrac(v) {
    return v <= 0 ? 0 : Math.min(1, Math.log10(v / 1e4 + 1) / Math.log10(NIRVANA / 1e4 + 1));
  }
  function drawMeter(s) {
    var x = W - METER_W + 6, top = 8, bot = groundY() - 4, h = bot - top;
    px(s.meter, x, top, 8, h);
    px(s.meterFill, x, bot - Math.round(h * meterFrac(g.money)), 8, Math.round(h * meterFrac(g.money)));
    for (var i = 1; i < LADDER.length; i++) {
      var y = Math.round(bot - h * meterFrac(LADDER[i].at));
      px(s.notch, x - 3, y, 3, 1);
      px(s.notch, x + 8, y, 3, 1);
    }
  }

  function drawPuffs(s) {
    var pw = playW();
    ctx.font = '700 9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    for (var i = 0; i < g.puffs.length; i++) {
      var p = g.puffs[i], k = p.t / 1.4;
      ctx.globalAlpha = Math.max(0, 1 - k) * 0.85;
      if (p.text) { ctx.fillStyle = s[p.tone] || s.text; ctx.fillText(p.text, p.x * pw, p.y - k * 16); }
      else px(s.text, p.x * pw - 4, p.y + 8 - k * 4, 8, 2);
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    if (!ctx) return;
    var s = skinOf();
    drawWorld(s);
    drawSky(s);
    if (!g) return;
    var pw = playW();
    for (var i = 0; i < g.items.length; i++) {
      var it = g.items[i], y = it.y - skyH;
      if (y < -ITEM * 2) continue;
      ctx.globalAlpha = Math.max(0.35, Math.min(1, 0.4 + (y + ITEM) / 26));
      itemShape(ctx, s, Math.round(it.x * pw - ITEM / 2), Math.round(y), it);
    }
    ctx.globalAlpha = 1;
    if (g.parked) drawFigure(s, g.parked, { seated: true, quiet: true, alpha: 0.9 });
    // Back to front, so the lead is never hidden behind somebody they hired.
    for (i = g.crew.length - 1; i >= 1; i--) drawFigure(s, g.crew[i], { quiet: true, alpha: 0.92 });
    drawFigure(s, g.crew[0], {
      photo: g.hired,
      seated: g.status === 'fired' && g.settled,
      cinema: g.status === 'nirvana' && g.settled,
      alpha: g.status === 'pip' ? 0.68 : 1
    });
    drawMeter(s);
    drawPuffs(s);
  }

  // ---------------------------------------------------------------- loop

  function frame(t) {
    rafId = 0;
    if (!running) return;
    var dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0.016;
    lastT = t;
    var busy = step(dt);
    draw();
    if (busy && live()) rafId = requestAnimationFrame(frame);
    else running = false;
  }
  function start() {
    if (running || !live() || !g) return;
    running = true; lastT = 0;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    clearTimeout(spawnTimer);
  }

  // ---------------------------------------------------------------- panel

  function who() { return g.hired ? owner.name : g.internName; }

  function syncPanel() {
    if (!el.rank) return;
    el.rank.textContent = who() + ' · ' + rung().title;
    el.profit.textContent = money(g.money);
    var st = g.status;
    el.status.textContent = st === 'nirvana' ? 'Retired' : st === 'fired' ? 'Let go'
                          : st === 'pip' ? 'On a PIP' : 'In good standing';
    el.status.className = 'text-[11px] font-bold ' + (
      st === 'nirvana' ? 'text-emerald-700/70 dark:text-emerald-300/70'
      : st === 'fired' ? 'text-rose-700/70 dark:text-rose-300/70'
      : st === 'pip' ? 'text-amber-700/70 dark:text-amber-300/70'
      : 'text-slate-500 dark:text-slate-400');
    el.reset.classList.toggle('hidden', st === 'ok' && g.money === 0);
    if (el.hire) el.hire.textContent = (g.hired ? 'Fire ' : 'Hire ') + owner.name;
  }

  function loadHead(src) {
    if (headTried || !src) return;
    headTried = true;
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () { head = img; draw(); };
    img.onerror = function () { head = null; };
    img.src = src;
  }

  // Hiring and firing are the same gesture from opposite ends: one of them walks off to the
  // left and the other walks on from it. Nobody is sacked here — the one being replaced takes
  // the rod at the far end, and the one leaving has been hired away at double.
  function setHired(on) {
    if (!g || g.entering || g.leaving) return;
    if (on) {
      loadHead(owner.image);
      var displaced = makeWorker('intern', RETIRE_X);
      displaced.facing = 1;
      g.parked = displaced;
      g.hired = true;
      g.crew[0] = makeWorker('lead', -0.12);
      g.entering = 1;
      toast(owner.name + ' starts today', 'good');
    } else {
      g.hired = false;
      g.parked = null;                       // the one who was fishing comes back to work
      g.internName = pick(INTERN_NAMES);
      g.leaving = 1;
      toast(owner.name + ' hired away, 100% hike', 'good');
    }
    cursor = null;
    syncPanel();
    scheduleDrop();
    start();
  }

  function reset() {
    var wasHired = g && g.hired;
    g = freshGame();
    if (wasHired) { g.hired = true; g.parked = makeWorker('intern', RETIRE_X); }
    if (el.toast) el.toast.classList.add('hidden');
    syncPanel();
    scheduleDrop();
    draw();
  }

  // ---------------------------------------------------------------- setup

  function setSectionForArcade(id) {
    if (!el.root || reduced) return;
    active = !!ACTIVE_SECTIONS[id];
    el.root.classList.toggle('hidden', !active);
    if (sky) sky.style.display = active ? '' : 'none';
    if (!active) { stop(); return; }
    requestAnimationFrame(function () { resize(); scheduleDrop(); start(); });
  }

  function initArcade(opts) {
    el.root = document.getElementById('arcade');
    if (!el.root) return;

    reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduced) { el.root.remove(); return; }          // asked for less movement: give none

    cv = document.getElementById('arcade-stage');
    shell = document.getElementById('app-shell');
    if (!cv || !shell || !cv.getContext) { el.root.remove(); return; }
    ctx = cv.getContext('2d');
    if (!ctx) { el.root.remove(); return; }

    el.rank = document.getElementById('arcade-rank');
    el.profit = document.getElementById('arcade-profit');
    el.status = document.getElementById('arcade-status');
    el.hire = document.getElementById('arcade-hire');
    el.reset = document.getElementById('arcade-reset');
    el.live = document.getElementById('arcade-live');
    el.toast = document.getElementById('arcade-toast');

    sky = document.createElement('canvas');
    sky.id = 'arcade-sky';
    sky.setAttribute('aria-hidden', 'true');
    sky.className = 'print:hidden';
    sky.style.cssText = 'position:absolute;top:0;z-index:-1;pointer-events:none;display:none';
    shell.appendChild(sky);
    sctx = sky.getContext('2d');

    touch = !!(window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    owner.name = (opts && opts.name) || 'the owner';
    owner.image = (opts && opts.image) || '';
    g = freshGame();
    resize();
    syncPanel();

    if (el.hire) el.hire.addEventListener('click', function () { setHired(!g.hired); });
    if (el.reset) el.reset.addEventListener('click', function () { reset(); start(); });

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('click', onDocClick);
    cv.addEventListener('pointerdown', onStagePointerDown);
    cv.addEventListener('pointermove', onStagePointerMove);
    cv.addEventListener('pointerup', onStagePointerUp);
    cv.addEventListener('pointercancel', onStagePointerUp);
    cv.addEventListener('keydown', onStageKey);
    cv.addEventListener('keyup', onStageKeyUp);

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(resize);
      ro.observe(shell);
      ro.observe(cv.parentNode);
    } else window.addEventListener('resize', resize);

    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

    if (window.IntersectionObserver) {
      // A real threshold, not a margin: he starts when you have scrolled all the way down to
      // him, not when he is nearly in view.
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen) { resize(); scheduleDrop(); start(); } else stop();
      }, { threshold: 0.65 }).observe(el.root);
    } else {
      onScreen = true;
      start();
    }

    setSectionForArcade((opts && opts.section) || 'overview');
  }

  // A seam for the test suite. Reaching Associate Director honestly takes about a quarter of an
  // hour of clicking, which is not a thing a test can do, so it can put money on the board and
  // drop a specific kind of thing. Nothing here reads or writes anything outside this file, and
  // nothing else in the page calls it — if it is ever used for anything but a test, that is a
  // mistake rather than an API.
  window.arcadeTest = {
    drop: function (frac, bomb, above) { spawn(frac, groundAbs() - (above || 60), bomb); },
    pay: function (v) { if (!g) return; g.money = v; promoteIfDue(); syncPanel(); start(); },
    state: function () {
      return g ? { rung: g.rung, title: rung().title, money: g.money, crew: g.crew.length,
                   interns: g.crew.filter(function (w) { return w.kind === 'intern'; }).length,
                   managers: g.crew.filter(function (w) { return w.kind === 'manager'; }).length,
                   directors: g.crew.filter(function (w) { return w.kind === 'director'; }).length,
                   status: g.status, hired: g.hired, parked: !!g.parked, caught: g.caught,
                   sabotages: g.sabotages, sabotageChance: sabotageChance() } : null;
    }
  };

  window.initArcade = initArcade;
  window.arcadeSetSection = setSectionForArcade;
})();
