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
      "<svg viewBox=\"0 0 392 122\" role=\"img\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\"><title>Papyrus</title><defs><filter id=\"pyr-dry\" x=\"-6%\" y=\"-10%\" width=\"112%\" height=\"122%\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.14\" numOctaves=\"4\" seed=\"9\" result=\"n\"/><feDisplacementMap in=\"SourceGraphic\" in2=\"n\" scale=\"3.6\" xChannelSelector=\"R\" yChannelSelector=\"G\"/></filter></defs><g filter=\"url(#pyr-dry)\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"6.5\" stroke-linecap=\"butt\" stroke-linejoin=\"round\"><path d=\"M22 22 L22 92\"/><path d=\"M22 24 C54 21 72 32 70 46 C68 58 52 64 22 63\"/><path d=\"M116 60 C104 53 88 57 86 70 C84 83 94 93 108 91 C113 90 117 86 118 81\"/><path d=\"M118 52 L118 92\"/><path d=\"M136 52 L136 120\"/><path d=\"M136 60 C152 53 172 57 174 70 C176 84 162 93 146 91 C142 90 138 87 136 84\"/><path d=\"M192 52 L212 88\"/><path d=\"M234 52 L206 120\"/><path d=\"M252 52 L252 92\"/><path d=\"M252 63 C257 55 268 50 279 53\"/><path d=\"M296 52 L296 78 C296 88 304 93 312 92 C321 91 327 84 327 76 L327 52\"/><path d=\"M327 52 L327 92\"/><path d=\"M372 59 C366 52 350 50 346 58 C342 66 352 70 360 74 C368 78 374 84 368 89 C362 94 348 92 344 85\"/></g></svg>" }
  ],

  // One is picked at random each time, never the same one twice running.
  colourLines: [
    "trust me, you do NOT want that colour on your resume",
    "No. Not slightly. Not once. Not ever.",
    "This is the worst idea you will have today.",
    "Absolutely not, and I say that with real warmth.",
    "On a scale of one to ten, this one is a fire.",
    "I have stopped it. You may thank me later.",
    "Bad idea. Enormous, historic, bad idea.",
    "Not this one. Please. I am asking nicely.",
    "That would be a mistake of the sort people remember.",
    "Every instinct I have is saying no, loudly.",
    "You were one press away from something terrible.",
    "I refuse, and I refuse on your behalf."
  ],

  fontLines: [
    "No. Absolutely not. Not ever.",
    "This is the single worst idea in the menu.",
    "That would be a mistake of historic proportions.",
    "Bad idea. Truly, spectacularly, bad idea.",
    "Not today. Not tomorrow. Not on a résumé.",
    "I have seen worse. I am struggling to remember when.",
    "This one is a hard no, and I am not moving.",
    "You do not want this. I promise you do not want this.",
    "That is several bad ideas wearing one coat.",
    "Please step away from the typeface.",
    "I have stopped it. You may thank me later.",
    "There is no version of this that ends well."
  ]
};
