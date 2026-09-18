# Fonts vendored for the site and the PDF export

Three families, all vendored unmodified and complete, all SIL Open Font License 1.1:

| Files | Family | Characters | Size (each) | Copyright |
|---|---|---|---|---|
| `noto-sans-*.ttf` | Noto Sans | 2,965 | ~620 KB | 2022 The Noto Project Authors |
| `atkinson-hyperlegible-*.ttf` | Atkinson Hyperlegible | 342 | ~54 KB | 2020 Braille Institute of America |
| `source-serif-*.ttf` | Source Serif 4 | 920 | ~266 KB | 2014–2023 Adobe |

Each is offered both as the résumé's typeface (in the Save PDF screen) and as the site's own
reading face (the typeface control in the nav). The licences are `OFL-NotoSans.txt`,
`OFL-Atkinson.txt` and `OFL-SourceSerif.txt`.

They are not subset. A subset only holds the characters someone thought the résumé would use,
and the day the data gains one it does not hold, that character falls back to another font — so
the same word is set in two different typefaces, or, in the PDF, disappears entirely. **One
global font, whole**, is the only arrangement in which a glyph cannot change shape between the
preview, the print and the exported file.

They are vendored rather than loaded from a CDN for a related reason: the exported PDF
**embeds** the same file the preview renders with, so the document on screen and the document in
the file cannot disagree. A CDN copy could not be embedded reliably, and the export would stop
working offline.

## Coverage, and why there is a chain

Noto Sans covers Latin, Greek, Cyrillic, IPA, and a wide range of punctuation, currency and
symbols. The other two are narrower — **Atkinson Hyperlegible has no `₹`**, and this résumé
quotes its headline figure in rupees.

So every family falls back to Noto Sans, in the CSS *and* in the PDF: the export splits each
line into runs by which embedded face has a glyph for each character, and draws each run with
that face (`pdfFaceFor` / `pdfDrawText` in `index.html`). The file therefore matches the
preview character for character, which is the guarantee that matters — a glyph never changes
shape between the screen and the document.

What **no** family covers — CJK, emoji — is reported after the save rather than dropped.
`ttfCoverage()` reads the font's own `cmap` table from the very bytes being embedded, because
jsPDF renders a missing glyph as *nothing at all*: no box, no gap, the character simply
vanishes. A résumé that quietly loses a word is worse than one that says it did.

## Licence

- **SIL Open Font License 1.1** for all three — see the three `OFL-*.txt` files.
- The OFL permits embedding in documents and redistribution. It forbids selling the fonts on
  their own, and requires those notices to travel with them.
- Noto Sans and Atkinson Hyperlegible declare **no Reserved Font Name**. Source Serif reserves
  the name *Source*; nothing here is modified, so the files keep their family names.

## Updating

Replace a file with a newer release, keeping the filename. Nothing else needs to change: the
coverage the export checks against is read from the file itself. To add a family, drop its two
files here and add an entry to `PR_FONTS` in `index.html` next to its `@font-face` rules.
