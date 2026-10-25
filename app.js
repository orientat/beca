
const state = { step: 1, total: 7, data: {} };

const steps = [
  {
    title: '1. Identificació del supòsit',
    render: renderStep1,
    validate: () => !!state.data.category
  },
  {
    title: '2. Escolarització i edat',
    render: renderStep2,
    validate: () =>
      !!state.data.stage &&
      !!state.data.birthDate &&
      !!state.data.earlySchooling
  },
  {
    title: '3. Acreditació de la necessitat',
    render: renderStep3,
    validate: () =>
      !!state.data.evidence &&
      !!state.data.differentAttention
  },
  {
    title: '4. Centre i cobertura dels conceptes',
    render: renderStep4,
    validate: () =>
      !!state.data.centerType &&
      state.data.publicCoverage !== undefined &&
      state.data.publicCoverage !== ''
  },
  {
    title: '5. Reeducació i altes capacitats',
    render: renderStep5,
    validate: () =>
      !!state.data.reeducation &&
      !!state.data.highNeed &&
      (
        state.data.category !== 'high' &&
        state.data.highNeed !== 'yes' ||
        !!state.data.highProgram
      ) &&
      (
        state.data.reeducation === 'none' ||
        (
          !!state.data.reeducationNature &&
          !!state.data.centerCoverage100 &&
          !!state.data.externalDocs &&
          !!state.data.hoursReviewed
        )
      )
  },
  {
    title: '6. Compatibilitats i opcions',
    render: renderStep6,
    validate: () =>
      !!state.data.generalScholarship &&
      !!state.data.familyLarge
  },
  {
    title: '7. Revisió final',
    render: renderStep7,
    validate: () => true
  }
];

function show(id) {
  document.querySelectorAll('.view').forEach(v =>
    v.classList.remove('active')
  );

  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function esc(v) {
  return String(v ?? '').replace(/[&<>'"]/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[m]);
}

function opt(name, value, label, help = '') {
  const selected =
    state.data[name] === value ? ' selected' : '';

  return `<button type="button"
    class="option${selected}"
    data-field="${name}"
    data-value="${value}"
    aria-pressed="${state.data[name] === value}">
    <strong>${label}</strong>
    ${help ? `<small>${help}</small>` : ''}
  </button>`;
}

/* Conserva l'opció seleccionada després de cada renderització. */
function select(name, options) {
  const current = state.data[name] ?? '';

  return `<select data-input="${name}">
    <option value="">Selecciona…</option>
    ${options.map(x => `
      <option value="${esc(x)}"
        ${current === x ? 'selected' : ''}>
        ${esc(x)}
      </option>
    `).join('')}
  </select>`;
}

function bindOptions() {
  document.querySelectorAll('.option[data-field]').forEach(b => {
    b.onclick = () => {
      state.data[b.dataset.field] = b.dataset.value;
      renderCurrent();
    };
  });
}

function bindFields() {
  document.querySelectorAll('[data-input]').forEach(el => {
    const name = el.dataset.input;

    el.value = state.data[name] ?? '';

    el.oninput = () => {
      state.data[name] = el.value;
    };

    el.onchange = () => {
      state.data[name] = el.value;
      renderCurrent();
    };
  });
}

function renderCurrent() {
  const s = steps[state.step - 1];

  document.getElementById('stepTitle').textContent = s.title;
  document.getElementById('stepCurrent').textContent = state.step;
  document.getElementById('stepTotal').textContent = state.total;

  document.getElementById('progressBar').style.width =
    `${state.step / state.total * 100}%`;

  document.getElementById('stepContent').innerHTML = s.render();

  document.getElementById('prevBtn').disabled = state.step === 1;

  document.getElementById('nextBtn').textContent =
    state.step === state.total
      ? 'Generar revisió →'
      : 'Continuar →';

  bindOptions();
  bindFields();
}

function renderStep1() {
  return `
    <div class="question-title">
      Quina categoria de l’Annex II correspon acreditar?
    </div>

    <div class="question-help">
      La convocatòria exigeix marcar <strong>una sola opció</strong>
      en l’Annex II. Selecciona la categoria que correspon al supòsit
      acreditat; no combines categories del formulari oficial.
    </div>

    <div class="option-grid">
      ${opt('category', 'high', 'ALTES CAPACITATS')}
      ${opt('category', 'disability', 'DISCAPACITAT ≥25 %')}
      ${opt('category', 'adhd_disability', 'TDAH amb discapacitat ≥25 %')}
      ${opt('category', 'adhd_conduct',
        'TDAH associat a trastorn greu de conducta o de comunicació/llenguatge')}
      ${opt('category', 'tea', 'TEA')}
      ${opt('category', 'conduct', 'TRASTORN GREU DE CONDUCTA')}
      ${opt('category', 'communication',
        'TRASTORN GREU DE LA COMUNICACIÓ I DEL LLENGUATGE')}
      ${opt('category', 'motor65', 'DISCAPACITAT MOTORA >65 %')}
      ${opt('category', 'none', 'CAP DE LES ANTERIORS')}
    </div>

    <div class="notice info">
      <strong>Important:</strong> si existeixen diverses condicions
      en un mateix expedient, no les marques totes. L’Annex II oficial
      demana una única opció; cal determinar quin supòsit correspon
      acreditar en aquesta convocatòria.
    </div>
  `;
}

function renderStep2() {
  const cutoff = state.data.category === 'high'
    ? '31/12/2026'
    : '31/12/2025';

  return `
    <div class="question-title">Edat i escolarització</div>

    <div class="question-help">
      Indica la data de naixement i l’ensenyament cursat.
      L’assistent calcularà l’edat respecte de la data de tall aplicable:
      <strong>${cutoff}</strong>.
    </div>

    <div class="field-grid">
      <div class="field">
        <label>Data de naixement</label>
        <input
          data-input="birthDate"
          type="text"
          inputmode="numeric"
          placeholder="dd/mm/aaaa"
          maxlength="10"
          autocomplete="bday"
        >
      </div>

      <div class="field">
        <label>Etapa / ensenyament</label>
        ${select('stage', [
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
        ])}
      </div>
    </div>

    <div class="subquestion">
      <h3>Escolarització primerenca abans dels 2 anys</h3>
      <div class="option-grid">
        ${opt('earlySchooling', 'no', 'No / no és aplicable')}
        ${opt('earlySchooling', 'yes',
          'Sí, per raó de la discapacitat i acreditada')}
      </div>
    </div>

    <div class="notice info">
      <strong>Control:</strong> per al supòsit general es comprova
      l’edat a 31/12/2025; per a altes capacitats, a 31/12/2026.
      L’excepció de l’escolarització primerenca només correspon
      al supòsit previst per discapacitat.
    </div>
  `;
}

function renderStep3() {
  return `
    <div class="question-title">Acreditació de la necessitat</div>

    <div class="question-help">
      Indica la situació documental real de l’expedient.
      En l’Annex II oficial, l’orientació ha de deixar constància
      de l’acreditació corresponent i marcar també si l’alumne/a
      precisa una atenció educativa diferent de l’ordinària.
    </div>

    <div class="option-grid">
      ${opt('evidence', 'valid',
        'Acreditació vàlida i disponible',
        'Consta la documentació exigible segons el supòsit.')}

      ${opt('evidence', 'valid_old',
        'Informe vigent però no actualitzat',
        'Cal comprovar vigència i adequació.')}

      ${opt('evidence', 'pending',
        'Diagnòstic/certificat pendent',
        'No s’ha de tractar com a acreditació definitiva.')}

      ${opt('evidence', 'missing',
        'No consta documentació suficient',
        'Cal revisar l’expedient abans de certificar la necessitat.')}
    </div>

    <div class="subquestion">
      <h3>Precisa una atenció educativa diferent de l’ordinària?</h3>
      <div class="option-grid">
        ${opt('differentAttention', 'yes', 'Sí')}
        ${opt('differentAttention', 'no', 'No')}
      </div>
    </div>
  `;
}

function renderStep4() {
  return `
    <div class="question-title">
      Centre i cobertura dels conceptes
    </div>

    <div class="question-help">
      Aquesta informació condiciona especialment les ajudes
      d’ensenyança i els conceptes ja coberts per serveis/fons públics
      o ajudes al centre.
    </div>

    <div class="field-grid">
      <div class="field">
        <label>Tipus de centre</label>
        ${select('centerType', ['públic', 'concertat', 'privat'])}
      </div>

      <div class="field">
        <label>Cobertura pública / del centre</label>
        ${select('publicCoverage', ['no', 'si', 'no ho sé'])}
      </div>
    </div>

    <div class="notice warning">
      <strong>Atenció:</strong> si un concepte ja està cobert
      per serveis o fons públics o per ajudes al centre, no s’ha
      de proposar automàticament l’ajuda corresponent.
    </div>
  `;
}

function renderStep5() {
  const showHighProgram =
    state.data.category === 'high' ||
    state.data.highNeed === 'yes';

  const showReeducation =
    !!state.data.reeducation &&
    state.data.reeducation !== 'none';

  return `
    <div class="question-title">
      Reeducació i altes capacitats
    </div>

    <div class="question-help">
      Només activa aquests circuits quan corresponga.
      La reeducació no és equivalent al reforç escolar ordinari.
      Les hores de l’Annex IV són una valoració de l’equip
      d’orientació; no són hores sol·licitades per la família.
    </div>

    <div class="option-grid">
      ${opt('reeducation', 'none', 'No hi ha reeducació')}
      ${opt('reeducation', 'pedagogical', 'Reeducació pedagògica')}
      ${opt('reeducation', 'language', 'Reeducació del llenguatge')}
      ${opt('reeducation', 'both', 'Pedagògica i llenguatge')}
    </div>

    <div class="subquestion">
      <h3>És alta capacitat?</h3>
      <div class="option-grid">
        ${opt('highNeed', 'no', 'No')}
        ${opt('highNeed', 'yes', 'Sí')}
        ${opt('highNeed', 'unknown', 'Cal comprovar')}
      </div>
    </div>

    ${showHighProgram ? `
      <div class="subquestion">
        <h3>
          Hi ha necessitat específica acreditada i programa específic?
        </h3>
        <div class="option-grid">
          ${opt('highProgram', 'yes', 'Sí')}
          ${opt('highProgram', 'no', 'No / no consta')}
        </div>
      </div>
    ` : ''}

    ${showReeducation ? `
      <div class="subquestion">
        <h3>Comprovacions prèvies de reeducació</h3>

        <div class="option-grid">
          ${opt('reeducationNature', 'specific',
            'Intervenció específica',
            'No és reforç escolar ordinari.')}

          ${opt('reeducationNature', 'reinforcement',
            'És reforç escolar',
            'No correspon al concepte de reeducació.')}
        </div>

        <div class="field-grid compact">
          <div class="field">
            <label>
              El centre cobreix el 100 % de l’atenció necessària?
            </label>
            ${select('centerCoverage100', ['no', 'yes', 'unknown'])}
          </div>

          <div class="field">
            <label>Documentació externa disponible?</label>
            ${select('externalDocs', ['yes', 'no'])}
          </div>

          <div class="field">
            <label>
              Hores necessàries i del centre revisades a l’Annex IV?
            </label>
            ${select('hoursReviewed', ['yes', 'no', 'unknown'])}
          </div>
        </div>
      </div>
    ` : ''}
  `;
}

function renderStep6() {
  return `
    <div class="question-title">
      Compatibilitats i opcions d’ajuda
    </div>

    <div class="question-help">
      Indica la situació familiar i, si ho saps, els conceptes
      que es volen revisar. El resultat final separarà
      “PROCEDEIX”, “CAL COMPROVAR” i “NO PROCEDEIX”.
    </div>

    <div class="option-grid">
      ${opt('generalScholarship', 'no', 'No té beca general')}
      ${opt('generalScholarship', 'yes', 'Té beca general')}
      ${opt('generalScholarship', 'unknown', 'No consta')}
    </div>

    <div class="subquestion">
      <h3>Família nombrosa</h3>
      <div class="option-grid">
        ${opt('familyLarge', 'no', 'No')}
        ${opt('familyLarge', 'yes', 'Sí')}
        ${opt('familyLarge', 'unknown', 'No consta')}
      </div>
    </div>

    <div class="subquestion">
      <h3>Discapacitat motora superior al 65 %</h3>
      <div class="option-grid">
        ${opt('motorDisability65', 'no', 'No')}
        ${opt('motorDisability65', 'yes', 'Sí')}
        ${opt('motorDisability65', 'unknown', 'No consta')}
      </div>
    </div>

    <div class="subquestion">
      <h3>Conceptes que es volen proposar/revisar</h3>
      <div class="option-grid">
        ${opt('residenceSelected', 'yes', 'Residència')}
        ${opt('residenceSelected', 'no', 'No residència')}
        ${opt('diningSelected', 'yes', 'Menjador')}
        ${opt('diningSelected', 'no', 'No menjador')}
        ${opt('interurbanSelected', 'yes', 'Transport interurbà')}
        ${opt('interurbanSelected', 'no', 'No transport interurbà')}
      </div>
    </div>
  `;
}

function renderStep7() {
  return `
    <div class="question-title">Revisió preparada</div>

    <div class="question-help">
      En generar el resultat, el motor aplicarà les regles incorporades
      i indicarà què està determinat i què requereix comprovació
      professional.
    </div>

    <div class="notice info">
      <strong>Principi:</strong> l’assistent no inventa requisits.
      Si les dades no permeten determinar una qüestió, la marca com
      <strong>CAL COMPROVAR</strong>.
    </div>
  `;
}

function badge(code) {
  return code === 'OK'
    ? 'PROCEDEIX'
    : code === 'NO'
      ? 'NO PROCEDEIX'
      : 'CAL COMPROVAR';
}

function badgeClass(code) {
  return code === 'OK'
    ? 'ok'
    : code === 'NO'
      ? 'bad'
      : 'warn';
}

function renderResult() {
  const r = evaluateCase(state.data);
  const statusLabel = badge(r.overall);

  document.getElementById('resultTitle').textContent = statusLabel;

  const alerts = r.alerts.length
    ? r.alerts.map(x => `
        <div class="result-item ${badgeClass(x.code)}">
          <span class="dot"></span>
          <div>
            <strong>${esc(x.title)}</strong>
            <div>${esc(x.detail)}</div>
          </div>
        </div>
      `).join('')
    : `
        <div class="result-item ok">
          <span class="dot"></span>
          <div>No hi ha alertes addicionals amb les dades introduïdes.</div>
        </div>
      `;

  const aids = r.aids.map(a => `
    <tr>
      <td>${esc(a.label)}</td>
      <td>${a.amount ? `${a.amount} €` : '—'}</td>
      <td>
        <span class="mini-status ${
          a.state === 'PROCEDEIX'
            ? 'ok'
            : a.state === 'NO PROCEDEIX'
              ? 'bad'
              : 'warn'
        }">${esc(a.state)}</span>
      </td>
    </tr>
  `).join('');

  document.getElementById('resultContent').innerHTML = `
    <div class="status-grid">
      <div class="status ${badgeClass(r.overall)}">
        <div class="label">Resultat global</div>
        <strong>${statusLabel}</strong>
      </div>

      <div class="status">
        <div class="label">Annexos base</div>
        <strong>I + II + III</strong>
      </div>

      <div class="status">
        <div class="label">Annexos específics</div>
        <strong>${r.annexes.includes('Annex IV') ? 'IV + VI' : 'No'}</strong>
      </div>

      <div class="status">
        <div class="label">Remissió</div>
        <strong>GUC 1419 · Aportació</strong>
      </div>
    </div>

    <div class="result-section">
      <h3>1. Elegibilitat i acreditació</h3>
      ${
        r.eligibility.items.concat(r.evidence.items).map(x => `
          <div class="result-item ${badgeClass(x.code)}">
            <span class="dot"></span>
            <div>
              <strong>${esc(x.title)}</strong>
              <div>${esc(x.detail)}</div>
            </div>
          </div>
        `).join('') ||
        '<p>La informació introduïda permet continuar amb la revisió.</p>'
      }
    </div>

    <div class="result-section">
      <h3>2. Annex II</h3>
      <div class="notice info">
        <strong>Categoria proposada:</strong>
        ${esc(r.annexII.mark || 'cal determinar')}
      </div>

      ${r.annexII.items.map(x => `
        <div class="result-item ${badgeClass(x.code)}">
          <span class="dot"></span>
          <div>
            <strong>${esc(x.title)}</strong>
            <div>${esc(x.detail)}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="result-section">
      <h3>3. Alertes i incompatibilitats</h3>
      ${alerts}
    </div>

    <div class="result-section">
      <h3>4. Ajudes a revisar en Annex III</h3>
      <table class="amount-table">
        <thead>
          <tr>
            <th>Concepte</th>
            <th>Màxim</th>
            <th>Estat</th>
          </tr>
        </thead>
        <tbody>${aids}</tbody>
      </table>

      <div class="notice warning">
        <strong>Important:</strong> “PROCEDEIX” significa que el circuit
        és compatible amb les regles introduïdes; no equival a concessió
        administrativa.
      </div>
    </div>

    <div class="result-section">
      <h3>5. Annexos i assistents</h3>

      <div class="annex-dashboard">
        ${r.annexes.map(x => {
          const id = x.split(' ')[1];

          const description =
            id === 'I'
              ? 'Verificació d’escolarització i dades del centre.'
              : id === 'II'
                ? 'Assistent detallat d’acreditació NESE.'
                : id === 'III'
                  ? 'Assistent de selecció i comprovació d’ajudes.'
                  : id === 'IV'
                    ? 'Assistent d’informe específic i intensitat del suport.'
                    : 'Memòria/certificació del servei extern.';

          return `
            <div class="annex-card">
              <div>
                <span class="source-tag">${esc(x)}</span>
                <p>${description}</p>
              </div>

              <button class="btn secondary" data-annex="${id}">
                Obrir assistent →
              </button>

              <a
                class="text-link"
                href="https://ceice.gva.es/va/web/dt-valencia/instruccions-documentacio-centres-docents"
                target="_blank"
                rel="noopener"
              >Model oficial GVA</a>
            </div>
          `;
        }).join('')}

        <div class="annex-card info-card">
          <div>
            <span class="source-tag">ANNEX V</span>
            <p>
              Correspon a Inspecció en les propostes de reeducació
              pedagògica o del llenguatge.
            </p>
          </div>

          <button class="btn secondary" data-annex="V">
            Veure instrucció →
          </button>
        </div>
      </div>
    </div>

    <div class="result-section">
      <h3>6. Checklist de remissió</h3>

      <div class="checklist-box">
        ${r.checklist.map(x => `
          <label><input type="checkbox"> ${esc(x)}</label>
        `).join('')}
      </div>

      <div class="notice warning">
        <strong>Termini territorial:</strong> 13 de novembre de 2026.
      </div>
    </div>
  `;

  show('result');
}

/* Navegació principal */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-action]');
  if (!a) return;

  const action = a.dataset.action;

  if (action === 'home') {
    show('home');
  }

  if (action === 'new-case') {
    state.step = 1;
    state.total = steps.length;
    state.data = {};
    renderCurrent();
    document.querySelector('#wizard .eyebrow').textContent = 'NOU EXPEDIENT';
    show('wizard');
  }

  if (action === 'quick') {
    show('quickConsult');
  }

  if (action === 'checklist') {
    show('checklist');
  }

});

document.getElementById('prevBtn').onclick = () => {
  if (state.step > 1) {
    state.step--;
    renderCurrent();
  }
};

document.getElementById('nextBtn').onclick = () => {
  const s = steps[state.step - 1];

  if (!s.validate()) {
    alert('Abans de continuar, completa o comprova aquest apartat.');
    return;
  }

  if (state.step < state.total) {
    state.step++;
    renderCurrent();
  } else {
    renderResult();
  }
};

renderCurrent();
