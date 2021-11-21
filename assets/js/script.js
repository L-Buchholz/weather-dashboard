//FUNCTIONS
//This defines a new function called renderForecast that accepts current weather variables
function renderCurrent(currentBody) {
  /*Extrapolating current date using the OpenWeather API, accounting for UTC offset*/
  var currentDate = currentBody.current.dt + currentBody.timezone_offset;
  //Sets formatting to UTC using JQuery, accounting for conversion from milliseconds to seconds
  var localDate = new Date(currentDate * 1000)
    .toUTCString()
    .split(" ")
    .slice(0, 4)
    .join(" ");
  $("#current-weather-date").text(localDate);
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
  //If UVI is less than 4, notification is GREEN
  if (uvi < 4) {
    $("#current-weather-uvi").css({
      color: "white",
      padding: "1px",
      background: "green",
    });
    //If UVI is between 4 and 6, notification is YELLOW
  } else if (uvi < 6) {
    $("#current-weather-uvi").css({
      color: "black",
      padding: "1px",
      background: "yellow",
    });
    //If UVI is above 6, notification is RED
  } else {
    $("#current-weather-uvi").css({
      color: "white",
      padding: "1px",
      background: "red",
    });
  }
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

//Saves current weather data to localStorage
//function saveCurrent() {}

//Saves forecast data to localStorage
function saveForecast(forecastBody) {
  //Retrieves all city data from Open Weather and names it a string
  var cityData = localStorage.getItem("all-data");
  var storedData = JSON.parse(cityData);
  //Sets "{}" as an object: default response before user enters ANY data
  if (storedData == null) {
    storedData = {};
  }
  var cityNameStored = forecastBody.city.name;
  if (!storedData[cityNameStored]) {
    //Sets "{}" as an object: default response before user enters specific city name
    storedData[cityNameStored] = {};
  }
  storedData[cityNameStored].forecast = forecastBody;
  localStorage.setItem("all-data", JSON.stringify(storedData));
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
      /*IMPORTANT: This line now saves the generated five-day forecast info to localStorage*/
      saveForecast(bodyFiveDay);
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

//Event handler

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
