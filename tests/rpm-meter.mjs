import assert from 'node:assert/strict';
import { rpmMeter } from '../dist/rpm-meter.mjs';

for (const limit of [3000, 7000, 12000, 14000]) {
  for (const fraction of [0, .25, .5, .75, 1]) {
    const meter = rpmMeter(limit * fraction, limit);
    assert.equal(meter.percent, fraction * 100);
    assert.equal(meter.ticks[fraction * 4], Math.round(limit * fraction));
    assert.equal(meter.maximum, limit);
  }
}
assert.equal(rpmMeter(12000, 14000).percent, 12000 / 14000 * 100);
assert.equal(rpmMeter(12000, 12000).percent, 100);
assert.equal(rpmMeter(15000, 14000).percent, 100);
assert.equal(rpmMeter(-100, 7000).percent, 0);
assert.equal(rpmMeter(NaN, 7000).percent, 0);
assert.deepEqual(rpmMeter(0, 12000).ticks, [0, 3000, 6000, 9000, 12000]);
console.log('RPM labels and fill agree at 3,000–14,000 RPM limits.');
