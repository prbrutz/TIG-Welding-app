# TIG Console

A single-page reference app for TIG (GTAW) welding parameters. Pick an alloy and a thickness and it returns a complete starting setup — filler rod, tungsten electrode, shielding gas, cup size, polarity, and amperage range — plus an interactive pulse module with a live waveform and AC balance/frequency controls for aluminum and magnesium.

**[Open the app](https://yourusername.github.io/tig-console/)**

## What it covers

- Filler rod and diameter, matched to alloy and thickness
- Tungsten electrode type, diameter, and polarity
- Shielding gas type and flow rate
- Cup/nozzle size and gas lens recommendation
- Tungsten stickout, grind shape, and post-flow time
- Amperage range, with joint-type and multi-pass adjustments
- Pulse mode: peak/background current, frequency, peak-time %, with a live oscilloscope-style waveform and real-time average current
- AC balance (EN/EP) and AC frequency for aluminum and magnesium
- A built-in guide on when pulsing helps and when it doesn't
- Save and reload your own setups, stored locally in your browser

Twelve alloys are covered: mild steel, 4130/4140 chromoly, 304/316 and 410/430 stainless, 6061/6063 and 5052/5083 aluminum, cast aluminum, magnesium AZ31, pure copper, silicon bronze, titanium, and Inconel 625/718.

## Using it

No installation or account needed — it's a single static HTML file. Open the link above in any browser, on desktop or mobile. On a phone, add it to your home screen for app-like access.

## A note on the numbers

These are general starting points meant to get you in the right range quickly, not a substitute for your machine's own parameter chart, a qualified WPS, or material certs. Always verify against your specific job, and run a test coupon when it matters.

## Tech

Single HTML file — vanilla JavaScript, no build step, no dependencies, no external API calls. Saved setups use the browser's local storage, so they stay on your device.
