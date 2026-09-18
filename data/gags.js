// The running gag.
//
// Two gaudy colours and two infamous typefaces sit at the end of their pickers looking
// perfectly selectable. They are not: choosing one shows a line from the matching list below
// and changes NOTHING about the résumé. That is the whole joke, and it is also a guardrail with
// a sense of humour — the options a visitor is tempted by are exactly the ones that would ruin
// the document.
//
// Delete this file and the gag disappears cleanly: the swatches and the chips stop being drawn
// and everything else carries on.
const GAGS_CONFIG = {
  enabled: true,

  // Appended to EVERY template's accent row, after a gap. They never become the accent.
  colours: [
    { hex: "#FF00D4", label: "Hot magenta" },
    { hex: "#BFFF00", label: "Hi-vis lime" }
  ],

  // Appended to the typeface row. `mark` is hand-drawn lettering in the spirit of each face —
  // ORIGINAL artwork, not the fonts themselves, which are proprietary and could not be shipped
  // here even as two words. Drawing them is also why the joke lands on Android and Linux, where
  // neither typeface is installed and a plain text label would have shown nothing at all.
  fonts: [
    { key: "comic",   label: "Comic Sans", mark: 
      "<svg viewBox=\"0 0 396 72\" role=\"img\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\"><title>Comic Sans</title><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M47 19C41 13 33 10 25 14C17 19 14 28 14 36C14 45 17 54 25 58C33 62 41 60 47 54\"/><path d=\"M77 25C87 25 93 33 93 43C93 53 86 61 77 61C68 61 62 52 62 43C62 33 68 25 77 25Z\" transform=\"rotate(-3 77 43)\"/><path d=\"M104 35C107 29 113 25 119 26C126 27 129 34 129 39L129 61M129 35C132 29 138 25 144 26C151 27 154 34 154 39L154 61\"/><path d=\"M205 32C201 27 194 25 188 27C181 30 178 36 178 44C178 51 182 58 188 60C194 62 201 59 205 55\"/><path d=\"M259 19C254 13 245 10 238 14C231 18 231 26 238 31C244 35 252 36 257 41C262 47 259 55 252 58C245 61 236 58 231 52\"/><path d=\"M300 33C297 28 290 26 284 29C278 32 275 38 276 45C277 52 282 60 289 60C295 60 299 56 300 52\" transform=\"rotate(3 289 44)\"/><path d=\"M318 35C321 29 327 25 333 26C340 27 344 34 344 39L344 60\"/><path d=\"M380 32C377 28 370 26 365 28C360 30 359 35 364 38C369 41 376 42 379 46C382 50 380 56 374 58C368 60 361 58 358 54\" transform=\"rotate(-2 370 44)\"/><g stroke-width=\"12\"><path d=\"M104 27L104 61\"/><path d=\"M164 27L164 59\"/><path d=\"M300 27L300 61\"/><path d=\"M318 27L318 60\"/></g></g><circle cx=\"164\" cy=\"13\" r=\"6\" fill=\"currentColor\"/></svg>" },
    { key: "papyrus", label: "Papyrus",    mark: 
      "<svg viewBox=\"0 0 204 70\" role=\"img\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\"><title>Papyrus</title><defs><filter id=\"py1-erode\" x=\"-8%\" y=\"-10%\" width=\"116%\" height=\"120%\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.085\" numOctaves=\"3\" seed=\"7\" result=\"py1n\"/><feDisplacementMap in=\"SourceGraphic\" in2=\"py1n\" scale=\"1.9\" xChannelSelector=\"R\" yChannelSelector=\"G\"/></filter></defs><g filter=\"url(#py1-erode)\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\"><g stroke-width=\"5\"><path d=\"M14 10 14 46\"/><path d=\"M60 26 60 45.6\"/><path d=\"M72 26 72 60\"/><path d=\"M100 26 111 43\"/><path d=\"M128 26 128 46.4\"/><path d=\"M150 26 150 41 155 46 162 46 166 41 166 26\"/></g><g stroke-width=\"3.4\"><path d=\"M14 12 26 14 32 21 25 28 14 29\"/><path d=\"M60 29 52 26 44 31 44 40 51 45 60 43\"/><path d=\"M72 29 80 26 88 31 88 38 80 43 72 41\"/><path d=\"M118 26 111 43 104 60\"/><path d=\"M128 32 133 27 141 29\"/><path d=\"M192 29 185 26 178 29 180 34 188 37 190 42 184 46 177 43\"/></g><g fill=\"currentColor\" stroke=\"none\"><polygon points=\"9,13 19,13 14,6\"/><polygon points=\"8,43 20,43 14,50\"/><polygon points=\"56,44 64,44 60,49\"/><polygon points=\"68,56 76,56 72,63\"/><polygon points=\"99,56 108,57 102,63\"/><polygon points=\"124,44 132,44 128,50\"/><polygon points=\"146,28 154,28 150,22\"/><polygon points=\"162,28 170,28 166,22\"/><polygon points=\"138,26 144,30 138,32\"/><polygon points=\"189,31 195,27 190,23\"/><polygon points=\"174,41 181,44 175,48\"/></g></g></svg>" }
  ],

  // One is picked at random each time, never the same one twice running.
  colourLines: [
    "trust me, you do NOT want that colour on your resume",
    "That is certainly a colour.",
    "Bold. In the way a fire alarm is bold.",
    "This selection has been noted in your file.",
    "Somewhere a recruiter is reaching for their sunglasses.",
    "Your PDF would be visible from orbit.",
    "I have watched this exact decision go badly before.",
    "Every printer within a mile has quietly switched itself off.",
    "Interesting. Shall we try one that does not hum?",
    "That is a colour for a warning sign, not for a career.",
    "They will remember you. Not for the work.",
    "Legally I must show you this option. Morally I must object."
  ],

  fontLines: [
    "This typeface has been on a watchlist since 1994.",
    "A choice. Made freely. By you.",
    "Somewhere a typographer has sat bolt upright in bed.",
    "It says fun. A recruiter reads it as unsupervised.",
    "Nine readers in ten stopped at the first letter.",
    "That is for a bake sale poster, not for a career.",
    "This has been logged with your line manager.",
    "Bold. In the sense that jumping off things is bold.",
    "The letters are fine. It is the meeting they will call about.",
    "Your CV is about to be forwarded to a group chat.",
    "You have my attention. That was never the problem.",
    "I will pretend this did not happen if you will."
  ]
};
