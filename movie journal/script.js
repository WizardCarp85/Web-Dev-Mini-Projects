const form = {
  title: document.getElementById('title'),
  director: document.getElementById('director'),
  year: document.getElementById('year'),
  rating: document.getElementById('rating'),
  notes: document.getElementById('notes'),
  allowComments: document.getElementById('allowComments'),
  addBtn: document.getElementById('addMovie')
};

const movieList = document.getElementById('movie-list');
const modal = document.getElementById('commentModal');
const commentList = document.getElementById('commentList');
const newComment = document.getElementById('newComment');
const addCommentBtn = document.getElementById('addComment');
const closeModal = document.getElementById('closeModal');

let movies = JSON.parse(localStorage.getItem('movies')) || [];
let activeMovieId = null;

function renderMovies() {
  movieList.innerHTML = '';
  movies.forEach((movie, index) => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    card.innerHTML = `
      <h3>${movie.title} (${movie.year})</h3>
      <p><strong>Director:</strong> ${movie.director}</p>
      <p class="stars">${'⭐'.repeat(movie.rating)}</p>
      <p>${movie.notes}</p>
      <div class="card-buttons">
        ${movie.allowComments ? '<button class="comment-btn">💬</button>' : ''}
        <button class="delete-btn">🗑️</button>
      </div>
    `;

    const delBtn = card.querySelector('.delete-btn');
    delBtn.addEventListener('click', () => {
      movies.splice(index, 1);
      saveAndRender();
    });

    if (movie.allowComments) {
      const commentBtn = card.querySelector('.comment-btn');
      commentBtn.addEventListener('click', () => openComments(index));
    }

    movieList.appendChild(card);
  });
}

function saveAndRender() {
  localStorage.setItem('movies', JSON.stringify(movies));
  renderMovies();
}

form.addBtn.addEventListener('click', () => {
  const newMovie = {
    title: form.title.value.trim(),
    director: form.director.value.trim(),
    year: form.year.value,
    rating: +form.rating.value,
    notes: form.notes.value.trim(),
    allowComments: form.allowComments.checked,
    comments: []
  };

  if (!newMovie.title || !newMovie.director || !newMovie.rating) return alert('Fill all required fields!');
  movies.push(newMovie);
  saveAndRender();

  Object.values(form).forEach(input => {
    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') input.value = '';
  });
  form.allowComments.checked = false;
});

function openComments(index) {
  activeMovieId = index;
  commentList.innerHTML = '';
  movies[index].comments.forEach(c => {
    const li = document.createElement('li');
    li.textContent = c;
    commentList.appendChild(li);
  });
  modal.classList.remove('hidden');
}

addCommentBtn.addEventListener('click', () => {
  const comment = newComment.value.trim();
  if (!comment) return;
  movies[activeMovieId].comments.push(comment);
  newComment.value = '';
  saveAndRender();
  openComments(activeMovieId);
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

renderMovies();
