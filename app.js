const state={step:1,total:7,data:{}};
const steps=[
 {title:'1. Identificació del supòsit',render:renderStep1,validate:()=>!!state.data.category},
 {title:'2. Escolarització i edat',render:renderStep2,validate:()=>!!state.data.stage&&!!state.data.age},
 {title:'3. Acreditació de la necessitat',render:renderStep3,validate:()=>!!state.data.evidence},
 {title:'4. Situació del centre i serveis',render:renderStep4,validate:()=>state.data.publicCoverage!==undefined},
 {title:'5. Reeducació / altes capacitats',render:renderStep5,validate:()=>state.data.reeducation!==undefined&&state.data.highAbilities!==undefined},
 {title:'6. Compatibilitats i documentació',render:renderStep6,validate:()=>state.data.generalScholarship!==undefined&&state.data.familyLarge!==undefined},
 {title:'7. Revisió final',render:renderStep7,validate:()=>true}
];

function show(id){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function opt(name,value,label,help=''){const selected=state.data[name]===value?' selected':'';return `<button class="option${selected}" data-field="${name}" data-value="${value}"><strong>${label}</strong>${help?`<small>${help}</small>`:''}</button>`}
function bindOptions(){document.querySelectorAll('.option[data-field]').forEach(b=>b.onclick=()=>{state.data[b.dataset.field]=b.dataset.value;renderCurrent()});}
function renderCurrent(){const s=steps[state.step-1];document.getElementById('stepTitle').textContent=s.title;document.getElementById('stepCurrent').textContent=state.step;document.getElementById('stepTotal').textContent=state.total;document.getElementById('progressBar').style.width=`${state.step/state.total*100}%`;document.getElementById('stepContent').innerHTML=s.render();document.getElementById('prevBtn').disabled=state.step===1;document.getElementById('nextBtn').textContent=state.step===state.total?'Generar revisió →':'Continuar →';bindOptions();bindFields();}
function bindFields(){document.querySelectorAll('[data-input]').forEach(el=>{el.value=state.data[el.dataset.input]??'';el.oninput=()=>state.data[el.dataset.input]=el.value});}
function renderStep1(){return `<div class="question-title">Quin és el supòsit NESE/NEAE que estàs revisant?</div><div class="question-help">Selecciona la tipologia que consta acreditada. No uses una sospita o un diagnòstic pendent com si fora acreditació vàlida.</div><div class="option-grid">
${opt('category','disability','Discapacitat ≥25 %','Associada a necessitat específica de suport educatiu.')}
${opt('category','conduct','Trastorn greu de conducta','En el supòsit exigit per la convocatòria.')}
${opt('category','communication','Trastorn greu de comunicació/llenguatge','Associat a NEE segons la convocatòria.')}
${opt('category','tea','TEA','Supòsit específic de TEA.')}
${opt('category','adhd','TDAH','Requereix comprovar l’associació exigida; TDAH per si sol no basta.')}
${opt('category','high','Altes capacitats','Supòsit específic d’alta capacitat intel·lectual.')}
</div>`}
function renderStep2(){return `<div class="question-title">Compleix els requisits bàsics d’edat i escolarització?</div><div class="question-help">La pantalla serveix per a detectar incompatibilitats evidents abans d’entrar en els annexos.</div><div class="field-grid"><div class="field"><label>Edat a 31/12/2025</label><input data-input="age" type="number" min="0" max="30" placeholder="Ex. 8"></div><div class="field"><label>Etapa</label><select data-input="stage"><option value="">Selecciona…</option><option>Educació Infantil</option><option>Educació Primària</option><option>ESO</option><option>CFGB</option><option>Altres ensenyaments admesos</option></select></div></div><div class="notice info"><strong>Recordatori:</strong> les instruccions territorials indiquen requisits específics segons tipologia. En aquest MVP, els casos complexos es marquen per a comprovació, no es resolen per inferència.</div>`}
function renderStep3(){return `<div class="question-title">Quina acreditació tens disponible?</div><div class="question-help">Indica el nivell documental que realment consta en l’expedient.</div><div class="option-grid">
${opt('evidence','valid','Acreditació vàlida i disponible','Certificat/informe exigible segons el supòsit.')}
${opt('evidence','valid_old','Informe vigent però no actualitzat','Cal diferenciar vigència d’actualització; revisar si continua sustentant la necessitat.')}
${opt('evidence','pending','Diagnòstic o certificat pendent','No s’ha de tractar com a acreditació definitiva.')}
${opt('evidence','missing','No consta documentació suficient','El cas queda bloquejat fins a comprovar la documentació.')}
</div>`}
function renderStep4(){return `<div class="question-title">Hi ha cobertura pública o del centre per al concepte que vols proposar?</div><div class="question-help">Les instruccions indiquen que determinats conceptes no es concedeixen quan ja estan coberts per serveis/fons públics o ajudes al centre.</div><div class="option-grid">
${opt('publicCoverage','no','No consta cobertura pública/del centre')}
${opt('publicCoverage','yes','Sí, està cobert','No proposar automàticament l’ajuda corresponent.')}
${opt('publicCoverage','unknown','No ho sé encara','El motor ho marcarà com “CAL COMPROVAR”.')}
</div>`}
function renderStep5(){return `<div class="question-title">Cal valorar reeducació o altes capacitats?</div><div class="question-help">Només s’activa el circuit específic quan correspon. El reforç escolar ordinari no és reeducació.</div><div class="option-grid">
${opt('reeducation','none','No hi ha reeducació')}${opt('reeducation','pedagogical','Reeducació pedagògica')}${opt('reeducation','language','Reeducació del llenguatge')}${opt('reeducation','both','Pedagògica i llenguatge')}
</div><div style="height:14px"></div><div class="option-grid">${opt('highAbilities','no','No és alta capacitat')}${opt('highAbilities','yes','És alta capacitat')}${opt('highAbilities','unknown','Cal comprovar-ho')}</div>`}
function renderStep6(){return `<div class="question-title">Compatibilitats i situació familiar</div><div class="question-help">Aquestes dades afecten la revisió de les ajudes/subsidis i les alertes.</div><div class="option-grid">
${opt('generalScholarship','no','No té beca general')}${opt('generalScholarship','yes','Té beca general')}${opt('generalScholarship','unknown','No consta')}
</div><div style="height:14px"></div><div class="option-grid">
${opt('familyLarge','no','No és família nombrosa')}${opt('familyLarge','yes','És família nombrosa')}${opt('familyLarge','unknown','No consta')}
</div>`}
function renderStep7(){return `<div class="question-title">Ja pots generar la revisió</div><div class="question-help">L’assistent aplicarà les regles del circuit i separarà clarament allò que pot determinar d’allò que necessita comprovació.</div><div class="notice info"><strong>Principi del motor:</strong> no inventar. Quan la documentació o les instruccions no permeten determinar una qüestió, el resultat serà “CAL COMPROVAR” o “NO ES POT DETERMINAR”.</div>`}

function evaluate(){const d=state.data;const statuses=[];let eligibility='ok';let eligibilityText='El supòsit pot continuar a revisió documental.';
if(d.evidence==='pending'||d.evidence==='missing'){eligibility='bad';eligibilityText='No es pot donar per acreditada la necessitat amb la informació indicada.'}
if(d.category==='adhd'){statuses.push(['warn','TDAH','Cal comprovar l’associació exigida per la convocatòria. El TDAH per si sol no determina automàticament el dret.']);}
if(d.category==='high'){if(Number(d.age)<6) {eligibility='bad';eligibilityText='Per altes capacitats, les instruccions indiquen 6 anys complits a 31/12/2025.';} statuses.push(['warn','Altes capacitats','Cal comprovar acreditació, escolarització i programa específic.']);}
if(d.evidence==='valid_old') statuses.push(['warn','Informe vigent/no actualitzat','No s’ha de descartar només per antiguitat. Cal comprovar vigència, contingut i si hi ha hagut revisió o canvi de necessitats.']);
if(d.publicCoverage==='yes') statuses.push(['bad','Cobertura pública/centre','No proposar automàticament transport, menjador, residència o material si el concepte ja està cobert.']);
if(d.publicCoverage==='unknown') statuses.push(['warn','Cobertura','Cal comprovar si el concepte està cobert per serveis/fons públics o ajudes al centre.']);
if(d.generalScholarship==='yes') {statuses.push(['bad','Beca general','Les ajudes NESE són incompatibles amb les beques de caràcter general.']);}
if(d.familyLarge==='yes') statuses.push(['warn','Família nombrosa','Els subsidis per família nombrosa es limiten a transport urbà/interurbà i menjador.']);
if(d.reeducation!=='none'){statuses.push(['warn','Reeducació','Cal Annex IV i Annex VI; l’Annex V correspon a Inspecció i no s’inclou en la remissió del centre.']);}
const annex=['Annex I','Annex II','Annex III']; if(d.reeducation!=='none'||d.highAbilities==='yes'){annex.push('Annex IV','Annex VI')} const aids=buildAids(d);
return {eligibility,eligibilityText,statuses,annex,aids};}
function buildAids(d){const a=[];const base=['Ensenyança','Transport escolar/interurbà','Menjador','Residència','Transport cap de setmana','Transport urbà','Material escolar'];if(d.category==='high'){a.push('Programa específic d’altes capacitats','Subsidi fix de 400 €');return a}if(d.category==='disability'||d.category==='conduct'||d.category==='communication'||d.category==='tea'||d.category==='adhd'){base.forEach(x=>a.push(x));if(d.reeducation==='pedagogical'||d.reeducation==='both')a.push('Reeducació pedagògica');if(d.reeducation==='language'||d.reeducation==='both')a.push('Reeducació del llenguatge');a.push('Subsidi fix de 400 €');}return a}
function renderResult(){const r=evaluate();const statusClass=r.eligibility==='ok'?'ok':'bad';const statusLabel=r.eligibility==='ok'?'POT CONTINUAR':'BLOQUEIG / REVISIÓ';document.getElementById('resultTitle').textContent=statusLabel;document.getElementById('resultContent').innerHTML=`<div class="status-grid"><div class="status ${statusClass}"><div class="label">Elegibilitat documental</div><strong>${statusLabel}</strong></div><div class="status"><div class="label">Annexos base</div><strong>I + II + III</strong></div><div class="status"><div class="label">Annexos específics</div><strong>${r.annex.length>3?'IV + VI':'No'}</strong></div><div class="status"><div class="label">Remissió</div><strong>GUC 1419 · Aportació</strong></div></div>
<div class="result-section"><h3>1. Lectura del cas</h3><p>${r.eligibilityText}</p></div>
<div class="result-section"><h3>2. Alertes i comprovacions</h3><div class="result-list">${r.statuses.length?r.statuses.map(s=>`<div class="result-item"><span class="dot"></span><div><strong>${s[1]}</strong><div>${s[2]}</div></div></div>`).join(''):'<div class="result-item"><span class="dot"></span><div>No hi ha alertes addicionals amb les dades introduïdes.</div></div>'}</div></div>
<div class="result-section"><h3>3. Annexos que corresponen</h3><div class="result-list">${r.annex.map(x=>`<div class="result-item"><span class="dot"></span><div><strong>${x}</strong></div></div>`).join('')}<div class="result-item"><span class="dot"></span><div><strong>Annex V:</strong> no s’inclou en la remissió del centre; l’emplena Inspecció Educativa quan corresponga.</div></div></div></div>
<div class="result-section"><h3>4. Ajudes a revisar en Annex III</h3><div class="result-list">${r.aids.map(x=>`<div class="result-item"><span class="dot"></span><div>${x}</div></div>`).join('')}</div><div class="notice warning"><strong>Important:</strong> aquestes són opcions a revisar, no una concessió. Cal aplicar les condicions específiques de cada concepte.</div></div>
<div class="result-section"><h3>5. Quanties màximes 2026–2027</h3><table class="amount-table"><thead><tr><th>Concepte</th><th>Quantia màxima</th></tr></thead><tbody><tr><td>Ensenyança</td><td>862 €</td></tr><tr><td>Transport escolar</td><td>617 €</td></tr><tr><td>Menjador</td><td>574 €</td></tr><tr><td>Residència</td><td>1.795 €</td></tr><tr><td>Transport cap de setmana</td><td>442 €</td></tr><tr><td>Transport urbà</td><td>308 €</td></tr><tr><td>Material · Primària/ESO/CFGB</td><td>105 €</td></tr><tr><td>Material · resta nivells postobligatoris</td><td>204 €</td></tr><tr><td>Reeducació pedagògica</td><td>913 €</td></tr><tr><td>Reeducació del llenguatge</td><td>913 €</td></tr><tr><td>Subsidi fix</td><td>400 €</td></tr></tbody></table></div>
<div class="result-section"><h3>6. Abans de remetre</h3><div class="result-list"><div>☐ Un únic PDF per alumne/a.</div><div>☐ PDF aplanat/bloquejat.</div><div>☐ Nom: <code>26EE1-XXXXXX</code>.</div><div>☐ Màxim 125 MB per enviament.</div><div>☐ GUC 1419 → «Aportació».</div><div>☐ Data màxima territorial: <strong>13/11/2026</strong>.</div></div></div>`;show('result')}

document.addEventListener('click',e=>{const a=e.target.closest('[data-action]');if(!a)return;const action=a.dataset.action;if(action==='home')show('home');if(action==='new-case'){state.step=1;state.data={};renderCurrent();show('wizard')}if(action==='quick'){state.step=1;state.data={};renderCurrent();show('wizard')}if(action==='checklist')show('checklist');if(action==='sources')show('sources')});
document.getElementById('prevBtn').onclick=()=>{if(state.step>1){state.step--;renderCurrent()}};
document.getElementById('nextBtn').onclick=()=>{const s=steps[state.step-1];if(!s.validate()){alert('Abans de continuar, completa o comprova aquest apartat.');return}if(state.step<state.total){state.step++;renderCurrent()}else{renderResult()}};
renderCurrent();
