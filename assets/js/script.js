
//Function to create element data for the main weather section




//form handler...
var displayWeather = function(event) {
    event.preventDefault();
    //take the input string and trim

    //Make a server fetch request
    //endpoint: http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
    var cityInput = $("#cityName").val().trim();
    var apiKey = "d3004c2539e658963d01367f338739e6";
    var requestURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityInput+"&units=imperial&appid="+apiKey;

    fetch(requestURL).then(function(response) {
        response.json().then(function(data) {

            if (response.ok) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                console.log(lat, lon);
                fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+apiKey).then(function(response2) {
                    response2.json().then(function(data2) {
                        console.log(data2);

                        //Current day's values
                        var date = "01/29/2022"; //Maybe use moment.js?
                        var temp = data2.current.temp;
                        var wind = data2.current.wind_speed;
                        var humidity = data2.current.humidity;
                        var uvIndex = data2.current.uvi;
                        var icon = data2.current.weather[0].icon;
                        
                        console.log("date:", date);
                        console.log("temp:", temp);
                        console.log("wind:", wind);
                        console.log("humidity:", humidity);
                        console.log("uv index:", uvIndex);
                        console.log(icon);

                        //Create the parent div that will hold current city weather info
                        var mainWeatherDiv = $("#mainWeather");
                        if (mainWeatherDiv.children("h3").text() === "") {
                            console.log("No text content in main weather section.");

                            //Define elements and their values...
                            var mainHeader = $("<h3>").text(cityInput);
                            var currentWeatherDate = $("<span>").text(date);
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

                            //TODO: Determine what color coded class to apply based on UV index


                            //Append h4 and span value to li
                            currentUVLi.append(uvLiContent);
                            currentUVLi.append(uvSpan);

                            //Append list items to ul
                            currentWeatherList.append(currentTempLi);
                            currentWeatherList.append(currentWindLi);
                            currentWeatherList.append(currentHumidityLi);
                            currentWeatherList.append(currentUVLi);

                            //Append h3, date, and ul to the main weather div
                            mainWeatherDiv.append(mainHeader);
                            mainWeatherDiv.append(currentWeatherDate);
                            mainWeatherDiv.append(currentWeatherList);
                        }
                        else {
                            $("#mainWeather").children("h3").text(cityInput);
                            $("#temp-heading").children("span").text(temp+" degrees fahrenheit");
                            $("#wind-heading").children("span").text(wind+" mph");
                            $("#humidity-heading").children("span").text(humidity+"%");
                            $("#uv-heading").children("span").text(uvIndex);

                            //Don't forget to replace the class assigned to the uv index

                        }

                        //Loop through each of the next 5 days' forecast values and add them to
                        //the DOM in the forecast cards section
                        var forecastDiv = $("#forecast-card-div");
                        console.log(data2);

                        //check whether the cards already exist
                        if (forecastDiv.children("h4").text() === "") {
                            console.log("No forecast present.  Generating elements...");
                            var forecastArray = data2.daily;
                            //We only want a 5 day forecast, but we could use other values.
                            for (var i = 0; i < 5; i++) {
                                
                                //Get values for each day's attributes
                                var dayTemp = forecastArray[i].temp.day;
                                var dayWind = forecastArray[i].wind_speed;
                                var dayHumid = forecastArray[i].humidity;
                                //var dayIcon = forecastArray[i][0].icon;

                                //Use the values to populate new elements
                                var cardDiv = $("<div>").addClass("card mx-auto")
                                    .attr("style", "width: 18vw");
                                
                                var cardTitle = $("<h4>").addClass("card-title bg-secondary text-white text-center shadow")
                                    .text("Day "+i);

                                var cardBodyDiv = $("<div>").addClass("card-body");
                                var tempP = $("<p>").addClass("card-text").text(dayTemp+" degrees");
                                var windP = $("<p>").addClass("card-text").text(dayWind+" mph");
                                var humidP = $("<p>").addClass("card-text").text(dayHumid+"%");

                                //Append
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
                            console.log("Modifying forecast card contents...");
                        }
                        
                        /*
                        <div class="card mx-auto" style="width: 18vw">
                            <h4 class="card-title bg-secondary text-white text-center shadow">Monday</h4>
                            <div class="card-body">
                                <p class="card-text">Temperature</p>
                                <p class="card-text">Wind</p>
                                <p class="card-text">Humidity</p>
                            </div>
                            
                        </div>
                        <div class="card mx-auto" style="width: 18vw">
                            <h4 class="card-title bg-secondary text-white text-center shadow">Monday</h4>
                            <div class="card-body">
                                <p class="card-text">Temperature</p>
                                <p class="card-text">Wind</p>
                                <p class="card-text">Humidity</p>
                            </div>
                            
                        </div>
                        <div class="card mx-auto" style="width: 18vw">
                            <h4 class="card-title bg-secondary text-white text-center shadow">Monday</h4>
                            <div class="card-body">
                                <p class="card-text">Temperature</p>
                                <p class="card-text">Wind</p>
                                <p class="card-text">Humidity</p>
                            </div>
                            
                        </div>
                        <div class="card mx-auto" style="width: 18vw">
                            <h4 class="card-title bg-secondary text-white text-center shadow">Monday</h4>
                            <div class="card-body">
                                <p class="card-text">Temperature</p>
                                <p class="card-text">Wind</p>
                                <p class="card-text">Humidity</p>
                            </div>
                            
                        </div>
                        <div class="card mx-auto" style="width: 18vw">
                            <h4 class="card-title bg-secondary text-white text-center shadow">Monday</h4>
                            <div class="card-body">
                                <p class="card-text">Temperature</p>
                                <p class="card-text">Wind</p>
                                <p class="card-text">Humidity</p>
                            </div>
                            
                        </div>
                        */
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

}

//form event listener...
$("#city-form").on("submit", displayWeather);

//