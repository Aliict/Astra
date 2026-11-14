# ASTRA UI redesign plan

Last updated: 14 Nov 2026 · Branch: `feat/be-ui-redesign` (from `main` at `65d4e98`)

This plan covers moving ASTRA to the new UI reference image and the client's notes about it. It checks every point against `astra specifications.pdf` and lists what changes in the app built so far (phases 1 to 12 on `main`).

Sources:
- **New UI reference:** the neon dashboard image (`WhatsApp Image 2026-11-13 at 10.10.22 PM.jpeg`)
- **Client notes:** the client's notes on that image
- **Requirements:** `astra specifications.pdf`
- **Current app:** `index.html` on `main`. `PLAN.md` describes it.

## Progress

- **Done:** R1 to R7 are built on this branch.
- **R8:**
  - The engine, alert and validation tests pass unchanged (108, 34 and 14 checks).
  - A new browser test passes 103 checks. It covers:
    - the top bar
    - the Data Input Hub
    - the warning flow
    - the analytics panel
    - the routine
    - both games
    - photos
    - offline sync
    - axe on the dashboard and every dialog
  - Still to do:
    - the test plan rows that change (F01, F07, F12, F15)
    - a manual screen reader pass
    - a check with speakers on
- **Fixed after the first review:**
  - A "Guidance cards" button in the hub and in the alert log. Every card, including communication disruption, can be read without an alert (spec sections 1 and 5).
  - Both tests say they are not a diagnosis (spec 2.6).
  - Readings waiting to sync are marked in the chart tables (spec 5).
  - The radiation card shows the dose rate as well as the cumulative dose (spec 2.1).
  - Focus stays close by after acknowledging an alert.
  - The brain opens on sleep hours (client example).
  - Visual: a more human astronaut figure, routine checkboxes styled as in the image, icons on the routine and hub headings, the Earth at the right edge and a tighter hub.
- **Defaults while the open questions (section 5) wait for answers:**

| Question | What the build does now | Where to change it |
|---|---|---|
| Q1 Logos | The ASTRA mark only. The logo slot takes the team logo, and the NASA logo once its use is confirmed. | `Config.brand.logos` |
| Q2 Picture input | Attach a photo, saved with the reading. The value is still typed. | Entry (13) |
| Q3 Sign before any input | A grey sign with a dash while any reading is missing or old | `Config.sign` |
| Q4 7-day renewal | The last 7 days, rolling, with one tick per day | `Config.charts` |
| Q5 Cross on the routine | Shown by itself on a task still open after its section's time slot (morning to 12:00, in-flight to 18:00, evening to 23:00). The task can still be ticked late. | `Config.routine.sections[].until` |
| Q6 Body regions | Five: Brain, Heart, Lungs, Muscles, Bones | `Config.bodyMap` |
| Q7 Oxygen chart | Inspired O₂ in mmHg, as in the spec | `Config.bodyMap` |
| Q8 Top bar | All five cabin factors, including inspired O₂ | `Config.topBar` |
| Q9 Out-of-range values | Saved, then the warning flow runs | Entry (13) |
| Q10 Memory test 10 s | About 4 to 5 s to watch the squares, then 6 s to tap them back | `Config.games.memory` |
| Q11 Caution guidance | Stays in the strip until acknowledged, like critical | Alerts (6) |
| Q12 Respiratory rate | In the dropdown, charted with no limits | `Config.dataHub` |

## 1. What the new image shows

| Area | In the image |
|---|---|
| Top bar | ASTRA logo, then four cabin cards with icons: Space Radiation, Cabin Pressure, Cabin Temperature, CO₂ Partial Pressure. Each shows a value, a unit and its safe range. A "System Health: Nominal" box with a green tick sits on the right. |
| Left sidebar | Dashboard, Health Analytics, Body Explorer, Mission Routine, Emergency Protocols, Settings & References, with the NASA logo at the bottom |
| Human Body Explorer | A glowing astronaut figure, with four call-out cards: Brain (reaction time against baseline), Heart (HR and BP), Muscles (strength % of baseline) and Bones (BMD % per month) |
| Health Analytics | Tabs for Cardiovascular, Respiratory, Neurological and Musculoskeletal. Weekly charts (Mon to Sun) for heart rate, blood pressure and oxygen saturation (SpO₂ %). |
| Daily Mission Routine | Morning Protocol ✓ 2/2, In-Flight Maintenance 0/2 and Evening Review, each with checkboxes. Then a "10-Second Reaction Time Test" button and a "Your Score: 267 ms" box. |
| Data Input Hub | "Log New Measurements": six fields in a row (heart rate, BP, sleep hours, mood score, muscle strength, bone density), Submit Data, Last Updated and View References |
| Look | Very dark navy, glowing cyan borders, glass panels, a space background with Earth, and a condensed sans font |

## 2. What the client asked for

| # | Client request |
|---|---|
| C1 | The dashboard is split into four parts. |
| C2 | The navigation labels ("Dashboard", "Health Analytics", "Body Explorer" and so on) do not appear. Only the NASA logo and the team logo are shown. |
| C3 | The top bar shows the environmental factors, as many as the spec lists, each with an icon and the spec's unit. |
| C4 | The top-bar values start blank. The team enters them. |
| C5 | The top-bar cards do not show their safe ranges. |
| C6 | System health is a sign only: green when all values are in the safe range, yellow for caution, red for critical. No "System Health Nominal" text. |
| C7 | The safe, caution and critical ranges come from the spec, for both environmental and body factors. |
| C8 | The Data Input Hub keeps that name, but becomes a dropdown of every factor in the spec, with its unit. |
| C9 | After picking a factor, the value is entered by picture or by keyboard. |
| C10 | A value in the safe range is submitted. Otherwise a caution sign shows on the dashboard for 5 seconds. After that, step-by-step guidance for that factor appears, taken from the spec. |
| C11 | A 2D human body map. It must not be labelled "Human Body Map". |
| C12 | Health analytics are not on the dashboard. They only appear after clicking a body part, as the full graph. For example, brain shows sleep hours, and heart shows blood pressure and heart rate, following the spec's mapping. |
| C13 | The daily mission routine is a checklist that follows the spec. |
| C14 | The routine ends with two games: a 10-second reaction time game, whose data builds its own graph, and a 10-second memory game. |
| C15 | Following the routine is required. A missed task gets a cross on the routine. |
| C16 | The demo data is fake, so the charts must keep every value inside the safe range. |
| C17 | Values submitted through the Data Input Hub appear on the graph. |
| C18 | The charts renew themselves every 7 days. |
| C19 | No "Your Score". The dashboard only checks whether the routine is complete, and gives guidance if health is declining or a cabin factor is out of range. |

## 3. Spec requirements that still apply

These come from `astra specifications.pdf`. The new design must keep them:

- **2.1 Top status bar:** radiation and cumulative exposure, cabin pressure, temperature, CO₂, and the overall status in green, yellow or red.
- **2.2 Warnings:**
  - When a value crosses a limit:
    - the indicator changes colour
    - a warning appears automatically, with sound
    - it shows the parameter and the value
    - it names the body system or hazard
    - the guidance card can be opened
  - Critical alerts stay visible until acknowledged.
  - Repeats are managed.
  - Mute and acknowledge are available, and muting never dismisses a critical alert.
  - Every alert is timestamped and recorded.
  - Missing or old values are identified separately, never treated as normal.
- **2.3 Body explorer:**
  - Clickable regions:
    - brain: reaction time, memory, sleep, PHQ-4
    - heart: HR, BP, inspired O₂
    - lungs: respiratory and oxygen measurements
    - musculoskeletal: muscle strength, BMD
  - Clicking a region opens a panel with history charts, current readings, baseline comparisons and relevant alerts.
- **2.4 Health analytics:** all 9 trend charts update automatically when new data arrives.
- **2.5 Daily routine:**
  - The checklist has three sections:
    - Morning protocol: health and telemetry review, BP and HR logging, hydration and electrolytes
    - In-flight maintenance: ARED exercise tracking, dosimeter status
    - Evening review: sleep, mood, cognitive assessment
  - Each task records completion and a time.
  - The exercise and hydration targets can be changed.
- **2.6 Games:**
  - Reaction test: about 10 s, a random delay, timed in ms, the average of several trials, compared with the baseline, and added to the neurological chart.
  - Memory test: accuracy and time recorded and stored.
  - Neither game is a diagnosis.
- **3 Thresholds:** already built into the engine.
- **4 Guidance:** 9 categories, each card with the 7 fields, using approved procedures only and no treatment advice.
- **5 Data entry:** the 7-step pipeline on submit, plus offline mode with clear marking of unsynced readings.
- **6 References:** a references section, with each threshold and guidance item traceable to its source.

## 4. Where the client notes, the spec and our rules disagree

Each row is a proposal. The **open questions** in section 5 settle the ones marked (Q).

| Topic | Client or image | Spec, test plan or accessibility | Proposal |
|---|---|---|---|
| Colour-only system health sign (C6) | Green, yellow or red sign, no text | The plan's standard says colour is never the only signal, and WCAG 1.4.1 says the same | Use a different shape per state: a tick in a circle, a triangle with "!", an octagon with "✕". Add text that only screen readers hear. Nothing extra is visible, so the client's look is kept. |
| Blank top-bar values (C4) | Values start empty | 2.1: values are evaluated continuously. 2.2: missing values are flagged separately | Each card shows "–" and "No reading" until a value is entered. A missing value never counts as green on its card. What the overall sign shows before any input is (Q3). |
| The overall sign with old or missing data | Three colours only | 2.2: identify missing and old data separately | Each card says "No reading" or "3 h ago". The overall sign stays three-coloured. |
| Stale age of cabin values | Values are typed in by the team | The engine marks cabin values stale after 2 h, which suits automatic telemetry | Raise the cabin stale age for typed values, for example to 24 h, in Config (team decision). |
| 5-second warning sign (C10) | The sign shows for 5 s, then guidance | 2.2: critical alerts stay until acknowledged, with sound, mute and acknowledge | The big sign shows for 5 s with sound. Then the guidance opens, with Mute and Acknowledge. A critical alert stays until acknowledged, and the red sign stays in the top bar. |
| Analytics hidden from the dashboard (C12) | Only after clicking a body part | 2.4 asks for a central analytics section | The analytics open in a panel from the body map. It has tabs for every parameter of that system, so all 9 charts can be reached in at most two clicks. |
| No score (C19) | No score anywhere | 2.6: results compared with the baseline and added to the chart. Test plan F15: "average shown in ms" | The games show "Test complete" with no number. The result is still saved and drawn on the brain graph against the baseline. A slow result raises the normal caution, and the guidance follows. F15 needs updating in the test plan (Q). |
| Charts renew every 7 days (C18) | 7 days | Test plan F12 expects about 30 days of data | Charts show 7 days. Older data stays in the database. F12 needs updating. Calendar week or rolling 7 days is (Q4). |
| Fake data inside the safe ranges (C16) | No abnormal values in the charts | The demo now starts with CO₂ and muscle strength in caution, plus past alerts | New demo history stays inside the safe ranges. Warnings are shown by entering an out-of-range value. |
| Body parts | The image shows Brain, Heart, Muscles, Bones | 2.3 requires Lungs as well | Five regions: Brain, Heart, Lungs, Muscles, Bones (Q6). |
| Oxygen chart | The image shows SpO₂ % | The spec has inspired O₂ partial pressure in mmHg, with no SpO₂ | Keep inspired O₂ (mmHg) as in the spec, unless the client wants SpO₂ added with its own ranges (Q7). |
| Radiation unit | The image shows µSv/h | The spec uses cumulative dose against a mission limit | Show the cumulative dose in mSv, as the client asked for the spec's units (C3). |
| Navigation removed (C2) | Logos only | Guidance, references, the alert log and targets must still be reachable | Single-screen dashboard with overlays: guidance opens from warnings, the system sign opens the alert log, "View References" sits in the Data Input Hub, and the targets live in the routine. |
| NASA logo (C2) | NASA logo in the top bar | NASA's rules restrict use of its insignia, and Space Apps projects normally may not use it | Build a logo slot that can hold either logo. Use the team logo and the Space Apps mark until NASA logo use is confirmed (Q1). |

## 5. Open questions for the client and team

Answers to these are needed before the steps that depend on them (shown in brackets).

1. **Logos.** Is the NASA logo allowed in this project? Please send the team logo as SVG or PNG. [R1]
2. **"Enter data by picture"** could mean two things: (a) take a photo of a device and read the number from it automatically, or (b) attach a photo and type the number. (b) is simple and works offline. (a) needs text recognition in the browser, which is large, slow to load offline and unreliable on device displays. We suggest (b) now and (a) later. [R4]
3. **System health before any input.** Green, or a neutral grey sign until the first reading? [R3]
4. **"Renews after 7 days".** A calendar week (Monday to Sunday, starting empty each Monday) or the last 7 days, rolling? [R2, R6]
5. **The cross on the routine.** Is it (a) a ✕ that appears by itself next to tasks not done in their time slot, or (b) a button to mark a task as skipped? What are the time slots for morning, in-flight and evening? [R7]
6. **Five body regions** (Brain, Heart, Lungs, Muscles, Bones): agreed? [R6]
7. **SpO₂ or inspired O₂** for the oxygen chart? [R6]
8. **Top bar.** All five environmental rows of spec section 3 (radiation, cabin pressure, temperature, CO₂, inspired O₂), or only the four named in 2.1? [R3]
9. **Out-of-range values.** Are they still saved? We assume yes, since the spec records everything, and the warning follows. [R4]
10. **"10-second" memory game.** Is the 10 s the whole game, including watching the sequence, or only the answering time? [R7]
11. **Caution guidance.** Does it stay until acknowledged, like critical, or close by itself after the steps are read? [R5]
12. **Respiratory rate.** Should it be in the dropdown? The spec charts it but gives no limits. [R4]

The earlier open decisions in `PLAN.md` still stand (proposed limits, bone density realism, alert rules, deadline, the "analysis and report" question).

## 6. New screen layout

```
+------------------------------------------------------------------------------------------------+
| [NASA][Team] | Radiation | Cabin pressure | Temperature |  CO₂   | Inspired O₂ |  (status sign) |
|              |   – mSv   |     – kPa      |    – °C     | – mmHg |   – mmHg    |  ✓ / ! / ✕     |
+-----------------------------------------------+------------------------------------------------+
|                                               | DAILY MISSION ROUTINE                          |
|   2D astronaut body map                       |  ☀ Morning protocol              ✓ 2/3         |
|   call-outs: Brain, Heart, Lungs,             |  🔧 In-flight maintenance        0/2           |
|   Muscles, Bones                              |  ☾ Evening review                0/3           |
|   (click a part: analytics panel opens)       |  [ 10-second reaction test ] [ 10-second memory ] |
+-----------------------------------------------+------------------------------------------------+
| DATA INPUT HUB   [ Select a factor ▾ ]  [ value ] unit  [ photo ]  [ Submit ]                   |
|                  Last updated 14:35 · 2 readings waiting to sync · View references             |
+------------------------------------------------------------------------------------------------+
Overlays, opened from the dashboard:
- Analytics panel: tabs per parameter, full 7-day graph, baseline, current value, alerts, table view
- Warning: big caution or critical sign for 5 s with sound, then step-by-step guidance with Mute and Acknowledge
- Game dialogs, the references, and the alert log (opened from the status sign)
```

## 7. What changes in the current app

| Module | Keep | Change | Remove or new |
|---|---|---|---|
| Config | All thresholds, units, input ranges, guidance text, routine tasks | The top-bar list (5 factors and icons), charts to 7 days, cabin stale age for typed values, routine time slots, 10-second game settings, 5 s warning time, dropdown order | New: theme colours for the neon look |
| Store | All methods and the 6 stores | Nothing | New if photos are attached (Q2): a `photos` store or a photo field, which needs database version 2 and a migration |
| DemoData | The seeded generator and the baseline | The scenario: 30 days of health history all inside the safe ranges, routine history, no past alerts | Remove: seeded cabin values and the hourly simulated telemetry feed (C4) |
| Engine | evaluate, assess, overall, and all 108 tests | Map the overall result to the three-state sign (Q3) | None |
| Alerts | Episode rules, sounds, mute, acknowledge, the record format, and the 34 tests | The banner becomes the 5-second warning sign, then hands over to the guidance. The alert log moves to a panel opened from the status sign. | None |
| Guidance | The 9 cards and 7 fields | Opens by itself after the warning sign. "Immediate approved response" becomes numbered steps. The communication card opens when the app goes offline (open item #48). | None |
| Telemetry | The status calculation and the unsynced count | New top bar: logos, 5 icon cards with blank values and units, status shown as a coloured ring per card, the shaped system sign. The unsynced count moves to the input hub. | Remove: greeting, mission-day line and safe-range text |
| BodyExplorer | Region-to-parameter mapping, status colouring, baseline text, the table view | New 2D astronaut figure with five regions and call-out cards. Clicking a region opens the analytics panel instead of the side panel. | None |
| Charts | Chart drawing, bands, baseline, tooltip, live updates | 7-day window with weekday labels and the weekly renewal (Q4) | None |
| Analytics | None | None | Remove the dashboard cards. The analytics panel replaces them. |
| Routine | Ticks with times, daily reset, targets, history | Restyled like the image (section icons, counters like "2/3"). A ✕ for missed tasks (Q5). The two game buttons sit at the end. | None |
| Games | Timing rules, the too-early and missed handling, saving, `game:finished` | Fits about 10 s each. Opens in a dialog from the routine. Shows "Test complete", with no score (C19). | Remove: the Cognitive tests view, the baseline bar and the dashboard summary card |
| Entry | Validation and the save pipeline | One factor at a time from the dropdown, with the right input (BP has two boxes), a photo option (Q2), last updated, the unsynced count and View references | Remove: the full multi-field form and the Log a reading view |
| Offline | Service worker, sync rule, tests | Also cache the logos and any background image | None |
| App, layout and CSS | Start-up order | One dashboard with overlays. No hash views. Neon theme: glow borders, glass panels, a space background drawn in CSS. Dialogs trap focus, and reduced motion is respected. | Remove: the sidebar and the four views |

## 8. Build order

Each step ends with its checks passing and a commit on `feat/be-ui-redesign`. The hours are rough estimates.

| Step | Work | Depends on | Hours |
|---|---|---|---|
| R1 | **Theme and layout.** Neon colours, glow and glass styles, the CSS space background, the four-part grid, the logo slots, an overlay component (dialog with focus trap) and removing the sidebar and views | Q1 | 6–8 |
| R2 | **Data and engine.** New all-safe demo history, no cabin seed or telemetry feed, 7-day chart window, cabin stale age for typed values, the sign mapping | Q3, Q4 | 3–4 |
| R3 | **Top bar.** Five icon cards (blank until entered, unit, status ring, "No reading" or age), the shaped system sign with hidden text, the sign opens the alert log | Q8 | 3–4 |
| R4 | **Data Input Hub.** Dropdown of factors with units, single-factor input, photo option, validation, submit pipeline, last updated, unsynced count, View references | Q2, Q9, Q12 | 4–6 (plus 6–10 if automatic photo reading is wanted) |
| R5 | **Warning flow.** Caution or critical sign for 5 s with sound, then step-by-step guidance with Mute and Acknowledge, and critical staying until acknowledged | Q11 | 4–6 |
| R6 | **Body map and analytics panel.** New 2D astronaut, five regions with call-outs, panel with tabs and full 7-day graphs, baseline, alerts and table view | Q4, Q6, Q7 | 6–10 |
| R7 | **Routine and games.** Restyled checklist with ✓ and ✕, time slots, targets, two 10-second games in dialogs with no score, results charted, routine ticked, guidance on decline | Q5, Q10 | 5–7 |
| R8 | **Testing and documents.** Update the browser tests for the new layout; keep the engine, alert and validation tests; axe scan; offline test; update `PLAN.md`, the README and the test plan rows that change (F01, F07, F12, F15) | All | 4–6 |
| | **Total** | | **35 to 51** (plus 6 to 10 for automatic photo reading) |

R2 can start straight away: the client's notes are clear that the charts stay inside the safe ranges and the top bar starts blank. R1 can start with a placeholder logo.

## 9. How we will test the redesign

- **Engine, alert and validation tests** (108, 34 and 14 checks) must keep passing unchanged. The limits do not change.
- **Browser test**, rewritten for the new layout:
  - Top bar:
    - blank at start
    - a typed value appears with its status
    - the sign shape and colour follow the worst status
  - Data Input Hub: every dropdown factor saves, and wrong values are rejected.
  - Out-of-range values:
    - the warning sign shows for 5 s, with sound
    - the guidance steps follow
    - critical stays until acknowledged
    - mute keeps it on screen
  - Charts and body map: each body region opens the right graphs, and a submitted value appears on the graph.
  - Routine and games:
    - ticks and crosses
    - both games finish in about 10 s and show no score
    - the result is charted
  - Offline: offline start, saving offline, syncing when back online.
- **Accessibility:**
  - axe WCAG 2.1 A and AA scan of the dashboard and every overlay
  - keyboard-only run through the dashboard
  - the sign checked in greyscale (test plan F32)
- **Visual check:** screenshots compared with the reference image at desktop and phone widths.

## 10. Assets needed

- The team logo (SVG preferred)
- Confirmation on the NASA logo, or the Space Apps mark to use instead
- Icons for the factors. We draw these as simple line icons in SVG, so no image files are needed.
- The space background. We draw it in CSS (stars and a gradient glow), so no photo is needed. An Earth photo would need a check of its licence.
