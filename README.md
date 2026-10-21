# Clipping Payout Calculator for Google Sheets

Free Google Sheets add-on by [ViewsBase](https://viewsbase.com) for clipping and UGC campaign math.

| Function | Example | Result |
|---|---|---|
| `=CLIPPING_PAYOUT(views, cpm, [cap], [min_views])` | `=CLIPPING_PAYOUT(480000, 1.5, 300)` | 300 |
| `=CLIPPING_CPM(spend, views)` | `=CLIPPING_CPM(900, 600000)` | 1.5 |
| `=CLIPPING_VIEWS_NEEDED(payout, cpm)` | `=CLIPPING_VIEWS_NEEDED(100, 2)` | 50000 |
| `=CLIPPING_BUDGET(views, cpm, [fee_pct])` | `=CLIPPING_BUDGET(1000000, 1.5, 10)` | 1650 |

`CLIPPING_PAYOUT` accepts a range, e.g. `=CLIPPING_PAYOUT(C2:C50, 1.5, 300)`.
The menu adds a calculator sidebar and a ready-made payout sheet.

**Privacy:** runs entirely in your spreadsheet (`spreadsheets.currentonly` scope). No data is sent anywhere.

## Install from source
1. In a Sheet: Extensions → Apps Script.
2. Paste `Code.gs`, add an HTML file named `Sidebar`, replace `appsscript.json` (Project Settings → show manifest).
3. Save, reload the Sheet, open Extensions → Clipping Payout Calculator.

Or with [clasp](https://github.com/google/clasp): `clasp create --type sheets && clasp push`.

Want views counted for you? [ViewsBase](https://viewsbase.com) tracks TikTok, Instagram Reels and YouTube Shorts and calculates every creator's payout. Free tools: [viewsbase.com/tools](https://viewsbase.com/tools).

MIT License.
