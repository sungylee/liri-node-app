
//LIRI BOT Homework 10

//set any environment variable with the dotenv package
//per instruction from HW  and Bank Example

// fs is a core Node package for reading and writing files
var fs = require("fs");

//request  required
var request = require("request");

//moment  required
var moment = require("moment");

//Spotify API and location to key
require("dotenv").config();
const keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Variable to capture two inputs action and value
var action = process.argv[2]; //command switch
var value = process.argv[3];  //search value

const divider = "\n************************************************************************************\n\n";

//used from Bank exercise activty example

// node liri.js concert-this Beyonce
// node liri.js spotify-this-song
// node liri.js movie-this 
// node liri.js do-what-it-says

switch(action) { 
case "concert-this":
  concertThis(value);
  break;
  
case "spotify-this-song":
  spotifyThisSong(value);
  break;

case "movie-this":
  movieThis(value);
  break;

case "do-what-it-says":
  doWhatItSays();
  break;
};


//example from tv-better.js exercise  save to local file
function saveFile(content){
  fs.appendFile("log.txt", content, function(err) {
    if (err) throw err;
    console.log(content);
  });
}


//search and return concert-this
//node liri.js concert-this Beyonce
function concertThis(value) {

  //https://app.swaggerhub.com/api/Bandsintown/PublicAPI/3.0.0

  if (value == null ) {
    value = "Beyonce";
  }

  request("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp", function(error, response, body) {

  // If there were no errors and the response code was 200 (i.e. the request was successful)...
  // console.log("Date of the Event, Venue Name, Venue City, Venue region, Venue Country")
    
  if (!error && response.statusCode === 200) {
    results = JSON.parse(body);
    //console.log(results);
    console.log(results.length);
    console.log("*******Date************Venue*************** Location********");
    
    //forEach loop option
    // results.forEach(function(event) {
    // var date =event.datetime;
    // var newDate = (moment(date).format("MM/DD/YYYY hh:mm a"));
    //   console.log(`${newDate} ` + `${event.venue.name} ` + `${event.venue.city} ${event.venue.region} ${event.venue.country}`);
       
    //Worked with Tutor Edna  use moment to convert format include date and time
     for(var i=0; i < results.length; i++) {
    
       var date =results[i].datetime;
       var formattedDataArray = [];
       var newDate = (moment(date).format("MM/DD/YYYY hh:mm a"));
         //console.log(newDate + " " + results[i].venue.name +" " + results[i].venue.city + " " + results[i].venue.region + " " + results[i].venue.country);

        formattedData = [newDate + " " + results[i].venue.name +", " + results[i].venue.city + " " + results[i].venue.region + " " + results[i].venue.country].join("\n");
        //.join("\n");
        //formattedDataArray.push(formattedData);
        //saveFile(formattedData + divider);  
        saveFile(formattedData);  
   
    }
    
    //console.log("********************************************************");
  };
});



}

//search and return spotify-this-song
// node liri.js spotify-this-song
function spotifyThisSong(value) {
  if (value == null ) {
    value = "The Sign";
  }
  
  //https://www.npmjs.com/package/node-spotify-api  example API used
  spotify.search({ type: 'track', query: value }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var results = data.tracks.items;
    // showData ends up being the string containing the show data we will print to the console
    //example from tv-better.js exercise 
    formattedData = [
    "Artist(s): " + results[0].artists[0].name,
    "Song Name: " + results[0].name,
    "Preview Link: " + results[0].preview_url,
    "Album: " + results[0].album.name,
    ].join("\n\n");
  //  console.log(output);
    saveFile(formattedData + divider);  
  });
    

}

//search and return movie-this
// node liri.js movie-this 
function movieThis(value) {
  if (value == null ) {
    value = "Mr. Nobody";
  }

  request("http://www.omdbapi.com/?t="+value+"&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If there were no errors and the response code was 200 (i.e. the request was successful)...
  if (!error && response.statusCode === 200) {

    var x= 0;
    //This one is innner loop to capture Rotten Tomatoes rating and capture this value and once capture break out
    for (x in JSON.parse(body).Ratings) {
      if(JSON.parse(body).Ratings[x].Source === "Rotten Tomatoes") {
        rottenRating = JSON.parse(body).Ratings[x].Value;
        break;
    } else  {
       rottenRating = "No Rotten Tomato rating";
    }
  }
     formattedData = [
    "Title of the movie                   :  " + JSON.parse(body).Title,
    "Year the movie came out              :  " + JSON.parse(body).Year,
    "IMDB Rating of the movie             :  " + JSON.parse(body).imdbRating,
    "Rotten Tomatoes Rating of the movie  :  " + rottenRating,
    "Country where the movie was produced :  " + JSON.parse(body).Country,
    "Language of the movie                :  " + JSON.parse(body).Language,
    "Plot of the movie                    :  " + JSON.parse(body).Plot,
    "Actors in the movie                  :  " + JSON.parse(body).Actors
    ].join("\n");
      //  console.log(output);
    saveFile(formattedData + divider);  
  }
});


}

//read from file and return 
// node liri.js do-what-it-says
// There are three random files that be used to test. 
function doWhatItSays() {

// read random#.txt files as utf8
fs.readFile("random.txt", "utf8", function(error, data) {
  // If the code experiences any errors it will log the error to the console.
  if (error) {
    return console.log(error);
  }
  // We will then print the contents of data
  console.log(data);
  // Then split it by commas (to make it more readable)
  var dataArr = data.split(",");
  var action =dataArr[0]; //value for action concert-this, spotify-this-song, movieThis
  var value = dataArr[1]; //value for search

  switch(action) { 
    case "concert-this":
      value = value.substr(1).slice(0, -1);   //Added to remove char from begining and end for concert search as without it search fails
      concertThis(value);
      break;
    case "spotify-this-song":
      spotifyThisSong(value);
      break;
    case "movie-this":
      movieThis(value);
      break;
      
  };

});


}

