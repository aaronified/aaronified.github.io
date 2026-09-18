// The strip above the copyright — a small pixel figure who works for a living.
//
// WHY THIS IS ITS OWN FILE. Everything else here is either data (data/*.js) or page behaviour
// (index.html). This is neither: a self-contained toy with its own render loop, its own
// coordinate space, and no coupling to the résumé except its owner's name and face. Four
// hundred lines of game loop inside index.html would make that file harder to read for nothing.
//
// WHAT IT COSTS WHEN NOBODY IS PLAYING. Nothing. It is hidden outright on every tab except FAQ
// and Recommendations, the loop runs only while the strip is actually on screen and the tab is
// visible, and a system asking for reduced motion gets no strip at all.
//
// WHY IT IS QUIET. It sits under a résumé. The whole palette is slate and stone — legible, but
// with nothing saturated to compete with the page — and anything falling from higher up is
// drawn on a low-resolution canvas BEHIND the content, so it reads as soft movement behind the
// cards rather than as something demanding to be looked at.

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
  var CATCH = 13;               // how close his centre must be when it lands
  var SKY_SCALE = 0.4;          // backing-store scale of the canvas behind the cards
  var DROP_MAX = 820;           // furthest above the stage anything is allowed to start
  var ACTIVE_SECTIONS = { faq: 1, recommendations: 1 };

  var BASE_SPEED = 112;         // CSS px per second — what a promotion actually buys
  var SPEED_CAP = 268;
  var PIP_PENALTY = 0.78;

  // The ladder. `raise` is more money and a little more pace; `promotion` also renames him.
  // Real rungs of an analytics career, because that is where the joke is.
  var LADDER = [
    { at: 0,     kind: 'promotion', title: 'Intern',             speed: 0 },
    { at: 240,   kind: 'raise',     title: null,                 speed: 14 },
    { at: 600,   kind: 'promotion', title: 'Analyst',            speed: 22 },
    { at: 1200,  kind: 'raise',     title: null,                 speed: 14 },
    { at: 2000,  kind: 'promotion', title: 'Senior Analyst',     speed: 22 },
    { at: 3200,  kind: 'raise',     title: null,                 speed: 14 },
    { at: 4800,  kind: 'promotion', title: 'Manager',            speed: 22 },
    { at: 7000,  kind: 'raise',     title: null,                 speed: 12 },
    { at: 10000, kind: 'promotion', title: 'Senior Manager',     speed: 20 },
    { at: 14000, kind: 'promotion', title: 'Associate Director', speed: 20 },
    { at: 20000, kind: 'promotion', title: 'Director',           speed: 18 }
  ];
  var PACKAGE_VALUE = 120;

  // ---------------------------------------------------------------- the sprite
  //
  // Ten pixels wide, fourteen tall, as two strings. The legs swap between frames and that is
  // the entire walk cycle — at this size anything more is invisible.
  //   K cap/hair · S skin · E eye · M moustache · B shirt · T trousers · O shoe
  var FRAMES = [
    ['...KKKK...', '..KKKKKK..', '.KKKKKKKK.', '.KSSSSSSK.', '.SSESSESS.', '.SSSSSSSS.', '..SMMMMS..',
     '..SSSSSS..', '.SBBBBBBS.', 'SSBBBBBBSS', '.SBBBBBBS.', '..TTTTTT..', '..TT..TT..', '.OO....OO.'],
    ['...KKKK...', '..KKKKKK..', '.KKKKKKKK.', '.KSSSSSSK.', '.SSESSESS.', '.SSSSSSSS.', '..SMMMMS..',
     '..SSSSSS..', '.SBBBBBBS.', 'SSBBBBBBSS', '.SBBBBBBS.', '..TTTTTT..', '.TT....TT.', 'OO......OO']
  ];
  // Let go, he walks to the end of the strip, sits on a stool and fishes. Same ten-by-fourteen
  // grid, facing right: thighs forward, shins down, stool underneath, one arm out for the rod.
  //   N stool
  var SEATED = [
    '...KKKK...', '..KKKKKK..', '.KKKKKKKK.', '.KSSSSSSK.', '.SSESSESS.', '.SSSSSSSS.', '..SMMMMS..',
    '..SSSSSS..', '..BBBBBB..', '..BBBBBBSS', '..BBBBBB..', '..TTTTTTTT', '..NNNN..TT', '..N..N..OO'
  ];
  var SPRITE_W = 10, SPRITE_H = 14;
  var HEAD_ROWS = 8;            // rows 0–7 are the head — what the owner's photo replaces

  // ---------------------------------------------------------------- palettes
  //
  // Slate and stone in both themes. Everything is legible; nothing is saturated. The figure is
  // deliberately a step or two more contrasted than the landscape, so the eye knows what the
  // subject is without the strip shouting for attention.
  var SKINS = {
    light: {
      far: '#e2e8f0', near: '#cbd5e1', ground: '#94a3b8', grass: '#cbd5e1',
      N: '#94a3b8', K: '#475569', S: '#c4b5a5', E: '#1e293b', M: '#475569', B: '#7c8ba1', T: '#475569', O: '#334155',
      pkg: '#a89680', pkgTape: '#d6cec2', bomb: '#57534e', fuse: '#a8a29e', spark: '#c2b4a3',
      meter: '#e2e8f0', meterFill: '#94a3b8', notch: '#cbd5e1',
      text: '#64748b', good: '#5f8168', pip: '#9a7b46', bad: '#9c5f5f'
    },
    dark: {
      far: '#1e293b', near: '#334155', ground: '#64748b', grass: '#334155',
      N: '#475569', K: '#94a3b8', S: '#8d7b68', E: '#e2e8f0', M: '#94a3b8', B: '#64748b', T: '#475569', O: '#334155',
      pkg: '#8a7a66', pkgTape: '#b3a795', bomb: '#292524', fuse: '#78716c', spark: '#a8a29e',
      meter: '#1e293b', meterFill: '#64748b', notch: '#475569',
      text: '#94a3b8', good: '#7fa387', pip: '#bb9a5f', bad: '#c08181'
    }
  };

  // ---------------------------------------------------------------- state

  var el = {};
  var cv, ctx, sky, sctx, shell;
  var dpr = 1, W = 0, H = LOGICAL_H;
  var skyH = 0, skyTop = 0, skyBand = 0, stageLeft = 0;
  var running = false, rafId = 0, lastT = 0;
  var onScreen = false, active = false, reduced = false, touch = false;
  var spawnTimer = 0;
  var toastTimer = 0;

  var g = null;
  var head = null, headTried = false;

  function freshGame() {
    return {
      x: 0.5, facing: 1, walk: 0, walkT: 0,
      items: [],                // { x: fraction of the playfield, y: px below #app-shell's top, bomb }
      puffs: [],
      profit: 0, rung: 0, strikes: 0,
      status: 'ok',             // 'ok' | 'pip' | 'fired'
      firedT: 0, seated: false, hired: false
    };
  }

  function playW() { return Math.max(40, W - METER_W - 6); }
  function groundY() { return H - GROUND_INSET; }
  function groundAbs() { return skyH + groundY(); }
  function speed() {
    var s = BASE_SPEED;
    for (var i = 0; i <= g.rung && i < LADDER.length; i++) s += LADDER[i].speed;
    if (g.status === 'pip') s *= PIP_PENALTY;
    return Math.min(SPEED_CAP, s);
  }
  function rank() {
    var t = LADDER[0].title;
    for (var i = 0; i <= g.rung && i < LADDER.length; i++) if (LADDER[i].title) t = LADDER[i].title;
    return t;
  }
  function live() { return active && onScreen && !document.hidden && !reduced; }

  // ---------------------------------------------------------------- geometry
  //
  // Two canvases, one coordinate space. `y` is measured from the top of #app-shell, so an item
  // spawned where you clicked keeps its place while the page reflows underneath it. The sky
  // canvas covers everything above the stage and sits at z-index -1 — behind every card, which
  // is what makes a falling parcel read as something happening back there rather than on top.
  function resize() {
    if (!cv || !shell) return;
    // A hidden strip measures as a zero rect, and a zero rect made skyH the scroll offset: the
    // canvas then overflowed the shell, the document got taller, the shell's top moved further
    // up, and skyH grew again. The page reached a hundred thousand pixels. Never measure
    // something that is not being rendered.
    if (!cv.getClientRects().length) return;
    var host = cv.parentNode.getBoundingClientRect();
    H = host.width < 420 ? LOGICAL_H_SM : LOGICAL_H;
    W = Math.max(160, Math.round(host.width));
    dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.style.height = H + 'px';
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;                 // pixel art: never interpolate

    var sr = shell.getBoundingClientRect(), cr = cv.getBoundingClientRect();
    stageLeft = cr.left - sr.left;
    skyH = Math.max(0, Math.round(cr.top - sr.top));
    // The band only has to cover the highest anything is allowed to start from, so it is
    // anchored just above the stage rather than stretched over the whole page. A shorter canvas
    // is a cheaper clear every frame, and it cannot reach far enough to overflow anything.
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

  var cursor = null;            // target as a fraction of the playfield, or null when unset
  var keyDir = 0;
  var dragId = null;

  function fracFromClientX(x) {
    var cr = cv.getBoundingClientRect();
    return Math.max(0.02, Math.min(0.98, (x - cr.left) / Math.max(1, playW())));
  }

  // Where a thing dropped from `clientY` starts. Clamped to one screenful above the stage: a
  // click near the top of a long page should not mean a fifteen-second descent.
  function dropY(clientY) {
    var inShell = clientY - shell.getBoundingClientRect().top;
    var lo = Math.max(-ITEM, skyH - DROP_MAX);
    return Math.min(groundAbs() - ITEM - 8, Math.max(lo, inShell));
  }

  function spawn(frac, y, bomb) {
    if (!g || g.status === 'fired' || !live()) return;
    // Deliberately unseeded: a coin flip per drop is the entire premise.
    g.items.push({
      x: Math.max(0.02, Math.min(0.98, frac)),
      y: y,
      bomb: bomb == null ? Math.random() < 0.5 : bomb
    });
    if (g.items.length > 20) g.items.shift();          // a fast clicker cannot grow this forever
    start();
  }

  function onPointerMove(e) {
    if (touch) return;                                  // on a phone the cursor means nothing
    if (e.clientX == null) return;
    cursor = fracFromClientX(e.clientX);
    if (live()) start();
  }

  // Pointer devices: a click anywhere drops something. Phones: only once he has been hired,
  // because before that the same tap is how you steer him.
  function onDocClick(e) {
    if (!live() || !g) return;
    if (e.target && e.target.closest && e.target.closest('#arcade-controls')) return;
    if (touch && !g.hired) return;
    if (touch && e.target && e.target.closest && e.target.closest('#arcade-stage')) return;
    spawn(fracFromClientX(e.clientX == null ? 0 : e.clientX), dropY(e.clientY == null ? 0 : e.clientY));
  }

  // Phones, before he is hired: drag along the strip to walk him. The stage carries
  // `touch-action: none`, so a sideways drag there never turns into a page scroll.
  function onStagePointerDown(e) {
    if (!touch || !g || g.hired || !live()) return;
    dragId = e.pointerId;
    if (cv.setPointerCapture) { try { cv.setPointerCapture(e.pointerId); } catch (x) { /* older engines */ } }
    cursor = fracFromClientX(e.clientX);
    start();
  }
  function onStagePointerMove(e) {
    if (dragId == null || e.pointerId !== dragId) return;
    cursor = fracFromClientX(e.clientX);
    start();
  }
  function onStagePointerUp(e) {
    if (dragId == null || e.pointerId !== dragId) return;
    dragId = null;
  }

  function onStageKey(e) {
    if (!g || !live()) return;
    if (e.key === 'ArrowLeft') { keyDir = -1; cursor = null; }
    else if (e.key === 'ArrowRight') { keyDir = 1; cursor = null; }
    else if (e.key === ' ' || e.key === 'Enter') { spawn(g.x, Math.max(-ITEM, skyH - 320)); }
    else return;
    e.preventDefault();
    start();
  }
  function onStageKeyUp(e) {
    if ((e.key === 'ArrowLeft' && keyDir < 0) || (e.key === 'ArrowRight' && keyDir > 0)) keyDir = 0;
  }

  // Phones, before he is hired: work arrives on its own schedule, as it does.
  function scheduleDrop() {
    clearTimeout(spawnTimer);
    if (!touch || !g || g.hired || !live() || g.status === 'fired') return;
    spawnTimer = setTimeout(function () {
      spawn(0.06 + Math.random() * 0.88, Math.max(-ITEM, skyH - (260 + Math.random() * 380)));
      scheduleDrop();
    }, 900 + Math.random() * 1500);
  }

  // ---------------------------------------------------------------- the brain
  //
  // Two completely different animals, and that is the joke.
  //
  // NOT HIRED, he is a puppet: he goes exactly where the cursor goes and nowhere else. He does
  // not dodge, he does not reach for a parcel, he has no instincts at all. Every parcel he
  // catches and every bomb he wears is the person at the keyboard. That is the game.
  //
  // HIRED, he runs himself: bombs first, parcels second, and he is never hit — `land()` makes
  // that a guarantee rather than a hope. Watching someone do the job properly is the point of
  // the button.
  function desire() {
    var here = g.x;

    if (!g.hired) {
      var want = cursor != null ? cursor : here;
      if (keyDir) want = here + keyDir * 0.06;
      return { x: Math.max(0.02, Math.min(0.98, want)), urgent: false };
    }

    var pw = playW(), reach = speed() / pw, gy = groundAbs(), i;

    var worst = null, worstT = 1e9;
    for (i = 0; i < g.items.length; i++) {
      var it = g.items[i];
      if (!it.bomb) continue;
      var t = (gy - ITEM - it.y) / FALL;
      if (t < 0 || t > 2) continue;
      if (Math.abs(it.x - here) * pw > CATCH + 34) continue;
      if (t < worstT) { worstT = t; worst = it; }
    }
    if (worst) {
      var away = worst.x <= here ? 1 : -1;
      var to = here + away * ((CATCH + 30) / pw);
      if (to < 0.03 || to > 0.97) to = here - away * ((CATCH + 30) / pw);   // cornered: cut past it
      return { x: Math.max(0.02, Math.min(0.98, to)), urgent: true };
    }

    // The one he can still make, by preference. Failing that, the nearest one anyway: standing
    // still because nothing is catchable looks like a bug, and setting off now is how he
    // catches the one after it.
    var best = null, bestCost = 1e9, fallback = null, fallbackT = 1e9;
    for (i = 0; i < g.items.length; i++) {
      var pk = g.items[i];
      if (pk.bomb) continue;
      var tt = (gy - ITEM - pk.y) / FALL;
      if (tt <= 0) continue;
      if (tt < fallbackT) { fallbackT = tt; fallback = pk; }
      var need = Math.abs(pk.x - here) / Math.max(1e-6, reach);
      if (need > tt * 0.95) continue;
      if (need < bestCost) { bestCost = need; best = pk; }
    }
    var go = best || fallback;
    return { x: go ? go.x : here, urgent: false };
  }

  // ---------------------------------------------------------------- simulation

  function toast(text, tone) {
    if (!el.toast) return;
    el.toast.textContent = text;
    el.toast.dataset.tone = tone || 'text';
    el.toast.classList.remove('hidden');
    el.live.textContent = text;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.classList.add('hidden'); }, 2400);
  }

  function promoteIfDue() {
    while (g.rung + 1 < LADDER.length && g.profit >= LADDER[g.rung + 1].at) {
      g.rung++;
      var s = LADDER[g.rung];
      toast(s.kind === 'promotion' ? 'Promoted — ' + s.title : 'Pay rise', 'good');
      syncPanel();
    }
  }

  function land(it) {
    var hit = Math.abs(it.x - g.x) * playW() <= CATCH;
    if (!hit) {
      g.puffs.push({ x: it.x, y: groundY() - 10, t: 0, text: '' });
      return;
    }
    if (!it.bomb) {
      g.profit += PACKAGE_VALUE;
      g.puffs.push({ x: it.x, y: groundY() - SPRITE_H * PX - 4, t: 0, text: '+' + PACKAGE_VALUE });
      promoteIfDue();
      syncPanel();
      return;
    }
    // Hired, he is not hit. He will have stepped aside already in all but the contrived cases,
    // and where he has not, the promise the button makes still holds.
    if (g.hired) return;
    g.strikes++;
    if (g.strikes === 1) { g.status = 'pip'; toast('Performance improvement plan', 'pip'); }
    else { g.status = 'fired'; g.firedT = 0; toast('Let go', 'bad'); clearTimeout(spawnTimer); }
    syncPanel();
  }

  var RETIRE_X = 0.90;          // where he goes to sit

  function step(dt) {
    if (g.status === 'fired') {
      g.firedT += dt;
      for (var q = g.puffs.length - 1; q >= 0; q--) if ((g.puffs[q].t += dt) > 1.4) g.puffs.splice(q, 1);
      // He walks off to the end of the strip and sits down. Once he is there the scene is
      // finished and the loop stops asking for frames — a permanent idle animation under
      // someone's résumé is exactly the attention this is not supposed to draw.
      g.facing = 1;
      var want = RETIRE_X - g.x;
      var mv = (BASE_SPEED / playW()) * dt;
      if (Math.abs(want) <= mv) { g.x = RETIRE_X; g.seated = true; }
      else { g.x += (want > 0 ? 1 : -1) * mv; g.walkT += mv * playW(); }
      if (g.walkT > 7) { g.walkT = 0; g.walk ^= 1; }
      return !g.seated || g.puffs.length > 0;
    }

    var pw = playW(), d = desire();
    var maxStep = (speed() * (d.urgent ? 1.35 : 1) / pw) * dt;
    var delta = d.x - g.x;
    if (Math.abs(delta) <= maxStep) g.x = d.x;
    else { var dir = delta > 0 ? 1 : -1; g.x += dir * maxStep; g.facing = dir; g.walkT += maxStep * pw; }
    if (g.walkT > 7) { g.walkT = 0; g.walk ^= 1; }

    var busy = false, gy = groundAbs(), i;
    for (i = g.items.length - 1; i >= 0; i--) {
      var it = g.items[i];
      it.y += FALL * dt;
      if (it.y >= gy - ITEM) { it.y = gy - ITEM; land(it); g.items.splice(i, 1); }
      else busy = true;
    }
    for (i = g.puffs.length - 1; i >= 0; i--) {
      if ((g.puffs[i].t += dt) > 1.4) g.puffs.splice(i, 1); else busy = true;
    }
    // `|| fired` matters: the bomb that ends it is spliced out in this same pass, so without it
    // the loop reports "nothing left to animate" on the very frame he is let go and he never
    // gets to walk off.
    return busy || Math.abs(d.x - g.x) > 0.002 || g.status === 'fired';
  }

  // ---------------------------------------------------------------- drawing

  function skinOf() {
    return document.documentElement.classList.contains('dark') ? SKINS.dark : SKINS.light;
  }
  function px(c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

  // A one-dimensional landscape: a ground line and two ranks of silhouettes, both offset by
  // where he is standing. He walks; the world slides. That parallax is the only thing making a
  // hundred-pixel strip feel like somewhere rather than a bar.
  function drawWorld(s) {
    var gy = groundY(), pw = playW(), off = g ? g.x * pw : 0, i, x;
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

  function drawSprite(s) {
    var pw = playW(), w = SPRITE_W * PX, h = SPRITE_H * PX;
    var left = Math.round(g.x * pw - w / 2);
    var top = Math.round(groundY() - h);
    var seated = g.status === 'fired' && g.seated;
    var f = seated ? SEATED : FRAMES[g.walk];
    var from = 0;

    // Hired: his own head, clipped to a circle, over the body.
    if (g.hired && head) {
      from = HEAD_ROWS;
      var hd = HEAD_ROWS * PX + 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(left + w / 2, top + hd / 2, hd / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.imageSmoothingEnabled = true;                // a photograph, not pixel art
      ctx.drawImage(head, left + w / 2 - hd / 2, top, hd, hd);
      ctx.restore();
      ctx.imageSmoothingEnabled = false;
    }

    ctx.save();
    if (g.status === 'pip') ctx.globalAlpha = 0.68;    // visibly diminished, as intended
    for (var r = from; r < SPRITE_H; r++) {
      var row = f[r];
      for (var c = 0; c < SPRITE_W; c++) {
        var ch = row.charAt(g.facing < 0 ? SPRITE_W - 1 - c : c);
        if (ch !== '.') px(s[ch] || s.K, left + c * PX, top + r * PX, PX, PX);
      }
    }
    ctx.restore();

    // The rod, and a line out to the right. Drawn rather than stored in the grid because it
    // reaches well past the ten pixels he occupies.
    if (seated) {
      var hx = left + w, hy = top + 9 * PX;
      for (var i = 0; i < 9; i++) px(s.K, hx + i * PX, hy - i * PX, PX, PX);
      var tipX = hx + 9 * PX, tipY = hy - 9 * PX;
      px(s.near, tipX, tipY, 1, groundY() - 3 - tipY);
      px(s.pkg, tipX - 2, groundY() - 6, 4, 3);
    }
  }

  function itemShape(c, s, x, y, bomb) {
    if (bomb) {
      c.fillStyle = s.bomb; c.fillRect(x + 1, y + 2, ITEM - 2, ITEM - 2); c.fillRect(x, y + 4, ITEM, ITEM - 5);
      c.fillStyle = s.fuse; c.fillRect(x + ITEM - 3, y - 1, 2, 3);
      c.fillStyle = s.spark; c.fillRect(x + ITEM - 3, y - 3, 2, 2);
    } else {
      c.fillStyle = s.pkg; c.fillRect(x, y, ITEM, ITEM);
      c.fillStyle = s.pkgTape; c.fillRect(x + ITEM / 2 - 1, y, 2, ITEM); c.fillRect(x, y + ITEM / 2 - 1, ITEM, 2);
    }
  }

  // Everything above the stage, on a canvas at 40% resolution sitting behind the cards. The
  // browser's own upscale is the blur — cheaper than a filter and it looks the same at this
  // size — and the alpha ramps up as a thing nears the ground, so crossing onto the stage is a
  // fade rather than a pop.
  function drawSky(s) {
    if (!sctx || !skyBand) return;
    sctx.clearRect(0, 0, W, skyBand);
    if (!g) return;
    var pw = playW();
    for (var i = 0; i < g.items.length; i++) {
      var it = g.items[i], y = it.y - skyTop;
      if (y < -ITEM || y > skyBand + ITEM) continue;
      sctx.globalAlpha = 0.14 + 0.26 * Math.max(0, Math.min(1, y / Math.max(1, skyBand)));
      itemShape(sctx, s, Math.round(it.x * pw - ITEM / 2), Math.round(y), it.bomb);
    }
    sctx.globalAlpha = 1;
  }

  // The profit line: a track, a fill, and a notch for every rung. A chart of one number, which
  // is the only chart this deserves.
  function drawMeter(s) {
    var x = W - METER_W + 6, top = 8, bot = groundY() - 4, h = bot - top;
    px(s.meter, x, top, 8, h);
    var ceiling = LADDER[LADDER.length - 1].at;
    var fh = Math.round(h * Math.max(0, Math.min(1, g.profit / ceiling)));
    px(s.meterFill, x, bot - fh, 8, fh);
    for (var i = 1; i < LADDER.length; i++) {
      var y = Math.round(bot - h * (LADDER[i].at / ceiling));
      px(LADDER[i].kind === 'promotion' ? s.notch : s.meter, x - 3, y, 3, 1);
      if (LADDER[i].kind === 'promotion') px(s.notch, x + 8, y, 3, 1);
    }
  }

  function drawPuffs(s) {
    var pw = playW();
    ctx.font = '700 9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    for (var i = 0; i < g.puffs.length; i++) {
      var p = g.puffs[i], k = p.t / 1.4;
      ctx.globalAlpha = Math.max(0, 1 - k) * 0.8;
      if (p.text) { ctx.fillStyle = s.text; ctx.fillText(p.text, p.x * pw, p.y - k * 16); }
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
      itemShape(ctx, s, Math.round(it.x * pw - ITEM / 2), Math.round(y), it.bomb);
    }
    ctx.globalAlpha = 1;
    drawSprite(s);
    drawMeter(s);
    drawPuffs(s);
  }

  // ---------------------------------------------------------------- loop

  function frame(t) {
    rafId = 0;
    if (!running) return;
    var dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0.016;  // a backgrounded tab must not
    lastT = t;                                                     // resume with one huge step
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

  function syncPanel() {
    if (!el.rank) return;
    el.rank.textContent = rank();
    el.profit.textContent = g.profit.toLocaleString('en-IN');
    var st = g.status;
    el.status.textContent = st === 'fired' ? 'Let go' : st === 'pip' ? 'On a PIP' : 'In good standing';
    el.status.className = 'text-[11px] font-bold ' + (
      st === 'fired' ? 'text-rose-700/70 dark:text-rose-300/70'
      : st === 'pip' ? 'text-amber-700/70 dark:text-amber-300/70'
      : 'text-slate-500 dark:text-slate-400');
    el.reset.classList.toggle('hidden', st === 'ok' && g.profit === 0);
  }

  function loadHead(src) {
    if (headTried) return;
    headTried = true;
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () { head = img; draw(); };
    img.onerror = function () { head = null; };        // no photo → he keeps his own head
    img.src = src;
  }

  function setHired(on, image) {
    g.hired = on;
    if (on && image) loadHead(image);
    el.hire.setAttribute('aria-pressed', on ? 'true' : 'false');
    el.hire.classList.toggle('border-slate-400', on);
    el.hire.classList.toggle('dark:border-slate-500', on);
    if (touch) { if (on) clearTimeout(spawnTimer); else scheduleDrop(); }
    if (on) cursor = null;
    start();
    draw();
  }

  function reset() {
    var wasHired = g && g.hired;
    g = freshGame();
    g.hired = !!wasHired;
    if (el.toast) el.toast.classList.add('hidden');
    syncPanel();
    scheduleDrop();
    draw();
  }

  // ---------------------------------------------------------------- setup

  // Only FAQ and Recommendations, and only once the strip is actually on screen. Everywhere
  // else it is not dormant, it is absent — a dead grey box on four other tabs would be exactly
  // the kind of attention this is supposed not to attract.
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

    // The canvas behind the cards. Built here rather than in index.html because every one of its
    // dimensions is measured, so there is nothing meaningful to write in the markup.
    sky = document.createElement('canvas');
    sky.id = 'arcade-sky';
    sky.setAttribute('aria-hidden', 'true');
    sky.className = 'print:hidden';
    sky.style.cssText = 'position:absolute;top:0;z-index:-1;pointer-events:none;display:none';
    shell.appendChild(sky);
    sctx = sky.getContext('2d');

    touch = !!(window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    g = freshGame();
    resize();
    syncPanel();

    var name = (opts && opts.name) || 'me';
    if (el.hire) {
      el.hire.textContent = 'Hire ' + name;
      el.hire.addEventListener('click', function () { setHired(!g.hired, opts && opts.image); });
    }
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
      // A real threshold, not a margin: the point is that he starts when you have scrolled all
      // the way down to him, not when he is nearly in view.
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

  window.initArcade = initArcade;
  window.arcadeSetSection = setSectionForArcade;
})();
