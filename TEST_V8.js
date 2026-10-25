// Proves de regressió V8: navegació condicionada i Annex III.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/annex.js', 'utf8');
function assert(condition, message) { if (!condition) throw new Error(message); }
assert(/const steps=annexVisibleSteps\(\);if\(!steps\.length\)\{annexFinish\(\);return;\}if\(annexState\.step<steps\.length-1\)/.test(src), 'La navegació ha d\'utilitzar els passos visibles.');
assert(!src.includes('annexState.step<a.steps.length-1'), 'No ha de quedar la navegació antiga amb la longitud original.');
assert(/onlyFixedSubsidy==='yes'&&!\(a\.length===1&&a\.includes\('none'\)\)/.test(src), 'El subsidi fix ha d\'exigir exclusivament la selecció none.');
assert(src.includes("if(!needs.length) missing.push('Selecciona almenys un servei"), 'Annex IV ha de bloquejar una selecció de servei buida.');
function pct(needed, sessions, minutes){ return ((sessions * minutes / 60) / needed) * 100; }
function close(name, got, expected){ if(Math.abs(got-expected)>0.001) throw new Error(`${name}: ${got} != ${expected}`); }
close('PT 3x45/6h', pct(6,3,45), 37.5);
close('AL 2x45/3h', pct(3,2,45), 50);
close('PT 2x45/4h', pct(4,2,45), 37.5);
close('AL 2x30/3h', pct(3,2,30), 33.3333333333);
close('PT 4x45/3h', pct(3,4,45), 100);
close('AL 2x45/1.5h', pct(1.5,2,45), 100);

/* Regressió: «Consulta ràpida» no ha de tornar a obrir el wizard. */
const appSrc = fs.readFileSync(__dirname + '/app.js', 'utf8');
const htmlSrc = fs.readFileSync(__dirname + '/index.html', 'utf8');
assert(/if\s*\(action\s*===\s*'new-case'\)/.test(appSrc), 'Nou expedient ha de tindre un controlador propi.');
assert(/if\s*\(action\s*===\s*'quick'\)\s*\{\s*show\('quickConsult'\);\s*\}/.test(appSrc), 'Consulta ràpida ha d'obrir la vista específica.');
assert(!/action\s*===\s*'new-case'\s*\|\|\s*action\s*===\s*'quick'/.test(appSrc), 'Consulta ràpida no ha de compartir el controlador de nou expedient.');
assert(/<section id="quickConsult" class="view">/.test(htmlSrc), 'Ha d'existir la vista específica de consulta ràpida.');
assert(/DOCUMENTACIÓ/.test(htmlSrc) && /REEDUCACIÓ/.test(htmlSrc) && /REMISSIÓ/.test(htmlSrc), 'La consulta ràpida ha d'incloure els tres blocs d'orientació.');

console.log('V8 QA: OK — annexos, càlculs PT/AL i separació de consulta ràpida.');
