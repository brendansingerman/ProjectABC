// globally scoped var's
// =====================================================================
var omdbKey = "38a65d1a";
var nytKey = "F65iUnYMHIuXFqyxD64typ0dIZG0gqFF";
var inputForm = document.getElementById("input-form");
var movieDiv = document.getElementById("movie");
var reviewsDiv = document.getElementById("reviews");
var savedMovies = document.querySelector("#saved-movies");
var watchList = document.querySelector("#watchlist");
var list = [];

getLocalStorage();
renderList();

// write a function which initializes code from event listener on submit button
// =====================================================================
function init(event) {
  event.preventDefault();
  //   targets element from html with id of "input-field"
  var inputField = document.getElementById("input-field");
  //   gets input value from search bar
  var movieTitle = inputField.value;
  // if search bar input is empty, stop function
  if (movieTitle === "") {
    return;
  }
  //   sends http request to omdb for movie data, passing in movieTitle as an argument
  omdbDataRequest(movieTitle);
  nytDataRequest(movieTitle);
  //   resets search bar value to an empty string
  inputField.value = "";
}

// write a function which makes a fetch/http request to the OMDB API for data
// =====================================================================
function omdbDataRequest(movie) {
  // url endpoint
  var omdbUrl = "http://www.omdbapi.com/?t=" + movie + "&apikey=" + omdbKey;

  fetch(omdbUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   stores desired response data in var's
      var title = data.Title;
      var year = data.Year;
      var rated = data.Rated;
      var runtime = data.Runtime;
      var genre = data.Genre;
      var dir = data.Director;
      //   pass data into function call as arguments
      createMovieDataElements(title, year, rated, runtime, genre, dir);
    });
}

// write a function which dynamically creates elements to display
// response data from OMDB request
// =======================================================================
function createMovieDataElements(title, year, rated, runtime, genre, director) {
  // dynamically create elements
  var movieTitle = document.createElement("h2");
  var movieYear = document.createElement("p");
  var movieRated = document.createElement("p");
  var movieRuntime = document.createElement("p");
  var movieGenre = document.createElement("p");
  var movieDir = document.createElement("p");
  var taskbutton = document.createElement("button");

  // set content on elements
  movieTitle.textContent = title;
  movieYear.textContent = "Year: " + year;
  movieRated.textContent = "Rating: " + rated;
  movieRuntime.textContent = "Runtime: " + runtime;
  movieGenre.textContent = "Genre: " + genre;
  movieDir.textContent = "Director: " + director;
  taskbutton.textContent = "Save to Watchlist";
  // dynamically set id and class attributes
  taskbutton.setAttribute("id", "save-button");
  taskbutton.setAttribute(
    "class",
    "btn hover:cursor-pointer inline-block px-8  py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out my-5"
  );
  movieTitle.setAttribute("class", "mx-20 text-3xl");

  // remove existing data before append, pass in parent element as argument
  removeOmdbBeforeAppend(movieDiv);

  // append elements to document
  movieDiv.appendChild(movieTitle);
  movieDiv.appendChild(movieYear);
  movieDiv.appendChild(movieRated);
  movieDiv.appendChild(movieRuntime);
  movieDiv.appendChild(movieGenre);
  movieDiv.appendChild(movieDir);
  movieDiv.appendChild(taskbutton);
}

// write a function which removes previously searched data from document
// so that incoming search data replaces previously searced data and does
// not append below it
// =====================================================================
function removeOmdbBeforeAppend(div) {
  while (div.hasChildNodes()) {
    div.removeChild(div.firstChild);
  }
}

// write a function which makes a fetch/http request to the NYT API
// =====================================================================
function nytDataRequest(movie) {
  // url endpoint
  var nytUrl =
    "https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=" +
    movie +
    "&api-key=" +
    nytKey;

  fetch(nytUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // store specified array from results in var
      var dataResults = data.results;
      // pass array into function to create/append results to document
      createReviewDataElements(dataResults);
    });
}

// write a function which dynamically creates elements to display
// response data from NYT request
// =====================================================================
function createReviewDataElements(array) {
  // empty div prior to append
  removeOmdbBeforeAppend(reviewsDiv);
  for (i = 0; i < array.length; i++) {
    // dynamically create elements
    var nytTitle = document.createElement("h2");
    var nytLink = document.createElement("a");
    var nytDiv = document.createElement("div");
    var nytSummary = document.createElement("p");
    var link = array[i].link.url;
    // set attributes/content of url/link results to append to document
    nytLink.setAttribute("href", link);
    nytLink.setAttribute("class", "underline");
    nytLink.setAttribute("target", "_blank");
    nytLink.textContent = "Read review";

    nytDiv.setAttribute("class", "text-indigo-500 cust-fnt-sz mb-5");
    nytDiv.appendChild(nytLink);

    // set content on elements
    nytTitle.textContent = "Title: " + array[i].display_title;
    nytSummary.textContent = "Summary: " + array[i].summary_short;

    nytTitle.setAttribute("class", "text-3xl");
    //append to document
    reviewsDiv.appendChild(nytTitle);
    reviewsDiv.appendChild(nytSummary);
    reviewsDiv.appendChild(nytDiv);
  }
}

// write a function which gets local storage if it exists
// =====================================================================
function getLocalStorage() {
  // parse data from localstorage as json
  var storedList = JSON.parse(localStorage.getItem("list"));
  if (storedList !== null) {
    list = storedList;
  }
}

// write a function which stores movies to local storage
// =====================================================================
function sendToLocalStorage(event) {
  // event delegation on dynamically created button
  if (event.target && event.target.id == "save-button") {
    // get title from div to add to var list
    var title = movieDiv.children[0].textContent;
    // if movie to be saved is already in watchlist, stop function
    for (i = 0; i < list.length; i++) {
      if (list[i] === title) {
        return;
      }
    }
    // update var list by getting localstorage, then push new title into list
    // then update localstorage and append to document with renderLIst function
    getLocalStorage();
    list.push(title);
    localStorage.setItem("list", JSON.stringify(list));
    renderList();
  }
}
// write a function which dynamically displays watchlist
// =====================================================================
    
function renderList() {
    var watchListTitle = document.getElementById("listid");
    if (list.length !== 0) {
    watchListTitle.hidden = false;
    }
    else
    {
      watchListTitle.hidden = true;
    }

    // empties unordered list from html prior to append
  savedMovies.innerHTML = ""; //List of movies
  // loop through var list and create/append for each item in list
  for (var i = 0; i < list.length; i++) {
    var movie = list[i];
    // create/set content for each index of i
    var li = document.createElement("li");
    li.textContent = movie;
    li.setAttribute("data-index", i);
    li.setAttribute("class", "bg-blue-200 rounded-md mx-6 px-3 py-1 mb-2");

      var button = document.createElement("button");
    button.textContent = "X";
    button.setAttribute(
      "class",
      "float-right ml-2 px-1 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm text-center mr-2 mb-2 dark:bg-red-500 dark:hover:bg-red-700 dark:focus:ring-red-900"
    );
    // append to document
    li.appendChild(button);
    savedMovies.appendChild(li);
  }
  // }
}

// write a function which deletes movies from watchlist
// =====================================================================
function deleteMovie(event) {
  // of multiple li items in document, select the li which tirggered the
  // the event on click
  var element = event.target;
  // if event matches element of button
  if (element.matches("button") === true) {
    // Get its data-index value and remove the li element from watchlist
    var index = element.parentElement.getAttribute("data-index");
    list.splice(index, 1);
    // update localstorage and append new list
    localStorage.setItem("list", JSON.stringify(list));
    getLocalStorage();
    renderList();
  }
}

// create an event listener for search bar submit form from document
// =====================================================================
// calls init function upon submit button
inputForm.addEventListener("submit", init);

// using event delegation, create an event listener for a button which
// saves movies to a watchlist
// =====================================================================
movieDiv.addEventListener("click", sendToLocalStorage);

// using event delegation, create an event listener for a button "X"
// which deletes movies from watchlist
// =====================================================================
savedMovies.addEventListener("click", deleteMovie);
