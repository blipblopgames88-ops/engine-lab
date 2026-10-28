# Engine Lab

A browser engine audio workshop inspired by the idea of designing sound through engine parameters. An original implementation; no AngeTheGreat engine-sim code or assets are included.

## Run

Serve `dist/` over HTTP or HTTPS. For example: `npx --yes http-server dist`. Audio starts with the Start engine button. Hold Space to rev while no form control is focused.

## Features

- AudioWorklet synthesis of individual four-stroke combustion events at the audio sample rate.
- Even firing, cross-plane V8 bank routing, and 315°/405° V-twin timing.
- RPM acceleration/deceleration affected by flywheel inertia, idle and rev limits.
- Exhaust delay feedback, resonant coloration, muffling, intake presence and per-event variation.
- User audio import with RPM-dependent pitch, JSON build import/export and browser-local parameter persistence.
- Stereo recording through MediaRecorder; animated cylinders and output waveform.

## Accuracy

This is an experimental physically informed synthesizer, not a thermodynamic engine solver. The RPM response is a simplified first-order model. It does not solve cylinder pressures, gas flow, valve timing, torque curves or temperature. Exhaust length controls an approximate acoustic delay/resonance. Intake is a filtered layer of the procedural signal. The rev limiter probabilistically cuts events near the configured limit. It has not been calibrated against real engine recordings. Displacement changes pulse timbre, not calculated torque. Imported audio is a loop, not cylinder-resolved sample synthesis. No claim of matching AngeTheGreat's simulator is made.

Build files store settings only; imported sound files must be reloaded. Recordings use the format supported by the browser. Audio files remain local. Google Fonts is the only external UI resource and system fonts provide a fallback.

## Contributions

Commit actual working improvements with descriptive messages. Do not generate empty commits or alter timestamps to manufacture contribution activity. GitHub contribution attribution depends on the author email, repository visibility and branch eligibility.

## Next realism milestones

Measured reference comparisons, a crankshaft torque/inertia solver, valve events, cylinder pressure integration, and waveguide exhaust branches with bank-specific manifolds.
