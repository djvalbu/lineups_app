# Opponent Lineup v3.0 — Quick Start

## First use
1. Open **Teams**.
2. Press **Add team** to create an opponent, or **Import team** to restore a team backup.
3. Use **Import squad** on the team card to load a JSON/CSV squad, or open **Squad** and add/edit players manually.
4. Press **New report**. A new report copies the current team squad into an independent snapshot.

## Daily report workflow
1. Select the team from the top **Team** selector.
2. Select/open the report from the top **Report** selector.
3. Fill **Previous Matches**.
4. Build **Expected XI** and **Main Subs**.
5. Open **Report** and export **PPTX / Keynote** or PDF.
6. When finished, open **Reports** and press **Archive**. Archived reports are read-only until restored.

## Alternative lineups
Use **Duplicate current** in Reports. The duplicate keeps all current lineups and can be edited independently.

## Historical safety
Every report keeps its own player snapshot and lineups. Editing the current team squad later does not modify older reports.

## Backups
- **Dashboard → Export all data** saves every team and every report in one JSON file.
- **Teams → Export** saves only that team and its reports.
- Use **Import all data** to restore the complete workspace.

## Squad CSV format
Use `templates/squad_import_template.csv`.
Supported columns: `squadNumber,name,nameEn,foot,height,isU21,photoAsset`.

## iPad / Mac note
The workspace autosaves locally on the device using IndexedDB (with localStorage fallback). It does not yet cloud-sync automatically between iPad and Mac. Use **Export all data / Import all data** to transfer the complete workspace between devices.

## Correcting imported player data
Open **Squad** → tap the player → change Foot, Height, Name, Squad number, U21, etc. → **Save**.
Any value that differs from the imported source is marked **Edited by me**.
Use **Reset to imported value** beside that field to restore the source value.
