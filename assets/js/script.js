//variables to populate current date and days displayed in forecast
var currentDate = moment().format("L");

//List to append objects to and save to localStorage
var searchHistory;
//If there is no local storage yet, initialize searchHistory to an empty array
if (!JSON.parse(localStorage.getItem("searches"))) {
    searchHistory = [];
}
else {
    searchHistory = JSON.parse(localStorage.getItem("searches"));
}

//Default city name that can be modified depending on click
var cityName;

//Function to load the city search history from localStorage
var loadHistory = function() {
    var searches = JSON.parse(localStorage.getItem("searches"));

    //If there is nothing in localStorage, display "No Search History" to page
    if (!localStorage.getItem("searches")) {
        $(".history-heading").text("No Search History");
    }
    else {
        //Clear any prior elements from the page and re-load them with the most current history
        //from localStorage
        $(".history-btn").each(function() {
            $(this).remove();
        });

        //Rename history heading
        $(".history-heading").text("Search History:");

        //Create elements
        for (var i = 0; i < searches.length; i++) {
            var historyBtn = $("<button>").text(searches[i])
                .addClass("btn btn-light border border-secondary text-center w-100 shadow p-2 m-2 text-secondary history-btn");
            
            //Append to DOM
            $("#history-section").append(historyBtn);
        };
    }
}

//Function to send history to localStorage
var saveSearch = function(searchItem) {
    //If there is no duplicate, push
    searchHistory.push(searchItem);
    localStorage.setItem("searches", JSON.stringify(searchHistory));
}

//form handler...
var displayWeather = function(event) {
    event.preventDefault();

    //Make a server fetch request
    //endpoint: http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
    var apiKey = "d3004c2539e658963d01367f338739e6";
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid="+apiKey;

    fetch(requestURL).then(function(response) {
        response.json().then(function(data) {

            if (response.ok) {

                //Save the user's input to localStorage so it can be added to history
                if (searchHistory.includes(cityName)) {
                    localStorage.setItem("searches", JSON.stringify(searchHistory));
                }
                else {
                    saveSearch(cityName);
                }

                //Load history
                loadHistory();

                var lat = data.coord.lat;
                var lon = data.coord.lon;
                fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+apiKey).then(function(response2) {
                    response2.json().then(function(data2) {

                        //Current day's values
                        var date = currentDate;
                        var temp = data2.current.temp;
                        var wind = data2.current.wind_speed;
                        var humidity = data2.current.humidity;
                        var uvIndex = data2.current.uvi;
                        // console.log(data2.current.weather[0].icon);
                        var icon = data2.current.weather[0].icon;

                        //Create the parent div that will hold current city weather info
                        var mainWeatherDiv = $("#mainWeather");
                        if (mainWeatherDiv.children("div").children("h3").text() === "") {

                            //Define elements and their values...
                            var weatherHeaderDiv = $("<div>").addClass("bg-primary text-light w-100 text-center");
                            var mainHeader = $("<h3>").text(cityName).attr("id", "cityHeader");
                            var currentWeatherDate = $("<span>").text(date).attr("id", "currentDate");
                            var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+icon+"@2x.png").attr("id", "weatherIcon");
                            var currentWeatherList = $("<ul>")
                                .addClass("weather-data px-0 py-1");

                            //For each <li> element, generate its content and append to the <ul>
                            //temperature li...
                            var currentTempLi = $("<li>")
                            .addClass("weather-data-item d-flex align-items-center m-1 p-1 bg-light")
                            .attr("id", "temp-heading");
                            var tempLiContent = $("<h4>").addClass("weather-item-heading").text("Temperature:");
                            var tempSpan = $("<span>").addClass("weather-item-value mx-2")
                                .text(temp+" degrees Fahrenheit");
                            //Append h4 and span value to li
                            currentTempLi.append(tempLiContent);
                            currentTempLi.append(tempSpan);

                            //wind li...
                            var currentWindLi = $("<li>")
                                .addClass("weather-data-item d-flex align-items-center m-1 p-1 bg-light")
                                .attr("id", "wind-heading");
                            var windLiContent = $("<h4>").addClass("weather-item-heading").text("Wind Speed:");
                            var windSpan = $("<span>").addClass("weather-item-value mx-2")
                                .text(wind+" mph");
                            //Append h4 and span value to li
                            currentWindLi.append(windLiContent);
                            currentWindLi.append(windSpan);

                            //Humidity li...
                            var currentHumidityLi = $("<li>")
                                .addClass("weather-data-item d-flex align-items-center m-1 p-1 bg-light")
                                .attr("id", "humidity-heading");
                            var humidityLiContent = $("<h4>").addClass("weather-item-heading").text("Humidity:");
                            var humiditySpan = $("<span>").addClass("weather-item-value mx-2")
                                .text(humidity+"%");
                            //Append h4 and span value to li
                            currentHumidityLi.append(humidityLiContent);
                            currentHumidityLi.append(humiditySpan);                            

                            //UV-index li...
                            var currentUVLi = $("<li>")
                                .addClass("weather-data-item d-flex align-items-center m-1 p-1 bg-light")
                                .attr("id", "uv-heading");
                            var uvLiContent = $("<h4>").addClass("weather-item-heading").text("UV Index:");
                            var uvSpan = $("<span>").addClass("weather-item-value mx-2")
                                .text(uvIndex);
                            var uvColorSpan = $("<span>").addClass("uv-color px-2");

                            //Decide what styles to apply to the span
                            if (uvIndex < 2) {
                                uvColorSpan.addClass("uv-low").text("Low");
                            }
                            else if (uvIndex <= 5) {
                                uvColorSpan.addClass("uv-med").text("Med");
                            }
                            else if (uvIndex <= 7) {
                                uvColorSpan.addClass("uv-high").text("High");
                            }
                            else {
                                uvColorSpan.addClass("uv-danger").text("Danger");
                            }

                            //Append h4 and span value to li
                            currentUVLi.append(uvLiContent);
                            currentUVLi.append(uvSpan);
                            currentUVLi.append(uvColorSpan);

                            //Append list items to ul
                            currentWeatherList.append(currentTempLi);
                            currentWeatherList.append(currentWindLi);
                            currentWeatherList.append(currentHumidityLi);
                            currentWeatherList.append(currentUVLi);

                            //Append h3, date, and ul to the main weather div
                            weatherHeaderDiv.append(mainHeader);
                            weatherHeaderDiv.append(currentWeatherDate);
                            mainWeatherDiv.append(weatherHeaderDiv);
                            mainWeatherDiv.append(weatherIcon);
                            mainWeatherDiv.append(currentWeatherList);
                        }
                        else {
                            $("#cityHeader").text(cityName);
                            $("#weatherIcon").attr("src", "http://openweathermap.org/img/wn/"+icon+"@2x.png");
                            $("#temp-heading").children("span").text(temp+" degrees fahrenheit");
                            $("#wind-heading").children("span").text(wind+" mph");
                            $("#humidity-heading").children("span").text(humidity+"%");
                            $("#uv-heading").children("span").text(uvIndex);

                            //Don't forget to replace the class assigned to the uv index
                            //Decide what styles to apply to the span
                            if (uvIndex < 2) {
                                $("#uv-heading").children(".uv-color").addClass("uv-low").text("Low");
                            }
                            else if (uvIndex <= 5) { 
                                $("#uv-heading").children(".uv-color").addClass("uv-med").text("Med");
                            }
                            else if (uvIndex <= 7) {
                                $("#uv-heading").children(".uv-color").addClass("uv-high").text("High");
                            }
                            else {
                                $("#uv-heading").children(".uv-color").addClass("uv-danger").text("Danger");
                            }
                        }

                        //Loop through each of the next 5 days' forecast values and add them to
                        //the DOM in the forecast cards section
                        var forecastDiv = $("#forecast-card-div");

                        //check whether the cards already exist
                        if ($(".card").children("h4").text() === "") {
                            var forecastArray = data2.daily;
                            //We only want a 5 day forecast, but we could use other values.
                            for (var i = 0; i < 5; i++) {
                                
                                //Get values for each day's attributes
                                var dayTemp = forecastArray[i].temp.day;
                                var dayWind = forecastArray[i].wind_speed;
                                var dayHumid = forecastArray[i].humidity;
                                var dayIcon = (forecastArray[i].weather[0].icon);
                                
                                //Use the values to populate new elements
                                var cardDiv = $("<div>").addClass("card m-2 d-flex flex-column align-items-center w-100 w-lg-auto day-"+i);
                                
                                var cardTitle = $("<h4>").addClass("card-title bg-secondary text-white w-100 text-center shadow")
                                    .text(moment().add(i+1, "days").format("dddd, L"));

                                var cardBodyDiv = $("<div>").addClass("card-body");
                                var cardIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+dayIcon+"@2x.png");
                                var tempP = $("<p>").addClass("card-text day-temp").text(dayTemp+" degrees");
                                var windP = $("<p>").addClass("card-text day-wind").text(dayWind+" mph");
                                var humidP = $("<p>").addClass("card-text day-humid").text(dayHumid+"%");

                                //Append
                                cardBodyDiv.append(cardIcon);
                                cardBodyDiv.append(tempP);
                                cardBodyDiv.append(windP);
                                cardBodyDiv.append(humidP);
                                cardDiv.append(cardTitle);
                                cardDiv.append(cardBodyDiv);

                                forecastDiv.append(cardDiv);
                            }    
                        }
                        //If they do, simply modify their textContent
                        else {
                            $(".card").each(function(index) {
                                $(".day-"+index).children("h4").text(moment().add(index+1, "days").format("dddd"));
                                $(".day-"+index).children(".card-body").children(".day-temp").text(data2.daily[index].temp.day+" degrees");
                                $(".day-"+index).children(".card-body").children(".day-wind").text(data2.daily[index].wind_speed+" mph");
                                $(".day-"+index).children(".card-body").children(".day-humid").text(data2.daily[index].humidity+"%");
                            })
                        }
                    })
                })
            }
            else {
                alert("Invalid city name entered.  Please try again.");
            }
        })
    })
};

//load history from localStorage
loadHistory();

//form event listener...
$("main").on("submit", "#city-form", function(event) {
    cityName = $("#cityName").val().trim();
    displayWeather(event);
});

$("main").on("click", ".history-btn", function(event) {
    cityName = $(event.target).text();
    displayWeather(event);
});
