const OFFICIAL_FORMS_URL='https://ceice.gva.es/va/web/dt-valencia/instruccions-documentacio-centres-docents';
let annexState={id:null,step:0,data:{}};

const ANNEXES={
 I:{title:'Annex I · Acreditació d’escolarització',role:'Centre educatiu',steps:[
  {q:'Què cal verificar?',help:'L’Annex I s’ha de complimentar per a totes les persones sol·licitants. La convocatòria el defineix com la certificació del centre educatiu.',type:'check',items:[
   ['schoolPlace','Consta que l’alumne/a té plaça al centre per al curs 2026-2027'],
   ['schoolStage','Està identificat correctament l’ensenyament que cursa'],
   ['schoolCourse','Està identificat el curs dins de l’etapa'],
   ['centerType','La tipologia de centre està ben identificada'],
   ['centerCode','El codi del centre està comprovat']
  ]},
  {q:'Revisió final de signatura',help:'Abans de tancar l’Annex I, comprova que les dades identificatives i la certificació són coherents amb l’expedient.',type:'check',items:[['signature','Annex I preparat per a la signatura corresponent']]}
 ]},
 II:{title:'Annex II · Acreditació NESE',role:'Orientació educativa',steps:[
  {q:'1. Quina categoria NESE/NEAE correspon acreditar?',help:'Marca la categoria que consta acreditada en l’expedient. No marques una categoria només per sospita, diagnòstic pendent o necessitat educativa no acreditada.',type:'radio',name:'annexIIcategory',options:[
   ['high','ALTES CAPACITATS'],['disability','DISCAPACITAT IGUAL O SUPERIOR AL 25%'],['adhd_disability','T.D.A.H. AMB DISCAPACITAT IGUAL O SUPERIOR AL 25%'],['adhd_conduct','T.D.A.H. ASSOCIAT A TRASTORN GREU DE CONDUCTA O DE COMUNICACIÓ/LLENGUATGE'],['tea','T.E.A.'],['conduct','TRASTORN GREU DE CONDUCTA'],['communication','TRASTORN GREU DE LA COMUNICACIÓ I DEL LLENGUATGE'],['motor65','DISCAPACITAT MOTORA RECONEGUDA SUPERIOR AL 65 %'],['none','CAP DE LES ANTERIORS'] ]},
  {q:'2. Edat i escolarització',help:'Per evitar errors amb les dates de tall, indica la data de naixement i l’etapa/ensenyament. L’assistent comprovarà l’edat respecte de la data exigida per la convocatòria: 31/12/2025 per als supòsits generals i 31/12/2026 per a altes capacitats.',type:'fields',fields:[['annexIIBirthDate','Data de naixement','date'],['annexIIStage','Etapa / ensenyament','text']]},
  {q:'2b. Escolarització primerenca abans dels 2 anys',help:'Només és rellevant si l’alumne/a és menor de 2 anys a 31/12/2025 i el supòsit és compatible amb l’excepció per discapacitat. Cal que aquesta escolarització més primerenca estiga acreditada per les característiques de la discapacitat.',type:'radio',name:'annexIIEarlySchooling',options:[['no','No / no és aplicable'],['yes','Sí, està acreditada l’escolarització primerenca per raó de la discapacitat']]},
  {q:'3. Acreditació específica',help:'Revisa la documentació que sustenta la categoria seleccionada.',type:'derived',derive:'annexIIEvidenceGuide'},
  {q:'4. La documentació acreditativa està disponible i és adequada?',help:'Tria segons la situació real de l’expedient. “Cal revisar” no equival a acreditació definitiva.',type:'radio',name:'annexIIevidence',options:[['yes','Sí, està acreditada i és adequada'],['no','No, falta o no és suficient'],['check','Cal revisar vigència/adequació']]},
  {q:'6. Necessita una atenció educativa diferent de l’ordinària?',help:'El model oficial de l’Annex II exigeix marcar una de les dues opcions. Aquesta decisió correspon a l’equip d’orientació segons l’avaluació del cas.',type:'radio',name:'differentAttention',options:[['yes','Sí, precisa una atenció educativa diferent de l’ordinària'],['no','No, no precisa una atenció educativa diferent de l’ordinària']]},
  {q:'7. Revisió final de l’Annex II',help:'Comprova que categoria, acreditació i necessitat d’atenció educativa són coherents. L’Annex II s’ha de completar per a totes les sol·licituds, també quan no es certifique cap categoria.',type:'check',items:[['iiCategoryCheck','La categoria marcada coincideix amb l’acreditació disponible'],['iiEvidenceCheck','La documentació acreditativa ha estat revisada'],['iiAttentionCheck','La necessitat d’atenció educativa diferent de l’ordinària ha estat valorada'],['iiSignature','Annex II preparat per a la signatura de l’orientació'] ]}
 ]},
 III:{title:'Annex III · Ajudes proposades',role:'Centre educatiu',steps:[
  {q:'1. Quins conceptes vols proposar?',help:'Marca només les caselles que corresponguen realment al cas. L’Annex III s’emplena per a totes les persones sol·licitants, encara que finalment no es propose cap ajuda de les anteriors.',type:'multi',name:'aids',options:[
   ['teaching','ENSENYANÇA'],['interurban','TRANSPORT INTERURBÀ'],['dining','MENJADOR'],['residence','RESIDÈNCIA'],['weekend','TRANSPORT DE CAP DE SETMANA'],['urban','TRANSPORT URBÀ'],['material','MATERIAL'],['pedagogical','REEDUCACIÓ PEDAGÒGICA'],['language','REEDUCACIÓ DEL LLENGUATGE'],['highProgram','PROGRAMA ESPECÍFIC D’ALTES CAPACITATS'],['none','NO PROCEDEIX CAP DE LES ANTERIORS'] ]},
  {q:'2. Condicions que poden impedir o limitar una ajuda',help:'Marca les situacions que siguen certes. Les primeres opcions són condicions específiques; després indica, per separat, quins conceptes ja estan coberts per serveis/fons públics o per una ajuda al centre.',type:'checks',items:[['private','El centre és privat'],['route','El transport escolar està cobert per una ruta finançada per l’Administració'],['freeDining','El menjador és gratuït/cobert'],['infantil','L’alumne/a cursa Educació Infantil'],['specificResidence','Per al transport de cap de setmana, resideix en un centre específic de dilluns a divendres durant el curs'],['disabled','L’alumne/a té una discapacitat acreditada'],['motor65','Hi ha discapacitat motora reconeguda superior al 65 %']]},
  {q:'2b. Cobertura pública o ajuda al centre',help:'Indica només els conceptes que ja estan coberts. Això permet identificar exactament quina ajuda no s’ha de proposar.',type:'multi',name:'coverageConcepts',options:[['transport','Transport (urbà/interurbà)'],['dining','Menjador'],['residence','Residència'],['material','Material didàctic']]},
  {q:'3. Situacions específiques de l’expedient',help:'Aquesta informació és necessària per no proposar ajudes incompatibles o restringides a determinats supòsits.',type:'checks',items:[['generalScholarship','L’alumne/a té també una beca de caràcter general'],['familyLarge','Pertany a una família nombrosa'],['earlyInterventionSamePurpose','Rep atenció en un centre d’atenció primerenca per a la mateixa finalitat'],['otherSamePurpose','Existeix una altra beca o ajuda per a la mateixa finalitat']]},
  {q:'4. Si només correspon el subsidi fix',help:'Quan l’alumne/a compleix els requisits i només es vol proposar el subsidi fix de 400 €, la instrucció indica que s’ha de marcar «No procedeix cap de les anteriors».',type:'radio',name:'onlyFixedSubsidy',options:[['no','No'],['yes','Sí, només es vol proposar el subsidi fix de 400 €'],['unknown','No ho puc determinar']]},
  {q:'5. Observacions que hauria de recollir el centre',help:'L’Annex III disposa d’un apartat d’observacions per indicar altres prestacions, reduccions o preus especials i, si escau, l’import abonat durant el curs.',type:'textarea',name:'observations'},
  {q:'6. Revisió final de coherència',help:'El resultat no concedeix cap ajuda. Només determina quines opcions poden marcar-se, quines requereixen comprovació i quines no procedeixen segons les dades introduïdes.',type:'derived',derive:'annexIII'}
 ]},
 IV:{title:'Annex IV · Informe específic d’orientació',role:'Orientació educativa',steps:[
  {q:'1. Quin servei es considera necessari?',help:'L’Annex IV s’utilitza únicament quan es proposa reeducació pedagògica, reeducació del llenguatge o un programa específic d’altes capacitats.',type:'multi',name:'ivNeed',options:[['pedagogical','REEDUCACIÓ PEDAGÒGICA'],['language','REEDUCACIÓ DEL LLENGUATGE'],['highProgram','PROGRAMA ESPECÍFIC D’ALTES CAPACITATS']]},
  {q:'2. Descripció específica del servei',help:'Descriu detalladament l’assistència o servei necessari i les condicions que ha de reunir: continguts, activitats, recursos, objectius, seguiment i altres característiques rellevants.',type:'textarea',name:'ivDescription'},
  {q:'3. Duració i intensitat necessàries',help:'L’orientació determina les hores necessàries. En reeducació pedagògica i de llenguatge, la cobertura del centre es calcula per separat: PT no se suma amb AL. Introdueix la realitat de les sessions del centre (nombre i minuts reals per sessió).',type:'ivFields'},
  {q:'4. Cobertura del centre: PT i AL per separat',help:'PT i AL són conceptes diferents i no s’han de sumar per obtindre un únic percentatge. La calculadora converteix les sessions reals en minuts i hores i calcula cada cobertura per separat.',type:'derived',derive:'annexIVCoverage'},
  {q:'5. Reeducació: requisits addicionals',help:'Només per a reeducació pedagògica o del llenguatge. Abans de tancar el circuit, comprova la intervenció específica, la insuficiència dels recursos del centre, la inviabilitat de matriculació en un centre amb el servei requerit, el certificat d’Inspecció, la memòria del reeducador i la qualificació del professional.',type:'checks',items:[['ivInspection','S’ha gestionat el certificat de l’Inspector/a de zona quan correspon'],['ivExternalMemo','Es disposa de la memòria/certificació del reeducador (Annex VI)'],['ivTraining','S’ha revisat la declaració responsable de qualificació del professional'],['ivFreeService','S’ha comprovat la possibilitat de prestació gratuïta del servei'],['ivCenterInsufficient','S’ha comprovat que l’atenció del centre és inexistent o insuficient'],['ivEnrollmentInviable','S’ha comprovat la inviabilitat de matriculació en un centre amb el servei requerit']]},
  {q:'6. Altes capacitats: requisits del programa',help:'Només per a programa específic d’altes capacitats. Comprova la necessitat específica acreditada, que el programa no es presta gratuïtament per l’administració educativa i la memòria/certificació del servei (Annex VI).',type:'checks',items:[['highNeedAccredited','La necessitat específica associada a altes capacitats està acreditada'],['highProgramNotFree','El programa específic no es presta de forma gratuïta per l’administració educativa'],['highExternalMemo','Es disposa de la memòria/certificació del programa (Annex VI)']]},
  {q:'7. Revisió final de l’Annex IV',help:'Abans de signar, comprova que el servei seleccionat, la descripció, les dades quantitatives i les comprovacions específiques del circuit són coherents. L’Annex IV és responsabilitat de l’orientació educativa.',type:'check',items:[['ivNumbers','Dades quantitatives revisades i expressades amb números'],['ivNarrative','Informe específic revisat'],['ivCross','La proposta és coherent amb Annex II i Annex III'],['ivSign','Annex IV preparat per a la signatura de l’orientació'] ]}
 ]},
 V:{title:'Annex V · Certificat de l’Inspector/a de zona',role:'Inspecció d’Educació',steps:[
  {q:'Què ha de fer l’orientadora amb l’Annex V?',help:'No és un annex que l’orientació haja d’emplenar. Correspon a Inspecció en les propostes de reeducació pedagògica o del llenguatge.',type:'derived',derive:'annexV'}
 ]},
 VI:{title:'Annex VI · Memòria i declaració responsable',role:'Professional/reeducador, gabinet o centre prestador',steps:[
  {q:'1. Identificació del professional o servei',help:'L’Annex VI el completa i signa el professional, gabinet o centre que presta la reeducació o el programa específic. L’orientació no substitueix aquesta certificació.',type:'fields',fields:[['professional','Nom i cognoms del/de la professional','text'],['registration','Número de col·legiació / registre professional','text'],['nif','NIF','text'],['speciality','Professió / especialitat','text'],['serviceCenter','Centre/gabinet on es presta el servei','text'],['centerCif','CIF del centre/gabinet, si escau','text']]},
  {q:'2. Quin servei es certifica?',help:'Ha de coincidir amb la proposta de l’Annex III i amb el circuit de l’Annex IV. No marques un servei diferent del que realment es prestarà.',type:'multi',name:'viService',options:[['pedagogical','REEDUCACIÓ PEDAGÒGICA'],['language','REEDUCACIÓ DEL LLENGUATGE'],['highProgram','PROGRAMA ESPECÍFIC D’ALTES CAPACITATS']]},
  {q:'2b. El servei es prestarà efectivament?',help:'L’Annex VI preveu que, si el servei finalment no es presta, aquesta circumstància s’ha de comunicar a la unitat de beques. No dones per tancat un servei que no s’ha de realitzar.',type:'radio',name:'viServiceProvided',options:[['yes','Sí, el servei es prestarà'],['no','No, finalment no es prestarà / cal comunicar-ho']]},
  {q:'3. Import mensual del servei',help:'Indica l’import mensual del tractament o programa certificat pel professional/centre prestador. És una dada pròpia de l’Annex VI.',type:'fields',fields:[['monthlyAmount','Import mensual (€)','number']]},
  {q:'4. Memòria del servei o programa',help:'La memòria ha de concretar, com a mínim, l’assistència/servei, continguts, objectius, activitats, recursos, agrupació, seguiment, qualificació/especialitat professional, hores setmanals i duració prevista. Si el servei finalment no es presta, cal comunicar-ho a la unitat de beques.',type:'textarea',name:'viMemory'},
  {q:'5. Duració i intensitat',help:'Indica les hores setmanals i la duració previsible que constaran en la memòria. Si la memòria inclou reeducació pedagògica i del llenguatge, mantén les hores separades per servei; no les sumes.',type:'viIntensity'},
  {q:'6. Declaració responsable de qualificació',help:'Per a reeducació pedagògica o del llenguatge, comprova la declaració responsable del professional sobre el compliment dels requisits de formació exigits per la convocatòria.',type:'check',items:[['viTraining','Declaració responsable de formació/qualificació revisada, quan corresponga']]},
  {q:'7. Revisió de coherència i signatura',help:'Abans de tancar l’Annex VI, comprova que el servei, professional, hores, duració i import són coherents amb la documentació i, quan corresponga, amb l’Annex IV. L’Annex VI el signa el professional/gabinet/centre prestador.',type:'check',items:[['viMemoryCheck','Memòria revisada i completa'],['viCross','Coherència amb Annex IV/III revisada'],['viSign','Annex VI preparat per a la signatura del professional/gabinet/centre'] ]}
 ]}
};

function escA(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
function getVal(k){return annexState.data[k];}
function renderAnnexAssistant(id){annexState.id=id;annexState.step=0;annexState.data={};if(typeof state!=='undefined'&&state.data){const d=state.data;if(id==='II'){annexState.data={annexIIcategory:d.category||'',annexIIevidence:d.evidence==='valid'||d.evidence==='valid_old'?'yes':d.evidence==='pending'||d.evidence==='missing'?'no':'check',annexIIBirthDate:d.birthDate||'',annexIIStage:d.stage||'',annexIIEarlySchooling:d.earlySchooling||'',differentAttention:d.differentAttention||''};}if(id==='III'){annexState.data={annexIIcategory:d.category||'',aids:[],private:d.centerType==='private',infantil:d.stage==='Educació Infantil',motor65:d.motorDisability65==='yes',disabled:d.category==='disability'||d.category==='adhd_disability'||d.category==='motor65',generalScholarship:d.generalScholarship==='yes',familyLarge:d.familyLarge==='yes',coverageConcepts:[],onlyFixedSubsidy:'',};}if(id==='IV'){annexState.data={annexIIcategory:d.category||'',ivNeed:[],ivDescription:'',durationMonths:'',neededHoursPed:'',centerHoursPTSessions:'',centerHoursPTMinutes:'45',neededHoursLang:'',neededHoursHigh:'',centerHoursALSessions:'',centerHoursALMinutes:'45',ivInspection:false,ivExternalMemo:false,ivTraining:false,ivFreeService:false,ivCenterInsufficient:false,ivEnrollmentInviable:false,highNeedAccredited:false,highProgramNotFree:false,highExternalMemo:false,ivNumbers:false,ivNarrative:false,ivCross:false,ivSign:false};if(d.reeducation==='pedagogical')annexState.data.ivNeed=['pedagogical'];if(d.reeducation==='language')annexState.data.ivNeed=['language'];if(d.reeducation==='both')annexState.data.ivNeed=['pedagogical','language'];if(d.category==='high'||d.highNeed==='yes')annexState.data.ivNeed=['highProgram'];}if(id==='VI'){const iv=d.annexIVReview||{};annexState.data={professional:'',registration:'',nif:'',speciality:'',serviceCenter:'',centerCif:'',viService:Array.isArray(iv.ivNeed)?[...iv.ivNeed]:[],monthlyAmount:'',viMemory:'',weeklyHours:'',weeklyHoursPed:iv.neededHoursPed||'',weeklyHoursLang:iv.neededHoursLang||'',weeklyHoursHigh:iv.neededHoursHigh||'',durationMonths:iv.durationMonths||'',viTraining:false,viMemoryCheck:false,viCross:false,viSign:false,annexIVReview:iv};if(!annexState.data.viService.length){if(d.reeducation==='pedagogical')annexState.data.viService=['pedagogical'];if(d.reeducation==='language')annexState.data.viService=['language'];if(d.reeducation==='both')annexState.data.viService=['pedagogical','language'];if(d.category==='high'||d.highNeed==='yes')annexState.data.viService=['highProgram'];}}}renderAnnexStep();show('annexAssistant');}
function annexVisibleSteps(){const a=ANNEXES[annexState.id];if(annexState.id!=='IV')return a.steps;const needs=annexState.data.ivNeed||[];const isReeducation=needs.includes('pedagogical')||needs.includes('language');const isHigh=needs.includes('highProgram');return a.steps.filter((step,i)=>{if(i===3&&!isReeducation)return false;if(i===4&&!isReeducation)return false;if(i===5&&!isHigh)return false;return true;});}
function renderAnnexStep(){const a=ANNEXES[annexState.id],steps=annexVisibleSteps();if(annexState.step>=steps.length)annexState.step=steps.length-1;const s=steps[annexState.step];document.getElementById('annexTitle').textContent=a.title;document.getElementById('annexRole').textContent=`Responsable: ${a.role}`;document.getElementById('annexProgress').style.width=`${((annexState.step+1)/steps.length)*100}%`;document.getElementById('annexStepCount').textContent=`${annexState.step+1}/${steps.length}`;document.getElementById('annexContent').innerHTML=renderAnnexQuestion(s);bindAnnex();document.getElementById('annexPrev').disabled=annexState.step===0;document.getElementById('annexNext').textContent=annexState.step===steps.length-1?'Finalitzar revisió':'Continuar →';}
function renderAnnexQuestion(s){let h=`<div class="question-title">${escA(s.q)}</div><div class="question-help">${escA(s.help||'')}</div>`;
 if(s.type==='radio')h+=`<div class="option-grid">${s.options.map(o=>{const sel=getVal(s.name)===o[0]?' selected':'';return `<button type="button" class="option${sel}" data-annex-field="${s.name}" data-annex-value="${o[0]}"><strong>${escA(o[1])}</strong></button>`}).join('')}</div>`;
 if(s.type==='multi')h+=`<div class="option-grid">${s.options.map(o=>{const arr=getVal(s.name)||[];const sel=arr.includes(o[0])?' selected':'';return `<button type="button" class="option${sel}" data-annex-multi="${s.name}" data-annex-value="${o[0]}"><strong>${escA(o[1])}</strong></button>`}).join('')}</div>`;
 if(s.type==='check'||s.type==='checks')h+=`<div class="assistant-checks">${s.items.map(i=>`<label><input type="checkbox" data-annex-check="${i[0]}" ${getVal(i[0])?'checked':''}> ${escA(i[1])}</label>`).join('')}</div>`;
 if(s.type==='textarea')h+=`<textarea class="assistant-textarea" data-annex-input="${s.name}" rows="9" placeholder="Escriu ací...">${escA(getVal(s.name)||'')}</textarea>`;
 if(s.type==='fields')h+=`<div class="field-grid">${s.fields.map(f=>`<div class="field"><label>${escA(f[1])}</label><input data-annex-input="${f[0]}" type="${f[2]}" value="${escA(getVal(f[0])||'')}"></div>`).join('')}</div>`;
 if(s.type==='viIntensity') return renderVIIntensity();
 if(s.type==='ivFields'){const needs=annexState.data.ivNeed||[];const ped=needs.includes('pedagogical'),lang=needs.includes('language'),reeducation=ped||lang;h+=`<div class="field-grid"><div class="field"><label>Duració total previsible (mesos)</label><input data-annex-input="durationMonths" type="number" min="0" step="0.5" value="${escA(getVal('durationMonths')||'')}"></div>${ped?`<div class="field"><label>Hores setmanals necessàries · reeducació pedagògica</label><input data-annex-input="neededHoursPed" type="number" min="0" step="0.25" value="${escA(getVal('neededHoursPed')||'')}"></div>`:''}${lang?`<div class="field"><label>Hores setmanals necessàries · reeducació del llenguatge</label><input data-annex-input="neededHoursLang" type="number" min="0" step="0.25" value="${escA(getVal('neededHoursLang')||'')}"></div>`:''}${needs.includes('highProgram')?`<div class="field"><label>Hores setmanals necessàries · programa AACC</label><input data-annex-input="neededHoursHigh" type="number" min="0" step="0.25" value="${escA(getVal('neededHoursHigh')||'')}"></div>`:''}</div>${reeducation?`<div class="coverage-inputs"><div class="notice info"><strong>Atenció:</strong> PT i AL no es sumen. Cada tipus de suport es calcula respecte de la seua necessitat.</div>${ped?`<div class="field-grid"><div class="field"><label>PT · sessions/setmana reals</label><input data-annex-input="centerHoursPTSessions" type="number" min="0" step="1" value="${escA(getVal('centerHoursPTSessions')||'')}"></div><div class="field"><label>PT · minuts per sessió</label><input data-annex-input="centerHoursPTMinutes" type="number" min="0" step="1" value="${escA(getVal('centerHoursPTMinutes')||'45')}"></div></div>`:''}${lang?`<div class="field-grid"><div class="field"><label>AL · sessions/setmana reals</label><input data-annex-input="centerHoursALSessions" type="number" min="0" step="1" value="${escA(getVal('centerHoursALSessions')||'')}"></div><div class="field"><label>AL · minuts per sessió</label><input data-annex-input="centerHoursALMinutes" type="number" min="0" step="1" value="${escA(getVal('centerHoursALMinutes')||'45')}"></div></div>`:''}</div>`:''}`;}
 if(s.type==='derived')h+=renderDerived(s.derive);
 return h;
}
function ageAtCutoff(birth, cutoff){ if(!birth) return null; const b=new Date(birth+'T00:00:00'); const c=new Date(cutoff+'T00:00:00'); if(Number.isNaN(b.getTime())) return null; let age=c.getFullYear()-b.getFullYear(); const before=(c.getMonth()<b.getMonth())||(c.getMonth()===b.getMonth()&&c.getDate()<b.getDate()); if(before) age--; return age; }
function renderAnnexIIEvidenceGuide(){
 const c=getVal('annexIIcategory');
 const cutoff=c==='high'?'2026-12-31':'2025-12-31';
 const age=ageAtCutoff(getVal('annexIIBirthDate'),cutoff);
 const stage=getVal('annexIIStage');
 let title='Guia de comprovació';
 let body='Selecciona primer una categoria per veure què has de revisar.';
 if(c==='disability') body='Discapacitat ≥25 %: comprova que consta el reconeixement de discapacitat igual o superior al 25 %.';
 if(c==='adhd_disability') body='TDAH + discapacitat ≥25 %: comprova l’acreditació del TDAH i el reconeixement de discapacitat igual o superior al 25 %.';
 if(c==='adhd_conduct') body='TDAH associat: comprova que l’associació és amb un trastorn greu de conducta o de comunicació/llenguatge en els termes exigits per la convocatòria i que aquest supòsit està acreditat.';
 if(c==='tea') body='TEA: comprova el certificat mèdic de la xarxa pública o concertada i l’informe sociopsicopedagògic corresponent.';
 if(c==='conduct') body='Trastorn greu de conducta: comprova que el trastorn greu està acreditat mitjançant la documentació que corresponga (informe d’orientació o mèdic, segons el supòsit) i que compleix el circuit de la convocatòria.';
 if(c==='communication') body='Trastorn greu de comunicació/llenguatge: comprova que està acreditat mitjançant la documentació que corresponga (informe d’orientació o mèdic, segons el supòsit).';
 if(c==='high') body='Altes capacitats: comprova la necessitat específica de suport educatiu associada a alta capacitat, acreditada per l’equip d’orientació; també cal tindre 6 anys complits a 31/12/2026 i estar en un nivell admés.';
 if(c==='motor65') body='Discapacitat motora >65 %: comprova el reconeixement de discapacitat motora superior al 65 % i la documentació acreditativa corresponent. Aquesta opció apareix com a categoria pròpia en el model oficial de l’Annex II.';
 if(c==='none') body='Cap de les anteriors: aquesta opció s’utilitza quan no es certifica cap de les categories anteriors. L’Annex II continua sent obligatori.';
 const minAge=(c==='high'?6:(c&&c!=='none'?2:null));
 const ageCutoff=(c==='high'?'31/12/2026':'31/12/2025');
 const early=(getVal('annexIIEarlySchooling')||'');
 const earlyException=(Number.isFinite(age)&&age<2&&early==='yes'&&['disability','adhd_disability','motor65'].includes(c));
 const ageAlert=(minAge!==null&&Number.isFinite(age)&&age<minAge&&!earlyException)?` <div class="result-item bad"><span class="dot"></span><div><strong>Alerta d’edat</strong><div>Amb les dades introduïdes, no es compleix l’edat mínima de ${minAge} anys a ${ageCutoff} per a la categoria seleccionada.</div></div></div>`:(earlyException?` <div class="result-item warn"><span class="dot"></span><div><strong>Excepció d’escolarització primerenca</strong><div>Cal acreditar que l’escolarització abans dels 2 anys es deu a les característiques de la discapacitat.</div></div></div>`:'');
 const admittedGeneral=['Educació Infantil','Educació Primària','ESO','Batxillerat','CFGM','CFGS','Ensenyaments artístics professionals','CFGM/CFGS','Cicle Formatiu de Grau Bàsic','Programes de formació per a la transició a la vida adulta','Altres programes formatius de FP'];
 const admittedHigh=['Educació Primària','ESO','Batxillerat','CFGM','CFGS','Ensenyaments artístics professionals','CFGM/CFGS'];
 const stageAlert=(stage&&c&&c!=='none'&&!(c==='high'?admittedHigh:admittedGeneral).includes(stage))?' <div class="result-item bad"><span class="dot"></span><div><strong>Revisar escolarització</strong><div>El nivell introduït no consta entre els ensenyaments admesos per a la categoria seleccionada. Comprova l’ensenyament i el circuit de la convocatòria.</div></div></div>':'';
 const motorNote=(c==='motor65')?' <div class="result-item warn"><span class="dot"></span><div><strong>Transport</strong><div>El reconeixement de discapacitat motora superior al 65 % pot incrementar fins al 50 % les quanties de transport, segons la convocatòria. Aquesta comprovació es desenvoluparà després en l’Annex III.</div></div></div>':'';
 return `<div class="notice info"><strong>${escA(title)}</strong><br>${escA(body)}</div>${ageAlert}${stageAlert}${motorNote}`;
}
function renderAnnexIVCoverage(){
 const needs=annexState.data.ivNeed||[];
 const ped=needs.includes('pedagogical'), lang=needs.includes('language');
 const calc=(needed,sessions,mins,label)=>{
  const n=Number(needed), s=Number(sessions), m=Number(mins);
  if(!Number.isFinite(n)||n<=0) return `<div class="notice warning"><strong>${label}</strong><br>Indica les hores setmanals necessàries.</div>`;
  if(!Number.isFinite(s)||s<0||!Number.isFinite(m)||m<0) return `<div class="notice warning"><strong>${label}</strong><br>Indica el nombre real de sessions/setmana i els minuts reals de cada sessió. Si no hi ha atenció del centre, posa 0 sessions.</div>`;
  const centerMin=s*m, centerHours=centerMin/60, pct=(centerHours/n)*100;
  const rounded=Math.round(pct*100)/100;
  let cls='ok',title='Cobertura parcial',msg=`El centre aporta ${centerMin} minuts/setmana (${Math.round(centerHours*100)/100} h) sobre ${n} h necessàries: ${rounded}%.`;
  if(pct>=100){cls='bad';title='Cobertura del 100 % o superior';msg=`El centre aporta ${centerMin} minuts/setmana (${Math.round(centerHours*100)/100} h) sobre ${n} h necessàries: ${rounded}%. Revisa el cas: les instruccions indiquen que amb cobertura del 100 % les necessitats queden cobertes pel centre i la reeducació externa serà denegada.`;}
  return `<div class="result-item ${cls}"><span class="dot"></span><div><strong>${label} · ${title}</strong><div>${msg}</div><div class="mini-note">Càlcul: ${s} sessions × ${m} min = ${centerMin} min/setmana.</div></div></div>`;
 };
 let html='<div class="notice info"><strong>Càlcul independent de PT i AL</strong><br>No es sumen les hores de PT i AL. Cada percentatge compara el suport del centre amb la necessitat del mateix tipus de reeducació.</div>';
 if(ped) html+=calc(annexState.data.neededHoursPed,annexState.data.centerHoursPTSessions,annexState.data.centerHoursPTMinutes,'Reeducació pedagògica · cobertura PT');
 if(lang) html+=calc(annexState.data.neededHoursLang,annexState.data.centerHoursALSessions,annexState.data.centerHoursALMinutes,'Reeducació del llenguatge · cobertura AL');
 if(!ped&&!lang) html+='<div class="notice info">Per a un programa específic d’altes capacitats no es calcula cobertura PT/AL en aquesta pantalla. Es manté la duració i les hores necessàries del programa.</div>';
 return html;
}
function renderDerived(type){if(type==='annexIIEvidenceGuide')return renderAnnexIIEvidenceGuide();if(type==='annexIVCoverage')return renderAnnexIVCoverage();if(type==='annexV')return `<div class="notice info"><strong>Acció:</strong> no emplenes l’Annex V des de l’assistent. Quan corresponga a reeducació pedagògica o del llenguatge, registra que s’ha de sol·licitar/gestionar amb Inspecció.</div>`;
 if(type==='annexIII'){const a=annexState.data.aids||[],c=annexState.data;const alerts=[];const no=(x)=>alerts.push(`<div class="result-item bad"><span class="dot"></span><div><strong>NO PROCEDEIX</strong><div>${escA(x)}</div></div></div>`);const check=(x)=>alerts.push(`<div class="result-item warn"><span class="dot"></span><div><strong>CAL COMPROVAR</strong><div>${escA(x)}</div></div></div>`);const info=(x)=>alerts.push(`<div class="result-item info"><span class="dot"></span><div><strong>INFORMACIÓ</strong><div>${escA(x)}</div></div></div>`);
 if(a.includes('none')&&a.length>1)no('«No procedeix cap de les anteriors» no pot conviure amb altres opcions de l’Annex III.');
 if(c.onlyFixedSubsidy==='yes'&&!(a.length===1&&a.includes('none')))no('Si només es vol proposar el subsidi fix de 400 €, cal marcar exclusivament «No procedeix cap de les anteriors»; no deixes el concepte sense seleccionar ni combines aquesta opció amb altres ajudes.');
 if(c.onlyFixedSubsidy==='unknown')check('No s’ha pogut determinar si l’únic objectiu és el subsidi fix de 400 €.');
 if(a.includes('teaching')&&!c.private)no('Ensenyança: les instruccions territorials indiquen que aquesta ajuda és només per a centres privats.');
 if((a.includes('interurban')||a.includes('urban'))&&!c.disabled)no('Transport: l’Annex III indica que no procedeix si l’alumne/a no és discapacitat. En particular, TEA, TDAH associat a trastorn greu de conducta/comunicació, trastorn greu de conducta o trastorn greu de la comunicació/llenguatge no equivalen, per si sols, a acreditar una discapacitat.');
 if((a.includes('interurban')||a.includes('urban'))&&c.route)no('Transport: no procedeix si l’alumne/a utilitza una ruta escolar finançada per l’Administració.');
 if(a.includes('dining')&&c.freeDining)no('Menjador: no procedeix si l’alumne/a gaudeix de la gratuïtat del servei.');
 if(a.includes('weekend')&&!c.specificResidence)check('Transport de cap de setmana: només procedeix si l’alumne/a resideix en un centre específic de dilluns a divendres durant el curs.');
 if(a.includes('material')&&c.infantil)no('Material: no procedeix en Educació Infantil.');
 const coverageMap={transport:{keys:['interurban','urban'],label:'Transport'},dining:{keys:['dining'],label:'Menjador'},residence:{keys:['residence'],label:'Residència'},material:{keys:['material'],label:'Material didàctic'}};
 (c.coverageConcepts||[]).forEach(k=>{const m=coverageMap[k];if(m&&a.some(x=>m.keys.includes(x)))no(`${m.label}: no procedeix si aquest concepte ja està cobert per serveis o fons públics o per una ajuda al centre.`);});
 if(a.includes('residence')&&a.includes('dining'))no('Residència i menjador són incompatibles.');
 if(a.includes('residence')&&(a.includes('interurban')||a.includes('urban')))no('Residència és incompatible amb transport; el transport de cap de setmana té un tractament específic.');
 if(a.includes('pedagogical')||a.includes('language'))info('Reeducació: cal completar també l’Annex IV i recabar l’Annex VI. L’Annex V correspon a Inspecció.');
 if(a.includes('highProgram')){if(annexState.data.annexIIcategory&&annexState.data.annexIIcategory!=='high')check('Programa específic d’altes capacitats: comprova que la categoria acreditada és altes capacitats i que existeix necessitat específica i programa específic.');else info('Altes capacitats: el circuit específic és programa d’altes capacitats + subsidi fix de 400 €.');}
 if(c.generalScholarship)no('Les ajudes i subsidis NESE són incompatibles amb les beques de caràcter general del Ministeri.');
 if(c.otherSamePurpose)no('Les ajudes i subsidis són incompatibles amb una altra beca o ajuda concedida per a la mateixa finalitat.');
 if(c.earlyInterventionSamePurpose)check('Atenció primerenca: la incompatibilitat només opera quan coincideix la mateixa finalitat. Cal comprovar el concepte concret.');
 if(c.familyLarge)info('Família nombrosa: els subsidis específics es limiten a transport urbà/interurbà i menjador.');
 if(c.motor65&&a.some(x=>['interurban','urban'].includes(x)))info('Discapacitat motora >65 %: pot incrementar fins al 50 % les quanties de transport, segons la convocatòria.');
 if(a.includes('interurban')&&a.includes('urban'))check('S’han seleccionat transport urbà i interurbà alhora. Determina quin tipus correspon segons la discapacitat i la distància abans de signar.');
 const ordinary=['teaching','interurban','dining','residence','weekend','urban','material','pedagogical','language'];
 if(annexState.data.annexIIcategory==='high'&&a.some(x=>ordinary.includes(x)))no('Altes capacitats: les instruccions indiquen que aquest alumnat opta únicament al subsidi fix i al programa específic d’altes capacitats.');
 if(annexState.data.annexIIcategory==='none'&&a.some(x=>ordinary.includes(x)))no('No s’ha certificat cap categoria a l’Annex II però s’han proposat ajudes. Per a aquest expedient, revisa l’acreditació NESE i, si no es certifica cap categoria, marca «No procedeix cap de les anteriors».');
 if(a.includes('highProgram')&&annexState.data.annexIIcategory==='high'&&c.onlyFixedSubsidy==='yes')no('No es pot indicar alhora que només es vol el subsidi fix i proposar el programa específic d’altes capacitats.');
 if(!a.length)check('No s’han seleccionat conceptes. Recorda que l’Annex III s’ha d’emplenar per a totes les sol·licituds.');
 return alerts.length?`<div class="assistant-result-list">${alerts.join('')}</div>`:`<div class="result-item ok"><span class="dot"></span><div><strong>PROCEDEIX</strong><div>No s’ha detectat cap incompatibilitat amb les dades introduïdes. Revisa igualment el cas concret abans de signar.</div></div></div>`;}
 return '<div class="result-item ok"><span class="dot"></span><div>Revisió guiada completada.</div></div>';}
function renderVIIntensity(){
 const services=annexState.data.viService||[];
 const ped=services.includes('pedagogical'), lang=services.includes('language'), high=services.includes('highProgram');
 let h='<div class="field-grid">';
 if(ped) h+=`<div class="field"><label>Reeducació pedagògica · hores/setmana</label><input data-annex-input="weeklyHoursPed" type="number" min="0" step="0.25" value="${escA(getVal('weeklyHoursPed')||'')}"></div>`;
 if(lang) h+=`<div class="field"><label>Reeducació del llenguatge · hores/setmana</label><input data-annex-input="weeklyHoursLang" type="number" min="0" step="0.25" value="${escA(getVal('weeklyHoursLang')||'')}"></div>`;
 if(high) h+=`<div class="field"><label>Programa AACC · hores/setmana</label><input data-annex-input="weeklyHoursHigh" type="number" min="0" step="0.25" value="${escA(getVal('weeklyHoursHigh')||'')}"></div>`;
 h+='</div><div class="field-grid"><div class="field"><label>Duració previsible (mesos)</label><input data-annex-input="durationMonths" type="number" min="0" step="0.5" value="'+escA(getVal('durationMonths')||'')+'"></div></div>';
 return h;
}
function bindAnnex(){document.querySelectorAll('[data-annex-field]').forEach(b=>b.onclick=()=>{annexState.data[b.dataset.annexField]=b.dataset.annexValue;renderAnnexStep();});document.querySelectorAll('[data-annex-multi]').forEach(b=>b.onclick=()=>{const k=b.dataset.annexMulti,arr=annexState.data[k]||[],v=b.dataset.annexValue;annexState.data[k]=arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];renderAnnexStep();});document.querySelectorAll('[data-annex-check]').forEach(x=>x.onchange=()=>{annexState.data[x.dataset.annexCheck]=x.checked;});document.querySelectorAll('[data-annex-input]').forEach(x=>x.oninput=()=>{annexState.data[x.dataset.annexInput]=x.value;});}
function annexFinish(){
 const id=annexState.id, d=annexState.data;
 const missing=[];
 if(id==='II'){
  if(!d.annexIIcategory) missing.push('Selecciona la categoria de l’Annex II.');
  if(d.annexIIcategory!=='none'&&!d.annexIIBirthDate) missing.push('Indica la data de naixement per comprovar el requisit d’edat.');
  if(d.annexIIcategory!=='none'&&!d.annexIIStage) missing.push('Indica l’etapa o ensenyament per comprovar l’escolarització admesa.');
  if(d.annexIIcategory!=='none'){
   const cut=d.annexIIcategory==='high'?'2026-12-31':'2025-12-31';
   const age=ageAtCutoff(d.annexIIBirthDate,cut);
   if(Number.isFinite(age)&&age<2&&!d.annexIIEarlySchooling) missing.push('Si és menor de 2 anys, indica si existeix escolarització primerenca per raó de la discapacitat.');
  }
  if(!d.annexIIevidence) missing.push('Indica si la documentació acreditativa és adequada.');
  if(!d.differentAttention) missing.push('Indica si precisa una atenció educativa diferent de l’ordinària.');
 }
 if(id==='IV'){
  const needs=d.ivNeed||[];
  const isReeducation=needs.includes('pedagogical')||needs.includes('language');
  const isHighProgram=needs.includes('highProgram');
  if(!needs.length) missing.push('Selecciona almenys un servei: reeducació pedagògica, reeducació del llenguatge o programa específic d’altes capacitats.');
  if(!String(d.ivDescription||'').trim()) missing.push('Descriu la necessitat específica i les característiques del servei.');
  const duration=Number(d.durationMonths);
  const neededPed=Number(d.neededHoursPed), neededLang=Number(d.neededHoursLang);
  const ptSessions=Number(d.centerHoursPTSessions), ptMinutes=Number(d.centerHoursPTMinutes);
  const alSessions=Number(d.centerHoursALSessions), alMinutes=Number(d.centerHoursALMinutes);
  if(!Number.isFinite(duration)||duration<=0) missing.push('Indica la duració total previsible en mesos.');
  if(ped && (!Number.isFinite(neededPed)||neededPed<=0)) missing.push('Indica les hores setmanals necessàries de reeducació pedagògica.');
  if(lang && (!Number.isFinite(neededLang)||neededLang<=0)) missing.push('Indica les hores setmanals necessàries de reeducació del llenguatge.');
  if(isHighProgram && (!Number.isFinite(Number(d.neededHoursHigh))||Number(d.neededHoursHigh)<=0)) missing.push('Indica les hores setmanals necessàries del programa específic d’altes capacitats.');
  if(ped && (!Number.isFinite(ptSessions)||ptSessions<0||!Number.isFinite(ptMinutes)||ptMinutes<0)) missing.push('Per a reeducació pedagògica, indica les sessions i els minuts reals de PT; si no n’hi ha, posa 0 sessions.');
  if(lang && (!Number.isFinite(alSessions)||alSessions<0||!Number.isFinite(alMinutes)||alMinutes<0)) missing.push('Per a reeducació del llenguatge, indica les sessions i els minuts reals d’AL; si no n’hi ha, posa 0 sessions.');
  if(d.annexIIcategory==='high' && isReeducation) missing.push('Altes capacitats: no combines en aquest expedient reeducació pedagògica o del llenguatge amb el programa específic d’altes capacitats. Revisa Annex II i Annex III.');
  if(d.annexIIcategory!=='high' && isHighProgram && d.annexIIcategory && d.annexIIcategory!=='') missing.push('Programa d’altes capacitats: la categoria acreditada de l’Annex II no és altes capacitats. Revisa Annex II i Annex III.');
  if(isReeducation){
   if(!d.ivInspection) missing.push('Per a reeducació, indica si s’ha gestionat/obtingut el certificat de l’Inspector/a quan correspon.');
   if(!d.ivExternalMemo) missing.push('Per a reeducació, indica si es disposa de la memòria/certificació del reeducador (Annex VI).');
   if(!d.ivTraining) missing.push('Per a reeducació, indica si s’ha revisat la declaració responsable de qualificació del professional.');
   if(!d.ivFreeService) missing.push('Comprova la possibilitat de prestació gratuïta del servei.');
   if(!d.ivCenterInsufficient) missing.push('Confirma que l’atenció del centre és inexistent o insuficient per a la necessitat valorada.');
   if(!d.ivEnrollmentInviable) missing.push('Confirma la inviabilitat de matriculació en un centre amb el servei requerit, quan corresponga.');
   if(ped && neededPed>0 && ptSessions>=0 && ptMinutes>=0 && ((ptSessions*ptMinutes/60)/neededPed)>=1) missing.push('La cobertura de PT per a reeducació pedagògica és del 100 % o superior: revisa el cas perquè la reeducació externa no correspon quan el centre cobreix el 100 % de l’atenció necessària.');
  if(lang && neededLang>0 && alSessions>=0 && alMinutes>=0 && ((alSessions*alMinutes/60)/neededLang)>=1) missing.push('La cobertura d’AL per a reeducació del llenguatge és del 100 % o superior: revisa el cas perquè la reeducació externa no correspon quan el centre cobreix el 100 % de l’atenció necessària.');
  }
  if(needs.includes('highProgram')){
   if(!d.highNeedAccredited) missing.push('Per a altes capacitats, indica que la necessitat específica associada està acreditada.');
   if(!d.highProgramNotFree) missing.push('Per a altes capacitats, comprova que el programa específic no es presta de forma gratuïta per l’administració educativa.');
   if(!d.highExternalMemo) missing.push('Per a altes capacitats, indica si es disposa de la memòria/certificació del programa (Annex VI).');
  }
  if(!d.ivNumbers) missing.push('Confirma que les dades quantitatives de l’Annex IV han estat revisades.');
  if(!d.ivNarrative) missing.push('Confirma que l’informe específic de l’Annex IV ha estat revisat.');
  if(!d.ivCross) missing.push('Confirma la coherència de l’Annex IV amb els Annexos II i III.');
  if(!d.ivSign) missing.push('Confirma que l’Annex IV està preparat per a la signatura de l’orientació.');
 }
 if(id==='VI'){
  const services=d.viService||[];
  const weeklyPed=Number(d.weeklyHoursPed), weeklyLang=Number(d.weeklyHoursLang), weeklyHigh=Number(d.weeklyHoursHigh), duration=Number(d.durationMonths), amount=Number(d.monthlyAmount);
  if(!String(d.professional||'').trim()) missing.push('Indica el nom i cognoms del/de la professional responsable.');
  if(!String(d.registration||'').trim()) missing.push('Indica el número de col·legiació o registre professional.');
  if(!String(d.nif||'').trim()) missing.push('Indica el NIF del/de la professional o responsable.');
  if(!String(d.speciality||'').trim()) missing.push('Indica la professió o especialitat.');
  if(!String(d.serviceCenter||'').trim()) missing.push('Indica el centre/gabinet on es presta el servei.');
  if(!services.length) missing.push('Selecciona almenys un servei que es certificarà.');
  if(!d.viServiceProvided) missing.push('Indica si el servei es prestarà efectivament.');
  if(d.viServiceProvided==='no') missing.push('El servei no es prestarà: cal comunicar aquesta circumstància a la unitat de beques abans de tancar el circuit.');
  if(!String(d.viMemory||'').trim()) missing.push('Incorpora la memòria del servei o programa.');
  if(services.includes('pedagogical') && (!Number.isFinite(weeklyPed)||weeklyPed<=0)) missing.push('Indica les hores setmanals de la reeducació pedagògica.');
  if(services.includes('language') && (!Number.isFinite(weeklyLang)||weeklyLang<=0)) missing.push('Indica les hores setmanals de la reeducació del llenguatge.');
  if(services.includes('highProgram') && (!Number.isFinite(weeklyHigh)||weeklyHigh<=0)) missing.push('Indica les hores setmanals del programa d’altes capacitats.');
  if(!Number.isFinite(duration)||duration<=0) missing.push('Indica la duració previsible en mesos.');
  if(!Number.isFinite(amount)||amount<0) missing.push('Indica l’import mensual del servei.');
  const isReeducationVI=services.includes('pedagogical')||services.includes('language');
  if(isReeducationVI&&!d.viTraining) missing.push('Reeducació: revisa la declaració responsable de formació/qualificació del professional.');
  if(!d.viMemoryCheck) missing.push('Confirma que la memòria està revisada i completa.');
  if(!d.viCross) missing.push('Confirma la revisió de coherència amb Annex IV/III.');
  if(!d.viSign) missing.push('Confirma que l’Annex VI està preparat per a la signatura del professional/gabinet/centre prestador.');
  if(d.annexIVReview && services.length){
   const expected=d.annexIVReview.ivNeed||[];
   if(expected.length && expected.some(x=>!services.includes(x))) missing.push('El servei de l’Annex VI no coincideix amb el servei proposat en l’Annex IV.');
   if(expected.length && services.some(x=>!expected.includes(x))) missing.push('L’Annex VI inclou un servei que no consta en l’Annex IV.');
   const iv= d.annexIVReview, ivDuration=Number(iv.durationMonths);
   if(services.includes('pedagogical')){ const ivH=Number(iv.neededHoursPed); if(Number.isFinite(ivH)&&Math.abs(ivH-weeklyPed)>0.001) missing.push('Les hores setmanals de reeducació pedagògica de l’Annex VI no coincideixen amb les de l’Annex IV.'); }
   if(services.includes('language')){ const ivH=Number(iv.neededHoursLang); if(Number.isFinite(ivH)&&Math.abs(ivH-weeklyLang)>0.001) missing.push('Les hores setmanals de reeducació del llenguatge de l’Annex VI no coincideixen amb les de l’Annex IV.'); }
   if(services.includes('highProgram')){ const ivH=Number(iv.neededHoursHigh); if(Number.isFinite(ivH)&&Math.abs(ivH-weeklyHigh)>0.001) missing.push('Les hores setmanals del programa d’altes capacitats de l’Annex VI no coincideixen amb les de l’Annex IV.'); }
   if(Number.isFinite(ivDuration)&&Math.abs(ivDuration-duration)>0.001) missing.push('La duració de l’Annex VI no coincideix amb la duració prevista de l’Annex IV.');
  }
 }
 if(missing.length){
  document.getElementById('annexSummary').innerHTML=`<div class="notice warn"><strong>Revisió incompleta</strong><ul>${missing.map(x=>`<li>${escA(x)}</li>`).join('')}</ul><p>No tanques encara aquesta revisió.</p></div><button class="btn secondary" data-action="annex-back-result">Tornar al cas</button>`;
  show('annexDone'); return;
 }
 let alerts='';
 if(id==='II'){
  const category=d.annexIIcategory, evidence=d.annexIIevidence;
  if(category==='none'){
   alerts+=`<div class="notice info"><strong>Cap de les anteriors</strong><br>És una opció vàlida del model oficial quan no es certifica cap de les categories anteriors. L’Annex II s’ha de completar i signar igualment.</div>`;
   if(evidence==='no') alerts+=`<div class="notice warn"><strong>Documentació insuficient o absent</strong><br>No s’ha d’assignar una categoria NESE per sospita o diagnòstic pendent. Mantín “cap de les anteriors” i deixa constància de la situació segons l’expedient.</div>`;
   if(evidence==='check') alerts+=`<div class="notice warn"><strong>Cal revisar la documentació</strong><br>La situació no està prou determinada per considerar acreditada una categoria.</div>`;
  }
  if(category!=='none'&&evidence==='no') alerts+=`<div class="notice bad"><strong>Categoria no acreditada</strong><br>No tanques l’Annex II amb aquesta categoria si la documentació falta o no és suficient.</div>`;
  if(category!=='none'&&evidence==='check') alerts+=`<div class="notice warn"><strong>Categoria pendent de verificació</strong><br>“Cal revisar” no equival a acreditació definitiva.</div>`;
 }
 if(id==='III') alerts+=renderDerived('annexIII');
 if(id==='IV'){
  const needs=d.ivNeed||[];
  const pedPct=Number(d.neededHoursPed)>0?((Number(d.centerHoursPTSessions)*Number(d.centerHoursPTMinutes)/60)/Number(d.neededHoursPed))*100:NaN;
  const langPct=Number(d.neededHoursLang)>0?((Number(d.centerHoursALSessions)*Number(d.centerHoursALMinutes)/60)/Number(d.neededHoursLang))*100:NaN;
  const isReeducation=needs.includes('pedagogical')||needs.includes('language');
  if(isReeducation){
   if(needs.includes('pedagogical')) alerts+=`<div class="notice ${pedPct>=100?'bad':'info'}"><strong>Reeducació pedagògica · cobertura PT: ${Number.isFinite(pedPct)?Math.round(pedPct*100)/100:'—'}%</strong><br>${pedPct>=100?'El centre cobreix el 100 % o més de la necessitat pedagògica. Revisa el cas abans de continuar amb reeducació externa.':'Cal que Inspecció certifique els requisits corresponents i que conste la documentació exigida.'}</div>`;
   if(needs.includes('language')) alerts+=`<div class="notice ${langPct>=100?'bad':'info'}"><strong>Reeducació del llenguatge · cobertura AL: ${Number.isFinite(langPct)?Math.round(langPct*100)/100:'—'}%</strong><br>${langPct>=100?'El centre cobreix el 100 % o més de la necessitat de llenguatge. Revisa el cas abans de continuar amb reeducació externa.':'Cal que Inspecció certifique els requisits corresponents i que conste la documentació exigida.'}</div>`;
  }
  if(needs.includes('highProgram')) alerts+=`<div class="notice info"><strong>Altes capacitats</strong><br>El programa específic requereix necessitat específica acreditada, programa no gratuït per l’administració educativa i memòria/certificació del servei.</div>`;
  if(needs.includes('pedagogical')||needs.includes('language')) alerts+=`<div class="notice info"><strong>Annex V</strong><br>Correspon a Inspecció en les propostes de reeducació pedagògica o del llenguatge.</div>`;
 }
 if(typeof state!=='undefined'&&state.data){
  if(id==='IV') state.data.annexIVReview=JSON.parse(JSON.stringify(d));
  if(id==='VI') state.data.annexVIReview=JSON.parse(JSON.stringify(d));
 }
 const summary=Object.entries(d).filter(([,v])=>v!==undefined&&v!==''&&(!Array.isArray(v)||v.length)).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):v}`).join('\n');
 document.getElementById('annexSummary').innerHTML=`${alerts}<div class="notice ok"><strong>Revisió guiada finalitzada.</strong><br>El resultat és una guia de preparació; no substitueix el model oficial ni la signatura corresponent.</div><pre class="summary-pre">${escA(summary||'No s’han registrat respostes.')}</pre><div class="download-actions"><a class="btn primary-btn" href="${OFFICIAL_FORMS_URL}" target="_blank" rel="noopener">Obrir models oficials GVA →</a><button class="btn secondary" data-action="annex-back-result">Tornar al resultat</button></div>`;
 show('annexDone');
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-annex]');if(b){renderAnnexAssistant(b.dataset.annex);return;}if(e.target.closest('[data-action="annex-next"]')){const steps=annexVisibleSteps();if(!steps.length){annexFinish();return;}if(annexState.step<steps.length-1){annexState.step++;renderAnnexStep();}else annexFinish();}if(e.target.closest('[data-action="annex-prev"]')){if(annexState.step>0){annexState.step--;renderAnnexStep();}}if(e.target.closest('[data-action="annex-back-result"]'))show('result');if(e.target.closest('[data-action="annex-home"]'))show('home');});
