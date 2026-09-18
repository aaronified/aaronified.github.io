// Site settings — YOUR defaults, for everyone who opens the page.
//
// Everything in the Save PDF screen has a default. Without this file those defaults are
// whatever the code shipped with; with it they are whatever you decide. A visitor who never
// touches the export screen sees the résumé the way you want it presented, and the two
// keyboard shortcuts a recruiter actually reaches for — Ctrl/Cmd-P and Ctrl/Cmd-S — produce
// exactly that document rather than a print of the web page or a folder of HTML.
//
// A visitor can still change anything for themselves; their changes are saved in their own
// browser and never reach this file. But the shortcuts below always use YOUR settings, because
// the point of them is that someone who has never opened the export screen gets your résumé as
// you meant it.
//
// Anything you leave out keeps the built-in default, so this file can be as short as you like.
const SITE_SETTINGS = {

  // What the Save PDF screen starts on.
  resume: {
    page: {
      // "bhagirathi" — one flowing column, the calmest read
      // "pattachitra" — painted column down the left carrying contact, skills and projects
      // "dokra"      — two equal columns under a banner, with rated skill bars
      template: "bhagirathi",

      // "noto" (widest coverage) · "atkinson" (built for low vision) · "serif"
      font: "noto",

      // "a4" or "letter"
      size: "a4",

      // "compact" · "normal" · "roomy" — sets text size, spacing and page margins together
      density: "normal",

      // null keeps the template's own colour. Otherwise a six-digit hex: "#0F766E".
      // Text printed on it inverts automatically to stay readable.
      accent: null,

      // Pattachitra only: true puts rated bars in the column, false the competency text.
      // Dokra always shows bars; Bhagirathi never does.
      skillBars: false
    },

    // Show the profile photo on the résumé.
    hero: { showImage: true },

    // References are off by default — most people send them separately, on request.
    recommendations: { enabled: false }
  },

  // The two shortcuts a reader reaches for on a page like this. Both are intercepted: without
  // that, Ctrl-S saves a folder of HTML that does not work offline, and Ctrl-P prints the web
  // page — navigation, chat bubble and all — rather than the résumé.
  //
  // Set either to false to hand that key back to the browser.
  shortcuts: {
    print: true,      // Ctrl/Cmd-P  → prints the résumé with the settings above
    savePdf: true     // Ctrl/Cmd-S  → downloads the PDF with the settings above
  }
};
