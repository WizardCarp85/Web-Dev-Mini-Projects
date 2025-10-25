const emojiDictionary = {
  "love":["❤️","💖","💕"],
  "pizza":["🍕"],
  "dog":["🐶","🐕"],
  "cat":["🐱","🐈"],
  "coffee":["☕","🍵"],
  "happy":["😃","😊","😁"],
  "sad":["😢","😭","😞"],
  "tree":["🌳","🌲","🌴"],
  "car":["🚗","🚙","🚘"],
  "star":["⭐","🌟","✨"],
  "fire":["🔥","💥"],
  "sun":["☀️"],
  "moon":["🌙"],
  "book":["📖"],
  "music":["🎵","🎶"],
  "rain":["🌧️"],
  "heart":["💖","💝","💗"],
  "smile":["😊","😁","😄"]
};

document.getElementById("wordInput").addEventListener("input", function() {
  const word = this.value.trim().toLowerCase();
  const output = document.getElementById("output");

  if (!word) {
    output.innerText = "";
    return;
  }

  if (emojiDictionary[word]) {
    output.innerText = emojiDictionary[word].join(" ");
  } else {
    output.innerText = "❌ No emoji found";
  }
});