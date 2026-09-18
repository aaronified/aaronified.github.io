# Fonts vendored for the PDF export

`noto-sans-regular.ttf` and `noto-sans-bold.ttf` are **Noto Sans, unmodified and complete** —
2,965 characters, ~620 KB each.

They are not subset. A subset only holds the characters someone thought the résumé would use,
and the day the data gains one it does not hold, that character falls back to another font — so
the same word is set in two different typefaces, or, in the PDF, disappears entirely. **One
global font, whole**, is the only arrangement in which a glyph cannot change shape between the
preview, the print and the exported file.

They are vendored rather than loaded from a CDN for a related reason: the exported PDF
**embeds** the same file the preview renders with, so the document on screen and the document in
the file cannot disagree. A CDN copy could not be embedded reliably, and the export would stop
working offline.

## Coverage

Noto Sans covers Latin, Greek, Cyrillic, IPA, and a wide range of punctuation, currency and
symbols. It does **not** cover CJK, emoji, or arrows such as `↳` — no Latin font does. The
export reads the font's own `cmap` table (`ttfCoverage()` in `index.html`) and reports anything
the document uses that the font cannot draw, because jsPDF renders a missing glyph as *nothing
at all*: no box, no gap, the character simply vanishes from the file. A résumé that quietly
loses a word is worse than one that says it did.

## Licence

- **SIL Open Font License 1.1** — see `OFL.txt`. Copyright 2022 The Noto Project Authors.
- The OFL permits embedding in documents and redistribution. It forbids selling the fonts on
  their own, and requires this notice and `OFL.txt` to travel with them.
- Noto Sans declares **no Reserved Font Name**, so the files keep the family name.

## Updating

Replace the two files with a newer Noto Sans release from
[notofonts.github.io](https://notofonts.github.io/), keeping the filenames. Nothing else needs
to change: the coverage the export checks against is read from the file itself.
