# Redwood Aim Trainer 🎯🌲

A compact, single-screen reaction trainer built to help you sharpen aim and speed. Click the targets as fast and accurately as you can — the game adapts to your performance and keeps the best sessions in your browser.

Features ✨
- Adaptive difficulty: hit streaks make targets smaller and shorter-lived; misses relax difficulty so you can recover.
- Lightweight metrics: CPS (Clicks Per Second) and TTK (Time To Kill — average ms between hits).
- Persistent leaderboard: top 10 sessions saved to `localStorage` so your best runs stick around.

How to play ▶️
1. Choose session length (15 / 30 / 60 seconds) and the start target size.
2. Press `Start` or hit the spacebar to begin.
3. Click targets that appear in the arena. Misses count as clicks and reduce difficulty a bit.
4. When the session ends the result is stored and appears in the Best sessions list.

Controls 🕹️
- Mouse: click targets to score.
- Keyboard: spacebar toggles Start / Stop.

Files in this folder 📁
- `index.html` — game UI and layout
- `style.css` — styles for the arena, HUD and controls
- `script.js` — game logic (spawn, adaptive difficulty, metrics & persistence)

Run locally 🧭
Open `index.html` in a browser.

Notes & ideas 💡
- Add sound effects (hit / miss) for feedback.
- Add mobile touch optimization to improve responsiveness on phones/tablets.
- Add accuracy/combo stats and a replay heatmap for advanced analysis.
