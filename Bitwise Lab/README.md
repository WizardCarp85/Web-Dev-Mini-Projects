# 🎮 Welcome to Bitwise Lab!

Bitwise operation puzzles (AND/OR/XOR/SHL/SHR).

How it works
- You have a current number and a target number (0–255).
- Choose an operation and enter a value (0–255), then apply it to the current number.
- The goal is to make the current number equal to the target in as few operations as possible.

Controls
- Choose an operation with the buttons (AND/OR/XOR/SHL/SHR).
- Enter a value and click "Apply".
- "New level" generates a new current/target pair.
- "Reset" sets current to 0 and clears history.

Notes for contributors
- Files: `index.html`, `style.css`, `script.js`.
- Small self-contained mini-game. Possible improvements: timer, difficulty levels, hints, minimal-solution solver.

---

Try to transform a starting number into a target number using classic bitwise tools. It's a great way to practice how bits behave — with a bit of puzzle fun.

Quick example
- Current: 5  (00000101)
- Target: 12  (00001100)

One possible approach:
1. Use SHL 1 on 5 → 10 (00001010)
2. Use XOR 6 → 12 (00001100)

That solves the puzzle in 2 steps. Try to find shorter or alternative paths!

Tips & strategies ✨
- Visualize numbers in binary: it makes it obvious which bits to toggle, set, or clear.
- OR with a mask to set bits (e.g. OR 0b00001100 will set the two low bits).
- AND with an inverted mask to clear bits (e.g. AND 0b11110011 clears bits 2 and 3).
- XOR to flip bits (useful when you need to toggle a pattern).
- Shifts move blocks of bits fast — they are powerful when the target is a shifted version of the start.

Ideas for contributors 🚀
- Add a "Hint" button that runs a BFS to compute the minimal number of steps and optionally provide a solution sequence.
- Show binary bit-strings next to numbers (8-bit view) so players can see changes live.
- Add difficulty levels: 8-bit (easy), 16-bit (harder), and a challenge mode with limited operations.

Enjoy! If you'd like, I can implement the BFS-based hint or the binary visualization next — which one should I add first? 🧠🔍
