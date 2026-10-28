# Engine Lab: realism first

Priority: improve the audible engine behavior before investing in 3D. Keep the current 2D workbench for this phase. This is a proposed roadmap; only the RPM meter fix below is implemented in this update.

## Shipped correction: truthful RPM meter

Labels now span zero to the configured rev limit, at quarter intervals. Fill and labels use the same calculation. At a 12,000 RPM limit, labels read 0 / 3,000 / 6,000 / 9,000 / 12,000; 6,000 RPM is halfway. At a 14,000 RPM limit, 12,000 RPM is 85.7% across. Changing presets or importing a build also updates the scale.

## Findings from the current source

- The exhaust pulse includes per-sample random noise, plus another random airflow term added directly to the exhaust output. Both remain when intake presence is zero. The intake slider only controls a parallel high-pass copy of this already mixed signal; it does not isolate a separate intake source.
- Combustion variation currently randomizes event amplitude. It does not model combustion pressure, burn duration, or event timing. Increasing it makes the pulse train less periodic, which can increase the perceived roughness/noise.
- Each combustion event is a damped sinusoidal sound at a frequency derived from displacement per cylinder. Overlapping many similar ringing pulses is a plausible contributor to the V12's smooth, vacuum-like character. This needs listening comparisons, not a claim of measured causality.
- V-twin timing applies only to two cylinders. Cross-plane bank routing applies only to eight cylinders. Other combinations silently use even timing, despite the selected label.
- The limiter randomly removes 65% of events near redline at full throttle. That is another likely source of broadband roughness during high-RPM testing.
- RPM follows a target-speed smoothing equation rather than torque divided by inertia. Displacement changes timbre, not simulated torque. Exhaust length is a delay and one resonance filter; there is no pipe network or gas-flow solver.

## 1. Separate and diagnose the sound paths

Create independent combustion/exhaust, intake, mechanical, and optional custom-sample paths. Give each a solo/mute control for diagnosis. Remove unconditional wind/noise from the exhaust path. Drive any turbulence from a bounded airflow approximation and keep it on its own controllable path. Make combustion variation affect documented event parameters rather than acting as a substitute for airflow.

Acceptance: intake at zero produces zero signal from the intake bus; with intake, mechanical and custom layers muted, exhaust remains audible. Variation sweeps do not add a separate wind bed. Record matched-volume A/B clips at idle, half throttle and high RPM. Do not certify these as realistic based only on numeric tests.

## 2. Correct firing schedules and engine identity

Represent every cylinder with a firing angle over 720 degrees, cylinder index, bank, and exhaust branch. Generate both sound and cylinder flashes from this schedule. Support validated inline-four, cross-plane V8, even-fire V12 and V-twin templates. Hide or explain incompatible pattern/layout combinations. Then expose an advanced firing-angle editor with interval validation and a preview of the complete cycle.

Acceptance: a four-stroke even-fire V12 has 12 events per 720 degrees, spaced 60 degrees apart. At 12,000 RPM that is 1,200 combustion events per second. Deliberate uneven patterns change the event intervals, not merely the mix or pitch. Scheduled events and displayed firing frequency agree.

## 3. Make engine controls change physical behavior

Start with bore, stroke, cylinder count, compression ratio, rod length, flywheel inertia and external load. Derive displacement from bore and stroke. Introduce crankshaft angular velocity driven by combustion torque, friction/pumping losses and load. Add a simple cylinder pressure-versus-crank-angle model with documented assumptions, then intake/exhaust valve timing and burn duration. Add a hysteretic or timed limiter with explicit spark/fuel-cut behavior instead of random event deletion.

Acceptance: heavier flywheels slow transient response without changing the firing schedule; increased load changes RPM response at the same throttle; changing bore/stroke updates displacement consistently. A cranking/idle controller avoids an arbitrary automatic target RPM. Check energy/stability and audio continuity before exposing more controls. This remains an approximate model until calibrated.

## 4. Build the exhaust as an acoustic network

Model cylinder runners, banks, collectors and tailpipes as separate acoustic branches. Expose runner length/diameter, collector geometry, pipe length/diameter and muffler settings. Introduce waveguide propagation, reflections, losses and temperature-dependent wave speed in stages. Keep pressure/flow calculations and acoustic approximations clearly identified.

Acceptance: changing one bank's runner lengths changes that branch's timing/resonance; matched V12 runs retain a distinct harmonic signature across RPM. Test numerical stability, clipping and performance at maximum cylinder count and rev limit. Use oversampling or band-limiting where high-frequency generation actually needs it, with measured CPU cost.

## 5. Calibrate against reference recordings

Use recordings we have permission to analyze, with known engine layout, RPM, microphone position and approximate load where possible. Compare idle, steady RPM, acceleration and overrun at matched loudness. Compare firing-order harmonics, spectral envelope, transient response and audible character. Keep reference profiles and listening notes with each preset. Distinguish free-revving recordings from loaded dyno/road recordings.

Acceptance: repeatable A/B comparisons for at least an inline-four, cross-plane V8 and even-fire V12; documented improvements and remaining mismatches. Automated checks catch regressions but do not replace listening tests. Do not promise equivalence to AngeTheGreat's simulator without evidence.

## 6. Add 3D and physical pipe layout later

Render the same cylinder, crank and pipe definitions used by the simulation. Start with a cutaway engine, crankshaft and pistons; then selectable runners, collectors and pipes. A pipe edit updates the acoustic model instead of just the mesh. Add listener position and spatial audio only after the source sound is credible.

Acceptance: 2D and 3D views of the same build produce the same non-spatial source audio. Pipe dimensions in the viewport match simulation inputs. Rendering never controls the audio clock.

## Suggested next implementation slice

Implement stages 1 and 2 together: independent audio buses, diagnostic solo controls, a validated V12 schedule, and deterministic baseline sound comparisons. Keep thermodynamics, advanced pipe editing and 3D out of that first slice so we can hear whether the core sound is improving.
