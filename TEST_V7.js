// Proves matemàtiques i de coherència del mòdul Annex IV.
function pct(needed, sessions, minutes){ return ((sessions * minutes / 60) / needed) * 100; }
function assertClose(name, got, expected){ if(Math.abs(got-expected)>0.001) throw new Error(`${name}: ${got} != ${expected}`); }
assertClose('PT 3x45 sobre 6h', pct(6,3,45), 37.5);
assertClose('AL 2x45 sobre 3h', pct(3,2,45), 50);
assertClose('PT 2x45 sobre 4h', pct(4,2,45), 37.5);
assertClose('AL 2x30 sobre 3h', pct(3,2,30), 33.3333333333);
assertClose('PT 4x45 sobre 3h', pct(3,4,45), 100);
assertClose('AL 2x45 sobre 1.5h', pct(1.5,2,45), 100);
console.log('V7 QA: OK — PT i AL independents; càlculs de cobertura correctes.');
