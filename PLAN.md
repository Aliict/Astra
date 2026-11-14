# ASTRA build plan and progress

Last updated: 14 Nov 2026

Task numbers (#) match the task list in `ASTRA_Time_Plan.xlsx`. Test ids (T, V, F) match `ASTRA_Test_Plan.xlsx`.

## Summary

- **Done:** phases 1 to 12 of 13, with a few open items listed under "What's left". That is about 100 of the 113 planned hours (89%).
- **UI redesign** (branch `feat/be-ui-redesign`, plan in [REDESIGN_PLAN.md](REDESIGN_PLAN.md)): the interface now follows the new UI reference image and the client's notes. Steps R1 to R7 are built. R8 (testing and documents) is under way. Twelve open questions for the client are listed in that plan; the build uses the proposed answers until then.
- **Working now:**
  - a one-screen dashboard in four parts: the top bar, the body map, the daily routine and the Data Input Hub
  - the top bar: five cabin cards with nominal demo readings, and the system health sign (shape and colour only)
  - the warning flow: a caution or critical sign for 5 seconds with sound, then the guidance steps
  - the body map with 5 regions, each opening an analytics panel with a tab and a 7-day chart per parameter
  - the daily routine checklist, with a cross on tasks missed in their time slot
  - the 10-second reaction and memory tests, with no score shown
  - the 9 guidance cards, readable at any time from the "Guidance cards" button
  - the Data Input Hub: a dropdown of factors with units, validation and an optional photo
  - offline mode, with sync when the connection returns
  - the references
- **Tests:**
  - all 73 threshold tests and all 11 validation tests pass
  - the redesigned dashboard passes an automated browser run of 103 checks, including axe on the dashboard and every dialog
  - the functional test rows that the redesign changes (F01, F07, F12, F15) need new wording in the test plan
- **Next:**
  - answers to the redesign's open questions, then the team logo and any changes they bring
  - the open items of phases 9, 11 and 12
  - phase 13: final testing, the demo video and the submission

## Phases

| # | Phase | Status | Planned hours |
|---|---|---|---|
| 1 | Plan and set up | Done | 4–6 |
| 2 | Data layer | Done | 8–12 |
| 3 | Threshold engine | Done | 6–10 |
| 4 | Telemetry and alerts | Done | 10–14 |
| 5 | Body explorer | Done | 10–15 |
| 6 | Health charts | Done | 6–10 |
| 7 | Daily routine | Done | 4–6 |
| 8 | Cognitive games | Done | 8–12 |
| 9 | Guidance cards | Done. The 9 cards have the 7 required fields and open from the banner. Source titles are included; exact sections, versions and URLs are checked in phase 12. Still to do: the 2-hour chart and Re-measure box of the design's critical screen. | 8–12 |
| 10 | Data entry | Done. The form validates and saves health and cabin readings through the existing pipeline. | 4–6 |
| 11 | Offline mode | Done. PWA files, service-worker caching of the app, Tailwind CSS, Chart.js and the fonts, unsynced records and sync. A fully offline start is tested. Still to do: open the communication-disruption card when the app goes offline. | 6–10 |
| 12 | References | Done for the prototype. References are shown in the Alerts & guidance view and opened from every guidance card; per-card links to each card's own source and threshold-specific section/version verification remain to do. | 6–8 |
| 13 | Testing and submission | Ongoing | 10–15 |

## Done

The phases below record what was built first. The UI redesign changed parts of it: the sidebar and views, the telemetry cards, the analytics cards, the cognitive tests view and the "Log a reading" form were replaced. [REDESIGN_PLAN.md](REDESIGN_PLAN.md) section 7 lists what changed in each module.

### Phase 1: plan and set up
- [x] #1 Read the spec and all planning documents
- [x] #3 Layout taken from `ASTRA UI Design.pdf`
- [x] #4 `index.html` with Tailwind CSS, Chart.js, the design colours and fonts, the sidebar and the four views
- [x] #5 GitHub repo: https://github.com/Aliict/Astra (phases 1 to 12 merged into `main`)

### Phase 2: data layer
- [x] #6 Measurement record format, as in the Development Plan
- [x] #7 IndexedDB `astraDB` with 6 stores: measurements, alerts, baseline, cognitive, routine and settings
- [x] #8 Pre-flight baseline saved
- [x] #9 30 days of demo data. Every demo reading is inside its safe range, with one current nominal reading for each cabin value so the telemetry bar is populated.
- [x] #10 Store helpers: save, saveMany, getLatest, getHistory, getUnsynced
- [x] Simulated hourly cabin telemetry (removed in the redesign: the crew types the cabin values in)
- [x] "Reset demo data" button

### Phase 3: threshold engine
- [x] #11 All thresholds, units, input ranges and stale ages in one Config object
- [x] #12 `evaluate()` returns NOMINAL, CAUTION or CRITICAL
- [x] #13 Baseline rules: reaction time against baseline SD, muscle strength as % of baseline, bone density change
- [x] #14 Old readings show STALE and missing ones show NO DATA, never green
- [x] #15 Overall status, where the worst one wins
- [x] `runEngineTests()` in the browser console: 108 checks, including all of T01 to T73

### Phase 4: telemetry and alerts
- [x] #16 Telemetry cards: radiation, cabin pressure, temperature, CO₂ and system health
- [x] #17 Status pill: green, amber, or red with a flashing dot
- [x] #18 Warning banner with the parameter, value, reason, hazard or body system, and the time. It shows on every view.
- [x] #19 Tones made with the Web Audio API. Caution is one 660 Hz beep. Critical is three rising beeps every 5 s.
- [x] #20 Mute stops the sound only. Acknowledge closes the banner and saves the time.
- [x] #21 Repeat control: one alert per problem, not one per reading
- [x] #22 Alert log, with the newest 5 on the dashboard and the full log on the Alerts view
- [x] "Start monitoring" box, because browsers block sound until the first click
- [x] `runAlertTests()` in the browser console: 34 checks

### Phase 5: body explorer
- [x] #23 SVG body with 4 clickable regions: brain, lungs, heart and musculoskeletal (arms and legs). They work by mouse and keyboard.
- [x] #24 Each region coloured by its worst status: amber or red when abnormal, grey when stale, its system colour when nominal. The status word is always shown in the list next to it.
- [x] #25 Detail panel:
  - the current reading of each parameter with a baseline comparison, for example "Baseline 64 (+8)"
  - a 30-day chart with a green safe band, a dotted baseline and a hover tooltip
  - a table view of the same readings
  - the recent alerts for that system
- [x] #26 Regions linked to parameters through `Config.bodyMap`. The brain panel also shows the memory test result.
- [x] Click a reading tile to chart that parameter. Blood pressure shows systolic and diastolic with a legend.
- [x] The chart, table, tiles and region colour update as soon as a reading is saved
- [x] Chart colours checked for contrast and colour-blind separation on the dark panel

### Phase 6: health charts
- [x] #27 The 9 analytics cards, in the order of the UI design. Each card has:
  - its body system tag and status
  - the current value
  - a trend chart
  - its safe range
  - an amber or red outline when the reading is out of range
- [x] #28 Safe-range bands and baseline lines on the full charts. The small trend charts on the cards stay plain, as in the design.
- [x] #29 The cards and their trend charts update as soon as a reading is saved
- [x] A 14 days / 30 days switch. The design shows 14 days; test F12 expects about 30 days of data.
- [x] Selecting a card opens that reading in the body explorer, with the full chart and the table view
- [x] Hourly cabin readings (inspired O₂) show as daily averages on the cards, and the tooltip says so. The full chart and the table keep every reading.
- [x] Simulated cabin telemetry now drifts slowly from hour to hour instead of jumping, so its charts read like a real cabin

### Phase 7: daily routine
- [x] #30 Checklist with the 8 tasks of spec 2.5 in three sections: morning protocol, in-flight maintenance and evening review
- [x] #31 Ticking a task saves it with the time. Each day starts with an empty list, earlier days stay in the routine store, and the summary shows yesterday's count.
- [x] #32 Targets form for the exercise and hydration targets. Out-of-range values are rejected with a message. The defaults are 90 min and 2.5 L.
- [x] ARED exercise counts minutes with minus and plus 15 min buttons, and ticks itself when the target is reached
- [x] Demo history: 30 days of routine, with today ticked up to the current time as in the design

### Phase 8: cognitive games
- [x] #33 Reaction time game: 5 trials, each after a random 1 to 3 s wait, averaged.
  - A tap before green, or faster than 100 ms, counts as too early.
  - No tap within 3 s counts as missed.
  - Either way the trial is repeated.
  - Works with a mouse, touch or the Space and Enter keys.
- [x] #34 Comparison with the baseline: the average is placed on the design's green, amber and red bar, with the status word
- [x] #35 Memory game: 4 to 6 different squares light up in order on a 3 × 3 grid and are tapped back. It saves the accuracy (squares in the right place out of the total) and the time.
- [x] #36 Results saved in the cognitive store.
  - The reaction average is also saved as a reaction time reading, so it appears on the charts and can raise an alert if slow.
  - The brain panel shows the latest memory result.
- [x] #37 One-line instructions on each game, and the "not a diagnosis" note
- [x] Dashboard "Cognitive tests" card with the last results, "Evening test due today", and buttons that start each game
- [x] Finishing a game ticks the routine's "Cognitive test" task
- [x] Leaving the view stops a game half way

### Phase 9: guidance cards
- [x] #38 Card template with all 7 fields from spec section 4
- [x] #39 All 9 guidance categories, with source titles recorded for later verification
- [x] #40 Open the matching card from the warning banner
- [x] #41 Wording check: cards point to approved procedures only and do not diagnose, prescribe treatment or control spacecraft systems

### Phase 10: data entry
- [x] #42 Form for health and cabin values
- [x] #43 Validation with error messages (V01 to V09)
- [x] #44 Submit runs the full pipeline and saves readings locally. A heart rate of 135 saved through the form turns the status CRITICAL and raises an alert (V11).

### Phase 11: offline mode
- [x] #45 `manifest.json`, `sw.js` and `icon-512.png`
- [x] #46 Readings saved offline are marked unsynced. Every new reading, including game results, is synced straight away while online.
- [x] #47 Simulated sync when the connection returns
- [ ] #48 Online/offline indicator (works). Still to do: open the communication-disruption card when the app goes offline.

### Phase 12: references
- [x] #49 NASA-STD-3001, HRP, Human Research Roadmap and Five Hazards references
- [x] #50 Threshold basis notes remain in Config and are surfaced with the references section
- [x] #51 Three research papers added
- [x] #52 References section, opened from every guidance card. Per-card links to each card's own source are still to do.

## What's left

### Phases 9, 11 and 12: open items
- [ ] The 2-hour chart and Re-measure box from the design's critical guidance screen
- [ ] #48 Open the communication-disruption card when the app goes offline (the plan has Guidance listen for `network:changed`)
- [ ] Link each card's Reference field to its own source
- [ ] Concrete escalation triggers on each card (when to contact mission medical personnel). Needs a team decision.

### Phase 13: testing and submission
- [x] #53 Normal, caution and critical tested for every parameter (automated)
- [x] #54 Edge cases: boundaries, missing data and validation are covered by automated checks. Mute needs a listen with speakers on.
- [ ] #55 Accessibility check.
  - Done so far: every status shows a word as well as a colour, and an automated axe scan (WCAG 2.1 A and AA) finds no violations on the four views.
  - Live regions and alert banners are only rewritten when their words change, so screen readers do not repeat them.
  - A manual screen reader pass is still to do.
- [x] #56 Code comments and README, kept up to date each phase
- [ ] #57 Demo video
- [ ] #58 Final check against the 13 deliverables, then submit
- [x] Browser-console validation tests (`runValidationTests()`)
- [ ] Add the automated browser test scripts to the repo: the engine check outside the browser and the headless Chrome run

## Test plan status

| Sheet | Total | Passing | Not run yet | Notes |
|---|---|---|---|---|
| Threshold tests | 73 | 73 | 0 | Run `runEngineTests()` in the console. The "To be decided" rows use the proposed rules below. |
| Validation tests | 11 | 11 | 0 | `runValidationTests()` passes V01 to V11 plus 3 edge cases (unreadable input, the unit in the message, diastolic equal to systolic). Saving for V10 and V11 is checked on the page. |
| Functional tests | 33 | 26 | 7 | F01 to F22 and F25 to F28 pass in automated browser runs, including a fully offline start. F02 to F05 still need a listen with speakers on. Not run yet: F23, F24, F29 and F30 to F33. |

The spreadsheet's Actual result, Pass / Fail and Evidence columns are not filled in yet.

## Decisions needed from the team

1. **Which design?** Decided: the newer neon image, with the client's notes. The redesign's own open questions are in [REDESIGN_PLAN.md](REDESIGN_PLAN.md) section 5.
2. **NASA logo.** The newer image uses the NASA logo. Check the Space Apps rules before using it (redesign question Q1). The top bar has a logo slot for it and for the team logo.
3. **Limits the spec leaves open.** Proposed values are in the README:
   - oxygen from 122 to 126 mmHg, and above 155 mmHg
   - sleep over 9 h
   - critical limits for cabin pressure and temperature
   - radiation limits
   - muscle strength over 100%
   - stale ages
4. **Bone density limits.** Real crews often lose about 1% a month in flight. With the spec's limits, most would show red.
5. **Alert rules.** Proposals are in the README:
   - one alert per problem
   - caution alerts stay until acknowledged
   - open alerts beep once when monitoring starts
6. **Deadline, roles and marking criteria** (#2).
7. **"Analysis and report".** No document defines a report. Decide what it should be, who reads it, and in what format (on screen, PDF or CSV).
8. **Licence.** Which licence to add if the repo is public.

## Repository contents

| File | Status |
|---|---|
| `index.html` | The whole app |
| `README.md` | How to run it, how it is built, the rules and the proposed limits |
| `PLAN.md` | This file |
| `REDESIGN_PLAN.md` | The UI redesign plan and its open questions |
| `sw.js`, `manifest.json`, `icon-512.png` | Offline mode (phase 11) |

The team documents (spec, plans, test plan and design) stay outside the repo.
