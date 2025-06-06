const API_KEY = '52a78f08195bba9992b72eba130d5924'; // Replace with your TMDB key
const API_URL = `https://api.themoviedb.org/3`;
let score = 0;
let correctTitle = "";

document.getElementById("next-btn").addEventListener("click", () => {
  loadMovie();
});

async function loadMovie() {
  const res = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await res.json();
  const movies = data.results.slice(0, 10); // Get top 10 for fake answers

  const randomMovie = movies[Math.floor(Math.random() * movies.length)];
  correctTitle = randomMovie.title;

  const videoRes = await fetch(`${API_URL}/movie/${randomMovie.id}/videos?api_key=${API_KEY}`);
  const videoData = await videoRes.json();
  const trailer = videoData.results.find(v => v.type === "Trailer" && v.site === "YouTube");

  if (trailer) {
    showVideo(trailer.key);
    showChoices(randomMovie.title, movies);
  }
}

function showVideo(youtubeKey) {
  const iframe = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${youtubeKey}?start=0&end=60&autoplay=1&controls=0" frameborder="0" allowfullscreen></iframe>`;
  document.getElementById('video-container').innerHTML = iframe;
}

function showChoices(correct, allMovies) {
  const choices = [correct];
  while (choices.length < 4) {
    const random = allMovies[Math.floor(Math.random() * allMovies.length)].title;
    if (!choices.includes(random)) choices.push(random);
  }

  // Shuffle
  choices.sort(() => Math.random() - 0.5);

  const choiceContainer = document.getElementById("choices");
  choiceContainer.innerHTML = "";

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(btn, choice);
    choiceContainer.appendChild(btn);
  });
}

function checkAnswer(button, choice) {
  const allButtons = document.querySelectorAll("#choices button");
  allButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctTitle) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
  });

  if (choice === correctTitle) {
    score += 3;
    document.getElementById("score").textContent = `Score: ${score}`;
  }
}

// Load first movie
loadMovie();
