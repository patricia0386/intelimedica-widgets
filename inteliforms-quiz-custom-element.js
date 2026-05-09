class InteliformsQuiz extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.state = { rol: null, vol: { v: null, n: 0 }, rec: { v: null, m: 1 } };
    this.done  = { rol: false, vol: false, rec: false };
    // Inject Poppins into document head so it loads for shadow DOM too
    if (!document.getElementById('inteliforms-fonts')) {
      const link = document.createElement('link');
      link.id   = 'inteliforms-fonts';
      link.rel  = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap';
      document.head.appendChild(link);
    }
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :host {
          display: block;
          font-family: 'Avenir Next', 'Avenir', 'Nunito Sans', Arial, sans-serif;
          color: #0B1F4B;
          width: 100%;
        }

        .panel { display: block; }
        .panel.hidden { display: none; }

        /* QUESTION BLOCKS */
        .qa-block {
          background: rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 0.75rem;
        }

        .qa-num {
          font-family: 'Poppins', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #4EAFF5;
          margin-bottom: 0.35rem;
        }

        .qa-q {
          font-family: 'Poppins', sans-serif;
          font-size: 0.975rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.85rem;
          line-height: 1.35;
        }

        .qa-opts {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .qa-opt {
          padding: 0.45rem 1.1rem;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.2);
          font-family: 'Avenir Next', 'Avenir', sans-serif;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.15s;
          background: rgba(255,255,255,0.07);
        }

        .qa-opt:hover {
          border-color: #4EAFF5;
          color: #4EAFF5;
          background: rgba(78,175,245,0.1);
        }

        .qa-opt.sel {
          background: #4EAFF5;
          border-color: #4EAFF5;
          color: #0B1F4B;
          font-weight: 600;
        }

        /* SUBMIT */
        .btn-submit {
          width: 100%;
          padding: 0.9rem;
          background: #2E6FE8;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 0.975rem;
          border: none;
          border-radius: 100px;
          cursor: pointer;
          margin-top: 0.5rem;
          opacity: 0.3;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-submit:not([disabled]):hover { transform: translateY(-1px); }
        .btn-submit[disabled] { cursor: not-allowed; }

        /* RESULT */
        .r-label {
          font-family: 'Poppins', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #4EAFF5;
          margin-bottom: 0.4rem;
        }

        .r-name {
          font-family: 'Poppins', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 0.3rem;
        }

        .r-tag {
          font-family: 'Avenir Next', 'Avenir', sans-serif;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.6);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .r-intro {
          font-family: 'Avenir Next', 'Avenir', sans-serif;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
          margin-bottom: 1.25rem;
          background: rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1rem 1.25rem;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .metric {
          background: rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 0.9rem 1rem;
        }

        .m-label {
          font-family: 'Avenir Next', 'Avenir', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.45);
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .m-val {
          font-family: 'Poppins', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #2E6FE8;
          line-height: 1;
        }

        .m-unit {
          font-family: 'Avenir Next', 'Avenir', sans-serif;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.3);
          margin-top: 2px;
        }

        .r-pains {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .r-pain {
          padding: 0.85rem 1rem;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(11,31,75,0.08);
        }

        .r-pain.hot {
          background: rgba(220,38,38,0.05);
          border-color: rgba(220,38,38,0.15);
        }

        .rpt {
          font-family: 'Poppins', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin-bottom: 3px;
        }

        .r-pain.hot .rpt { color: #F09595; }

        .rpb {
          font-family: 'Avenir Next', 'Avenir', sans-serif;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.5;
        }

        /* CTA */
        .r-cta {
          background: #0B1F4B;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 0.75rem;
        }

        .r-cta h4 {
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.35rem;
        }

        .r-cta p {
          font-family: 'Avenir Next', 'Avenir', sans-serif;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.55;
          margin-bottom: 1rem;
        }

        .btn-wa {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #1D9E75;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.8rem 1.5rem;
          border-radius: 100px;
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .btn-wa:hover { opacity: 0.88; }
        .btn-wa svg { width: 18px; height: 18px; fill: white; flex-shrink: 0; }

        .btn-restart {
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          color: rgba(255,255,255,0.4);
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-restart:hover { border-color: rgba(255,255,255,0.35); color: rgba(255,255,255,0.7); }

        @media (max-width: 480px) {
          .qa-block { padding: 1rem 1.1rem; }
          .qa-q { font-size: 0.875rem; }
          .qa-opt { font-size: 0.8rem; padding: 0.4rem 0.85rem; }
          .r-name { font-size: 1.4rem; }
          .metrics { grid-template-columns: 1fr; }
          .m-val { font-size: 1.4rem; }
          .r-cta { padding: 1rem 1.1rem; }
        }
      </style>

      <!-- QUIZ -->
      <div class="panel" id="quiz">
        <div class="qa-block">
          <p class="qa-num">1 — Su rol</p>
          <p class="qa-q">¿Cuál es su rol en la clínica?</p>
          <div class="qa-opts">
            <div class="qa-opt" data-q="rol" data-val="medico" data-n="0">Médico / director</div>
            <div class="qa-opt" data-q="rol" data-val="admin" data-n="0">Secretaria / admin</div>
            <div class="qa-opt" data-q="rol" data-val="gerente" data-n="0">Gerente</div>
          </div>
        </div>

        <div class="qa-block">
          <p class="qa-num">2 — Volumen semanal</p>
          <p class="qa-q">¿Cuántos formularios de seguro procesan por semana?</p>
          <div class="qa-opts">
            <div class="qa-opt" data-q="vol" data-val="low"   data-n="3">1 a 5</div>
            <div class="qa-opt" data-q="vol" data-val="mid"   data-n="10">6 a 15</div>
            <div class="qa-opt" data-q="vol" data-val="high"  data-n="20">16 a 30</div>
            <div class="qa-opt" data-q="vol" data-val="xhigh" data-n="35">Más de 30</div>
          </div>
        </div>

        <div class="qa-block">
          <p class="qa-num">3 — Rechazos</p>
          <p class="qa-q">¿Con qué frecuencia les devuelven o rechazan formularios?</p>
          <div class="qa-opts">
            <div class="qa-opt" data-q="rec" data-val="ok"        data-m="1.0">Casi nunca</div>
            <div class="qa-opt" data-q="rec" data-val="sometimes" data-m="1.4">A veces</div>
            <div class="qa-opt" data-q="rec" data-val="often"     data-m="1.8">Con frecuencia</div>
            <div class="qa-opt" data-q="rec" data-val="battle"    data-m="2.2">Es una lucha constante</div>
          </div>
        </div>

        <button class="btn-submit" id="btnSubmit" disabled>Ver mi diagnóstico →</button>
      </div>

      <!-- RESULT -->
      <div class="panel hidden" id="result">
        <p class="r-label"  id="rLabel">Su diagnóstico</p>
        <h2 class="r-name"  id="rName"></h2>
        <p class="r-tag"    id="rTag"></p>
        <div class="r-intro" id="rIntro"></div>
        <div class="metrics">
          <div class="metric">
            <div class="m-label">Horas de papeleo al mes</div>
            <div class="m-val"  id="mHrs">—</div>
            <div class="m-unit">horas</div>
          </div>
          <div class="metric">
            <div class="m-label">Formularios al mes</div>
            <div class="m-val"  id="mFrm">—</div>
            <div class="m-unit">formularios</div>
          </div>
        </div>
        <div class="r-pains" id="rPains"></div>
        <div class="r-cta">
          <h4 id="rCtaTitle"></h4>
          <p  id="rCtaBody"></p>
          <a class="btn-wa" id="btnWA" href="#" target="_blank">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Hablar con Ítalo
          </a>
        </div>
        <button class="btn-restart" id="btnReiniciar">↺ Responder de nuevo</button>
      </div>
    `;
    this.bindEvents();
  }

  bindEvents() {
    const r = this.shadowRoot;

    r.querySelectorAll('.qa-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const q = opt.dataset.q;
        r.querySelectorAll(`.qa-opt[data-q="${q}"]`).forEach(o => o.classList.remove('sel'));
        opt.classList.add('sel');

        if (q === 'rol') {
          this.state.rol = opt.dataset.val;
          this.done.rol  = true;
        } else if (q === 'vol') {
          this.state.vol = { v: opt.dataset.val, n: parseFloat(opt.dataset.n) };
          this.done.vol  = true;
        } else if (q === 'rec') {
          this.state.rec = { v: opt.dataset.val, m: parseFloat(opt.dataset.m) };
          this.done.rec  = true;
        }

        const allDone = this.done.rol && this.done.vol && this.done.rec;
        const btn = r.getElementById('btnSubmit');
        btn.disabled     = !allDone;
        btn.style.opacity = allDone ? '1' : '0.3';
      });
    });

    r.getElementById('btnSubmit').addEventListener('click',   () => this.showResult());
    r.getElementById('btnReiniciar').addEventListener('click', () => this.restart());
  }

  showResult() {
    const r       = this.shadowRoot;
    const weekly  = this.state.vol.n;
    const monthly = Math.round(weekly * 4.3);
    const mult    = this.state.rec.m;
    const hours   = Math.round(monthly * 0.75 * mult);
    const score   = weekly * mult;
    const roleMap = { medico: 'Médico / Director', admin: 'Secretaria / Admin', gerente: 'Gerente' };

    let rName, rTag, rIntro, ctaTitle, ctaBody;

    if (score < 10) {
      rName    = 'Exposición baja';
      rTag     = 'El papeleo no domina su operación todavía.';
      rIntro   = 'Su clínica maneja un volumen moderado, pero cada formulario consume tiempo real de su equipo. Vale la pena prevenirlo antes de que crezca.';
      ctaTitle = 'Un seguro bien gestionado es una ventaja competitiva.';
      ctaBody  = 'Hablemos 15 minutos. Le mostramos cómo funciona Inteliforms — desde GTQ 750 al mes, sin contratos.';
    } else if (score < 30) {
      rName    = 'Carga operativa activa';
      rTag     = 'Su equipo dedica horas importantes a trabajo que no le corresponde.';
      rIntro   = 'Su equipo fue contratado para administrar su clínica. Los formularios de seguros son una carga extra que nadie les pidió asumir — y que tiene un costo real cada semana.';
      ctaTitle = 'Esas horas pueden volver a ser consultas.';
      ctaBody  = 'Inteliforms se encarga de todo el proceso de seguros. Sin contratos, sin penalizaciones, con 17 años de experiencia en Guatemala.';
    } else {
      rName    = 'Urgencia alta';
      rTag     = 'El papeleo está afectando su clínica y su equipo.';
      rIntro   = 'Cada rechazo reinicia el proceso. Cada hora perdida es una consulta que no ocurrió. Su equipo lleva una carga que no es suya — y eso tiene un costo real cada semana.';
      ctaTitle = 'Esto tiene solución — y es más simple de lo que parece.';
      ctaBody  = 'Menos tiempo al papeleo, más tiempo para sus pacientes. Escríbanos ahora y en 15 minutos le mostramos cómo funciona.';
    }

    r.getElementById('rLabel').textContent    = 'Su diagnóstico · ' + (roleMap[this.state.rol] || '');
    r.getElementById('rName').textContent     = rName;
    r.getElementById('rTag').textContent      = rTag;
    r.getElementById('rIntro').textContent    = rIntro;
    r.getElementById('mHrs').textContent      = hours;
    r.getElementById('mFrm').textContent      = monthly;
    r.getElementById('rCtaTitle').textContent = ctaTitle;
    r.getElementById('rCtaBody').textContent  = ctaBody;

    const pains = [];
    if (this.state.rec.v === 'often' || this.state.rec.v === 'battle')
      pains.push({ hot: true,  title: 'Rechazos que reinician el proceso', body: 'Un dato incorrecto y la aseguradora lo devuelve. Su equipo empieza de cero — solo.' });
    if (this.state.vol.v === 'high' || this.state.vol.v === 'xhigh')
      pains.push({ hot: true,  title: 'Un equipo trabajando por dos', body: 'Su equipo fue contratado para administrar su clínica. Cada formulario que llena es tiempo fuera de su función real.' });
    if (pains.length === 0)
      pains.push({ hot: false, title: 'El riesgo silencioso', body: 'Las clínicas que más sufren son las que esperaron a que fuera urgente.' });

    const pc = r.getElementById('rPains');
    pc.innerHTML = '';
    pains.forEach(p => {
      const d = document.createElement('div');
      d.className = 'r-pain' + (p.hot ? ' hot' : '');
      d.innerHTML = '<div class="rpt">' + p.title + '</div><div class="rpb">' + p.body + '</div>';
      pc.appendChild(d);
    });

    const msg = encodeURIComponent(
      'Hola Ítalo, hice el diagnóstico de Inteliforms.\n\n' +
      'Rol: ' + (roleMap[this.state.rol] || '') + '\n' +
      'Formularios/semana: ' + this.state.vol.v + '\n' +
      'Rechazos: ' + this.state.rec.v + '\n\n' +
      'Diagnóstico: ' + rName + '\n' +
      'Horas estimadas al mes: ' + hours + '\n\n' +
      'Me gustaría saber más sobre Inteliforms.'
    );
    r.getElementById('btnWA').href = 'https://wa.me/50250001296?text=' + msg;

    r.getElementById('quiz').classList.add('hidden');
    r.getElementById('result').classList.remove('hidden');
  }

  restart() {
    const r = this.shadowRoot;
    this.state = { rol: null, vol: { v: null, n: 0 }, rec: { v: null, m: 1 } };
    this.done  = { rol: false, vol: false, rec: false };
    r.querySelectorAll('.qa-opt').forEach(o => o.classList.remove('sel'));
    const btn = r.getElementById('btnSubmit');
    btn.disabled      = true;
    btn.style.opacity = '0.3';
    r.getElementById('result').classList.add('hidden');
    r.getElementById('quiz').classList.remove('hidden');
  }
}

customElements.define('inteliforms-quiz', InteliformsQuiz);
