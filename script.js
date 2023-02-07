
'use strict';
const API_KEY = "api_key=542003918769df50083a13c415bbc602";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";

// this container will hold the results that will come from the API
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  // movies in home Page
  const movies = await fetchMovies();
  renderMovies(movies.results);

  // for genres in first dropdown menu
  const genre = await fetchGenres()
  renderGenres(genre.genres)
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?${API_KEY}`;
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  // the fetch the movies that is streming know
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// This function fetch the genres
const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`)
  const res = await fetch(url);
  return res.json();
}

// This function for fit and append geners in navbar
const renderGenres = (genresArrayOfObject) => {
  const listGenre = document.getElementById("dropdown");
  genresArrayOfObject.map((oneGenre) => {
    const element = document.createElement('a')
    element.classList.add('block', 'px-4', 'py-2', 'text-black', 'hover:bg-gray-100', 'hover:text-red-400')
    element.innerText = `${oneGenre.name}`
    element.addEventListener("click", () => {
      // getFilterdMoviesByGenres();
      // autorun(`discover/movie`, `&with_genres=${selectedGenras.join(",")}`);
    });
    listGenre.appendChild(element);
  });
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};
// You may need to add to this function, definitely don't delete it.
// this function will get the the details of each movie by its id
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  // own movie page
  renderMovie(movieRes);
};

//This function is to fetch the movie trailer
const fetchTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
}
const trailersDetails = async (trailerId) => {
  const videos = await fetchTrailer(trailerId);
  // own movie trailer function
  renderTrailer(videos.results[0]);
}
// This function get the trailer and display it
const renderTrailer = (trailer) => {
  const trailerDiv = document.getElementById('movie_trailer');
  const videosIframe = document.getElementById("trailer");
  videosIframe.setAttribute("src", `https://www.youtube.com/embed/${trailer.key}`);
  trailerDiv.appendChild(videosIframe);
}

// You'll need to play with this function in order to add features and enhance the style.
// movies in home Page
const renderMovies = (movies) => {
  movies.map((movie) => {
    // this is the container of the element in home
    // const containerForHome = document.createElement('div')
    // containerForHome.add.classList('containerForHome')
    const movieDiv = document.createElement("div");
    movieDiv.classList.add('movie')
    movieDiv.innerHTML = `<img class="movie-poster" src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${movie.title} poster">
    <h3 class="movie-title" >${movie.title}</h3>  <h2 class="movie-average">${movie.vote_average}</h2> `;
    movieDiv.addEventListener("click", () => {
      // send each movie by its id to get details
      movieDetails(movie);
    });
    // containerForHome.appendChild(movieDiv)
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
// own movie page which will get the needed information form the movie details
const renderMovie = (movie) => {
  let genres = movie.genres;
  const genre = genres.map( ({ name }) => name).join(', ')
  trailersDetails(movie.id)
  CONTAINER.innerHTML = `
  <div class="movie-card">
  <div class="img-container">
    <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
    <div class="content-container">
      <h2 id="movie-title">${movie.title}</h2>
      <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
      <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
      <p id="movie-runtime"><b>Genres</b>${genre}</p>
      <h3>Overview:</h3>
      <p id="movie-overview">${movie.overview}</p>
      <div id="movie_trailer">
        <iframe frameborder="0" id="trailer"></iframe>
    </div>
      <h3>Actors:</h3>
      <ul id="actors" class="list-unstyled"></ul>
    </div>
  </div>
</div>

    `;
};

// for DOM which will start wiht the autorun function that will fetch everything in API
document.addEventListener("DOMContentLoaded", autorun);


// responsive buttom in navbar
const buttomResponsiveness = document.getElementById('responsiveButton')

buttomResponsiveness.addEventListener('click', () =>{
  const navbar = document.getElementById('navbar')
  navbar.classList.toggle('hidden')
})

// first dropdown menu
const dropdownBtn = document.getElementById('dropdownDefaultButton')
const dropdown = document.getElementById('dropdown')
dropdownBtn.addEventListener('click',()=>{
  if(dropdown.classList.contains('hidden')){
    dropdown.classList.remove('hidden')
    dropdown.classList.add('flex')
  }else{
    dropdown.classList.add('hidden')
    dropdown.classList.remove('flex')
  }
})

// second dropdown menu
const dropdownBtn2 = document.getElementById('dropdownDefaultButton2')
const dropdown2 = document.getElementById('dropdown2')
dropdownBtn2.addEventListener('click',()=>{
  if(dropdown2.classList.contains('hidden')){
    dropdown2.classList.remove('hidden')
    dropdown2.classList.add('flex')
  }else{
    dropdown2.classList.add('hidden')
    dropdown2.classList.remove('flex')
  }
})
