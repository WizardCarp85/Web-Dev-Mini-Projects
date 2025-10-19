# Regex Arena — mini game (local)

Goal: craft a regular expression that matches all positive strings and rejects negative strings. Shorter patterns get more stars.

How to play
- Open `Regex Arena/index.html` in your browser (local file).
- Enter a pattern on the left (no `/` delimiters). Press Enter or the "Test" button.
- If the pattern matches all positives and no negatives you earn up to 3 stars depending on pattern length.

Adding puzzles
- Open `Regex Arena/script.js` and add a new object to the `puzzles` array.
- The object should include: `title`, `positives` (array), `negatives` (array), and optionally `minimal` (reference pattern for hints/scoring).

Notes
- This is a local demo — no server required.
- Examples in `script.js` show puzzle format.

License: same as the main repository.
