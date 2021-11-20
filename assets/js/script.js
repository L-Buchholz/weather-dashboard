//*Variables for the following functions

//ENTER HERE

//FUNCTIONS
var weather = function () {
  //Key: d087fc41244c27da84e39f7fd175d3d7
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=Denver&appid=d087fc41244c27da84e39f7fd175d3d7";

  fetch(requestUrl)
    /*Collects data from URL*/
    .then(function (response) {
      return response.json();
    });
};
console.log(requestUrl);
