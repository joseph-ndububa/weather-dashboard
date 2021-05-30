$(".fc").hide()
var button = document.querySelector("#searchBtn");

function getCurrentWeather() {
    var city = document.querySelector("#city").value;
    var apiKey = '18bb77d524842388b83512049fe6a263';
    var currentUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
    if (city) {
        fetch(currentUrl)
            .then(data => data.json())
            .then(res => {
                var weather = res;
                var name = document.getElementById("name");
                var date = moment().format('MM/DD/YYYY');
                var iconId = weather.weather[0].icon;
                var icon = '<img src="http://openweathermap.org/img/w/' + iconId + '.png" />'
                name.innerHTML = weather.name + " " + "(" + date + ")" + icon;
                var tempC = weather.main.temp - 273.15;
                tempC = tempC.toFixed(0);
                var temp = document.getElementById("temp");
                temp.textContent = "Temp: " + tempC + "°C";
                var wind = document.getElementById("wind");
                wind.textContent = "Wind: " + weather.wind.speed + " MPH";
                var humidity = document.getElementById("humidity");
                humidity.textContent = "Humidity: " + weather.main.humidity + "%";
                var lat = weather.coord.lat;
                var lon = weather.coord.lon;
                fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,daily&appid=' + apiKey)
                    .then(data => data.json())
                    .then(res => {
                        console.log(res);
                        var uvi = Number(res.current.uvi);
                        var uvElement = document.createElement("p");
                        uvElement.textContent = uvi;
                        uvElement.style.display = "inline-block";
                        var uvIndex = document.getElementById('uv');
                        uvIndex.innerHTML = "UV Index: ";
                        if (uvi <= 2) {
                            uvElement.style.backgroundColor = "green";
                        }
                        else if (uvi > 2 && uvi <= 5) {
                            uvElement.style.backgroundColor = "yellow";
                        }
                        else if (uvi > 5) {
                            uvElement.style.backgroundColor = "red";
                        }
                        uvIndex.appendChild(uvElement);
                    })

            })


    }
}

function getForecast() {
    try {
        document.getElementById("forecastDiv").innerHTML = "";
        var city = document.querySelector("#city").value;
        var apiKey = '18bb77d524842388b83512049fe6a263';
        var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
        if (city) {
            fetch(forecastUrl)
                .then(data => data.json())
                .then(res => {
                    var forecast = res;
                    var forecastData = forecast.list;
                    $(".fc").show();
                    for (i in forecastData) {
                        if (i == 7 || i == 15 || i == 23 || i == 31 | i == 39) {
                            var card = document.createElement("div");
                            card.className = "card text-white bg-info mb-3 ml-3 mr-3 mt-4";
                            card.style.width = "10rem;"
                            var cardHeader = document.createElement("div");
                            cardHeader.class = "card-header";
                            var forecastDate = forecastData[i].dt_txt;
                            var date = forecastDate.slice(0, 10);
                            cardHeader.textContent = date;
                            var cardBody = document.createElement("div");
                            cardBody.className = "card-body";
                            var dayTemp = document.createElement("p");
                            dayTemp.className = "card-text";
                            var tempC = forecastData[i].main.temp - 273.15;
                            tempC = tempC.toFixed(0);
                            dayTemp.textContent = "Temp: " + tempC + "°C";
                            var dayWind = document.createElement("p");
                            dayWind.className = "card-text";
                            dayWind.textContent = "Wind: " + forecastData[i].wind.speed + " MPH";
                            var dayHumidity = document.createElement("p");
                            dayHumidity.className = "card-text";
                            dayHumidity.textContent = "Humidity: " + forecastData[i].main.humidity + "%";
                            var iconId = forecastData[i].weather[0].icon;
                            var iconUrl = 'http://openweathermap.org/img/w/' + iconId + '.png';
                            var newImage = document.createElement("img");
                            newImage.src = iconUrl;
                            card.appendChild(cardHeader);
                            cardHeader.append(newImage);
                            card.appendChild(cardBody);
                            cardBody.appendChild(dayTemp);
                            cardBody.appendChild(dayWind);
                            cardBody.appendChild(dayHumidity);
                            var forecastDiv = document.querySelector("#forecastDiv");
                            forecastDiv.appendChild(card);
                        }
                    }
                })
        }
    }
    catch (err) {
        console.log(err);
    }
}

button.addEventListener("click", function () {
    getCurrentWeather();
    getForecast();
})

