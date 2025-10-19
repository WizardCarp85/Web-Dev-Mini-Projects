// Simple Regex Arena logic
const puzzles = [
  {
    id: 1,
    title: 'Starts and ends with a / e',
    positives: ['apple', 'apricot', 'alpine'],
    negatives: ['pineapple', 'maple', 'snapple'],
    minimal: '^a.*e$'
  },
  {
    id: 2,
    title: 'Digits only',
    positives: ['123', '4567', '0'],
    negatives: ['12a', 'a123', 'one'],
    minimal: '^\\d+$'
  },
  {
    id: 3,
    title: 'Substring "cat"',
    positives: ['cat', 'concatenate', 'scatter'],
    negatives: ['dog', 'c at', 'cta'],
    minimal: 'cat'
  },
  {
    id: 4,
    title: 'Lowercase letters only',
    positives: ['hello','world','abcxyz'],
    negatives: ['Hello','abc123',''],
    minimal: '^[a-z]+$'
  },
  {
    id: 5,
    title: 'Hex color (3 or 6 digits)',
    positives: ['#fff', '#ffffff', '#123abc'],
    negatives: ['fff', '#ggg', '#123abz'],
    minimal: '^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$'
  },
  {
    id: 6,
    title: 'Simple email-like',
    positives: ['a@b.com', 'john.doe@mail.org'],
    negatives: ['a@b', '@nope', 'name@domain.'],
    minimal: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
  },
  {
    id: 7,
    title: 'Ends with "ing"',
    positives: ['running', 'sing', 'king'],
    negatives: ['run', 'play', 'in g'],
    minimal: 'ing$'
  },
  {
    id: 8,
    title: 'US phone (basic)',
    positives: ['123-456-7890', '(123) 456-7890'],
    negatives: ['12-3456-7890', 'phone', '1234567'],
    minimal: '^\\(?\\d{3}\\)?[\\s-]?\\d{3}-\\d{4}$'
  },
  {
    id: 9,
    title: 'Double letters (any)',
    positives: ['letter', 'cool', 'coffee'],
    negatives: ['cat', 'dog', 'boter'],
    minimal: '(.)\\1'
  },
  {
    id: 10,
    title: 'Date YYYY-MM-DD (basic)',
    positives: ['2020-01-31', '1999-12-01'],
    negatives: ['2020-13-01', '99-12-01', '20200101'],
    minimal: '^\\d{4}-\\d{2}-\\d{2}$'
  },
  {
    id: 11,
    title: 'Starts with uppercase',
    positives: ['Hello', 'World', 'Title'],
    negatives: ['hello', ' world', '123Start'],
    minimal: '^[A-Z]'
  }
]

let current = 0

const el = id => document.getElementById(id)

function renderPuzzle(i){
  const p = puzzles[i]
  el('cases').innerHTML = ''
  const make = (s, cls) => {
    const li = document.createElement('li')
    li.textContent = s
    li.className = cls
    return li
  }
  p.positives.forEach(s => el('cases').appendChild(make(s,'positive')))
  p.negatives.forEach(s => el('cases').appendChild(make(s,'negative')))
  el('result').textContent = `Puzzle: ${p.title}`
  el('score-info').textContent = ''
  el('stars').textContent = '☆☆☆'
  el('regex').value = ''
}

function safeCompile(input){
  try{
    // Use 'u' flag for unicode and 'm' not needed
    return {re: new RegExp(input), error: null}
  }catch(e){
    return {re: null, error: e.message}
  }
}

function evaluate(){
  const input = el('regex').value.trim()
  const {re,error} = safeCompile(input)
  if(error){
    el('result').innerHTML = `<span style="color:var(--danger)">Error: ${error}</span>`
    return
  }

  const p = puzzles[current]
  const posOk = p.positives.every(s => re.test(s))
  const negOk = p.negatives.every(s => !re.test(s))

  if(posOk && negOk){
    // success — score with stars based on length compared to puzzle.minimal if present
    const userLen = input.length
    let stars = 1
    if(p.minimal){
      const minLen = p.minimal.length
      // award 3 stars if userLen <= minLen, 2 if <= minLen+3, else 1
      if(userLen <= minLen) stars = 3
      else if(userLen <= minLen + 3) stars = 2
      else stars = 1
    } else {
      if(userLen <= 6) stars = 3
      else if(userLen <= 10) stars = 2
      else stars = 1
    }
    el('stars').textContent = '★'.repeat(stars) + '☆'.repeat(3-stars)
    el('result').innerHTML = `<span style="color:var(--success)">Success! ${posOk? 'all positives match.' : ''} ${negOk? 'no negatives matched.' : ''}</span>`
    el('score-info').textContent = `Pattern length: ${userLen}${p.minimal? ' • reference: '+p.minimal : ''}`
  } else {
    let msg = ''
    if(!posOk) msg += 'Not all positive strings match. '
    if(!negOk) msg += 'Pattern matches forbidden strings.'
    el('result').innerHTML = `<span style="color:var(--danger)">${msg}</span>`
  }
}

function hint(){
  const p = puzzles[current]
  if(p.minimal){
    el('result').innerHTML = `Hint: reference pattern: <code>${p.minimal}</code>`
  } else {
    el('result').textContent = 'Hint: try escaping special characters or using ^ / $ anchors.'
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderPuzzle(current)
  el('test').addEventListener('click', evaluate)
  el('hint').addEventListener('click', hint)
  el('next').addEventListener('click', ()=>{
    current = (current + 1) % puzzles.length
    renderPuzzle(current)
  })
  el('regex').addEventListener('keydown', e => { if(e.key === 'Enter') evaluate() })
})
