//*Variables for the following functions

//ENTER HERE

//FUNCTIONS
//This defines a new function called renderForecast that accepts current weather variables
function renderCurrent(currentBody) {
  var weatherIconUrl = currentBody.current.weather[0].icon;
  //Pulls list of icons from OpenWeatherMap
  var iconCurrent =
    "https://openweathermap.org/img/wn/" + weatherIconUrl + "@2x.png";
  $("#current-weather-icon").attr("src", iconCurrent);

  var temp = currentBody.current.temp;
  $("#current-weather-temp").text(temp);
  var humidity = currentBody.current.humidity;
  $("#current-weather-humidity").text(humidity);
  var wind = currentBody.current.wind_speed;
  $("#current-weather-wind").text(wind);
  //SET UVI ICON TO A SEPARATE CLASS IN CSS
  var uvi = currentBody.current.uvi;
  $("#current-weather-uvi").text(uvi);
}
//This defines a new function called renderForecast that accepts forecast variables
function renderForecast(forecastBody) {
  var cityName = forecastBody.city.name;
  //Sets city name to current weather div, above
  $("#current-weather-city").text(cityName);
  //Using "filter" to set daily forecast based on 8:00 p.m. UTC (generally daytime in the US)
  var noonTimes = forecastBody.list.filter(function (listItem) {
    return listItem.dt_txt.includes("21:00");
  });
  console.log(noonTimes);
  //Assigns same function to both list items and HTML index
  noonTimes.forEach(function (listItem, index) {
    var date = listItem.dt_txt.split(" ")[0];
    $("#forecast-date-" + index).text(date);
    var iconUrl = listItem.weather[0].icon;
    //Pulls list of icons from OpenWeatherMap
    var icon = "https://openweathermap.org/img/wn/" + iconUrl + "@2x.png";
    $("#forecast-icon-" + index).attr("src", icon);
    var temp = listItem.main.temp;
    $("#forecast-temp-" + index).text(temp);
    var humidity = listItem.main.humidity;
    $("#forecast-humidity-" + index).text(humidity);
    var wind = listItem.wind.speed;
    $("#forecast-wind-" + index).text(wind);
  });
}
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
      /*IMPORTANT: This line now calls the above function using the generated five-day forecast info*/
      renderForecast(bodyFiveDay);
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
    .then(function (currentBody) {
      //console.log here shows "body" now represents the [inserted lat/lon variables] object in json
      console.log(currentBody);
      renderCurrent(currentBody);
    });
};
/*As the above function needs to be defined by the user-generated value (city name) entered into the event 
handler (below), it is NOT being called independently of it*/

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
