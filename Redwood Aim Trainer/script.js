// Redwood Aim Trainer - core logic
const arena = document.getElementById('arena');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const cpsEl = document.getElementById('cps');
const ttkEl = document.getElementById('ttk');
const sessionLengthEl = document.getElementById('sessionLength');
const startSizeEl = document.getElementById('startSize');
const bestList = document.getElementById('bestList');
const clearBestBtn = document.getElementById('clearBest');

let sessionTimer = null;
let spawnTimer = null;
let timeLeft = 30;
let score = 0;
let clicks = 0;
let hitTimes = [];
let lastHitTs = 0;
let running = false;
let difficulty = { size: 48, life: 1200, gap: 600 }; // ms life, spawn gap
let streak = 0;

const STORAGE_KEY = 'redwood_aim_best';

function rand(min, max){ return Math.random()*(max-min)+min }

function createTarget(){
  const t = document.createElement('div');
  t.className = 'target';
  const size = Math.max(12, difficulty.size + rand(-6,6));
  t.style.width = size + 'px';
  t.style.height = size + 'px';

  const inner = document.createElement('div');
  inner.className = 'inner';
  inner.textContent = '';
  t.appendChild(inner);

  // random pos inside arena
  const rect = arena.getBoundingClientRect();
  const x = rand(0, Math.max(0, rect.width - size));
  const y = rand(0, Math.max(0, rect.height - size));
  t.style.left = x + 'px';
  t.style.top = y + 'px';

  // remove after life
  const life = Math.max(250, difficulty.life + rand(-120,120));
  const removeTimer = setTimeout(()=>{ if(t.parentNode) t.remove(); }, life);

  t.addEventListener('click', (e)=>{
    e.stopPropagation();
    if(!running) return;
    const now = performance.now();
    score += 1;
    clicks += 1;
    hitTimes.push(now - (lastHitTs || now));
    lastHitTs = now;
    streak += 1;
    adaptDifficulty(true);
    scoreEl.textContent = score;
    updateMetrics();
    t.classList.add('flash');
    clearTimeout(removeTimer);
    t.remove();
  });

  arena.appendChild(t);
}

function adaptDifficulty(hit){
  // simple adaptive: increase difficulty on streaks, relax on misses
  if(hit){
    if(streak % 3 === 0){
      difficulty.size = Math.max(14, difficulty.size - 6);
      difficulty.life = Math.max(300, difficulty.life - 80);
      difficulty.gap = Math.max(280, difficulty.gap - 40);
    }
  } else {
    streak = 0;
    difficulty.size = Math.min(80, difficulty.size + 6);
    difficulty.life = Math.min(2000, difficulty.life + 140);
    difficulty.gap = Math.min(900, difficulty.gap + 80);
  }
}

function spawnLoop(){
  if(!running) return;
  createTarget();
  const gap = Math.max(180, difficulty.gap + rand(-120,120));
  spawnTimer = setTimeout(spawnLoop, gap);
}

function updateMetrics(){
  const sessSecs = (parseInt(sessionLengthEl.value,10) - timeLeft);
  const cps = clicks / Math.max(1, sessSecs);
  cpsEl.textContent = cps.toFixed(2);
  if(hitTimes.length>1){
    const avg = hitTimes.reduce((a,b)=>a+b,0)/hitTimes.length;
    ttkEl.textContent = Math.round(avg);
  }
}

function startSession(){
  if(running) return;
  // reset
  running = true;
  timeLeft = parseInt(sessionLengthEl.value,10);
  timeEl.textContent = timeLeft;
  score = 0; clicks = 0; hitTimes = []; lastHitTs = 0; streak = 0;
  difficulty.size = parseInt(startSizeEl.value,10);
  difficulty.life = 1200;
  difficulty.gap = 600;
  scoreEl.textContent = score;
  cpsEl.textContent = '0.00';
  ttkEl.textContent = '0';
  startBtn.disabled = true; stopBtn.disabled = false;
  arena.innerHTML = '';

  spawnLoop();

  sessionTimer = setInterval(()=>{
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if(timeLeft<=0){
      stopSession();
    }
  },1000);
}

function stopSession(){
  if(!running) return;
  running = false;
  startBtn.disabled = false; stopBtn.disabled = true;
  clearInterval(sessionTimer); clearTimeout(spawnTimer);
  sessionTimer = null; spawnTimer = null;
  // clear remaining targets
  arena.innerHTML = '';
  saveSession();
}

function saveSession(){
  const duration = parseInt(sessionLengthEl.value,10);
  const cps = clicks / Math.max(1,(duration - timeLeft));
  const ttk = hitTimes.length>0 ? Math.round(hitTimes.reduce((a,b)=>a+b,0)/hitTimes.length) : 0;
  const rec = { when: Date.now(), score, cps: Number(cps.toFixed(2)), ttk, duration };

  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  arr.push(rec);
  // keep sorted by score desc, then cps desc
  arr.sort((a,b)=> (b.score - a.score) || (b.cps - a.cps));
  if(arr.length>10) arr.length = 10;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  renderBest();
}

function renderBest(){
  bestList.innerHTML = '';
  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  if(arr.length===0){
    bestList.innerHTML = '<li style="opacity:0.6">No sessions yet</li>';
    return;
  }
  arr.forEach((s,i)=>{
    const li = document.createElement('li');
    const left = document.createElement('div');
    left.textContent = `#${i+1} ${s.score} hits`;
    const right = document.createElement('div');
    const d = new Date(s.when);
    right.innerHTML = `<small style="color:#7f98a7">${s.cps} CPS • ${s.ttk}ms • ${s.duration}s • ${d.toLocaleString()}</small>`;
    li.appendChild(left); li.appendChild(right);
    bestList.appendChild(li);
  });
}

arena.addEventListener('click', ()=>{
  // miss
  if(!running) return;
  clicks += 1;
  adaptDifficulty(false);
  updateMetrics();
});

startBtn.addEventListener('click', startSession);
stopBtn.addEventListener('click', stopSession);
clearBestBtn.addEventListener('click', ()=>{ localStorage.removeItem(STORAGE_KEY); renderBest(); });

// initial render
renderBest();

// small accessibility: keyboard start/stop
window.addEventListener('keydown', (e)=>{
  if(e.key === ' '){ e.preventDefault(); if(running) stopSession(); else startSession(); }
});
