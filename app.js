const express = require('express');
require('dotenv').config();
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
// const path = require("path");
// const hbs = require('hbs');
// const port = 3000;
const app = express();
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get("/", (req, res) => {
    res.render("index");
}) 

/* app.get('/artists-search',(req, res) => {
    const {artistName} = req.query;

    spotifyApi
        .searchArtists(artistName)
    .then(data => {
        console.log("The received data from the API:", {artists: items});

        const {items} = data.body.artists;

        res.render('artists-search-results', { data: data.body.artists.items });
    })
    
    .catch((err) => 
            console.log('The error while searching artists occurred: ', err)
    );

}) */

app.get('/artists-search',(req, res) => {
    const { artistName } = req.query; // we are querying the API passing on an artist's name
    spotifyApi
        .searchArtists(artistName)
    .then(data => {
        const {items} = data.body.artists;
        res.render('artists-search-results', { artists: items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
})

app.get("/albums/:id", (req, res) => {
    const {id} = req.params;
    
    spotifyApi
        .searchArtists(id)
        .then((data) => {
        const {items} = data.body;
        res.render('albums', { albums: items });
            console.log("The received data from the API: ", data.body.artists.items);
        })

        .catch((err) => 
            console.log('The error while searching for artist albums occurred: ', err)
        );

})

app.get("/tracks:tracks", (req, res) => {
    const {tracks} = req.params;

    spotifyApi
        .getAlbumTracks(tracks)
        .then((data) => {
            const {items} = data.body;

            res.render("tracks", {
                tracks : items})
            })
        

        .catch((err) => 
        console.log(`The error while searching for album's tracks occurred: `, err)
        );
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
