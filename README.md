# Opponent Lineup Report Builder v2.1

## What this build implements

- iPad/Mac responsive web-app / PWA shell with English UI.
- Imported copy of the supplied opponent database as seed data (32 players, previous matches, Expected XI and Main Subs).
- Player photos converted to transparent PNG for report use.
- Previous Match editor with the formation templates from the supplied application:
  - 1-4-4-2
  - 1-4-3-3
  - 1-4-2-3-1
  - 1-3-5-2
  - 1-5-3-2
  - 1-4-1-4-1
  - 1-3-4-3
  - 1-5-4-1
- Expected XI editor.
- Main Subs 4 x 4 + goalkeeper grid.
- Player assignment / reassignment by tapping a slot.
- Event editor using the approved report icon rules:
  - Goal: blue ball + minute, no box.
  - Goal Against: red ball + minute, no box.
  - Yellow Card.
  - 4 Yellow Accumulation: same yellow-card family with x4.
  - Red Card: same card geometry with red card.
  - Injury: red plus.
- Squad editor: number, report name, English/pinyin name, foot, height, U21 and optional local photo.
- U21 number in cyan and left foot in red.
- Report preview based on the approved MD14 v0.9 540 x 720 pt geometry.
- Report composition: up to 3 previous match pages + Expected XI + Main Subs.
- Editable client-side PPTX export intended for Keynote.
- Print / Save PDF flow with all report pages.
- JSON backup / restore.
- Offline cache/service worker for the complete seed squad and app assets.
- Scouting tab foundation with CSV import, reserved for the Wyscout + Dongqiudi dual-source module.

## Mac test

1. Unzip the folder.
2. Double-click `start_mac.command`.
3. It opens `http://localhost:3210`.
4. The app saves edits locally in the browser.

If macOS blocks the `.command` the first time, right-click it and choose **Open**.

## iPad / PWA

For a real iPad install, the folder must be served from an HTTPS web address. Once hosted:

1. Open the address in Safari.
2. Share -> **Add to Home Screen**.
3. After the first full load, the core app and imported squad are cached for offline use.

A raw HTML file opened inside a document preview is not a reliable PWA test because that preview can block JavaScript/service-worker behavior.

## Data behavior

The seed data is only copied on first launch. From then on, changes are stored in local browser storage. Use **Export backup** regularly. Reset Demo restores the included imported seed.

## Still external / credential-dependent

The following are intentionally not fabricated in this build:

- Live Wyscout API ingestion.
- Automatic Dongqiudi team refresh from iPad without a server/proxy.
- Cross-device Mac/iPad synchronization.
- Production hosting / user authentication.

Those require either API credentials, a small backend, or the final hosting choice. The UI/data model leaves room for them without changing the approved report renderer.

## Golden-master rules

The report renderer is locked to the approved visual baseline:

- 540 x 720 pt coordinate system.
- 75 x 75 pt report head image box.
- Player table width 119.875 pt.
- Left column 30.537 pt; right column 89.338 pt.
- Rows 20 pt / 16.5 pt.
- 2 pt table stroke.
- Goal minute labels have no visible rectangle/background.


## v2.1 formation spacing
- Horizontal slot coordinates are now used directly: no secondary compression is applied in editor, preview, PDF or PPTX export.
- 4-player lines use equal justified spacing across the field.
- 2-player lines remain symmetric about the centre.
- 5-player lines preserve the approved PlayerCard dimensions and use a 3-up / 2-down stagger instead of shrinking cards.
- The same slot geometry feeds the editor, report preview and PPTX export.


## v2.2.1
This build fixes the v2.2 truncated JavaScript package and restores full squad/data loading while keeping the requested layout and transfer-status improvements.


## v3.0 — Multi-team workspace + report archive
- Teams manager: add, edit, open, duplicate, archive, delete and export individual teams.
- Import team backups and import squad files from JSON or CSV.
- Header selectors for instant team/report switching.
- Multiple reports per team with independent player snapshots and lineups.
- New report, duplicate, rename, archive/restore, delete and JSON export.
- Archived reports are read-only until restored.
- Old reports keep their player snapshot even if the current squad changes later.
- Full workspace backup/import for all teams and reports.
- Data persistence uses IndexedDB with localStorage fallback for better capacity on iPad/Mac.
- Scouting CSV is now stored per team.
- Autosave on every edit.

### Import templates
- `templates/squad_import_template.csv` provides the accepted squad CSV columns.
- See `QUICK_START.md` for the two-day operational workflow and backup procedure.

## v3.1 — Manual player-data corrections
- Any imported player field you change manually is marked **Edited by me**.
- The original imported value is retained in the player record.
- Each edited field offers **Reset to imported value**.
- Manually corrected values are used by current/new reports.
- Archived/historical report snapshots remain unchanged.
- Squad cards show a visible **Edited by me** badge when a player has at least one manual correction.


## v3.1.1 — Goal marker spacing
Goal markers now use a middle-distance anchor on the player's right side. They remain visually attached to the correct player without covering the face. Goalkeeper markers stay lower, near the head/card transition. The same coordinates are used in screen preview and PPTX export.

## v3.2 — Live Dongqiudi team import
- **Teams → Import from Dongqiudi** now opens a dropdown with the 2026 China League One teams.
- Choosing a team imports the current live squad from Dongqiudi: number, player name, English/pinyin name when available, height, dominant foot and photo.
- Player photos and team logo can be downloaded into the local workspace for offline use and PPTX export.
- Existing teams show **Refresh Dongqiudi**.
- Refreshing an existing squad preserves every field marked **Edited by me** while updating the imported baseline behind it.
- Historical reports remain independent snapshots.
- This feature uses Vercel serverless routes in `/api`, so the full project folder (including `/api` and `vercel.json`) must be pushed to GitHub/Vercel.
