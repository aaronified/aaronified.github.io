# Fonts vendored for the PDF export

`noto-sans-resume-*.ttf` are **subsets of Noto Sans** (regular and bold), cut down to the
characters this résumé actually uses — 129 glyphs, 12 KB each instead of ~600 KB.

They are vendored rather than loaded from a CDN for one reason: the exported PDF **embeds** the
same font file the preview renders with, so the document on screen and the document in the file
cannot disagree. A CDN copy could not be embedded reliably, and would break the export offline.

- **Licence:** SIL Open Font License 1.1 — see `OFL.txt`. Copyright 2022 The Noto Project Authors.
- The OFL permits subsetting, embedding in documents, and redistribution. It forbids selling the
  fonts on their own, and requires this notice and `OFL.txt` to travel with them.
- Noto Sans declares **no Reserved Font Name**, so the subsets keep the family name.

Regenerate with:

```sh
pyftsubset NotoSans-Regular.ttf --text-file=used-characters.txt \
  --output-file=noto-sans-resume-regular.ttf --layout-features='' --no-hinting
```
