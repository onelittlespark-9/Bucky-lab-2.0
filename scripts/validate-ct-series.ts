import assert from 'node:assert/strict';
import { CT_PROTOCOLS } from '../src/core/ct-protocols';
import { CT_SERIES, resolveCtSeries, assertDedicatedCtSeries } from '../src/core/ct-series';

for (const protocol of CT_PROTOCOLS) {
  for (const phase of protocol.contrast) {
    assert.equal(resolveCtSeries('female', protocol, phase), null,
      `${protocol.id}: female source-wide anatomy must not substitute for dedicated coverage`);
    const series = resolveCtSeries('male', protocol, phase);
    if (series) {
      assert.equal(assertDedicatedCtSeries(series, protocol), series);
      assert.equal(series.region, protocol.region);
      assert.equal(series.phase, phase);
    }
  }
}
const head = CT_PROTOCOLS.find(p => p.id === 'head-nc')!;
assert.ok(resolveCtSeries('male', head, 'none'), 'Dedicated male head remains available');
assert.equal(resolveCtSeries('male', head, 'portal-venous'), null,
  'A non-contrast protocol must reject an enhanced phase');
assert.throws(() => assertDedicatedCtSeries(CT_SERIES.find(s => s.sex === 'female')!, head));
assert.throws(() => assertDedicatedCtSeries(CT_SERIES.find(s => s.region === 'chest')!, head));
console.log('Validated CT protocol/phase matching and rejection of whole-body substitutes.');
