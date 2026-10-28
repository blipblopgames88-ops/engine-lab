// Use one scale for the labels, fill, and accessible meter bounds.
export function rpmMeter(rpm, limit) {
  const maximum = Number.isFinite(limit) && limit > 0 ? limit : 7000;
  const value = Number.isFinite(rpm) ? Math.max(0, rpm) : 0;
  return {
    maximum,
    value,
    percent: Math.min(100, value / maximum * 100),
    ticks: [0, .25, .5, .75, 1].map(fraction => Math.round(maximum * fraction)),
    nearLimit: value > maximum * .92,
  };
}
