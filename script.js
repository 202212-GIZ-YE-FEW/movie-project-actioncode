
'use strict';
const API_KEY = "api_key=542003918769df50083a13c415bbc602";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";

// this container will hold the results that will come from the API
const CONTAINER = document.querySelector(".container");
const youtube = document.querySelector(".youtube");

// Don't touch this function please
const autorun = async (path) => {
  // movies in home Page
  const movies = await fetchMovies(path);
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
const fetchMovies = async (path) => {
  // the fetch the movies that is streming know
  const url = constructUrl(path);
  const res = await fetch(url);
  return res.json();
};

// This function is to delete the child of container in home page to get new movies based on filters
const containerChildDelete = () => {
  while (CONTAINER.firstChild) {
    CONTAINER.firstChild.remove();
  }
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
      GenresOfAllMoviesDetails(oneGenre.id)
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
// own movie page which will get the needed information form the movie details
const renderMovie = (movie) => {
  let genres = movie.genres;
  const genre = genres.map(({ name }) => name).join(', ')
  trailersDetails(movie.id)
  CONTAINER.innerHTML = `
  <div class="movie-card">
    <div class="img-container">
      <div class="img-overlay"></div>
      <div class="content-container">
        <h2 id="movie-title">${movie.title}</h2>
        <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
        <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
        <p id="movie-runtime"><b>Genres</b>${genre}</p>
        <h3>Overview:</h3>
        <p id="movie-overview">${movie.overview}</p>
        
        <ul id="actors" class="list-unstyled"></ul>
      </div>
    </div>
  </div>
  <div id="movie_trailer">
    <iframe frameborder="0" id="trailer"></iframe>
  </div>
    `;

    const imgContainer = document.querySelector('.img-container');
    imgContainer.style.backgroundImage = `url(${BACKDROP_BASE_URL + movie.backdrop_path})`;
    imgContainer.style.backgroundSize = `cover`;
    imgContainer.style.height = `700px`;
    
    const imgOverlay = document.querySelector('.img-overlay');
    imgOverlay.classList.add('img-overlay-class');
    
    imgOverlay.style.position = 'absolute';
  
    };

// for DOM which will start wiht the autorun function that will fetch everything in API
document.addEventListener("DOMContentLoaded", autorun);


// responsive buttom in navbar
const buttomResponsiveness = document.getElementById('responsiveButton')

buttomResponsiveness.addEventListener('click', () => {
  const navbar = document.getElementById('navbar')
  navbar.classList.toggle('hidden')
})

// first dropdown menu
const dropdownBtn = document.getElementById('dropdownDefaultButton')
const dropdown = document.getElementById('dropdown')
dropdownBtn.addEventListener('click', () => {
  if (dropdown.classList.contains('hidden')) {
    dropdown.classList.remove('hidden')
    dropdown.classList.add('flex')
  } else {
    dropdown.classList.add('hidden')
    dropdown.classList.remove('flex')
  }
})

// second dropdown menu
const dropdownBtn2 = document.getElementById('dropdownDefaultButton2')
const dropdown2 = document.getElementById('dropdown2')
dropdownBtn2.addEventListener('click', () => {
  if (dropdown2.classList.contains('hidden')) {
    dropdown2.classList.remove('hidden')
    dropdown2.classList.add('flex')
  } else {
    dropdown2.classList.add('hidden')
    dropdown2.classList.remove('flex')
  }
})

// This function get all the movies to know the genres
const fetchGenresOfAllMovies = async () => {
  const url = constructUrl(`discover/movie`);
  const res = await fetch(url);
  return res.json();
}
const GenresOfAllMoviesDetails = async (element) => {
  const genreOfMovies = await fetchGenresOfAllMovies()
  getMoviesByGener(element, genreOfMovies.results)
}
// This function is to open based on geners
const getMoviesByGener = (element,GenresObject) => {
  const genersArray = [];
  GenresObject.map((eachGenresObjece) => {
      genersArray.push(eachGenresObjece.genre_ids);
  });
  for (let i = 0; i < genersArray.length; i++) {
    if (genersArray[i] == element ) {
      console.log(genersArray[i])
      containerChildDelete()
    }
  }
}

// for DOM which will start wiht the autorun function that will fetch everything in API
document.addEventListener("DOMContentLoaded", autorun('movie/now_playing'));

// These functions for filter movies
const popular = document.getElementById('popular')
popular.addEventListener('click', () => {
  containerChildDelete()
  autorun(`movie/popular`)})

const top_rated = document.getElementById('top_rated')
top_rated.addEventListener('click', () => {
  containerChildDelete()
  autorun(`movie/top_rated`)})

const coming_up = document.getElementById('coming_up')
coming_up.addEventListener('click', () => {
  containerChildDelete()
  autorun(`movie/upcoming`)})

const playing_now = document.getElementById('playing_now')
playing_now.addEventListener('click', () => {
  containerChildDelete()
  autorun(`movie/now_playing`)})

// These codes for search engine
const search = document.getElementById('default_search')
const searchBtn = document.getElementById('searchBtn')
searchBtn.addEventListener('click', ()=>{
  if (search.value !== null) {
    containerChildDelete()
    autorun(`search/movie &query=${search.value}`)
  }
})