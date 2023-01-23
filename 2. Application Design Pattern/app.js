const autocompleteConfig = {
  //display individual movie in the dropdown list
  renderOption(movie) {
    return `<img src="${movie.Poster === "N/A" ? "" : movie.Poster}">
    ${movie.Title} (${movie.Year})`;
  },
  //backfill when the user clicks on the movie
  inputValue(movie) {
    return movie.Title;
  },
  //fetching the data from the API
  async fetchData(searchMovie) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "81dd227a",
        s: searchMovie,
      },
    });

    if (response.data.Error) {
      return []; //in the real world, would give the user some sort of error message
    }
    return response.data.Search; //"Search" here is the property returned by this particular API
  },
};
//the left side autocomplete search
createAutocomplete({
  ...autocompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  //when user selects a movie from the dropdown list
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});
//the right side autocomplete search
createAutocomplete({
  ...autocompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  //when user selects a movie from the dropdown list
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary", "right"));
  },
});

let leftMovie;
let rightMovie;
//Helper function to select the movie from the dropdown menu
const onMovieSelect = async (movie, summaryEl, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "81dd227a",
      i: movie.imdbID,
    },
  });

  summaryEl.innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};
//Helper function to run the comparison between the two selected movies
const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  leftSideStats.forEach((leftStat, idx) => {
    const rightStat = rightSideStats[idx];

    const leftSideValue = +leftStat.dataset.value;
    const rightSideValue = +rightStat.dataset.value;

    if (rightSideValue < leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

//Helper function to extract details about the selected movie
const movieTemplate = (movieDetails) => {
  const dollars = +movieDetails.BoxOffice.replace(/[,\$]/g, "");
  const metascore = +movieDetails.Metascore;
  const imdbRating = +movieDetails.imdbRating;
  const imdbVotes = +movieDetails.imdbVotes.replace(/,*/g, "");

  const awards = movieDetails.Awards.split(" ").reduce((prev, word) => {
    const value = +word;
    if (isNaN(value)) {
      return prev;
    } else {
      return (prev += value);
    }
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetails.Title}</h1>
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
