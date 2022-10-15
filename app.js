require("dotenv").config();

const express = require("express");
const hbs = require("hbs");


// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});


// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    //console.log(data);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );


// Our routes go here:
// Home route
app.get("/", (req, res, next) => {
  res.render("home.hbs");
});

// Artist-search route
app.get("/artist-search", (req, res, next) => {
  //console.log(req.query.artistName);

  const artistName = req.query.artistName
  
  spotifyApi
  .searchArtists(artistName)
  .then((response) => {
    //console.log(response.body.artists.items[0].images)  // Object of properties

    let imagesArr = [];
    let artistList = response.body.artists.items  // Array of objects

    artistList.forEach(eachArtist => {
      imagesArr.push(eachArtist.images[0])
    })

    res.render("artist-search-results.hbs", {
      artistList: artistList,
      imagesList: imagesArr
    })
  })
  .catch(err => next(err))

})


// Listening on Port 3000
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
