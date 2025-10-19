(function(){
  const currentEl = document.getElementById('current');
  const targetEl = document.getElementById('target');
  const operandEl = document.getElementById('operand');
  const stepsEl = document.getElementById('steps');
  const historyEl = document.getElementById('history');
  const applyBtn = document.getElementById('apply');
  const resetBtn = document.getElementById('reset');
  const newBtn = document.getElementById('new');
  const opButtons = document.querySelectorAll('.ops button');

  let state = { current: 0, target: 0, steps:0, history:[], selectedOp: 'AND' };

  function render(){
    currentEl.textContent = state.current;
    targetEl.textContent = state.target;
    stepsEl.textContent = state.steps;
    historyEl.innerHTML = '';
    state.history.slice().reverse().forEach(h=>{
      const li = document.createElement('li');
      li.textContent = h;
      historyEl.appendChild(li);
    });
  }

  opButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      opButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedOp = btn.dataset.op;
    });
  });

  function applyOperation(){
    let val = parseInt(operandEl.value) || 0;
    if(val < 0) val = 0;
    if(val > 255) val = 255;
    let before = state.current;
    switch(state.selectedOp){
      case 'AND': state.current = state.current & val; break;
      case 'OR': state.current = state.current | val; break;
      case 'XOR': state.current = state.current ^ val; break;
      case 'SHL': state.current = (state.current << val) & 0xFFFFFFFF; break;
      case 'SHR': state.current = (state.current >>> val) & 0xFFFFFFFF; break;
    }
    state.steps++;
    state.history.push(`${before} ${opSymbol(state.selectedOp)} ${val} = ${state.current}`);
    checkWin();
    render();
  }

  function opSymbol(op){
    if(op==='AND') return '&';
    if(op==='OR') return '|';
    if(op==='XOR') return '^';
    if(op==='SHL') return '<<';
    if(op==='SHR') return '>>';
    return op;
  }

  function reset(){
    state.current = 0;
    state.steps = 0;
    state.history = [];
    render();
  }

  function newLevel(){
    // generate target between 0 and 255 (8-bit) but avoid trivial 0 when starting from 0
    state.target = Math.floor(Math.random()*256);
    // randomize starting current to add variety (0-255)
    state.current = Math.floor(Math.random()*256);
    state.steps = 0;
    state.history = [];
    render();
  }

  function checkWin(){
    if(state.current === state.target){
      state.history.push(`✔ Victory in ${state.steps} steps`);
      alert(`Victory! You assembled ${state.target} in ${state.steps} steps.`);
    }
  }

  applyBtn.addEventListener('click', applyOperation);
  resetBtn.addEventListener('click', reset);
  newBtn.addEventListener('click', newLevel);

  // initial setup
  opButtons[0].classList.add('active');
  state.selectedOp = opButtons[0].dataset.op;
  newLevel();
})();