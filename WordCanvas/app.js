const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const promptInput = document.getElementById("promptInput");

// Canvas setup
canvas.width = 1000;
canvas.height = 500;
ctx.fillStyle = "#111";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let elements = [];
let animationActive = false;
let lastFrame = null;

// Emoji sets for prompts
const emojiMap = {
  flower: ["🌸", "🌼", "🌻", "🌺", "🌷"],
  heart: ["❤️", "💖", "💞", "💓", "💕"],
  sun: ["🌞", "🌤️", "☀️"],
  star: ["⭐", "🌟", "✨"],
  default: ["🎨", "🌈", "💫"]
};

// Create animated objects
function createElements(prompt) {
  const emojiSet = emojiMap[prompt.toLowerCase()] || emojiMap.default;
  elements = [];

  for (let i = 0; i < 25; i++) {
    elements.push({
      emoji: emojiSet[Math.floor(Math.random() * emojiSet.length)],
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 32 + Math.random() * 30,
      speed: 0.5 + Math.random() * 2,
      direction: Math.random() * 2 * Math.PI
    });
  }
}

// Animate elements
function animate() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  elements.forEach(el => {
    el.x += Math.cos(el.direction) * el.speed;
    el.y += Math.sin(el.direction) * el.speed;

    if (el.x < -50) el.x = canvas.width + 50;
    if (el.x > canvas.width + 50) el.x = -50;
    if (el.y < -50) el.y = canvas.height + 50;
    if (el.y > canvas.height + 50) el.y = -50;

    ctx.font = `${el.size}px "Segoe UI Emoji"`;
    ctx.fillText(el.emoji, el.x, el.y);
  });

  // Keep redrawing while active
  if (animationActive) {
    lastFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
  }
}

// Generate button
generateBtn.addEventListener("click", () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert("Please enter a word!");

  createElements(prompt);
  animationActive = true;
  animate();

  // Stop animation after a few seconds but keep the last frame visible
  setTimeout(() => {
    animationActive = false;
    if (lastFrame) ctx.putImageData(lastFrame, 0, 0);
  }, 4000);
});

// Download button
downloadBtn.addEventListener("click", () => {
  if (!lastFrame) {
    alert("Please generate an animation first!");
    return;
  }

  // Convert current visible canvas to image
  const link = document.createElement("a");
  link.download = `${promptInput.value || "art"}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});
