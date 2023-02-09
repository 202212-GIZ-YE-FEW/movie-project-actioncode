
'use strict';
const API_KEY = "api_key=542003918769df50083a13c415bbc602";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";

// this container will hold the results that will come from the API
const CONTAINER = document.querySelector(".container");
const youtube = document.querySelector(".youtube");

// Don't touch this function please
const autorun = async (path,query) => {
  // movies in home Page
  const movies = await fetchMovies(path,query);
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
const fetchMovies = async (path,query = "") => {
  // the fetch the movies that is streming know
  const url = constructUrl(path)+query;
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
// To fetch the actors in the movie
const fetchMovieActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};
// To fetch the movies the similar to the movie
const fetchSameMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};
// You may need to add to this function, definitely don't delete it.
// this function will get the the details of each movie by its id
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieActors = await fetchMovieActors(movie.id);
  const sameMovie = await fetchSameMovie(movie.id);
  // own movie page
  renderMovie(movieRes,movieActors.cast,sameMovie.results);
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
  const videosIframe = document.createElement("iframe");
  videosIframe.setAttribute("src", `https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
  videosIframe.setAttribute("frameborder", 0);
  videosIframe.setAttribute("id", "trailer");
  videosIframe.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in- picture");
  videosIframe.setAttribute("allowfullscreen", true);
  const videoContainer = document.createElement("div");
  videoContainer.setAttribute("class", "video-container");
  videoContainer.appendChild(videosIframe);
  trailerDiv.appendChild(videoContainer);
};

const customStyles = `
  .video-container {
    position: relative;
    padding-bottom: 46.25%;
    height: 0;
    overflow: hidden;
    width: 640px;
    background-size: cover;
  }
  
  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerHTML = customStyles;
document.head.appendChild(styleSheet);



// You'll need to play with this function in order to add features and enhance the style.
// own movie page which will get the needed information form the movie details
const renderMovie = (movie,actors,similar) => {
  let genres = movie.genres;
  const genre = genres.map(({ name }) => name).join(', ')
  trailersDetails(movie.id)
  CONTAINER.innerHTML = `
  <div class="movie-card">
    <div class="img-container">
      <div class="img-overlay"></div>
      <div class="content-container">
        <h2 id="movie-title">${movie.title}</h2>
        <p id="movie-release-date"><b>Release Date: </b> ${movie.release_date}</p>
        <p id="movie-runtime"><b>Runtime: </b> ${movie.runtime} Minutes</p>
        <p id="movie-language"><b>Movie's Language: </b> ${
          movie.original_language
        }</p>
        <p id="recieved-votes"> <b> Recieved Votes: </b> ${
          movie.vote_count
        } votes</p>
        <p id="movie-Genres"><b>Genres: </b>${genre}</p>
        <h3>Overview:</h3>
        <p id="movie-overview">${movie.overview}</p>
        
        
        <ul id="actors" class="list-unstyled"></ul>
      </div>
      <div class="slider">

      <figure>
    
    
      <img src="${BACKDROP_BASE_URL + actors[0].profile_path}" alt="${actors[0].original_name} poster">
      <h3>${actors[0].name}</h3>
    
    
      <img src="${BACKDROP_BASE_URL + actors[1].profile_path}" alt="${actors[1].original_name} poster">
      <h3>${actors[1].name}</h3>
    
    
      <img src="${BACKDROP_BASE_URL + actors[2].profile_path}" alt="${actors[2].original_name} poster">
      <h3>${actors[2].name}</h3>
    
    
      <img src="${BACKDROP_BASE_URL + actors[3].profile_path}" alt="${actors[3].original_name} poster">
      <h3>${actors[3].name}</h3>
    
    
      <img src="${BACKDROP_BASE_URL + actors[4].profile_path}" alt="${actors[4].original_name} poster">
      <h3>${actors[4].name}</h3>
      </figure>
    </div>
    <h3 class="name"> Similar Movies:</h3>
      
    </div>
 
  </div>

<div class="Similar-Movies"  value =Similar Movies >
 


   <span>
     <img src="${BACKDROP_BASE_URL + similar[0].poster_path }" alt="${similar[0].title} poster">
     <h3>${similar[0].title}</h3>
    </span>
   <span> 
     <img src="${BACKDROP_BASE_URL + similar[1].poster_path }" alt="${similar[1].title} poster">
     <h3>${similar[1].title}</h3>
   </span>
   <span>
     <img src="${BACKDROP_BASE_URL + similar[2].poster_path }" alt="${similar[2].title} poster">
     <h3>${similar[2].title}</h3>
   </span>
   <span> 
     <img src="${BACKDROP_BASE_URL + similar[3].poster_path }" alt="${similar[3].title} poster">
     <h3>${similar[3].title}</h3>
   </span>
   <span> 
     <img src="${BACKDROP_BASE_URL + similar[4].poster_path }" alt="${similar[4].title} poster">
     <h3>${similar[4].title}</h3>
   </span>
</div>



  <div id="movie_trailer">
    <iframe frameborder="0" id="trailer"></iframe>
  </div>`;

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
    containerChildDelete()
    for (let i = 0; i < eachGenresObjece.genre_ids.length; i++) {
      if(eachGenresObjece.genre_ids[i] === element ) {
        MovieGenerDetails(eachGenresObjece.id)
      }
    }
  })
}
const fetchMovieGener = async (movieId) => {
  const url = constructUrl(`/movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
}
const MovieGenerDetails = async (movieId) => {
  const MovieGener = await fetchMovieGener(movieId);
  renderMovieGener(MovieGener);
}
const renderMovieGener = (MovieGener) => {
  const movieDiv = document.createElement("div");
  movieDiv.classList.add('movie')
  movieDiv.innerHTML = `<img class="movie-poster" src="${BACKDROP_BASE_URL + MovieGener.poster_path}" alt="${MovieGener.title} poster">
  <h3 class="movie-title">${MovieGener.title}</h3>  <h2 class="movie-average">${MovieGener.vote_average}</h2> `;
  movieDiv.addEventListener("click", () => {
    movieDetails(MovieGener);
  });
  CONTAINER.appendChild(movieDiv);
}

// to return to the home page
const home = document.getElementById('home')
home.addEventListener('click', () => {
  containerChildDelete()
  autorun(`movie/now_playing`)
})

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
    autorun(`search/movie`, `&query=${search.value}`);
  }
})

// fetch and get the actors and thier information

//  to fetch all the actors
const actorElement = document.getElementById('actor')
actorElement.addEventListener('click', () => actorsDetails())
const actorsDetails = async () => {
  const actors = await fetchActors()
  renderActors(actors.results)
}
const fetchActors = async () => {
  const url = constructUrl('person/popular');
  const res = await fetch(url);
  return res.json();
}
const renderActors = (actors) => {
  containerChildDelete()
  actors.map((actor) => {
    const actorsDiv = document.createElement("div");
    actorsDiv.classList.add('movie')
    actorsDiv.innerHTML = `<img class="movie-poster" src="${PROFILE_BASE_URL+ actor.profile_path}" alt="${actor.name}">
    <h3 class="movie-title" >${actor.name}</h3>`;
    actorsDiv.addEventListener("click", () => {
      // send each actor by its id to get details
      console.log(actor.id)
      actorDetails(actor.id);
    });
    CONTAINER.appendChild(actorsDiv);
  });
}

// to fetch and get the own actor information
const actorDetails = async (actorId) => {
  const actorInfo = await fetchActor(actorId);
  const actorMovies = await fetchActorMovies(actorId);
  renderActor(actorInfo, actorMovies.cast);
}
const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  return res.json();
}
const fetchActorMovies = async (actorId) => {
  const url2 = constructUrl(`person/${actorId}/movie_credits`);
  const res = await fetch(url2);
  return res.json();
}
const renderActor = (actorInfo, actorMovies) =>{
  let actorGenrder =" ";
  if (actorInfo.gender === 1) {
    actorGenrder = "Male"
  }else if(actorInfo.gender === 2) {
    actorGenrder = "Female"
  }else{
    actorGenrder = "Unknown"
  }
  
  CONTAINER.innerHTML = `
  <div class="actor-card">
        <h2 id="actor-name">${actorInfo.name}</h2>
        <div>
        <img src="${PROFILE_BASE_URL + actorInfo.profile_path}" alt="${actorInfo.name}">
       </div>
       <div class ="info"> 
        <p id="actor-gender"><b>Gender: </b> ${actorGenrder}</p>
        <p id="actor-popularity"><b>Popularity: </b> ${actorInfo.popularity} Minutes</p>
        <p id="actor-birthday"><b>Birthday: </b> ${actorInfo.birthday}</p>
        <p id="actor-deathday"> <b>Deathday: </b> ${actorInfo.deathday} </p>
        <h3>Biography:</h3>
        <p id="actor-biography">${actorInfo.biography}</p>
        <h3 class="Actor-Participation">Actor Participation</h3>
  </div>
  </div>

  <div class ="actor-img">
  
        <span>
          <img src="${BACKDROP_BASE_URL + actorMovies[0].poster_path}" alt="${actorMovies[0].title} poster">
          <h3>${actorMovies[0].title}</h3>
        </span>
        <span>
          <img src="${BACKDROP_BASE_URL + actorMovies[1].poster_path}" alt="${actorMovies[1].title} poster">
          <h3>${actorMovies[1].title}</h3>
        </span>
        <span>
          <img src="${BACKDROP_BASE_URL + actorMovies[3].poster_path}" alt="${actorMovies[2].title} poster">
          <h3>${actorMovies[2].title}</h3>
        </span>
        <span> 
          <img src="${BACKDROP_BASE_URL + actorMovies[4].poster_path}" alt="${actorMovies[3].title} poster">
          <h3>${actorMovies[3].title}</h3>
        </span>
        <span> 
          <img src="${BACKDROP_BASE_URL + actorMovies[5].poster_path}" alt="${actorMovies[4].title} poster">
          <h3>${actorMovies[4].title}</h3>
        </span>
  </div>`;
}

const about = document.getElementById('about')
about.addEventListener('click', () =>{
  
})