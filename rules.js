
/* Motor de decisions · Beques NESE 2026-2027
   Font principal: convocatòria estatal 2026-2027 + instruccions territorials DT València 2026/27.
   No substitueix la revisió professional ni la resolució administrativa.
*/

const RULES = {
  dates: {
    ageCutoff: '2025-12-31',
    highAgeCutoff: '2026-12-31',
    familyApplicationEnd: '2026-09-10',
    centerSubmissionEnd: '2026-11-13'
  },
  annexes: {
    base: ['Annex I', 'Annex II', 'Annex III'],
    specific: ['Annex IV', 'Annex VI'],
    inspection: 'Annex V'
  },
  amounts: {
    teaching: 862,
    interurbanTransport: 617,
    dining: 574,
    residence: 1795,
    weekendTransport: 442,
    urbanTransport: 308,
    materialPrimary: 105,
    materialOtherPostCompulsory: 204,
    pedagogicalReeducation: 913,
    languageReeducation: 913,
    highAbilities: 913,
    fixedSubsidy: 400
  }
};

const STAGE_KEYS = new Set([
  'Educació Infantil',
  'Educació Primària',
  'ESO',
  'CFGB',
  'Batxillerat',
  'CFGM',
  'CFGS',
  'Ensenyances artístiques professionals',
  'PTVA',
  'Altres programes formatius FP'
]);

const HIGH_STAGES = new Set([
  'Educació Primària',
  'ESO',
  'Batxillerat',
  'CFGM',
  'CFGS',
  'Ensenyances artístiques professionals'
]);

function status(code, title, detail, source = '') {
  return { code, title, detail, source };
}

/* Calcula l'edat en una data de referència.
   Admet dd/mm/aaaa i aaaa-mm-dd.
*/
function ageAtCutoff(birthDate, cutoff) {
  if (!birthDate) return NaN;

  const raw = String(birthDate).trim();
  const match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const iso = match
    ? `${match[3]}-${match[2]}-${match[1]}`
    : raw;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return NaN;

  const b = new Date(`${iso}T00:00:00`);
  const c = new Date(`${cutoff}T00:00:00`);

  if (
    Number.isNaN(b.getTime()) ||
    Number.isNaN(c.getTime()) ||
    b > c
  ) {
    return NaN;
  }

  // Evita que dates inexistents, com 31/02, siguen acceptades.
  const [year, month, day] = iso.split('-').map(Number);

  if (
    b.getFullYear() !== year ||
    b.getMonth() !== month - 1 ||
    b.getDate() !== day
  ) {
    return NaN;
  }

  let age = c.getFullYear() - b.getFullYear();

  const beforeBirthday =
    c.getMonth() < b.getMonth() ||
    (
      c.getMonth() === b.getMonth() &&
      c.getDate() < b.getDate()
    );

  if (beforeBirthday) age--;

  return age;
}

function evaluateEligibility(d) {
  const out = { overall: 'OK', items: [] };

  const cutoff = d.category === 'high'
    ? RULES.dates.highAgeCutoff
    : RULES.dates.ageCutoff;

  const age = Number.isFinite(Number(d.age)) && d.age !== ''
    ? Number(d.age)
    : ageAtCutoff(d.birthDate, cutoff);

  const ageOk = Number.isFinite(age);

  if (!ageOk || !STAGE_KEYS.has(d.stage)) {
    out.overall = 'CHECK';
    out.items.push(
      status(
        'CHECK',
        'Edat/escolarització',
        'Cal completar i comprovar l’edat i l’ensenyament cursat segons la categoria seleccionada.'
      )
    );
    return out;
  }

  if (
    [
      'disability',
      'conduct',
      'communication',
      'tea',
      'adhd',
      'adhd_disability',
      'adhd_conduct',
      'motor65'
    ].includes(d.category) &&
    age < 2
  ) {
    const early = d.earlySchooling === 'yes';

    if (
      !(
        early &&
        [
          'disability',
          'adhd',
          'adhd_disability',
          'motor65'
        ].includes(d.category)
      )
    ) {
      out.overall = 'NO';
      out.items.push(
        status(
          'NO',
          'Edat mínima',
          'Per als supòsits indicats, l’alumnat ha de tindre 2 anys complits a 31/12/2025. Només s’admet l’excepció prevista quan existeix escolarització més primerenca per raó de la discapacitat i està acreditada.'
        )
      );
    } else {
      out.items.push(
        status(
          'CHECK',
          'Escolarització primerenca',
          'Menor de 2 anys: cal acreditar que l’escolarització més primerenca es deu a les característiques de la discapacitat.'
        )
      );
    }
  }

  if (d.category === 'none') {
    out.overall = 'NO';
    out.items.push(
      status(
        'NO',
        'Cap categoria NESE acreditada',
        'Amb les dades introduïdes no es certifica cap de les categories de l’Annex II. L’Annex II s’ha de completar igualment, però no queda acreditada la condició NESE necessària per proposar les ajudes/subsidis de la convocatòria.'
      )
    );
    return out;
  }

  if (d.category === 'high') {
    if (age < 6) {
      out.overall = 'NO';
      out.items.push(
        status(
          'NO',
          'Altes capacitats: edat',
          'Cal tindre 6 anys complits a 31/12/2026.'
        )
      );
    }

    if (!HIGH_STAGES.has(d.stage)) {
      out.overall = 'NO';
      out.items.push(
        status(
          'NO',
          'Altes capacitats: escolarització',
          'L’alumnat d’altes capacitats ha d’estar escolaritzat en els nivells admesos per la convocatòria.'
        )
      );
    }

    if (d.highNeed !== 'yes') {
      out.overall = 'CHECK';
      out.items.push(
        status(
          'CHECK',
          'Altes capacitats: necessitat específica',
          'Cal acreditar la necessitat específica associada a alta capacitat mitjançant l’equip d’orientació/informe sociopsicopedagògic.'
        )
      );
    }
  }

  if (
    ['adhd', 'adhd_disability', 'adhd_conduct'].includes(d.category)
  ) {
    if (
      d.category === 'adhd' &&
      d.adhdAssociation !== 'yes'
    ) {
      out.overall = 'NO';
      out.items.push(
        status(
          'NO',
          'TDAH per si sol no basta',
          'Cal que el TDAH estiga associat al supòsit exigit per la convocatòria: discapacitat, trastorn greu de conducta o trastorn greu de la comunicació/llenguatge associat a NEE.'
        )
      );
    }
  }

  return out;
}

function evaluateEvidence(d) {
  const out = { overall: 'OK', items: [] };

  if (d.evidence === 'pending' || d.evidence === 'missing') {
    out.overall = 'NO';
    out.items.push(
      status(
        'NO',
        'Acreditació insuficient',
        'Un diagnòstic pendent, una sospita o la falta de documentació exigible no permet tractar la necessitat com a acreditada.'
      )
    );
  } else if (d.evidence === 'valid_old') {
    out.overall = 'CHECK';
    out.items.push(
      status(
        'CHECK',
        'Informe vigent però no actualitzat',
        'No s’ha de descartar només per antiguitat. Cal comprovar vigència, contingut i si continua sustentant la necessitat actual.'
      )
    );
  }

  return out;
}

function evaluateAnnexII(d) {
  const out = { mark: null, items: [] };

  if (d.evidence === 'pending' || d.evidence === 'missing') {
    out.mark = 'cap';
    out.items.push(
      status(
        'CHECK',
        'Annex II',
        'Si no es pot acreditar cap categoria, cal marcar la situació que corresponga segons el formulari, inclosa “cap de les anteriors” quan no es certifique cap categoria.'
      )
    );
  } else {
    out.mark = d.category;
  }

  if (d.motorDisability65 === 'yes') {
    out.items.push(
      status(
        'INFO',
        'Discapacitat motora >65 %',
        'Comprovar el supòsit perquè incrementa un 50 % les quanties de transport urbà/interurbà.'
      )
    );
  }

  return out;
}

function evaluateAids(d) {
  const aids = [];
  const alerts = [];

  // Els valors han de coincidir amb els que envia app.js.
  const privateCenter = d.centerType === 'privat';

  const covered = d.publicCoverage === 'si';
  const coverageUnknown = d.publicCoverage === 'no ho sé';

  if (d.category === 'high') {
    aids.push({
      key: 'highAbilities',
      label: 'Programa específic d’altes capacitats',
      amount: RULES.amounts.highAbilities,
      state: d.highProgram === 'yes'
        ? 'PROCEDEIX'
        : 'CAL COMPROVAR'
    });

    aids.push({
      key: 'fixedSubsidy',
      label: 'Subsidi fix per despeses generals',
      amount: RULES.amounts.fixedSubsidy,
      state: 'PROCEDEIX'
    });

    alerts.push(
      status(
        'INFO',
        'Altes capacitats',
        'En aquest circuit no es proposen les ajudes ordinàries de transport, menjador, material, etc.; es revisa el programa específic i el subsidi fix.'
      )
    );

    return { aids, alerts };
  }

  if (d.category === 'none') {
    alerts.push(
      status(
        'NO',
        'Ajudes NESE',
        'No es proposa cap ajuda/subsidi perquè no s’ha certificat cap categoria NESE a l’Annex II. L’Annex III s’ha de completar igualment i, si escau, marcar «No procedeix cap de les anteriors».'
      )
    );

    return { aids, alerts };
  }

  if (privateCenter) {
    aids.push({
      key: 'teaching',
      label: 'Ajuda d’ensenyança',
      amount: RULES.amounts.teaching,
      state: (covered || coverageUnknown)
        ? 'CAL COMPROVAR'
        : 'PROCEDEIX'
    });
  } else {
    alerts.push(
      status(
        'INFO',
        'Ajuda d’ensenyança',
        'Segons les instruccions de treball incorporades a aquest motor, l’ajuda d’ensenyança és només per a centres privats.'
      )
    );
  }

  // La categoria de discapacitat també s'ha de considerar
  // en comprovar l'elegibilitat de transport.
  const transportEligible = [
    'disability',
    'adhd_disability',
    'motor65'
  ].includes(d.category);

  const common = [
    [
      'interurbanTransport',
      'Transport interurbà',
      RULES.amounts.interurbanTransport
    ],
    ['dining', 'Menjador', RULES.amounts.dining],
    ['residence', 'Residència', RULES.amounts.residence],
    [
      'weekendTransport',
      'Transport cap de setmana',
      RULES.amounts.weekendTransport
    ],
    ['urbanTransport', 'Transport urbà', RULES.amounts.urbanTransport]
  ];

  common.forEach(([key, label, amount]) => {
    let state = (covered || coverageUnknown)
      ? 'CAL COMPROVAR'
      : 'A REVISAR';

    if (
      (key === 'interurbanTransport' || key === 'urbanTransport') &&
      !transportEligible
    ) {
      state = 'NO PROCEDEIX';
    }

    aids.push({ key, label, amount, state });
  });

  if (!transportEligible) {
    alerts.push(
      status(
        'NO',
        'Transport urbà/interurbà',
        'Per a les opcions de transport urbà/interurbà de l’Annex III cal comprovar que es complisquen els requisits aplicables. La categoria introduïda no acredita per si mateixa el requisit de discapacitat.'
      )
    );
  }

  const infant = d.stage === 'Educació Infantil';

  if (!infant) {
    aids.push({
      key: 'material',
      label: 'Material escolar',
      amount:
        d.stage === 'Educació Primària' ||
        d.stage === 'ESO' ||
        d.stage === 'CFGB'
          ? RULES.amounts.materialPrimary
          : RULES.amounts.materialOtherPostCompulsory,
      state: (covered || coverageUnknown)
        ? 'CAL COMPROVAR'
        : 'A REVISAR'
    });
  } else {
    alerts.push(
      status(
        'INFO',
        'Material escolar',
        'Les instruccions territorials incorporades a aquest motor indiquen que l’ajuda de material no és aplicable a Educació Infantil.'
      )
    );
  }

  if (
    d.reeducation === 'pedagogical' ||
    d.reeducation === 'both'
  ) {
    const result = evaluateReeducation(d, 'pedagogical');

    aids.push({
      key: 'pedagogicalReeducation',
      label: 'Reeducació pedagògica',
      amount: RULES.amounts.pedagogicalReeducation,
      state: result.state
    });

    alerts.push(...result.alerts);
  }

  if (
    d.reeducation === 'language' ||
    d.reeducation === 'both'
  ) {
    const result = evaluateReeducation(d, 'language');

    aids.push({
      key: 'languageReeducation',
      label: 'Reeducació del llenguatge',
      amount: RULES.amounts.languageReeducation,
      state: result.state
    });

    alerts.push(...result.alerts);
  }

  if (d.familyLarge === 'yes') {
    alerts.push(
      status(
        'INFO',
        'Família nombrosa',
        'Els subsidis específics per família nombrosa es limiten a transport urbà/interurbà i menjador, segons les regles incorporades al motor.'
      )
    );
  }

  aids.push({
    key: 'fixedSubsidy',
    label: 'Subsidi fix per despeses generals',
    amount: RULES.amounts.fixedSubsidy,
    state: 'PROCEDEIX'
  });

  return { aids, alerts };
}

function evaluateReeducation(d, kind) {
  const type = kind === 'pedagogical'
    ? 'pedagògica'
    : 'del llenguatge';

  if (d.reeducationNature !== 'specific') {
    return {
      state: 'NO PROCEDEIX',
      alerts: [
        status(
          'NO',
          'Reeducació ' + type,
          'La reeducació no s’ha de confondre amb reforç escolar ordinari. Cal que la intervenció responga al supòsit específic de la convocatòria/instruccions.'
        )
      ]
    };
  }

  if (d.centerCoverage100 === 'yes') {
    return {
      state: 'NO PROCEDEIX',
      alerts: [
        status(
          'NO',
          'Cobertura del centre del 100%',
          'Si el centre cobreix el 100 % de l’atenció, cal comprovar l’aplicació de les instruccions corresponents abans de proposar reeducació externa.'
        )
      ]
    };
  }

  if (d.externalDocs !== 'yes') {
    return {
      state: 'CAL COMPROVAR',
      alerts: [
        status(
          'CHECK',
          'Documentació de reeducació',
          'Cal disposar de la documentació corresponent; la falta de documentació pot impedir la concessió.'
        )
      ]
    };
  }

  if (d.hoursReviewed !== 'yes') {
    return {
      state: 'CAL COMPROVAR',
      alerts: [
        status(
          'CHECK',
          'Hores de l’Annex IV',
          'L’equip d’orientació ha de revisar les hores setmanals necessàries i les hores que aporta el centre; el percentatge es determina amb aquestes dades.'
        )
      ]
    };
  }

  return { state: 'PROCEDEIX', alerts: [] };
}

function evaluateIncompatibilities(d) {
  const items = [];

  if (d.generalScholarship === 'yes') {
    items.push(
      status(
        'NO',
        'Beca general',
        'Les ajudes/subsidis NESE són incompatibles amb les beques de caràcter general, segons les instruccions de tramitació incorporades al motor.'
      )
    );
  }

  if (
    d.publicCoverage === 'si' ||
    d.publicCoverage === 'no ho sé'
  ) {
    items.push(
      status(
        'CHECK',
        'Duplicació de cobertura',
        'Cal comprovar si els conceptes sol·licitats ja estan coberts suficientment per serveis/fons públics o ajudes al centre.'
      )
    );
  }

  if (
    d.residenceSelected === 'yes' &&
    d.diningSelected === 'yes'
  ) {
    items.push(
      status(
        'NO',
        'Residència + menjador',
        'La residència és incompatible amb menjador, segons les regles incorporades al motor.'
      )
    );
  }

  if (
    d.residenceSelected === 'yes' &&
    d.interurbanSelected === 'yes'
  ) {
    items.push(
      status(
        'NO',
        'Residència + transport',
        'La residència és incompatible amb transport, excepte el transport de cap de setmana, segons les regles incorporades al motor.'
      )
    );
  }

  return items;
}

function evaluateCase(d) {
  const eligibility = evaluateEligibility(d);
  const evidence = evaluateEvidence(d);
  const annexII = evaluateAnnexII(d);
  const aidsResult = evaluateAids(d);
  const incompatibilities = evaluateIncompatibilities(d);

  const alerts = [
    ...eligibility.items,
    ...evidence.items,
    ...aidsResult.alerts,
    ...incompatibilities
  ];

  const hardNo = alerts.some(x => x.code === 'NO');
  const check = alerts.some(x => x.code === 'CHECK');

  const overall = hardNo
    ? 'NO'
    : check
      ? 'CHECK'
      : 'OK';

  const needsSpecific =
    (d.reeducation && d.reeducation !== 'none') ||
    d.category === 'high';

  const annexes = [
    ...RULES.annexes.base,
    ...(needsSpecific ? RULES.annexes.specific : [])
  ];

  const checklist = [
    'Annex I: acreditació d’escolarització, per a totes les sol·licituds.',
    'Annex II: acreditació NESE, per a totes les sol·licituds.',
    'Annex III: ajudes proposades, per a totes les sol·licituds.',
    ...(needsSpecific
      ? [
          'Annex IV: informe específic d’orientació, si hi ha reeducació o altes capacitats.',
          'Annex VI: memòria/certificació, si hi ha reeducació o altes capacitats.'
        ]
      : []),
    'Annex V: el completa Inspecció quan corresponga; no s’inclou en la remissió del centre.',
    'Un únic PDF per alumne/a amb tots els annexos aplicables.',
    'Aplanar el PDF i comprovar el nom 26EE1-XXXXXX.',
    'Remetre per GUC 1419 → Aportació dins del termini territorial.'
  ];

  return {
    overall,
    eligibility,
    evidence,
    annexII,
    aids: aidsResult.aids,
    alerts,
    annexes,
    checklist
  };
}

