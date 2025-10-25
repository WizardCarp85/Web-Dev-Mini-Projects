const addNoteBtn = document.getElementById("addNote");

// I have added Pastel colors so black text stays readable
const colors = ["#fff9a8","#ffd6a5","#caffbf","#9bf6ff","#bdb2ff","#f3b1b1ff"];

function createNote(x = 100, y = 100, text = "") {
  const note = document.createElement("div");
  note.className = "note";
  note.style.top = y + "px";
  note.style.left = x + "px";
  note.style.background = colors[Math.floor(Math.random() * colors.length)];

  //  Drag bar
  const dragBar = document.createElement("div");
  dragBar.className = "dragBar";

  // Delete button
  const del = document.createElement("button");
  del.className = "deleteBtn";
  del.textContent = "×";
  del.onclick = () => note.remove();
  dragBar.appendChild(del);

  // Text area
  const textarea = document.createElement("textarea");
  textarea.value = text;

  // Assemble the note
  note.appendChild(dragBar);
  note.appendChild(textarea);
  document.body.appendChild(note);

  //Dragging logic (Pointer Events)
  let startX, startY, startLeft, startTop;

  dragBar.addEventListener("pointerdown", (e) => {
    // It won’t drag if the delete button is clicked
    if (e.target === del) return;

    dragBar.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
    startLeft = note.offsetLeft;
    startTop = note.offsetTop;
    note.style.zIndex = Date.now(); // it will bring note to front
  });

  dragBar.addEventListener("pointermove", (e) => {
    if (!dragBar.hasPointerCapture?.(e.pointerId)) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    note.style.left = startLeft + dx + "px";
    note.style.top = startTop + dy + "px";
  });

  dragBar.addEventListener("pointerup", (e) => {
    dragBar.releasePointerCapture?.(e.pointerId);
  });

  textarea.focus();
}

// This will add new colorful notes at random positions
addNoteBtn.addEventListener("click", () => {
  const x = 100 + Math.random() * 300;
  const y = 100 + Math.random() * 200;
  createNote(x, y);
});
