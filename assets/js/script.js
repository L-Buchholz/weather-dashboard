//*Variables for the following functions

//ENTER HERE

//FUNCTIONS
var weather = function () {
  //Key: d087fc41244c27da84e39f7fd175d3d7
  //Calls five-day forecast URL
  var fiveDayForecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=Denver&units=imperial&appid=d087fc41244c27da84e39f7fd175d3d7";

  fetch(fiveDayForecastUrl)
    /*Collects data from five-day URL*/
    .then(function (responseFiveDay) {
      return responseFiveDay.json();
      //console.log here shows retrieval of data for [city wx -- defined in URL] as an object
    })
    .then(function (bodyFiveDay) {
      //console.log here shows "body" now represents the [city wx] object in json
      console.log(bodyFiveDay);
      //Retrieves city latitude coordinates
      var lat = bodyFiveDay.city.coord.lat;
      //Retrieves city longitude coordinates
      var lon = bodyFiveDay.city.coord.lon;
      //Calls current weather URL using above-defined latitude and longitude coordinates (concatenated as a string variable)
      var currentWeatherUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=d087fc41244c27da84e39f7fd175d3d7";
      //Returns the new request, collecting data from current weather URL
      return fetch(currentWeatherUrl);
    })
    .then(function (responseCurrent) {
      //Unpacks current weather for [inserted lat/long variables] object in json
      return responseCurrent.json();
      //console.log here shows retrieval of data for [inserted lat/long variables] as an object
    })
    .then(function (bodyCurrent) {
      //console.log here shows "body" now represents the [inserted lat/long variables] object in json
      console.log(bodyCurrent);
    });
};
weather();

//Event handlers
