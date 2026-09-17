# Inventory Source Snapshot

This folder contains a normalized, implementation-facing snapshot derived from the approved project inventory workbook.

## Counts

- Unit types: 10
- Units: 78
- Demo-enabled units: 9
- A Block units: 6
- B Block units: 32
- C Block units: 40

## Rules

- The workbook remains the human-maintained source document.
- `inventory.snapshot.json` is the approved normalized snapshot for IMP-002.
- Do not infer missing production values.
- `sourceTourMarkedAvailable` is reference metadata from the spreadsheet. Do not create dangling `tourId` values before real tours exist.
- `sourceDemoMarked` on UnitType is reference metadata only. Runtime demo selection belongs to `Unit.demoEnabled`.
