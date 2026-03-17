/* ============================================================
   SIAMO HUMUS — Fango Fertile
   main.js  ·  p5.js global mode
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────
   DATI: parole-concetto
   ───────────────────────────────────────────── */
const WORDS_DATA = [
  { word: 'fango',         def: 'la materia prima, il disordine fecondo da cui nasce l\'imprevisto. Non è mancanza di forma — è eccesso di possibilità.' },
  { word: 'siamo humus',   def: 'terra che pensa, codice che sente. Figure di filo, rete, responso-abilità. Siamo humus.' },
  { word: 'compost',       def: 'ciò che siamo. Materia fertile fatta di bit, carne, ricordi, decomposizione. Il farsi comune del mondo.' },
  { word: 'hacker',        def: 'chi non subisce la macchina, ma gioca con essa. Trasforma il limite in possibilità e lo strumento di controllo in spazio di libertà.' },
  { word: 'skholè',        def: 'l\'essere padroni del proprio tempo, liberato dal profitto e restituito alla contemplazione.' },
  { word: 'matassa',       def: 'un passare e ricevere fili, sciogliendoli e intrecciandoli. Una pratica per pensare e fare allo stesso tempo. Non si vince.' },
  { word: 'filo',          def: 'un\'identità, un modo di essere, un codice. Un uno che non è mai uno.' },
  { word: 'nodo',          def: 'la parte che è nel tutto. Un punto di incontro dove vari fili convergono.' },
  { word: 'rete',          def: 'il tutto che è nella parte. Fatta di incontri, storie, fili che si intrecciano, si aggrovigliano, si scambiano.' },
  { word: 'intreccio',     def: 'una trama invisibile che tessiamo ogni giorno, fatta di relazioni, scambi e intra-azioni.' },
  { word: 'cyborg',        def: 'modello operativo poroso, tra umano e animale, organico e meccanico. Via d\'uscita dai dualismi.' },
  { word: 'script',        def: 'l\'invisibile codice che detta i nostri comportamenti e ci trasforma in macchine.' },
  { word: 'cambiodirotta', def: 'lo script che si rompe. Non fuga, ma deviazione consapevole verso nuovi territori.' },
  { word: 'orologio',      def: 'la prigione di Chrònos, che segna la scansione non di bisogni ma di necessità funzionali.' },
  { word: 'radice',        def: 'ciò che ci tiene fermi, ancorati alla nostra vera natura: quella di humus.' },
  { word: 'gioco',         def: 'lo strumento prediletto dell\'hacker, capace di restituire il piacere della conoscenza e di scoprire nuovi mondi.' },
  { word: 'insieme',       def: 'l\'unica modalità di sopravvivenza nello Chthulucene. Nulla si fa da sé, tutto nasce tra le specie.' },
  { word: 'significato',   def: 'ciò che emerge quando smettiamo di produrre e iniziamo a sentire. La risonanza tra il nostro humus interno e il mondo.' },
  { word: 'umani',         def: 'non siamo umani solo perché nati, dobbiamo diventarlo.' },
  { word: 'rincorrere',    def: 'il movimento costante della società della prestazione. È l\'illusione di una crescita che non permette soste, in vista di un\'ottimizzazione non umana.' },
  { word: 'velocità',      def: 'non è rapidità, ma saturazione: un rumore bianco che non permette alla risonanza di avere luogo.' },
  { word: 'tempo',         def: 'la risorsa che abbiamo smesso di abitare per iniziare a consumare. Hackerare il tempo significa riappropriarsene, così da riscoprire se stessi.' },
  { word: 'stare a contatto con il problema', def: 'l\'invito di Haraway a non scappare, ad abitare le contraddizioni del presente restandone ingarbugliati, senza cercare facili soluzioni asettiche.' },
  { word: 'moltitudine',   def: 'il superamento dell\'Inferno dell\'Uguale, diversità che si scambiano senza annullarsi.' },
  { word: 'altro',         def: 'lo specchio necessario, un agente di senso multiplo con il quale coevolviamo.' },
  { word: 'gioco della matassa', def: 'un passare e ricevere fili, sciogliendoli e intrecciandoli, una pratica per pensare e per fare allo stesso tempo, in cui la configurazione cambia continuamente e nessuno gioca da solo. Non si vince.' },
  { word: 'creativecoding', def: 'pratica che permette di praticare la skholé, di usare l\'algoritmo non per far funzionare le cose, ma per farle risonare.' },
  { word: 'consapevolezza', def: 'il risveglio dall\'incubo dello script, è accorgersi di poter fare del tempo il nostro tempo.' },
  { word: 'corpi',          def: 'elementi da biohackerare, entità che problematizzano la nozione di individualità e di organismo.' },
  { word: 'mente',          def: 'processore di informazioni saturato dalla velocità, può scegliere il gioco al posto della funzione, così da liberarsi.' },
  { word: 'anima',          def: 'espulsa dalla società per favorire la pura operatività, può riscattarsi solo dando senso al gioco della matassa.' },
];

/* ─────────────────────────────────────────────
   STATO GLOBALE
   ───────────────────────────────────────────── */
let phase            = 'intro';
let introAlpha       = 255;
let flowParticles    = [];
const FLOW_NUM       = 2222;
const noiseScale     = 100;
const noiseStrength  = 1;

let fangoParticles   = [];
let nodes            = [];
let draggingNode     = null;
let pressedNode      = null;
let mouseDownX       = 0;
let mouseDownY       = 0;
let firstDiscovery   = false;
let hintHidden       = false;
let discoveryEnabled = false;
let currentSection   = 'home';
let cursorBlink      = 0;

/* ─────────────────────────────────────────────
   PALETTE COLORI flow field
   ───────────────────────────────────────────── */
const FLOW_PALETTE = [
  [255, 200, 255],
  [180, 255, 210],
  [255, 220, 140],
  [140, 210, 255],
  [255, 155, 155],
  [200, 175, 255],
  [255, 245, 175],
  [160, 255, 240],
  [255, 190, 130],
];

/* ─────────────────────────────────────────────
   POPUP — creato via JS, nessuna modifica a index.html
   ───────────────────────────────────────────── */
function createPopup() {
  const style = document.createElement('style');
  style.textContent = `
    #word-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.96);
      z-index: 100;
      width: min(480px, 88vw);
      background: rgba(4, 6, 4, 0.97);
      border: 0.5px solid rgba(200, 185, 155, 0.18);
      padding: 48px 52px 44px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.4s ease;
      font-family: 'Georgia', serif;
    }
    #word-popup.visible {
      opacity: 1;
      pointer-events: all;
      transform: translate(-50%, -50%) scale(1);
    }
    #word-popup .popup-word {
      font-size: 26px;
      font-weight: 400;
      color: rgba(230, 215, 185, 0.95);
      margin-bottom: 18px;
      letter-spacing: 0.03em;
      line-height: 1.2;
    }
    #word-popup .popup-def {
      font-size: 14px;
      line-height: 1.85;
      color: rgba(190, 175, 145, 0.75);
    }
    #word-popup .popup-close {
      position: absolute;
      top: 18px;
      right: 22px;
      background: none;
      border: none;
      color: rgba(200, 185, 155, 0.3);
      cursor: pointer;
      font-size: 15px;
      font-family: 'Georgia', serif;
      transition: color 0.3s;
      line-height: 1;
      padding: 4px;
    }
    #word-popup .popup-close:hover {
      color: rgba(200, 185, 155, 0.9);
    }
    #word-popup .popup-divider {
      width: 32px;
      height: 0.5px;
      background: rgba(200, 185, 155, 0.15);
      margin: 22px 0 0;
    }
    #word-popup-overlay {
      position: fixed;
      inset: 0;
      z-index: 99;
      background: rgba(0, 0, 0, 0);
      pointer-events: none;
      transition: background 0.4s ease;
    }
    #word-popup-overlay.visible {
      background: rgba(0, 0, 0, 0.45);
      pointer-events: all;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'word-popup-overlay';
  overlay.addEventListener('click', closeWordPopup);
  document.body.appendChild(overlay);

  const popup = document.createElement('div');
  popup.id = 'word-popup';
  popup.innerHTML = `
    <button class="popup-close" id="popup-close-btn">✕</button>
    <div class="popup-word"  id="popup-word"></div>
    <div class="popup-def"   id="popup-def"></div>
    <div class="popup-divider"></div>
  `;
  document.body.appendChild(popup);

  document.getElementById('popup-close-btn').addEventListener('click', closeWordPopup);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeWordPopup();
  });
}

function openWordPopup(word, def) {
  document.getElementById('popup-word').textContent = word;
  document.getElementById('popup-def').textContent  = def;
  document.getElementById('word-popup').classList.add('visible');
  document.getElementById('word-popup-overlay').classList.add('visible');
}

function closeWordPopup() {
  document.getElementById('word-popup').classList.remove('visible');
  document.getElementById('word-popup-overlay').classList.remove('visible');
}

/* ─────────────────────────────────────────────
   CLASSE: FlowParticle
   ───────────────────────────────────────────── */
class FlowParticle {
  constructor() {
    this.loc   = createVector(random(width * 1.2), random(height));
    this.dir   = createVector(1, 0);
    this.speed = random(5, 20);
    const col  = random(FLOW_PALETTE);
    this.r     = col[0];
    this.g     = col[1];
    this.b     = col[2];
    this.sz    = random(1, 4);
    this.vx    = 0;
    this.vy    = 0;
  }

  run(particleAlpha) {
    this.move();
    this.checkEdges();
    this.display(particleAlpha);
  }

  move() {
    const dx        = this.loc.x - mouseX;
    const dy        = this.loc.y - mouseY;
    const d         = sqrt(dx * dx + dy * dy);
    const R         = 200;
    const influence = d < R ? map(d, 0, R, 1.8, 0) : 0;

    const sampleX = (this.loc.x - mouseX) / noiseScale;
    const sampleY = (this.loc.y - mouseY) / noiseScale;

    const angle =
      noise(sampleX, sampleY, frameCount / noiseScale)
      * TWO_PI * noiseStrength
      + this.loc.x * 0.003;

    this.dir.x = sin(angle);
    this.dir.y = tan(angle);

    const vel = this.dir.copy();
    vel.mult(this.speed * 22);

    this.vx += (dx / (d + 0.001)) * influence * 0.4;
    this.vy += (dy / (d + 0.001)) * influence * 0.4;
    this.vx *= 0.92;
    this.vy *= 0.92;

    this.loc.x += vel.x + this.vx;
    this.loc.y += vel.y + this.vy;
  }

  checkEdges() {
    if (this.loc.x < 0  || this.loc.x > width ||
        this.loc.y < 0  || this.loc.y > height) {
      this.loc.x = random(width * 10);
      this.loc.y = random(height);
      this.vx = 0;
      this.vy = 0;
    }
  }

  display(a) {
    noStroke();
    fill(this.r, this.g, this.b, a);
    ellipse(this.loc.x, this.loc.y, this.sz);
  }
}

/* ─────────────────────────────────────────────
   CLASSE: FangoParticle
   ───────────────────────────────────────────── */
class FangoParticle {
  constructor() { this.init(); }

  init() {
    this.x          = random(width);
    this.y          = random(height);
    this.ox         = 0;
    this.oy         = 0;
    this.vx         = 0;
    this.vy         = 0;
    this.sz         = random(0.4, 1.9);
    this.speed      = random(0.10, 0.38);
    this.angle      = random(TWO_PI);
    this.angleSpeed = random(-0.009, 0.009);
    this.baseAlpha  = random(8, 52);

    const h = random(24, 58);
    const s = random(10, 38) / 100;
    const l = random(35, 68) / 100;
    const [r, g, b] = hslToRgb(h, s, l);
    this.r = r; this.g = g; this.b = b;
  }

  update() {
    this.angle += this.angleSpeed;
    this.ox    += cos(this.angle) * this.speed + random(-0.26, 0.26);
    this.oy    += sin(this.angle) * this.speed * 0.70 + random(-0.26, 0.26);

    const px = this.x + this.ox;
    const py = this.y + this.oy;
    const dx = px - mouseX;
    const dy = py - mouseY;
    const d  = sqrt(dx * dx + dy * dy);
    const R  = 145;

    if (d < R && d > 0.001) {
      const f  = ((R - d) / R) * 1.85;
      this.vx += (dx / d) * f;
      this.vy += (dy / d) * f;
    }

    this.vx *= 0.91;
    this.vy *= 0.91;
    this.ox += this.vx;
    this.oy += this.vy;

    if (px < 0)      this.ox -= px - 5;
    if (px > width)  this.ox -= px - (width - 5);
    if (py < 0)      this.oy -= py - 5;
    if (py > height) this.oy -= py - (height - 5);
  }

  show() {
    noStroke();
    fill(this.r, this.g, this.b, this.baseAlpha);
    circle(this.x + this.ox, this.y + this.oy, this.sz * 2);
  }
}

/* ─────────────────────────────────────────────
   CLASSE: WordNode
   ───────────────────────────────────────────── */
class WordNode {
  constructor(data, triggerPos) {
    this.word       = data.word;
    this.def        = data.def;
    this.discovered = false;
    this.fadeAlpha  = 0;
    this.pulsePhase = random(TWO_PI);
    this.baseR      = 5.5;
    this.dragOffX   = 0;
    this.dragOffY   = 0;
    this.triggerX   = triggerPos.x;
    this.triggerY   = triggerPos.y;
    this.triggerR   = 60;
    this.x          = this.triggerX;
    this.y          = this.triggerY;
  }

  update() {
    if (this.discovered && this.fadeAlpha < 1) {
      this.fadeAlpha = min(1, this.fadeAlpha + 0.04);
    }
    this.pulsePhase += 0.022;
  }

  getR() { return this.baseR + sin(this.pulsePhase) * 2.8; }

  isHit(mx, my) {
    return this.discovered && dist(mx, my, this.x, this.y) < this.getR() + 24;
  }

  checkTrigger(mx, my) {
    if (this.discovered) return false;
    return dist(mx, my, this.triggerX, this.triggerY) < this.triggerR;
  }

  show() {
    if (!this.discovered && this.fadeAlpha === 0) return;

    const r   = this.getR();
    const a   = this.fadeAlpha;
    const hov = this.isHit(mouseX, mouseY);

    noStroke();
    fill(200, 185, 155, a * 12);
    circle(this.x, this.y, (r + 26) * 2);
    fill(200, 185, 155, a * 22);
    circle(this.x, this.y, (r + 14) * 2);
    fill(200, 185, 155, a * (hov ? 210 : 110));
    circle(this.x, this.y, r * 2);

    textFont('Georgia');
    textSize(hov ? 13.5 : 11.5);
    textAlign(CENTER, BOTTOM);
    noStroke();
    fill(230, 215, 185, a * (hov ? 225 : 130));
    text(this.word, this.x, this.y - r - 7);
  }
}

/* ─────────────────────────────────────────────
   HELPER: HSL → RGB
   ───────────────────────────────────────────── */
function hslToRgb(h, s, l) {
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0)*255), Math.round(f(8)*255), Math.round(f(4)*255)];
}

/* ─────────────────────────────────────────────
   HELPER: posizioni trigger su griglia
   ───────────────────────────────────────────── */
function buildTriggerPositions(n) {
  const cols  = ceil(sqrt(n * (windowWidth / windowHeight)));
  const rows  = ceil(n / cols);
  const cellW = windowWidth  / cols;
  const cellH = (windowHeight - 80) / rows;

  const positions = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions.push({
        x: cellW * c + random(cellW * 0.15, cellW * 0.85),
        y: 80 + cellH * r + random(cellH * 0.15, cellH * 0.85),
      });
    }
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return positions.slice(0, n);
}

/* ─────────────────────────────────────────────
   P5.JS — setup
   ───────────────────────────────────────────── */
function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('position', 'absolute');
  cnv.style('top', '0');
  cnv.style('left', '0');
  cnv.style('z-index', '0');

  for (let i = 0; i < FLOW_NUM; i++) flowParticles.push(new FlowParticle());
  for (let i = 0; i < 950; i++)     fangoParticles.push(new FangoParticle());

  const triggerPositions = buildTriggerPositions(WORDS_DATA.length);
  WORDS_DATA.forEach((d, i) => nodes.push(new WordNode(d, triggerPositions[i])));

  document.getElementById('nav').style.opacity    = '0';
  document.getElementById('nav').style.transition = 'opacity 1s';
  document.getElementById('hint').style.display   = 'none';

  createPopup();
}

/* ─────────────────────────────────────────────
   P5.JS — draw
   ───────────────────────────────────────────── */
function draw() {
  cursorBlink = (frameCount % 80 < 40) ? 255 : 0;

  if      (phase === 'intro')         drawIntro();
  else if (phase === 'transitioning') drawTransition();
  else                                drawMain();
}

/* ───── FASE INTRO ───── */
function drawIntro() {
  noStroke();
  fill(0, 10);
  rect(0, 0, width, height);
  flowParticles.forEach(p => p.run(255));
  drawIntroText(introAlpha);
}

/* ───── FASE TRANSIZIONE ───── */
function drawTransition() {
  const t = 1 - (introAlpha / 255);

  noStroke();
  fill(8, 10, 8, lerp(10, 52, t));
  rect(0, 0, width, height);

  flowParticles.forEach(p => p.run(introAlpha));

  if (t > 0.1) {
    fangoParticles.forEach(p => { p.update(); });
    fangoParticles.forEach(p => {
      noStroke();
      fill(p.r, p.g, p.b, p.baseAlpha * t);
      circle(p.x + p.ox, p.y + p.oy, p.sz * 2);
    });
  }

  if (introAlpha > 0) {
    drawIntroText(introAlpha);
    introAlpha = max(0, introAlpha - 4);
  }

  if (introAlpha <= 0) {
    phase = 'main';
    document.getElementById('nav').style.opacity  = '1';
    document.getElementById('hint').style.display = 'block';
    setTimeout(() => { discoveryEnabled = true; }, 3000);
  }
}

/* ───── FASE MAIN ───── */
function drawMain() {
  noStroke();
  fill(8, 10, 8, 52);
  rect(0, 0, width, height);

  flowParticles.forEach(p => p.run(40));

  if (currentSection === 'home') {
    fangoParticles.forEach(p => { p.update(); p.show(); });
    drawThreads();
    nodes.forEach(n => { n.update(); n.show(); });

    if (discoveryEnabled) {
      nodes.forEach(n => {
        if (n.checkTrigger(mouseX, mouseY)) {
          n.discovered = true;
          if (!firstDiscovery) firstDiscovery = true;
        }
      });
    }
  }

  updateCursor();
}

/* ─────────────────────────────────────────────
   TESTO INTRO
   ───────────────────────────────────────────── */
function drawIntroText(a) {
  const cx = width  / 2;
  const cy = height / 2;

  noStroke();
  textAlign(CENTER, CENTER);
  textFont('Georgia');

  textSize(min(width * 0.075, 72));
  fill(230, 215, 185, a * 0.9);
  text('hackerare il tempo', cx, cy - 40);

  textSize(12);
  fill(180, 165, 135, a * 0.5);
  text('tra umani e cyborg', cx, cy + 10);

  textSize(11);
  fill(200, 185, 155, a * 0.45);
  const label = 'clicca per entrare';
  text(label, cx, cy + 60);

  fill(200, 185, 155, a * 0.45 * (cursorBlink / 255));
  text('_', cx + textWidth(label) / 2 + 6, cy + 60);
}

/* ─────────────────────────────────────────────
   FILI tra nodi scoperti
   ───────────────────────────────────────────── */
function drawThreads() {
  const disc = nodes.filter(n => n.discovered && n.fadeAlpha > 0.05);
  if (disc.length < 2) return;

  for (let i = 0; i < disc.length; i++) {
    for (let j = i + 1; j < disc.length; j++) {
      const a = disc[i];
      const b = disc[j];
      const d = dist(a.x, a.y, b.x, b.y);
      const MAX_DIST = 600;
      if (d > MAX_DIST) continue;

      const alpha = map(d, 0, MAX_DIST, 45, 5) * min(a.fadeAlpha, b.fadeAlpha);
      stroke(200, 185, 155, alpha);
      strokeWeight(0.5);
      noFill();

      const cx = (a.x + b.x) / 2 + (b.y - a.y) * 0.09;
      const cy = (a.y + b.y) / 2 - (b.x - a.x) * 0.09;
      beginShape();
      vertex(a.x, a.y);
      quadraticVertex(cx, cy, b.x, b.y);
      endShape();
    }
  }
}

/* ─────────────────────────────────────────────
   CURSORE
   ───────────────────────────────────────────── */
function updateCursor() {
  if (currentSection !== 'home') return;
  if (draggingNode) { cursor('grabbing'); return; }
  cursor(nodes.some(n => n.isHit(mouseX, mouseY)) ? 'pointer' : 'crosshair');
}

/* ─────────────────────────────────────────────
   P5.JS — eventi mouse
   ───────────────────────────────────────────── */
function mousePressed() {
  if (phase === 'intro') {
    phase = 'transitioning';
    return;
  }
  if (phase !== 'main') return;

  const el = document.elementFromPoint(mouseX, mouseY);
  if (el && el.closest('#nav, #panel, #theory-view, #word-popup, #word-popup-overlay')) return;
  if (currentSection !== 'home') return;

  mouseDownX = mouseX;
  mouseDownY = mouseY;
  pressedNode = draggingNode = null;

  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    if (n.isHit(mouseX, mouseY)) {
      pressedNode = draggingNode = n;
      n.dragOffX  = n.x - mouseX;
      n.dragOffY  = n.y - mouseY;
      break;
    }
  }
}

function mouseDragged() {
  if (!draggingNode) return;
  draggingNode.x = mouseX + draggingNode.dragOffX;
  draggingNode.y = mouseY + draggingNode.dragOffY;
}

function mouseReleased() {
  const moved = dist(mouseX, mouseY, mouseDownX, mouseDownY);
  if (moved < 8 && pressedNode && pressedNode.fadeAlpha > 0.5) {
    openWordPopup(pressedNode.word, pressedNode.def);
  }
  draggingNode = pressedNode = null;
}

function mouseMoved() {
  if (phase !== 'main') return;
  if (!hintHidden) {
    hintHidden = true;
    document.getElementById('hint').classList.add('hidden');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/* ─────────────────────────────────────────────
   UI — sezioni
   ───────────────────────────────────────────── */
document.querySelectorAll('.nav-link').forEach(btn => {
  btn.addEventListener('click', () => {
    const s = btn.dataset.section;
    if (s === currentSection) return;
    currentSection = s;

    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');

    const tv = document.getElementById('theory-view');
    tv.classList.remove('visible');
    closeWordPopup();

    setTimeout(() => {
      if (s === 'theory') tv.classList.add('visible');
    }, 380);
  });
});

/* ─────────────────────────────────────────────
   UI — pannello laterale (non usato, mantenuto per compatibilità)
   ───────────────────────────────────────────── */
function closePanel() {
  document.getElementById('panel').classList.remove('open');
}
document.getElementById('panel-close').addEventListener('click', closePanel);