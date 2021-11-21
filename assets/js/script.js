//*Variables for the following functions

//ENTER HERE

//FUNCTIONS
var weather = function (cityName) {
  //Key: d087fc41244c27da84e39f7fd175d3d7
  //Calls five-day forecast URL using user-generated city name as a variable (defined in event handler)
  var fiveDayForecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&units=imperial&appid=d087fc41244c27da84e39f7fd175d3d7";

  fetch(fiveDayForecastUrl)
    /*Collects data from five-day URL*/
    .then(function (responseFiveDay) {
      return responseFiveDay.json();
      //console.log here shows retrieval of data for [city wx -- defined by user, via URL] as an object
    })
    .then(function (bodyFiveDay) {
      //console.log here shows "body" now represents the above [city wx] object in json
      console.log(bodyFiveDay);
      //Retrieves city latitude coordinates using five day API (not available in current API)
      var lat = bodyFiveDay.city.coord.lat;
      //Retrieves city longitude coordinates using five day API (not available in current API)
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
      //Unpacks current weather for [inserted lat/lon variables] object in json
      return responseCurrent.json();
      //console.log here shows retrieval of data for [inserted lat/lon variables] as an object
    })
    .then(function (bodyCurrent) {
      //console.log here shows "body" now represents the [inserted lat/lon variables] object in json
      console.log(bodyCurrent);
    });
};
/*As this function needs to be defined by the user-generated value (city name) entered into the event handler 
(below), it is NOT being called independently of it*/

//Event handlers

$("#city-form").on("submit", saveHandler);
function saveHandler(event) {
  //Keeps submit form from automatically clearing
  event.preventDefault();
  //Takes user-generated value from form
  var cityName = $("#city-name").val();
  //Checking whether cityName function is associated with different requests
  console.log(cityName);
  //Pulls weather forecast (function) by user-entered city name
  weather(cityName);
}

/*
var hourId = calendarRow.getAttribute("id");
//Selects the associated button for a given calendar row
var saveButton = $(calendarRow).find("button");
//Selects the associated text area for a given calendar row
var textArea = $(calendarRow).find("textarea");
var taskText = textArea.val().trim();
if (saveButton.is(event.target)) {
  //Save text to localStorage by row (hourId)
  localStorage.setItem(hourId, taskText);
}
}
*/
