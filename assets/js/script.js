
//Function to create element data for the main weather section




//form handler...

//take the input string and trim

//Make a server fetch request
//endpoint: http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
var cityInput = "Phoenix";
var apiKey = "d3004c2539e658963d01367f338739e6";
var requestURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityInput+"&units=imperial&appid="+apiKey;

fetch(requestURL).then(function(response) {
    response.json().then(function(data) {

        if (response.ok) {
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            console.log(lat, lon);
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid="+apiKey).then(function(response2) {
                response2.json().then(function(data2) {
                    console.log(data2);
                })
            })
        }
        else {
            alert("Invalid city name entered.  Please try again.");
        }
    })
})

//If the fetch is successful, push to localStorage

//Take the city name and append to the search history section as a clickable link

//Add an event listener to that button

//Call the handler for the main weather section

//form event listener...

//