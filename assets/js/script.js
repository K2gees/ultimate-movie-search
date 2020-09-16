$(document).ready(function () {
    $("#search-container").submit(function (event) {
        searchName = $('#movie-name').val().trim()
        event.preventDefault()
        saveInput(searchName)
        getMovies(searchName)
        getVideo();
    });
});

function getMovies(searchName) {
    axios.get('https://www.omdbapi.com?s=' + searchName + '&apikey=e8893681')
        .then((response) => {
            console.log(response)
            var movies = response.data.Search
            var output = ''
            $.each(movies, (index, movie) => {
                output += `
            
            <div class="col xl3 l4 m6 s12">
                <div class="card large" >
                    <div class="card-image">
                        <img class="responsive-img" src="${movie.Poster}">
                    </div>
                    <div class="card-content">
                        <h5>${movie.Title}</h5>
                    </div>
                    <div class="card-action center">
                        <a onclick="movieSelected('${movie.imdbID}'); setMovieSelected('${movie.Title}')" class="btn btn-primary" href="#">Movie Details</a>
                    </div>
                </div>
            </div>
            
            `;
            });

            $('#movies').prepend(output)
        })
        .catch((error) => {
            console.log(error)
        })
}
// put user's text input request value in session storage
function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html'
    return false
}

function setMovieSelected(title) {
    sessionStorage.setItem('movie-title', title)
}

function saveInput(searchName) {
    sessionStorage.setItem("movie-name", searchName)

}
// send to movie.html page, pull user's search from session storage to show movie details
function getMovie() {
    var movieId = sessionStorage.getItem('movieId')
    axios.get('https://www.omdbapi.com?i=' + movieId + '&apikey=e8893681')
        .then((response) => {
            var movie = response.data
            console.log(response.data.Actors)
            var output = `
            <div class="row">
                <div class="col s12 m4">
                    <img src="${movie.Poster}" class="thumbnail">
                </div>
                <div class="col s12 m8">
                    <h3>${movie.Title}</h3>
                        <ul class="list-group">
                            <li class="list-group-item">Genre:${movie.Genre}</li>
                            <li class="list-group-item">Released:${movie.Released}</li>
                            <li class="list-group-item">IMDB Rating:${movie.imdbRating}</li>
                            <li class="list-group-item">Director:${movie.Director}</li>
                            <li class="list-group-item">Writer:${movie.Writer}</li>
                            <li class="list-group-item">Actors:${movie.Actors}</li>
                        </ul>
                </div>
            </div>
            <div class="row">
                <div class="well">
                    <h3>Plot</h3>
                    ${movie.Plot}
                </div>
            </div>

            <div class="col s12">
            <!-- Trailer to latest movie from Youtube -->
            <h3>Trailer</h3>
            <div class="video-container">
                <iframe src="" allow="autoplay" frameborder="0"></iframe>
            </div>
            </br>
            <hr>
            </br>
                    <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class=btn btn-primary">View IMDB Page</a>
                    <a href="landing.html" class="btn btn-default">Back to Search Page</a>
        `;
            $('#movie').html(output)
        })
        .catch((error) => {
            console.log(error)
        })
}
// $("#search-container").submit(function (event) {
//     event.preventDefault();
//     var searchMovieNameEl = sessionStorage.getItem("movie-name") + " newest trailer";

//     getVideo(searchMovieNameEl);
// });


function getVideo() {
    console.log("running get video")
    var query = sessionStorage.getItem("movie-title") + " trailer";
    $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        data: {
            // key1 = AIzaSyB7jf8WLIKIDfZ5iuVWr7m3McWZMoWmYE0
            // key2 = AIzaSyAgp2vMl59orNeECqvXmizUYVk9HO4dABo
            key: 'AIzaSyB7jf8WLIKIDfZ5iuVWr7m3McWZMoWmYE0',
            q: query,
            part: 'snippet',
            maxResults: 1,
            type: 'video',
            videoEmbeddable: true,
        },
        success: function (data) {
            console.log(data)
            embedVideo(data)
        },
        error: function (response) {
            console.log("Request Failed");
        }
    });
}

function embedVideo(data) {
    $('iframe').attr('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId + "?autoplay=1&;enablejsapi=1")
}
