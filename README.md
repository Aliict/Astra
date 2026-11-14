# ASTRA — Astronaut Self-Monitoring, Tracking and Risk Assessment

**NASA Space Apps Challenge 2026**  
*An offline-first astronaut biomedical monitoring and decision-support dashboard for long-duration space missions.*

---

## Overview

**ASTRA** integrates physiological health tracking, spacecraft environmental monitoring, cognitive assessments, and pre-approved emergency response guidance into a unified web-based interface. Designed around the core operational loop:

> **MONITOR → DETECT → ALERT → INFORM → GUIDE → RECORD**

ASTRA continuously evaluates astronaut vitals and cabin telemetry against configurable safety thresholds and personal pre-flight baselines. When an anomaly occurs, it identifies the affected anatomical system or environmental hazard, triggers visual and audible alerts, and surfaces actionable emergency guidance—all while remaining fully functional during communication blackouts or offline states.

---

## Key Features

- **Top Telemetry Status Bar:** Real-time status overview for cumulative space radiation, cabin pressure ($\text{kPa}$), cabin temperature ($^\circ\text{C}$), $\text{CO}_2$ partial pressure ($\text{mmHg}$), and overall system health (**GREEN — Nominal**, **YELLOW — Caution**, **RED — Critical**).
- **Visual & Audible Warning System:** Severity-based banners, flashing indicators, Web Audio API alert tones, alert timestamping, and independent sound-mute / alert-acknowledgment controls.
- **Interactive Human Body Explorer (SVG):** Clickable anatomical regions (**Brain / Neurological**, **Heart / Cardiovascular**, **Lungs / Respiratory**, and **Musculoskeletal**) revealing system-specific readings, personal baseline comparisons, and historical trends.
- **Health Analytics & Manual Logging:** Interactive **Chart.js** graphs tracking heart rate, blood pressure, $\text{O}_2$ levels, sleep duration, PHQ-4 mood scores, muscle strength retention, and bone mineral density (BMD) changes.
- **Cognitive Assessment Mini-Games:**
  - *Reaction Time Test (~10s):* Multi-trial visual stimulus test measuring response latency in milliseconds against personal baselines.
  - *Memory & Attention Test:* Visual pattern/sequence recall test recording accuracy and completion time.
- **Emergency Guidance Cards:** Step-by-step response checklists, monitoring protocols, and mission medical escalation criteria across 9 hazard/biomedical categories.
- **Daily Mission Routine Tracker:** Structured checklists for *Morning Protocol*, *In-Flight Maintenance* (ARED exercise & dosimeter checks), and *Evening Review* with completion timestamps.
- **Offline-First Architecture:** Local data persistence via **IndexedDB** and offline caching via **PWA / Service Worker**, flagging unsynchronized records until connectivity resumes.

---

## Technology Stack

| Component | Technology |
| :--- | :--- |
| **Structure** | HTML5 (Single-file `index.html` initial prototype) |
| **Styling** | Tailwind CSS / CSS3 |
| **Logic & Audio** | Vanilla JavaScript (ES6+), Web Audio API |
| **Data Visualization** | Chart.js |
| **Anatomical UI** | Interactive Inline SVG |
| **Local Storage & Offline** | IndexedDB, Service Worker (PWA) |

---

## Operational Threshold Matrix (Prototype Demonstration)

| Hazard / System | Parameter | Safe (Green) | Caution (Yellow) | Critical (Red) |
| :--- | :--- | :--- | :--- | :--- |
| **Radiation** | Cumulative dose | Below mission limit | Elevated exposure | Critical exposure condition |
| **Environment** | Cabin pressure | $97.9\text{–}102.7\text{ kPa}$ | Outside nominal | Pressure envelope breached |
| **Environment** | $\text{CO}_2$ partial pressure | $< 2.5\text{ mmHg}$ | $2.5\text{–}3.0\text{ mmHg}$ | $> 3.0\text{ mmHg}$ |
| **Environment** | Inspired $\text{O}_2$ | $145\text{–}155\text{ mmHg}$ | $127\text{–}144\text{ mmHg}$ | $< 122\text{ mmHg}$ |
| **Environment** | Temperature | $18\text{–}27^\circ\text{C}$ | Outside comfort range | Outside approved thermal limits |
| **Cardiovascular** | Heart rate | $60\text{–}100\text{ bpm}$ | $41\text{–}59$ or $101\text{–}130\text{ bpm}$ | $< 41$ or $> 130\text{ bpm}$ |
| **Cardiovascular** | Blood pressure | $< 120/80\text{ mmHg}$ | Elevated readings | Systolic $\ge 180$ or Diastolic $\ge 120\text{ mmHg}$ |
| **Musculoskeletal** | Muscle strength | $90\text{–}100\%$ baseline | $80\text{–}89\%$ baseline | $< 80\%$ baseline |
| **Musculoskeletal** | Bone Mineral Density | Stable | Decline of $0.3\text{–}0.8\%/\text{month}$ | Decline $> 0.8\%/\text{month}$ |
| **Behavioral** | Sleep duration | $7\text{–}9\text{ hours}$ | $5\text{–}6.9\text{ hours}$ | $< 5\text{ hours}$ |
| **Behavioral** | PHQ-4 mood score | $0\text{–}2$ | $3\text{–}8$ | $9\text{–}12$ |
| **Neurological** | Reaction time | Within $1\text{ SD}$ baseline | $1\text{–}2\text{ SD}$ decline | $> 2\text{ SD}$ decline |

---# Astra


## Development

This section is for the people building ASTRA. It covers how to run the prototype, how the code is organised, the rules it follows and the limits the team still needs to confirm. Progress is tracked in [PLAN.md](PLAN.md).

### Run it

Open `index.html` through a local server, not by double-clicking it. The offline mode (phase 11) only works on localhost or HTTPS.

```
npx serve .
```

You can also use the VS Code Live Server extension. On first load the app creates the database and 30 days of demo health history, all inside the safe ranges, plus one current nominal reading for each cabin value. Entering an out-of-range value shows the warning flow.

### Check the engine and the alerts

Open the browser console and run:

```
runEngineTests()
runAlertTests()
runValidationTests()
```

Each prints a table and a summary.

`runEngineTests()` has 108 checks:

- **T01 to T73**: every threshold test in `ASTRA_Test_Plan.xlsx`. T32 and T38 are each checked at two values.
- **X01 to X33**: the edges of the proposed rules below, odd input such as text or a half-filled blood pressure, and how stale readings and missing readings affect the overall status.

`runAlertTests()` has 34 checks:

- **A01 to A22**: repeat control (F06), what happens when a reading gets worse or goes back in range, and the alert record.
- **A23 to A32**: the banner wording.

Sound, mute and acknowledge on the page (F02 to F05) need a check by hand, with speakers on.

`runValidationTests()` checks the 11 data-entry validation cases from the test plan, plus 3 edge cases.

Offline mode:

- The app registers a service worker on localhost or HTTPS. It stores the app, Tailwind CSS, Chart.js and the fonts, so the app starts with no connection.
- Every new reading is saved as unsynced.
- While online, a new reading is synced straight away.
- Readings saved offline stay unsynced until the connection returns. The hub shows how many are waiting, and the chart tables mark each one.
- The sync is simulated; there is no server.

### Files

| File | What it is | Status |
|---|---|---|
| `index.html` | The whole app: page, styles and all JavaScript modules | Phases 1 to 12, redesigned for the new UI reference |
| `REDESIGN_PLAN.md` | The UI redesign: client requests, conflicts with the spec, open questions, build steps | R1 to R7 built, R8 under way |
| `PLAN.md` | What is done, what is left, test status and open decisions | Updated each phase |
| `sw.js` | Service worker for offline use | Done |
| `manifest.json` | PWA name, icon and colours | Done |
| `icon-512.png` | App icon | Done |

### Inside index.html

There are two script blocks.

**`astra-core`** holds the data and the logic. It only touches the page or the speakers when a module's start-up or drawing code runs, so the rules can be tested on their own:

1. **Config**: thresholds, units, input ranges, stale ages, the top bar cards, the body map regions, the status sign shapes, the Data Input Hub list, routine time slots, game timings and demo settings. No other module contains limits of its own.
2. **Bus**: the event system (`Bus.on`, `Bus.emit`).
3. **Store**: all IndexedDB access. The database `astraDB` has 6 stores: measurements, alerts, baseline, cognitive, routine and settings. A photo attached to a reading is saved on that reading.
4. **DemoData**: the baseline, 30 days of health readings (one a day, all inside the safe ranges), game results and the routine history. It also adds one current nominal reading for each cabin value, so the telemetry bar is populated without simulating a telemetry feed. A stored demo from an older version of the app is replaced on the next load.
5. **Engine**: `evaluate()`, `assess()` (adds the age check) and `overall()`.
6. **Alerts**: the open-alert strip under the top bar, the sounds (Web Audio, no sound files), mute, acknowledge, repeat control and the alert log.
7. **Guidance**: the 9 guidance cards with the 7 fields of spec section 4, with the response fields as numbered steps. They open in a dialog from the "Guidance cards" button (no alert needed, so they can be read offline at any time) and from an alert. The warning flow shows the same card.
8. **Validation**: the input checks for the Data Input Hub.

The core script also holds the formatting helpers (including the shaped status sign) and the three test functions.

**`astra-ui`** holds the interface. The dashboard is one screen in four parts (top bar, body map, routine, Data Input Hub). Everything else opens in a modal dialog.

- **Dialog**: opens and closes the dialogs. The page behind is inert, Esc closes, and focus goes back to the control that opened the dialog.
- **TopBar**: the logo slots, one card per cabin value and the system health sign. The sign shows a shape and a colour only: a tick in a green circle, "!" in a yellow triangle, "✕" in a red octagon, or a grey dash while readings are missing or old. Its words are for screen readers. It opens the alert log and the status table of every parameter. The radiation card also shows the dose rate between its last two readings, as spec 2.1 asks for radiation and cumulative exposure.
- **Warning**: a new alert shows a big caution or critical sign with the value for 5 seconds, then the step-by-step guidance card with Mute and Acknowledge. Closing it does not acknowledge the alert.
- **BodyMap**: the 2D astronaut with 5 regions (brain, heart, lungs, muscles, bones) and a card per region with its latest readings. A region turns amber or red when one of its readings is abnormal. A missing reading is named on the card.
- **Charts**: every Chart.js chart, 7 days with one tick per day. It draws:
  - the green safe band
  - the dotted baseline
  - amber dashed caution lines
  - the latest value at the end of the line
  - a vertical line and tooltip on hover

  New readings are added to their chart without a redraw.
- **Analytics**: the analytics panel, opened from a body region. One tab per parameter, with the current value, the baseline comparison, the 7-day chart, a table view and recent alerts. The table shows any photo saved with a reading and marks readings still waiting to sync. The brain opens on sleep hours.
- **Routine**: the daily checklist (spec 2.5).
  - Each tick is saved with its time.
  - A task still open after its section's time slot gets a cross. It can still be ticked late.
  - ARED minutes count against the exercise target.
  - The exercise and hydration targets are set in the Targets form.
  - The list starts fresh each day, and earlier days are kept.
- **Games**: the 10-second reaction and memory tests (spec 2.6), each in a dialog opened from the routine.
  - No score is shown. Each dialog says the test tracks changes over time and is not a diagnosis.
  - Results are saved through Store first, then `game:finished` is sent.
  - The reaction average is also saved as a reading, so the engine, charts and alerts pick it up. A slow result raises the normal caution and its guidance.
  - The Routine ticks its Cognitive test task, and the brain panel charts the memory result.
- **Entry**: the Data Input Hub. A dropdown of every factor with its unit, one input (two for blood pressure), an optional photo, the last update time and the sync status. Each saved reading goes through the same path as any other reading.
- **Offline**: registers the service worker and marks unsynced readings as synced whenever the app is online.
- **App**: start-up.

Modules never call each other directly. A saved reading flows like this:

`Store.save()` → `reading:saved` → `Engine` re-checks it → `status:changed` → the top bar, body map and analytics panel update. Alerts raises, updates or clears an alert at the same moment, and a new alert starts the warning flow.

### Engine rules

- Each parameter is checked against its critical limits first, then its caution limits, so the worst match wins.
- An old reading that was NOMINAL becomes **STALE**.
- An old reading that was CAUTION or CRITICAL keeps that status, so a problem is never hidden because the reading is old.
- A parameter with no reading at all shows **NO DATA**.
- Overall status order: CRITICAL > CAUTION > STALE > NO DATA > NOMINAL.
- Respiratory rate has no limits in the spec. It shows as **TRACKED** and never changes the overall status.

### Alert rules

- **Start monitoring.** Browsers block sound until the first click, so a "Start monitoring" box opens on every load. "Continue without sound" leaves a "Sound off" button next to the system health sign to turn it on later.
- **Tones.**
  - Caution plays one short 660 Hz beep.
  - Critical plays three rising beeps, repeated every 5 s until the alert is acknowledged or muted.
- **Repeat control works per episode.**
  - An episode starts when a parameter moves into CAUTION or CRITICAL. It ends when the parameter moves back below that level.
  - During an episode, new readings at the same level update the alert's value. They do not raise a new alert or play the tone again, even after the alert has been acknowledged. So entering CO₂ again while it is still high does not beep or warn again.
  - Moving up from CAUTION to CRITICAL raises a new alert.
- **The warning flow.**
  - A new alert opens the warning dialog: the caution or critical sign with the parameter, the value and the reason for 5 seconds, then the guidance steps for that alert. "Show the steps now" skips the wait.
  - A critical alert raised while a caution warning is on screen replaces it. The caution warning comes back after it.
- **Resolved alerts.**
  - When a reading returns to a safe status, its open alert and any queued warning close automatically. The alert remains in the log with its resolution time and value.
- **Mute and acknowledge.**
  - Mute only stops the sound.
  - Acknowledge closes the alert and saves the time. It also closes any open alert for the same parameter at a lower level.
- **Not alerts.** STALE and NO DATA show as statuses but never raise an alert or a sound.

### Decisions the team needs to confirm

The spec leaves these values open. The engine uses the proposals below. All of them are in `Config` and can be changed in one place.

| Item | Proposed rule | Why |
|---|---|---|
| Inspired O₂ 122 to 126 mmHg (T24) | CAUTION | The spec only calls values below 122 critical. |
| Inspired O₂ above 155 mmHg (T26) | CAUTION | Outside the safe range. The spec has no upper critical limit. |
| Sleep over 9 h (T57) | CAUTION | Outside the 7–9 h safe range. |
| Cabin pressure critical (T32) | Below 96.5 or above 103 kPa | To confirm against NASA-STD-3001. |
| Cabin temperature critical (T38) | Below 15 or above 30 °C | Demo values. No source found yet. |
| Radiation (T39 to T41) | Mission limit 600 mSv. CAUTION from 75% of the limit, CRITICAL at 100%. | 600 mSv is the NASA career limit. The percentages are demo values. |
| Muscle strength over 100% (V09) | Accepted up to 130%, NOMINAL | Strength can rise above the pre-flight baseline. |
| Stale ages | Cabin readings, radiation, heart rate, BP and respiratory rate 24 h. Sleep and PHQ-4 36 h. Reaction time 48 h. Muscle strength 14 days. Bone density 45 days. | Based on how often each one is measured. Cabin values are typed in by the crew, so they count for 24 h. |

Three alert rules are also proposals, because the spec leaves them open:

- **Repeats.** One alert per episode, as described above. The plan only says a repeat of an open, unacknowledged alert updates its value.
- **Caution alerts.** These stay visible until acknowledged unless the reading returns to a safe status. The spec only requires critical alerts to remain visible.
- **Open alerts after a reload.** These play their tone once when monitoring starts.

Two more points to review:

- **Bone density limits.** Real crews often lose about 1% a month in flight. With the spec's limits, CAUTION from a 0.3% decline and CRITICAL above 0.8%, most real crews would show red.
- **Low blood pressure.** The spec has no low blood pressure limit, so low readings show as NOMINAL.

### Prototype decisions for gaps in the specification

These rules are recorded so prototype test results remain reproducible. They come from the ASTRA specification, section 3, where the ranges leave the listed cases undefined. They are not operational medical limits.

| Gap | Rule used in ASTRA | Source / basis |
|---|---|---|
| Inspired O₂ 122–126 mmHg | CAUTION | ASTRA specification section 3 lists CAUTION from 127–144 mmHg and CRITICAL below 122 mmHg; the prototype treats the uncovered interval as caution. |
| Inspired O₂ above 155 mmHg | CAUTION | ASTRA specification section 3 defines 145–155 mmHg as safe and gives no upper critical threshold. |
| Sleep above 9 hours | CAUTION | ASTRA specification section 3 defines 7–9 hours as safe and gives no upper critical threshold. |
| Radiation dose | NOMINAL below 75% of 600 mSv; CAUTION at 75%; CRITICAL at 600 mSv | ASTRA specification section 3 requires a configured mission limit. The 600 mSv prototype limit is the project’s documented NASA career-limit demonstration value; mission-specific limits still require verification against the applicable NASA standard. |

### Progress

Phases 1 to 12 of 13 are done, with a few open items, and the interface has been rebuilt for the new UI reference image ([REDESIGN_PLAN.md](REDESIGN_PLAN.md)). [PLAN.md](PLAN.md) lists what is done, what is left phase by phase, the test plan status and the decisions the team still needs to make. Final speaker checks, browser evidence, the demo video and the submission are still to do in phase 13.
