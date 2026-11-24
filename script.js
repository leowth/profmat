// 1. Atualiza a barra de progresso no topo conforme a leitura (estilo Mathigon)
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.getElementById('progressBar').style.width = scrollPercent + '%';
});

// 2. Destaca o capítulo ativo no menu superior
const sections = document.querySelectorAll('.chapter');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === '#' + current) {
      item.classList.add('active');
    }
  });
});

// 3. Interatividade dos cartões de pergunta rápida (estilo Mathigon)
document.querySelectorAll('.quiz-options').forEach(group => {
  const correctAnswer = group.getAttribute('data-answer');
  const feedback = group.nextElementSibling;
  const buttons = group.querySelectorAll('.quiz-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('correct', 'wrong'));

      const chosen = btn.getAttribute('data-val');
      if (chosen === correctAnswer) {
        btn.classList.add('correct');
        feedback.textContent = '✓ Isso mesmo! Dia 1: 6 → Dia 2: 12 → Dia 3: 24.';
        feedback.style.color = '#065f46';
      } else {
        btn.classList.add('wrong');
        feedback.textContent = 'Quase! Lembre-se de dobrar o resultado a cada passo: 3 → 6 → 12 → ...';
        feedback.style.color = '#9f1239';
      }
    });
  });
});

// 4. VISUALIZAÇÃO 01 — Crescimento Ilimitado vs. Crescimento Limitado (Logístico)
(function initGraficoIterativo() {
  const container = document.getElementById('grafico-iterativo');
  const sliderR = document.getElementById('slider-r1');
  const sliderN = document.getElementById('slider-n1');
  const labelR = document.getElementById('valor-r1');
  const labelN = document.getElementById('valor-n1');

  if (!container || !sliderR || !sliderN || typeof Plotly === 'undefined') return;

  function desenhar() {
    const r = parseFloat(sliderR.value);
    const nMax = parseInt(sliderN.value, 10);
    labelR.textContent = r.toFixed(2);
    labelN.textContent = nMax;

    const passos = [];
    const expVals = [];
    const logVals = [];

    let xExp = 0.05;
    let xLog = 0.05;

    for (let n = 0; n <= nMax; n++) {
      passos.push(n);
      expVals.push(xExp);
      logVals.push(xLog);
      xExp = r * xExp;
      xLog = r * xLog * (1 - xLog);
    }

    const traceExp = {
      x: passos,
      y: expVals,
      mode: 'lines+markers',
      name: 'Sem limite (r·xₙ)',
      line: { color: '#94a3b8', width: 2, dash: 'dash' },
      marker: { size: 5 }
    };

    const traceLog = {
      x: passos,
      y: logVals,
      mode: 'lines+markers',
      name: 'Com limite logístico',
      line: { color: '#2563eb', width: 3 },
      marker: { size: 6 }
    };

    const layout = {
      margin: { t: 25, r: 20, b: 45, l: 50 },
      xaxis: { title: 'Tempo / Passo (n)', dtick: Math.max(1, Math.floor(nMax / 5)) },
      yaxis: { title: 'População relativa (xₙ)', range: [0, 1.2] },
      legend: { orientation: 'h', y: 1.15, x: 0 },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff'
    };

    Plotly.react(container, [traceExp, traceLog], layout, { responsive: true, displayModeBar: false });
  }

  sliderR.addEventListener('input', desenhar);
  sliderN.addEventListener('input', desenhar);
  desenhar();
})();

// 5. VISUALIZAÇÃO 02 — A Parábola Logística f(x) = r * x * (1 - x)
(function initParabolaExemplo() {
  const container = document.getElementById('grafico-parabola');
  const slider = document.getElementById('slider-r2');
  const labelR = document.getElementById('valor-r2');

  if (!container || !slider || typeof Plotly === 'undefined') return;

  function desenhar() {
    const r = parseFloat(slider.value);
    labelR.textContent = r.toFixed(2);

    const xs = [];
    const ys = [];
    const passos = 120;

    for (let i = 0; i <= passos; i++) {
      const x = i / passos;
      xs.push(x);
      ys.push(r * x * (1 - x));
    }

    const traceParabola = {
      x: xs,
      y: ys,
      mode: 'lines',
      name: 'f(x) = r·x·(1 - x)',
      line: { color: '#7c3aed', width: 3 },
      hovertemplate: 'x = %{x:.2f}<br>f(x) = %{y:.3f}<extra></extra>'
    };

    const traceIdentidade = {
      x: [0, 1],
      y: [0, 1],
      mode: 'lines',
      name: 'y = x',
      line: { color: '#cbd5e1', width: 2, dash: 'dot' },
      hoverinfo: 'skip'
    };

    const layout = {
      margin: { t: 25, r: 20, b: 45, l: 50 },
      xaxis: { title: 'x', range: [0, 1] },
      yaxis: { title: 'f(x)', range: [0, 1.05] },
      legend: { orientation: 'h', y: 1.15, x: 0 },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff'
    };

    Plotly.react(container, [traceIdentidade, traceParabola], layout, { responsive: true, displayModeBar: false });
  }

  slider.addEventListener('input', desenhar);
  desenhar();
})();

// 6. VISUALIZAÇÃO 03 — Simulador Interativo Cobweb
(function initCobweb() {
  const container = document.getElementById('grafico-cobweb');
  const sliderR = document.getElementById('slider-r3');
  const sliderX1 = document.getElementById('slider-x1');
  const sliderN = document.getElementById('slider-n3');
  const labelR = document.getElementById('valor-r3');
  const labelX1 = document.getElementById('valor-x1');
  const labelN = document.getElementById('valor-n3');

  if (!container || !sliderR || !sliderX1 || !sliderN || typeof Plotly === 'undefined') return;

  function desenhar() {
    const r = parseFloat(sliderR.value);
    const x1 = parseFloat(sliderX1.value);
    const nPassos = parseInt(sliderN.value, 10);

    labelR.textContent = r.toFixed(2);
    labelX1.textContent = x1.toFixed(2);
    labelN.textContent = nPassos;

    // Curva da parábola
    const curveX = [];
    const curveY = [];
    for (let i = 0; i <= 150; i++) {
      const x = i / 150;
      curveX.push(x);
      curveY.push(r * x * (1 - x));
    }

    // Cálculo dos segmentos do zigue-zague (Cobweb)
    const webX = [x1];
    const webY = [0];
    let atual = x1;

    for (let k = 0; k < nPassos; k++) {
      const proximo = r * atual * (1 - atual);
      // Passo vertical até a parábola: (x_k, x_k) -> (x_k, x_{k+1})
      webX.push(atual);
      webY.push(proximo);
      // Passo horizontal até y = x: (x_k, x_{k+1}) -> (x_{k+1}, x_{k+1})
      webX.push(proximo);
      webY.push(proximo);
      atual = proximo;
    }

    const traceDiagonal = {
      x: [0, 1],
      y: [0, 1],
      mode: 'lines',
      name: 'y = x',
      line: { color: '#94a3b8', width: 2, dash: 'dash' },
      hoverinfo: 'skip'
    };

    const traceParabola = {
      x: curveX,
      y: curveY,
      mode: 'lines',
      name: 'f(x)',
      line: { color: '#2563eb', width: 3 },
      hoverinfo: 'skip'
    };

    const traceTeia = {
      x: webX,
      y: webY,
      mode: 'lines',
      name: 'Teia (Cobweb)',
      line: { color: '#059669', width: 1.8 },
      hovertemplate: 'x = %{x:.3f}<br>y = %{y:.3f}<extra></extra>'
    };

    const traceInicio = {
      x: [x1, atual],
      y: [0, atual],
      mode: 'markers',
      name: 'Início / Atual',
      marker: {
        size: [9, 9],
        color: ['#e11d48', '#059669']
      },
      hovertemplate: '(%{x:.3f}, %{y:.3f})<extra></extra>'
    };

    const layout = {
      margin: { t: 25, r: 20, b: 45, l: 50 },
      xaxis: { title: 'xₙ', range: [0, 1] },
      yaxis: { title: 'xₙ₊₁', range: [0, 1] },
      legend: { orientation: 'h', y: 1.13, x: 0 },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff'
    };

    Plotly.react(container, [traceDiagonal, traceParabola, traceTeia, traceInicio], layout, {
      responsive: true,
      displayModeBar: false
    });
  }

  sliderR.addEventListener('input', desenhar);
  sliderX1.addEventListener('input', desenhar);
  sliderN.addEventListener('input', desenhar);
  desenhar();
})();

// 7. VISUALIZAÇÃO 04 — Sensibilidade às Condições Iniciais (Efeito Borboleta)
(function initCaosComparacao() {
  const container = document.getElementById('grafico-caos');
  const sliderR = document.getElementById('slider-r4');
  const sliderDiff = document.getElementById('slider-diff');
  const labelR = document.getElementById('valor-r4');
  const labelDiff = document.getElementById('valor-diff');

  if (!container || !sliderR || !sliderDiff || typeof Plotly === 'undefined') return;

  function desenhar() {
    const r = parseFloat(sliderR.value);
    const diff = parseFloat(sliderDiff.value);
    labelR.textContent = r.toFixed(2);
    labelDiff.textContent = diff.toFixed(3);

    const nMax = 30;
    const passos = [];
    const orbitaA = [];
    const orbitaB = [];

    let xA = 0.2;
    let xB = Math.min(0.99, 0.2 + diff);

    for (let n = 0; n <= nMax; n++) {
      passos.push(n);
      orbitaA.push(xA);
      orbitaB.push(xB);
      xA = r * xA * (1 - xA);
      xB = r * xB * (1 - xB);
    }

    const traceA = {
      x: passos,
      y: orbitaA,
      mode: 'lines+markers',
      name: 'x₁ = 0.200',
      line: { color: '#2563eb', width: 2.2 },
      marker: { size: 5 }
    };

    const traceB = {
      x: passos,
      y: orbitaB,
      mode: 'lines+markers',
      name: 'x₁ + Δx',
      line: { color: '#e11d48', width: 2.2, dash: 'dot' },
      marker: { size: 5 }
    };

    const layout = {
      margin: { t: 25, r: 20, b: 45, l: 50 },
      xaxis: { title: 'Iteração (n)', range: [0, nMax] },
      yaxis: { title: 'Valor de xₙ', range: [0, 1] },
      legend: { orientation: 'h', y: 1.15, x: 0 },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff'
    };

    Plotly.react(container, [traceA, traceB], layout, { responsive: true, displayModeBar: false });
  }

  sliderR.addEventListener('input', desenhar);
  sliderDiff.addEventListener('input', desenhar);
  desenhar();
})();